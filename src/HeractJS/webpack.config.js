var path = require('path');

var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
var LimitChunkCountPlugin = require('webpack/lib/optimize/LimitChunkCountPlugin');
var AggressiveMergingPlugin = require('webpack/lib/optimize/AggressiveMergingPlugin');

module.exports = {
    console: true,
    entry: {
        'gantt': './Scripts/GanttChart/GCMainView.ts',
      //  'shared': './scripts/project/shared/bootstrap.js',
      //  'navigation': './scripts/project/navigation/module.js',
        'project': './Scripts/project/Application.js'
    },
    output: {
        path: path.join('./wwwroot/', 'js'),
        filename: 'cmw.tracker.[name].bundle.js',
        chunkFilename: "[id].chunk.js"
    },
    resolve: {
        extensions: ['', '.Webpack.js', '.web.js', '.ts', '.js', '.tsx'],
        alias: {
            'coreui': 'comindware.core.ui',
            'comindware/core': 'comindware.core.ui',
            'rootpath': path.resolve(__dirname + '/scripts/project'),
            'sharedpath': path.resolve(__dirname + '/scripts/project/shared'),
            'prism': path.resolve(__dirname + '/scripts/lib/prism/prism.js'),
            'shared': path.resolve(__dirname + '/scripts/project/shared/bootstrap.js'),
            'demoPage': path.resolve(__dirname + '/scripts/project/demo/helpers'),
            'demoInitializer': path.resolve(__dirname + '/scripts/project/demo/Initializer'),
            'profileAboutInitializer': path.resolve(__dirname + '/scripts/project/profile/aboutandextras/Initializer'),
            'profileNotificationInitializer': path.resolve(__dirname + '/scripts/project/profile/notificationSettings/Initializer'),
            'profileProfileInitializer': path.resolve(__dirname + '/scripts/project/profile/profile/Initializer'),
            'navigation': path.resolve(__dirname + '/scripts/project/navigation/module.js'),
            'LANGMAPEN': path.resolve(__dirname + '/wwwroot/js/compiled/localizationmap.en.js')
        }
    },
    module: {
        loaders: [{
            test: /\.tsx?$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'ts-loader'
        }, {
            test: /\.hbs$/,
            loader: "handlebars-loader"
        }, {
            test: /\.html$/,
            loader: "html"
        }, {
            test: /^text!/,
            loader: "text-loader"
        }, {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract('style-loader', ['css-loader', 'postcss-loader'].join('!'))
        }, {
            test: /\.scss$/,
            loader: ExtractTextPlugin.extract('style-loader', ['css-loader', 'postcss-loader', 'sass-loader'].join('!'))
        }]
    },
    plugins: [
        new CommonsChunkPlugin({ name: 'commons', filename: 'commons.js' }),
        new LimitChunkCountPlugin({maxChunks: 1}),
        new AggressiveMergingPlugin({
            minSizeReduce: 1.5,
            moveToParents: true
        })
        //new webpack.optimize.DedupePlugin(),
        //new webpack.optimize.OccurenceOrderPlugin(),
        //new webpack.optimize.UglifyJsPlugin()
    ],
    //eslint: { emitError: true },
    root: [
        path.resolve(__dirname + '/Scripts/'),
        path.resolve(__dirname + '/wwwroot/js/')
    ]
}