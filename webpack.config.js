var path = require("path");
var webpack = require("webpack");
var nodeExternals = require('webpack-node-externals');
// require('style!css!less!font-awesome-webpack/font-awesome-styles.loader!font-awesome-webpack/font-awesome.config.js');

module.exports = [{
    name: "browser",
    entry: {
        panel: "./src/index.tsx",
        background: "./src/chrome/background.ts",
        injected: "./src/chrome/injected.ts",
        devtools: "./src/chrome/devtools.ts"
    },
    output: {
        path: path.join(__dirname, "dist"),
        filename: "[name].js"
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },

    module: {
        loaders: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
            { test: /\.tsx?$/, loader: "ts-loader" },

            // Less CSS
            {
                test: /\.less$/,
                loader: "style!css!autoprefixer!less"
            },

            // the url-loader uses DataUrls.
            // the file-loader emits files.
            { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff" },
            { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }

        ],

        preLoaders: [
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { test: /\.js$/, loader: "source-map-loader" }
        ]
    },

     plugins: [
        new webpack.IgnorePlugin(
          /\.\/(timers|any|race|call_get|filter|generators|map|nodeify|promisify|props|reduce|settle|some|progress|cancel)\.js/,
          /node_modules\/bluebird\/js\/main/
        ),
    ],

    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    externals: {
        "react": "React",
        "react-dom": "ReactDOM"
    },
}, {
    name: "node",
    entry: {
        test: "./src/test/main.ts",
        server: "./src/test/server.ts"
    },

    target: 'node',// in order to ignore built-in modules like path, fs, etc.
    externals: [nodeExternals()], // in order to ignore all modules in node_modules folder

    output: {
        path: path.join(__dirname, "dist"),
        filename: "[name].js"
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },

    module: {
        loaders: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
            { test: /\.tsx?$/, loader: "ts-loader" }
        ],

        preLoaders: [
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { test: /\.js$/, loader: "source-map-loader" }
        ]
    },

     plugins: [
        new webpack.IgnorePlugin(
          /\.\/(timers|any|race|call_get|filter|generators|map|nodeify|promisify|props|reduce|settle|some|progress|cancel)\.js/,
          /node_modules\/bluebird\/js\/main/
        ),
    ]
}];
