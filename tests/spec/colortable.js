describe("A new ColorTable", function() {

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
    obj = new exports.ColorTable();
  });

  afterEach(function() {
    system._destroySystem();
    obj = null;
  });

  it("should have its required properties.", function() {
    expect(obj.name).toEqual('ColorTable');
  });

  it("should have a method that adds an object representing a color range to a 'colors' property.", function() {
    expect(getDataType(obj.addColor)).toEqual('function');

    obj.addColor({
      name: 'heat',
      startColor: [255, 0, 0],
      endColor: [0, 0, 0]
    });

    expect(getDataType(obj)).toEqual('object');
    expect(getDataType(obj.heat)).toEqual('object');
    expect(getDataType(obj.heat.startColor)).toEqual('array');
    expect(getDataType(obj.heat.startColor[0])).toEqual('number');
    expect(getDataType(obj.heat.startColor[1])).toEqual('number');
    expect(getDataType(obj.heat.startColor[2])).toEqual('number');
    expect(getDataType(obj.heat.endColor)).toEqual('array');
    expect(getDataType(obj.heat.endColor[0])).toEqual('number');
    expect(getDataType(obj.heat.endColor[1])).toEqual('number');
    expect(getDataType(obj.heat.endColor[2])).toEqual('number');
  });

  it("should have a method that accepts a name and range position and returns an array representing a single color.", function() {
    expect(getDataType(obj.getColor)).toEqual('function');

    obj.addColor({
      name: 'heat',
      startColor: [255, 0, 0],
      endColor: [0, 0, 0]
    });

    c = obj.getColor('heat');
    expect(getDataType(c)).toEqual('object');

    c = obj.getColor('heat', true, true);
    expect(getDataType(c)).toEqual('object');

    c = obj.getColor('heat', true);
    expect(getDataType(c)).toEqual('array');

    c = obj.getColor('heat', false, true);
    expect(getDataType(c)).toEqual('array');

  });
});