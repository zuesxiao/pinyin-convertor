/**
 * Created by lingxiao on 18/05/2017.
 */

const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const ROOT = path.resolve(__dirname, '..');

const RULES = [
    {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
            presets: ['es2015']
        }
    },
    {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            loader: [
                'css-loader',
                {
                    loader: 'postcss-loader',
                    options: {
                        plugins: () => [autoprefixer]
                    }
                }
            ]
        })
    }
];

module.exports = [
    {
        entry: path.resolve(ROOT, 'src/index.js'),
        output: {
            filename: 'docs/browser.js',
            path: ROOT,
            libraryTarget: 'umd',
            library: 'convertor'
        },
        module: {
            rules: RULES.slice(0, 1)
        },
        plugins: [
            new webpack.optimize.UglifyJsPlugin({
                compress: true,
                mangle: true,
                beautify: false
            })
        ]
    },
    {
        entry: path.resolve(ROOT, 'docs/_source/app.js'),
        output: {
            filename: 'app.js',
            path: path.resolve(ROOT, 'docs')
        },
        context: path.resolve(ROOT, 'docs'),
        resolve: {
            modules: [ROOT, 'node_modules']
        },
        module: {
            rules: RULES
        },
        plugins: [
            new HtmlWebpackPlugin({
                title: 'PinYin-Convertor',
                template: '_source/index.html',
                filename: index.html
            }),
            new ExtractTextPlugin('app.css')
        ]
    }
];