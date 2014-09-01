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
  Agent: require('./agent'),
  Attractor: require('./attractor'),
  BorderPalette: require('borderpalette'),
  Caption: require('./caption'),
  Connector: require('./connector'),
  Dragger: require('./dragger'),
  FlowField: require('./flowfield'),
  FlowFieldMarker: require('./flowfieldmarker'),
  InputMenu: require('./inputmenu'),
  Mover: require('./mover'),
  Oscillator: require('./oscillator'),
  Particle: require('./particle'),
  ParticleSystem: require('./particlesystem'),
  Point: require('./point'),
  RangeDisplay: require('./rangedisplay'),
  Repeller: require('./repeller'),
  Sensor: require('./sensor'),
  Stimulus: require('./stimulus'),
  Walker: require('./walker')
};

module.exports = Flora;