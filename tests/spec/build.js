var interfaceCheck = exports.Interface;

describe("A new Attractor", function() {

  var system, obj;

  beforeEach(function() {
    system = new exports.FloraSystem();
    obj = new exports.Attractor();
  });

  afterEach(function() {
    system.destroy();
  });

  it("should have its required properties.", function() {
    expect(typeof obj.G).toEqual('number');
    expect(typeof obj.mass).toEqual('number');
    expect(typeof obj.isStatic).toEqual('boolean');
    expect(typeof obj.width).toEqual('number');
    expect(typeof obj.height).toEqual('number');
    expect(typeof obj.color).toEqual('object');
    expect(typeof obj.opacity).toEqual('number');
    expect(obj.constructor.name).toEqual('Attractor');
  });
});


describe("A new BorderPalette", function() {

  var system, obj;

  beforeEach(function() {
    system = new exports.FloraSystem();
    obj = new exports.BorderPalette();
  });

  afterEach(function() {
    system.destroy();
  });

  it("should have its required properties.", function() {
    expect(interfaceCheck.getDataType(obj.borders)).toEqual('array');
    expect(obj.constructor.name).toEqual('BorderPalette');
  });

  it("should have an addBorder() method that pushed border styles (strings) on to a borders property.", function() {
    expect(interfaceCheck.getDataType(obj.addBorder)).toEqual('function');

    obj.addBorder({
      min: 2,
      max: 8,
      style: 'dotted'
    });

    expect(obj.borders.length).toBeGreaterThan(1);
    expect(obj.borders.length).toBeLessThan(9);
    expect(interfaceCheck.getDataType(obj.borders[0])).toEqual('string');
  });

  it("should have have a method that returns a string representing a border from the borders property", function() {
    expect(interfaceCheck.getDataType(obj.getBorder)).toEqual('function');

    obj.addBorder({
      min: 2,
      max: 8,
      style: 'dotted'
    });

    var border = obj.getBorder();

    expect(interfaceCheck.getDataType(border)).toEqual('string');
  });
});

describe("A new Camera", function() {

  var system, obj;

  beforeEach(function() {
    system = new exports.FloraSystem();
    obj = new exports.Camera();
  });

  afterEach(function() {
    system.destroy();
  });

  it("should have its required properties.", function() {
    expect(typeof obj.location).toEqual('object');
    expect(obj.constructor.name).toEqual('Camera');
  });
});

describe("A new Caption", function() {

  var system, obj;

  beforeEach(function() {
    system = new exports.FloraSystem();
    obj = new exports.Caption();
  });

  afterEach(function() {
    system.destroy();
  });

  it("should have its required properties.", function() {
    expect(typeof obj.position).toEqual('string');
    expect(typeof obj.text).toEqual('string');
    expect(typeof obj.opacity).toEqual('number');
    expect(typeof obj.el).toEqual('object');
    expect(obj.constructor.name).toEqual('Caption');
  });
});

describe("A new Cold", function() {

  var system, obj;

  beforeEach(function() {
    system = new exports.FloraSystem();
    obj = new exports.Cold();
  });

  afterEach(function() {
    system.destroy();
  });

  it("should have its required properties.", function() {
    expect(typeof obj.mass).toEqual('number');
    expect(typeof obj.isStatic).toEqual('boolean');
    expect(typeof obj.width).toEqual('number');
    expect(typeof obj.height).toEqual('number');
    expect(typeof obj.opacity).toEqual('number');
    expect(obj.constructor.name).toEqual('Cold');
  });
});

describe("A new ColorPalette", function() {

  var system, obj;

  beforeEach(function() {
    system = new exports.FloraSystem();
    obj = new exports.ColorPalette();
  });

  afterEach(function() {
    system.destroy();
  });

  it("should have its required properties.", function() {
    expect(interfaceCheck.getDataType(obj.gradients)).toEqual('array');
    expect(interfaceCheck.getDataType(obj.colors)).toEqual('array');
    expect(obj.constructor.name).toEqual('ColorPalette');
  });

  it("should have a createGradient() method that pushes an array of color arrays on to a gradients property.", function() {

    expect(interfaceCheck.getDataType(obj.createGradient)).toEqual('function');

    obj.createGradient({
      startColor: [255, 0, 0],
      endColor: [0, 0, 0],
      totalColors: 255
    });

    expect(obj.gradients.length).toEqual(1);
    expect(interfaceCheck.getDataType(obj.gradients[0])).toEqual('array');
    expect(interfaceCheck.getDataType(obj.gradients[0][0][0])).toEqual('number');
    expect(interfaceCheck.getDataType(obj.gradients[0][0][1])).toEqual('number');
    expect(interfaceCheck.getDataType(obj.gradients[0][0][2])).toEqual('number');
  });

  it("should have an addColor() method that pushes color arrays on to a colors property.", function() {
    expect(interfaceCheck.getDataType(obj.addColor)).toEqual('function');

    obj.addColor({
      min: 3,
      max: 8,
      startColor: [255, 0, 0],
      endColor: [0, 0, 0]
    });

    expect(obj.colors.length).toBeGreaterThan(2);
    expect(obj.colors.length).toBeLessThan(9);
    expect(interfaceCheck.getDataType(obj.colors[0])).toEqual('array');
    expect(interfaceCheck.getDataType(obj.colors[0][0])).toEqual('number');
    expect(interfaceCheck.getDataType(obj.colors[0][1])).toEqual('number');
    expect(interfaceCheck.getDataType(obj.colors[0][2])).toEqual('number');
  });

  it("should have have a method that returns an array of 3 numeric values representing a color value", function() {
    expect(interfaceCheck.getDataType(obj.getColor)).toEqual('function');

    obj.addColor({
      min: 3,
      max: 8,
      startColor: [255, 0, 0],
      endColor: [0, 0, 0]
    });

    var color = obj.getColor();

    expect(interfaceCheck.getDataType(color)).toEqual('array');
    expect(interfaceCheck.getDataType(color[0])).toEqual('number');
    expect(interfaceCheck.getDataType(color[1])).toEqual('number');
    expect(interfaceCheck.getDataType(color[2])).toEqual('number');
  });
});

describe("A new ColorTable", function() {

  var system, obj;

  beforeEach(function() {
    system = new exports.FloraSystem();
    obj = new exports.ColorTable();
  });

  afterEach(function() {
    system.destroy();
  });

  it("should have its required properties.", function() {
    expect(obj.constructor.name).toEqual('ColorTable');
  });

  it("should have a method that adds an object representing a color range to a 'colors' property.", function() {
    expect(interfaceCheck.getDataType(obj.addColor)).toEqual('function');

    obj.addColor({
      name: 'heat',
      startColor: [255, 0, 0],
      endColor: [0, 0, 0]
    });

    expect(interfaceCheck.getDataType(obj)).toEqual('object');
    expect(interfaceCheck.getDataType(obj.heat)).toEqual('object');
    expect(interfaceCheck.getDataType(obj.heat.startColor)).toEqual('array');
    expect(interfaceCheck.getDataType(obj.heat.startColor[0])).toEqual('number');
    expect(interfaceCheck.getDataType(obj.heat.startColor[1])).toEqual('number');
    expect(interfaceCheck.getDataType(obj.heat.startColor[2])).toEqual('number');
    expect(interfaceCheck.getDataType(obj.heat.endColor)).toEqual('array');
    expect(interfaceCheck.getDataType(obj.heat.endColor[0])).toEqual('number');
    expect(interfaceCheck.getDataType(obj.heat.endColor[1])).toEqual('number');
    expect(interfaceCheck.getDataType(obj.heat.endColor[2])).toEqual('number');
  });

  it("should have a method that accepts a name and range position and returns an array representing a single color.", function() {
    expect(interfaceCheck.getDataType(obj.getColor)).toEqual('function');

    obj.addColor({
      name: 'heat',
      startColor: [255, 0, 0],
      endColor: [0, 0, 0]
    });

    c = obj.getColor('heat');
    expect(interfaceCheck.getDataType(c)).toEqual('object');

    c = obj.getColor('heat', true, true);
    expect(interfaceCheck.getDataType(c)).toEqual('object');

    c = obj.getColor('heat', true);
    expect(interfaceCheck.getDataType(c)).toEqual('array');

    c = obj.getColor('heat', false, true);
    expect(interfaceCheck.getDataType(c)).toEqual('array');

  });
});

describe("A new Connector", function() {

  var system, obj;

  beforeEach(function() {
    system = new exports.FloraSystem();
    obj = new exports.Connector();
  });

  afterEach(function() {
    system.destroy();
  });

  it("should have its required properties.", function() {
    expect(typeof obj.color).toEqual('string');
    expect(typeof obj.zIndex).toEqual('number');
    expect(typeof obj.opacity).toEqual('number');
    expect(typeof obj.width).toEqual('number');
    expect(typeof obj.height).toEqual('number');
    expect(obj.constructor.name).toEqual('Connector');
  });
});

describe("A new ElementList", function() {

  var system;

  beforeEach(function() {
    system = new exports.FloraSystem();
  });

  afterEach(function() {
    system.destroy();
  });

  it("should have its required properties.", function() {
    expect(interfaceCheck.getDataType(exports.elementList.records)).toEqual('array');
  });
  it("all() should return the 'records' array.", function() {
    expect(interfaceCheck.getDataType(exports.elementList.all())).toEqual('array');
  });
  it("getElement() should receive an id and return the corresponding element.", function() {

      var check = true,
          point = new exports.Point(),
          obj = exports.elementList.getElement(point.id);

      expect(typeof obj).toEqual('object');
  });
  it("getAllByClass() should return an array of records with the same constructor.", function() {

    var i, max, check = null,
        point = new exports.Point(),
        arr;

    arr = exports.elementList.getAllByClass('Point');

    expect(interfaceCheck.getDataType(arr)).toEqual('array');

    for (i = 0, max = arr.length; i < max; i++) {
      if (arr[i].constructor.name === 'Point') {
        check = true;
      } else {
        check = false;
      }
    }
    expect(check).toEqual(true);
  });
  it("destroyElement() should receive an id and remove the corresponding element " +
      "from elementList.records and the element's world.", function() {

      var check = true,
          records = exports.elementList.records,
          point = new exports.Point();

      exports.elementList.destroyElement(point.id);

      for (i = 0, max = records.length; i < max; i += 1) {
        if (records[i].id === point.id) {
          check = false;
        }
      }
      expect(check).toEqual(true);
  });
  it("destroyAll() should remove all elements from their world and reset " +
      "the 'records' array.", function() {

      var i, check = true, point;

      for (i = 0; i < 100; i += 1) {
        point = new exports.Point();
      }

      exports.elementList.destroyAll();
      expect(exports.elementList.records.length).toEqual(0);
  });
  it("updatePropsByClass() should update the properties of elements created " +
      "from the same constructor.", function() {

      var i, check = true, point;

      for (i = 0; i < 100; i += 1) {
        point = new exports.Point();
      }

      exports.elementList.updatePropsByClass('Point', {
        color: [0, 0, 0],
        scale: 2
      });

      for (i = 0, max = exports.elementList.records.length; i < max; i += 1) {
        if (exports.elementList.records[i].constructor.name === 'Point' &&
            (!exports.elementList.records[i].color || exports.elementList.records[i].scale !== 2)) {
          check = false;
        }
      }
      expect(check).toEqual(true);
  });
});

describe("A new FlowField", function() {

  var system, obj;

  beforeEach(function() {
    system = new exports.FloraSystem();
    obj = new exports.FlowField();
  });

  afterEach(function() {
    system.destroy();
  });

  it("should have its required properties.", function() {
    expect(typeof obj.resolution).toEqual('number');
    expect(typeof obj.perlinSpeed).toEqual('number');
    expect(typeof obj.perlinTime).toEqual('number');
    expect(typeof obj.createMarkers).toEqual('boolean');
    expect(obj.constructor.name).toEqual('FlowField');
  });
});

describe("A new FlowFieldMarker", function() {

  var system, obj;

  beforeEach(function() {
    system = new exports.FloraSystem();
    obj = new exports.FlowFieldMarker({
      location: {x: 0, y: 0},
      scale: 1,
      angle: 90,
      opacity: 0.75,
      width: 100,
      height: 100,
      colorMode: 'rgb',
      color: [0, 0, 0]
    });
  });

  afterEach(function() {
    system.destroy();
  });

  it("should return a DOM element.", function() {
    expect(obj.className).toEqual('flowFieldMarker floraElement');
    expect(obj.style.width).toEqual('100px');
    expect(obj.style.height).toEqual('100px');
    expect(typeof obj).toEqual('object');
  });
});

describe("A new Food", function() {

  var system, obj;

  beforeEach(function() {
    system = new exports.FloraSystem();
    obj = new exports.Food();
  });

  afterEach(function() {
    system.destroy();
  });

  it("should have its required properties.", function() {
    expect(typeof obj.mass).toEqual('number');
    expect(typeof obj.isStatic).toEqual('boolean');
    expect(typeof obj.width).toEqual('number');
    expect(typeof obj.height).toEqual('number');
    expect(typeof obj.opacity).toEqual('number');
    expect(obj.constructor.name).toEqual('Food');
  });
});

describe("A new Heat", function() {

  var system, obj;

  beforeEach(function() {
    system = new exports.FloraSystem();
    obj = new exports.Heat();
  });

  afterEach(function() {
    system.destroy();
  });

  it("should have its required properties.", function() {
    expect(typeof obj.mass).toEqual('number');
    expect(typeof obj.isStatic).toEqual('boolean');
    expect(typeof obj.width).toEqual('number');
    expect(typeof obj.height).toEqual('number');
    expect(typeof obj.opacity).toEqual('number');
    expect(obj.constructor.name).toEqual('Heat');
  });
});

describe("The Interface", function() {

  var interfaceCheck = exports.Interface,
      requiredOptions,
      options;

  beforeEach(function() {
    requiredOptions = {
      age: 'number',
      name: 'string',
      foods: 'array',
      grades: 'object'
    };
  });

  it("should check that passsed options match required options.", function() {
    options = {
      age: 100,
      name: 'Joey',
      foods: ['ham', 'cheese', 'milk'],
      grades: {
        english: 90,
        math: 80
      }
    };
    expect(interfaceCheck.checkRequiredParams(options, requiredOptions)).toEqual(true);
    options = {
      age: '100',
      name: 'Joey',
      foods: ['ham', 'cheese', 'milk'],
      grades: {
        english: 90,
        math: 80
      }
    };
    expect(interfaceCheck.checkRequiredParams(options, requiredOptions)).toEqual(false);
  });
  it("should correctly check data types.", function() {
    expect(interfaceCheck.getDataType('100')).toEqual('string');
    expect(interfaceCheck.getDataType(100)).toEqual('number');
    expect(interfaceCheck.getDataType([100, '100'])).toEqual('array');
    expect(interfaceCheck.getDataType({100: 100})).toEqual('object');
  });
});

describe("A new Light", function() {

  var system, obj;

  beforeEach(function() {
    system = new exports.FloraSystem();
    obj = new exports.Light();
  });

  afterEach(function() {
    system.destroy();
  });

  it("should have its required properties.", function() {
    expect(typeof obj.mass).toEqual('number');
    expect(typeof obj.isStatic).toEqual('boolean');
    expect(typeof obj.width).toEqual('number');
    expect(typeof obj.height).toEqual('number');
    expect(typeof obj.opacity).toEqual('number');
    expect(typeof obj.constructor.name).toEqual('string');
  });
});

describe("A new Liquid", function() {

  var system, obj;

  beforeEach(function() {
    system = new exports.FloraSystem();
    obj = new exports.Liquid();
  });

  afterEach(function() {
    system.destroy();
  });

  it("should have its required properties.", function() {
    expect(typeof obj.c).toEqual('number');
    expect(typeof obj.mass).toEqual('number');
    expect(typeof obj.isStatic).toEqual('boolean');
    expect(typeof obj.width).toEqual('number');
    expect(typeof obj.height).toEqual('number');
    expect(typeof obj.color).toEqual('object');
    expect(typeof obj.opacity).toEqual('number');
    expect(obj.constructor.name).toEqual('Liquid');
  });
});

describe("A new Mover", function() {

  var system, obj;

  beforeEach(function() {
    system = new exports.FloraSystem();
    obj = new exports.Mover();
  });

  afterEach(function() {
    system.destroy();
  });

  it("should have its required properties.", function() {
    expect(typeof obj.className).toEqual('string');
    expect(typeof obj.mass).toEqual('number');
    expect(typeof obj.maxSpeed).toEqual('number');
    expect(typeof obj.minSpeed).toEqual('number');
    expect(typeof obj.scale).toEqual('number');
    expect(typeof obj.angle).toEqual('number');
    expect(typeof obj.opacity).toEqual('number');
    expect(typeof obj.lifespan).toEqual('number');
    expect(typeof obj.width).toEqual('number');
    expect(typeof obj.height).toEqual('number');
    expect(typeof obj.colorMode).toEqual('string');
    expect(typeof obj.color).toEqual('object');
    expect(typeof obj.zIndex).toEqual('number');
    expect(typeof obj.pointToDirection).toEqual('boolean');
    expect(typeof obj.followMouse).toEqual('boolean');
    expect(typeof obj.isStatic).toEqual('boolean');
    expect(typeof obj.checkEdges).toEqual('boolean');
    expect(typeof obj.wrapEdges).toEqual('boolean');
    expect(typeof obj.avoidEdges).toEqual('boolean');
    expect(typeof obj.avoidEdgesStrength).toEqual('number');
    expect(typeof obj.bounciness).toEqual('number');
    expect(typeof obj.maxSteeringForce).toEqual('number');
    expect(typeof obj.flocking).toEqual('boolean');
    expect(typeof obj.desiredSeparation).toEqual('number');
    expect(typeof obj.separateStrength).toEqual('number');
    expect(typeof obj.alignStrength).toEqual('number');
    expect(interfaceCheck.getDataType(obj.sensors)).toEqual('array');
    expect(typeof obj.flowField).toEqual('object');
    expect(typeof obj.acceleration).toEqual('object');
    expect(typeof obj.velocity).toEqual('object');
    expect(typeof obj.location).toEqual('object');
    expect(typeof obj.controlCamera).toEqual('boolean');
    expect(obj.constructor.name).toEqual('Mover');
  });
});

describe("A new Obj", function() {

  var system, obj;

  beforeEach(function() {
    system = new exports.FloraSystem();
    obj = new exports.Obj({
      hello: 'hello'
    });
  });

  afterEach(function() {
    system.destroy();
  });

  it("should accept all properties passed to the constructor.", function() {
    expect(obj.hello).toEqual('hello');
    expect(obj.constructor.name).toEqual('Obj');
  });
});

describe("A new Oscillator", function() {

  var system, obj;

  beforeEach(function() {
    system = new exports.FloraSystem();
    obj = new exports.Oscillator({
      initialLocation: new exports.Vector()
    });
  });

  afterEach(function() {
    system.destroy();
  });

  it("should have its required properties.", function() {
    expect(typeof obj.initialLocation).toEqual('object');
    expect(typeof obj.lastLocation).toEqual('object');
    expect(typeof obj.amplitude).toEqual('object');
    expect(typeof obj.acceleration).toEqual('object');
    expect(typeof obj.aVelocity).toEqual('object');
    expect(typeof obj.width).toEqual('number');
    expect(typeof obj.height).toEqual('number');
    expect(typeof obj.isStatic).toEqual('boolean');
    expect(typeof obj.isPerlin).toEqual('boolean');
    expect(typeof obj.perlinSpeed).toEqual('number');
    expect(typeof obj.perlinTime).toEqual('number');
    expect(typeof obj.perlinAccelLow).toEqual('number');
    expect(typeof obj.perlinAccelHigh).toEqual('number');
    expect(typeof obj.perlinOffsetX).toEqual('number');
    expect(typeof obj.perlinOffsetY).toEqual('number');
    expect(obj.constructor.name).toEqual('Oscillator');
  });
});

describe("A new Oxygen", function() {

  var system, obj;

  beforeEach(function() {
    system = new exports.FloraSystem();
    obj = new exports.Oxygen();
  });

  afterEach(function() {
    system.destroy();
  });

  it("should have its required properties.", function() {
    expect(typeof obj.mass).toEqual('number');
    expect(typeof obj.isStatic).toEqual('boolean');
    expect(typeof obj.width).toEqual('number');
    expect(typeof obj.height).toEqual('number');
    expect(typeof obj.opacity).toEqual('number');
    expect(obj.constructor.name).toEqual('Oxygen');
  });
});

describe("A new Particle", function() {

  var system, obj;

  beforeEach(function() {
    system = new exports.FloraSystem();
    obj = new exports.Particle();
  });

  afterEach(function() {
    system.destroy();
  });

  it("should have its required properties.", function() {
    expect(typeof obj.lifespan).toEqual('number');
    expect(typeof obj.color).toEqual('object');
    expect(typeof obj.borderRadius).toEqual('string');
    expect(obj.constructor.name).toEqual('Particle');
  });
});

describe("A new ParticleSystem", function() {

  var system, obj;

  beforeEach(function() {
    system = new exports.FloraSystem();
    obj = new exports.ParticleSystem();
  });

  afterEach(function() {
    system.destroy();
  });

  it("should have its required properties.", function() {
    expect(typeof obj.beforeStep).toEqual('function');
    expect(typeof obj.isStatic).toEqual('boolean');
    expect(typeof obj.lifespan).toEqual('number');
    expect(typeof obj.burst).toEqual('number');
    expect(typeof obj.particle).toEqual('function');
    expect(obj.constructor.name).toEqual('ParticleSystem');
  });
});

describe("A new Point", function() {

  var system, obj;

  beforeEach(function() {
    system = new exports.FloraSystem();
    obj = new exports.Point();
  });

  afterEach(function() {
    system.destroy();
  });

  it("should have its required properties.", function() {
    expect(typeof obj.opacity).toEqual('number');
    expect(typeof obj.width).toEqual('number');
    expect(typeof obj.height).toEqual('number');
    expect(typeof obj.isStatic).toEqual('boolean');
    expect(typeof obj.zIndex).toEqual('number');
    expect(typeof obj.offsetAngle).toEqual('number');
    expect(typeof obj.length).toEqual('number');
    expect(obj.constructor.name).toEqual('Point');
  });
});

describe("A new Predator", function() {

  var system, obj;

  beforeEach(function() {
    system = new exports.FloraSystem();
    obj = new exports.Predator();
  });

  afterEach(function() {
    system.destroy();
  });

  it("should have its required properties.", function() {
    expect(typeof obj.mass).toEqual('number');
    expect(typeof obj.isStatic).toEqual('boolean');
    expect(typeof obj.width).toEqual('number');
    expect(typeof obj.height).toEqual('number');
    expect(typeof obj.opacity).toEqual('number');
    expect(obj.constructor.name).toEqual('Predator');
  });
});

describe("A new Repeller", function() {

  var system, obj;

  beforeEach(function() {
    system = new exports.FloraSystem();
    obj = new exports.Repeller();
  });

  afterEach(function() {
    system.destroy();
  });

  it("should have its required properties.", function() {
    expect(typeof obj.G).toEqual('number');
    expect(typeof obj.mass).toEqual('number');
    expect(typeof obj.isStatic).toEqual('boolean');
    expect(typeof obj.width).toEqual('number');
    expect(typeof obj.height).toEqual('number');
    expect(typeof obj.color).toEqual('object');
    expect(typeof obj.opacity).toEqual('number');
    expect(obj.constructor.name).toEqual('Repeller');
  });
});

describe("A new Sensor", function() {

  var system, obj;

  beforeEach(function() {
    system = new exports.FloraSystem();
    obj = new exports.Sensor();
  });

  afterEach(function() {
    system.destroy();
  });

  it("should have its required properties.", function() {
    expect(typeof obj.type).toEqual('string');
    expect(typeof obj.behavior).toEqual('string');
    expect(typeof obj.sensitivity).toEqual('number');
    expect(typeof obj.width).toEqual('number');
    expect(typeof obj.height).toEqual('number');
    expect(typeof obj.offsetDistance).toEqual('number');
    expect(typeof obj.offsetAngle).toEqual('number');
    expect(typeof obj.opacity).toEqual('number');
    expect(typeof obj.target).toEqual('object');
    expect(typeof obj.activated).toEqual('boolean');
    expect(obj.constructor.name).toEqual('Sensor');
  });
});

describe("SimplexNoise", function() {

  var obj, n1, n2;

  beforeEach(function() {
    obj = exports.SimplexNoise;
    n1 = exports.SimplexNoise.noise(0.001, 0.002);
    n2 = exports.SimplexNoise.noise(0.002, 0.002);
  });

  afterEach(function() {
    obj = null;
  });

  it("should create a number.", function() {
    expect(typeof n1).toEqual('number');
  });

  it("should create different numbers as input parameters change.", function() {
    expect(n1).toNotEqual(n2);
  });
});

describe("A new Universe", function() {

  var system, obj;

  beforeEach(function() {
    system = new exports.FloraSystem();
    obj = new exports.Universe();
  });

  afterEach(function() {
    system.destroy();
  });

  it("should have its required properties.", function() {
    expect(interfaceCheck.getDataType(exports.elementList.records)).toEqual('array');
  });
  it("addWorld() should add a new World to the 'records' array.", function() {
    obj.addWorld();
    expect(obj.records.length).toEqual(1);
    expect(obj.records[obj.records.length - 1].constructor.name).toEqual('World');
  });
  it("first() should return the first record in the 'records' array.", function() {
    obj.addWorld();
    obj.addWorld();
    obj.addWorld();
    expect(obj.records.length).toEqual(3);
    expect(obj.first()).toEqual(obj.records[0]);
  });
  it("last() should return the last record in the 'records' array.", function() {
    obj.addWorld();
    obj.addWorld();
    obj.addWorld();
    expect(obj.records.length).toEqual(3);
    expect(obj.last()).toEqual(obj.records[obj.records.length - 1]);
  });
  it("all() should return the 'records' array.", function() {
    obj.addWorld();
    obj.addWorld();
    obj.addWorld();
    expect(obj.all().length).toEqual(3);
  });
  it("update() should update the specified world's properties", function() {
    obj.addWorld();
    obj.addWorld();
    obj.addWorld();
    obj.update({
      'hello': 'hello'
    },
    obj.last());
    expect(obj.last().hello).toEqual('hello');
  });
  // update
  // getWorldById
  // destroyWorld
  // destroyAll
});

describe("Utils", function() {

  var utils = exports.Utils;

  it("map() should re-map a number from one range to another.", function() {
    expect(utils.map(1, 0, 10, 0, 100)).toEqual(10);
  });
  it("getRandomNumber() should return a random number within a range.", function() {
    expect(typeof utils.getRandomNumber(1, 100)).toEqual('number');
    expect(utils.getRandomNumber(1, 100)).toBeGreaterThan(0);
    expect(utils.getRandomNumber(1, 100)).toBeLessThan(101);
  });
  it("getRandomNumber() should return a float when passing 'true' as 3rd argument.", function() {
    expect(utils.getRandomNumber(1, 100, true) % 1).toNotEqual(0);
  });
  it("getRandomNumber() should return an integer when passing 'false' as 3rd argument.", function() {
    expect(utils.getRandomNumber(1, 100, false) % 1).toEqual(0);
  });
  it("degreesToRadians() should converts degrees to radians.", function() {
    expect(utils.degreesToRadians(180)).toEqual(Math.PI);
    expect(utils.degreesToRadians(90)).toEqual(Math.PI/2);
  });
  it("radiansToDegrees() should converts radians to degrees.", function() {
    expect(utils.radiansToDegrees(Math.PI)).toEqual(180);
    expect(utils.radiansToDegrees(Math.PI/2)).toEqual(90);
  });
  it("constrain() should constrain a value within a range.", function() {
    expect(utils.constrain(1000, 10, 100)).toEqual(100);
    expect(utils.constrain(-1000, 10, 100)).toEqual(10);
  });
  it("clone() should return a new object with all properties and methods of " +
    "the old object copied to the new object's prototype.", function() {
    var newObj = {hello: 'hello', sayHi: function() {return 'hi';}},
        clonedObj = utils.clone(newObj);
    expect(clonedObj.hello).toEqual('hello');
    expect(clonedObj.sayHi()).toEqual('hi');
  });
  it("getWindowSize() should return the current window width and height", function() {
    expect(typeof utils.getWindowSize()).toEqual('object');
    expect(typeof utils.getWindowSize().width).toEqual('number');
    expect(typeof utils.getWindowSize().height).toEqual('number');

  });
  it("getCSSText() should return a text string.", function() {
    var obj = new exports.Obj({
      location: {x: 100, y: 100},
      scale: 1,
      angle: 90,
      opacity: 0.75,
      width: 100,
      height: 100,
      colorMode: 'rgb',
      color: {r: 0, g: 0, b: 0},
      zIndex: 1,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: [255, 69, 0],
      borderRadius: '100%',
      boxShadow: '1px 1px 0 0 #000'
    });

    css = utils.getCSSText({
      x: obj.location.x - obj.width/2,
      y: obj.location.y - obj.height/2,
      s: obj.scale,
      a: obj.angle,
      o: obj.opacity,
      w: obj.width,
      h: obj.height,
      cm: obj.colorMode,
      color: obj.color,
      z: obj.zIndex,
      borderWidth: obj.borderWidth,
      borderStyle: obj.borderStyle,
      borderColor: obj.borderColor,
      borderRadius: obj.borderRadius,
      boxShadow: obj.boxShadow
    });
    expect(typeof css).toEqual('string');
    expect(css.search('border-width')).toNotEqual(-1);
  });
});

describe("Vector", function() {

  var system, obj;

  beforeEach(function() {
    system = new exports.FloraSystem();
    obj = new exports.Vector(22, 10);
  });

  afterEach(function() {
    system.destroy();
  });

  it("should create vectors.", function() {
    expect(obj.x).toEqual(22);
    expect(obj.y).toEqual(10);
  });
  it('add() should add a vector.', function() {
    obj.add(new exports.Vector(1, 1));
    expect(obj.x).toEqual(23);
    expect(obj.y).toEqual(11);
  });
  it('sub() should subtract a vector.', function() {
    obj.sub(new exports.Vector(1, 1));
    expect(obj.x).toEqual(21);
    expect(obj.y).toEqual(9);
  });
  it('mult() should multiply a vector.', function() {
    obj.mult(2);
    expect(obj.x).toEqual(44);
    expect(obj.y).toEqual(20);
  });
  it('div() should divide a vector.', function() {
    obj.div(2);
    expect(obj.x).toEqual(11);
    expect(obj.y).toEqual(5);
  });
  it('mag() should calculate the magnitude of a vector.', function() {
    obj = new exports.Vector(10, 10);
    expect(obj.mag()).toEqual(14.142135623730951);
  });
  it('limit() should limit the magnitude of a vector.', function() {
    obj = new exports.Vector(10, 10);
    expect(obj.limit(5).mag()).toEqual(5);
  });
  it('normalize() should divide a vector by its magnitude to reduce its magnitude to 1.', function() {
    obj = new exports.Vector(3, 4);
    expect(obj.normalize().x).toEqual(0.6);
    expect(obj.normalize().y).toEqual(0.8);
  });
  it('distance() should calculate the distance between this vector and a passed vector.', function() {
    obj = new exports.Vector(5, 0);
    expect(obj.distance(new exports.Vector(1, 0))).toEqual(4);
  });
  it('rotate() should rotate a vector using a passed angle in radians.', function() {
    obj = new exports.Vector(10, 0);
    expect(obj.rotate(Math.PI).x).toEqual(-10);
  });
});

describe("A new Walker", function() {

  var system, obj;

  beforeEach(function() {
    system = new exports.FloraSystem();
    obj = new exports.Walker();
  });

  afterEach(function() {
    system.destroy();
  });

  it("should have its required properties.", function() {
    expect(typeof obj.isPerlin).toEqual('boolean');
    expect(typeof obj.remainsOnScreen).toEqual('boolean');
    expect(typeof obj.perlinSpeed).toEqual('number');
    expect(typeof obj.perlinTime).toEqual('number');
    expect(typeof obj.perlinAccelLow).toEqual('number');
    expect(typeof obj.perlinAccelHigh).toEqual('number');
    expect(typeof obj.offsetX).toEqual('number');
    expect(typeof obj.offsetY).toEqual('number');
    expect(typeof obj.isRandom).toEqual('boolean');
    expect(typeof obj.randomRadius).toEqual('number');
    expect(typeof obj.isHarmonic).toEqual('boolean');
    expect(typeof obj.harmonicAmplitude).toEqual('object');
    expect(typeof obj.harmonicPeriod).toEqual('object');
    expect(typeof obj.width).toEqual('number');
    expect(typeof obj.height).toEqual('number');
    expect(typeof obj.color).toEqual('object');
    expect(typeof obj.maxSpeed).toEqual('number');
    expect(typeof obj.wrapEdges).toEqual('boolean');
    expect(typeof obj.isStatic).toEqual('boolean');
    expect(obj.constructor.name).toEqual('Walker');
  });
});

describe("A new World", function() {

  var system, obj;

  beforeEach(function() {
    system = new exports.FloraSystem();
    obj = new exports.World();
  });

  afterEach(function() {
    system.destroy();
  });

  it("should have its required properties.", function() {
    expect(typeof obj.showStats).toEqual('boolean');
    expect(typeof obj.statsInterval).toEqual('number');
    expect(typeof obj.clock).toEqual('number');
    expect(typeof obj.c).toEqual('number');
    expect(typeof obj.gravity).toEqual('object');
    expect(typeof obj.wind).toEqual('object');
    expect(typeof obj.location).toEqual('object');
    expect(typeof obj.width).toEqual('number');
    expect(typeof obj.height).toEqual('number');
    expect(typeof obj.mouseX).toEqual('number');
    expect(typeof obj.mouseY).toEqual('number');
    expect(typeof obj.isPlaying).toEqual('boolean');
    expect(obj.constructor.name).toEqual('World');
  });

  it("should have a DOM element", function() {
    obj.configure();
    expect(typeof obj.el).toEqual('object');
  });
});