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
    new: path.relative(normalizedOutputPath, config.get("temp.screenshots.new")),
    master: path.relative(normalizedOutputPath, config.get("temp.screenshots.master")),
    diff: path.relative(normalizedOutputPath, config.get("temp.screenshots.diff"))
  }

  let source;
  if (reporterConfig.template) {
    source = fs.readFileSync(reporterConfig.template, "utf-8")
  } else {
    source = fs.readFileSync(path.join(__dirname, "report-html.hbs"), "utf-8")
  }

  const template = Handlebars.compile(source)
  const html = template({ config: config.getAll(), specs, paths })

  fs.outputFileSync(reporterConfig.output, html)

  log.log(`   ${chalk.blue("HTML Report:")} ${reporterConfig.output}`)

  return specs
}

module.exports = reportHTML
