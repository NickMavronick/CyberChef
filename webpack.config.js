const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

/**
 * Webpack configuration details for use with Grunt.
 *
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2017
 * @license Apache-2.0
 */

const banner = `/**
 * CyberChef - The Cyber Swiss Army Knife
 *
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 *
 *   Copyright 2016 Crown Copyright
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */`;


module.exports = {
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            log: "loglevel"
        }),
        new webpack.BannerPlugin({
            banner: banner,
            raw: true,
            entryOnly: true
        }),
        new webpack.DefinePlugin({
            "process.browser": "true"
        }),
        new MiniCssExtractPlugin({
            filename: "assets/[name].css"
        }),
    ],
    resolve: {
        alias: {
            jquery: "jquery/src/jquery"
        }
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules\/(?!jsesc|crypto-api|bootstrap)/,
                options: {
                    configFile: path.resolve(__dirname, "babel.config.js"),
                    cacheDirectory: true,
                    compact: false
                },
                type: "javascript/auto",
                loader: "babel-loader"
            },
            {
                test: /forge.min.js$/,
                loader: "imports-loader?jQuery=>null"
            },
            {
                test: /bootstrap-material-design/,
                loader: "imports-loader?Popper=popper.js/dist/umd/popper.js"
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: "../"
                        }
                    },
                    "css-loader",
                    "postcss-loader",
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: "../"
                        }
                    },
                    "css-loader",
                    "sass-loader",
                ]
            },
            {
                test: /\.(ico|eot|ttf|woff|woff2)$/,
                loader: "url-loader",
                options: {
                    limit: 10000,
                    name: "[hash].[ext]",
                    outputPath: "assets"
                }
            },
            {
                test: /\.svg$/,
                loader: "svg-url-loader",
                options: {
                    encoding: "base64"
                }
            },
            { // Store font .fnt and .png files in a separate fonts folder
                test: /(\.fnt$|bmfonts\/.+\.png$)/,
                loader: "file-loader",
                options: {
                    name: "[name].[ext]",
                    outputPath: "assets/fonts"
                }
            },
            { // First party images are saved as files to be cached
                test: /\.(png|jpg|gif)$/,
                exclude: /(node_modules|bmfonts)/,
                loader: "file-loader",
                options: {
                    name: "images/[name].[ext]"
                }
            },
            { // Third party images are inlined
                test: /\.(png|jpg|gif)$/,
                exclude: /web\/static/,
                loader: "url-loader",
                options: {
                    limit: 10000,
                    name: "[hash].[ext]",
                    outputPath: "assets"
                }
            },
        ]
    },
    stats: {
        children: false,
        chunks: false,
        modules: false,
        entrypoints: false,
        warningsFilter: [
            /source-map/,
            /dependency is an expression/,
            /export 'default'/,
            /Can't resolve 'sodium'/
        ],
    },
    node: {
        fs: "empty",
        "child_process": "empty",
        net: "empty",
        tls: "empty"
    },
    performance: {
        hints: false
    }
};
