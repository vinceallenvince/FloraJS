// Flora classes
var Flora = {
  ColorPalette: require('./src/ColorPalette').ColorPalette,
  System: require('Burner').System,
  Utils: require('Burner').Utils,
  Vector: require('Burner').Vector,
  World: require('Burner').World
};

Flora.System.Classes = {
  Attractor: require('./src/Attractor').Attractor,
  BorderPalette: require('./src/BorderPalette').BorderPalette,
  Connector: require('./src/Connector').Connector,
  Dragger: require('./src/Dragger').Dragger,
  Mover: require('./src/Mover').Mover,
  Oscillator: require('./src/Oscillator').Oscillator,
  Point: require('./src/Point').Point,
  Repeller: require('./src/Repeller').Repeller,
  Walker: require('./src/Walker').Walker
};

module.exports = Flora;