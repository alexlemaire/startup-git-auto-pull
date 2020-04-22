module.exports = async (args) => {
  const Conf = require('conf')
  const config = new Conf({
    configName: 'auto-pull',
    fileExtension: 'conf'
  })
  if (['-c', '--config'].includes(args[0])) {
    config.store = await require('./helpers/conf-prompter.js')(args.splice(1))
    require('./helpers/schedule-process.js')(await require('./helpers/schedule-prompter.js')())
  } else {
    const path = config.get('path')
    if (!path) {
      throw new Error('No path defined in your auto-pull configuration. Please run git-assist auto-pull [-c, --config] in order to configurate your auto-pull utility.')
    }
    await require('./helpers/auto-pull.js')(path, config.get('excludedDirs'))
  }
}
