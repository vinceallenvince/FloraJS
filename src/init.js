/*global config, exports, document */
exports.Utils.addEvent(document, 'keyup', function(e) {

  if (e.keyCode === config.keyMap.pause) {
    exports.Burner.PubSub.publish('pause');
  }
  if (e.keyCode === config.keyMap.resetSystem) {
    exports.Burner.PubSub.publish('resetSystem');
  }
  if (e.keyCode === config.keyMap.destroySystem) {
    exports.Burner.PubSub.publish('destroySystem');
  }
  if (e.keyCode === config.keyMap.stats) {
    exports.Burner.PubSub.publish('stats');
  }
});