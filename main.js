// Flora classes
var Flora = {
  System: require('Burner').System,
  Vector: require('Burner').Vector,
  World: require('Burner').World
};

Flora.System.Classes = {
  Attractor: require('./src/Attractor').Attractor,
  Connector: require('./src/Connector').Connector,
  Dragger: require('./src/Dragger').Dragger,
  Mover: require('./src/Mover').Mover,
  Oscillator: require('./src/Oscillator').Oscillator,
  Point: require('./src/Point').Point,
  Repeller: require('./src/Repeller').Repeller
};

module.exports = Flora;