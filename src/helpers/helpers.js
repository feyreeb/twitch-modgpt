const helpers = {

    /**
     * Evaluates if a variable is empty or not
     * @param {String} value The value to evaluate
     * @param {Boolean} zeroIsEmpty Wether zero should be considered as empty
     * @returns {Boolean} The result of the evaluation
     */
    isEmpty: (value, zeroIsEmpty = false) => (
            value === "" 
        ||  value === undefined 
        ||  value === "undefined" 
        ||  value === null 
        ||  value === "null"
        ||  (zeroIsEmpty && (value === 0  || value === "0"))
        ||  (Array.isArray(value) && value.length === 0)
        ||  (typeof value == "object" && Object.keys(value).length === 0)
    ),

    /**
     * Evaluates if a variable has a value or not
     * @param {String} value The value to evaluate
     * @param {Boolean} zeroIsEmpty Wether zero should be considered as empty
     * @returns {Boolean} The result of the evaluation
     */
    hasValue: (value, zeroIsEmpty = false) => !helpers.isEmpty(value, zeroIsEmpty),

    /**
     * Parses a value to a Boolean type
     * @param {String} value The value to parse
     * @returns {Boolean} The value parsed as Boolean
     */
    convertStringBoolean: value => value === "true" || value === true,

    /**
     * Build a url with tha passed params
     * @param {String} baseURL The URL base to append params
     * @param {Object} params A JSON with pairs key:value with the params to append
     * @returns {String} The URL with the params appended
     */
    buildURLWithParams: (baseURL, params) => {

        const url = new URL(baseURL);

        for (const key in params)
            url.searchParams.append(key, params[key]);

        return url.href;

    },

}

module.exports = helpers;