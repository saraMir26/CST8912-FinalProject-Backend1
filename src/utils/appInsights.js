const appInsights = require("applicationinsights");

if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
  appInsights.setup(process.env.APPLICATIONINSIGHTS_CONNECTION_STRING).start();
}

module.exports = appInsights;