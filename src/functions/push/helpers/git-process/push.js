module.exports = async (protocol) => {
  switch (protocol) {
    case 'https':
      await httpPush()
      break
    case 'ssh':
      sshPush()
      break
    default:
      break
  }
}

async function httpPush() {
  const http = require('isomorphic-git/http/node')
  const git = require('isomorphic-git')
  const fs = require('fs')
  const dir = '.'
  const currentBranch = await git.currentBranch({ fs, dir })
  require(appRoot + '/src/utils/auth/user-heads-up.js')
  await git.push({
    fs,
    http,
    dir,
    remote: await git.getConfig({ fs, dir, path: `branch.${currentBranch}.remote` }),
    ref: currentBranch,
    onAuth: require(appRoot + '/src/utils/auth/auth.js').onAuth,
    onAuthFailure: require(appRoot + '/src/utils/auth/auth.js').onAuthFailure
  }).then(res => {clog.success('Successfully commited, staged and pushed your changes!')})
}

function sshPush() {
  // isomorphic-git is not supporting ssh yet so we use the regular bash call to git to operate over ssh
  const spawnSync = require('child_process').spawnSync
  spawnSync('git' , ['push'])
}
