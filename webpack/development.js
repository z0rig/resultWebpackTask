const webpack = require('webpack');
const path = require('path');
const root = path.resolve(__dirname, '../');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const cacheDir = path.resolve(__dirname, '../', 'node_modules', '.cache');

const getThreadLoader = name => ({
    loader: 'thread-loader',
    options: {
        workerParallelJobs: 50,
        poolRespawn: false,
        name
    }
});

module.exports = {
  mode: 'development',
  context: root,
  entry: path.resolve(root, 'src', 'index.js'),
  output: {
    path: path.resolve(root, 'dist'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  module: {
    rules: [
        {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: [
                {
                    loader: 'cache-loader',
                    options: {
                        cacheDirectory: path.resolve(cacheDir, 'js')
                    }
                },
                getThreadLoader('js'),
                {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: path.resolve(cacheDir, 'babel')
                    }
                }
            ]
        },
        {
            test: /\.css$/,
            exclude: /node_modules/,
            use: [
                {
                    loader: 'cache-loader',
                    options: {
                        cacheDirectory: path.resolve(cacheDir, 'css')
                    }
                },
                getThreadLoader('css'),
                'style-loader',
                'css-loader',
                'postcss-loader'
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
        new webpack.HotModuleReplacementPlugin(),
        new webpack.ProvidePlugin({
            fetch: 'imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch'
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(root, 'src', 'index.html'),
            filename: 'index.html'
        })
    ],
    devServer: {
        contentBase: path.resolve(root, 'dist'),
        publicPath: '/',
        compress: true,
        hot: true,
        historyApiFallback: true,
        open: true
    },
    devtool: process.env.npm_config_sourcemaps ? 'inline-source-map' : 'inline-eval',
};