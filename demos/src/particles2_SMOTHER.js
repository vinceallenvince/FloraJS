/*global Flora */
var system = new Flora.FloraSystem();

system.start(function() {

  'use strict';

  Flora.world.update({
    c: 0,
    showStats: false,
    gravity: Flora.PVector.create(0, 0),
    style: {
      backgroundImage: "-webkit-radial-gradient(circle, #444, #000)"
    }
  });

  var walker = new Flora.Walker({
    isPerlin: true,
    wrapEdges: true,
    maxSpeed: 20,
    opacity: 0.5
  });

  var smoke = new Flora.ParticleSystem({
    target: walker,
    width: "10px",
    height: "10px",
    color: [200, 200, 200],
    isStatic: false,
    particle: function () {

      var pl = new Flora.Palette();

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
        borderRadius: "100%",
        boxShadow: "1px 1px 20px 20px rgba(" + pl.getColor() + ", .5)"
      };
    }
  });
});