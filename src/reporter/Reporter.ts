import { Eta } from 'eta'
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import * as emoji from 'node-emoji'
import path from 'path'
import * as pc from 'picocolors'
import type { Options } from '../types'
export class Reporter {
  /**
   * Stores the options to generate the report.
   */
  protected _options: Options

  /**
   * Stores the generated report.
   */
  protected _reportString: string | undefined = undefined

  /**
   * Initialize the Reporter.
   *
   * @param options Options to generate the report.
   */
  constructor(options: Options) {
    this._options = options
  }

  /**
   * Generate the report
   */
  public generate() {
    const templatePath = this._options.templateDir
      ? this._options.templateDir
      : __dirname
    const eta = new Eta({
      views: templatePath,
    })
    this._reportString = eta.render(`./${this._options.templateName}`, {})
  }

  /**
   * Stores the generated report in a file.
   */
  public save() {
    if (this._reportString) {
      const outputPath =
        this._options.outputFile.indexOf(path.sep) < 0
          ? undefined
          : this._options.outputFile.substring(
              0,
              this._options.outputFile.lastIndexOf(path.sep)
            )
      if (outputPath && !existsSync(outputPath)) {
        mkdirSync(outputPath)
        const fileFolder = emoji.get('file_folder')
        const logOutputPath = pc.italic(outputPath)
        console.log(`${fileFolder} Create the '${logOutputPath}' directory.`)
      }
      writeFileSync(this._options.outputFile, this._reportString, {
        encoding: 'utf-8',
      })

      const checkSign = emoji.get('white_check_mark')
      const logOutputFile = pc.green(pc.bold(this._options.outputFile))
      console.log(`${checkSign} The report was stored in ${logOutputFile}.`)
    } else {
      const stopSign = emoji.get('stop_sign')
      const noReport = pc.red(pc.bold('No report was generated.'))
      console.warn(`${stopSign} Something has gone wrong. ${noReport}`)
    }
  }
}
