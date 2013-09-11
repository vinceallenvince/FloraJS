describe("Walker", function() {

  var obj, getDataType, system, records;

  beforeEach(function() {

    // create world element
    var world = document.createElement('div');
    world.id = 'worldA';
    world.className = 'world';
    document.body.appendChild(world);

    system = Burner.System;
    system.init(function() {
      this.add('Walker');
    }, null, document.getElementById('worldA'));
    getDataType = Flora.Utils.getDataType;
    obj = system.lastItem();
  });

  afterEach(function() {
    system._destroySystem();
    obj = null;
  });

  it("should create a mover with its required properties.", function() {
    expect(getDataType(obj.width)).toEqual('number');
    expect(getDataType(obj.height)).toEqual('number');
    expect(getDataType(obj.perlin)).toEqual('boolean');
    expect(getDataType(obj.remainsOnScreen)).toEqual('boolean');
    expect(getDataType(obj.perlinSpeed)).toEqual('number');
    expect(getDataType(obj.perlinTime)).toEqual('number');
    expect(getDataType(obj.perlinAccelLow)).toEqual('number');
    expect(getDataType(obj.perlinAccelHigh)).toEqual('number');
    expect(getDataType(obj.offsetX)).toEqual('number');
    expect(getDataType(obj.offsetY)).toEqual('number');
    expect(getDataType(obj.random)).toEqual('boolean');
    expect(getDataType(obj.randomRadius)).toEqual('number');
    expect(getDataType(obj.borderWidth)).toEqual('number');
    expect(getDataType(obj.borderStyle)).toEqual('string');
    expect(getDataType(obj.borderColor)).toEqual('array');
    expect(getDataType(obj.borderRadius)).toEqual('number');
    expect(obj.name).toEqual('Walker');
  });

});