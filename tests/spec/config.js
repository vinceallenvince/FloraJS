describe("config", function() {

  var config = exports.config;

  it("it should have its required properties.", function() {
    expect(typeof config.keyMap).toEqual('object');
    expect(typeof config.touchMap).toEqual('object');
  });
});
