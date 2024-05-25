class Controller {

    constructor() {

        // A way to implement traits in JavaScript
        if("useTrait" in this)
            for (const trait of this.useTrait())
                Object.assign(Object.getPrototypeOf(this), trait);

        // Allow us to destructure methods. Required for the Express Router
        this._bindContext();

    }

    /**
     * Bind the context of this for each method and property for this class.
     * This allow us to destructure this class without lose the context of "this"
     * so we can call any other method using "this" even if we destructure a class method
     */
    _bindContext() {

        const props = [];
        let classToCheck = this;

        // Get properties of each class and its prototypes (parents)
        do {
            props.push(...Object.getOwnPropertyNames(classToCheck));
        } while (classToCheck = Object.getPrototypeOf(classToCheck));

        props.forEach(method => {
            if(typeof this[method] === "function")
            this[method] = this[method].bind(this);
        });

    }


}

module.exports = { Controller };