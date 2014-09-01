var Burner = require('burner'),
    test = require('tape'),
    FlowFieldMarker, obj;

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

test('load FlowFieldMarker.', function(t) {
  FlowFieldMarker = require('../src/flowfieldmarker');
  t.ok(FlowFieldMarker, 'object loaded');
  t.end();
});

test('new FlowFieldMarker() should have default properties.', function(t) {

  beforeTest();

  Burner.System.Classes = {
    FlowFieldMarker: FlowFieldMarker
  };

  var marker;

  Burner.System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    obj = new FlowFieldMarker();
    marker = obj.init({ // create the marker
      location: new Burner.Vector(),
      scale: 1,
      opacity: 0.5,
      width: 50,
      height: 25,
      field: {},
      angle: 30,
      colorMode: 'rgb',
      color: [200, 100, 50],
      borderRadius: 0,
      zIndex: 0
    });
  });

  t.equal(marker.className, 'flowFieldMarker item', 'should return a DOM element representing a FlowFieldMarker.');
  t.equal(marker.style.width, '50px', 'should have correct styles.');

  t.end();
});

test('new FlowFieldMarker() should have default properties.', function(t) {

  beforeTest();

  Burner.System.Classes = {
    FlowFieldMarker: FlowFieldMarker
  };

  var marker;

  Burner.System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    obj = new FlowFieldMarker();
    t.throws(function () {
      obj.init();
    }, 'throws an error if options are not passed.');
  });

  t.end();
});




