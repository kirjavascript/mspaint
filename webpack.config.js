let webpack = require('webpack');

module.exports = (env={}) => {

    let config = {
        entry : {
            root: './web/modules/root.js',
        },
        output: {
            path: './web/bundles',
            filename: '[name].js',
        },
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                presets: babelPresets = [
                                    ['es2015', { modules: false }],
                                    'stage-0'
                                ]
                            }
                        }
                    ]
                },
                {
                    test: /\.scss/,
                    use: [
                        { loader:'style-loader' },
                        { loader:'raw-loader' },
                        { loader:'sass-loader' },
                    ]
                },
                {
                    test: /\.js$/,
                    enforce: 'pre',
                    loader: 'eslint-loader',
                    options: {
                        configFile: '.eslintrc',
                        failOnWarning: false,
                        failOnError: false,
                        emitError: false,
                        fix: true
                    }
                }
            ],
        },
        plugins: [
            new webpack.DefinePlugin({
                __DEV__: env.dev
            })
        ],
        resolve: {
            extensions: ['.js', '.json', '.jsx'],
            alias: {
                '#lib': __dirname + '/web/modules/js/lib',
                '#state': __dirname + '/web/modules/js/state',
                '#js': __dirname + '/web/modules/js/js',
            }
            
        },
        devtool: env.dev ? 'source-map' : false,
    };
    
    return config;

}
