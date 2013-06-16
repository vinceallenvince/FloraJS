describe("A new BorderPalette", function() {

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
    obj = new exports.BorderPalette();
  });

  afterEach(function() {
    system._destroySystem();
    obj = null;
  });

  it("should have its required properties.", function() {
    expect(getDataType(obj._borders)).toEqual('array');
    expect(obj.id).toEqual(1);
    expect(obj.name).toEqual('BorderPalette');
  });

  it("should have an addBorder() method that pushed border styles (strings) on to a borders property.", function() {
    expect(getDataType(obj.addBorder)).toEqual('function');

    obj.addBorder({
      min: 2,
      max: 8,
      style: 'dotted'
    });

    expect(obj._borders.length).toBeGreaterThan(1);
    expect(obj._borders.length).toBeLessThan(9);
    expect(getDataType(obj._borders[0])).toEqual('string');
  });

  it("should have have a method that returns a string representing a border from the borders property", function() {
    expect(getDataType(obj.getBorder)).toEqual('function');

    obj.addBorder({
      min: 2,
      max: 8,
      style: 'dotted'
    });

    var border = obj.getBorder();

    expect(getDataType(border)).toEqual('string');
  });
});
