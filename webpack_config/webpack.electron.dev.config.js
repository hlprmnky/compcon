const WriteFilePlugin = require('write-file-webpack-plugin')
const childProcess = require('child_process')
const path = require('path')

const subprocessPlugin = {
  apply(compiler) {
    compiler.hooks.done.tapAsync(
      'ElectronSubprocess',
      (compilation, callback) => {

        const platform = require('os').platform()
        const childArgs = platform === 'win32' ?
          ['cmd', ['/C', path.resolve('electron/node_modules/.bin/electron.cmd' + ' ./')]]
          : [path.resolve('electron/node_modules/.bin/electron'), './']

        const child = childProcess.spawn(...childArgs, {
          cwd: './electron',
        })
        child.stdout.on('data', function (data) {
          console.log(data.toString());
        });
        child.stderr.on('data', function (data) {
          console.log(data.toString());
        });
        callback()
      }
    )
  }
}

module.exports = {
  devServer: {
    // hot: false,
    open: false
  },
  plugins: [
    new WriteFilePlugin(),
    subprocessPlugin
  ]
}