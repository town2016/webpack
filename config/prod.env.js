'use strict'
const buildEnv = process.env.BUILD_ENV

module.exports = {
  NODE_ENV: '"production"',
  BUILD_ENV: `"${buildEnv}"`
}
