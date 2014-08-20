// Flora classes
var Flora = {
  ColorPalette: require('./src/ColorPalette').ColorPalette,
  System: require('burner').System,
  Utils: require('burner').Utils,
  Vector: require('burner').Vector,
  World: require('burner').World
};

Flora.System.Classes = {
  Agent: require('./src/Agent').Agent,
  Attractor: require('./src/Attractor').Attractor,
  BorderPalette: require('./src/BorderPalette').BorderPalette,
  Caption: require('./src/Caption').Caption,
  Connector: require('./src/Connector').Connector,
  Dragger: require('./src/Dragger').Dragger,
  FlowField: require('./src/FlowField').FlowField,
  FlowFieldMarker: require('./src/FlowFieldMarker').FlowFieldMarker,
  InputMenu: require('./src/InputMenu').InputMenu,
  Mover: require('./src/Mover').Mover,
  Oscillator: require('./src/Oscillator').Oscillator,
  Particle: require('./src/Particle').Particle,
  ParticleSystem: require('./src/ParticleSystem').ParticleSystem,
  Point: require('./src/Point').Point,
  RangeDisplay: require('./src/RangeDisplay').RangeDisplay,
  Repeller: require('./src/Repeller').Repeller,
  Sensor: require('./src/Sensor').Sensor,
  Stimulus: require('./src/Stimulus').Stimulus,
  Walker: require('./src/Walker').Walker
};

module.exports = Flora;