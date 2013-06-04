describe("Connector", function() {

  var obj, getDataType, system, records;

  beforeEach(function() {

  });

  afterEach(function() {
    Flora.Burner.PubSub.publish('destroySystem');
    obj = null;
  });

  it("should create a Connector with its required properties.", function() {

    // create world element
    var world = document.createElement('div');
    world.id = 'worldA';
    world.className = 'world';
    document.body.appendChild(world);

    system = Flora.Burner.System;
    system.create(function() {

      var pointA = this.add('Point', {
        location: function () {
          return new Flora.Vector(this.world.bounds[1] * 0.1, this.world.bounds[2] * 0.15);
        }
      });

      var pointB = this.add('Point', {
        location: function () {
          return new Flora.Vector(this.world.bounds[1] * 0.9, this.world.bounds[2] * 0.5);
        }
      });

      this.add('Connector', {
        parentA: pointA,
        parentB: pointB
      });
    }, document.getElementById('worldA'));
    getDataType = Flora.Utils.getDataType;
    obj = system.lastElement();
    obj.step();
    obj.draw();

    // !! depends on browser width
    /*
    expect(obj.opacity).toEqual(1);
    expect(obj.zIndex).toEqual(0);
    expect(obj.width).toEqual(940);
    expect(obj.height).toEqual(0);
    expect(obj.color).toEqual('transparent');*/

    expect(obj.name).toEqual('Connector');
  });
  // !! create Points and test length of connector

});