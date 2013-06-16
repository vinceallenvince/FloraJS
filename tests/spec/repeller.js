describe("Repeller", function() {

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

  it("should create an Repeller with its required properties.", function() {
    obj = system.add('Repeller');
    expect(getDataType(obj.G)).toEqual('number');
    expect(getDataType(obj.mass)).toEqual('number');
    expect(getDataType(obj.isStatic)).toEqual('boolean');
    expect(getDataType(obj.width)).toEqual('number');
    expect(getDataType(obj.width)).toEqual('number');
    expect(getDataType(obj.opacity)).toEqual('number');
    expect(getDataType(obj.zIndex)).toEqual('number');
    expect(obj.name).toEqual('Repeller');
  });

});