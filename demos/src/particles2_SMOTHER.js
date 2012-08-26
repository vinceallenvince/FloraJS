/*global Flora */
var system = new Flora.FloraSystem();

system.start(function() {

  'use strict';

  Flora.world.update({
    c: 0,
    showStats: false,
    gravity: Flora.PVector.create(0, 0),
    style: {
      background: '#000',
      backgroundImage: '-webkit-radial-gradient(circle, #333, #000)',
      border: 0
    }
  });

  var walker = new Flora.Walker({
    isPerlin: true,
    wrapEdges: true,
    maxSpeed: 20,
    opacity: 0.5
  });

  var smoke = new Flora.ParticleSystem({
    burstRate: 1,
    target: walker,
    color: [200, 200, 200],
    isStatic: false,
    particle: function () {

      var pl = new Flora.ColorPalette();

      pl.addColor({
        min: 1,
        max: 3,
        startColor: [255, 255, 255],
        endColor: [180, 180, 180]
      });

      return {
        location: this.getLocation(),
        acceleration: Flora.PVector.create(Flora.Utils.getRandomNumber(-4, 4), Flora.Utils.getRandomNumber(-4, 4)),
        width: 0,
        height: 0,
        borderRadius: '100%',
        boxShadow: '1px 1px 20px 20px rgba(' + pl.getColor().toString() + ', .5)'
      };
    }
  });
});