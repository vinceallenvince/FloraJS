describe("Mover", function() {

  var obj, getDataType, system, records;

  beforeEach(function() {

    // create world element
    var world = document.createElement('div');
    world.id = 'worldA';
    world.className = 'world';
    document.body.appendChild(world);

    system = Flora.Burner.System;
    system.create(function() {

    }, document.getElementById('worldA'));
    getDataType = Flora.Utils.getDataType;
  });

  afterEach(function() {
    Flora.Burner.PubSub.publish('destroySystem');
    obj = null;
  });

  it("should create a mover with its required properties.", function() {
    obj = system.add('Mover', {
      location: function() {
        return new Flora.Vector(this.world.bounds[1]/2, this.world.bounds[2]/2);
      }
    });
    expect(getDataType(obj.el)).toEqual('object');
    expect(getDataType(obj._forceVector)).toEqual('object');
    expect(getDataType(obj.acceleration)).toEqual('object');
    expect(getDataType(obj.clock)).toEqual('number');
    expect(getDataType(obj.height)).toEqual('number');
    expect(getDataType(obj.id)).toEqual('string');
    expect(getDataType(obj.location)).toEqual('object');
    expect(getDataType(obj.mass)).toEqual('number');
    expect(getDataType(obj.name)).toEqual('string');
    expect(getDataType(obj.options)).toEqual('object');
    expect(getDataType(obj.velocity)).toEqual('object');
    expect(getDataType(obj.visibility)).toEqual('string');
    expect(getDataType(obj.width)).toEqual('number');
    expect(getDataType(obj.world)).toEqual('object');
    expect(getDataType(obj.lifespan)).toEqual('number');
    expect(getDataType(obj.life)).toEqual('number');
    expect(obj.name).toEqual('Mover');
  });

  it("should have a method step() that updates roperties.", function() {

    obj = system.add('Mover', {
      location: function() {
        return new Flora.Vector(this.world.bounds[1]/2, this.world.bounds[2]/2);
      }
    });

    var clockLast = obj.clock,
        clock = obj.step();

    expect(clock - clockLast).toEqual(1);
  });

  it("should have a method applyForce() that updates acceleration.", function() {

    obj = system.add('Mover', {
      location: function() {
        return new Flora.Vector(this.world.bounds[1]/2, this.world.bounds[2]/2);
      }
    });

    obj.acceleration = new Flora.Vector();
    obj.mass = 10;
    var f = obj.applyForce(new Flora.Vector(10, 5));

    expect(f.x).toEqual(1);
    expect(f.y).toEqual(0.5);
  });

  it("should have a method draw() that updates the corresponding DOM element's style property.", function() {

    obj = system.add('Mover', {
      location: function() {
        return new Flora.Vector(this.world.bounds[1]/2, this.world.bounds[2]/2);
      }
    });

    var cssText = obj.draw();
    expect(getDataType(cssText)).toEqual('string');
  });

  it("should have a method getCSSText() that concatenates a new cssText string based on passed properties.", function() {

    obj = system.add('Mover', {
      location: function() {
        return new Flora.Vector(this.world.bounds[1]/2, this.world.bounds[2]/2);
      }
    });

    var cssText = obj._getCSSText({
      x: 100,
      y: 50,
      width: 20,
      height: 20,
      visibility: 'visible',
      a: 90,
      s: 1
    });
    // !! depends on browser width
    //console.log(cssText);
    //expect(cssText).toEqual('-webkit-transform: translate3d(100px, 50px, 0) rotate(90deg) scaleX(1) scaleY(1);-moz-transform: translate3d(100px, 50px, 0) rotate(90deg) scaleX(1) scaleY(1);-o-transform: translate3d(100px, 50px, 0) rotate(90deg) scaleX(1) scaleY(1);-ms-transform: translate3d(100px, 50px, 0) rotate(90deg) scaleX(1) scaleY(1);width: 20px;height: 20px;opacity: undefined;visibility: visible;background-color: undefined;z-index: undefined');
  });

  it("should have a method seek() that calculates a steering force to apply to an object seeking another object.", function() {

      var walker = system.add('Walker', {
        location: function() {
          return new Flora.Vector(10, 10);
        }
      });

      var mover = system.add('Mover', {
        seekTarget: walker,
        location: function() {
          return new Flora.Vector(20000, 20000);
        }
      });

    expect(Math.round(mover._seek(mover.seekTarget).x)).toEqual(-7);
    expect(Math.round(mover._seek(mover.seekTarget).y)).toEqual(-7);
  });

  it("should have a method checkWorldEdges() that determines if this object is outside the world bounds.", function() {

    var mover = system.add('Mover', {
      location: function() {
        return new Flora.Vector(this.world.bounds[1] * 2, this.world.bounds[2] * 2);
      }
    });

    expect(mover._checkWorldEdges()).toEqual(true);

    var w = exports.Burner.System.getWorld(document.getElementById('worldA'));
    w.bounds[2] = 2000;

    mover = system.add('Mover', {
      location: function() {
        return new Flora.Vector(this.world.bounds[3] + 100, this.world.bounds[0] + 100);
      }
    });

    expect(mover._checkWorldEdges()).toEqual(false);

  });
  // _checkCameraEdges
});