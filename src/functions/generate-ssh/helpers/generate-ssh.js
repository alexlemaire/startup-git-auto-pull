module.exports = (info) => {
  const spawnSync = require('child_process').spawnSync
  clog.info('Generating SSH key...')
  spawnSync('ssh-keygen', [
    '-t', 'rsa',
    '-b', '4096',
    '-C', info.email,
    '-N', info.pwd,
    '-f', info.path
  ])
  clog.success('SSH key generated!')
}
