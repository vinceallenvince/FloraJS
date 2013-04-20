/*global config, exports, document */
exports.Utils.addEvent(document, 'keyup', function(e) {

  if (e.keyCode === config.keyMap.pause) {
    exports.Mantle.PubSub.publish('pause');
  }
  if (e.keyCode === config.keyMap.resetSystem) {
    exports.Mantle.PubSub.publish('resetSystem');
  }
  if (e.keyCode === config.keyMap.destroySystem) {
    exports.Mantle.PubSub.publish('destroySystem');
  }
  if (e.keyCode === config.keyMap.stats) {
    exports.Mantle.PubSub.publish('stats');
  }
});