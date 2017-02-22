'use strict';

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      support: support,
      isSupported: isSupported
    }
} else if (window) {
    window.mapboxgl = window.mapboxgl || {};
    if (!window.mapboxgl.support) {
      window.mapboxgl.support = support;
    }
}

/**
 * Test whether the current browser supports Mapbox GL JS
 * @param {Object} options
 * @param {boolean} [options.failIfMajorPerformanceCaveat=false] Return `false`
 *   if the performance of Mapbox GL JS would be dramatically worse than
 *   expected (i.e. a software renderer is would be used)
 * @return {boolean}
 */
function isSupported(options) {
    return !!(
        isBrowser() &&
        isArraySupported() &&
        isFunctionSupported() &&
        isObjectSupported() &&
        isJSONSupported() &&
        isWorkerSupported() &&
        isUint8ClampedArraySupported() &&
        isWebGLSupportedCached(options && options.failIfMajorPerformanceCaveat)
    );
}

function support(options) {
  return {
    browser: !!isBrowser(),
    array: !!isArraySupported(),
    function: !!isFunctionSupported(),
    object: !!isObjectSupported(),
    json: !!isJSONSupported(),
    worker: !!isWorkerSupported(),
    uint8Array: !!isUint8ClampedArraySupported(),
    webGL: {
      alpha: !!isWebGLSupported({ alpha: true }),
      alphaPerformance: !!isWebGLSupported({ alpha: true }, true),
      stencil: !!isWebGLSupported({ stencil: true }),
      stencilPerformance: !!isWebGLSupported({ stencil: true }, true),
      depth: !!isWebGLSupported({ depth: true }),
      depthPerformance: !!isWebGLSupported({ depth: true }, true),
    }
  }
}

function isBrowser() {
    return typeof window !== 'undefined' && typeof document !== 'undefined';
}

function isArraySupported() {
    return (
        Array.prototype &&
        Array.prototype.every &&
        Array.prototype.filter &&
        Array.prototype.forEach &&
        Array.prototype.indexOf &&
        Array.prototype.lastIndexOf &&
        Array.prototype.map &&
        Array.prototype.some &&
        Array.prototype.reduce &&
        Array.prototype.reduceRight &&
        Array.isArray
    );
}

function isFunctionSupported() {
    return Function.prototype && Function.prototype.bind;
}

function isObjectSupported() {
    return (
        Object.keys &&
        Object.create &&
        Object.getPrototypeOf &&
        Object.getOwnPropertyNames &&
        Object.isSealed &&
        Object.isFrozen &&
        Object.isExtensible &&
        Object.getOwnPropertyDescriptor &&
        Object.defineProperty &&
        Object.defineProperties &&
        Object.seal &&
        Object.freeze &&
        Object.preventExtensions
    );
}

function isJSONSupported() {
    return 'JSON' in window && 'parse' in JSON && 'stringify' in JSON;
}

function isWorkerSupported() {
    return 'Worker' in window;
}

// IE11 only supports `Uint8ClampedArray` as of version
// [KB2929437](https://support.microsoft.com/en-us/kb/2929437)
function isUint8ClampedArraySupported() {
    return 'Uint8ClampedArray' in window;
}

var isWebGLSupportedCache = {};
function isWebGLSupportedCached(failIfMajorPerformanceCaveat) {

    if (isWebGLSupportedCache[failIfMajorPerformanceCaveat] === undefined) {
        isWebGLSupportedCache[failIfMajorPerformanceCaveat] = isWebGLSupported(Object.create(isSupported.webGLContextAttributes), failIfMajorPerformanceCaveat);
    }

    return isWebGLSupportedCache[failIfMajorPerformanceCaveat];
}

isSupported.webGLContextAttributes = {
    antialias: false,
    alpha: true,
    stencil: true,
    depth: true
};


function isWebGLSupported(contextAttributes, failIfMajorPerformanceCaveat) {

    var canvas = document.createElement('canvas');

    var attributes = contextAttributes;
    attributes.failIfMajorPerformanceCaveat = failIfMajorPerformanceCaveat;

    if (canvas.probablySupportsContext) {
        return (
            canvas.probablySupportsContext('webgl', attributes) ||
            canvas.probablySupportsContext('experimental-webgl', attributes)
        );

    } else if (canvas.supportsContext) {
        return (
            canvas.supportsContext('webgl', attributes) ||
            canvas.supportsContext('experimental-webgl', attributes)
        );

    } else {
        return (
            canvas.getContext('webgl', attributes) ||
            canvas.getContext('experimental-webgl', attributes)
        );
    }
}
