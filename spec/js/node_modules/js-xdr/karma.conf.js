module.exports = function(config) {
  config.set({
    frameworks: ['mocha', 'sinon-chai'],
    browsers: ['Firefox'],
    browserNoActivityTimeout: 20000,

    files: ['dist/xdr.js', 'test/unit/**/*.js'],

    preprocessors: {
      'test/unit/**/*.js': ['webpack']
    },

    webpack: {
      mode: 'development',
      module: {
        rules: [
          { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
        ]
      }
    },

    webpackMiddleware: {
      noInfo: true
    },

    singleRun: true,

    reporters: ['dots']
  });
};
