/* eslint-disable import/no-extraneous-dependencies */

const archiver = require('archiver');
const util = require('util');
const glob = require('glob');
const fs = require('fs-extra');
const path = require('path');

const globPromise = util.promisify(glob);

const PLUGIN_NAME = 'BuildZip';

module.exports = class BuildZip {
  constructor(options) {
    this.tempFolder = options.tempFolder;
    this.packageName = options.packageName;
    this.innerFolder = options.innerFolder;
  }

  apply(compiler) {
    const outputPath = compiler.options.output.path.replace(/\\/g, '/');
    compiler.hooks.done.tapPromise(PLUGIN_NAME, () => {
      const timeLog = `生成 ${this.packageName} 用时`;
      console.time(timeLog);

      const deferred = {};
      const promise = new Promise((resolve, reject) => {
        deferred.resolve = resolve;
        deferred.reject = reject;
      });

      const output = fs.createWriteStream(this.packageName);
      const archive = archiver('zip', {
        zlib: { level: 9 },
      });

      output.on('close', () => {
        console.log(`${archive.pointer()} total bytes`);
        console.log('archiver has been finalized and the output file descriptor has closed.');
        deferred.resolve();
      });

      output.on('end', () => {
        console.log('Data has been drained');
      });

      archive.on('warning', (err) => {
        if (err.code === 'ENOENT') {
          // log warning
          console.warn(err);
        } else {
          deferred.reject(err);
        }
      });

      archive.on('error', (err) => {
        deferred.reject(err);
      });

      archive.pipe(output);

      const tempFolder = path.join(this.tempFolder, 'dist1');

      (async () => {
        try {
          if (this.innerFolder) {
            await fs.copy(`${outputPath}/`, path.join(tempFolder, this.innerFolder));
          } else {
            await fs.copy(`${outputPath}/`, tempFolder);
          }

          if (process.env.VUE_APP_MOBILE_MODE !== 'true') {
            await globPromise(`${tempFolder}/**/*.@(html|js)`)
              .then(allFile => Promise.all(allFile.map(async (filePath) => {
                let fileContent = await fs.readFile(filePath).then(file => file.toString());
                if (fileContent.indexOf('vue-project') !== -1) {
                  fileContent = fileContent.replace(/vue-project/g, 'dynamic_web');
                  await fs.writeFile(filePath, fileContent);
                }
              })));
          }

          archive.directory(tempFolder, false);

          archive.finalize();
        } catch (e) {
          deferred.reject(e);
        }
      })();

      return promise.finally(() => {
        fs.remove(tempFolder);
        console.timeEnd(timeLog);
      });
    });
  }
};
