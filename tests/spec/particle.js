describe("Particle", function() {

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

  it("should create an Particle with its required properties.", function() {
    obj = system.add('Particle');
    expect(getDataType(obj.width)).toEqual('number');
    expect(getDataType(obj.height)).toEqual('number');
    expect(getDataType(obj.lifespan)).toEqual('number');
    expect(getDataType(obj.life)).toEqual('number');
    expect(getDataType(obj.fade)).toEqual('boolean');
    expect(getDataType(obj.shrink)).toEqual('boolean');
    expect(getDataType(obj.checkWorldEdges)).toEqual('boolean');
    expect(getDataType(obj.maxSpeed)).toEqual('number');
    expect(getDataType(obj.zIndex)).toEqual('number');
    expect(getDataType(obj.color)).toEqual('array');
    expect(getDataType(obj.borderWidth)).toEqual('number');
    expect(getDataType(obj.borderStyle)).toEqual('string');
    expect(getDataType(obj.borderColor)).toEqual('string');
    expect(getDataType(obj.borderRadius)).toEqual('number');
    expect(getDataType(obj.boxShadowSpread)).toEqual('number');
    expect(getDataType(obj.boxShadowColor)).toEqual('string');
    expect(getDataType(obj.acceleration)).toEqual('object');
    expect(getDataType(obj.initWidth)).toEqual('number');
    expect(getDataType(obj.initHeight)).toEqual('number');
    expect(obj.name).toEqual('Particle');
  });

  it("should have a method step() that creates a new Oscillator.", function() {
    var lifespan = 10;
    obj = system.add('Particle', {
      lifespan: lifespan
    });
    spyOn(obj, 'applyForce');
    obj.step();
    expect(obj.applyForce).toHaveBeenCalled();
    expect(obj.life).toEqual(1);
  });
});