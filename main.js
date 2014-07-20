// Flora classes
var Flora = {
  System: require('Burner').System,
  Vector: require('Burner').Vector,
  World: require('Burner').World
};

Flora.System.Classes = {
  Attractor: require('./src/Attractor').Attractor,
  Connector: require('./src/Connector').Connector,
  Mover: require('./src/Mover').Mover,
  Point: require('./src/Point').Point,
  Repeller: require('./src/Repeller').Repeller
};

module.exports = Flora;