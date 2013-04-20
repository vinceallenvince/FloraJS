/*global Flora, Brait, document */
Flora.Mantle.System.create(function() {

  var i, max,
      maxVehicles = 6,
      getRandomNumber = Flora.Utils.getRandomNumber,
      world = Flora.Mantle.System.allWorlds()[0];

  Flora.Mantle.World.update({
    c: 0.01,
    gravity: new Flora.Vector(),
    width: Flora.Utils.getWindowSize().width / 0.45,
    height: Flora.Utils.getWindowSize().height / 0.45,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: [100, 100, 100],
    color: [0, 0, 0]
  });

  // create vehicles
  for (i = 0; i < maxVehicles; i += 1) {

    var vehicle = new Brait.Vehicle({
      system: this,
      controlCamera: !i,
      color: !i ? [255, 255, 255] : [255, 100, 0],
      borderColor: !i ? [255, 100, 0] : [255, 150, 50],
      viewArgs: [i],
      sensors: [
        new Brait.Sensor({
          type: 'cold',
          behavior: 'COWARD'
        })
      ]
    });
  }

  // create stimulants
  for (i = 0, max = (0.02 * world.bounds[1]); i < max; i += 1) {
    Brait.Stimulus.create(null, new Flora.Vector(getRandomNumber(0, world.bounds[1]),
        getRandomNumber(0, world.bounds[2])), [Brait.Cold]);
  }

  // add event listener to create random stimulant on mouseup
  Flora.Utils.addEvent(document, 'mouseup', Brait.Stimulus.createCold);

}, null, null, true);

Flora.Utils.addEvent(document.getElementById('buttonStart'), "mouseup", function(e) {
  if (e.stopPropagation) {
    e.stopPropagation();
  }
  document.getElementById('containerMenu').removeChild(document.getElementById('containerButton'));
  Flora.Mantle.System.start();
});
