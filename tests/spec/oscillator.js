describe("Oscillator", function() {

  var obj, getDataType, system, records;

  beforeEach(function() {

    // create world element
    var world = document.createElement('div');
    world.id = 'worldA';
    world.className = 'world';
    document.body.appendChild(world);

    system = Burner.System;
    system.init(null, null, document.getElementById('worldA'));
    getDataType = Flora.Utils.getDataType;
  });

  afterEach(function() {
    system._destroySystem();
    obj = null;
  });

  it("should create an Oscillator with its required properties.", function() {
    obj = system.add('Oscillator');
    expect(getDataType(obj.initialLocation)).toEqual('object');
    expect(getDataType(obj.lastLocation)).toEqual('object');
    expect(getDataType(obj.width)).toEqual('number');
    expect(getDataType(obj.height)).toEqual('number');
    expect(getDataType(obj.amplitude)).toEqual('object');
    expect(getDataType(obj.acceleration)).toEqual('object');
    expect(getDataType(obj.aVelocity)).toEqual('object');
    expect(getDataType(obj.isStatic)).toEqual('boolean');
    expect(getDataType(obj.isPerlin)).toEqual('boolean');
    expect(getDataType(obj.perlinSpeed)).toEqual('number');
    expect(getDataType(obj.perlinTime)).toEqual('number');
    expect(getDataType(obj.perlinAccelLow)).toEqual('number');
    expect(getDataType(obj.perlinAccelHigh)).toEqual('number');
    expect(getDataType(obj.perlinOffsetX)).toEqual('number');
    expect(getDataType(obj.perlinOffsetY)).toEqual('number');
    expect(obj.name).toEqual('Oscillator');
  });

  it("should have a method step() that creates a new Oscillator.", function() {
    obj = system.add('Oscillator', {
      lifespan: 10
    });
    var lifespan = obj.lifespan;
    obj.controlCamera = true;
    spyOn(obj, '_checkWorldEdges');
    spyOn(obj, '_checkCameraEdges');
    obj.step();
    expect(obj._checkWorldEdges).toHaveBeenCalled();
    expect(obj._checkCameraEdges).toHaveBeenCalled();
    expect(obj.lifespan).toEqual(lifespan - 1);
  });

});