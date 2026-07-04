import { test, expect, beforeEach } from 'vitest';
import Burner from '../src/vendor/burner/main';
import Particle from '../src/particle';

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

test('load Particle.', () => {
  expect(Particle).toBeTruthy();
});

test('new Particle() should have default properties.', () => {
  Burner.System.Classes = {
    Particle: Particle
  };

  Burner.System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    obj = new Particle();
    obj.init(world);
  });

  expect(obj.name).not.toBe('Particle');
  expect(obj.width).toBe(20);
  expect(obj.height).toBe(20);
  expect(obj.lifespan).toBe(50);
  expect(obj.life).toBe(0);
  expect(obj.fade).toBe(true);
  expect(obj.shrink).toBe(true);
  expect(obj.checkWorldEdges).toBe(false);
  expect(obj.maxSpeed).toBe(4);
  expect(obj.zIndex).toBe(1);
  expect(obj.color[0] === 200 && obj.color[1] === 200 && obj.color[2] === 200).toBeTruthy();
  expect(obj.borderWidth).toBe(obj.width / 4);
  expect(obj.boxShadowSpread).toBe(obj.width / 4);
  expect(obj.borderRadius).toBe(100);
});

test('new Particle() should accept custom properties.', () => {
  Burner.System.Classes = {
    Particle: Particle
  };

  Burner.System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    obj = this.add('Particle', {
      width: 10,
      height: 10,
      lifespan: 10,
      life: 3,
      fade: false,
      shrink: false,
      checkWorldEdges: true,
      maxSpeed: 8,
      zIndex: 10,
      color: [100, 100, 100],
      borderWidth: 8,
      boxShadowSpread: 16,
      borderRadius: 30
    });
  });

  expect(obj.width).toBe(10);
  expect(obj.height).toBe(10);
  expect(obj.lifespan).toBe(10);
  expect(obj.life).toBe(3);
  expect(obj.fade).toBe(false);
  expect(obj.shrink).toBe(false);
  expect(obj.checkWorldEdges).toBe(true);
  expect(obj.maxSpeed).toBe(8);
  expect(obj.zIndex).toBe(10);
  expect(obj.color[0] === 100 && obj.color[1] === 100 && obj.color[2] === 100).toBeTruthy();
  expect(obj.borderWidth).toBe(8);
  expect(obj.boxShadowSpread).toBe(16);
  expect(obj.borderRadius).toBe(30);
});

test('draw() should assign a css test string to the style property.', () => {
  var obj;

  Burner.System.Classes = {
    Particle: Particle
  };

  Burner.System.setup(function() {
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    obj = this.add('Particle', {
      borderWidth: 8,
      boxShadowSpread: 16
    }); // add your new object to the system
    obj.draw();
  });

  expect(obj.el.style.width).toBe('20px');
  expect(obj.el.style.height).toBe('20px');
  expect(obj.el.style.backgroundColor).toBe('rgb(200, 200, 200)');
  expect(obj.el.style.borderTopWidth).toBe('8px');
  expect(obj.el.style.borderRightWidth).toBe('8px');
  expect(obj.el.style.borderBottomWidth).toBe('8px');
  expect(obj.el.style.borderLeftWidth).toBe('8px');
  expect(obj.el.style.borderTopStyle).toBe('none');
  expect(obj.el.style.borderRightStyle).toBe('none');
  expect(obj.el.style.borderBottomStyle).toBe('none');
  expect(obj.el.style.borderLeftStyle).toBe('none');
  expect(obj.el.style.borderTopColor).toBe('rgb(0, 0, 0)');
  expect(obj.el.style.borderRightColor).toBe('rgb(0, 0, 0)');
  expect(obj.el.style.borderBottomColor).toBe('rgb(0, 0, 0)');
  expect(obj.el.style.borderLeftColor).toBe('rgb(0, 0, 0)');
  // jsdom does not expand the border-radius shorthand into longhand
  // properties, so assert on the shorthand.
  expect(obj.el.style.borderRadius.search('100%')).not.toBe(-1);
  expect(obj.el.style.boxShadow.search('0px 0px 0px 16px')).not.toBe(-1);
  expect(obj.el.style.opacity).toBe('1');
  expect(obj.el.style.zIndex).toBe('1');
});

test('applyAdditionalForces() should update shrink and opacity properties.', () => {
  var obj;

  Burner.System.Classes = {
    Particle: Particle
  };

  Burner.System.setup(function() {
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    obj = this.add('Particle', {
      life: 5,
      lifespan: 10
    }); // add your new object to the system
  });

  obj.afterStep();

  expect(obj.opacity).toBe(0.5);
  expect(obj.width).toBe(10);
  expect(obj.height).toBe(10);
});
