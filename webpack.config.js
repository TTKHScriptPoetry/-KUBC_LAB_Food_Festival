const path = require("path");
const webpack = require("webpack");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const WebpackPwaManifest = require("webpack-pwa-manifest");

// create the main configuration object within our file

module.exports = { 
  entry: {
    app: "./assets/js/script.js", //the relative path to the client's code
    events: "./assets/js/events.js",
    schedule: "./assets/js/schedule.js",
    tickets: "./assets/js/tickets.js"
  },
  output: {
    // path: path.resolve(__dirname, 'dist'),
    // filename: 'main.bundle.js',
    filename: "[name].bundle.js",  // see (*)
    path: __dirname + "/dist",
  },
  module: {
    rules: [
      {
        test: /\.jpg$/i,  //process any image file with the file extension of .jpg
        // property 'use' is where the actual loader is implemented
        use: [
          {
            loader: 'file-loader', //processes the images first (a)
            options: {
              esModule: false, // key-value pair or else file will be treated as an ES5 module
              name (file) {
                return "[path][name].[ext]"
              },
              publicPath: function(url) {
                return url.replace("../", "/assets/")
              }
            }  
          },
          {
            loader: 'image-webpack-loader' //optimize the emitted images files. (b)
          }
        ]
      }
    ]
  },
  plugins:[
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: "static", // the report outputs to an HTML file in the dist folder
    }),
    new WebpackPwaManifest({
      name: "Food Event",
      short_name: "Foodies",
      description: "An app that allows you to view upcoming food events.",
      start_url: "index.html", // relative to the location of the manifest file.
      background_color: "#01579b",
      theme_color: "#ffffff",
      fingerprints: false, // should NOT generate unique fingerprints manifest.lhge325d.jso
      inject: false, //  manifest.json is NOT added to our HTML; will manually hardcode the path to the manifest.json in our html instead.
      icons: [{
        src: path.resolve("assets/img/icons/icon-512x512.png"),
        sizes: [96, 128, 192, 256, 384, 512],
        destination: path.join("assets", "icons")
      }]
    })

  ],
  mode: 'development',  // By default, webpack wants to run in production mode //webpack will minify our code for us automatically
  devServer: {
    static: "./dist",
    port: 8080
  }
    
  // (*)
  // the bundle file for script.js will be app.bundle.js, 
  // the bundle file for events.js will be events.bundle.js, and so on,
  // with each using the key name from each key-value pair in the object for [name].
};