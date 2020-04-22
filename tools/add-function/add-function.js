(async function main() {
  const inquirer = require('inquirer')
  const appRoot = require('app-root-path').path
  const clog = require(appRoot + '/src/utils/loggers/console-log.js')
  clog.info('This function will create a new utility function for you.\n')
  const {name} = await inquirer.prompt({
    type: 'input',
    name: 'name',
    message: 'Function name:'
  })
  const root = `src/functions/${name}`
  const path = `${root}/index.js`
  const fctsPath = './functions.json'
  const fs = require('fs')
  fs.mkdirSync(root)
  fs.copyFileSync('tools/add-function/function.js', path)
  let fcts = JSON.parse(fs.readFileSync(fctsPath, 'utf-8'))
  fcts[name] = {
    cmds: [name],
    handler: `./${path}`,
    desc: '',
    optsData: []
  }
  fs.writeFileSync(fctsPath, JSON.stringify(fcts, null, 2))
  console.log('\n')
  clog.success(`Function ${name} successfully added!`)
})()
