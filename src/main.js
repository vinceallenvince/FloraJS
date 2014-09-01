// Flora classes
var Flora = {
  BorderPalette: require('borderpalette'),
  ColorPalette: require('colorpalette'),
  SimplexNoise: require('quietriot'),
  SoundBed: require('soundbed'),
  System: require('burner').System,
  Utils: require('burner').Utils,
  Vector: require('burner').Vector,
  World: require('burner').World
};

Flora.System.Classes = {
  Agent: require('./Agent'),
  Attractor: require('./Attractor'),
  BorderPalette: require('borderpalette'),
  Caption: require('./Caption'),
  Connector: require('./Connector'),
  Dragger: require('./Dragger'),
  FlowField: require('./FlowField'),
  FlowFieldMarker: require('./FlowFieldMarker'),
  InputMenu: require('./InputMenu'),
  Mover: require('./Mover'),
  Oscillator: require('./Oscillator'),
  Particle: require('./Particle'),
  ParticleSystem: require('./ParticleSystem'),
  Point: require('./Point'),
  RangeDisplay: require('./RangeDisplay'),
  Repeller: require('./Repeller'),
  Sensor: require('./Sensor'),
  Stimulus: require('./Stimulus'),
  Walker: require('./Walker').Walker
};

module.exports = Flora;