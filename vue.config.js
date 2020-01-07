const path = require('path');
const BuildZip = require('./build-scripts/build-zip');

function resolve(dir) {
  return path.join(__dirname, dir);
}

const isProduction = process.env.NODE_ENV === 'production';
const tempFolder = resolve('./');

module.exports = {
  publicPath: '/vue-webapp',
  chainWebpack: (config) => {
    if (isProduction) {
      // 创建zip包, 用于发布
      config.plugin('build-zip').use(BuildZip, [{
        tempFolder,
        packageName: 'vue_node_web.zip',
      }]);
    }
  },
};
