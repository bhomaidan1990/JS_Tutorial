/* Current Path */
const path = require('path')
/* HTML Template */
const HtmlWebpackPlugin = require('html-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
    /* Build Type */
    mode: 'production',
    /* Entry Point */
    entry: {
        main: path.resolve(__dirname, 'src/index.js')
    },
    /* Output Config */
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[contenthash].js',
        clean: true,
        assetModuleFilename: '[name][ext]',
    },
    /* Source Map for Error Debug */
    devtool: 'source-map',
    /* Webpack Server Config */
    devServer: {
        static: {
           directory: path.resolve(__dirname, 'dist') 
        },
        port: 3000,
        open: true,
        hot: true,
        compress: true,
        historyApiFallback: true,
    },
    module: {
        rules: [
        /* Style Sheet Loader*/
            {
                test: /\.scss$/, /* Regex: Any file ends with .scss*/
                use: ['style-loader', 'css-loader','sass-loader'],
            },
            /* for compatibility with old browsers*/
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {   
                        presets: ['@babel/preset-env'], 
                    },
                },
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
        ]
    },
    plugins: [
        /* Automated HTML Generation */
        new HtmlWebpackPlugin({
            favicon: "./src/favicon.ico",
            title: 'Webpack App',
            filename: 'index.html',
            template: "./src/template.html",
        }),
        /* Statistics about Usage*/
        // new BundleAnalyzerPlugin(),
    ],
}