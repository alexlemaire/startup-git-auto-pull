module.exports = async (info) => {
  createFolder(info.path)
  generateKey(info)
  updateConfig(info)
  await storePwd(info)
}

function createFolder(folderPath) {
  const fs = require('fs')
  const path = require('path')
  folderPath = path.dirname(folderPath)
  let folderPaths = folderPath.split(path.sep).map((pathFrag, index, array) => path.sep + path.join(...array.slice(0, index + 1)))
  folderPaths.shift()
  for (const folderPath of folderPaths) {
    if (!fs.existsSync(folderPath)) {
      clog.info(`Folder ${folderPath} does not exists, creating...`)
      fs.mkdirSync(folderPath)
      clog.success('Done!')
    }
  }
}

function generateKey(info) {
  const spawnSync = require('child_process').spawnSync
  clog.info('Generating SSH key...')
  const sshKeygen = spawnSync('ssh-keygen', [
    '-t', 'rsa',
    '-b', '4096',
    '-C', info.email,
    '-N', info.pwd,
    '-f', info.path
  ])
  // error handling needs to be done via stderr in this case since "ssh-keygen" doesn't seem to always exit with an error...
  const stderr = sshKeygen.stderr.toString().trim()
  if (stderr.length > 0) {
    throw new Error(stderr)
  }
  clog.success('SSH key generated!')
}

function updateConfig(info) {
  const chalk = require('chalk')
  const Conf = require('conf')
  const config = new Conf({
    configName: 'keys',
    fileExtension: 'conf'
  })
  clog.info(`Adding the SSH key to ${chalk.italic.cyan('git-assist')}...`)
  let sshKeyMap = config.get('ssh') || {}
  if (sshKeyMap[info.email]) {
    clog.info(`An SSH key already exists for ${info.email}, this key will now be updated with the newly generated key...`)
  }
  sshKeyMap[info.email] = {
    lastModified: Date.now(),
    path: info.path
  }
  config.set('ssh', sshKeyMap)
  clog.success(`SSH key successfully added for ${info.email}!`)
}

async function storePwd(info) {
  const pwdManager = require(appRoot + '/src/utils/auth/pwd-manager.js')
  clog.info('Storing your password for automatic SSH key unlocking...')
  await pwdManager.setPwd(info.path, info.pwd)
  clog.success('Password successfully stored!')
}
