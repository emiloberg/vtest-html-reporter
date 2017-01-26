const Handlebars = require("handlebars")
const fs = require("fs-extra")
const path = require("path")

Handlebars.registerHelper("json", context =>
  JSON.stringify(context, null, "  ")
)

function reportHTML({ specs, config, reporterConfig, log, chalk }) {
  if (specs.flatSpecs.every(spec => spec.passTest)) {
    return specs
  }

  const normalizedOutputPath = path.dirname(reporterConfig.output)

  const paths = {
    new: path.relative(normalizedOutputPath, config.temp.screenshots.new),
    master: path.relative(normalizedOutputPath, config.temp.screenshots.master),
    diff: path.relative(normalizedOutputPath, config.temp.screenshots.diff)
  }

  const source = fs.readFileSync(path.join(__dirname, "report-html.hbs"), "utf-8")
  const template = Handlebars.compile(source)
  const html = template({ config, specs, paths })

  fs.outputFileSync(reporterConfig.output, html)

  log.log()
  log.log(`   ${chalk.blue("HTML Report:")} ${reporterConfig.output}`)
  log.log()

  return specs
}

module.exports = reportHTML
