"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearPathCache = exports.getAllPaths = exports.isValidPath = exports.deletePath = exports.hasPath = exports.setValueByPath = exports.getValueByPath = exports.safePath = void 0;
const utils_1 = require("./utils");
Object.defineProperty(exports, "clearPathCache", { enumerable: true, get: function () { return utils_1.clearPathCache; } });
Object.defineProperty(exports, "deletePath", { enumerable: true, get: function () { return utils_1.deletePath; } });
Object.defineProperty(exports, "getAllPaths", { enumerable: true, get: function () { return utils_1.getAllPaths; } });
Object.defineProperty(exports, "getValueByPath", { enumerable: true, get: function () { return utils_1.getValueByPath; } });
Object.defineProperty(exports, "hasPath", { enumerable: true, get: function () { return utils_1.hasPath; } });
Object.defineProperty(exports, "isValidPath", { enumerable: true, get: function () { return utils_1.isValidPath; } });
Object.defineProperty(exports, "setValueByPath", { enumerable: true, get: function () { return utils_1.setValueByPath; } });
const safePath = (obj, defaultOptions) => ({
    get(path) {
        return (0, utils_1.getValueByPath)(obj, path);
    },
    set(path, value, options) {
        const opts = { ...defaultOptions, ...options };
        if (opts?.immutable) {
            return (0, utils_1.setValueByPath)(obj, path, value, opts);
        }
        (0, utils_1.setValueByPath)(obj, path, value, opts);
        return obj;
    },
    has(path) {
        return (0, utils_1.hasPath)(obj, path);
    },
    delete(path, options) {
        const opts = { ...defaultOptions, ...options };
        if (opts?.immutable) {
            return (0, utils_1.deletePath)(obj, path, opts);
        }
        (0, utils_1.deletePath)(obj, path, opts);
        return obj;
    },
    update(path, updater, options) {
        const currentValue = (0, utils_1.getValueByPath)(obj, path);
        const newValue = updater(currentValue);
        return this.set(path, newValue, options);
    },
    merge(partial, options) {
        const opts = { ...defaultOptions, ...options };
        const result = deepMerge(obj, partial, opts?.immutable);
        if (!opts?.immutable) {
            Object.assign(obj, result);
        }
        return result;
    },
    getAllPaths() {
        return (0, utils_1.getAllPaths)(obj);
    },
    isValidPath(path) {
        return (0, utils_1.isValidPath)(obj, path);
    },
});
exports.safePath = safePath;
const deepMerge = (target, source, immutable = false) => {
    const result = immutable ? structuredClone(target) : { ...target };
    for (const key in source) {
        if (Object.hasOwn(source, key)) {
            const sourceValue = source[key];
            const targetValue = result[key];
            if (sourceValue &&
                typeof sourceValue === 'object' &&
                !Array.isArray(sourceValue) &&
                targetValue &&
                typeof targetValue === 'object' &&
                !Array.isArray(targetValue)) {
                result[key] = deepMerge(targetValue, sourceValue, immutable);
            }
            else if (sourceValue !== undefined) {
                result[key] = sourceValue;
            }
        }
    }
    return result;
};
//# sourceMappingURL=index.js.map