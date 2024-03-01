import { Command } from 'commander'
import { existsSync, readFileSync } from 'fs'
import * as emoji from 'node-emoji'
import * as pc from 'picocolors'
import { Reporter } from '../reporter'
import type { Options } from '../types'

function readConfigFile(configFilePath: string): any | undefined {
  if (!existsSync(configFilePath)) {
    const stopSign = emoji.get('stop_sign')
    const logFileName = pc.italic(configFilePath)
    const logNoReport = pc.red(pc.bold('No report was generated.'))
    console.log(
      `${stopSign} The '${logFileName}' does not exist.\n${stopSign} ${logNoReport}`
    )
    return {}
  }
  const configJsonString = readFileSync(configFilePath, 'utf-8')
  return JSON.parse(configJsonString)
}

function readConfig(config: any): Options {
  const options: Options = {
    outputFile:
      config.outputFile !== undefined
        ? config.outputFile
        : 'reports/cucumber.html',
    templateDir: './templates',
    templateName: 'html/main',
  }
  return options
}

const cli = new Command()
cli
  .version('1.0.0')
  .argument('<configFile>', 'Json file with the configurations')
  .action((configFile: string) => {
    const config = readConfigFile(configFile)
    if (config !== undefined) {
      const options = readConfig(config)
      const reporter = new Reporter(options)
      reporter.generate()
      reporter.save()
    }
  })
  .parse(process.argv)
