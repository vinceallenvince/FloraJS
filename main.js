// Flora classes
var Flora = {
  System: require('Burner').System,
  Vector: require('Burner').Vector
};

Flora.System.Classes = {
  Point: require('./src/Point').Point,
  Connector: require('./src/Connector').Connector
};

/*var Burner = require('Burner');
Burner.System.Classes = Flora;
window.Burner = Burner;*/

//

module.exports = Flora;
