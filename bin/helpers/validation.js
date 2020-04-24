'use strict';

class ValidationContract {
    constructor() {
        this._errors = [];
        this.setEqualsInArray();
    }
    isNotArrayOrEmpty(value, message) {
        if (!value && value.length == 0)
            this._errors.push({ message: message });
    }
    isNotArray(value, message) {
        if (!Array.isArray(value)) {
            this._errors.push({ message: message });
        }
    }
    isTrue(value, message) {
        if (value)
            this._errors.push({ message: message });
    }

    isRequired(value, message) {
        if (!value || value.length <= 0)
            this._errors.push({ message: message });
    }

    hasMinLen(value, min, message) {
        if (!value || value.length < min)
            this._errors.push({ message: message });
    }

    hasMaxLen(value, max, message) {
        if (!value || value.length > max)
            this._errors.push({ message: message });
    }

    isFixedLen(value, len, message) {
        if (value.length != len)
            this._errors.push({ message: message });
    }

    isEmail(value, message) {
        var reg = new RegExp(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/);
        if (!reg.test(value))
            this._errors.push({ message: message });
    }

    errors() {
        return this._errors;
    }

    clear() {
        this._errors = [];
    }

    isValid() {
        return this._errors.length == 0;
    }

    isRequiredPropertiesArray(arrayObject, requiredFields, message) {
        let isInclude;
        if (arrayObject) {
            arrayObject.some(obj => {
                
                requiredFields.some(field => {
                    isInclude = Object.keys(obj).includes(field);

                    if (!isInclude) {
                        this._errors.push({ message: `${message}. Campo: ${field}` });
                        return true;
                    }

                    return false;
                });

            });
        }
    }

    /** @description
     * Implementa customizada o método equals para Array
     */
    setEqualsInArray() {
        
        // https://stackoverflow.com/questions/3552461/how-to-format-a-javascript-date?page=1&tab=votes#tab-top
        const d = new Date()
        const dtf = new Intl.DateTimeFormat('en', 
                { 
                    year: 'numeric', month: '2-digit', day: '2-digit', 
                    hour: '2-digit', minute: '2-digit', second: '2-digit'
                });
        const [{ value: mo },,{ value: da },,{ value: ye },,{ value: hour },,{ value: min },,{value: sec }] = dtf.formatToParts(d);

        // Warn if overriding existing method
        if (Array.prototype.equals){
            console.warn(`[INFORME_APP]${da}-${mo}-${ye} ${hour}:${min}:${sec} 
                - Overriding existing Array.prototype.equals. Possible causes: New API defines the method, 
                there's a framework conflict or you've got double inclusions in your code.`
            );
        }
        
        // attach the .equals method to Array's prototype to call it on any array
        Array.prototype.equals = function (array) {
            // if the other array is a falsy value, return
            if (!array)
                return false;

            // compare lengths - can save a lot of time 
            if (this.length != array.length)
                return false;

            for (var i = 0, l = this.length; i < l; i++) {
                // Check if we have nested arrays
                if (this[i] instanceof Array && array[i] instanceof Array) {
                    // recurse into the nested arrays
                    if (!this[i].equals(array[i]))
                        return false;
                }
                else if (this[i] != array[i]) {
                    // Warning - two different object instances will never be equal: {x:20} != {x:20}
                    return false;
                }
            }
            return true;
        }
        // Hide method from for-in loops
        Object.defineProperty(Array.prototype, "equals", { enumerable: false });
    }
}

module.exports = ValidationContract;    
