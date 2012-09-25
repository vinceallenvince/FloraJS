describe("A new Attractor", function() {

  var attractor;

  beforeEach(function() {
    obj = new exports.Attractor();
  });

  afterEach(function() {
    obj = null;
  });

  it("should have its required properties.", function() {
    expect(typeof obj.G).toEqual('number');
    expect(typeof obj.mass).toEqual('number');
    expect(typeof obj.isStatic).toEqual('boolean');
    expect(typeof obj.width).toEqual('number');
    expect(typeof obj.height).toEqual('number');
    expect(typeof obj.color).toEqual('object');
    expect(typeof obj.opacity).toEqual('number');
    expect(typeof obj.constructor.name).toEqual('string');
  });
});

describe("A new BorderPalette", function() {

  var obj, interfaceCheck = exports.Interface;

  beforeEach(function() {
    obj = new exports.BorderPalette();
  });

  afterEach(function() {
    obj = null;
  });

  it("should have its required properties.", function() {
    expect(interfaceCheck.getDataType(obj.borders)).toEqual('array');
    expect(typeof obj.constructor.name).toEqual('string');
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

  var obj;

  beforeEach(function() {
    obj = new exports.Camera();
  });

  afterEach(function() {
    obj = null;
  });

  it("should have its required properties.", function() {
    expect(typeof obj.location).toEqual('object');
    expect(typeof obj.constructor.name).toEqual('string');
  });
});

describe("A new Caption", function() {

  var obj;

  beforeEach(function() {
    obj = new exports.Caption();
  });

  afterEach(function() {
    obj = null;
  });

  it("should have its required properties.", function() {
    expect(typeof obj.position).toEqual('string');
    expect(typeof obj.text).toEqual('string');
    expect(typeof obj.opacity).toEqual('number');
    expect(typeof obj.el).toEqual('object');
    expect(typeof obj.constructor.name).toEqual('string');
  });
});

describe("A new Cold", function() {

  var obj;

  beforeEach(function() {
    obj = new exports.Cold();
  });

  afterEach(function() {
    obj = null;
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

describe("A new ColorPalette", function() {

  var obj, interfaceCheck = exports.Interface;

  beforeEach(function() {
    obj = new exports.ColorPalette();
  });

  afterEach(function() {
    obj = null;
  });

  it("should have its required properties.", function() {
    expect(interfaceCheck.getDataType(obj.gradients)).toEqual('array');
    expect(interfaceCheck.getDataType(obj.colors)).toEqual('array');
    expect(typeof obj.constructor.name).toEqual('string');
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

  var c, obj, interfaceCheck = exports.Interface;

  beforeEach(function() {
    obj = new exports.ColorTable();
  });

  afterEach(function() {
    obj = null;
  });

  it("should have its required properties.", function() {
    expect(typeof obj.constructor.name).toEqual('string');
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

  var obj;

  beforeEach(function() {
    obj = new exports.Connector();
  });

  afterEach(function() {
    obj = null;
  });

  it("should have its required properties.", function() {
    expect(typeof obj.color).toEqual('object');
    expect(typeof obj.zIndex).toEqual('number');
    expect(typeof obj.opacity).toEqual('number');
    expect(typeof obj.width).toEqual('number');
    expect(typeof obj.height).toEqual('number');
    expect(typeof obj.constructor.name).toEqual('string');
  });
});

describe("A new FlowField", function() {

  var obj;

  beforeEach(function() {
    obj = new exports.FlowField();
  });

  afterEach(function() {
    obj = null;
  });

  it("should have its required properties.", function() {
    expect(typeof obj.resolution).toEqual('number');
    expect(typeof obj.perlinSpeed).toEqual('number');
    expect(typeof obj.perlinTime).toEqual('number');
    expect(typeof obj.createMarkers).toEqual('boolean');
    expect(typeof obj.constructor.name).toEqual('string');
  });
});

describe("A new FlowFieldMarker", function() {

  var obj;

  it("should return a DOM element.", function() {
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
    expect(obj.className).toEqual('flowFieldMarker');
    expect(obj.style.width).toEqual('100px');
    expect(obj.style.height).toEqual('100px');
    expect(typeof obj).toEqual('object');
  });
});

describe("A new Food", function() {

  var obj;

  beforeEach(function() {
    obj = new exports.Food();
  });

  afterEach(function() {
    obj = null;
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

describe("A new Heat", function() {

  var obj;

  beforeEach(function() {
    obj = new exports.Heat();
  });

  afterEach(function() {
    obj = null;
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

  var obj;

  beforeEach(function() {
    obj = new exports.Light();
  });

  afterEach(function() {
    obj = null;
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

  var obj;

  beforeEach(function() {
    obj = new exports.Liquid();
  });

  afterEach(function() {
    obj = null;
  });

  it("should have its required properties.", function() {
    expect(typeof obj.c).toEqual('number');
    expect(typeof obj.mass).toEqual('number');
    expect(typeof obj.isStatic).toEqual('boolean');
    expect(typeof obj.width).toEqual('number');
    expect(typeof obj.height).toEqual('number');
    expect(typeof obj.color).toEqual('object');
    expect(typeof obj.opacity).toEqual('number');
    expect(typeof obj.constructor.name).toEqual('string');
  });
});

describe("A new Mover", function() {

  var obj, interfaceCheck = exports.Interface;

  beforeEach(function() {
    obj = new exports.Mover();
  });

  afterEach(function() {
    obj = null;
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
    expect(typeof obj.constructor.name).toEqual('string');
  });
});

describe("A new Obj", function() {

  var obj, css;

  beforeEach(function() {
    obj = new exports.Obj({
      hello: 'hello'
    });
  });

  afterEach(function() {
    obj = null;
  });

  it("should accept all properties passed to the constructor.", function() {
    expect(obj.hello).toEqual('hello');
    expect(typeof obj.constructor.name).toEqual('string');
  });
});

describe("A new Oscillator", function() {

  var obj;

  beforeEach(function() {
    obj = new exports.Oscillator({
      initialLocation: new exports.Vector()
    });
  });

  afterEach(function() {
    obj = null;
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
    expect(typeof obj.constructor.name).toEqual('string');
  });
});

describe("A new Oxygen", function() {

  var obj;

  beforeEach(function() {
    obj = new exports.Oxygen();
  });

  afterEach(function() {
    obj = null;
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

describe("A new Particle", function() {

  var obj, system;

  beforeEach(function() {
    system = new Flora.FloraSystem();
    obj = new exports.Particle();
  });

  afterEach(function() {
    obj = null;
  });

  it("should have its required properties.", function() {
    expect(typeof obj.lifespan).toEqual('number');
    expect(typeof obj.color).toEqual('object');
    expect(typeof obj.borderRadius).toEqual('string');
    expect(typeof obj.constructor.name).toEqual('string');
  });
});

describe("A new ParticleSystem", function() {

  var obj;

  beforeEach(function() {
    obj = new exports.ParticleSystem();
  });

  afterEach(function() {
    obj = null;
  });

  it("should have its required properties.", function() {
    expect(typeof obj.beforeStep).toEqual('function');
    expect(typeof obj.isStatic).toEqual('boolean');
    expect(typeof obj.lifespan).toEqual('number');
    expect(typeof obj.burst).toEqual('number');
    expect(typeof obj.particle).toEqual('function');
    expect(typeof obj.constructor.name).toEqual('string');
  });
});



describe("A new Point", function() {

  var obj;

  beforeEach(function() {
    obj = new exports.Point();
  });

  afterEach(function() {
    obj = null;
  });

  it("should have its required properties.", function() {
    expect(typeof obj.opacity).toEqual('number');
    expect(typeof obj.width).toEqual('number');
    expect(typeof obj.height).toEqual('number');
    expect(typeof obj.isStatic).toEqual('boolean');
    expect(typeof obj.zIndex).toEqual('number');
    expect(typeof obj.offsetAngle).toEqual('number');
    expect(typeof obj.length).toEqual('number');
    expect(typeof obj.constructor.name).toEqual('string');
  });
});

describe("A new Predator", function() {

  var obj;

  beforeEach(function() {
    obj = new exports.Predator();
  });

  afterEach(function() {
    obj = null;
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

describe("Vector", function() {

  var vector;

  beforeEach(function() {
    vector = new exports.Vector(10, 20);
  });

  afterEach(function() {
    vector = null;
  });

  it("should create vectors.", function() {
    expect(vector.x).toEqual(10);
    expect(vector.y).toEqual(20);
  });
});

describe("A new Repeller", function() {

  var obj;

  beforeEach(function() {
    obj = new exports.Repeller();
  });

  afterEach(function() {
    obj = null;
  });

  it("should have its required properties.", function() {
    expect(typeof obj.G).toEqual('number');
    expect(typeof obj.mass).toEqual('number');
    expect(typeof obj.isStatic).toEqual('boolean');
    expect(typeof obj.width).toEqual('number');
    expect(typeof obj.height).toEqual('number');
    expect(typeof obj.color).toEqual('object');
    expect(typeof obj.opacity).toEqual('number');
    expect(typeof obj.constructor.name).toEqual('string');
  });
});

describe("A new Sensor", function() {

  var obj;

  beforeEach(function() {
    obj = new exports.Sensor();
  });

  afterEach(function() {
    obj = null;
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
    expect(typeof obj.constructor.name).toEqual('string');
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

describe("A new Walker", function() {

  var obj;

  beforeEach(function() {
    obj = new exports.Walker();
  });

  afterEach(function() {
    obj = null;
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
    expect(typeof obj.constructor.name).toEqual('string');
  });
});

describe("A new World", function() {

  var obj;

  beforeEach(function() {
    obj = new exports.World();
  });

  afterEach(function() {
    system = null;
    obj = null;
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
    expect(typeof obj.constructor.name).toEqual('string');
  });

  it("should have a DOM element", function() {
    obj.configure();
    expect(typeof obj.el).toEqual('object');
  });
});