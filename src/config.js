/*global Burner, Flora */
Burner.Classes = Flora;

/**
 * @namespace
 */
var Config = {
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
  defaultColorList: [
    {
      name: 'cold',
      startColor: [88, 129, 135],
      endColor: [171, 244, 255],
      boxShadowColor: [132, 192, 201]
    },
    {
      name: 'food',
      startColor: [186, 255, 130],
      endColor: [84, 187, 0],
      boxShadowColor: [57, 128, 0]
    },
    {
      name: 'heat',
      startColor: [255, 132, 86],
      endColor: [175, 47, 0],
      boxShadowColor: [255, 69, 0]
    },
    {
      name: 'light',
      startColor: [255, 255, 255],
      endColor: [189, 148, 0],
      boxShadowColor: [255, 200, 0]
    },
    {
      name: 'oxygen',
      startColor: [130, 136, 255],
      endColor: [49, 56, 205],
      boxShadowColor: [60, 64, 140]
    }
  ],
  keyMap: {
    pause: 80,
    resetSystem: 82,
    stats: 83
  },
  touchMap: {
    stats: 2,
    pause: 3,
    reset: 4
  }
};
