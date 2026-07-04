// Flora classes
var Flora = {
  BorderPalette: require('./vendor/borderpalette'),
  ColorPalette: require('./vendor/colorpalette'),
  SimplexNoise: require('./vendor/quietriot'),
  SoundBed: require('./vendor/soundbed/index'),
  System: require('./vendor/burner/main').System,
  Utils: require('./vendor/burner/main').Utils,
  Vector: require('./vendor/burner/main').Vector,
  World: require('./vendor/burner/main').World
};

Flora.System.Classes = {
  Agent: require('./agent'),
  Attractor: require('./attractor'),
  BorderPalette: require('./vendor/borderpalette'),
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