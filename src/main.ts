import BorderPalette from './vendor/borderpalette';
import ColorPalette from './vendor/colorpalette';
import SimplexNoise from './vendor/quietriot';
import SoundBed from './vendor/soundbed/index';
import { Item, System, Utils, Vector, World } from './vendor/burner/main';
import { DOMRenderer, getRenderer, setRenderer } from './renderer/index';

import Agent from './agent';
import Attractor from './attractor';
import Caption from './caption';
import Connector from './connector';
import Dragger from './dragger';
import FlowField from './flowfield';
import FlowFieldMarker from './flowfieldmarker';
import InputMenu from './inputmenu';
import Mover from './mover';
import Oscillator from './oscillator';
import Particle from './particle';
import ParticleSystem from './particlesystem';
import Point from './point';
import RangeDisplay from './rangedisplay';
import Repeller from './repeller';
import Sensor from './sensor';
import Stimulus from './stimulus';
import Walker from './walker';

// Register classes the System can instantiate by name via System.add().
System.Classes = {
  Agent,
  Attractor,
  BorderPalette,
  Caption,
  Connector,
  Dragger,
  FlowField,
  FlowFieldMarker,
  InputMenu,
  Mover,
  Oscillator,
  Particle,
  ParticleSystem,
  Point,
  RangeDisplay,
  Repeller,
  Sensor,
  Stimulus,
  Walker
};

const Flora = {
  BorderPalette,
  ColorPalette,
  DOMRenderer,
  SimplexNoise,
  SoundBed,
  System,
  Utils,
  Vector,
  World,
  getRenderer,
  setRenderer
};

export {
  BorderPalette,
  ColorPalette,
  DOMRenderer,
  getRenderer,
  setRenderer,
  SimplexNoise,
  SoundBed,
  Item,
  System,
  Utils,
  Vector,
  World,
  Agent,
  Attractor,
  Caption,
  Connector,
  Dragger,
  FlowField,
  FlowFieldMarker,
  InputMenu,
  Mover,
  Oscillator,
  Particle,
  ParticleSystem,
  Point,
  RangeDisplay,
  Repeller,
  Sensor,
  Stimulus,
  Walker
};

export default Flora;
