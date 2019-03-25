const webpack = require('webpack');
const path = require('path');
const root = path.resolve(__dirname, '../');

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = {
  mode: 'production',
  context: root,
  entry: path.resolve(root, 'src', 'index.js'),
  output: {
    path: path.resolve(root, 'dist'),
    filename: '[name].[chunkhash].js'
  },
  optimization: {  
    minimizer: [  
      new UglifyJsPlugin({  
        parallel: true,  
        cache: true,  
        sourceMap: true,  
        uglifyOptions: {  
          compress: {  
              drop_console: true  
          }  
        },  
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessor: require('cssnano'),
        cssProcessorOptions: { discardComments: { removeAll: true } },
      })  
    ],
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    } 
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['thread-loader', 'babel-loader']
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          'css-loader',
          {
            loader: 'postcss-loader',
            options: { 
              config: {
                ctx: {
                  'postcss-preset-env': {
                    browsers: 'last 2 versions',
                  }
                }
              }, 
            }
          }
        ]
      },
      {
        test: /\.svg$/,
        use: [
          'svg-inline-loader',
          {
            loader: 'svgo-loader',
            options: {
              plugins: [
                {removeTitle: true},
                {convertColors: {shorthex: false}},
                {convertPathData: false}
              ]
            }
          }
        ]
    }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      fetch: 'imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch'
    }),
    new MiniCssExtractPlugin({
      filename: '[name].style.css'
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(root, 'src', 'index.html'),
      filename: 'index.html',
      title: 'Caching',
      minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: false,
      },
    }),
    new CompressionPlugin({
      test: /\.js(\?.*)?$/i,
    }),
    new CleanWebpackPlugin(),
  ]
};