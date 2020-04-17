const inquirer = require('inquirer')
const fs = require('fs')
const pathMod = require('path')
const clog = require('../../../utils/loggers/console-log.js')
inquirer.registerPrompt('fuzzypath', require('inquirer-fuzzy-path'))

module.exports = async (args) => {
  const path = await getPath(process.cwd(), args[0] === '--list-hidden')
  const { excludedDirs } = await getExcludedDirs(path)
  return {
    path,
    excludedDirs
  }
}

async function getPath(root, listHidden) {
  clog.info(`Currently in ${root}`, {makeLink: false, format: false})
  let { path } = await promptPath(root, listHidden)
  while (path === '..') {
    clog.info('Scanning parent folder...')
    if (fs.existsSync(pathMod.join(root, '..'))) {
      root = pathMod.join(root, '..')
    }
    clog.info(`Currently in ${root}`, {makeLink: false, format: false})
    path = (await promptPath(root, listHidden)).path
  }
  return path
}

async function promptPath(root, listHidden) {
  return await inquirer.prompt([{
    type: 'fuzzypath',
    name: 'path',
    excludePath: nodePath =>
    {
      let test = nodePath.includes('node_modules') || fs.existsSync(pathMod.join(nodePath, '.git'))
      if (!listHidden) {
        test = test || pathMod.basename(nodePath).startsWith('.')
      }
      return test
    },
    itemType: 'directory',
    rootPath: root,
    default: '..',
    message: 'Path to the directory where you would like to setup auto-pulling:',
    suggestOnly: false,
    depthLimit: 3
  }])
}

async function getExcludedDirs(path) {
  return await inquirer.prompt([{
    type: 'checkbox',
    name: 'excludedDirs',
    message: 'Select repositories you would like not to enable auto-pulling for:',
    choices: require('../../../utils/fs/list-repo.js')(path)
  }])
}
