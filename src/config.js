/*global exports */
var config = {
  borderStyles: [
    'none',
    'solid',
    'dotted',
    'dashed',
    'double',
    'inset',
    'outset',
    'groove',
    'ridge'
  ],
  /*defaultColorList: [
    {
      name: 'heat',
      startColor: [255, 132, 86],
      endColor: [175, 47, 0]
    },
    {
      name: 'cold',
      startColor: [88, 129, 135],
      endColor: [171, 244, 255]
    },
    {
      name: 'food',
      startColor: [186, 255, 130],
      endColor: [84, 187, 0]
    },
    {
      name: 'oxygen',
      startColor: [109, 215, 255],
      endColor: [0, 140, 192]
    },
    {
      name: 'light',
      startColor: [255, 227, 127],
      endColor: [189, 148, 0]
    }
  ],*/
  keyMap: {
    pause: 80,
    resetSystem: 82,
    stats: 83,
    thrustLeft: 37,
    thrustUp: 38,
    thrustRight: 39,
    thrustDown: 40
  },
  touchMap: {
    stats: 2,
    pause: 3,
    reset: 4
  }
};
exports.config = config;
