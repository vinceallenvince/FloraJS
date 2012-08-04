/** @namespace */
Interface = (function () {
  
  /** @scope Interface */
  return {
  
      /**
        @description Compares passed parameters to a set of required parameters.
        @param {Object} params_passed An object containing parameters passed to a function.
        @param {Object} params_required An object containing a function's required parameters.
        @returns {Boolean} Returns true if all required params are present and of the right data type.
            Returns false if any required params are missing or are the wrong data type. Also returns false if any of the passed params are empty.
        @example
params_passed = {
form: document.getElementById("form"),
color: "blue",
total: 100,
names: ["jimmy", "joey"]
}
params_required = {
form: "object",
color: "string",
total: "number",
names: "array"
}
Interface.checkRequiredParams(params_passed, params_required) returns true in this case.
       */
      checkRequiredParams: function (params_passed, params_required) {
        var i, msg, check = true;
        for (i in params_required) { // loop thru required params
          if (params_required.hasOwnProperty(i)) {
            try {
              if (this.getDataType(params_passed[i]) !== params_required[i] || params_passed[i] === "") { // if there is not a corresponding key in the passed params; or params passed value is blank
                check = false;
                if (params_passed[i] === "") {
                  msg = "Interface.checkRequiredParams: required param '" + i + "' is empty.";
                } else if (typeof params_passed[i] === "undefined") {
                  msg = "Interface.checkRequiredParams: required param '" + i + "' is missing from passed params.";
                } else {
                  msg = "Interface.checkRequiredParams: passed param '" + i + "' must be type " + params_required[i] + ". Passed as " + this.getDataType(params_passed[i]) + ".";
                }
                throw new Error(msg);
              }
            } catch (err) {
              if (typeof console !== "undefined") {
                console.log("ERROR: " + err.message);
              }
            }
          }
        }
        return check;
      },
      /**
       * Checks for data type.
       *
       * @returns {string} The data type of the passed variable.
       */
      getDataType: function (element) {

        if (Object.prototype.toString.call(element) === '[object Array]') {
          return "array";
        }

        return typeof element;
      }
  }
  }());
exports.Interface = Interface;