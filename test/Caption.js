var Burner = require('Burner'),
    test = require('tape'),
    Caption, obj;

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

test('load Caption.', function(t) {
  Caption = require('../src/Caption').Caption;
  t.ok(Caption, 'object loaded');
  t.end();
});

test('new Caption() should have default properties.', function(t) {
  beforeTest();
  var obj = new Caption();
  t.equal(obj.name, 'Caption', 'default name.');
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

    obj = new Caption();
    obj.init(world);
  });

  t.equal(obj.world instanceof Burner.World, true, 'world.');
  t.equal(obj.position, 'top left', 'default position.');
  t.equal(obj.text, '', 'default text.');
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

    obj = new Caption();
    t.throws(function() {
      obj.init();
    }, 'throws an error when not passed a world.');
  });

  //

  beforeTest();

  Burner.System.Classes = {
    Caption: Caption
  };

  Burner.System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    obj = this.add('Caption', {
      text: 'bye'
    });
    obj = this.add('Caption', {
      text: 'hi'
    });
  });

  var caption = document.getElementById('caption');
  t.equal(caption.firstChild.textContent, 'hi', 'Adding a second caption removes the first.');

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

    obj = new Caption();
    obj.init(world, {
      position: 'bottom center',
      text: 'hello',
      opacity: 0.5,
      color: [200, 200, 200],
      borderWidth: 4,
      borderStyle: 'dotted',
      borderColor: [100, 100, 100]
    });
  });

  t.equal(obj.position, 'bottom center', 'custom position.');
  t.equal(obj.text, 'hello', 'custom text.');
  t.equal(obj.opacity, 0.5, 'custom opacity.');
  t.assert(obj.color[0] === 200 && obj.color[1] === 200 && obj.color[2] === 200, 'custom color.');
  t.equal(obj.borderWidth, 4, 'custom borderWidth.');
  t.equal(obj.borderStyle, 'dotted', 'custom borderStyle.');
  t.assert(obj.borderColor[0] === 100 && obj.borderColor[1] === 100 && obj.borderColor[2] === 100, 'custom borderColor.');
  t.end();
});

test('init() should append caption element to DOM.', function(t) {

  beforeTest();

  Burner.System.Classes = {
    Caption: Caption
  };

  Burner.System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    obj = this.add('Caption', {
      text: 'hello goodbye',
      borderColor: 'transparent'
    });
  });

  var caption = document.getElementById('caption');
  t.ok(caption, 'World appends caption.');
  t.equal(caption.className, 'caption captionTop captionLeft ', 'classNames')
  t.equal(caption.style.opacity, '0.75', 'style opacity.');
  t.equal(caption.style.color, 'rgb(255, 255, 255)', 'style color.');
  t.equal(caption.style.borderWidth, '0px', 'style borderWidth.');
  t.equal(caption.style.borderStyle, 'none', 'style borderStyle.');
  t.equal(caption.style.borderColor, 'transparent', 'style borderColor.');
  t.equal(caption.style.zIndex, '100', 'style zIndex.');
  t.equal(caption.firstChild.textContent, 'hello goodbye', 'caption text.');
  t.end();
});

test('update() should update caption text.', function(t) {

  beforeTest();

  Burner.System.Classes = {
    Caption: Caption
  };

  Burner.System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    obj = this.add('Caption', {
      text: 'red yellow blue',
      borderColor: 'transparent'
    });
  });

  obj.update('green purple cyan');
  var caption = document.getElementById('caption');
  t.equal(caption.firstChild.textContent, 'green purple cyan', 'updated caption text.');
  t.end();
});

test('remove() should remove caption.', function(t) {

  beforeTest();

  Burner.System.Classes = {
    Caption: Caption
  };

  Burner.System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    obj = this.add('Caption', {
      text: 'red yellow blue',
      borderColor: 'transparent'
    });
  });

  obj.remove();
  var caption = document.getElementById('caption');
  t.notOk(caption, 'caption removed.');
  t.end();
});
