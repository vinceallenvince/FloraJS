import { test, expect, beforeEach } from 'vitest';
import Burner from '../src/vendor/burner/main';
import ParticleSystem from '../src/particlesystem';

let obj;

beforeEach(() => {
  Burner.System.setupFunc = function() {};
  Burner.System._resetSystem();
  document.body.innerHTML = '';
  var world = document.createElement('div');
  world.id = 'world';
  world.style.position = 'absolute';
  world.style.top = '0';
  world.style.left = '0';
  document.body.appendChild(world);
});

test('load ParticleSystem.', () => {
  expect(ParticleSystem).toBeTruthy();
});

test('new ParticleSystem() should have default properties.', () => {
  Burner.System.Classes = {
    ParticleSystem: ParticleSystem
  };

  Burner.System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    obj = new ParticleSystem();
    obj.init(world);
  });

  expect(obj.name).not.toBe('ParticleSystem');
  expect(obj.width).toBe(0);
  expect(obj.height).toBe(0);
  expect(obj.color[0] === 255 && obj.color[1] === 255 && obj.color[2] === 255).toBeTruthy();
  expect(obj.borderWidth).toBe(0);
  expect(obj.borderStyle).toBe('none');
  expect(obj.borderColor[0] === 255 && obj.borderColor[1] === 255 && obj.borderColor[2] === 255).toBeTruthy();
  expect(obj.borderRadius).toBe(0);
  expect(obj.isStatic).toBe(true);
  expect(obj.lifespan).toBe(-1);
  expect(obj.life).toBe(-1);
  expect(obj.burst).toBe(1);
  expect(obj.burstRate).toBe(4);
  expect(obj.emitRadius).toBe(3);
  expect(obj.startColor[0] === 255 && obj.startColor[1] === 255 && obj.startColor[2] === 255).toBeTruthy();
  expect(obj.endColor[0] === 255 && obj.endColor[1] === 0 && obj.endColor[2] === 0).toBeTruthy();
  expect(typeof obj.particleOptions).toBe('object');
  expect(obj.particleOptions.width).toBe(15);
  expect(obj.particleOptions.height).toBe(15);
  expect(obj.particleOptions.lifespan).toBe(50);
  expect(obj.particleOptions.borderRadius).toBe(100);
  expect(obj.particleOptions.checkWorldEdges).toBe(false);
  expect(obj.particleOptions.acceleration).toBe(null);
  expect(obj.particleOptions.velocity).toBe(null);
  expect(obj.particleOptions.location).toBe(null);
  expect(obj.particleOptions.maxSpeed).toBe(3);
  expect(obj.particleOptions.fade).toBe(true);
  expect(obj.particleOptions.shrink).toBe(true);
});

test('new ParticleSystem() should accept custom properties.', () => {
  Burner.System.Classes = {
    ParticleSystem: ParticleSystem
  };

  Burner.System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    obj = this.add('ParticleSystem', {
      width: 10,
      height: 10,
      color: [10, 20, 30],
      borderWidth: 3,
      borderStyle: 'dotted',
      borderColor: [40, 50, 60],
      borderRadius: 30,
      isStatic: false,
      lifespan: 100,
      life: 21,
      burst: 1,
      burstRate: 4,
      emitRadius: 3,
      startColor: [255, 255, 255],
      endColor: [255, 0, 0],
      particleOptions: {
        width : 30,
        height : 30,
        lifespan : 100,
        borderRadius : 200,
        checkWorldEdges : true,
        acceleration: new Burner.Vector(10, 10),
        velocity: new Burner.Vector(20, 20),
        location: new Burner.Vector(30, 30),
        maxSpeed: 6,
        fade: false,
        shrink: false
      }
    });
  });

  expect(obj.width).toBe(10);
  expect(obj.height).toBe(10);
  expect(obj.color[0] === 10 && obj.color[1] === 20 && obj.color[2] === 30).toBeTruthy();
  expect(obj.borderWidth).toBe(3);
  expect(obj.borderStyle).toBe('dotted');
  expect(obj.borderColor[0] === 40 && obj.borderColor[1] === 50 && obj.borderColor[2] === 60).toBeTruthy();
  expect(obj.borderRadius).toBe(30);
  expect(obj.isStatic).toBe(false);
  expect(obj.lifespan).toBe(100);
  expect(obj.life).toBe(21);
  expect(obj.burst).toBe(1);
  expect(obj.burstRate).toBe(4);
  expect(obj.emitRadius).toBe(3);
  expect(obj.startColor[0] === 255 && obj.startColor[1] === 255 && obj.startColor[2] === 255).toBeTruthy();
  expect(obj.endColor[0] === 255 && obj.endColor[1] === 0 && obj.endColor[2] === 0).toBeTruthy();
  expect(typeof obj.particleOptions).toBe('object');
  expect(obj.particleOptions.width).toBe(30);
  expect(obj.particleOptions.height).toBe(30);
  expect(obj.particleOptions.lifespan).toBe(100);
  expect(obj.particleOptions.borderRadius).toBe(200);
  expect(obj.particleOptions.checkWorldEdges).toBe(true);
  expect(obj.particleOptions.acceleration.x).toBe(10);
  expect(obj.particleOptions.acceleration.y).toBe(10);
  expect(obj.particleOptions.velocity.x).toBe(20);
  expect(obj.particleOptions.velocity.y).toBe(20);
  expect(obj.particleOptions.location.x).toBe(30);
  expect(obj.particleOptions.location.y).toBe(30);
  expect(obj.particleOptions.maxSpeed).toBe(6);
  expect(obj.particleOptions.fade).toBe(false);
  expect(obj.particleOptions.shrink).toBe(false);
});

test('draw() should assign a css test string to the style property.', () => {
  var obj;

  Burner.System.Classes = {
    ParticleSystem: ParticleSystem
  };

  Burner.System.setup(function() {
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    obj = this.add('ParticleSystem'); // add your new object to the system
  });

  obj.draw();
  expect(obj.el.style.width).toBe('');
  expect(obj.el.style.height).toBe('');
});

test('applyAdditionalForces() should update shrink and opacity properties.', () => {
  var obj;

  Burner.System.Classes = {
    ParticleSystem: ParticleSystem
  };

  Burner.System.setup(function() {
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    obj = this.add('ParticleSystem', {
      burstRate: 1,
      life: 0,
      lifespan: 1,
      particleOptions: {
        acceleration: new Burner.Vector(50, 50)
      }
    });
  });

  expect(obj.initParticleAcceleration.x).toBe(50);
  expect(obj.initParticleAcceleration.y).toBe(50);
  expect(obj.clock).toBe(0);
  expect(typeof obj.beforeStep).toBe('function');

  Burner.System._stepForward();

  expect(Burner.System._records.length).toBe(3);

  Burner.System._stepForward();

  expect(Burner.System.getAllItemsByName('ParticleSystem').length).toBe(0);
});
