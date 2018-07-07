#!/usr/bin/env node

const path = require('path')
const fs = require('fs-extra')
const chalk = require('chalk')
const inquirer = require('inquirer')
const emptyDir = require('empty-dir')
const glob = require('glob')
const ejs = require('ejs')
const mkdirp = require('mkdirp')
const cp = require('child_process')
const shell = require('shelljs')
const ms = require('ms')

const MODE_0755 = parseInt('0755', 8)

// express/generator
function launchedFromCmd() {
  return process.platform === 'win32' && process.env._ === undefined
}
function mkdir(base, dir) {
  mkdirp.sync(path.join(base, dir), MODE_0755)
}

class Generator {
  constructor(appName, options) {
    this.path = path.resolve(process.cwd(), appName)
    this.appName = appName
    this.options = options
    this.start = Date.now()

    console.log(' ')
    console.log('Creating a new Methor app in ' + chalk.blue(this.path))
    console.log()

    if (!fs.existsSync(this.path)) {
      fs.mkdirSync(this.path)
    }

    emptyDir.sync(this.path)

    this.generatePackageDotJson()

    this.generateOtherFile()
    return this.installDependencies().then(() => this.showSuccess())
  }

  install() {
    let dependencies = Object.keys(this.pkg.dependencies)
    let useYarn = shell.which('yarn')
    return new Promise((resolve, reject) => {
      let command
      let args
      if (useYarn) {
        command = 'yarnpkg'
        args = ['add', '--exact'].concat(dependencies)
        args.push('--cwd')
        args.push(this.path)
      } else {
        command = 'npm'
        args = [
          'install',
          '--save',
          '--save-exact',
          '--loglevel',
          'error'
        ].concat(dependencies)
      }

      const child = cp.spawn(command, args, {
        cwd: this.path,
        stdio: 'inherit'
      })
      child.on('close', code => {
        if (code !== 0) {
          reject({
            command: `${command} ${args.join(' ')}`
          })
          return
        }
        resolve()
      })
    })
  }

  installDependencies() {
    console.log(' ')
    console.log('Installing packages. This might take a couple of minutes.')
    console.log()

    return this.install().then(() => {
      console.log()
    })
  }

  showSuccess() {
    console.log()
    console.log('  ', chalk.bgGreen.bold('SUCCESS'))

    const prompt = launchedFromCmd() ? '>' : '$'

    if (this.appName !== '.') {
      console.log()
      console.log('   change directory:')
      console.log('     %s ' + chalk.green('cd ' + this.appName), prompt)
    }

    console.log()
    console.log('   run the app:')

    console.log(
      '     %s ' +
        chalk.green('npm start') +
        ' or ' +
        chalk.green('yarn start'),
      prompt
    )

    console.log()

    console.log('✨ Done in ' + ms(Date.now() - this.start) + '.')
  }

  generateOtherFile() {
    mkdir(this.path, 'methods')
    mkdir(this.path, 'public')

    const resolveTemplate = file => {}
    const files = (this.files = glob.sync(__dirname + '/template/**/*.*'))
    for (let file of files) {
      console.log(file)
      let newPath = path.join(this.path, file.split('/template')[1])
      let fileContent = fs
        .readFileSync(path.resolve(__dirname, file))
        .toString()
      const content = ejs.render(fileContent, this)
      fs.outputFileSync(newPath, content)
    }
  }

  generatePackageDotJson() {
    let info = {
      name: this.appName === '.' ? 'my-app' : this.appName,
      main: 'app.js',
      version: '0.0.0',
      private: true,
      scripts: {
        start: 'node app.js'
      },
      dependencies: {
        methor: 'latest'
      }
    }
    this.pkg = info
    fs.writeFileSync(
      path.resolve(this.path, 'package.json'),
      JSON.stringify(info, null, 2) + '\n'
    )
  }
}

const questions = [
  {
    type: 'input',
    name: 'name',
    default: process
      .cwd()
      .split('/')
      .pop()
  },
  {
    type: 'checkbox',
    name: 'plugins',
    choices: ['validator']
  }
]
;(function() {
  let name
  if (process.argv.length > 2) {
    name = process.argv.pop()
    questions.splice(0, 1)
  }
  inquirer
    .prompt(questions)
    .then(anwser => {
      anwser.name = anwser.name || name
      return new Generator(anwser.name, anwser)
    })
    .catch(err => {
      console.log(chalk.bgRed('ERROR'), err)
    })
})()
