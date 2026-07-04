import { test, expect, beforeEach } from 'vitest';
import Burner from '../src/vendor/burner/main';
import Stimulus from '../src/stimulus';

let obj;

function beforeTest() {
  Burner.System.setupFunc = function() {};
  Burner.System._resetSystem();
  document.body.innerHTML = '';
  var world = document.createElement('div');
  world.id = 'world';
  world.style.position = 'absolute';
  world.style.top = '0';
  world.style.left = '0';
  document.body.appendChild(world);
}

beforeEach(beforeTest);

test('load Stimulus.', () => {
  expect(Stimulus).toBeTruthy();
});

test('check static properties', () => {
  expect(typeof Stimulus.borderStyles).toBe('object');
  expect(typeof Stimulus.palettes).toBe('object');
  expect(typeof Stimulus.borderColors).toBe('object');
  expect(typeof Stimulus.boxShadowColors).toBe('object');
});

test('new Stimulus() should have default properties.', () => {
  Burner.System.Classes = {
    Stimulus: Stimulus
  };

  Burner.System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    obj = new Stimulus();
    obj.init(world, {
      type: 'heat'
    });
  });

  expect(obj.name).not.toBe('Stimulus');
  expect(obj.type).toBe('heat');
  expect(obj.width).toBe(50);
  expect(obj.height).toBe(50);
  expect(obj.mass).toBe(50);
  expect(obj.isStatic).toBe(true);
  expect(obj.opacity).toBe(0.75);

  //

  beforeTest();

  Burner.System.Classes = {
    Stimulus: Stimulus
  };

  Burner.System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    // should throw exception when not passed a "type" parameter.
    expect(function() {
      this.add('Stimulus');
    }).toThrow();

    // should throw exception when "type" parameter is not a string.
    expect(function() {
      this.add('Stimulus', {
        type: 100
      });
    }).toThrow();
  });
});

test('new Stimulus() should have custom properties.', () => {
  Burner.System.Classes = {
    Stimulus: Stimulus
  };

  Burner.System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    obj = this.add('Stimulus', {
      type: 'cold',
      width: 30,
      height: 30,
      mass: 100,
      isStatic: false,
      opacity: 0.25
    });
  });

  expect(obj.type).toBe('cold');
  expect(obj.width).toBe(30);
  expect(obj.height).toBe(30);
  expect(obj.mass).toBe(100);
  expect(obj.isStatic).toBe(false);
  expect(obj.opacity).toBe(0.25);
});

test('init() should set additional properties.', () => {
  // test all color ranges

  var obj, heat, cold, food, light, oxygen, customHeat, customStimulus, defaultStimulus;

  Burner.System.Classes = {
    Stimulus: Stimulus
  };

  Burner.System.setup(function() {
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    cold = this.add('Stimulus', {
      type: 'cold'
    });
    food = this.add('Stimulus', {
      type: 'food'
    });
    heat = this.add('Stimulus', {
      type: 'heat'
    });
    light = this.add('Stimulus', {
      type: 'light'
    });
    oxygen = this.add('Stimulus', {
      type: 'oxygen'
    });
    customHeat = this.add('Stimulus', {
      type: 'heat',
      color: [30, 30, 30],
      borderColor: [50, 50, 50],
      boxShadowColor: [70, 70, 70]
    });
    customStimulus = this.add('Stimulus', {
      type: 'hello',
      color: [10, 10, 10],
      borderColor: [60, 60, 60],
      boxShadowColor: [100, 100, 100]
    });
    defaultStimulus = this.add('Stimulus', {
      type: 'hello'
    });
  });

  // cold
  expect(cold.color[0] >= 88 && cold.color[0] <= 171).toBeTruthy();
  expect(cold.color[1] >= 129 && cold.color[1] <= 244).toBeTruthy();
  expect(cold.color[2] >= 135 && cold.color[2] <= 255).toBeTruthy();
  expect(cold.borderColor[0] >= 88 && cold.borderColor[0] <= 171).toBeTruthy();
  expect(cold.borderColor[1] >= 129 && cold.borderColor[1] <= 244).toBeTruthy();
  expect(cold.borderColor[2] >= 135 && cold.borderColor[2] <= 255).toBeTruthy();
  expect(cold.boxShadowColor[0] === 132 && cold.boxShadowColor[1] === 192 && cold.boxShadowColor[2] === 201).toBeTruthy();

  // food
  expect(food.color[0] <= 186 && food.color[0] >= 84).toBeTruthy();
  expect(food.color[1] <= 255 && food.color[1] >= 187).toBeTruthy();
  expect(food.color[2] <= 130 && food.color[2] >= 0).toBeTruthy();
  expect(food.borderColor[0] <= 186 && food.borderColor[0] >= 84).toBeTruthy();
  expect(food.borderColor[1] <= 255 && food.borderColor[1] >= 187).toBeTruthy();
  expect(food.borderColor[2] <= 130 && food.borderColor[2] >= 0).toBeTruthy();
  expect(food.boxShadowColor[0] === 57 && food.boxShadowColor[1] === 128 && food.boxShadowColor[2] === 0).toBeTruthy();

  // heat
  expect(heat.color[0] <= 255 && heat.color[0] >= 175).toBeTruthy();
  expect(heat.color[1] <= 132 && heat.color[1] >= 47).toBeTruthy();
  expect(heat.color[2] <= 86 && heat.color[2] >= 0).toBeTruthy();
  expect(heat.borderColor[0] <= 255 && heat.borderColor[0] >= 175).toBeTruthy();
  expect(heat.borderColor[1] <= 132 && heat.borderColor[1] >= 47).toBeTruthy();
  expect(heat.borderColor[2] <= 86 && heat.borderColor[2] >= 0).toBeTruthy();
  expect(heat.boxShadowColor[0] === 255 && heat.boxShadowColor[1] === 69 && heat.boxShadowColor[2] === 0).toBeTruthy();

  // light
  expect(light.color[0] <= 255 && light.color[0] >= 189).toBeTruthy();
  expect(light.color[1] <= 255 && light.color[1] >= 148).toBeTruthy();
  expect(light.color[2] <= 255 && light.color[2] >= 0).toBeTruthy();
  expect(light.borderColor[0] <= 255 && light.borderColor[0] >= 189).toBeTruthy();
  expect(light.borderColor[1] <= 255 && light.borderColor[1] >= 148).toBeTruthy();
  expect(light.borderColor[2] <= 255 && light.borderColor[2] >= 0).toBeTruthy();
  expect(light.boxShadowColor[0] === 255 && light.boxShadowColor[1] === 200 && light.boxShadowColor[2] === 0).toBeTruthy();

  // oxygen
  expect(oxygen.color[0] <= 130 && oxygen.color[0] >= 49).toBeTruthy();
  expect(oxygen.color[1] <= 136 && oxygen.color[1] >= 56).toBeTruthy();
  expect(oxygen.color[2] <= 255 && oxygen.color[2] >= 205).toBeTruthy();
  expect(oxygen.borderColor[0] <= 130 && oxygen.borderColor[0] >= 49).toBeTruthy();
  expect(oxygen.borderColor[1] <= 136 && oxygen.borderColor[1] >= 56).toBeTruthy();
  expect(oxygen.borderColor[2] <= 255 && oxygen.borderColor[2] >= 205).toBeTruthy();
  expect(oxygen.boxShadowColor[0] === 60 && oxygen.boxShadowColor[1] === 64 && oxygen.boxShadowColor[2] === 140).toBeTruthy();

  // customHeat
  expect(customHeat.color[0] === 30).toBeTruthy();
  expect(customHeat.color[1] === 30).toBeTruthy();
  expect(customHeat.color[2] === 30).toBeTruthy();
  expect(customHeat.borderColor[0] === 50).toBeTruthy();
  expect(customHeat.borderColor[1] === 50).toBeTruthy();
  expect(customHeat.borderColor[2] === 50).toBeTruthy();
  expect(customHeat.boxShadowColor[0] === 70 && customHeat.boxShadowColor[1] === 70 && customHeat.boxShadowColor[2] === 70).toBeTruthy();

  // customStimulus
  expect(customStimulus.color[0] === 10).toBeTruthy();
  expect(customStimulus.color[1] === 10).toBeTruthy();
  expect(customStimulus.color[2] === 10).toBeTruthy();
  expect(customStimulus.borderColor[0] === 60).toBeTruthy();
  expect(customStimulus.borderColor[1] === 60).toBeTruthy();
  expect(customStimulus.borderColor[2] === 60).toBeTruthy();
  expect(customStimulus.boxShadowColor[0] === 100 && customStimulus.boxShadowColor[1] === 100 && customStimulus.boxShadowColor[2] === 100).toBeTruthy();

  // defaultStimulus
  expect(defaultStimulus.color[0] === 255).toBeTruthy();
  expect(defaultStimulus.color[1] === 255).toBeTruthy();
  expect(defaultStimulus.color[2] === 255).toBeTruthy();
  expect(defaultStimulus.borderColor[0] === 220).toBeTruthy();
  expect(defaultStimulus.borderColor[1] === 220).toBeTruthy();
  expect(defaultStimulus.borderColor[2] === 220).toBeTruthy();
  expect(defaultStimulus.boxShadowColor[0] === 200 && defaultStimulus.boxShadowColor[1] === 200 && defaultStimulus.boxShadowColor[2] === 200).toBeTruthy();

  //

  beforeTest();

  var objDefault, objCustom;

  Burner.System.Classes = {
    Stimulus: Stimulus
  };

  Burner.System.setup(function() {
    this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    objDefault = this.add('Stimulus', {
      type: 'heat'
    });
    objCustom = this.add('Stimulus', {
      type: 'heat',
      borderWidth: 10,
      borderStyle: 'dotted',
      borderRadius: 30,
      boxShadowSpread: 20
    });
  });

  expect(objDefault.borderWidth >= objDefault.width / 8 && objDefault.borderWidth <= objDefault.width / 2).toBeTruthy();
  expect(typeof objDefault.borderStyle).toBe('string');
  expect(objDefault.borderRadius).toBe(100);
  expect(objDefault.boxShadowSpread >= objDefault.width / 8 && objDefault.boxShadowSpread <= objDefault.width / 2).toBeTruthy();

  expect(objCustom.borderWidth).toBe(10);
  expect(objCustom.borderStyle).toBe('dotted');
  expect(objCustom.borderRadius).toBe(30);
  expect(objCustom.boxShadowSpread).toBe(20);
});
