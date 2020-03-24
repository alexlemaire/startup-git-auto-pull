const root = '/var/log/git-pull-automation'
const logFile = `${root}/git-pull-automation-logs.log`

module.exports = () => {
  const fs = require('fs')
  if (!fs.existsSync(root)) {
    createFiles([{isDir: true, path: root}, {isDir: false, path: logFile}])
  }  else {
    if (!fs.existsSync(logFile)) {
      createFiles([{isDir: false, path: logFile}])
    }
  }
}

function createFiles(files) {
  const spawnSync = require('child_process').spawnSync
  for (const file of files) {
    let cmd = 'touch'
    if (file.isDir) {
      cmd = 'mkdir'
    }
    spawnSync('sudo', [cmd, file.path])
  }
}
