const glob = require('glob') 
const path = require('path')
const htmlWebpackPlugin = require('html-webpack-plugin')


//我们放页面的路径
const pagePath = path.join(__dirname,'../src/pages/')
//寻找子目录下的index 一个子目录代表一个页面
const htmlPath = path.join(pagePath,'/*/*.html')
//寻找子目录下的js 作为entrie
const jsPath = path.join(pagePath,'/*/*.js')


//返回文件名称
//ext 需要去除的部分 比如传入a.html 需要去除.html 可以传入.html
const getBaseName = function (filePath,ext = ""){
    return path.posix.basename(filePath,ext)
}
//返回结尾文件类型 比如传入a.html 返回.html
//如果传入的filePath不带. 则返回空
const getExtname = function (filePath){
    return path.extname(filePath)
}
//找到相应规则的文件
const getFilePaths = function (globPath){
    return glob.sync(globPath) || []
}
//文件映射 { fileName:filePath }
const getFileMap = function (globPath){
    const files = getFilePaths(globPath)
    return files.reduce((map,filePath) => {
        const name = getBaseName(filePath,getExtname(filePath))
        map[name] = filePath
        return map
    },{})
}

//返回多entrie
const entries = function (entriePath = jsPath){
    return getFileMap(entriePath)
}
const entriesHtml = function (){
    return getFileMap(htmlPath)
}
const entriesJS = function (){
    return getFileMap(jsPath)
}

const entriesExists = function (){
    let htmlArray = getFilePaths(htmlPath)
    let result = {}

    htmlArray.forEach(htmlPath => {
        let fileName = getBaseName(htmlPath)
        let name = getBaseName(htmlPath,'.html')
        let jsBasePath = htmlPath.replace(fileName,'')
        let jsPaths = glob.sync(path.join(jsBasePath,'/*.js'))
        if(jsPaths.length){
            result[name] = {
                name,
                htmlPath,
                jsPath:jsPaths[0]
            }
        }
    })

    return result
}

//返回webpack的htmlPlugin
const htmlPlugin = function (filePath = htmlPath){
    const plugins = []
    const htmls = getFilePaths(filePath)
    htmls.forEach(filePath => {
        let baseName = getBaseName(filePath)
        let name = getBaseName(filePath,getExtname(baseName))
        let to = path.join(process.cwd(),`./dist/${baseName}`)
        let isPRD = process.env.NODE_ENV === 'production'

        let config = {
            filename: to,
            template: filePath,
            chunks: ['manifest', 'vendor', name],
            inject: true,
        }

        //生产
        if (isPRD){
            config = Object.assign(config,{
                minify: {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true
                    // more options:
                    // https://github.com/kangax/html-minifier#options-quick-reference
                },
                // necessary to consistently work with multiple chunks via CommonsChunkPlugin
                chunksSortMode: 'dependency'
            })
        }
        plugins.push(new htmlWebpackPlugin(config))
    })

    return plugins
}

module.exports = { getBaseName,getExtname,getFilePaths,entriesHtml,entriesJS,entriesExists,entries,htmlPlugin }






