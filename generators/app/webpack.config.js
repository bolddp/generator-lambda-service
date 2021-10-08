const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

const conf = {
  prodMode: process.env.NODE_ENV === 'production',
  templatePath: './aws/api/template.yml',
};

module.exports = {
  // http://codys.club/blog/2015/07/04/webpack-create-multiple-bundles-with-entry-points/#sec-3
  entry: {
    scheduledHandler: './src/scheduledLambdaHandler.ts',
  },
  // Use aws-sdk included in lambda-runtime to minimize deployment.
  externals: [{ 'aws-sdk': 'commonjs aws-sdk' }],
  target: 'node',
  mode: conf.prodMode ? 'production' : 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    path: path.resolve(__dirname, 'dist/webpack'),
    filename: '[name].js',
    libraryTarget: 'commonjs2',
  },
  plugins: [
    new TerserPlugin({
      parallel: true,
      extractComments: true,
    }),
  ],
};
