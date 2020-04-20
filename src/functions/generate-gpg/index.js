const spawnSync = require('child_process').spawnSync

module.exports = async (args) => {
  const keyDefPath = '/var/tmp/genkey'
  require('./helpers/create-genkey.js')(await require('./helpers/info-prompter.js')(), keyDefPath)
  require('./helpers/generate-gpg.js')(keyDefPath)
  require('./helpers/delete-genkey.js')(keyDefPath)
  const keyId = getKeyId()
  require('./helpers/init-shell-update.js')(keyId)
  await require('./helpers/user-info.js')(getKeyASCII(keyId)).catch(err => {clog.error(err); process.exit(1)})
}

function getKeyId() {
  const keyList = spawnSync('gpg', [
    '--list-secret-keys',
    '--keyid-format', 'LONG'
  ]).stdout.toString('utf8')
  const keys = keyList.split('\n').filter(line => line.includes('sec'))
  const lastKey = keys[keys.length - 1]
  const regex = new RegExp(/\b(?<=rsa4096\/)\S*/, 'g')
  return lastKey.match(regex)
}

function getKeyASCII(keyId) {
  return spawnSync('gpg', [
    '--armor',
    '--export', keyId
  ]).stdout.toString('utf8')
}
