/// <binding ProjectOpened='Run - Development' />
module.exports = {
    entry: './Scripts/app/App.ts',
    output: {
        path: './wwwroot/js/',
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['', '.Webpack.js', '.web.js', '.ts', '.js', '.tsx']
    },
    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'ts-loader'
            },
            {
                test: /\.rt/,
                loader: 'react-templates-loader'
            }
        ]
    }
}
