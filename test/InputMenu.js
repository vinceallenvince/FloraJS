var Burner = require('burner'),
    test = require('tape'),
    config = require('../src/config').config,
    InputMenu, obj;

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

test('load InputMenu.', function(t) {
  InputMenu = require('../src/InputMenu');
  t.ok(InputMenu, 'object loaded');
  t.end();
});

test('new InputMenu() should have default properties.', function(t) {
  beforeTest();
  var obj = new InputMenu();
  t.equal(obj.name, 'InputMenu', 'default name.');
  t.end();
});

test('init() should initialize with default properties.', function(t) {

  beforeTest();

  Burner.System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    obj = new InputMenu();
    obj.init(world);
  });

  t.equal(obj.world instanceof Burner.World, true, 'world.');
  t.equal(obj.position, 'top left', 'default position.');
  t.equal(obj.opacity, 0.75, 'default opacity.');
  t.assert(obj.color[0] === 255 && obj.color[1] === 255 && obj.color[2] === 255, 'default color.');
  t.equal(obj.borderWidth, 0, 'default borderWidth.');
  t.equal(obj.borderStyle, 'none', 'default borderStyle.');
  t.assert(obj.borderColor[0] === 204 && obj.borderColor[1] === 204 && obj.borderColor[2] === 204, 'default borderColor.');
  t.equal(obj.colorMode, 'rgb', 'default colorMode.');

  //

  beforeTest();

  Burner.System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    obj = new InputMenu();
    t.throws(function() {
      obj.init();
    }, 'throws an error when not passed a world.');
  });

  //

  beforeTest();

  Burner.System.Classes = {
    InputMenu: InputMenu
  };

  Burner.System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    obj = this.add('InputMenu');
    obj = this.add('InputMenu');
  });

  t.equal(document.querySelectorAll('.inputMenu').length, 1, 'Adding a second inputMenu removes the first.');

  t.end();
});

test('init() should initialize with custom properties.', function(t) {

  beforeTest();

  Burner.System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    obj = new InputMenu();
    obj.init(world, {
      position: 'bottom center',
      opacity: 0.5,
      color: [200, 200, 200],
      borderWidth: 4,
      borderStyle: 'dotted',
      borderColor: [100, 100, 100]
    });
  });

  t.equal(obj.position, 'bottom center', 'custom position.');
  t.equal(obj.opacity, 0.5, 'custom opacity.');
  t.assert(obj.color[0] === 200 && obj.color[1] === 200 && obj.color[2] === 200, 'custom color.');
  t.equal(obj.borderWidth, 4, 'custom borderWidth.');
  t.equal(obj.borderStyle, 'dotted', 'custom borderStyle.');
  t.assert(obj.borderColor[0] === 100 && obj.borderColor[1] === 100 && obj.borderColor[2] === 100, 'custom borderColor.');
  t.end();
});

test('init() should append caption element to DOM.', function(t) {

  config.keyMap = {
    pause: 70,
    resetSystem: 72,
    stats: 73
  };

  beforeTest();

  Burner.System.Classes = {
    InputMenu: InputMenu
  };

  Burner.System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    obj = this.add('InputMenu', {
      text: 'hello goodbye',
      borderColor: 'transparent'
    });
  });

  var inputMenu = document.getElementById('inputMenu');
  t.ok(inputMenu, 'World appends inputMenu.');
  t.equal(inputMenu.className, 'inputMenu inputMenuTop inputMenuLeft ', 'classNames')
  t.equal(inputMenu.style.opacity, '0.75', 'style opacity.');
  t.equal(inputMenu.style.color, 'rgb(255, 255, 255)', 'style color.');
  t.equal(inputMenu.style.borderWidth, '0px', 'style borderWidth.');
  t.equal(inputMenu.style.borderStyle, 'none', 'style borderStyle.');
  t.equal(inputMenu.style.borderColor, 'transparent', 'style borderColor.');
  t.equal(inputMenu.style.zIndex, '100', 'style zIndex.');
  t.equal(inputMenu.firstChild.textContent, '\'f\' = pause | \'h\' = reset | \'i\' = stats', 'inputMenu text.');
  t.end();
});

test('remove() should remove caption.', function(t) {

  beforeTest();

  Burner.System.Classes = {
    InputMenu: InputMenu
  };

  Burner.System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    obj = this.add('InputMenu');
  });

  obj.remove();
  var inputMenu = document.getElementById('inputMenu');
  t.notOk(inputMenu, 'inputMenu removed.');
  t.end();
});
