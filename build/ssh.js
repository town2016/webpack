const ssh = require('ssh2')
const glob = require('glob') 
const async = require('async')
const fs = require('fs')
const path = require('path')
const Client = ssh.Client

const connection = function (connectionConfig){
    let conn = new Client()
    let resolve,reject 
    conn
        .on('ready',() => {
            console.log("\r\nconnnection ready::",connectionConfig.host)
            resolve(conn)
        })
        .on('end',() => {
            console.log('\r\nClient disconnected')
        })
        .on('error',err => {
            console.log('\r\nClient error::',err)
            reject(err)
        })
        .connect(Object.assign({ readyTimeout: 5000 },connectionConfig))
    return new Promise((res,rej) => { resolve = res,reject = rej })
}

const getSFTP = function (connection){
    return new Promise((resolve,reject ) => {  
        connection.sftp((err,sftp) => {
            if(err) return reject(err)
            resolve(sftp)
        })
    })
}

const upload = function (file,remotePath,sftp){
    return new Promise((resolve,reject) => { 
        console.log(file)
        sftp.fastPut(file, remotePath,(err,result) => {
            if(err){ return reject(err) }
            resolve(result)
        })
    })
}

const sftp_stat = function (sftp,dirPath){
    let resolve,reject
    sftp.stat(dirPath, function(err, attr) {
        if(err) { return reject(err) }
        resolve(attr)
    })
    return new Promise((res,rej) => { resolve = res,reject = rej })
}

//根据平台 切换路径
const unixy = function (filepath){
    if (process.platform === 'win32') {
        return filepath.replace(/\\/g, '/')
    }
    return filepath
}

const sftp_mkDir = function (sftp,dirPath,attrs,callback){
    let dirs = []
    let exists = false

    let mkdir = function(dir, callback) {
        sftp.mkdir(dir, attrs, callback)
    }

    async.until(() => exists, function(done) {
        sftp_stat(sftp,dirPath).then(() => {
            exists = true
            done()
        }).catch(err => {
            dirs.push(dirPath)
            dirPath = path.dirname(dirPath)
            done()
        })
      }, function(err) {
        if (err) {
          callback(err)
        } else {
          async.eachSeries(dirs.reverse(), mkdir, callback)
        }
      })

}   

const uploadFiles = function (files,remotePath,connectionConfig){
    if(files.indexOf('*') > -1){
        files = glob.sync(files) || []
    }
    if(files instanceof Array && files.length <= 0){ return Promise.reject() }
    if(typeof files === 'string'){ files = [null,files] }
    files.shift()
    const distPath = unixy(path.join(__dirname, '../dist/'))
    let connObj,resolve,reject
    connection(connectionConfig).then(conn => {
        return getSFTP((connObj = conn))
    }).then(sftp => {
        let length = files.length
        async.eachSeries(files,(file,callback) => {
            const stat = fs.statSync(file)
            const absolutePath = file.replace(distPath,'')
            const remote = remotePath + absolutePath
            length = length - 1
            if(stat.isDirectory()){  
                return sftp_mkDir(sftp,remote,undefined,err => {
                    callback(err)
                })
            }
            upload(file,remote,sftp).then(() => {
                if(length <= 0){  
                    connObj.end() 
                    resolve()
                }
                callback(null)
            }).catch(err => {
                console.log(err)
                callback(err)
            })
        },err => {
            connObj.end()
            reject(err)
        })
    })
    return new Promise((res,rej) => { resolve = res,reject = rej })
}

module.exports = { uploadFiles }
