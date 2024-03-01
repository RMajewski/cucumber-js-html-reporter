import { Eta } from 'eta'
import type { Options } from '../types'

export class Reporter {
  protected _options: Options

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
    console.log('templatePath', templatePath)
    const eta = new Eta({
      views: templatePath,
    })
    const res = eta.render(`./${this._options.templateName}`, {})
    console.log('res', res)
  }
}
