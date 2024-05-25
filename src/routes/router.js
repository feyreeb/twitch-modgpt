const router = require('express').Router();
const Controllers = require("#Controllers");

/**
 * Decorator function that allow us to instanciate a Controller for each request
 * @param {String} controllerName The name of the controller to be executed
 * @param {String} methodName The name of the method to be executed
 * @returns {Function} The decorator that will be executed for express router
 */
const addControllerDecorator = (controllerName, methodName) => {

    return (req, res) => {

        const Controller = new Controllers[controllerName];
        const requestHandler = Controller[methodName];
        requestHandler(req, res);

    }

}

/**
 * Decorator function that allow us to instanciate a Middleware  for each request
 * @param {Function} middleware The Middleware that will be called
 * @returns {Function} The decorator that will be executed for express router
 */
const addMiddlewareDecorator = (middleware) => (req, res, next) => middleware(req, res, next);

/**
 * Proxy a router.methodName to allow us to use a decorator and accept strings as Controller.method
 * @param {router.methodName} httpMethod The method to proxy
 * @returns {Proxy} The proxy to apply
 */
const proxyRouter = httpMethod => {
    return new Proxy(httpMethod, {
        apply: (target, thisArg, argumentsList) => {

            const route = argumentsList.shift();
            const [controllerName, methodName] = argumentsList.pop().split("@");
            const middlewares = argumentsList.map(middleware => addMiddlewareDecorator(middleware));

            const newArgumentsList = [
                route,
                ...middlewares,
                addControllerDecorator(controllerName, methodName)
            ];

            return Reflect.apply(target, thisArg, newArgumentsList);

        }
    });
}

// We proxy the most common router methods
router.get = proxyRouter(router.get);
router.post = proxyRouter(router.post);
router.put = proxyRouter(router.put);
router.patch = proxyRouter(router.patch);
router.delete = proxyRouter(router.delete);
router.all = proxyRouter(router.all);

module.exports = router;