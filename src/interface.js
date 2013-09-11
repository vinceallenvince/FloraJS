/*global console */
/** @namespace */
var Interface = {};

/**
 * @description Compares passed options to a set of required options.
 * @function checkRequiredParams
 * @memberof Interface
 * @param {Object} optionsPassed An object containing options passed to a function.
 * @param {Object} optionsRequired An object containing a function's required options.
 * @param {string=} opt_from A message or identifier from the calling function.
 * @returns {boolean} Returns true if all required options are present and of the right data type.
 *     Returns false if any required options are missing or are the wrong data type. Also returns false
 *     if any of the passed options are empty.
 * @example
 * optionsPassed = {
 *  form: document.getElementById("form"),
 *    color: "blue",
 *  total: "a whole bunch",
 *   names: ["jimmy", "joey"]
 * }
 * optionsRequired = {
 *   form: "object",
 *   color: "string",
 *   total: "number|string",
 *   names: "array"
 * }
 * checkRequiredOptions(optionsPassed, optionsRequired) returns true in this case.
 *
 * Notice you can separate required options data types with a pipe character to allow multiple data types.
 */
Interface.checkRequiredParams = function(optionsPassed, optionsRequired, opt_from) {

  var i, msg, check = true;

  for (i in optionsRequired) { // loop thru required options

    if (optionsRequired.hasOwnProperty(i)) {

      try {

        // if no options were passed
        if (typeof optionsPassed === "undefined") {
          throw new Error('checkRequiredOptions: No options were passed.');
        }

        // if there is not a corresponding key in the passed options; or options passed value is blank
        if (!this.checkDataType(this.getDataType(optionsPassed[i]), optionsRequired[i].split('|')) || optionsPassed[i] === "") {

          check = false;

          if (optionsPassed[i] === '') {
            msg = 'checkRequiredOptions: required option "' + i + '" is empty.';
          } else if (typeof optionsPassed[i] === 'undefined') {
            msg = 'checkRequiredOptions: required option "' + i + '" is missing from passed options.';
          } else {
            msg = 'checkRequiredOptions: passed option "' + i + '" must be type ' + optionsRequired[i] +
            '. Passed as ' + this.getDataType(optionsPassed[i]) + '.';
          }

          throw new Error(msg);
        }
      } catch (err) {
        if (typeof console !== 'undefined') {
          console.log('ERROR: ' + err.message + (opt_from ? ' from: ' + opt_from : ''));
        }
      }
    }
  }
  return check;
};

/**
 * Loops through an array of data types and checks if the
 * passed option matches any entry.
 *
 * @function checkDataType
 * @memberof Interface
 * @param {string} option The data type to check.
 * @param {array} typesToMatch An array of data types to check option against.
 * @returns {boolean} If option matches any entry in typesToMatch,
 * return true. Else, returns false.
 */
Interface.checkDataType = function(option, typesToMatch) {

  var i, max;

  for (i = 0, max = typesToMatch.length; i < max; i++) {
    if (option === typesToMatch[i]) {
      return true;
    }
  }
  return false;
};

/**
 * Checks for data type.
 *
 * @function getDataType
 * @memberof Interface
 * @returns {string} The data type of the passed variable.
 */
Interface.getDataType = function(element) {

  if (Object.prototype.toString.call(element) === '[object Array]') {
    return 'array';
  }

  if (Object.prototype.toString.call(element) === '[object NodeList]') {
    return 'nodeList';
  }

  return typeof element;
};
