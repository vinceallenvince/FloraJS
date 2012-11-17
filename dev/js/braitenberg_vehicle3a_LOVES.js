/*global Flora, Brait, document */

var elements = function() {

  'use strict';

  var i, max,
      world = Flora.universe.first(),
      maxVehicles = 5;

  //  update the universe
  Flora.universe.update({
    c: 0.01,
    gravity: new Flora.Vector(),
    width: 3000,
    height: 1500,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: [100, 100, 100]
  });

  // create stimulants
  for (i = 0, max = (0.015 * world.width); i < max; i += 1) {
    Brait.Stimulus.create(null, new Flora.Vector(Flora.Utils.getRandomNumber(0, world.width),
        Flora.Utils.getRandomNumber(0, world.height)), [Brait.Cold]);
  }

  // create vehicles
  for (i = 0; i < maxVehicles; i += 1) {

    var vehicle = new Brait.Vehicle({
      controlCamera: !i,
      color: !i ? [255, 255, 255] : [255, 100, 0],
      borderColor: !i ? [255, 100, 0] : [255, 150, 50],
      viewArgs: [i],
      sensors: [
        new Brait.Sensor({
          type: 'cold',
          behavior: 'LOVES'
        })
      ]
    });
  }

  // add event listener to create random stimulant on mouseup
  Flora.Utils.addEvent(document, 'mouseup', Brait.Stimulus.createCold);

};

Flora.Utils.addEvent(document.getElementById('buttonStart'), "mouseup", function(e) {
  'use strict';
  if (e.stopPropagation) {
    e.stopPropagation();
  }
  document.getElementById('containerMenu').removeChild(document.getElementById('containerButton'));
  Flora.System.start(elements);
});