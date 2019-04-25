'use strict'
require('./check-versions')()

const inquirer = require('inquirer')
const path = require('path')
const ora = require('ora')
const chalk = require('chalk')
const pageUtils = require('./page-utils')
const config = require('../config')
const build = require('./build')
const merge = require('webpack-merge')
const rm = require('rimraf')
const sshHelper = require('./ssh')
const project = pageUtils.entriesExists()

//和cmd交互
const prompt = promptList => {
	return new Promise((resolve,reject) => {
		inquirer.prompt(promptList).then(resolve).catch(reject)
	})
}

//选择项目
const projectChoice = () => {
	const all = 'All project'
	const promptList = [{
	  type: 'list',
		message: '请选择编译一个项目:',
		name: 'project',
		choices: [all,...Object.keys(project)],
		filter(val) {
			if(val === all){ return project }
			return { [val]:project[val] }
		}
	}]
	return prompt(promptList)
}
//选择是否上传stg
const uploadChoice = () => {
	const promptList = [{
		type:'list',
		name:'stg',
		message: '是否自动上传到测试服务器:',
		choices:['YES','NO'],
	}]
	return prompt(promptList)
}

//清空特定文件夹
const clear = dirPath => {
	return new Promise((resolve,reject) => {
		rm(path.join(dirPath), err => {
			if (err) return reject(err)
			resolve()
		})
	})
}

//生成 webpack 的配置文件
const buildConfig = (project,key) => {
	let options = {
		build:{
			index:path.resolve(config.build.assetsRoot,key,'index.html'),
			assetsRoot:path.resolve(config.build.assetsRoot,key),
			htmlPath:project[key].htmlPath,
			entry:project[key].jsPath
		}
	}
	return merge(config,options)
}

//执行webpack任务
const buildProject = config => {
	return build(config).then(res => {
		console.log(chalk.cyan(`\n${config.PROJECT_KEY}构建成功.\n`))
		return Promise.resolve(res)
	})
}

//执行shell命令
const command = cmd => {
	return new Promise((resolve,reject) => {
		client.scp({
			host: '192.169.28.61',
			username: 'root',
			password: 'Passw0rd',
			path: '/data/vhosts/'
		}, '../dist/', reject)
	})
}

//开始执行任务
const start = (() => {
	const env = String(process.env.BUILD_ENV).toUpperCase()
	let spinner = ora('开始构建...')
	let project,isUpload

	projectChoice()
		.then(answers => {
			project = answers.project
			return env === 'STG'? uploadChoice() : Promise.resolve({ stg:"NO" })
		})
		// .then(answers => {
		// 	isUpload = answers.stg
		// 	return Promise.resolve()
		// })
		.then(answers => {
			isUpload = answers.stg
			return clear(config.build.assetsRoot)
		})
		.then(() => {
			spinner.start()
			return Promise.all(Object.keys(project).map(key => {
				const config = buildConfig(project,key)
				config.PROJECT_KEY = key
				return buildProject(config)
			}))
		})
		.then(() => {
			spinner.stop()

			//停止转菊花
			if(isUpload === 'NO'){ return Promise.reject() }
			sshHelper.uploadFiles(path.join(__dirname, '../dist/') + '**/**','/data/vhosts/',{
				host: '192.169.28.61',
				port: 22,
				username: 'h5build',
				password: 'sendPassw0rd'
			})
			.then(() => {
				console.log("上传成功！")
			}).catch(err => {
				console.log("上传错误::",err)
				spinner.stop()
			})

		})
		.catch(error => {
			spinner.stop()
			console.log(error || "")
		})

})()