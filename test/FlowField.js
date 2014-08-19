var Burner = require('Burner'),
    test = require('tape'),
    FlowField, obj;

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

test('load FlowField.', function(t) {
  FlowField = require('../src/FlowField').FlowField;
  t.ok(FlowField, 'object loaded');
  t.end();
});

test('new FlowField() should have default properties.', function(t) {

  beforeTest();

  Burner.System.Classes = {
    FlowField: FlowField
  };

  Burner.System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    obj = new FlowField();
    obj.init(world);
  });

  t.notEqual(obj.name, 'FlowField', 'System.add() should pass name.');
  t.equal(obj.resolution, 50, 'default resolution.');
  t.equal(obj.perlinSpeed, 0.01, 'default perlinSpeed.');
  t.equal(obj.perlinTime, 100, 'default perlinTime.');
  t.equal(obj.field, null, 'default field.');
  t.equal(obj.createMarkers, false, 'default createMarkers.');
  t.ok(obj.world instanceof Burner.World, 'default world.');

  t.end();
});

test('new FlowField() should have custom properties.', function(t) {

  beforeTest();

  Burner.System.Classes = {
    FlowField: FlowField
  };

  Burner.System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    obj = this.add('FlowField', {
      resolution: 100,
      perlinSpeed: 1,
      perlinTime: 1000,
      field: {x: 10},
      createMarkers: true
    });
  });

  t.equal(obj.resolution, 100, 'custom resolution.');
  t.equal(obj.perlinSpeed, 1, 'custom perlinSpeed.');
  t.equal(obj.perlinTime, 1000, 'custom perlinTime.');
  t.equal(obj.field.x, 10, 'custom field.');
  t.equal(obj.createMarkers, true, 'custom createMarkers.');

  t.end();
});

test('build() should build a grid of columns and rows.', function(t) {

  beforeTest();

  Burner.System.Classes = {
    FlowField: FlowField
  };

  var world;

  Burner.System.setup(function() {
    world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });

    obj = this.add('FlowField', {
      createMarkers: true
    });
  });

  obj.build();

  var cols = Math.ceil(obj.world.width / parseFloat(obj.resolution));
  var rows = Math.ceil(obj.world.height / parseFloat(obj.resolution));

  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      t.assert(obj.field[i][j].x >= -1 && obj.field[i][j].x <= 1 && obj.field[i][j].y >= -1 && obj.field[i][j].y <= 1, 'flowField column: ' + i + ' row: ' + j + ' vector x and y are both bw 1 and -1.');
    }
  }

  t.equal(world.el.querySelectorAll('.flowFieldMarker').length, (cols * rows), 'document.body should a FlowFieldMarker for each col and row.');

  t.end();
});


