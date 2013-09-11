describe("Utils", function() {

  var utils = exports.Utils,
      getDataType = Flora.Utils.getDataType;

  it("extend() should extend the properties and methods of a superClass onto a subClass.", function() {
    var superClass = function() {
      this.hello = 'hello';
    };
    superClass.prototype.sayHi = function() {return 'hi';};
    var SubClass = function() {
      superClass.call(this);
    };
    utils.extend(SubClass, superClass);
    var sub = new SubClass();
    expect(sub.hello).toEqual('hello');
    expect(sub.sayHi()).toEqual('hi');
  });
  it("map() should re-map a number from one range to another.", function() {
    expect(utils.map(1, 0, 10, 0, 100)).toEqual(10);
  });
  it("getRandomNumber() should return a random number within a range.", function() {
    expect(getDataType(utils.getRandomNumber(1, 100))).toEqual('number');
    expect(utils.getRandomNumber(1, 100)).toBeGreaterThan(0);
    expect(utils.getRandomNumber(1, 100)).toBeLessThan(101);
  });
  it("getRandomNumber() should return a float when passing 'true' as 3rd argument.", function() {
    expect(utils.getRandomNumber(1, 100, true) % 1).toNotEqual(0);
  });
  it("getRandomNumber() should return an integer when passing 'false' as 3rd argument.", function() {
    expect(utils.getRandomNumber(1, 100, false) % 1).toEqual(0);
  });
  it("degreesToRadians() should converts degrees to radians.", function() {
    expect(utils.degreesToRadians(180)).toEqual(Math.PI);
    expect(utils.degreesToRadians(90)).toEqual(Math.PI/2);
  });
  it("radiansToDegrees() should converts radians to degrees.", function() {
    expect(utils.radiansToDegrees(Math.PI)).toEqual(180);
    expect(utils.radiansToDegrees(Math.PI/2)).toEqual(90);
  });
  it("constrain() should constrain a value within a range.", function() {
    expect(utils.constrain(1000, 10, 100)).toEqual(100);
    expect(utils.constrain(-1000, 10, 100)).toEqual(10);
  });
  it("clone() should return a new object with all properties and methods of " +
    "the old object copied to the new object's prototype.", function() {
    var newObj = {hello: 'hello', sayHi: function() {return 'hi';}},
        clonedObj = utils.clone(newObj);
    expect(clonedObj.hello).toEqual('hello');
    expect(clonedObj.sayHi()).toEqual('hi');
  });
  it("getWindowSize() should return the current window width and height.", function() {
    expect(getDataType(utils.getWindowSize())).toEqual('object');
    expect(getDataType(utils.getWindowSize().width)).toEqual('number');
    expect(getDataType(utils.getWindowSize().height)).toEqual('number');
  });
  it("getDataType() should return the data type of the passed argument.", function() {
    expect(getDataType('hi')).toEqual('string');
    expect(getDataType(100)).toEqual('number');
    expect(getDataType(true)).toEqual('boolean');
    expect(getDataType({})).toEqual('object');
    expect(getDataType([])).toEqual('array');
  });

  it("capitalizeFirstLetter() should capitalize the first character in a string.", function() {
    expect(utils.capitalizeFirstLetter('hi')).toEqual('Hi');
  });

  it("isInside() should determine if one object is inside another.", function() {
    var objA = {
      width: 10,
      height: 10,
      location: {
        x: 0,
        y: 0
      }
    };
    var objB = {
      width: 100,
      height: 100,
      location: {
        x: 0,
        y: 0
      }
    };
    expect(utils.isInside(objA, objB)).toEqual(true);
    objA.location.x = 2000;
    expect(utils.isInside(objA, objB)).toEqual(false);
  });
});
