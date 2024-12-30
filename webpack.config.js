import { resolve } from 'path';
import { fileURLToPath } from 'url';
import webpack from 'webpack';

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, '..');

export default (_, argv) => ({
mode: argv.mode === 'production' ? 'production' : 'development',

devtool: argv.mode === 'production' ? false : 'inline-source-map',
  entry: {
    code: './src/code.ts'
  },
  module: {
    noParse: /\/node_modules\/process\//,
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    fallback: {
      fs: false
    }
  },
  output: {
    filename: '[name].js',
    path: resolve(__dirname, 'dist'),
  },
  target: 'web',
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser.js',
    }),
  ]
});
