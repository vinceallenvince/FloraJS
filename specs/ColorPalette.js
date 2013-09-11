describe("A new ColorPalette", function() {

  var obj, getDataType, system;

  beforeEach(function() {

    // create world element
    var world = document.createElement('div');
    world.id = 'worldA';
    world.className = 'world';
    document.body.appendChild(world);

    system = Burner.System;
    system.init(null, null, document.getElementById('worldA'));
    getDataType = Flora.Utils.getDataType;
    obj = new exports.ColorPalette(1);
  });

  afterEach(function() {
    system._destroySystem();
    obj = null;
  });

  it("should have its required properties.", function() {
    expect(getDataType(obj._gradients)).toEqual('array');
    expect(getDataType(obj._colors)).toEqual('array');
    expect(obj.id).toEqual(1);
    expect(obj.name).toEqual('ColorPalette');
  });

  it("should have a createGradient() method that pushes an array of color arrays on to a gradients property.", function() {

    expect(getDataType(obj.createGradient)).toEqual('function');

    obj.createGradient({
      startColor: [255, 0, 0],
      endColor: [0, 0, 0],
      totalColors: 255
    });

    expect(obj._gradients.length).toEqual(1);
    expect(getDataType(obj._gradients[0])).toEqual('array');
    expect(getDataType(obj._gradients[0][0][0])).toEqual('number');
    expect(getDataType(obj._gradients[0][0][1])).toEqual('number');
    expect(getDataType(obj._gradients[0][0][2])).toEqual('number');
  });

  it("should have an addColor() method that pushes color arrays on to a colors property.", function() {
    expect(getDataType(obj.addColor)).toEqual('function');

    obj.addColor({
      min: 3,
      max: 8,
      startColor: [255, 0, 0],
      endColor: [0, 0, 0]
    });

    expect(obj._colors.length).toBeGreaterThan(2);
    expect(obj._colors.length).toBeLessThan(9);
    expect(getDataType(obj._colors[0])).toEqual('array');
    expect(getDataType(obj._colors[0][0])).toEqual('number');
    expect(getDataType(obj._colors[0][1])).toEqual('number');
    expect(getDataType(obj._colors[0][2])).toEqual('number');
  });

  it("should have have a method that returns an array of 3 numeric values representing a color value", function() {
    expect(getDataType(obj.getColor)).toEqual('function');

    obj.addColor({
      min: 3,
      max: 8,
      startColor: [255, 0, 0],
      endColor: [0, 0, 0]
    });

    var color = obj.getColor();

    expect(getDataType(color)).toEqual('array');
    expect(getDataType(color[0])).toEqual('number');
    expect(getDataType(color[1])).toEqual('number');
    expect(getDataType(color[2])).toEqual('number');
  });
});
