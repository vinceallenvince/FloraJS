describe("Liquid", function() {

  var obj, getDataType, system, records;

  beforeEach(function() {

    // create world element
    var world = document.createElement('div');
    world.id = 'worldA';
    world.className = 'world';
    document.body.appendChild(world);

    system = Burner.System;
    system.init(function() {
      this.add('Liquid');
    }, null, document.getElementById('worldA'));
    getDataType = Flora.Utils.getDataType;
    obj = system.lastItem();
  });

  afterEach(function() {
    system._destroySystem();
    obj = null;
  });

  it("should create a liquid with its required properties.", function() {
    expect(getDataType(obj.c)).toEqual('number');
    expect(getDataType(obj.mass)).toEqual('number');
    expect(getDataType(obj.isStatic)).toEqual('boolean');
    expect(getDataType(obj.width)).toEqual('number');
    expect(getDataType(obj.height)).toEqual('number');
    expect(getDataType(obj.opacity)).toEqual('number');
    expect(getDataType(obj.zIndex)).toEqual('number');
    expect(obj.name).toEqual('Liquid');
  });

});