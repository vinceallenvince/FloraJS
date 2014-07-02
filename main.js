// Flora classes
var Flora = {
  Point: require('./src/Point').Point
};

var Burner = require('Burner');
Burner.System.Classes = Flora;
window.Burner = Burner;

//

module.exports = Flora;
