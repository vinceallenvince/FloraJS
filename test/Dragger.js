var Burner = require('Burner'),
    test = require('tape'),
    Dragger, obj;

function beforeTest() {
  Burner.System.setupFunc = function() {};
  Burner.System._resetSystem();
}

test('load Dragger.', function(t) {
  Dragger = require('../src/Dragger').Dragger;
  t.ok(Dragger, 'object loaded');
  t.end();
});

test('new Dragger() should have default properties.', function(t) {

  beforeTest();

  obj = new Dragger();
  t.equal(obj.name, 'Dragger', 'name.');
  t.equal(obj.c, 1, 'default drag coefficient.');
  t.equal(obj.mass, 1000, 'default mass.');
  t.equal(obj.isStatic, true, 'default isStatic');
  t.equal(obj.width, 100, 'default width.');
  t.equal(obj.height, 100, 'default height.');
  t.assert(obj.color[0] === 105 && obj.color[1] === 210 && obj.color[2] === 231, 'default color.');
  t.equal(obj.borderWidth, obj.width / 4, 'default borderWidth.');
  t.equal(obj.borderStyle, 'double', 'default borderStyle.');
  t.assert(obj.borderColor[0] === 167 && obj.borderColor[1] === 219 && obj.borderColor[2] === 216, 'default borderColor.');
  t.equal(obj.borderRadius, 100, 'default borderRadius.');
  t.equal(obj.boxShadowOffsetX, 0, 'default boxShadowOffsetX.');
  t.equal(obj.boxShadowOffsetY, 0, 'default boxShadowOffsetY.');
  t.equal(obj.boxShadowBlur, 0, 'default boxShadowBlur.');
  t.equal(obj.boxShadowSpread, obj.width / 4, 'default boxShadowSpread.');
  t.assert(obj.boxShadowColor[0] === 147 && obj.boxShadowColor[1] === 199 && obj.boxShadowColor[2] === 196, 'default boxShadowColor.');
  t.equal(obj.opacity, 0.75, 'default opacity.');
  t.equal(obj.zIndex, 1, 'default zIndex.');

  t.end();
});

test('new Dragger() should have custom properties.', function(t) {

  beforeTest();

  obj = new Dragger({
    c: 20,
    mass: 3000,
    isStatic: false,
    width: 10,
    height: 10,
    color: [10, 20, 30],
    borderWidth: 2,
    borderStyle: 'dotted',
    borderColor: [30, 20, 10],
    borderRadius: 20,
    boxShadowOffsetX: 10,
    boxShadowOffsetY: 20,
    boxShadowBlur: 3,
    boxShadowSpread: 10,
    boxShadowColor: [100, 110, 120],
    opacity: 0.25,
    zIndex: 20
  });
  t.equal(obj.c, 20, 'custom drag coefficient.');
  t.equal(obj.isStatic, false, 'custom isStatic');
  t.equal(obj.mass, 3000, 'custom mass.');
  t.equal(obj.width, 10, 'custom width.');
  t.equal(obj.height, 10, 'custom height.');
  t.assert(obj.color[0] === 10 && obj.color[1] === 20 && obj.color[2] === 30, 'custom color.');
  t.equal(obj.borderWidth, 2, 'custom borderWidth.');
  t.equal(obj.borderStyle, 'dotted', 'custom borderStyle.');
  t.assert(obj.borderColor[0] === 30 && obj.borderColor[1] === 20 && obj.borderColor[2] === 10, 'custom borderColor.');
  t.equal(obj.borderRadius, 20, 'custom borderRadius.');
  t.equal(obj.boxShadowOffsetX, 10, 'custom boxShadowOffsetX.');
  t.equal(obj.boxShadowOffsetY, 20, 'custom boxShadowOffsetY.');
  t.equal(obj.boxShadowBlur, 3, 'custom boxShadowBlur.');
  t.equal(obj.boxShadowSpread, 10, 'custom boxShadowSpread.');
  t.assert(obj.boxShadowColor[0] === 100 && obj.boxShadowColor[1] === 110 && obj.boxShadowColor[2] === 120, 'custom boxShadowColor.');
  t.equal(obj.opacity, 0.25, 'custom opacity.');
  t.equal(obj.zIndex, 20, 'custom zIndex.');

  t.end();
});

test('draw() should assign a css test string to the style property.', function(t) {

  beforeTest();

  var obj;

  Burner.System.Classes = {
    Dragger: Dragger
  };

  Burner.System.setup(function() {
    this.add('World');
    obj = this.add('Dragger'); // add your new object to the system
    obj.draw();
    t.equal(obj.el.style.width, '100px', 'el.style width.');
    t.equal(obj.el.style.height, '100px', 'el.style height.');
    t.equal(obj.el.style.backgroundColor, 'rgb(105, 210, 231)', 'el.style backgroundColor');
    t.equal(obj.el.style.borderTopWidth, '25px', 'el.style border top width');
    t.equal(obj.el.style.borderRightWidth, '25px', 'el.style border right width');
    t.equal(obj.el.style.borderBottomWidth, '25px', 'el.style border bottom width');
    t.equal(obj.el.style.borderLeftWidth, '25px', 'el.style border left width');
    t.equal(obj.el.style.borderTopStyle, 'double', 'el.style border top style');
    t.equal(obj.el.style.borderRightStyle, 'double', 'el.style border right style');
    t.equal(obj.el.style.borderBottomStyle, 'double', 'el.style border bottom style');
    t.equal(obj.el.style.borderLeftStyle, 'double', 'el.style border left style');
    t.equal(obj.el.style.borderTopColor, 'rgb(167, 219, 216)', 'el.style border top color');
    t.equal(obj.el.style.borderRightColor, 'rgb(167, 219, 216)', 'el.style border right color');
    t.equal(obj.el.style.borderBottomColor, 'rgb(167, 219, 216)', 'el.style border bottom color');
    t.equal(obj.el.style.borderLeftColor, 'rgb(167, 219, 216)', 'el.style border left color');
    t.equal(obj.el.style.borderTopLeftRadius, '100% 100%', 'el.style border top left radius');
    t.equal(obj.el.style.borderTopRightRadius, '100% 100%', 'el.style border top right radius');
    t.equal(obj.el.style.borderBottomRightRadius, '100% 100%', 'el.style border bottom right radius');
    t.equal(obj.el.style.borderBottomLeftRadius, '100% 100%', 'el.style border bottom left radius');
    t.equal(obj.el.style.boxShadow, 'rgb(147, 199, 196) 0px 0px 0px 25px', 'el.style boxShadow');
    t.equal(obj.el.style.opacity, '0.75', 'el.style opacity');
    t.equal(obj.el.style.zIndex, '1', 'el.style zIndex');
  });

  t.end();
});

test('drag() should return an drag force.', function(t) {

  beforeTest();

  var obj;

  Burner.System.Classes = {
    Dragger: Dragger
  };

  Burner.System.setup(function() { // add your new object to the system
    this.add('World');
    obj = this.add('Dragger', {
      location: new Burner.Vector(100, 100)
    });
    var item = this.add('Item', {
      location: new Burner.Vector(10, 10)
    });
    this.add('Dragger');
    //var force = obj.attract(item);

    //t.equal(parseFloat(force.x.toPrecision(3)), -4.36, 'attract() returns force.x.');
    //t.equal(parseFloat(force.y.toPrecision(3)), -4.36, 'attract() returns force.y.');

  });

  t.end();

});
