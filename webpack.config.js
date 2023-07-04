const { merge } = require('webpack-merge');

const commonConfig = require('./webpack.common.config');

const developmentConfig = require('./webpack.development.config');

const productionConfig = require('./webpack.production.config');

module.exports = (env) => {
  if (env.development) {
    return merge(commonConfig, developmentConfig);
  }
  return merge(commonConfig, productionConfig);
};
