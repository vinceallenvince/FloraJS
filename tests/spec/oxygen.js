describe("Oxygen", function() {

  var obj, getDataType, system, records;

  beforeEach(function() {

    // create world element
    var world = document.createElement('div');
    world.id = 'worldA';
    world.className = 'world';
    document.body.appendChild(world);

    system = Flora.Burner.System;
    system.create(function() {
      this.add('Oxygen');
    }, document.getElementById('worldA'));
    getDataType = Flora.Utils.getDataType;
    obj = system.lastElement();
  });

  afterEach(function() {
    Flora.Burner.PubSub.publish('destroySystem');
    obj = null;
  });

  it("should create an oxygen with its required properties.", function() {
    expect(getDataType(obj.mass)).toEqual('number');
    expect(getDataType(obj.isStatic)).toEqual('boolean');
    expect(getDataType(obj.width)).toEqual('number');
    expect(getDataType(obj.height)).toEqual('number');
    expect(getDataType(obj.opacity)).toEqual('number');
    expect(getDataType(obj.zIndex)).toEqual('number');
    expect(obj.name).toEqual('Oxygen');
  });

});