var Burner = require('burner'),
    test = require('tape'),
    Stimulus, obj;

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

test('load Stimulus.', function(t) {
  Stimulus = require('../src/Stimulus');
  t.ok(Stimulus, 'object loaded');
  t.end();
});

test('check static properties', function(t) {
  beforeTest();
  t.equal(typeof Stimulus.borderStyles, 'object', 'has a borderStyles array.');
  t.equal(typeof Stimulus.palettes, 'object', 'has a palettes object.');
  t.equal(typeof Stimulus.borderColors, 'object', 'has a borderColors object.');
  t.equal(typeof Stimulus.boxShadowColors, 'object', 'has a boxShadowColors object.');
  t.end();
});

test('new Stimulus() should have default properties.', function(t) {

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

    obj = new Stimulus();
    obj.init(world, {
      type: 'heat'
    });
  });

  t.notEqual(obj.name, 'Stimulus', 'System.add() should pass name.');
  t.equal(obj.type, 'heat', 'type.');
  t.equal(obj.width, 50, 'default width.');
  t.equal(obj.height, 50, 'default height.');
  t.equal(obj.mass, 50, 'default mass.');
  t.equal(obj.isStatic, true, 'default isStatic.');
  t.equal(obj.opacity, 0.75, 'default opacity.');

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

    t.throws(function () {
     this.add('Stimulus');
    }, 'should throw exception when not passed a "type" parameter.');

    t.throws(function () {
     this.add('Stimulus', {
      type: 100
     });
    }, 'should throw exception when "type" parameter is not a string.');
  });

  t.end();
});

test('new Stimulus() should have custom properties.', function(t) {

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

    obj = this.add('Stimulus', {
      type: 'cold',
      width: 30,
      height: 30,
      mass: 100,
      isStatic: false,
      opacity: 0.25
    });
  });

  t.equal(obj.type, 'cold', 'type.');
  t.equal(obj.width, 30, 'custom width.');
  t.equal(obj.height, 30, 'custom height.');
  t.equal(obj.mass, 100, 'custom mass.');
  t.equal(obj.isStatic, false, 'custom isStatic.');
  t.equal(obj.opacity, 0.25, 'custom opacity.');

  t.end();
});

test('init() should set additional properties.', function(t) {

  // test all color ranges

  beforeTest();

  var obj, heat, cold, light, oxygen, customHeat, customStimulus, defaultStimulus;

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
  t.assert(cold.color[0] >= 88 && cold.color[0] <= 171, 'cold r color.');
  t.assert(cold.color[1] >= 129 && cold.color[1] <= 244, 'cold g color.');
  t.assert(cold.color[2] >= 135 && cold.color[2] <= 255, 'cold b color.');
  t.assert(cold.borderColor[0] >= 88 && cold.borderColor[0] <= 171, 'cold r borderColor.');
  t.assert(cold.borderColor[1] >= 129 && cold.borderColor[1] <= 244, 'cold g borderColor.');
  t.assert(cold.borderColor[2] >= 135 && cold.borderColor[2] <= 255, 'cold b borderColor.');
  t.assert(cold.boxShadowColor[0] === 132 && cold.boxShadowColor[1] === 192 && cold.boxShadowColor[2] === 201, 'cold rgb boxShadowColor.');

  // food
  t.assert(food.color[0] <= 186 && food.color[0] >= 84, 'food r color.');
  t.assert(food.color[1] <= 255 && food.color[1] >= 187, 'food g color.');
  t.assert(food.color[2] <= 130 && food.color[2] >= 0, 'food b color.');
  t.assert(food.borderColor[0] <= 186 && food.borderColor[0] >= 84, 'food r borderColor.');
  t.assert(food.borderColor[1] <= 255 && food.borderColor[1] >= 187, 'food g borderColor.');
  t.assert(food.borderColor[2] <= 130 && food.borderColor[2] >= 0, 'food b borderColor.');
  t.assert(food.boxShadowColor[0] === 57 && food.boxShadowColor[1] === 128 && food.boxShadowColor[2] === 0, 'food rgb boxShadowColor.');

  // heat
  t.assert(heat.color[0] <= 255 && heat.color[0] >= 175, 'heat r color.');
  t.assert(heat.color[1] <= 132 && heat.color[1] >= 47, 'heat g color.');
  t.assert(heat.color[2] <= 86 && heat.color[2] >= 0, 'heat b color.');
  t.assert(heat.borderColor[0] <= 255 && heat.borderColor[0] >= 175, 'heat r borderColor.');
  t.assert(heat.borderColor[1] <= 132 && heat.borderColor[1] >= 47, 'heat g borderColor.');
  t.assert(heat.borderColor[2] <= 86 && heat.borderColor[2] >= 0, 'heat b borderColor.');
  t.assert(heat.boxShadowColor[0] === 255 && heat.boxShadowColor[1] === 69 && heat.boxShadowColor[2] === 0, 'heat rgb boxShadowColor.');

  // light
  t.assert(light.color[0] <= 255 && light.color[0] >= 189, 'light r color.');
  t.assert(light.color[1] <= 255 && light.color[1] >= 148, 'light g color.');
  t.assert(light.color[2] <= 255 && light.color[2] >= 0, 'light b color.');
  t.assert(light.borderColor[0] <= 255 && light.borderColor[0] >= 189, 'light r borderColor.');
  t.assert(light.borderColor[1] <= 255 && light.borderColor[1] >= 148, 'light g borderColor.');
  t.assert(light.borderColor[2] <= 255 && light.borderColor[2] >= 0, 'light b borderColor.');
  t.assert(light.boxShadowColor[0] === 255 && light.boxShadowColor[1] === 200 && light.boxShadowColor[2] === 0, 'light rgb boxShadowColor.');

  // oxygen
  t.assert(oxygen.color[0] <= 130 && oxygen.color[0] >= 49, 'oxygen r color.');
  t.assert(oxygen.color[1] <= 136 && oxygen.color[1] >= 56, 'oxygen g color.');
  t.assert(oxygen.color[2] <= 255 && oxygen.color[2] >= 205, 'oxygen b color.');
  t.assert(oxygen.borderColor[0] <= 130 && oxygen.borderColor[0] >= 49, 'oxygen r borderColor.');
  t.assert(oxygen.borderColor[1] <= 136 && oxygen.borderColor[1] >= 56, 'oxygen g borderColor.');
  t.assert(oxygen.borderColor[2] <= 255 && oxygen.borderColor[2] >= 205, 'oxygen b borderColor.');
  t.assert(oxygen.boxShadowColor[0] === 60 && oxygen.boxShadowColor[1] === 64 && oxygen.boxShadowColor[2] === 140, 'oxygen rgb boxShadowColor.');

  // customHeat
  t.assert(customHeat.color[0] === 30, 'customHeat r color.');
  t.assert(customHeat.color[1] === 30, 'customHeat g color.');
  t.assert(customHeat.color[2] === 30, 'customHeat b color.');
  t.assert(customHeat.borderColor[0] === 50, 'customHeat r borderColor.');
  t.assert(customHeat.borderColor[1] === 50, 'customHeat g borderColor.');
  t.assert(customHeat.borderColor[2] === 50, 'customHeat b borderColor.');
  t.assert(customHeat.boxShadowColor[0] === 70 && customHeat.boxShadowColor[1] === 70 && customHeat.boxShadowColor[2] === 70, 'customHeat rgb boxShadowColor.');

  // customStimulus
  t.assert(customStimulus.color[0] === 10, 'customStimulus r color.');
  t.assert(customStimulus.color[1] === 10, 'customStimulus g color.');
  t.assert(customStimulus.color[2] === 10, 'customStimulus b color.');
  t.assert(customStimulus.borderColor[0] === 60, 'customStimulus r borderColor.');
  t.assert(customStimulus.borderColor[1] === 60, 'customStimulus g borderColor.');
  t.assert(customStimulus.borderColor[2] === 60, 'customStimulus b borderColor.');
  t.assert(customStimulus.boxShadowColor[0] === 100 && customStimulus.boxShadowColor[1] === 100 && customStimulus.boxShadowColor[2] === 100, 'customStimulus rgb boxShadowColor.');

  // defaultStimulus
  t.assert(defaultStimulus.color[0] === 255, 'defaultStimulus r color.');
  t.assert(defaultStimulus.color[1] === 255, 'defaultStimulus g color.');
  t.assert(defaultStimulus.color[2] === 255, 'defaultStimulus b color.');
  t.assert(defaultStimulus.borderColor[0] === 220, 'defaultStimulus r borderColor.');
  t.assert(defaultStimulus.borderColor[1] === 220, 'defaultStimulus g borderColor.');
  t.assert(defaultStimulus.borderColor[2] === 220, 'defaultStimulus b borderColor.');
  t.assert(defaultStimulus.boxShadowColor[0] === 200 && defaultStimulus.boxShadowColor[1] === 200 && defaultStimulus.boxShadowColor[2] === 200, 'defaultStimulus rgb boxShadowColor.');


  //

  beforeTest();

  var objCustom;

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

  t.assert(objDefault.borderWidth >= objDefault.width / 8 && objDefault.borderWidth <= objDefault.width / 2, 'default borderWidth.');
  t.equal(typeof objDefault.borderStyle, 'string', 'default borderStyle.');
  t.equal(objDefault.borderRadius, 100, 'default borderRadius.');
  t.assert(objDefault.boxShadowSpread >= objDefault.width / 8 && objDefault.boxShadowSpread <= objDefault.width / 2, 'default boxShadowSpread.');

  t.equal(objCustom.borderWidth, 10, 'custom borderWidth.');
  t.equal(objCustom.borderStyle, 'dotted', 'custom borderStyle.');
  t.equal(objCustom.borderRadius, 30, 'custom borderRadius.');
  t.equal(objCustom.boxShadowSpread, 20, 'custom boxShadowSpread.');

  //

  t.end();
});
