import { resolve as _resolve } from 'path';
import webpack from 'webpack';

export default (_, argv) => ({
mode: argv.mode === 'production' ? 'production' : 'development',

devtool: argv.mode === 'production' ? false : 'inline-source-map',
  entry: {
    code: './src/code.ts'
  },
  module: {
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
  },
  output: {
    filename: '[name].js',
    path: _resolve(__dirname, 'dist'),
  },
});
