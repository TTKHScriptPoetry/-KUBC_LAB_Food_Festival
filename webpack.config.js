const path = require("path");
// create the main configuration object within our file
module.exports = { 
  entry: './assets/js/script.js',  //the relative path to the client's code
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.bundle.js'
  },
  mode: 'development'  // By default, webpack wants to run in production mode //webpack will minify our code for us automatically

};