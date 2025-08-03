"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearPathCache = exports.getAllPaths = exports.isValidPath = exports.deletePath = exports.hasPath = exports.setValueByPath = exports.getValueByPath = void 0;
const pathCache = new Map();
const parsePath = (path) => {
    if (pathCache.has(path)) {
        const cached = pathCache.get(path);
        if (cached) {
            return cached;
        }
    }
    const keys = path.split('.');
    pathCache.set(path, keys);
    return keys;
};
const getValueByPath = (obj, path) => {
    const keys = parsePath(path);
    let result = obj;
    for (const key of keys) {
        if (result == null || typeof result !== 'object') {
            return undefined;
        }
        result = result[key];
    }
    return result;
};
exports.getValueByPath = getValueByPath;
const setValueByPath = (obj, path, value, options) => {
    const keys = parsePath(path);
    const lastKey = keys.pop();
    if (!lastKey) {
        return obj;
    }
    const target = options?.immutable ? structuredClone(obj) : obj;
    let current = target;
    for (const key of keys) {
        if (!(key in current) ||
            typeof current[key] !== 'object' ||
            current[key] === null) {
            current[key] = {};
        }
        current = current[key];
    }
    current[lastKey] = value;
    return target;
};
exports.setValueByPath = setValueByPath;
const hasPath = (obj, path) => {
    const keys = parsePath(path);
    let current = obj;
    for (const key of keys) {
        if (current == null || typeof current !== 'object' || !(key in current)) {
            return false;
        }
        current = current[key];
    }
    return true;
};
exports.hasPath = hasPath;
const deletePath = (obj, path, options) => {
    const keys = parsePath(path);
    const lastKey = keys.pop();
    if (!lastKey) {
        return obj;
    }
    const target = options?.immutable ? structuredClone(obj) : obj;
    let current = target;
    for (const key of keys) {
        if (current == null || typeof current !== 'object' || !(key in current)) {
            return target;
        }
        current = current[key];
    }
    if (current && typeof current === 'object') {
        delete current[lastKey];
    }
    return target;
};
exports.deletePath = deletePath;
const isValidPath = (obj, path) => typeof path === 'string' &&
    path.length > 0 &&
    (0, exports.hasPath)(obj, path);
exports.isValidPath = isValidPath;
const getAllPaths = (obj, prefix = '') => {
    const paths = [];
    const stack = [{ obj, prefix }];
    while (stack.length > 0) {
        const stackItem = stack.pop();
        if (!stackItem) {
            break;
        }
        const { obj: current, prefix: currentPrefix } = stackItem;
        if (current && typeof current === 'object') {
            const currentObj = current;
            for (const key in currentObj) {
                if (Object.hasOwn(currentObj, key)) {
                    const newPath = currentPrefix ? `${currentPrefix}.${key}` : key;
                    paths.push(newPath);
                    if (currentObj[key] &&
                        typeof currentObj[key] === 'object' &&
                        !Array.isArray(currentObj[key])) {
                        stack.push({ obj: currentObj[key], prefix: newPath });
                    }
                }
            }
        }
    }
    return paths;
};
exports.getAllPaths = getAllPaths;
const clearPathCache = () => {
    pathCache.clear();
};
exports.clearPathCache = clearPathCache;
//# sourceMappingURL=utils.js.map