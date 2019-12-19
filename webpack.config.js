const path = require('path');
const tsImportPluginFactory = require('ts-import-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require("webpack")
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ImageminPlugin = require('imagemin-webpack-plugin').default
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const MIN_OPTIONS = {
    collapseWhitespace: true,
    collapseInlineTagWhitespace: true,
    conservativeCollapse: true,
    decodeEntities: true,
    html5: true,
    keepClosingSlash: true,
    minifyCSS: true,
    minifyJS: true,
    minifyURLs: true,
    preserveLineBreaks: false,
    removeComments : true,
 }
const IS_PROD = (process.env.NODE_ENV+'').trim() === 'production';
function recursiveIssuer(m) {
    if (m.issuer) {
        return recursiveIssuer(m.issuer);
    } else if (m.name) {
        return m.name;
    } else {
        return false;
    }
 }
console.log("[ENV] ------>",IS_PROD? "PRODUCTION":"DEVELOPMENT")

module.exports = {
    target : "web",
    devtool: "cache",
    // devtool : IS_PROD ? false : "inline-source-map",
    entry : { 
        app : path.join(__dirname, 'src', 'index.tsx'),
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index_bundle.js',
        publicPath: '/'
    },
    resolve : {
        extensions : ['.ts','.tsx','.js','.less','.css'],
        modules : [
            path.resolve("./"),
            path.resolve("./node_modules"),
        ],
        // aliasFields: ["browser"]
    },
    module : {
        rules : [
            {
                test : /\.(ts|tsx)$/,
                exclude : /node_modules/,
                include: __dirname,
                loader : 'ts-loader',
                options: {
                    transpileOnly: true,
                    getCustomTransformers: () => ({
                        before: [ tsImportPluginFactory({}) ]
                    }),
                    compilerOptions: {
                      module: 'es2015'
                    }
                  }
            },{
                test : /\.js$/,
                exclude : /node_modules/,
                include: __dirname,
                loader : 'babel-loader'
            },{
                test : /\.html$/,
                exclude : /node_modules/,
                include: __dirname,
                loader : 'html-loader'
            },{
                test: /\.(jpg|jpeg|png|svg)$/,
                loader: 'file-loader',
                options : {
                    publicPath : '/',
                    name : '[path][name].[ext]'
                }
            },{
                test: /\.(less|css)$/,
                use: [
                {
                  loader: IS_PROD ? MiniCssExtractPlugin.loader : 'style-loader', // inject CSS to page
                }, {
                  loader: 'css-loader', // translates CSS into CommonJS modules
                },{
                  loader: 'less-loader', // compiles Sass to CSS
                  options: {
                    javascriptEnabled: true,
                    modifyVars : require("./package.json").theme,
                    paths: [
                        path.resolve(__dirname, 'node_modules'),
                        path.resolve(__dirname)
                      ]
                    }
                }]
              }
        ]
    },
    devServer: {
        historyApiFallback: true,
        host: 'dac-account-web.simplus.local'
    },
    optimization : {
        minimize : IS_PROD,
        minimizer: IS_PROD ? [
            new UglifyJsPlugin({
                cache: false,
                parallel : true,
                sourceMap : true,
            }),
            new OptimizeCSSAssetsPlugin({})
        ] : undefined,
        splitChunks: {
            chunks: "all",
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            name: true,
            cacheGroups: {
                default: false,
                menu: {
                    name: 'app',
                    test: (m,c,entry = 'app') => m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry ,
                    chunks: 'all',
                    enforce: true,
                },
                commons : {
                    test: /[\\/]node_modules[\\/]/,
                     name: 'vendors',
                    chunks: 'all',
                    minChunks :  3,
                }
            }
        }
    },
    plugins : [
        new Dotenv(),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV : JSON.stringify("development")
            }
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[hash].css',
            chunkFilename: '[name].[id].[hash].css'
        }),
        new HtmlWebpackPlugin({
            template : path.join(__dirname, 'src','assets','index.html'),
            cache: false,
            inject: 'body',
            hash: false,
            xhtml: true,
            inlineSource: IS_PROD?'.css$':'nothing$',
            minify: IS_PROD?MIN_OPTIONS:false
        }),
        new CopyWebpackPlugin([ {
            from : "src/assets", 
            to : path.join(__dirname,"dist","src","assets"), 
            toType : "dir"
        } ], {}),
        new ImageminPlugin({
            disable: !IS_PROD, // Disable during development
            pngquant: {
                quality: '95-100'
            }
        }),
    ]
}

if((process.env.NODE_ENV + " ").trim() === 'development') {
    module.exports.devtool = "source-map"
}