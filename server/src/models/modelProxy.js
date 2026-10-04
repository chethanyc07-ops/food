const memoryStore = require('../config/memoryStore');

function createModelProxy(modelName, mongooseModel) {
  return new Proxy(mongooseModel, {
    get(target, prop, receiver) {
      if (memoryStore.isInMemory) {
        const memCollection = memoryStore[modelName];
        if (memCollection && typeof memCollection[prop] === 'function') {
          return memCollection[prop].bind(memCollection);
        }
        if (memCollection && prop in memCollection) {
          return memCollection[prop];
        }
      }
      return Reflect.get(target, prop, receiver);
    },
  });
}

module.exports = createModelProxy;
