describe("The Interface", function() {

  var interfaceCheck = exports.Interface,
      requiredOptions,
      options;

  beforeEach(function() {
    requiredOptions = {
      age: 'number',
      name: 'string',
      foods: 'array',
      grades: 'object'
    };
  });

  it("should check that passsed options match required options.", function() {
    options = {
      age: 100,
      name: 'Joey',
      foods: ['ham', 'cheese', 'milk'],
      grades: {
        english: 90,
        math: 80
      }
    };
    expect(interfaceCheck.checkRequiredParams(options, requiredOptions)).toEqual(true);
    options = {
      age: '100',
      name: 'Joey',
      foods: ['ham', 'cheese', 'milk'],
      grades: {
        english: 90,
        math: 80
      }
    };
    expect(interfaceCheck.checkRequiredParams(options, requiredOptions)).toEqual(false);
  });
  it("should correctly check data types.", function() {
    expect(interfaceCheck.getDataType('100')).toEqual('string');
    expect(interfaceCheck.getDataType(100)).toEqual('number');
    expect(interfaceCheck.getDataType([100, '100'])).toEqual('array');
    expect(interfaceCheck.getDataType({100: 100})).toEqual('object');
  });
});