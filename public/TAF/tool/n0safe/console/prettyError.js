(function() {
    function r(e, n, t) {
        function o(i, f) {
            if (!n[i]) {
                if (!e[i]) { var c = "function" == typeof require && require; if (!f && c) return c(i, !0); if (u) return u(i, !0); var a = new Error("Cannot find module '" + i + "'"); throw a.code = "MODULE_NOT_FOUND", a }
                var p = n[i] = { exports: {} };
                e[i][0].call(p.exports, function(r) { var n = e[i][1][r]; return o(n || r) }, p, p.exports, r, e, n, t)
            }
            return n[i].exports
        }
        for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) o(t[i]);
        return o
    }
    return r
})()({
    1: [function(require, module, exports) {
        (function(process) {
            (function() {
                // 'path' module extracted from Node.js v8.11.1 (only the posix part)
                // transplited with Babel

                // Copyright Joyent, Inc. and other Node contributors.
                //
                // Permission is hereby granted, free of charge, to any person obtaining a
                // copy of this software and associated documentation files (the
                // "Software"), to deal in the Software without restriction, including
                // without limitation the rights to use, copy, modify, merge, publish,
                // distribute, sublicense, and/or sell copies of the Software, and to permit
                // persons to whom the Software is furnished to do so, subject to the
                // following conditions:
                //
                // The above copyright notice and this permission notice shall be included
                // in all copies or substantial portions of the Software.
                //
                // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
                // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
                // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
                // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
                // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
                // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
                // USE OR OTHER DEALINGS IN THE SOFTWARE.

                'use strict';

                function assertPath(path) {
                    if (typeof path !== 'string') {
                        throw new TypeError('Path must be a string. Received ' + JSON.stringify(path));
                    }
                }

                // Resolves . and .. elements in a path with directory names
                function normalizeStringPosix(path, allowAboveRoot) {
                    var res = '';
                    var lastSegmentLength = 0;
                    var lastSlash = -1;
                    var dots = 0;
                    var code;
                    for (var i = 0; i <= path.length; ++i) {
                        if (i < path.length)
                            code = path.charCodeAt(i);
                        else if (code === 47 /*/*/ )
                            break;
                        else
                            code = 47 /*/*/ ;
                        if (code === 47 /*/*/ ) {
                            if (lastSlash === i - 1 || dots === 1) {
                                // NOOP
                            } else if (lastSlash !== i - 1 && dots === 2) {
                                if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 /*.*/ || res.charCodeAt(res.length - 2) !== 46 /*.*/ ) {
                                    if (res.length > 2) {
                                        var lastSlashIndex = res.lastIndexOf('/');
                                        if (lastSlashIndex !== res.length - 1) {
                                            if (lastSlashIndex === -1) {
                                                res = '';
                                                lastSegmentLength = 0;
                                            } else {
                                                res = res.slice(0, lastSlashIndex);
                                                lastSegmentLength = res.length - 1 - res.lastIndexOf('/');
                                            }
                                            lastSlash = i;
                                            dots = 0;
                                            continue;
                                        }
                                    } else if (res.length === 2 || res.length === 1) {
                                        res = '';
                                        lastSegmentLength = 0;
                                        lastSlash = i;
                                        dots = 0;
                                        continue;
                                    }
                                }
                                if (allowAboveRoot) {
                                    if (res.length > 0)
                                        res += '/..';
                                    else
                                        res = '..';
                                    lastSegmentLength = 2;
                                }
                            } else {
                                if (res.length > 0)
                                    res += '/' + path.slice(lastSlash + 1, i);
                                else
                                    res = path.slice(lastSlash + 1, i);
                                lastSegmentLength = i - lastSlash - 1;
                            }
                            lastSlash = i;
                            dots = 0;
                        } else if (code === 46 /*.*/ && dots !== -1) {
                            ++dots;
                        } else {
                            dots = -1;
                        }
                    }
                    return res;
                }

                function _format(sep, pathObject) {
                    var dir = pathObject.dir || pathObject.root;
                    var base = pathObject.base || (pathObject.name || '') + (pathObject.ext || '');
                    if (!dir) {
                        return base;
                    }
                    if (dir === pathObject.root) {
                        return dir + base;
                    }
                    return dir + sep + base;
                }

                var posix = {
                    // path.resolve([from ...], to)
                    resolve: function resolve() {
                        var resolvedPath = '';
                        var resolvedAbsolute = false;
                        var cwd;

                        for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
                            var path;
                            if (i >= 0)
                                path = arguments[i];
                            else {
                                if (cwd === undefined)
                                    cwd = process.cwd();
                                path = cwd;
                            }

                            assertPath(path);

                            // Skip empty entries
                            if (path.length === 0) {
                                continue;
                            }

                            resolvedPath = path + '/' + resolvedPath;
                            resolvedAbsolute = path.charCodeAt(0) === 47 /*/*/ ;
                        }

                        // At this point the path should be resolved to a full absolute path, but
                        // handle relative paths to be safe (might happen when process.cwd() fails)

                        // Normalize the path
                        resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);

                        if (resolvedAbsolute) {
                            if (resolvedPath.length > 0)
                                return '/' + resolvedPath;
                            else
                                return '/';
                        } else if (resolvedPath.length > 0) {
                            return resolvedPath;
                        } else {
                            return '.';
                        }
                    },

                    normalize: function normalize(path) {
                        assertPath(path);

                        if (path.length === 0) return '.';

                        var isAbsolute = path.charCodeAt(0) === 47 /*/*/ ;
                        var trailingSeparator = path.charCodeAt(path.length - 1) === 47 /*/*/ ;

                        // Normalize the path
                        path = normalizeStringPosix(path, !isAbsolute);

                        if (path.length === 0 && !isAbsolute) path = '.';
                        if (path.length > 0 && trailingSeparator) path += '/';

                        if (isAbsolute) return '/' + path;
                        return path;
                    },

                    isAbsolute: function isAbsolute(path) {
                        assertPath(path);
                        return path.length > 0 && path.charCodeAt(0) === 47 /*/*/ ;
                    },

                    join: function join() {
                        if (arguments.length === 0)
                            return '.';
                        var joined;
                        for (var i = 0; i < arguments.length; ++i) {
                            var arg = arguments[i];
                            assertPath(arg);
                            if (arg.length > 0) {
                                if (joined === undefined)
                                    joined = arg;
                                else
                                    joined += '/' + arg;
                            }
                        }
                        if (joined === undefined)
                            return '.';
                        return posix.normalize(joined);
                    },

                    relative: function relative(from, to) {
                        assertPath(from);
                        assertPath(to);

                        if (from === to) return '';

                        from = posix.resolve(from);
                        to = posix.resolve(to);

                        if (from === to) return '';

                        // Trim any leading backslashes
                        var fromStart = 1;
                        for (; fromStart < from.length; ++fromStart) {
                            if (from.charCodeAt(fromStart) !== 47 /*/*/ )
                                break;
                        }
                        var fromEnd = from.length;
                        var fromLen = fromEnd - fromStart;

                        // Trim any leading backslashes
                        var toStart = 1;
                        for (; toStart < to.length; ++toStart) {
                            if (to.charCodeAt(toStart) !== 47 /*/*/ )
                                break;
                        }
                        var toEnd = to.length;
                        var toLen = toEnd - toStart;

                        // Compare paths to find the longest common path from root
                        var length = fromLen < toLen ? fromLen : toLen;
                        var lastCommonSep = -1;
                        var i = 0;
                        for (; i <= length; ++i) {
                            if (i === length) {
                                if (toLen > length) {
                                    if (to.charCodeAt(toStart + i) === 47 /*/*/ ) {
                                        // We get here if `from` is the exact base path for `to`.
                                        // For example: from='/foo/bar'; to='/foo/bar/baz'
                                        return to.slice(toStart + i + 1);
                                    } else if (i === 0) {
                                        // We get here if `from` is the root
                                        // For example: from='/'; to='/foo'
                                        return to.slice(toStart + i);
                                    }
                                } else if (fromLen > length) {
                                    if (from.charCodeAt(fromStart + i) === 47 /*/*/ ) {
                                        // We get here if `to` is the exact base path for `from`.
                                        // For example: from='/foo/bar/baz'; to='/foo/bar'
                                        lastCommonSep = i;
                                    } else if (i === 0) {
                                        // We get here if `to` is the root.
                                        // For example: from='/foo'; to='/'
                                        lastCommonSep = 0;
                                    }
                                }
                                break;
                            }
                            var fromCode = from.charCodeAt(fromStart + i);
                            var toCode = to.charCodeAt(toStart + i);
                            if (fromCode !== toCode)
                                break;
                            else if (fromCode === 47 /*/*/ )
                                lastCommonSep = i;
                        }

                        var out = '';
                        // Generate the relative path based on the path difference between `to`
                        // and `from`
                        for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
                            if (i === fromEnd || from.charCodeAt(i) === 47 /*/*/ ) {
                                if (out.length === 0)
                                    out += '..';
                                else
                                    out += '/..';
                            }
                        }

                        // Lastly, append the rest of the destination (`to`) path that comes after
                        // the common path parts
                        if (out.length > 0)
                            return out + to.slice(toStart + lastCommonSep);
                        else {
                            toStart += lastCommonSep;
                            if (to.charCodeAt(toStart) === 47 /*/*/ )
                                ++toStart;
                            return to.slice(toStart);
                        }
                    },

                    _makeLong: function _makeLong(path) {
                        return path;
                    },

                    dirname: function dirname(path) {
                        assertPath(path);
                        if (path.length === 0) return '.';
                        var code = path.charCodeAt(0);
                        var hasRoot = code === 47 /*/*/ ;
                        var end = -1;
                        var matchedSlash = true;
                        for (var i = path.length - 1; i >= 1; --i) {
                            code = path.charCodeAt(i);
                            if (code === 47 /*/*/ ) {
                                if (!matchedSlash) {
                                    end = i;
                                    break;
                                }
                            } else {
                                // We saw the first non-path separator
                                matchedSlash = false;
                            }
                        }

                        if (end === -1) return hasRoot ? '/' : '.';
                        if (hasRoot && end === 1) return '//';
                        return path.slice(0, end);
                    },

                    basename: function basename(path, ext) {
                        if (ext !== undefined && typeof ext !== 'string') throw new TypeError('"ext" argument must be a string');
                        assertPath(path);

                        var start = 0;
                        var end = -1;
                        var matchedSlash = true;
                        var i;

                        if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
                            if (ext.length === path.length && ext === path) return '';
                            var extIdx = ext.length - 1;
                            var firstNonSlashEnd = -1;
                            for (i = path.length - 1; i >= 0; --i) {
                                var code = path.charCodeAt(i);
                                if (code === 47 /*/*/ ) {
                                    // If we reached a path separator that was not part of a set of path
                                    // separators at the end of the string, stop now
                                    if (!matchedSlash) {
                                        start = i + 1;
                                        break;
                                    }
                                } else {
                                    if (firstNonSlashEnd === -1) {
                                        // We saw the first non-path separator, remember this index in case
                                        // we need it if the extension ends up not matching
                                        matchedSlash = false;
                                        firstNonSlashEnd = i + 1;
                                    }
                                    if (extIdx >= 0) {
                                        // Try to match the explicit extension
                                        if (code === ext.charCodeAt(extIdx)) {
                                            if (--extIdx === -1) {
                                                // We matched the extension, so mark this as the end of our path
                                                // component
                                                end = i;
                                            }
                                        } else {
                                            // Extension does not match, so our result is the entire path
                                            // component
                                            extIdx = -1;
                                            end = firstNonSlashEnd;
                                        }
                                    }
                                }
                            }

                            if (start === end) end = firstNonSlashEnd;
                            else if (end === -1) end = path.length;
                            return path.slice(start, end);
                        } else {
                            for (i = path.length - 1; i >= 0; --i) {
                                if (path.charCodeAt(i) === 47 /*/*/ ) {
                                    // If we reached a path separator that was not part of a set of path
                                    // separators at the end of the string, stop now
                                    if (!matchedSlash) {
                                        start = i + 1;
                                        break;
                                    }
                                } else if (end === -1) {
                                    // We saw the first non-path separator, mark this as the end of our
                                    // path component
                                    matchedSlash = false;
                                    end = i + 1;
                                }
                            }

                            if (end === -1) return '';
                            return path.slice(start, end);
                        }
                    },

                    extname: function extname(path) {
                        assertPath(path);
                        var startDot = -1;
                        var startPart = 0;
                        var end = -1;
                        var matchedSlash = true;
                        // Track the state of characters (if any) we see before our first dot and
                        // after any path separator we find
                        var preDotState = 0;
                        for (var i = path.length - 1; i >= 0; --i) {
                            var code = path.charCodeAt(i);
                            if (code === 47 /*/*/ ) {
                                // If we reached a path separator that was not part of a set of path
                                // separators at the end of the string, stop now
                                if (!matchedSlash) {
                                    startPart = i + 1;
                                    break;
                                }
                                continue;
                            }
                            if (end === -1) {
                                // We saw the first non-path separator, mark this as the end of our
                                // extension
                                matchedSlash = false;
                                end = i + 1;
                            }
                            if (code === 46 /*.*/ ) {
                                // If this is our first dot, mark it as the start of our extension
                                if (startDot === -1)
                                    startDot = i;
                                else if (preDotState !== 1)
                                    preDotState = 1;
                            } else if (startDot !== -1) {
                                // We saw a non-dot and non-path separator before our dot, so we should
                                // have a good chance at having a non-empty extension
                                preDotState = -1;
                            }
                        }

                        if (startDot === -1 || end === -1 ||
                            // We saw a non-dot character immediately before the dot
                            preDotState === 0 ||
                            // The (right-most) trimmed path component is exactly '..'
                            preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
                            return '';
                        }
                        return path.slice(startDot, end);
                    },

                    format: function format(pathObject) {
                        if (pathObject === null || typeof pathObject !== 'object') {
                            throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
                        }
                        return _format('/', pathObject);
                    },

                    parse: function parse(path) {
                        assertPath(path);

                        var ret = { root: '', dir: '', base: '', ext: '', name: '' };
                        if (path.length === 0) return ret;
                        var code = path.charCodeAt(0);
                        var isAbsolute = code === 47 /*/*/ ;
                        var start;
                        if (isAbsolute) {
                            ret.root = '/';
                            start = 1;
                        } else {
                            start = 0;
                        }
                        var startDot = -1;
                        var startPart = 0;
                        var end = -1;
                        var matchedSlash = true;
                        var i = path.length - 1;

                        // Track the state of characters (if any) we see before our first dot and
                        // after any path separator we find
                        var preDotState = 0;

                        // Get non-dir info
                        for (; i >= start; --i) {
                            code = path.charCodeAt(i);
                            if (code === 47 /*/*/ ) {
                                // If we reached a path separator that was not part of a set of path
                                // separators at the end of the string, stop now
                                if (!matchedSlash) {
                                    startPart = i + 1;
                                    break;
                                }
                                continue;
                            }
                            if (end === -1) {
                                // We saw the first non-path separator, mark this as the end of our
                                // extension
                                matchedSlash = false;
                                end = i + 1;
                            }
                            if (code === 46 /*.*/ ) {
                                // If this is our first dot, mark it as the start of our extension
                                if (startDot === -1) startDot = i;
                                else if (preDotState !== 1) preDotState = 1;
                            } else if (startDot !== -1) {
                                // We saw a non-dot and non-path separator before our dot, so we should
                                // have a good chance at having a non-empty extension
                                preDotState = -1;
                            }
                        }

                        if (startDot === -1 || end === -1 ||
                            // We saw a non-dot character immediately before the dot
                            preDotState === 0 ||
                            // The (right-most) trimmed path component is exactly '..'
                            preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
                            if (end !== -1) {
                                if (startPart === 0 && isAbsolute) ret.base = ret.name = path.slice(1, end);
                                else ret.base = ret.name = path.slice(startPart, end);
                            }
                        } else {
                            if (startPart === 0 && isAbsolute) {
                                ret.name = path.slice(1, startDot);
                                ret.base = path.slice(1, end);
                            } else {
                                ret.name = path.slice(startPart, startDot);
                                ret.base = path.slice(startPart, end);
                            }
                            ret.ext = path.slice(startDot, end);
                        }

                        if (startPart > 0) ret.dir = path.slice(0, startPart - 1);
                        else if (isAbsolute) ret.dir = '/';

                        return ret;
                    },

                    sep: '/',
                    delimiter: ':',
                    win32: null,
                    posix: null
                };

                posix.posix = posix;

                module.exports = posix;

            }).call(this)
        }).call(this, require('_process'))
    }, { "_process": 2 }],
    2: [function(require, module, exports) {
        // shim for using process in browser
        var process = module.exports = {};

        // cached from whatever global is present so that test runners that stub it
        // don't break things.  But we need to wrap it in a try catch in case it is
        // wrapped in strict mode code which doesn't define any globals.  It's inside a
        // function because try/catches deoptimize in certain engines.

        var cachedSetTimeout;
        var cachedClearTimeout;

        function defaultSetTimout() {
            throw new Error('setTimeout has not been defined');
        }

        function defaultClearTimeout() {
            throw new Error('clearTimeout has not been defined');
        }
        (function() {
            try {
                if (typeof setTimeout === 'function') {
                    cachedSetTimeout = setTimeout;
                } else {
                    cachedSetTimeout = defaultSetTimout;
                }
            } catch (e) {
                cachedSetTimeout = defaultSetTimout;
            }
            try {
                if (typeof clearTimeout === 'function') {
                    cachedClearTimeout = clearTimeout;
                } else {
                    cachedClearTimeout = defaultClearTimeout;
                }
            } catch (e) {
                cachedClearTimeout = defaultClearTimeout;
            }
        }())

        function runTimeout(fun) {
            if (cachedSetTimeout === setTimeout) {
                //normal enviroments in sane situations
                return setTimeout(fun, 0);
            }
            // if setTimeout wasn't available but was latter defined
            if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
                cachedSetTimeout = setTimeout;
                return setTimeout(fun, 0);
            }
            try {
                // when when somebody has screwed with setTimeout but no I.E. maddness
                return cachedSetTimeout(fun, 0);
            } catch (e) {
                try {
                    // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
                    return cachedSetTimeout.call(null, fun, 0);
                } catch (e) {
                    // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
                    return cachedSetTimeout.call(this, fun, 0);
                }
            }


        }

        function runClearTimeout(marker) {
            if (cachedClearTimeout === clearTimeout) {
                //normal enviroments in sane situations
                return clearTimeout(marker);
            }
            // if clearTimeout wasn't available but was latter defined
            if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
                cachedClearTimeout = clearTimeout;
                return clearTimeout(marker);
            }
            try {
                // when when somebody has screwed with setTimeout but no I.E. maddness
                return cachedClearTimeout(marker);
            } catch (e) {
                try {
                    // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
                    return cachedClearTimeout.call(null, marker);
                } catch (e) {
                    // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
                    // Some versions of I.E. have different rules for clearTimeout vs setTimeout
                    return cachedClearTimeout.call(this, marker);
                }
            }



        }
        var queue = [];
        var draining = false;
        var currentQueue;
        var queueIndex = -1;

        function cleanUpNextTick() {
            if (!draining || !currentQueue) {
                return;
            }
            draining = false;
            if (currentQueue.length) {
                queue = currentQueue.concat(queue);
            } else {
                queueIndex = -1;
            }
            if (queue.length) {
                drainQueue();
            }
        }

        function drainQueue() {
            if (draining) {
                return;
            }
            var timeout = runTimeout(cleanUpNextTick);
            draining = true;

            var len = queue.length;
            while (len) {
                currentQueue = queue;
                queue = [];
                while (++queueIndex < len) {
                    if (currentQueue) {
                        currentQueue[queueIndex].run();
                    }
                }
                queueIndex = -1;
                len = queue.length;
            }
            currentQueue = null;
            draining = false;
            runClearTimeout(timeout);
        }

        process.nextTick = function(fun) {
            var args = new Array(arguments.length - 1);
            if (arguments.length > 1) {
                for (var i = 1; i < arguments.length; i++) {
                    args[i - 1] = arguments[i];
                }
            }
            queue.push(new Item(fun, args));
            if (queue.length === 1 && !draining) {
                runTimeout(drainQueue);
            }
        };

        // v8 likes predictible objects
        function Item(fun, array) {
            this.fun = fun;
            this.array = array;
        }
        Item.prototype.run = function() {
            this.fun.apply(null, this.array);
        };
        process.title = 'browser';
        process.browser = true;
        process.env = {};
        process.argv = [];
        process.version = ''; // empty string to avoid regexp issues
        process.versions = {};

        function noop() {}

        process.on = noop;
        process.addListener = noop;
        process.once = noop;
        process.off = noop;
        process.removeListener = noop;
        process.removeAllListeners = noop;
        process.emit = noop;
        process.prependListener = noop;
        process.prependOnceListener = noop;

        process.listeners = function(name) { return [] }

        process.binding = function(name) {
            throw new Error('process.binding is not supported');
        };

        process.cwd = function() { return '/' };
        process.chdir = function(dir) {
            throw new Error('process.chdir is not supported');
        };
        process.umask = function() { return 0; };

    }, {}],
    3: [function(require, module, exports) {
        exports.isatty = function() { return false; };

        function ReadStream() {
            throw new Error('tty.ReadStream is not implemented');
        }
        exports.ReadStream = ReadStream;

        function WriteStream() {
            throw new Error('tty.WriteStream is not implemented');
        }
        exports.WriteStream = WriteStream;

    }, {}],
    4: [function(require, module, exports) {
        'use strict';

        module.exports = ({ onlyFirst = false } = {}) => {
            const pattern = [
                '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
                '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))'
            ].join('|');

            return new RegExp(pattern, onlyFirst ? undefined : 'g');
        };

    }, {}],
    5: [function(require, module, exports) {
        module.exports = {
            trueFunc: function trueFunc() {
                return true;
            },
            falseFunc: function falseFunc() {
                return false;
            }
        };
    }, {}],
    6: [function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.attributeRules = void 0;
        var boolbase_1 = require("boolbase");
        /**
         * All reserved characters in a regex, used for escaping.
         *
         * Taken from XRegExp, (c) 2007-2020 Steven Levithan under the MIT license
         * https://github.com/slevithan/xregexp/blob/95eeebeb8fac8754d54eafe2b4743661ac1cf028/src/xregexp.js#L794
         */
        var reChars = /[-[\]{}()*+?.,\\^$|#\s]/g;

        function escapeRegex(value) {
            return value.replace(reChars, "\\$&");
        }
        /**
         * Attribute selectors
         */
        exports.attributeRules = {
            equals: function(next, data, _a) {
                var adapter = _a.adapter;
                var name = data.name;
                var value = data.value;
                if (data.ignoreCase) {
                    value = value.toLowerCase();
                    return function(elem) {
                        var attr = adapter.getAttributeValue(elem, name);
                        return (attr != null &&
                            attr.length === value.length &&
                            attr.toLowerCase() === value &&
                            next(elem));
                    };
                }
                return function(elem) {
                    return adapter.getAttributeValue(elem, name) === value && next(elem);
                };
            },
            hyphen: function(next, data, _a) {
                var adapter = _a.adapter;
                var name = data.name;
                var value = data.value;
                var len = value.length;
                if (data.ignoreCase) {
                    value = value.toLowerCase();
                    return function hyphenIC(elem) {
                        var attr = adapter.getAttributeValue(elem, name);
                        return (attr != null &&
                            (attr.length === len || attr.charAt(len) === "-") &&
                            attr.substr(0, len).toLowerCase() === value &&
                            next(elem));
                    };
                }
                return function hyphen(elem) {
                    var attr = adapter.getAttributeValue(elem, name);
                    return (attr != null &&
                        (attr.length === len || attr.charAt(len) === "-") &&
                        attr.substr(0, len) === value &&
                        next(elem));
                };
            },
            element: function(next, _a, _b) {
                var name = _a.name,
                    value = _a.value,
                    ignoreCase = _a.ignoreCase;
                var adapter = _b.adapter;
                if (/\s/.test(value)) {
                    return boolbase_1.falseFunc;
                }
                var regex = new RegExp("(?:^|\\s)".concat(escapeRegex(value), "(?:$|\\s)"), ignoreCase ? "i" : "");
                return function element(elem) {
                    var attr = adapter.getAttributeValue(elem, name);
                    return (attr != null &&
                        attr.length >= value.length &&
                        regex.test(attr) &&
                        next(elem));
                };
            },
            exists: function(next, _a, _b) {
                var name = _a.name;
                var adapter = _b.adapter;
                return function(elem) { return adapter.hasAttrib(elem, name) && next(elem); };
            },
            start: function(next, data, _a) {
                var adapter = _a.adapter;
                var name = data.name;
                var value = data.value;
                var len = value.length;
                if (len === 0) {
                    return boolbase_1.falseFunc;
                }
                if (data.ignoreCase) {
                    value = value.toLowerCase();
                    return function(elem) {
                        var attr = adapter.getAttributeValue(elem, name);
                        return (attr != null &&
                            attr.length >= len &&
                            attr.substr(0, len).toLowerCase() === value &&
                            next(elem));
                    };
                }
                return function(elem) {
                    var _a;
                    return !!((_a = adapter.getAttributeValue(elem, name)) === null || _a === void 0 ? void 0 : _a.startsWith(value)) &&
                        next(elem);
                };
            },
            end: function(next, data, _a) {
                var adapter = _a.adapter;
                var name = data.name;
                var value = data.value;
                var len = -value.length;
                if (len === 0) {
                    return boolbase_1.falseFunc;
                }
                if (data.ignoreCase) {
                    value = value.toLowerCase();
                    return function(elem) {
                        var _a;
                        return ((_a = adapter
                            .getAttributeValue(elem, name)) === null || _a === void 0 ? void 0 : _a.substr(len).toLowerCase()) === value && next(elem);
                    };
                }
                return function(elem) {
                    var _a;
                    return !!((_a = adapter.getAttributeValue(elem, name)) === null || _a === void 0 ? void 0 : _a.endsWith(value)) &&
                        next(elem);
                };
            },
            any: function(next, data, _a) {
                var adapter = _a.adapter;
                var name = data.name,
                    value = data.value;
                if (value === "") {
                    return boolbase_1.falseFunc;
                }
                if (data.ignoreCase) {
                    var regex_1 = new RegExp(escapeRegex(value), "i");
                    return function anyIC(elem) {
                        var attr = adapter.getAttributeValue(elem, name);
                        return (attr != null &&
                            attr.length >= value.length &&
                            regex_1.test(attr) &&
                            next(elem));
                    };
                }
                return function(elem) {
                    var _a;
                    return !!((_a = adapter.getAttributeValue(elem, name)) === null || _a === void 0 ? void 0 : _a.includes(value)) &&
                        next(elem);
                };
            },
            not: function(next, data, _a) {
                var adapter = _a.adapter;
                var name = data.name;
                var value = data.value;
                if (value === "") {
                    return function(elem) {
                        return !!adapter.getAttributeValue(elem, name) && next(elem);
                    };
                } else if (data.ignoreCase) {
                    value = value.toLowerCase();
                    return function(elem) {
                        var attr = adapter.getAttributeValue(elem, name);
                        return ((attr == null ||
                                attr.length !== value.length ||
                                attr.toLowerCase() !== value) &&
                            next(elem));
                    };
                }
                return function(elem) {
                    return adapter.getAttributeValue(elem, name) !== value && next(elem);
                };
            },
        };

    }, { "boolbase": 5 }],
    7: [function(require, module, exports) {
        "use strict";
        var __importDefault = (this && this.__importDefault) || function(mod) {
            return (mod && mod.__esModule) ? mod : { "default": mod };
        };
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.compileToken = exports.compileUnsafe = exports.compile = void 0;
        var css_what_1 = require("css-what");
        var boolbase_1 = require("boolbase");
        var sort_1 = __importDefault(require("./sort"));
        var procedure_1 = require("./procedure");
        var general_1 = require("./general");
        var subselects_1 = require("./pseudo-selectors/subselects");
        /**
         * Compiles a selector to an executable function.
         *
         * @param selector Selector to compile.
         * @param options Compilation options.
         * @param context Optional context for the selector.
         */
        function compile(selector, options, context) {
            var next = compileUnsafe(selector, options, context);
            return (0, subselects_1.ensureIsTag)(next, options.adapter);
        }
        exports.compile = compile;

        function compileUnsafe(selector, options, context) {
            var token = typeof selector === "string" ? (0, css_what_1.parse)(selector, options) : selector;
            return compileToken(token, options, context);
        }
        exports.compileUnsafe = compileUnsafe;

        function includesScopePseudo(t) {
            return (t.type === "pseudo" &&
                (t.name === "scope" ||
                    (Array.isArray(t.data) &&
                        t.data.some(function(data) { return data.some(includesScopePseudo); }))));
        }
        var DESCENDANT_TOKEN = { type: "descendant" };
        var FLEXIBLE_DESCENDANT_TOKEN = {
            type: "_flexibleDescendant",
        };
        var SCOPE_TOKEN = { type: "pseudo", name: "scope", data: null };
        /*
         * CSS 4 Spec (Draft): 3.3.1. Absolutizing a Scope-relative Selector
         * http://www.w3.org/TR/selectors4/#absolutizing
         */
        function absolutize(token, _a, context) {
            var adapter = _a.adapter;
            // TODO Use better check if the context is a document
            var hasContext = !!(context === null || context === void 0 ? void 0 : context.every(function(e) {
                var parent = adapter.isTag(e) && adapter.getParent(e);
                return e === subselects_1.PLACEHOLDER_ELEMENT || (parent && adapter.isTag(parent));
            }));
            for (var _i = 0, token_1 = token; _i < token_1.length; _i++) {
                var t = token_1[_i];
                if (t.length > 0 && (0, procedure_1.isTraversal)(t[0]) && t[0].type !== "descendant") {
                    // Don't continue in else branch
                } else if (hasContext && !t.some(includesScopePseudo)) {
                    t.unshift(DESCENDANT_TOKEN);
                } else {
                    continue;
                }
                t.unshift(SCOPE_TOKEN);
            }
        }

        function compileToken(token, options, context) {
            var _a;
            token = token.filter(function(t) { return t.length > 0; });
            token.forEach(sort_1.default);
            context = (_a = options.context) !== null && _a !== void 0 ? _a : context;
            var isArrayContext = Array.isArray(context);
            var finalContext = context && (Array.isArray(context) ? context : [context]);
            absolutize(token, options, finalContext);
            var shouldTestNextSiblings = false;
            var query = token
                .map(function(rules) {
                    if (rules.length >= 2) {
                        var first = rules[0],
                            second = rules[1];
                        if (first.type !== "pseudo" || first.name !== "scope") {
                            // Ignore
                        } else if (isArrayContext && second.type === "descendant") {
                            rules[1] = FLEXIBLE_DESCENDANT_TOKEN;
                        } else if (second.type === "adjacent" ||
                            second.type === "sibling") {
                            shouldTestNextSiblings = true;
                        }
                    }
                    return compileRules(rules, options, finalContext);
                })
                .reduce(reduceRules, boolbase_1.falseFunc);
            query.shouldTestNextSiblings = shouldTestNextSiblings;
            return query;
        }
        exports.compileToken = compileToken;

        function compileRules(rules, options, context) {
            var _a;
            return rules.reduce(function(previous, rule) {
                return previous === boolbase_1.falseFunc ?
                    boolbase_1.falseFunc :
                    (0, general_1.compileGeneralSelector)(previous, rule, options, context, compileToken);
            }, (_a = options.rootFunc) !== null && _a !== void 0 ? _a : boolbase_1.trueFunc);
        }

        function reduceRules(a, b) {
            if (b === boolbase_1.falseFunc || a === boolbase_1.trueFunc) {
                return a;
            }
            if (a === boolbase_1.falseFunc || b === boolbase_1.trueFunc) {
                return b;
            }
            return function combine(elem) {
                return a(elem) || b(elem);
            };
        }

    }, { "./general": 8, "./procedure": 10, "./pseudo-selectors/subselects": 15, "./sort": 16, "boolbase": 5, "css-what": 17 }],
    8: [function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.compileGeneralSelector = void 0;
        var attributes_1 = require("./attributes");
        var pseudo_selectors_1 = require("./pseudo-selectors");
        /*
         * All available rules
         */
        function compileGeneralSelector(next, selector, options, context, compileToken) {
            var adapter = options.adapter,
                equals = options.equals;
            switch (selector.type) {
                case "pseudo-element":
                    throw new Error("Pseudo-elements are not supported by css-select");
                case "attribute":
                    return attributes_1.attributeRules[selector.action](next, selector, options);
                case "pseudo":
                    return (0, pseudo_selectors_1.compilePseudoSelector)(next, selector, options, context, compileToken);
                    // Tags
                case "tag":
                    return function tag(elem) {
                        return adapter.getName(elem) === selector.name && next(elem);
                    };
                    // Traversal
                case "descendant":
                    if (options.cacheResults === false ||
                        typeof WeakSet === "undefined") {
                        return function descendant(elem) {
                            var current = elem;
                            while ((current = adapter.getParent(current))) {
                                if (adapter.isTag(current) && next(current)) {
                                    return true;
                                }
                            }
                            return false;
                        };
                    }
                    // @ts-expect-error `ElementNode` is not extending object
                    // eslint-disable-next-line no-case-declarations
                    var isFalseCache_1 = new WeakSet();
                    return function cachedDescendant(elem) {
                        var current = elem;
                        while ((current = adapter.getParent(current))) {
                            if (!isFalseCache_1.has(current)) {
                                if (adapter.isTag(current) && next(current)) {
                                    return true;
                                }
                                isFalseCache_1.add(current);
                            }
                        }
                        return false;
                    };
                case "_flexibleDescendant":
                    // Include element itself, only used while querying an array
                    return function flexibleDescendant(elem) {
                        var current = elem;
                        do {
                            if (adapter.isTag(current) && next(current))
                                return true;
                        } while ((current = adapter.getParent(current)));
                        return false;
                    };
                case "parent":
                    return function parent(elem) {
                        return adapter
                            .getChildren(elem)
                            .some(function(elem) { return adapter.isTag(elem) && next(elem); });
                    };
                case "child":
                    return function child(elem) {
                        var parent = adapter.getParent(elem);
                        return parent != null && adapter.isTag(parent) && next(parent);
                    };
                case "sibling":
                    return function sibling(elem) {
                        var siblings = adapter.getSiblings(elem);
                        for (var i = 0; i < siblings.length; i++) {
                            var currentSibling = siblings[i];
                            if (equals(elem, currentSibling))
                                break;
                            if (adapter.isTag(currentSibling) && next(currentSibling)) {
                                return true;
                            }
                        }
                        return false;
                    };
                case "adjacent":
                    return function adjacent(elem) {
                        var siblings = adapter.getSiblings(elem);
                        var lastElement;
                        for (var i = 0; i < siblings.length; i++) {
                            var currentSibling = siblings[i];
                            if (equals(elem, currentSibling))
                                break;
                            if (adapter.isTag(currentSibling)) {
                                lastElement = currentSibling;
                            }
                        }
                        return !!lastElement && next(lastElement);
                    };
                case "universal":
                    return next;
            }
        }
        exports.compileGeneralSelector = compileGeneralSelector;

    }, { "./attributes": 6, "./pseudo-selectors": 13 }],
    9: [function(require, module, exports) {
        "use strict";
        var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
            if (k2 === undefined) k2 = k;
            Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
        }) : (function(o, m, k, k2) {
            if (k2 === undefined) k2 = k;
            o[k2] = m[k];
        }));
        var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
            Object.defineProperty(o, "default", { enumerable: true, value: v });
        }) : function(o, v) {
            o["default"] = v;
        });
        var __importStar = (this && this.__importStar) || function(mod) {
            if (mod && mod.__esModule) return mod;
            var result = {};
            if (mod != null)
                for (var k in mod)
                    if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
            __setModuleDefault(result, mod);
            return result;
        };
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.aliases = exports.pseudos = exports.filters = exports.is = exports.selectOne = exports.selectAll = exports.prepareContext = exports._compileToken = exports._compileUnsafe = exports.compile = void 0;
        var DomUtils = __importStar(require("domutils"));
        var boolbase_1 = require("boolbase");
        var compile_1 = require("./compile");
        var subselects_1 = require("./pseudo-selectors/subselects");
        var defaultEquals = function(a, b) { return a === b; };
        var defaultOptions = {
            adapter: DomUtils,
            equals: defaultEquals,
        };

        function convertOptionFormats(options) {
            var _a, _b, _c, _d;
            /*
             * We force one format of options to the other one.
             */
            // @ts-expect-error Default options may have incompatible `Node` / `ElementNode`.
            var opts = options !== null && options !== void 0 ? options : defaultOptions;
            // @ts-expect-error Same as above.
            (_a = opts.adapter) !== null && _a !== void 0 ? _a : (opts.adapter = DomUtils);
            // @ts-expect-error `equals` does not exist on `Options`
            (_b = opts.equals) !== null && _b !== void 0 ? _b : (opts.equals = (_d = (_c = opts.adapter) === null || _c === void 0 ? void 0 : _c.equals) !== null && _d !== void 0 ? _d : defaultEquals);
            return opts;
        }

        function wrapCompile(func) {
            return function addAdapter(selector, options, context) {
                var opts = convertOptionFormats(options);
                return func(selector, opts, context);
            };
        }
        /**
         * Compiles the query, returns a function.
         */
        exports.compile = wrapCompile(compile_1.compile);
        exports._compileUnsafe = wrapCompile(compile_1.compileUnsafe);
        exports._compileToken = wrapCompile(compile_1.compileToken);

        function getSelectorFunc(searchFunc) {
            return function select(query, elements, options) {
                var opts = convertOptionFormats(options);
                if (typeof query !== "function") {
                    query = (0, compile_1.compileUnsafe)(query, opts, elements);
                }
                var filteredElements = prepareContext(elements, opts.adapter, query.shouldTestNextSiblings);
                return searchFunc(query, filteredElements, opts);
            };
        }

        function prepareContext(elems, adapter, shouldTestNextSiblings) {
            if (shouldTestNextSiblings === void 0) { shouldTestNextSiblings = false; }
            /*
             * Add siblings if the query requires them.
             * See https://github.com/fb55/css-select/pull/43#issuecomment-225414692
             */
            if (shouldTestNextSiblings) {
                elems = appendNextSiblings(elems, adapter);
            }
            return Array.isArray(elems) ?
                adapter.removeSubsets(elems) :
                adapter.getChildren(elems);
        }
        exports.prepareContext = prepareContext;

        function appendNextSiblings(elem, adapter) {
            // Order matters because jQuery seems to check the children before the siblings
            var elems = Array.isArray(elem) ? elem.slice(0) : [elem];
            var elemsLength = elems.length;
            for (var i = 0; i < elemsLength; i++) {
                var nextSiblings = (0, subselects_1.getNextSiblings)(elems[i], adapter);
                elems.push.apply(elems, nextSiblings);
            }
            return elems;
        }
        /**
         * @template Node The generic Node type for the DOM adapter being used.
         * @template ElementNode The Node type for elements for the DOM adapter being used.
         * @param elems Elements to query. If it is an element, its children will be queried..
         * @param query can be either a CSS selector string or a compiled query function.
         * @param [options] options for querying the document.
         * @see compile for supported selector queries.
         * @returns All matching elements.
         *
         */
        exports.selectAll = getSelectorFunc(function(query, elems, options) {
            return query === boolbase_1.falseFunc || !elems || elems.length === 0 ? [] :
                options.adapter.findAll(query, elems);
        });
        /**
         * @template Node The generic Node type for the DOM adapter being used.
         * @template ElementNode The Node type for elements for the DOM adapter being used.
         * @param elems Elements to query. If it is an element, its children will be queried..
         * @param query can be either a CSS selector string or a compiled query function.
         * @param [options] options for querying the document.
         * @see compile for supported selector queries.
         * @returns the first match, or null if there was no match.
         */
        exports.selectOne = getSelectorFunc(function(query, elems, options) {
            return query === boolbase_1.falseFunc || !elems || elems.length === 0 ?
                null :
                options.adapter.findOne(query, elems);
        });
        /**
         * Tests whether or not an element is matched by query.
         *
         * @template Node The generic Node type for the DOM adapter being used.
         * @template ElementNode The Node type for elements for the DOM adapter being used.
         * @param elem The element to test if it matches the query.
         * @param query can be either a CSS selector string or a compiled query function.
         * @param [options] options for querying the document.
         * @see compile for supported selector queries.
         * @returns
         */
        function is(elem, query, options) {
            var opts = convertOptionFormats(options);
            return (typeof query === "function" ? query : (0, compile_1.compile)(query, opts))(elem);
        }
        exports.is = is;
        /**
         * Alias for selectAll(query, elems, options).
         * @see [compile] for supported selector queries.
         */
        exports.default = exports.selectAll;
        // Export filters, pseudos and aliases to allow users to supply their own.
        var pseudo_selectors_1 = require("./pseudo-selectors");
        Object.defineProperty(exports, "filters", { enumerable: true, get: function() { return pseudo_selectors_1.filters; } });
        Object.defineProperty(exports, "pseudos", { enumerable: true, get: function() { return pseudo_selectors_1.pseudos; } });
        Object.defineProperty(exports, "aliases", { enumerable: true, get: function() { return pseudo_selectors_1.aliases; } });

    }, { "./compile": 7, "./pseudo-selectors": 13, "./pseudo-selectors/subselects": 15, "boolbase": 5, "domutils": 31 }],
    10: [function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.isTraversal = exports.procedure = void 0;
        exports.procedure = {
            universal: 50,
            tag: 30,
            attribute: 1,
            pseudo: 0,
            "pseudo-element": 0,
            descendant: -1,
            child: -1,
            parent: -1,
            sibling: -1,
            adjacent: -1,
            _flexibleDescendant: -1,
        };

        function isTraversal(t) {
            return exports.procedure[t.type] < 0;
        }
        exports.isTraversal = isTraversal;

    }, {}],
    11: [function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.aliases = void 0;
        /**
         * Aliases are pseudos that are expressed as selectors.
         */
        exports.aliases = {
            // Links
            "any-link": ":is(a, area, link)[href]",
            link: ":any-link:not(:visited)",
            // Forms
            // https://html.spec.whatwg.org/multipage/scripting.html#disabled-elements
            disabled: ":is(\n        :is(button, input, select, textarea, optgroup, option)[disabled],\n        optgroup[disabled] > option,\n        fieldset[disabled]:not(fieldset[disabled] legend:first-of-type *)\n    )",
            enabled: ":not(:disabled)",
            checked: ":is(:is(input[type=radio], input[type=checkbox])[checked], option:selected)",
            required: ":is(input, select, textarea)[required]",
            optional: ":is(input, select, textarea):not([required])",
            // JQuery extensions
            // https://html.spec.whatwg.org/multipage/form-elements.html#concept-option-selectedness
            selected: "option:is([selected], select:not([multiple]):not(:has(> option[selected])) > :first-of-type)",
            checkbox: "[type=checkbox]",
            file: "[type=file]",
            password: "[type=password]",
            radio: "[type=radio]",
            reset: "[type=reset]",
            image: "[type=image]",
            submit: "[type=submit]",
            parent: ":not(:empty)",
            header: ":is(h1, h2, h3, h4, h5, h6)",
            button: ":is(button, input[type=button])",
            input: ":is(input, textarea, select, button)",
            text: "input:is(:not([type!='']), [type=text])",
        };

    }, {}],
    12: [function(require, module, exports) {
        "use strict";
        var __importDefault = (this && this.__importDefault) || function(mod) {
            return (mod && mod.__esModule) ? mod : { "default": mod };
        };
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.filters = void 0;
        var nth_check_1 = __importDefault(require("nth-check"));
        var boolbase_1 = require("boolbase");

        function getChildFunc(next, adapter) {
            return function(elem) {
                var parent = adapter.getParent(elem);
                return parent != null && adapter.isTag(parent) && next(elem);
            };
        }
        exports.filters = {
            contains: function(next, text, _a) {
                var adapter = _a.adapter;
                return function contains(elem) {
                    return next(elem) && adapter.getText(elem).includes(text);
                };
            },
            icontains: function(next, text, _a) {
                var adapter = _a.adapter;
                var itext = text.toLowerCase();
                return function icontains(elem) {
                    return (next(elem) &&
                        adapter.getText(elem).toLowerCase().includes(itext));
                };
            },
            // Location specific methods
            "nth-child": function(next, rule, _a) {
                var adapter = _a.adapter,
                    equals = _a.equals;
                var func = (0, nth_check_1.default)(rule);
                if (func === boolbase_1.falseFunc)
                    return boolbase_1.falseFunc;
                if (func === boolbase_1.trueFunc)
                    return getChildFunc(next, adapter);
                return function nthChild(elem) {
                    var siblings = adapter.getSiblings(elem);
                    var pos = 0;
                    for (var i = 0; i < siblings.length; i++) {
                        if (equals(elem, siblings[i]))
                            break;
                        if (adapter.isTag(siblings[i])) {
                            pos++;
                        }
                    }
                    return func(pos) && next(elem);
                };
            },
            "nth-last-child": function(next, rule, _a) {
                var adapter = _a.adapter,
                    equals = _a.equals;
                var func = (0, nth_check_1.default)(rule);
                if (func === boolbase_1.falseFunc)
                    return boolbase_1.falseFunc;
                if (func === boolbase_1.trueFunc)
                    return getChildFunc(next, adapter);
                return function nthLastChild(elem) {
                    var siblings = adapter.getSiblings(elem);
                    var pos = 0;
                    for (var i = siblings.length - 1; i >= 0; i--) {
                        if (equals(elem, siblings[i]))
                            break;
                        if (adapter.isTag(siblings[i])) {
                            pos++;
                        }
                    }
                    return func(pos) && next(elem);
                };
            },
            "nth-of-type": function(next, rule, _a) {
                var adapter = _a.adapter,
                    equals = _a.equals;
                var func = (0, nth_check_1.default)(rule);
                if (func === boolbase_1.falseFunc)
                    return boolbase_1.falseFunc;
                if (func === boolbase_1.trueFunc)
                    return getChildFunc(next, adapter);
                return function nthOfType(elem) {
                    var siblings = adapter.getSiblings(elem);
                    var pos = 0;
                    for (var i = 0; i < siblings.length; i++) {
                        var currentSibling = siblings[i];
                        if (equals(elem, currentSibling))
                            break;
                        if (adapter.isTag(currentSibling) &&
                            adapter.getName(currentSibling) === adapter.getName(elem)) {
                            pos++;
                        }
                    }
                    return func(pos) && next(elem);
                };
            },
            "nth-last-of-type": function(next, rule, _a) {
                var adapter = _a.adapter,
                    equals = _a.equals;
                var func = (0, nth_check_1.default)(rule);
                if (func === boolbase_1.falseFunc)
                    return boolbase_1.falseFunc;
                if (func === boolbase_1.trueFunc)
                    return getChildFunc(next, adapter);
                return function nthLastOfType(elem) {
                    var siblings = adapter.getSiblings(elem);
                    var pos = 0;
                    for (var i = siblings.length - 1; i >= 0; i--) {
                        var currentSibling = siblings[i];
                        if (equals(elem, currentSibling))
                            break;
                        if (adapter.isTag(currentSibling) &&
                            adapter.getName(currentSibling) === adapter.getName(elem)) {
                            pos++;
                        }
                    }
                    return func(pos) && next(elem);
                };
            },
            // TODO determine the actual root element
            root: function(next, _rule, _a) {
                var adapter = _a.adapter;
                return function(elem) {
                    var parent = adapter.getParent(elem);
                    return (parent == null || !adapter.isTag(parent)) && next(elem);
                };
            },
            scope: function(next, rule, options, context) {
                var equals = options.equals;
                if (!context || context.length === 0) {
                    // Equivalent to :root
                    return exports.filters.root(next, rule, options);
                }
                if (context.length === 1) {
                    // NOTE: can't be unpacked, as :has uses this for side-effects
                    return function(elem) { return equals(context[0], elem) && next(elem); };
                }
                return function(elem) { return context.includes(elem) && next(elem); };
            },
            hover: dynamicStatePseudo("isHovered"),
            visited: dynamicStatePseudo("isVisited"),
            active: dynamicStatePseudo("isActive"),
        };
        /**
         * Dynamic state pseudos. These depend on optional Adapter methods.
         *
         * @param name The name of the adapter method to call.
         * @returns Pseudo for the `filters` object.
         */
        function dynamicStatePseudo(name) {
            return function dynamicPseudo(next, _rule, _a) {
                var adapter = _a.adapter;
                var func = adapter[name];
                if (typeof func !== "function") {
                    return boolbase_1.falseFunc;
                }
                return function active(elem) {
                    return func(elem) && next(elem);
                };
            };
        }

    }, { "boolbase": 5, "nth-check": 178 }],
    13: [function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.compilePseudoSelector = exports.aliases = exports.pseudos = exports.filters = void 0;
        /*
         * Pseudo selectors
         *
         * Pseudo selectors are available in three forms:
         *
         * 1. Filters are called when the selector is compiled and return a function
         *  that has to return either false, or the results of `next()`.
         * 2. Pseudos are called on execution. They have to return a boolean.
         * 3. Subselects work like filters, but have an embedded selector that will be run separately.
         *
         * Filters are great if you want to do some pre-processing, or change the call order
         * of `next()` and your code.
         * Pseudos should be used to implement simple checks.
         */
        var boolbase_1 = require("boolbase");
        var css_what_1 = require("css-what");
        var filters_1 = require("./filters");
        Object.defineProperty(exports, "filters", { enumerable: true, get: function() { return filters_1.filters; } });
        var pseudos_1 = require("./pseudos");
        Object.defineProperty(exports, "pseudos", { enumerable: true, get: function() { return pseudos_1.pseudos; } });
        var aliases_1 = require("./aliases");
        Object.defineProperty(exports, "aliases", { enumerable: true, get: function() { return aliases_1.aliases; } });
        var subselects_1 = require("./subselects");

        function compilePseudoSelector(next, selector, options, context, compileToken) {
            var name = selector.name,
                data = selector.data;
            if (Array.isArray(data)) {
                return subselects_1.subselects[name](next, data, options, context, compileToken);
            }
            if (name in aliases_1.aliases) {
                if (data != null) {
                    throw new Error("Pseudo ".concat(name, " doesn't have any arguments"));
                }
                // The alias has to be parsed here, to make sure options are respected.
                var alias = (0, css_what_1.parse)(aliases_1.aliases[name], options);
                return subselects_1.subselects.is(next, alias, options, context, compileToken);
            }
            if (name in filters_1.filters) {
                return filters_1.filters[name](next, data, options, context);
            }
            if (name in pseudos_1.pseudos) {
                var pseudo_1 = pseudos_1.pseudos[name];
                (0, pseudos_1.verifyPseudoArgs)(pseudo_1, name, data);
                return pseudo_1 === boolbase_1.falseFunc ?
                    boolbase_1.falseFunc :
                    next === boolbase_1.trueFunc ?

                    function(elem) { return pseudo_1(elem, options, data); } :
                    function(elem) { return pseudo_1(elem, options, data) && next(elem); };
            }
            throw new Error("unmatched pseudo-class :".concat(name));
        }
        exports.compilePseudoSelector = compilePseudoSelector;

    }, { "./aliases": 11, "./filters": 12, "./pseudos": 14, "./subselects": 15, "boolbase": 5, "css-what": 17 }],
    14: [function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.verifyPseudoArgs = exports.pseudos = void 0;
        // While filters are precompiled, pseudos get called when they are needed
        exports.pseudos = {
            empty: function(elem, _a) {
                var adapter = _a.adapter;
                return !adapter.getChildren(elem).some(function(elem) {
                    // FIXME: `getText` call is potentially expensive.
                    return adapter.isTag(elem) || adapter.getText(elem) !== "";
                });
            },
            "first-child": function(elem, _a) {
                var adapter = _a.adapter,
                    equals = _a.equals;
                var firstChild = adapter
                    .getSiblings(elem)
                    .find(function(elem) { return adapter.isTag(elem); });
                return firstChild != null && equals(elem, firstChild);
            },
            "last-child": function(elem, _a) {
                var adapter = _a.adapter,
                    equals = _a.equals;
                var siblings = adapter.getSiblings(elem);
                for (var i = siblings.length - 1; i >= 0; i--) {
                    if (equals(elem, siblings[i]))
                        return true;
                    if (adapter.isTag(siblings[i]))
                        break;
                }
                return false;
            },
            "first-of-type": function(elem, _a) {
                var adapter = _a.adapter,
                    equals = _a.equals;
                var siblings = adapter.getSiblings(elem);
                var elemName = adapter.getName(elem);
                for (var i = 0; i < siblings.length; i++) {
                    var currentSibling = siblings[i];
                    if (equals(elem, currentSibling))
                        return true;
                    if (adapter.isTag(currentSibling) &&
                        adapter.getName(currentSibling) === elemName) {
                        break;
                    }
                }
                return false;
            },
            "last-of-type": function(elem, _a) {
                var adapter = _a.adapter,
                    equals = _a.equals;
                var siblings = adapter.getSiblings(elem);
                var elemName = adapter.getName(elem);
                for (var i = siblings.length - 1; i >= 0; i--) {
                    var currentSibling = siblings[i];
                    if (equals(elem, currentSibling))
                        return true;
                    if (adapter.isTag(currentSibling) &&
                        adapter.getName(currentSibling) === elemName) {
                        break;
                    }
                }
                return false;
            },
            "only-of-type": function(elem, _a) {
                var adapter = _a.adapter,
                    equals = _a.equals;
                var elemName = adapter.getName(elem);
                return adapter
                    .getSiblings(elem)
                    .every(function(sibling) {
                        return equals(elem, sibling) ||
                            !adapter.isTag(sibling) ||
                            adapter.getName(sibling) !== elemName;
                    });
            },
            "only-child": function(elem, _a) {
                var adapter = _a.adapter,
                    equals = _a.equals;
                return adapter
                    .getSiblings(elem)
                    .every(function(sibling) { return equals(elem, sibling) || !adapter.isTag(sibling); });
            },
        };

        function verifyPseudoArgs(func, name, subselect) {
            if (subselect === null) {
                if (func.length > 2) {
                    throw new Error("pseudo-selector :".concat(name, " requires an argument"));
                }
            } else if (func.length === 2) {
                throw new Error("pseudo-selector :".concat(name, " doesn't have any arguments"));
            }
        }
        exports.verifyPseudoArgs = verifyPseudoArgs;

    }, {}],
    15: [function(require, module, exports) {
        "use strict";
        var __spreadArray = (this && this.__spreadArray) || function(to, from, pack) {
            if (pack || arguments.length === 2)
                for (var i = 0, l = from.length, ar; i < l; i++) {
                    if (ar || !(i in from)) {
                        if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                        ar[i] = from[i];
                    }
                }
            return to.concat(ar || Array.prototype.slice.call(from));
        };
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.subselects = exports.getNextSiblings = exports.ensureIsTag = exports.PLACEHOLDER_ELEMENT = void 0;
        var boolbase_1 = require("boolbase");
        var procedure_1 = require("../procedure");
        /** Used as a placeholder for :has. Will be replaced with the actual element. */
        exports.PLACEHOLDER_ELEMENT = {};

        function ensureIsTag(next, adapter) {
            if (next === boolbase_1.falseFunc)
                return boolbase_1.falseFunc;
            return function(elem) { return adapter.isTag(elem) && next(elem); };
        }
        exports.ensureIsTag = ensureIsTag;

        function getNextSiblings(elem, adapter) {
            var siblings = adapter.getSiblings(elem);
            if (siblings.length <= 1)
                return [];
            var elemIndex = siblings.indexOf(elem);
            if (elemIndex < 0 || elemIndex === siblings.length - 1)
                return [];
            return siblings.slice(elemIndex + 1).filter(adapter.isTag);
        }
        exports.getNextSiblings = getNextSiblings;
        var is = function(next, token, options, context, compileToken) {
            var opts = {
                xmlMode: !!options.xmlMode,
                adapter: options.adapter,
                equals: options.equals,
            };
            var func = compileToken(token, opts, context);
            return function(elem) { return func(elem) && next(elem); };
        };
        /*
         * :not, :has, :is, :matches and :where have to compile selectors
         * doing this in src/pseudos.ts would lead to circular dependencies,
         * so we add them here
         */
        exports.subselects = {
            is: is,
            /**
             * `:matches` and `:where` are aliases for `:is`.
             */
            matches: is,
            where: is,
            not: function(next, token, options, context, compileToken) {
                var opts = {
                    xmlMode: !!options.xmlMode,
                    adapter: options.adapter,
                    equals: options.equals,
                };
                var func = compileToken(token, opts, context);
                if (func === boolbase_1.falseFunc)
                    return next;
                if (func === boolbase_1.trueFunc)
                    return boolbase_1.falseFunc;
                return function not(elem) {
                    return !func(elem) && next(elem);
                };
            },
            has: function(next, subselect, options, _context, compileToken) {
                var adapter = options.adapter;
                var opts = {
                    xmlMode: !!options.xmlMode,
                    adapter: adapter,
                    equals: options.equals,
                };
                // @ts-expect-error Uses an array as a pointer to the current element (side effects)
                var context = subselect.some(function(s) {
                        return s.some(procedure_1.isTraversal);
                    }) ? [exports.PLACEHOLDER_ELEMENT] :
                    undefined;
                var compiled = compileToken(subselect, opts, context);
                if (compiled === boolbase_1.falseFunc)
                    return boolbase_1.falseFunc;
                if (compiled === boolbase_1.trueFunc) {
                    return function(elem) {
                        return adapter.getChildren(elem).some(adapter.isTag) && next(elem);
                    };
                }
                var hasElement = ensureIsTag(compiled, adapter);
                var _a = compiled.shouldTestNextSiblings,
                    shouldTestNextSiblings = _a === void 0 ? false : _a;
                /*
                 * `shouldTestNextSiblings` will only be true if the query starts with
                 * a traversal (sibling or adjacent). That means we will always have a context.
                 */
                if (context) {
                    return function(elem) {
                        context[0] = elem;
                        var childs = adapter.getChildren(elem);
                        var nextElements = shouldTestNextSiblings ?
                            __spreadArray(__spreadArray([], childs, true), getNextSiblings(elem, adapter), true) : childs;
                        return (next(elem) && adapter.existsOne(hasElement, nextElements));
                    };
                }
                return function(elem) {
                    return next(elem) &&
                        adapter.existsOne(hasElement, adapter.getChildren(elem));
                };
            },
        };

    }, { "../procedure": 10, "boolbase": 5 }],
    16: [function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        var procedure_1 = require("./procedure");
        var attributes = {
            exists: 10,
            equals: 8,
            not: 7,
            start: 6,
            end: 6,
            any: 5,
            hyphen: 4,
            element: 4,
        };
        /**
         * Sort the parts of the passed selector,
         * as there is potential for optimization
         * (some types of selectors are faster than others)
         *
         * @param arr Selector to sort
         */
        function sortByProcedure(arr) {
            var procs = arr.map(getProcedure);
            for (var i = 1; i < arr.length; i++) {
                var procNew = procs[i];
                if (procNew < 0)
                    continue;
                for (var j = i - 1; j >= 0 && procNew < procs[j]; j--) {
                    var token = arr[j + 1];
                    arr[j + 1] = arr[j];
                    arr[j] = token;
                    procs[j + 1] = procs[j];
                    procs[j] = procNew;
                }
            }
        }
        exports.default = sortByProcedure;

        function getProcedure(token) {
            var proc = procedure_1.procedure[token.type];
            if (token.type === "attribute") {
                proc = attributes[token.action];
                if (proc === attributes.equals && token.name === "id") {
                    // Prefer ID selectors (eg. #ID)
                    proc = 9;
                }
                if (token.ignoreCase) {
                    /*
                     * IgnoreCase adds some overhead, prefer "normal" token
                     * this is a binary operation, to ensure it's still an int
                     */
                    proc >>= 1;
                }
            } else if (token.type === "pseudo") {
                if (!token.data) {
                    proc = 3;
                } else if (token.name === "has" || token.name === "contains") {
                    proc = 0; // Expensive in any case
                } else if (Array.isArray(token.data)) {
                    // "matches" and "not"
                    proc = 0;
                    for (var i = 0; i < token.data.length; i++) {
                        // TODO better handling of complex selectors
                        if (token.data[i].length !== 1)
                            continue;
                        var cur = getProcedure(token.data[i][0]);
                        // Avoid executing :has or :contains
                        if (cur === 0) {
                            proc = 0;
                            break;
                        }
                        if (cur > proc)
                            proc = cur;
                    }
                    if (token.data.length > 1 && proc > 0)
                        proc -= 1;
                } else {
                    proc = 1;
                }
            }
            return proc;
        }

    }, { "./procedure": 10 }],
    17: [function(require, module, exports) {
        "use strict";
        var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
            if (k2 === undefined) k2 = k;
            Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
        }) : (function(o, m, k, k2) {
            if (k2 === undefined) k2 = k;
            o[k2] = m[k];
        }));
        var __exportStar = (this && this.__exportStar) || function(m, exports) {
            for (var p in m)
                if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
        };
        var __importDefault = (this && this.__importDefault) || function(mod) {
            return (mod && mod.__esModule) ? mod : { "default": mod };
        };
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.stringify = exports.parse = void 0;
        __exportStar(require("./parse"), exports);
        var parse_1 = require("./parse");
        Object.defineProperty(exports, "parse", { enumerable: true, get: function() { return __importDefault(parse_1).default; } });
        var stringify_1 = require("./stringify");
        Object.defineProperty(exports, "stringify", { enumerable: true, get: function() { return __importDefault(stringify_1).default; } });

    }, { "./parse": 18, "./stringify": 19 }],
    18: [function(require, module, exports) {
        "use strict";
        var __spreadArray = (this && this.__spreadArray) || function(to, from, pack) {
            if (pack || arguments.length === 2)
                for (var i = 0, l = from.length, ar; i < l; i++) {
                    if (ar || !(i in from)) {
                        if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                        ar[i] = from[i];
                    }
                }
            return to.concat(ar || Array.prototype.slice.call(from));
        };
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.isTraversal = void 0;
        var reName = /^[^\\#]?(?:\\(?:[\da-f]{1,6}\s?|.)|[\w\-\u00b0-\uFFFF])+/;
        var reEscape = /\\([\da-f]{1,6}\s?|(\s)|.)/gi;
        var actionTypes = new Map([
            ["~", "element"],
            ["^", "start"],
            ["$", "end"],
            ["*", "any"],
            ["!", "not"],
            ["|", "hyphen"],
        ]);
        var Traversals = {
            ">": "child",
            "<": "parent",
            "~": "sibling",
            "+": "adjacent",
        };
        var attribSelectors = {
            "#": ["id", "equals"],
            ".": ["class", "element"],
        };
        // Pseudos, whose data property is parsed as well.
        var unpackPseudos = new Set([
            "has",
            "not",
            "matches",
            "is",
            "where",
            "host",
            "host-context",
        ]);
        var traversalNames = new Set(__spreadArray([
            "descendant"
        ], Object.keys(Traversals).map(function(k) { return Traversals[k]; }), true));
        /**
         * Attributes that are case-insensitive in HTML.
         *
         * @private
         * @see https://html.spec.whatwg.org/multipage/semantics-other.html#case-sensitivity-of-selectors
         */
        var caseInsensitiveAttributes = new Set([
            "accept",
            "accept-charset",
            "align",
            "alink",
            "axis",
            "bgcolor",
            "charset",
            "checked",
            "clear",
            "codetype",
            "color",
            "compact",
            "declare",
            "defer",
            "dir",
            "direction",
            "disabled",
            "enctype",
            "face",
            "frame",
            "hreflang",
            "http-equiv",
            "lang",
            "language",
            "link",
            "media",
            "method",
            "multiple",
            "nohref",
            "noresize",
            "noshade",
            "nowrap",
            "readonly",
            "rel",
            "rev",
            "rules",
            "scope",
            "scrolling",
            "selected",
            "shape",
            "target",
            "text",
            "type",
            "valign",
            "valuetype",
            "vlink",
        ]);
        /**
         * Checks whether a specific selector is a traversal.
         * This is useful eg. in swapping the order of elements that
         * are not traversals.
         *
         * @param selector Selector to check.
         */
        function isTraversal(selector) {
            return traversalNames.has(selector.type);
        }
        exports.isTraversal = isTraversal;
        var stripQuotesFromPseudos = new Set(["contains", "icontains"]);
        var quotes = new Set(['"', "'"]);
        // Unescape function taken from https://github.com/jquery/sizzle/blob/master/src/sizzle.js#L152
        function funescape(_, escaped, escapedWhitespace) {
            var high = parseInt(escaped, 16) - 0x10000;
            // NaN means non-codepoint
            return high !== high || escapedWhitespace ?
                escaped :
                high < 0 ? // BMP codepoint
                String.fromCharCode(high + 0x10000) : // Supplemental Plane codepoint (surrogate pair)
                String.fromCharCode((high >> 10) | 0xd800, (high & 0x3ff) | 0xdc00);
        }

        function unescapeCSS(str) {
            return str.replace(reEscape, funescape);
        }

        function isWhitespace(c) {
            return c === " " || c === "\n" || c === "\t" || c === "\f" || c === "\r";
        }
        /**
         * Parses `selector`, optionally with the passed `options`.
         *
         * @param selector Selector to parse.
         * @param options Options for parsing.
         * @returns Returns a two-dimensional array.
         * The first dimension represents selectors separated by commas (eg. `sub1, sub2`),
         * the second contains the relevant tokens for that selector.
         */
        function parse(selector, options) {
            var subselects = [];
            var endIndex = parseSelector(subselects, "" + selector, options, 0);
            if (endIndex < selector.length) {
                throw new Error("Unmatched selector: " + selector.slice(endIndex));
            }
            return subselects;
        }
        exports.default = parse;

        function parseSelector(subselects, selector, options, selectorIndex) {
            var _a, _b;
            if (options === void 0) { options = {}; }
            var tokens = [];
            var sawWS = false;

            function getName(offset) {
                var match = selector.slice(selectorIndex + offset).match(reName);
                if (!match) {
                    throw new Error("Expected name, found " + selector.slice(selectorIndex));
                }
                var name = match[0];
                selectorIndex += offset + name.length;
                return unescapeCSS(name);
            }

            function stripWhitespace(offset) {
                while (isWhitespace(selector.charAt(selectorIndex + offset)))
                    offset++;
                selectorIndex += offset;
            }

            function isEscaped(pos) {
                var slashCount = 0;
                while (selector.charAt(--pos) === "\\")
                    slashCount++;
                return (slashCount & 1) === 1;
            }

            function ensureNotTraversal() {
                if (tokens.length > 0 && isTraversal(tokens[tokens.length - 1])) {
                    throw new Error("Did not expect successive traversals.");
                }
            }
            stripWhitespace(0);
            while (selector !== "") {
                var firstChar = selector.charAt(selectorIndex);
                if (isWhitespace(firstChar)) {
                    sawWS = true;
                    stripWhitespace(1);
                } else if (firstChar in Traversals) {
                    ensureNotTraversal();
                    tokens.push({ type: Traversals[firstChar] });
                    sawWS = false;
                    stripWhitespace(1);
                } else if (firstChar === ",") {
                    if (tokens.length === 0) {
                        throw new Error("Empty sub-selector");
                    }
                    subselects.push(tokens);
                    tokens = [];
                    sawWS = false;
                    stripWhitespace(1);
                } else if (selector.startsWith("/*", selectorIndex)) {
                    var endIndex = selector.indexOf("*/", selectorIndex + 2);
                    if (endIndex < 0) {
                        throw new Error("Comment was not terminated");
                    }
                    selectorIndex = endIndex + 2;
                } else {
                    if (sawWS) {
                        ensureNotTraversal();
                        tokens.push({ type: "descendant" });
                        sawWS = false;
                    }
                    if (firstChar in attribSelectors) {
                        var _c = attribSelectors[firstChar],
                            name_1 = _c[0],
                            action = _c[1];
                        tokens.push({
                            type: "attribute",
                            name: name_1,
                            action: action,
                            value: getName(1),
                            namespace: null,
                            // TODO: Add quirksMode option, which makes `ignoreCase` `true` for HTML.
                            ignoreCase: options.xmlMode ? null : false,
                        });
                    } else if (firstChar === "[") {
                        stripWhitespace(1);
                        // Determine attribute name and namespace
                        var namespace = null;
                        if (selector.charAt(selectorIndex) === "|") {
                            namespace = "";
                            selectorIndex += 1;
                        }
                        if (selector.startsWith("*|", selectorIndex)) {
                            namespace = "*";
                            selectorIndex += 2;
                        }
                        var name_2 = getName(0);
                        if (namespace === null &&
                            selector.charAt(selectorIndex) === "|" &&
                            selector.charAt(selectorIndex + 1) !== "=") {
                            namespace = name_2;
                            name_2 = getName(1);
                        }
                        if ((_a = options.lowerCaseAttributeNames) !== null && _a !== void 0 ? _a : !options.xmlMode) {
                            name_2 = name_2.toLowerCase();
                        }
                        stripWhitespace(0);
                        // Determine comparison operation
                        var action = "exists";
                        var possibleAction = actionTypes.get(selector.charAt(selectorIndex));
                        if (possibleAction) {
                            action = possibleAction;
                            if (selector.charAt(selectorIndex + 1) !== "=") {
                                throw new Error("Expected `=`");
                            }
                            stripWhitespace(2);
                        } else if (selector.charAt(selectorIndex) === "=") {
                            action = "equals";
                            stripWhitespace(1);
                        }
                        // Determine value
                        var value = "";
                        var ignoreCase = null;
                        if (action !== "exists") {
                            if (quotes.has(selector.charAt(selectorIndex))) {
                                var quote = selector.charAt(selectorIndex);
                                var sectionEnd = selectorIndex + 1;
                                while (sectionEnd < selector.length &&
                                    (selector.charAt(sectionEnd) !== quote ||
                                        isEscaped(sectionEnd))) {
                                    sectionEnd += 1;
                                }
                                if (selector.charAt(sectionEnd) !== quote) {
                                    throw new Error("Attribute value didn't end");
                                }
                                value = unescapeCSS(selector.slice(selectorIndex + 1, sectionEnd));
                                selectorIndex = sectionEnd + 1;
                            } else {
                                var valueStart = selectorIndex;
                                while (selectorIndex < selector.length &&
                                    ((!isWhitespace(selector.charAt(selectorIndex)) &&
                                            selector.charAt(selectorIndex) !== "]") ||
                                        isEscaped(selectorIndex))) {
                                    selectorIndex += 1;
                                }
                                value = unescapeCSS(selector.slice(valueStart, selectorIndex));
                            }
                            stripWhitespace(0);
                            // See if we have a force ignore flag
                            var forceIgnore = selector.charAt(selectorIndex);
                            // If the forceIgnore flag is set (either `i` or `s`), use that value
                            if (forceIgnore === "s" || forceIgnore === "S") {
                                ignoreCase = false;
                                stripWhitespace(1);
                            } else if (forceIgnore === "i" || forceIgnore === "I") {
                                ignoreCase = true;
                                stripWhitespace(1);
                            }
                        }
                        // If `xmlMode` is set, there are no rules; otherwise, use the `caseInsensitiveAttributes` list.
                        if (!options.xmlMode) {
                            // TODO: Skip this for `exists`, as there is no value to compare to.
                            ignoreCase !== null && ignoreCase !== void 0 ? ignoreCase : (ignoreCase = caseInsensitiveAttributes.has(name_2));
                        }
                        if (selector.charAt(selectorIndex) !== "]") {
                            throw new Error("Attribute selector didn't terminate");
                        }
                        selectorIndex += 1;
                        var attributeSelector = {
                            type: "attribute",
                            name: name_2,
                            action: action,
                            value: value,
                            namespace: namespace,
                            ignoreCase: ignoreCase,
                        };
                        tokens.push(attributeSelector);
                    } else if (firstChar === ":") {
                        if (selector.charAt(selectorIndex + 1) === ":") {
                            tokens.push({
                                type: "pseudo-element",
                                name: getName(2).toLowerCase(),
                            });
                            continue;
                        }
                        var name_3 = getName(1).toLowerCase();
                        var data = null;
                        if (selector.charAt(selectorIndex) === "(") {
                            if (unpackPseudos.has(name_3)) {
                                if (quotes.has(selector.charAt(selectorIndex + 1))) {
                                    throw new Error("Pseudo-selector " + name_3 + " cannot be quoted");
                                }
                                data = [];
                                selectorIndex = parseSelector(data, selector, options, selectorIndex + 1);
                                if (selector.charAt(selectorIndex) !== ")") {
                                    throw new Error("Missing closing parenthesis in :" + name_3 + " (" + selector + ")");
                                }
                                selectorIndex += 1;
                            } else {
                                selectorIndex += 1;
                                var start = selectorIndex;
                                var counter = 1;
                                for (; counter > 0 && selectorIndex < selector.length; selectorIndex++) {
                                    if (selector.charAt(selectorIndex) === "(" &&
                                        !isEscaped(selectorIndex)) {
                                        counter++;
                                    } else if (selector.charAt(selectorIndex) === ")" &&
                                        !isEscaped(selectorIndex)) {
                                        counter--;
                                    }
                                }
                                if (counter) {
                                    throw new Error("Parenthesis not matched");
                                }
                                data = selector.slice(start, selectorIndex - 1);
                                if (stripQuotesFromPseudos.has(name_3)) {
                                    var quot = data.charAt(0);
                                    if (quot === data.slice(-1) && quotes.has(quot)) {
                                        data = data.slice(1, -1);
                                    }
                                    data = unescapeCSS(data);
                                }
                            }
                        }
                        tokens.push({ type: "pseudo", name: name_3, data: data });
                    } else {
                        var namespace = null;
                        var name_4 = void 0;
                        if (firstChar === "*") {
                            selectorIndex += 1;
                            name_4 = "*";
                        } else if (reName.test(selector.slice(selectorIndex))) {
                            if (selector.charAt(selectorIndex) === "|") {
                                namespace = "";
                                selectorIndex += 1;
                            }
                            name_4 = getName(0);
                        } else {
                            /*
                             * We have finished parsing the selector.
                             * Remove descendant tokens at the end if they exist,
                             * and return the last index, so that parsing can be
                             * picked up from here.
                             */
                            if (tokens.length &&
                                tokens[tokens.length - 1].type === "descendant") {
                                tokens.pop();
                            }
                            addToken(subselects, tokens);
                            return selectorIndex;
                        }
                        if (selector.charAt(selectorIndex) === "|") {
                            namespace = name_4;
                            if (selector.charAt(selectorIndex + 1) === "*") {
                                name_4 = "*";
                                selectorIndex += 2;
                            } else {
                                name_4 = getName(1);
                            }
                        }
                        if (name_4 === "*") {
                            tokens.push({ type: "universal", namespace: namespace });
                        } else {
                            if ((_b = options.lowerCaseTags) !== null && _b !== void 0 ? _b : !options.xmlMode) {
                                name_4 = name_4.toLowerCase();
                            }
                            tokens.push({ type: "tag", name: name_4, namespace: namespace });
                        }
                    }
                }
            }
            addToken(subselects, tokens);
            return selectorIndex;
        }

        function addToken(subselects, tokens) {
            if (subselects.length > 0 && tokens.length === 0) {
                throw new Error("Empty sub-selector");
            }
            subselects.push(tokens);
        }

    }, {}],
    19: [function(require, module, exports) {
        "use strict";
        var __spreadArray = (this && this.__spreadArray) || function(to, from, pack) {
            if (pack || arguments.length === 2)
                for (var i = 0, l = from.length, ar; i < l; i++) {
                    if (ar || !(i in from)) {
                        if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                        ar[i] = from[i];
                    }
                }
            return to.concat(ar || Array.prototype.slice.call(from));
        };
        Object.defineProperty(exports, "__esModule", { value: true });
        var actionTypes = {
            equals: "",
            element: "~",
            start: "^",
            end: "$",
            any: "*",
            not: "!",
            hyphen: "|",
        };
        var charsToEscape = new Set(__spreadArray(__spreadArray([], Object.keys(actionTypes)
            .map(function(typeKey) { return actionTypes[typeKey]; })
            .filter(Boolean), true), [
            ":",
            "[",
            "]",
            " ",
            "\\",
            "(",
            ")",
            "'",
        ], false));
        /**
         * Turns `selector` back into a string.
         *
         * @param selector Selector to stringify.
         */
        function stringify(selector) {
            return selector.map(stringifySubselector).join(", ");
        }
        exports.default = stringify;

        function stringifySubselector(token) {
            return token.map(stringifyToken).join("");
        }

        function stringifyToken(token) {
            switch (token.type) {
                // Simple types
                case "child":
                    return " > ";
                case "parent":
                    return " < ";
                case "sibling":
                    return " ~ ";
                case "adjacent":
                    return " + ";
                case "descendant":
                    return " ";
                case "universal":
                    return getNamespace(token.namespace) + "*";
                case "tag":
                    return getNamespacedName(token);
                case "pseudo-element":
                    return "::" + escapeName(token.name);
                case "pseudo":
                    if (token.data === null)
                        return ":" + escapeName(token.name);
                    if (typeof token.data === "string") {
                        return ":" + escapeName(token.name) + "(" + escapeName(token.data) + ")";
                    }
                    return ":" + escapeName(token.name) + "(" + stringify(token.data) + ")";
                case "attribute":
                    {
                        if (token.name === "id" &&
                            token.action === "equals" &&
                            !token.ignoreCase &&
                            !token.namespace) {
                            return "#" + escapeName(token.value);
                        }
                        if (token.name === "class" &&
                            token.action === "element" &&
                            !token.ignoreCase &&
                            !token.namespace) {
                            return "." + escapeName(token.value);
                        }
                        var name_1 = getNamespacedName(token);
                        if (token.action === "exists") {
                            return "[" + name_1 + "]";
                        }
                        return "[" + name_1 + actionTypes[token.action] + "='" + escapeName(token.value) + "'" + (token.ignoreCase ? "i" : token.ignoreCase === false ? "s" : "") + "]";
                    }
            }
        }

        function getNamespacedName(token) {
            return "" + getNamespace(token.namespace) + escapeName(token.name);
        }

        function getNamespace(namespace) {
            return namespace !== null ?
                (namespace === "*" ? "*" : escapeName(namespace)) + "|" :
                "";
        }

        function escapeName(str) {
            return str
                .split("")
                .map(function(c) { return (charsToEscape.has(c) ? "\\" + c : c); })
                .join("");
        }

    }, {}],
    20: [function(require, module, exports) {
        // Generated by CoffeeScript 1.12.7
        var domToMarkup, object, objectToSaneObject, saneObjectToDom, self;

        objectToSaneObject = require('./objectToSaneObject');

        saneObjectToDom = require('./saneObjectToDom');

        domToMarkup = require('./domToMarkup');

        object = require('utila').object;

        module.exports = self = {
            objectToDom: function(o) {
                o = self._object2SaneObject(o);
                return saneObjectToDom.convert(o);
            },
            object2markup: function(o) {
                var dom;
                dom = self.objectToDom(o);
                return domToMarkup.convert(dom);
            },
            domToMarkup: function(dom) {
                return domToMarkup.convert(dom);
            },
            _object2SaneObject: function(o) {
                if (!Array.isArray(o)) {
                    if (!object.isBareObject(o)) {
                        throw Error("toDom() only accepts arrays and bare objects as input");
                    }
                }
                return objectToSaneObject.sanitize(o);
            }
        };

    }, { "./domToMarkup": 21, "./objectToSaneObject": 22, "./saneObjectToDom": 23, "utila": 237 }],
    21: [function(require, module, exports) {
        // Generated by CoffeeScript 1.12.7


    }, {}],
    22: [function(require, module, exports) {
        // Generated by CoffeeScript 1.12.7
        var object, self,
            hasProp = {}.hasOwnProperty;

        object = require('utila').object;

        module.exports = self = {
            sanitize: function(val) {
                return self._toChildren(val);
            },
            _toChildren: function(val) {
                var ref;
                if (object.isBareObject(val)) {
                    return self._objectToChildren(val);
                } else if (Array.isArray(val)) {
                    return self._arrayToChildren(val);
                } else if (val === null || typeof val === 'undefined') {
                    return [];
                } else if ((ref = typeof val) === 'string' || ref === 'number') {
                    return [String(val)];
                } else {
                    throw Error("not a valid child node: `" + val);
                }
            },
            _objectToChildren: function(o) {
                var a, cur, key, val;
                a = [];
                for (key in o) {
                    if (!hasProp.call(o, key)) continue;
                    val = o[key];
                    cur = {};
                    cur[key] = self.sanitize(val);
                    a.push(cur);
                }
                return a;
            },
            _arrayToChildren: function(a) {
                var i, len, ret, v;
                ret = [];
                for (i = 0, len = a.length; i < len; i++) {
                    v = a[i];
                    ret.push(self._toNode(v));
                }
                return ret;
            },
            _toNode: function(o) {
                var key, keys, obj, ref;
                if ((ref = typeof o) === 'string' || ref === 'number') {
                    return String(o);
                } else if (object.isBareObject(o)) {
                    keys = Object.keys(o);
                    if (keys.length !== 1) {
                        throw Error("a node must only have one key as tag name");
                    }
                    key = keys[0];
                    obj = {};
                    obj[key] = self._toChildren(o[key]);
                    return obj;
                } else {
                    throw Error("not a valid node: `" + o + "`");
                }
            }
        };

    }, { "utila": 237 }],
    23: [function(require, module, exports) {
        // Generated by CoffeeScript 1.12.7
        var self,
            hasProp = {}.hasOwnProperty;

        module.exports = self = {
            convert: function(obj) {
                return self._arrayToChildren(obj);
            },
            _arrayToChildren: function(a, parent) {
                var children, j, len, node, prev, v;
                if (parent == null) {
                    parent = null;
                }
                children = [];
                prev = null;
                for (j = 0, len = a.length; j < len; j++) {
                    v = a[j];
                    if (typeof v === 'string') {
                        node = self._getTextNodeFor(v);
                    } else {
                        node = self._objectToNode(v, parent);
                        node.prev = null;
                        node.next = null;
                        node.parent = parent;
                        if (prev != null) {
                            node.prev = prev;
                            prev.next = node;
                        }
                        prev = node;
                    }
                    children.push(node);
                }
                return children;
            },
            _objectToNode: function(o) {
                var attribs, children, i, k, key, name, node, ref, v, val;
                i = 0;
                for (k in o) {
                    if (!hasProp.call(o, k)) continue;
                    v = o[k];
                    if (i > 0) {
                        throw Error("_objectToNode() only accepts an object with one key/value");
                    }
                    key = k;
                    val = v;
                    i++;
                }
                node = {};
                if (typeof key !== 'string') {
                    throw Error("_objectToNode()'s key must be a string of tag name and classes");
                }
                if (typeof val === 'string') {
                    children = [self._getTextNodeFor(val)];
                } else if (Array.isArray(val)) {
                    children = self._arrayToChildren(val, node);
                } else {
                    inspect(o);
                    throw Error("_objectToNode()'s key's value must only be a string or an array");
                }
                node.type = 'tag';
                ref = self._parseTag(key), name = ref.name, attribs = ref.attribs;
                node.name = name;
                node.attribs = attribs;
                node.children = children;
                return node;
            },
            _getTextNodeFor: function(s) {
                return {
                    type: 'text',
                    data: s
                };
            },
            _nameRx: /^[a-zA-Z\-\_]{1}[a-zA-Z0-9\-\_]*$/,
            _parseTag: function(k) {
                var attribs, classes, cls, id, m, name, parts;
                if (!k.match(/^[a-zA-Z0-9\#\-\_\.\[\]\"\'\=\,\s]+$/) || k.match(/^[0-9]+/)) {
                    throw Error("cannot parse tag `" + k + "`");
                }
                attribs = {};
                parts = {
                    name: '',
                    attribs: attribs
                };
                if (m = k.match(/^([^\.#]+)/)) {
                    name = m[1];
                    if (!name.match(self._nameRx)) {
                        throw Error("tag name `" + name + "` is not valid");
                    }
                    parts.name = name;
                    k = k.substr(name.length, k.length);
                }
                if (m = k.match(/^#([a-zA-Z0-9\-]+)/)) {
                    id = m[1];
                    if (!id.match(self._nameRx)) {
                        throw Error("tag id `" + id + "` is not valid");
                    }
                    attribs.id = id;
                    k = k.substr(id.length + 1, k.length);
                }
                classes = [];
                while (m = k.match(/\.([a-zA-Z0-9\-\_]+)/)) {
                    cls = m[1];
                    if (!cls.match(self._nameRx)) {
                        throw Error("tag class `" + cls + "` is not valid");
                    }
                    classes.push(cls);
                    k = k.replace('.' + cls, '');
                }
                if (classes.length) {
                    attribs["class"] = classes.join(" ");
                }
                return parts;
            }
        };

    }, {}],
    24: [function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.attributeNames = exports.elementNames = void 0;
        exports.elementNames = new Map([
            ["altglyph", "altGlyph"],
            ["altglyphdef", "altGlyphDef"],
            ["altglyphitem", "altGlyphItem"],
            ["animatecolor", "animateColor"],
            ["animatemotion", "animateMotion"],
            ["animatetransform", "animateTransform"],
            ["clippath", "clipPath"],
            ["feblend", "feBlend"],
            ["fecolormatrix", "feColorMatrix"],
            ["fecomponenttransfer", "feComponentTransfer"],
            ["fecomposite", "feComposite"],
            ["feconvolvematrix", "feConvolveMatrix"],
            ["fediffuselighting", "feDiffuseLighting"],
            ["fedisplacementmap", "feDisplacementMap"],
            ["fedistantlight", "feDistantLight"],
            ["fedropshadow", "feDropShadow"],
            ["feflood", "feFlood"],
            ["fefunca", "feFuncA"],
            ["fefuncb", "feFuncB"],
            ["fefuncg", "feFuncG"],
            ["fefuncr", "feFuncR"],
            ["fegaussianblur", "feGaussianBlur"],
            ["feimage", "feImage"],
            ["femerge", "feMerge"],
            ["femergenode", "feMergeNode"],
            ["femorphology", "feMorphology"],
            ["feoffset", "feOffset"],
            ["fepointlight", "fePointLight"],
            ["fespecularlighting", "feSpecularLighting"],
            ["fespotlight", "feSpotLight"],
            ["fetile", "feTile"],
            ["feturbulence", "feTurbulence"],
            ["foreignobject", "foreignObject"],
            ["glyphref", "glyphRef"],
            ["lineargradient", "linearGradient"],
            ["radialgradient", "radialGradient"],
            ["textpath", "textPath"],
        ]);
        exports.attributeNames = new Map([
            ["definitionurl", "definitionURL"],
            ["attributename", "attributeName"],
            ["attributetype", "attributeType"],
            ["basefrequency", "baseFrequency"],
            ["baseprofile", "baseProfile"],
            ["calcmode", "calcMode"],
            ["clippathunits", "clipPathUnits"],
            ["diffuseconstant", "diffuseConstant"],
            ["edgemode", "edgeMode"],
            ["filterunits", "filterUnits"],
            ["glyphref", "glyphRef"],
            ["gradienttransform", "gradientTransform"],
            ["gradientunits", "gradientUnits"],
            ["kernelmatrix", "kernelMatrix"],
            ["kernelunitlength", "kernelUnitLength"],
            ["keypoints", "keyPoints"],
            ["keysplines", "keySplines"],
            ["keytimes", "keyTimes"],
            ["lengthadjust", "lengthAdjust"],
            ["limitingconeangle", "limitingConeAngle"],
            ["markerheight", "markerHeight"],
            ["markerunits", "markerUnits"],
            ["markerwidth", "markerWidth"],
            ["maskcontentunits", "maskContentUnits"],
            ["maskunits", "maskUnits"],
            ["numoctaves", "numOctaves"],
            ["pathlength", "pathLength"],
            ["patterncontentunits", "patternContentUnits"],
            ["patterntransform", "patternTransform"],
            ["patternunits", "patternUnits"],
            ["pointsatx", "pointsAtX"],
            ["pointsaty", "pointsAtY"],
            ["pointsatz", "pointsAtZ"],
            ["preservealpha", "preserveAlpha"],
            ["preserveaspectratio", "preserveAspectRatio"],
            ["primitiveunits", "primitiveUnits"],
            ["refx", "refX"],
            ["refy", "refY"],
            ["repeatcount", "repeatCount"],
            ["repeatdur", "repeatDur"],
            ["requiredextensions", "requiredExtensions"],
            ["requiredfeatures", "requiredFeatures"],
            ["specularconstant", "specularConstant"],
            ["specularexponent", "specularExponent"],
            ["spreadmethod", "spreadMethod"],
            ["startoffset", "startOffset"],
            ["stddeviation", "stdDeviation"],
            ["stitchtiles", "stitchTiles"],
            ["surfacescale", "surfaceScale"],
            ["systemlanguage", "systemLanguage"],
            ["tablevalues", "tableValues"],
            ["targetx", "targetX"],
            ["targety", "targetY"],
            ["textlength", "textLength"],
            ["viewbox", "viewBox"],
            ["viewtarget", "viewTarget"],
            ["xchannelselector", "xChannelSelector"],
            ["ychannelselector", "yChannelSelector"],
            ["zoomandpan", "zoomAndPan"],
        ]);

    }, {}],
    25: [function(require, module, exports) {
        "use strict";
        var __assign = (this && this.__assign) || function() {
            __assign = Object.assign || function(t) {
                for (var s, i = 1, n = arguments.length; i < n; i++) {
                    s = arguments[i];
                    for (var p in s)
                        if (Object.prototype.hasOwnProperty.call(s, p))
                            t[p] = s[p];
                }
                return t;
            };
            return __assign.apply(this, arguments);
        };
        var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
            if (k2 === undefined) k2 = k;
            Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
        }) : (function(o, m, k, k2) {
            if (k2 === undefined) k2 = k;
            o[k2] = m[k];
        }));
        var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
            Object.defineProperty(o, "default", { enumerable: true, value: v });
        }) : function(o, v) {
            o["default"] = v;
        });
        var __importStar = (this && this.__importStar) || function(mod) {
            if (mod && mod.__esModule) return mod;
            var result = {};
            if (mod != null)
                for (var k in mod)
                    if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
            __setModuleDefault(result, mod);
            return result;
        };
        Object.defineProperty(exports, "__esModule", { value: true });
        /*
         * Module dependencies
         */
        var ElementType = __importStar(require("domelementtype"));
        var entities_1 = require("entities");
        /**
         * Mixed-case SVG and MathML tags & attributes
         * recognized by the HTML parser.
         *
         * @see https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inforeign
         */
        var foreignNames_1 = require("./foreignNames");
        var unencodedElements = new Set([
            "style",
            "script",
            "xmp",
            "iframe",
            "noembed",
            "noframes",
            "plaintext",
            "noscript",
        ]);
        /**
         * Format attributes
         */
        function formatAttributes(attributes, opts) {
            if (!attributes)
                return;
            return Object.keys(attributes)
                .map(function(key) {
                    var _a, _b;
                    var value = (_a = attributes[key]) !== null && _a !== void 0 ? _a : "";
                    if (opts.xmlMode === "foreign") {
                        /* Fix up mixed-case attribute names */
                        key = (_b = foreignNames_1.attributeNames.get(key)) !== null && _b !== void 0 ? _b : key;
                    }
                    if (!opts.emptyAttrs && !opts.xmlMode && value === "") {
                        return key;
                    }
                    return key + "=\"" + (opts.decodeEntities !== false ?
                        entities_1.encodeXML(value) :
                        value.replace(/"/g, "&quot;")) + "\"";
                })
                .join(" ");
        }
        /**
         * Self-enclosing tags
         */
        var singleTag = new Set([
            "area",
            "base",
            "basefont",
            "br",
            "col",
            "command",
            "embed",
            "frame",
            "hr",
            "img",
            "input",
            "isindex",
            "keygen",
            "link",
            "meta",
            "param",
            "source",
            "track",
            "wbr",
        ]);
        /**
         * Renders a DOM node or an array of DOM nodes to a string.
         *
         * Can be thought of as the equivalent of the `outerHTML` of the passed node(s).
         *
         * @param node Node to be rendered.
         * @param options Changes serialization behavior
         */
        function render(node, options) {
            if (options === void 0) { options = {}; }
            var nodes = "length" in node ? node : [node];
            var output = "";
            for (var i = 0; i < nodes.length; i++) {
                output += renderNode(nodes[i], options);
            }
            return output;
        }
        exports.default = render;

        function renderNode(node, options) {
            switch (node.type) {
                case ElementType.Root:
                    return render(node.children, options);
                case ElementType.Directive:
                case ElementType.Doctype:
                    return renderDirective(node);
                case ElementType.Comment:
                    return renderComment(node);
                case ElementType.CDATA:
                    return renderCdata(node);
                case ElementType.Script:
                case ElementType.Style:
                case ElementType.Tag:
                    return renderTag(node, options);
                case ElementType.Text:
                    return renderText(node, options);
            }
        }
        var foreignModeIntegrationPoints = new Set([
            "mi",
            "mo",
            "mn",
            "ms",
            "mtext",
            "annotation-xml",
            "foreignObject",
            "desc",
            "title",
        ]);
        var foreignElements = new Set(["svg", "math"]);

        function renderTag(elem, opts) {
            var _a;
            // Handle SVG / MathML in HTML
            if (opts.xmlMode === "foreign") {
                /* Fix up mixed-case element names */
                elem.name = (_a = foreignNames_1.elementNames.get(elem.name)) !== null && _a !== void 0 ? _a : elem.name;
                /* Exit foreign mode at integration points */
                if (elem.parent &&
                    foreignModeIntegrationPoints.has(elem.parent.name)) {
                    opts = __assign(__assign({}, opts), { xmlMode: false });
                }
            }
            if (!opts.xmlMode && foreignElements.has(elem.name)) {
                opts = __assign(__assign({}, opts), { xmlMode: "foreign" });
            }
            var tag = "<" + elem.name;
            var attribs = formatAttributes(elem.attribs, opts);
            if (attribs) {
                tag += " " + attribs;
            }
            if (elem.children.length === 0 &&
                (opts.xmlMode ? // In XML mode or foreign mode, and user hasn't explicitly turned off self-closing tags
                    opts.selfClosingTags !== false : // User explicitly asked for self-closing tags, even in HTML mode
                    opts.selfClosingTags && singleTag.has(elem.name))) {
                if (!opts.xmlMode)
                    tag += " ";
                tag += "/>";
            } else {
                tag += ">";
                if (elem.children.length > 0) {
                    tag += render(elem.children, opts);
                }
                if (opts.xmlMode || !singleTag.has(elem.name)) {
                    tag += "</" + elem.name + ">";
                }
            }
            return tag;
        }

        function renderDirective(elem) {
            return "<" + elem.data + ">";
        }

        function renderText(elem, opts) {
            var data = elem.data || "";
            // If entities weren't decoded, no need to encode them back
            if (opts.decodeEntities !== false &&
                !(!opts.xmlMode &&
                    elem.parent &&
                    unencodedElements.has(elem.parent.name))) {
                data = entities_1.encodeXML(data);
            }
            return data;
        }

        function renderCdata(elem) {
            return "<![CDATA[" + elem.children[0].data + "]]>";
        }

        function renderComment(elem) {
            return "<!--" + elem.data + "-->";
        }

    }, { "./foreignNames": 24, "domelementtype": 26, "entities": 40 }],
    26: [function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.Doctype = exports.CDATA = exports.Tag = exports.Style = exports.Script = exports.Comment = exports.Directive = exports.Text = exports.Root = exports.isTag = exports.ElementType = void 0;
        /** Types of elements found in htmlparser2's DOM */
        var ElementType;
        (function(ElementType) {
            /** Type for the root element of a document */
            ElementType["Root"] = "root";
            /** Type for Text */
            ElementType["Text"] = "text";
            /** Type for <? ... ?> */
            ElementType["Directive"] = "directive";
            /** Type for <!-- ... --> */
            ElementType["Comment"] = "comment";
            /** Type for <script> tags */
            ElementType["Script"] = "script";
            /** Type for <style> tags */
            ElementType["Style"] = "style";
            /** Type for Any tag */
            ElementType["Tag"] = "tag";
            /** Type for <![CDATA[ ... ]]> */
            ElementType["CDATA"] = "cdata";
            /** Type for <!doctype ...> */
            ElementType["Doctype"] = "doctype";
        })(ElementType = exports.ElementType || (exports.ElementType = {}));
        /**
         * Tests whether an element is a tag or not.
         *
         * @param elem Element to test
         */
        function isTag(elem) {
            return (elem.type === ElementType.Tag ||
                elem.type === ElementType.Script ||
                elem.type === ElementType.Style);
        }
        exports.isTag = isTag;
        // Exports for backwards compatibility
        /** Type for the root element of a document */
        exports.Root = ElementType.Root;
        /** Type for Text */
        exports.Text = ElementType.Text;
        /** Type for <? ... ?> */
        exports.Directive = ElementType.Directive;
        /** Type for <!-- ... --> */
        exports.Comment = ElementType.Comment;
        /** Type for <script> tags */
        exports.Script = ElementType.Script;
        /** Type for <style> tags */
        exports.Style = ElementType.Style;
        /** Type for Any tag */
        exports.Tag = ElementType.Tag;
        /** Type for <![CDATA[ ... ]]> */
        exports.CDATA = ElementType.CDATA;
        /** Type for <!doctype ...> */
        exports.Doctype = ElementType.Doctype;

    }, {}],
    27: [function(require, module, exports) {
        "use strict";
        var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
            if (k2 === undefined) k2 = k;
            Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
        }) : (function(o, m, k, k2) {
            if (k2 === undefined) k2 = k;
            o[k2] = m[k];
        }));
        var __exportStar = (this && this.__exportStar) || function(m, exports) {
            for (var p in m)
                if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
        };
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.DomHandler = void 0;
        var domelementtype_1 = require("domelementtype");
        var node_1 = require("./node");
        __exportStar(require("./node"), exports);
        var reWhitespace = /\s+/g;
        // Default options
        var defaultOpts = {
            normalizeWhitespace: false,
            withStartIndices: false,
            withEndIndices: false,
            xmlMode: false,
        };
        var DomHandler = /** @class */ (function() {
            /**
             * @param callback Called once parsing has completed.
             * @param options Settings for the handler.
             * @param elementCB Callback whenever a tag is closed.
             */
            function DomHandler(callback, options, elementCB) {
                /** The elements of the DOM */
                this.dom = [];
                /** The root element for the DOM */
                this.root = new node_1.Document(this.dom);
                /** Indicated whether parsing has been completed. */
                this.done = false;
                /** Stack of open tags. */
                this.tagStack = [this.root];
                /** A data node that is still being written to. */
                this.lastNode = null;
                /** Reference to the parser instance. Used for location information. */
                this.parser = null;
                // Make it possible to skip arguments, for backwards-compatibility
                if (typeof options === "function") {
                    elementCB = options;
                    options = defaultOpts;
                }
                if (typeof callback === "object") {
                    options = callback;
                    callback = undefined;
                }
                this.callback = callback !== null && callback !== void 0 ? callback : null;
                this.options = options !== null && options !== void 0 ? options : defaultOpts;
                this.elementCB = elementCB !== null && elementCB !== void 0 ? elementCB : null;
            }
            DomHandler.prototype.onparserinit = function(parser) {
                this.parser = parser;
            };
            // Resets the handler back to starting state
            DomHandler.prototype.onreset = function() {
                this.dom = [];
                this.root = new node_1.Document(this.dom);
                this.done = false;
                this.tagStack = [this.root];
                this.lastNode = null;
                this.parser = null;
            };
            // Signals the handler that parsing is done
            DomHandler.prototype.onend = function() {
                if (this.done)
                    return;
                this.done = true;
                this.parser = null;
                this.handleCallback(null);
            };
            DomHandler.prototype.onerror = function(error) {
                this.handleCallback(error);
            };
            DomHandler.prototype.onclosetag = function() {
                this.lastNode = null;
                var elem = this.tagStack.pop();
                if (this.options.withEndIndices) {
                    elem.endIndex = this.parser.endIndex;
                }
                if (this.elementCB)
                    this.elementCB(elem);
            };
            DomHandler.prototype.onopentag = function(name, attribs) {
                var type = this.options.xmlMode ? domelementtype_1.ElementType.Tag : undefined;
                var element = new node_1.Element(name, attribs, undefined, type);
                this.addNode(element);
                this.tagStack.push(element);
            };
            DomHandler.prototype.ontext = function(data) {
                var normalizeWhitespace = this.options.normalizeWhitespace;
                var lastNode = this.lastNode;
                if (lastNode && lastNode.type === domelementtype_1.ElementType.Text) {
                    if (normalizeWhitespace) {
                        lastNode.data = (lastNode.data + data).replace(reWhitespace, " ");
                    } else {
                        lastNode.data += data;
                    }
                    if (this.options.withEndIndices) {
                        lastNode.endIndex = this.parser.endIndex;
                    }
                } else {
                    if (normalizeWhitespace) {
                        data = data.replace(reWhitespace, " ");
                    }
                    var node = new node_1.Text(data);
                    this.addNode(node);
                    this.lastNode = node;
                }
            };
            DomHandler.prototype.oncomment = function(data) {
                if (this.lastNode && this.lastNode.type === domelementtype_1.ElementType.Comment) {
                    this.lastNode.data += data;
                    return;
                }
                var node = new node_1.Comment(data);
                this.addNode(node);
                this.lastNode = node;
            };
            DomHandler.prototype.oncommentend = function() {
                this.lastNode = null;
            };
            DomHandler.prototype.oncdatastart = function() {
                var text = new node_1.Text("");
                var node = new node_1.NodeWithChildren(domelementtype_1.ElementType.CDATA, [text]);
                this.addNode(node);
                text.parent = node;
                this.lastNode = text;
            };
            DomHandler.prototype.oncdataend = function() {
                this.lastNode = null;
            };
            DomHandler.prototype.onprocessinginstruction = function(name, data) {
                var node = new node_1.ProcessingInstruction(name, data);
                this.addNode(node);
            };
            DomHandler.prototype.handleCallback = function(error) {
                if (typeof this.callback === "function") {
                    this.callback(error, this.dom);
                } else if (error) {
                    throw error;
                }
            };
            DomHandler.prototype.addNode = function(node) {
                var parent = this.tagStack[this.tagStack.length - 1];
                var previousSibling = parent.children[parent.children.length - 1];
                if (this.options.withStartIndices) {
                    node.startIndex = this.parser.startIndex;
                }
                if (this.options.withEndIndices) {
                    node.endIndex = this.parser.endIndex;
                }
                parent.children.push(node);
                if (previousSibling) {
                    node.prev = previousSibling;
                    previousSibling.next = node;
                }
                node.parent = parent;
                this.lastNode = null;
            };
            return DomHandler;
        }());
        exports.DomHandler = DomHandler;
        exports.default = DomHandler;

    }, { "./node": 28, "domelementtype": 26 }],
    28: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || (function() {
            var extendStatics = function(d, b) {
                extendStatics = Object.setPrototypeOf ||
                    ({ __proto__: [] }
                        instanceof Array && function(d, b) { d.__proto__ = b; }) ||
                    function(d, b) {
                        for (var p in b)
                            if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
                    };
                return extendStatics(d, b);
            };
            return function(d, b) {
                if (typeof b !== "function" && b !== null)
                    throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
                extendStatics(d, b);

                function __() { this.constructor = d; }
                d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
            };
        })();
        var __assign = (this && this.__assign) || function() {
            __assign = Object.assign || function(t) {
                for (var s, i = 1, n = arguments.length; i < n; i++) {
                    s = arguments[i];
                    for (var p in s)
                        if (Object.prototype.hasOwnProperty.call(s, p))
                            t[p] = s[p];
                }
                return t;
            };
            return __assign.apply(this, arguments);
        };
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.cloneNode = exports.hasChildren = exports.isDocument = exports.isDirective = exports.isComment = exports.isText = exports.isCDATA = exports.isTag = exports.Element = exports.Document = exports.NodeWithChildren = exports.ProcessingInstruction = exports.Comment = exports.Text = exports.DataNode = exports.Node = void 0;
        var domelementtype_1 = require("domelementtype");
        var nodeTypes = new Map([
            [domelementtype_1.ElementType.Tag, 1],
            [domelementtype_1.ElementType.Script, 1],
            [domelementtype_1.ElementType.Style, 1],
            [domelementtype_1.ElementType.Directive, 1],
            [domelementtype_1.ElementType.Text, 3],
            [domelementtype_1.ElementType.CDATA, 4],
            [domelementtype_1.ElementType.Comment, 8],
            [domelementtype_1.ElementType.Root, 9],
        ]);
        /**
         * This object will be used as the prototype for Nodes when creating a
         * DOM-Level-1-compliant structure.
         */
        var Node = /** @class */ (function() {
            /**
             *
             * @param type The type of the node.
             */
            function Node(type) {
                this.type = type;
                /** Parent of the node */
                this.parent = null;
                /** Previous sibling */
                this.prev = null;
                /** Next sibling */
                this.next = null;
                /** The start index of the node. Requires `withStartIndices` on the handler to be `true. */
                this.startIndex = null;
                /** The end index of the node. Requires `withEndIndices` on the handler to be `true. */
                this.endIndex = null;
            }
            Object.defineProperty(Node.prototype, "nodeType", {
                // Read-only aliases
                /**
                 * [DOM spec](https://dom.spec.whatwg.org/#dom-node-nodetype)-compatible
                 * node {@link type}.
                 */
                get: function() {
                    var _a;
                    return (_a = nodeTypes.get(this.type)) !== null && _a !== void 0 ? _a : 1;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(Node.prototype, "parentNode", {
                // Read-write aliases for properties
                /**
                 * Same as {@link parent}.
                 * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
                 */
                get: function() {
                    return this.parent;
                },
                set: function(parent) {
                    this.parent = parent;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(Node.prototype, "previousSibling", {
                /**
                 * Same as {@link prev}.
                 * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
                 */
                get: function() {
                    return this.prev;
                },
                set: function(prev) {
                    this.prev = prev;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(Node.prototype, "nextSibling", {
                /**
                 * Same as {@link next}.
                 * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
                 */
                get: function() {
                    return this.next;
                },
                set: function(next) {
                    this.next = next;
                },
                enumerable: false,
                configurable: true
            });
            /**
             * Clone this node, and optionally its children.
             *
             * @param recursive Clone child nodes as well.
             * @returns A clone of the node.
             */
            Node.prototype.cloneNode = function(recursive) {
                if (recursive === void 0) { recursive = false; }
                return cloneNode(this, recursive);
            };
            return Node;
        }());
        exports.Node = Node;
        /**
         * A node that contains some data.
         */
        var DataNode = /** @class */ (function(_super) {
            __extends(DataNode, _super);
            /**
             * @param type The type of the node
             * @param data The content of the data node
             */
            function DataNode(type, data) {
                var _this = _super.call(this, type) || this;
                _this.data = data;
                return _this;
            }
            Object.defineProperty(DataNode.prototype, "nodeValue", {
                /**
                 * Same as {@link data}.
                 * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
                 */
                get: function() {
                    return this.data;
                },
                set: function(data) {
                    this.data = data;
                },
                enumerable: false,
                configurable: true
            });
            return DataNode;
        }(Node));
        exports.DataNode = DataNode;
        /**
         * Text within the document.
         */
        var Text = /** @class */ (function(_super) {
            __extends(Text, _super);

            function Text(data) {
                return _super.call(this, domelementtype_1.ElementType.Text, data) || this;
            }
            return Text;
        }(DataNode));
        exports.Text = Text;
        /**
         * Comments within the document.
         */
        var Comment = /** @class */ (function(_super) {
            __extends(Comment, _super);

            function Comment(data) {
                return _super.call(this, domelementtype_1.ElementType.Comment, data) || this;
            }
            return Comment;
        }(DataNode));
        exports.Comment = Comment;
        /**
         * Processing instructions, including doc types.
         */
        var ProcessingInstruction = /** @class */ (function(_super) {
            __extends(ProcessingInstruction, _super);

            function ProcessingInstruction(name, data) {
                var _this = _super.call(this, domelementtype_1.ElementType.Directive, data) || this;
                _this.name = name;
                return _this;
            }
            return ProcessingInstruction;
        }(DataNode));
        exports.ProcessingInstruction = ProcessingInstruction;
        /**
         * A `Node` that can have children.
         */
        var NodeWithChildren = /** @class */ (function(_super) {
            __extends(NodeWithChildren, _super);
            /**
             * @param type Type of the node.
             * @param children Children of the node. Only certain node types can have children.
             */
            function NodeWithChildren(type, children) {
                var _this = _super.call(this, type) || this;
                _this.children = children;
                return _this;
            }
            Object.defineProperty(NodeWithChildren.prototype, "firstChild", {
                // Aliases
                /** First child of the node. */
                get: function() {
                    var _a;
                    return (_a = this.children[0]) !== null && _a !== void 0 ? _a : null;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(NodeWithChildren.prototype, "lastChild", {
                /** Last child of the node. */
                get: function() {
                    return this.children.length > 0 ?
                        this.children[this.children.length - 1] :
                        null;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(NodeWithChildren.prototype, "childNodes", {
                /**
                 * Same as {@link children}.
                 * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
                 */
                get: function() {
                    return this.children;
                },
                set: function(children) {
                    this.children = children;
                },
                enumerable: false,
                configurable: true
            });
            return NodeWithChildren;
        }(Node));
        exports.NodeWithChildren = NodeWithChildren;
        /**
         * The root node of the document.
         */
        var Document = /** @class */ (function(_super) {
            __extends(Document, _super);

            function Document(children) {
                return _super.call(this, domelementtype_1.ElementType.Root, children) || this;
            }
            return Document;
        }(NodeWithChildren));
        exports.Document = Document;
        /**
         * An element within the DOM.
         */
        var Element = /** @class */ (function(_super) {
            __extends(Element, _super);
            /**
             * @param name Name of the tag, eg. `div`, `span`.
             * @param attribs Object mapping attribute names to attribute values.
             * @param children Children of the node.
             */
            function Element(name, attribs, children, type) {
                if (children === void 0) { children = []; }
                if (type === void 0) {
                    type = name === "script" ?
                        domelementtype_1.ElementType.Script :
                        name === "style" ?
                        domelementtype_1.ElementType.Style :
                        domelementtype_1.ElementType.Tag;
                }
                var _this = _super.call(this, type, children) || this;
                _this.name = name;
                _this.attribs = attribs;
                return _this;
            }
            Object.defineProperty(Element.prototype, "tagName", {
                // DOM Level 1 aliases
                /**
                 * Same as {@link name}.
                 * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
                 */
                get: function() {
                    return this.name;
                },
                set: function(name) {
                    this.name = name;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(Element.prototype, "attributes", {
                get: function() {
                    var _this = this;
                    return Object.keys(this.attribs).map(function(name) {
                        var _a, _b;
                        return ({
                            name: name,
                            value: _this.attribs[name],
                            namespace: (_a = _this["x-attribsNamespace"]) === null || _a === void 0 ? void 0 : _a[name],
                            prefix: (_b = _this["x-attribsPrefix"]) === null || _b === void 0 ? void 0 : _b[name],
                        });
                    });
                },
                enumerable: false,
                configurable: true
            });
            return Element;
        }(NodeWithChildren));
        exports.Element = Element;
        /**
         * @param node Node to check.
         * @returns `true` if the node is a `Element`, `false` otherwise.
         */
        function isTag(node) {
            return (0, domelementtype_1.isTag)(node);
        }
        exports.isTag = isTag;
        /**
         * @param node Node to check.
         * @returns `true` if the node has the type `CDATA`, `false` otherwise.
         */
        function isCDATA(node) {
            return node.type === domelementtype_1.ElementType.CDATA;
        }
        exports.isCDATA = isCDATA;
        /**
         * @param node Node to check.
         * @returns `true` if the node has the type `Text`, `false` otherwise.
         */
        function isText(node) {
            return node.type === domelementtype_1.ElementType.Text;
        }
        exports.isText = isText;
        /**
         * @param node Node to check.
         * @returns `true` if the node has the type `Comment`, `false` otherwise.
         */
        function isComment(node) {
            return node.type === domelementtype_1.ElementType.Comment;
        }
        exports.isComment = isComment;
        /**
         * @param node Node to check.
         * @returns `true` if the node has the type `ProcessingInstruction`, `false` otherwise.
         */
        function isDirective(node) {
            return node.type === domelementtype_1.ElementType.Directive;
        }
        exports.isDirective = isDirective;
        /**
         * @param node Node to check.
         * @returns `true` if the node has the type `ProcessingInstruction`, `false` otherwise.
         */
        function isDocument(node) {
            return node.type === domelementtype_1.ElementType.Root;
        }
        exports.isDocument = isDocument;
        /**
         * @param node Node to check.
         * @returns `true` if the node is a `NodeWithChildren` (has children), `false` otherwise.
         */
        function hasChildren(node) {
            return Object.prototype.hasOwnProperty.call(node, "children");
        }
        exports.hasChildren = hasChildren;
        /**
         * Clone a node, and optionally its children.
         *
         * @param recursive Clone child nodes as well.
         * @returns A clone of the node.
         */
        function cloneNode(node, recursive) {
            if (recursive === void 0) { recursive = false; }
            var result;
            if (isText(node)) {
                result = new Text(node.data);
            } else if (isComment(node)) {
                result = new Comment(node.data);
            } else if (isTag(node)) {
                var children = recursive ? cloneChildren(node.children) : [];
                var clone_1 = new Element(node.name, __assign({}, node.attribs), children);
                children.forEach(function(child) { return (child.parent = clone_1); });
                if (node.namespace != null) {
                    clone_1.namespace = node.namespace;
                }
                if (node["x-attribsNamespace"]) {
                    clone_1["x-attribsNamespace"] = __assign({}, node["x-attribsNamespace"]);
                }
                if (node["x-attribsPrefix"]) {
                    clone_1["x-attribsPrefix"] = __assign({}, node["x-attribsPrefix"]);
                }
                result = clone_1;
            } else if (isCDATA(node)) {
                var children = recursive ? cloneChildren(node.children) : [];
                var clone_2 = new NodeWithChildren(domelementtype_1.ElementType.CDATA, children);
                children.forEach(function(child) { return (child.parent = clone_2); });
                result = clone_2;
            } else if (isDocument(node)) {
                var children = recursive ? cloneChildren(node.children) : [];
                var clone_3 = new Document(children);
                children.forEach(function(child) { return (child.parent = clone_3); });
                if (node["x-mode"]) {
                    clone_3["x-mode"] = node["x-mode"];
                }
                result = clone_3;
            } else if (isDirective(node)) {
                var instruction = new ProcessingInstruction(node.name, node.data);
                if (node["x-name"] != null) {
                    instruction["x-name"] = node["x-name"];
                    instruction["x-publicId"] = node["x-publicId"];
                    instruction["x-systemId"] = node["x-systemId"];
                }
                result = instruction;
            } else {
                throw new Error("Not implemented yet: ".concat(node.type));
            }
            result.startIndex = node.startIndex;
            result.endIndex = node.endIndex;
            if (node.sourceCodeLocation != null) {
                result.sourceCodeLocation = node.sourceCodeLocation;
            }
            return result;
        }
        exports.cloneNode = cloneNode;

        function cloneChildren(childs) {
            var children = childs.map(function(child) { return cloneNode(child, true); });
            for (var i = 1; i < children.length; i++) {
                children[i].prev = children[i - 1];
                children[i - 1].next = children[i];
            }
            return children;
        }

    }, { "domelementtype": 26 }],
    29: [function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.getFeed = void 0;
        var stringify_1 = require("./stringify");
        var legacy_1 = require("./legacy");
        /**
         * Get the feed object from the root of a DOM tree.
         *
         * @param doc - The DOM to to extract the feed from.
         * @returns The feed.
         */
        function getFeed(doc) {
            var feedRoot = getOneElement(isValidFeed, doc);
            return !feedRoot ?
                null :
                feedRoot.name === "feed" ?
                getAtomFeed(feedRoot) :
                getRssFeed(feedRoot);
        }
        exports.getFeed = getFeed;
        /**
         * Parse an Atom feed.
         *
         * @param feedRoot The root of the feed.
         * @returns The parsed feed.
         */
        function getAtomFeed(feedRoot) {
            var _a;
            var childs = feedRoot.children;
            var feed = {
                type: "atom",
                items: (0, legacy_1.getElementsByTagName)("entry", childs).map(function(item) {
                    var _a;
                    var children = item.children;
                    var entry = { media: getMediaElements(children) };
                    addConditionally(entry, "id", "id", children);
                    addConditionally(entry, "title", "title", children);
                    var href = (_a = getOneElement("link", children)) === null || _a === void 0 ? void 0 : _a.attribs.href;
                    if (href) {
                        entry.link = href;
                    }
                    var description = fetch("summary", children) || fetch("content", children);
                    if (description) {
                        entry.description = description;
                    }
                    var pubDate = fetch("updated", children);
                    if (pubDate) {
                        entry.pubDate = new Date(pubDate);
                    }
                    return entry;
                }),
            };
            addConditionally(feed, "id", "id", childs);
            addConditionally(feed, "title", "title", childs);
            var href = (_a = getOneElement("link", childs)) === null || _a === void 0 ? void 0 : _a.attribs.href;
            if (href) {
                feed.link = href;
            }
            addConditionally(feed, "description", "subtitle", childs);
            var updated = fetch("updated", childs);
            if (updated) {
                feed.updated = new Date(updated);
            }
            addConditionally(feed, "author", "email", childs, true);
            return feed;
        }
        /**
         * Parse a RSS feed.
         *
         * @param feedRoot The root of the feed.
         * @returns The parsed feed.
         */
        function getRssFeed(feedRoot) {
            var _a, _b;
            var childs = (_b = (_a = getOneElement("channel", feedRoot.children)) === null || _a === void 0 ? void 0 : _a.children) !== null && _b !== void 0 ? _b : [];
            var feed = {
                type: feedRoot.name.substr(0, 3),
                id: "",
                items: (0, legacy_1.getElementsByTagName)("item", feedRoot.children).map(function(item) {
                    var children = item.children;
                    var entry = { media: getMediaElements(children) };
                    addConditionally(entry, "id", "guid", children);
                    addConditionally(entry, "title", "title", children);
                    addConditionally(entry, "link", "link", children);
                    addConditionally(entry, "description", "description", children);
                    var pubDate = fetch("pubDate", children);
                    if (pubDate)
                        entry.pubDate = new Date(pubDate);
                    return entry;
                }),
            };
            addConditionally(feed, "title", "title", childs);
            addConditionally(feed, "link", "link", childs);
            addConditionally(feed, "description", "description", childs);
            var updated = fetch("lastBuildDate", childs);
            if (updated) {
                feed.updated = new Date(updated);
            }
            addConditionally(feed, "author", "managingEditor", childs, true);
            return feed;
        }
        var MEDIA_KEYS_STRING = ["url", "type", "lang"];
        var MEDIA_KEYS_INT = [
            "fileSize",
            "bitrate",
            "framerate",
            "samplingrate",
            "channels",
            "duration",
            "height",
            "width",
        ];
        /**
         * Get all media elements of a feed item.
         *
         * @param where Nodes to search in.
         * @returns Media elements.
         */
        function getMediaElements(where) {
            return (0, legacy_1.getElementsByTagName)("media:content", where).map(function(elem) {
                var attribs = elem.attribs;
                var media = {
                    medium: attribs.medium,
                    isDefault: !!attribs.isDefault,
                };
                for (var _i = 0, MEDIA_KEYS_STRING_1 = MEDIA_KEYS_STRING; _i < MEDIA_KEYS_STRING_1.length; _i++) {
                    var attrib = MEDIA_KEYS_STRING_1[_i];
                    if (attribs[attrib]) {
                        media[attrib] = attribs[attrib];
                    }
                }
                for (var _a = 0, MEDIA_KEYS_INT_1 = MEDIA_KEYS_INT; _a < MEDIA_KEYS_INT_1.length; _a++) {
                    var attrib = MEDIA_KEYS_INT_1[_a];
                    if (attribs[attrib]) {
                        media[attrib] = parseInt(attribs[attrib], 10);
                    }
                }
                if (attribs.expression) {
                    media.expression =
                        attribs.expression;
                }
                return media;
            });
        }
        /**
         * Get one element by tag name.
         *
         * @param tagName Tag name to look for
         * @param node Node to search in
         * @returns The element or null
         */
        function getOneElement(tagName, node) {
            return (0, legacy_1.getElementsByTagName)(tagName, node, true, 1)[0];
        }
        /**
         * Get the text content of an element with a certain tag name.
         *
         * @param tagName Tag name to look for.
         * @param where  Node to search in.
         * @param recurse Whether to recurse into child nodes.
         * @returns The text content of the element.
         */
        function fetch(tagName, where, recurse) {
            if (recurse === void 0) { recurse = false; }
            return (0, stringify_1.textContent)((0, legacy_1.getElementsByTagName)(tagName, where, recurse, 1)).trim();
        }
        /**
         * Adds a property to an object if it has a value.
         *
         * @param obj Object to be extended
         * @param prop Property name
         * @param tagName Tag name that contains the conditionally added property
         * @param where Element to search for the property
         * @param recurse Whether to recurse into child nodes.
         */
        function addConditionally(obj, prop, tagName, where, recurse) {
            if (recurse === void 0) { recurse = false; }
            var val = fetch(tagName, where, recurse);
            if (val)
                obj[prop] = val;
        }
        /**
         * Checks if an element is a feed root node.
         *
         * @param value The name of the element to check.
         * @returns Whether an element is a feed root node.
         */
        function isValidFeed(value) {
            return value === "rss" || value === "feed" || value === "rdf:RDF";
        }

    }, { "./legacy": 32, "./stringify": 35 }],
    30: [function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.uniqueSort = exports.compareDocumentPosition = exports.removeSubsets = void 0;
        var domhandler_1 = require("domhandler");
        /**
         * Given an array of nodes, remove any member that is contained by another.
         *
         * @param nodes Nodes to filter.
         * @returns Remaining nodes that aren't subtrees of each other.
         */
        function removeSubsets(nodes) {
            var idx = nodes.length;
            /*
             * Check if each node (or one of its ancestors) is already contained in the
             * array.
             */
            while (--idx >= 0) {
                var node = nodes[idx];
                /*
                 * Remove the node if it is not unique.
                 * We are going through the array from the end, so we only
                 * have to check nodes that preceed the node under consideration in the array.
                 */
                if (idx > 0 && nodes.lastIndexOf(node, idx - 1) >= 0) {
                    nodes.splice(idx, 1);
                    continue;
                }
                for (var ancestor = node.parent; ancestor; ancestor = ancestor.parent) {
                    if (nodes.includes(ancestor)) {
                        nodes.splice(idx, 1);
                        break;
                    }
                }
            }
            return nodes;
        }
        exports.removeSubsets = removeSubsets;
        /**
         * Compare the position of one node against another node in any other document.
         * The return value is a bitmask with the following values:
         *
         * Document order:
         * > There is an ordering, document order, defined on all the nodes in the
         * > document corresponding to the order in which the first character of the
         * > XML representation of each node occurs in the XML representation of the
         * > document after expansion of general entities. Thus, the document element
         * > node will be the first node. Element nodes occur before their children.
         * > Thus, document order orders element nodes in order of the occurrence of
         * > their start-tag in the XML (after expansion of entities). The attribute
         * > nodes of an element occur after the element and before its children. The
         * > relative order of attribute nodes is implementation-dependent./
         *
         * Source:
         * http://www.w3.org/TR/DOM-Level-3-Core/glossary.html#dt-document-order
         *
         * @param nodeA The first node to use in the comparison
         * @param nodeB The second node to use in the comparison
         * @returns A bitmask describing the input nodes' relative position.
         *
         * See http://dom.spec.whatwg.org/#dom-node-comparedocumentposition for
         * a description of these values.
         */
        function compareDocumentPosition(nodeA, nodeB) {
            var aParents = [];
            var bParents = [];
            if (nodeA === nodeB) {
                return 0;
            }
            var current = (0, domhandler_1.hasChildren)(nodeA) ? nodeA : nodeA.parent;
            while (current) {
                aParents.unshift(current);
                current = current.parent;
            }
            current = (0, domhandler_1.hasChildren)(nodeB) ? nodeB : nodeB.parent;
            while (current) {
                bParents.unshift(current);
                current = current.parent;
            }
            var maxIdx = Math.min(aParents.length, bParents.length);
            var idx = 0;
            while (idx < maxIdx && aParents[idx] === bParents[idx]) {
                idx++;
            }
            if (idx === 0) {
                return 1 /* DISCONNECTED */ ;
            }
            var sharedParent = aParents[idx - 1];
            var siblings = sharedParent.children;
            var aSibling = aParents[idx];
            var bSibling = bParents[idx];
            if (siblings.indexOf(aSibling) > siblings.indexOf(bSibling)) {
                if (sharedParent === nodeB) {
                    return 4 /* FOLLOWING */ | 16 /* CONTAINED_BY */ ;
                }
                return 4 /* FOLLOWING */ ;
            }
            if (sharedParent === nodeA) {
                return 2 /* PRECEDING */ | 8 /* CONTAINS */ ;
            }
            return 2 /* PRECEDING */ ;
        }
        exports.compareDocumentPosition = compareDocumentPosition;
        /**
         * Sort an array of nodes based on their relative position in the document and
         * remove any duplicate nodes. If the array contains nodes that do not belong
         * to the same document, sort order is unspecified.
         *
         * @param nodes Array of DOM nodes.
         * @returns Collection of unique nodes, sorted in document order.
         */
        function uniqueSort(nodes) {
            nodes = nodes.filter(function(node, i, arr) { return !arr.includes(node, i + 1); });
            nodes.sort(function(a, b) {
                var relative = compareDocumentPosition(a, b);
                if (relative & 2 /* PRECEDING */ ) {
                    return -1;
                } else if (relative & 4 /* FOLLOWING */ ) {
                    return 1;
                }
                return 0;
            });
            return nodes;
        }
        exports.uniqueSort = uniqueSort;

    }, { "domhandler": 27 }],
    31: [function(require, module, exports) {
        "use strict";
        var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
            if (k2 === undefined) k2 = k;
            Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
        }) : (function(o, m, k, k2) {
            if (k2 === undefined) k2 = k;
            o[k2] = m[k];
        }));
        var __exportStar = (this && this.__exportStar) || function(m, exports) {
            for (var p in m)
                if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
        };
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.hasChildren = exports.isDocument = exports.isComment = exports.isText = exports.isCDATA = exports.isTag = void 0;
        __exportStar(require("./stringify"), exports);
        __exportStar(require("./traversal"), exports);
        __exportStar(require("./manipulation"), exports);
        __exportStar(require("./querying"), exports);
        __exportStar(require("./legacy"), exports);
        __exportStar(require("./helpers"), exports);
        __exportStar(require("./feeds"), exports);
        /** @deprecated Use these methods from `domhandler` directly. */
        var domhandler_1 = require("domhandler");
        Object.defineProperty(exports, "isTag", { enumerable: true, get: function() { return domhandler_1.isTag; } });
        Object.defineProperty(exports, "isCDATA", { enumerable: true, get: function() { return domhandler_1.isCDATA; } });
        Object.defineProperty(exports, "isText", { enumerable: true, get: function() { return domhandler_1.isText; } });
        Object.defineProperty(exports, "isComment", { enumerable: true, get: function() { return domhandler_1.isComment; } });
        Object.defineProperty(exports, "isDocument", { enumerable: true, get: function() { return domhandler_1.isDocument; } });
        Object.defineProperty(exports, "hasChildren", { enumerable: true, get: function() { return domhandler_1.hasChildren; } });

    }, { "./feeds": 29, "./helpers": 30, "./legacy": 32, "./manipulation": 33, "./querying": 34, "./stringify": 35, "./traversal": 36, "domhandler": 27 }],
    32: [function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.getElementsByTagType = exports.getElementsByTagName = exports.getElementById = exports.getElements = exports.testElement = void 0;
        var domhandler_1 = require("domhandler");
        var querying_1 = require("./querying");
        var Checks = {
            tag_name: function(name) {
                if (typeof name === "function") {
                    return function(elem) { return (0, domhandler_1.isTag)(elem) && name(elem.name); };
                } else if (name === "*") {
                    return domhandler_1.isTag;
                }
                return function(elem) { return (0, domhandler_1.isTag)(elem) && elem.name === name; };
            },
            tag_type: function(type) {
                if (typeof type === "function") {
                    return function(elem) { return type(elem.type); };
                }
                return function(elem) { return elem.type === type; };
            },
            tag_contains: function(data) {
                if (typeof data === "function") {
                    return function(elem) { return (0, domhandler_1.isText)(elem) && data(elem.data); };
                }
                return function(elem) { return (0, domhandler_1.isText)(elem) && elem.data === data; };
            },
        };
        /**
         * @param attrib Attribute to check.
         * @param value Attribute value to look for.
         * @returns A function to check whether the a node has an attribute with a particular value.
         */
        function getAttribCheck(attrib, value) {
            if (typeof value === "function") {
                return function(elem) { return (0, domhandler_1.isTag)(elem) && value(elem.attribs[attrib]); };
            }
            return function(elem) { return (0, domhandler_1.isTag)(elem) && elem.attribs[attrib] === value; };
        }
        /**
         * @param a First function to combine.
         * @param b Second function to combine.
         * @returns A function taking a node and returning `true` if either
         * of the input functions returns `true` for the node.
         */
        function combineFuncs(a, b) {
            return function(elem) { return a(elem) || b(elem); };
        }
        /**
         * @param options An object describing nodes to look for.
         * @returns A function executing all checks in `options` and returning `true`
         * if any of them match a node.
         */
        function compileTest(options) {
            var funcs = Object.keys(options).map(function(key) {
                var value = options[key];
                return Object.prototype.hasOwnProperty.call(Checks, key) ?
                    Checks[key](value) :
                    getAttribCheck(key, value);
            });
            return funcs.length === 0 ? null : funcs.reduce(combineFuncs);
        }
        /**
         * @param options An object describing nodes to look for.
         * @param node The element to test.
         * @returns Whether the element matches the description in `options`.
         */
        function testElement(options, node) {
            var test = compileTest(options);
            return test ? test(node) : true;
        }
        exports.testElement = testElement;
        /**
         * @param options An object describing nodes to look for.
         * @param nodes Nodes to search through.
         * @param recurse Also consider child nodes.
         * @param limit Maximum number of nodes to return.
         * @returns All nodes that match `options`.
         */
        function getElements(options, nodes, recurse, limit) {
            if (limit === void 0) { limit = Infinity; }
            var test = compileTest(options);
            return test ? (0, querying_1.filter)(test, nodes, recurse, limit) : [];
        }
        exports.getElements = getElements;
        /**
         * @param id The unique ID attribute value to look for.
         * @param nodes Nodes to search through.
         * @param recurse Also consider child nodes.
         * @returns The node with the supplied ID.
         */
        function getElementById(id, nodes, recurse) {
            if (recurse === void 0) { recurse = true; }
            if (!Array.isArray(nodes))
                nodes = [nodes];
            return (0, querying_1.findOne)(getAttribCheck("id", id), nodes, recurse);
        }
        exports.getElementById = getElementById;
        /**
         * @param tagName Tag name to search for.
         * @param nodes Nodes to search through.
         * @param recurse Also consider child nodes.
         * @param limit Maximum number of nodes to return.
         * @returns All nodes with the supplied `tagName`.
         */
        function getElementsByTagName(tagName, nodes, recurse, limit) {
            if (recurse === void 0) { recurse = true; }
            if (limit === void 0) { limit = Infinity; }
            return (0, querying_1.filter)(Checks.tag_name(tagName), nodes, recurse, limit);
        }
        exports.getElementsByTagName = getElementsByTagName;
        /**
         * @param type Element type to look for.
         * @param nodes Nodes to search through.
         * @param recurse Also consider child nodes.
         * @param limit Maximum number of nodes to return.
         * @returns All nodes with the supplied `type`.
         */
        function getElementsByTagType(type, nodes, recurse, limit) {
            if (recurse === void 0) { recurse = true; }
            if (limit === void 0) { limit = Infinity; }
            return (0, querying_1.filter)(Checks.tag_type(type), nodes, recurse, limit);
        }
        exports.getElementsByTagType = getElementsByTagType;

    }, { "./querying": 34, "domhandler": 27 }],
    33: [function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.prepend = exports.prependChild = exports.append = exports.appendChild = exports.replaceElement = exports.removeElement = void 0;
        /**
         * Remove an element from the dom
         *
         * @param elem The element to be removed
         */
        function removeElement(elem) {
            if (elem.prev)
                elem.prev.next = elem.next;
            if (elem.next)
                elem.next.prev = elem.prev;
            if (elem.parent) {
                var childs = elem.parent.children;
                childs.splice(childs.lastIndexOf(elem), 1);
            }
        }
        exports.removeElement = removeElement;
        /**
         * Replace an element in the dom
         *
         * @param elem The element to be replaced
         * @param replacement The element to be added
         */
        function replaceElement(elem, replacement) {
            var prev = (replacement.prev = elem.prev);
            if (prev) {
                prev.next = replacement;
            }
            var next = (replacement.next = elem.next);
            if (next) {
                next.prev = replacement;
            }
            var parent = (replacement.parent = elem.parent);
            if (parent) {
                var childs = parent.children;
                childs[childs.lastIndexOf(elem)] = replacement;
            }
        }
        exports.replaceElement = replaceElement;
        /**
         * Append a child to an element.
         *
         * @param elem The element to append to.
         * @param child The element to be added as a child.
         */
        function appendChild(elem, child) {
            removeElement(child);
            child.next = null;
            child.parent = elem;
            if (elem.children.push(child) > 1) {
                var sibling = elem.children[elem.children.length - 2];
                sibling.next = child;
                child.prev = sibling;
            } else {
                child.prev = null;
            }
        }
        exports.appendChild = appendChild;
        /**
         * Append an element after another.
         *
         * @param elem The element to append after.
         * @param next The element be added.
         */
        function append(elem, next) {
            removeElement(next);
            var parent = elem.parent;
            var currNext = elem.next;
            next.next = currNext;
            next.prev = elem;
            elem.next = next;
            next.parent = parent;
            if (currNext) {
                currNext.prev = next;
                if (parent) {
                    var childs = parent.children;
                    childs.splice(childs.lastIndexOf(currNext), 0, next);
                }
            } else if (parent) {
                parent.children.push(next);
            }
        }
        exports.append = append;
        /**
         * Prepend a child to an element.
         *
         * @param elem The element to prepend before.
         * @param child The element to be added as a child.
         */
        function prependChild(elem, child) {
            removeElement(child);
            child.parent = elem;
            child.prev = null;
            if (elem.children.unshift(child) !== 1) {
                var sibling = elem.children[1];
                sibling.prev = child;
                child.next = sibling;
            } else {
                child.next = null;
            }
        }
        exports.prependChild = prependChild;
        /**
         * Prepend an element before another.
         *
         * @param elem The element to prepend before.
         * @param prev The element be added.
         */
        function prepend(elem, prev) {
            removeElement(prev);
            var parent = elem.parent;
            if (parent) {
                var childs = parent.children;
                childs.splice(childs.indexOf(elem), 0, prev);
            }
            if (elem.prev) {
                elem.prev.next = prev;
            }
            prev.parent = parent;
            prev.prev = elem.prev;
            prev.next = elem;
            elem.prev = prev;
        }
        exports.prepend = prepend;

    }, {}],
    34: [function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.findAll = exports.existsOne = exports.findOne = exports.findOneChild = exports.find = exports.filter = void 0;
        var domhandler_1 = require("domhandler");
        /**
         * Search a node and its children for nodes passing a test function.
         *
         * @param test Function to test nodes on.
         * @param node Node to search. Will be included in the result set if it matches.
         * @param recurse Also consider child nodes.
         * @param limit Maximum number of nodes to return.
         * @returns All nodes passing `test`.
         */
        function filter(test, node, recurse, limit) {
            if (recurse === void 0) { recurse = true; }
            if (limit === void 0) { limit = Infinity; }
            if (!Array.isArray(node))
                node = [node];
            return find(test, node, recurse, limit);
        }
        exports.filter = filter;
        /**
         * Search an array of node and its children for nodes passing a test function.
         *
         * @param test Function to test nodes on.
         * @param nodes Array of nodes to search.
         * @param recurse Also consider child nodes.
         * @param limit Maximum number of nodes to return.
         * @returns All nodes passing `test`.
         */
        function find(test, nodes, recurse, limit) {
            var result = [];
            for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
                var elem = nodes_1[_i];
                if (test(elem)) {
                    result.push(elem);
                    if (--limit <= 0)
                        break;
                }
                if (recurse && (0, domhandler_1.hasChildren)(elem) && elem.children.length > 0) {
                    var children = find(test, elem.children, recurse, limit);
                    result.push.apply(result, children);
                    limit -= children.length;
                    if (limit <= 0)
                        break;
                }
            }
            return result;
        }
        exports.find = find;
        /**
         * Finds the first element inside of an array that matches a test function.
         *
         * @param test Function to test nodes on.
         * @param nodes Array of nodes to search.
         * @returns The first node in the array that passes `test`.
         */
        function findOneChild(test, nodes) {
            return nodes.find(test);
        }
        exports.findOneChild = findOneChild;
        /**
         * Finds one element in a tree that passes a test.
         *
         * @param test Function to test nodes on.
         * @param nodes Array of nodes to search.
         * @param recurse Also consider child nodes.
         * @returns The first child node that passes `test`.
         */
        function findOne(test, nodes, recurse) {
            if (recurse === void 0) { recurse = true; }
            var elem = null;
            for (var i = 0; i < nodes.length && !elem; i++) {
                var checked = nodes[i];
                if (!(0, domhandler_1.isTag)(checked)) {
                    continue;
                } else if (test(checked)) {
                    elem = checked;
                } else if (recurse && checked.children.length > 0) {
                    elem = findOne(test, checked.children);
                }
            }
            return elem;
        }
        exports.findOne = findOne;
        /**
         * @param test Function to test nodes on.
         * @param nodes Array of nodes to search.
         * @returns Whether a tree of nodes contains at least one node passing a test.
         */
        function existsOne(test, nodes) {
            return nodes.some(function(checked) {
                return (0, domhandler_1.isTag)(checked) &&
                    (test(checked) ||
                        (checked.children.length > 0 &&
                            existsOne(test, checked.children)));
            });
        }
        exports.existsOne = existsOne;
        /**
         * Search and array of nodes and its children for nodes passing a test function.
         *
         * Same as `find`, only with less options, leading to reduced complexity.
         *
         * @param test Function to test nodes on.
         * @param nodes Array of nodes to search.
         * @returns All nodes passing `test`.
         */
        function findAll(test, nodes) {
            var _a;
            var result = [];
            var stack = nodes.filter(domhandler_1.isTag);
            var elem;
            while ((elem = stack.shift())) {
                var children = (_a = elem.children) === null || _a === void 0 ? void 0 : _a.filter(domhandler_1.isTag);
                if (children && children.length > 0) {
                    stack.unshift.apply(stack, children);
                }
                if (test(elem))
                    result.push(elem);
            }
            return result;
        }
        exports.findAll = findAll;

    }, { "domhandler": 27 }],
    35: [function(require, module, exports) {
        "use strict";
        var __importDefault = (this && this.__importDefault) || function(mod) {
            return (mod && mod.__esModule) ? mod : { "default": mod };
        };
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.innerText = exports.textContent = exports.getText = exports.getInnerHTML = exports.getOuterHTML = void 0;
        var domhandler_1 = require("domhandler");
        var dom_serializer_1 = __importDefault(require("dom-serializer"));
        var domelementtype_1 = require("domelementtype");
        /**
         * @param node Node to get the outer HTML of.
         * @param options Options for serialization.
         * @deprecated Use the `dom-serializer` module directly.
         * @returns `node`'s outer HTML.
         */
        function getOuterHTML(node, options) {
            return (0, dom_serializer_1.default)(node, options);
        }
        exports.getOuterHTML = getOuterHTML;
        /**
         * @param node Node to get the inner HTML of.
         * @param options Options for serialization.
         * @deprecated Use the `dom-serializer` module directly.
         * @returns `node`'s inner HTML.
         */
        function getInnerHTML(node, options) {
            return (0, domhandler_1.hasChildren)(node) ?
                node.children.map(function(node) { return getOuterHTML(node, options); }).join("") :
                "";
        }
        exports.getInnerHTML = getInnerHTML;
        /**
         * Get a node's inner text. Same as `textContent`, but inserts newlines for `<br>` tags.
         *
         * @deprecated Use `textContent` instead.
         * @param node Node to get the inner text of.
         * @returns `node`'s inner text.
         */
        function getText(node) {
            if (Array.isArray(node))
                return node.map(getText).join("");
            if ((0, domhandler_1.isTag)(node))
                return node.name === "br" ? "\n" : getText(node.children);
            if ((0, domhandler_1.isCDATA)(node))
                return getText(node.children);
            if ((0, domhandler_1.isText)(node))
                return node.data;
            return "";
        }
        exports.getText = getText;
        /**
         * Get a node's text content.
         *
         * @param node Node to get the text content of.
         * @returns `node`'s text content.
         * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent}
         */
        function textContent(node) {
            if (Array.isArray(node))
                return node.map(textContent).join("");
            if ((0, domhandler_1.hasChildren)(node) && !(0, domhandler_1.isComment)(node)) {
                return textContent(node.children);
            }
            if ((0, domhandler_1.isText)(node))
                return node.data;
            return "";
        }
        exports.textContent = textContent;
        /**
         * Get a node's inner text.
         *
         * @param node Node to get the inner text of.
         * @returns `node`'s inner text.
         * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Node/innerText}
         */
        function innerText(node) {
            if (Array.isArray(node))
                return node.map(innerText).join("");
            if ((0, domhandler_1.hasChildren)(node) && (node.type === domelementtype_1.ElementType.Tag || (0, domhandler_1.isCDATA)(node))) {
                return innerText(node.children);
            }
            if ((0, domhandler_1.isText)(node))
                return node.data;
            return "";
        }
        exports.innerText = innerText;

    }, { "dom-serializer": 25, "domelementtype": 26, "domhandler": 27 }],
    36: [function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.prevElementSibling = exports.nextElementSibling = exports.getName = exports.hasAttrib = exports.getAttributeValue = exports.getSiblings = exports.getParent = exports.getChildren = void 0;
        var domhandler_1 = require("domhandler");
        var emptyArray = [];
        /**
         * Get a node's children.
         *
         * @param elem Node to get the children of.
         * @returns `elem`'s children, or an empty array.
         */
        function getChildren(elem) {
            var _a;
            return (_a = elem.children) !== null && _a !== void 0 ? _a : emptyArray;
        }
        exports.getChildren = getChildren;
        /**
         * Get a node's parent.
         *
         * @param elem Node to get the parent of.
         * @returns `elem`'s parent node.
         */
        function getParent(elem) {
            return elem.parent || null;
        }
        exports.getParent = getParent;
        /**
         * Gets an elements siblings, including the element itself.
         *
         * Attempts to get the children through the element's parent first.
         * If we don't have a parent (the element is a root node),
         * we walk the element's `prev` & `next` to get all remaining nodes.
         *
         * @param elem Element to get the siblings of.
         * @returns `elem`'s siblings.
         */
        function getSiblings(elem) {
            var _a, _b;
            var parent = getParent(elem);
            if (parent != null)
                return getChildren(parent);
            var siblings = [elem];
            var prev = elem.prev,
                next = elem.next;
            while (prev != null) {
                siblings.unshift(prev);
                (_a = prev, prev = _a.prev);
            }
            while (next != null) {
                siblings.push(next);
                (_b = next, next = _b.next);
            }
            return siblings;
        }
        exports.getSiblings = getSiblings;
        /**
         * Gets an attribute from an element.
         *
         * @param elem Element to check.
         * @param name Attribute name to retrieve.
         * @returns The element's attribute value, or `undefined`.
         */
        function getAttributeValue(elem, name) {
            var _a;
            return (_a = elem.attribs) === null || _a === void 0 ? void 0 : _a[name];
        }
        exports.getAttributeValue = getAttributeValue;
        /**
         * Checks whether an element has an attribute.
         *
         * @param elem Element to check.
         * @param name Attribute name to look for.
         * @returns Returns whether `elem` has the attribute `name`.
         */
        function hasAttrib(elem, name) {
            return (elem.attribs != null &&
                Object.prototype.hasOwnProperty.call(elem.attribs, name) &&
                elem.attribs[name] != null);
        }
        exports.hasAttrib = hasAttrib;
        /**
         * Get the tag name of an element.
         *
         * @param elem The element to get the name for.
         * @returns The tag name of `elem`.
         */
        function getName(elem) {
            return elem.name;
        }
        exports.getName = getName;
        /**
         * Returns the next element sibling of a node.
         *
         * @param elem The element to get the next sibling of.
         * @returns `elem`'s next sibling that is a tag.
         */
        function nextElementSibling(elem) {
            var _a;
            var next = elem.next;
            while (next !== null && !(0, domhandler_1.isTag)(next))
                (_a = next, next = _a.next);
            return next;
        }
        exports.nextElementSibling = nextElementSibling;
        /**
         * Returns the previous element sibling of a node.
         *
         * @param elem The element to get the previous sibling of.
         * @returns `elem`'s previous sibling that is a tag.
         */
        function prevElementSibling(elem) {
            var _a;
            var prev = elem.prev;
            while (prev !== null && !(0, domhandler_1.isTag)(prev))
                (_a = prev, prev = _a.prev);
            return prev;
        }
        exports.prevElementSibling = prevElementSibling;

    }, { "domhandler": 27 }],
    37: [function(require, module, exports) {
        "use strict";
        var __importDefault = (this && this.__importDefault) || function(mod) {
            return (mod && mod.__esModule) ? mod : { "default": mod };
        };
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.decodeHTML = exports.decodeHTMLStrict = exports.decodeXML = void 0;
        var entities_json_1 = __importDefault(require("./maps/entities.json"));
        var legacy_json_1 = __importDefault(require("./maps/legacy.json"));
        var xml_json_1 = __importDefault(require("./maps/xml.json"));
        var decode_codepoint_1 = __importDefault(require("./decode_codepoint"));
        var strictEntityRe = /&(?:[a-zA-Z0-9]+|#[xX][\da-fA-F]+|#\d+);/g;
        exports.decodeXML = getStrictDecoder(xml_json_1.default);
        exports.decodeHTMLStrict = getStrictDecoder(entities_json_1.default);

        function getStrictDecoder(map) {
            var replace = getReplacer(map);
            return function(str) { return String(str).replace(strictEntityRe, replace); };
        }
        var sorter = function(a, b) { return (a < b ? 1 : -1); };
        exports.decodeHTML = (function() {
            var legacy = Object.keys(legacy_json_1.default).sort(sorter);
            var keys = Object.keys(entities_json_1.default).sort(sorter);
            for (var i = 0, j = 0; i < keys.length; i++) {
                if (legacy[j] === keys[i]) {
                    keys[i] += ";?";
                    j++;
                } else {
                    keys[i] += ";";
                }
            }
            var re = new RegExp("&(?:" + keys.join("|") + "|#[xX][\\da-fA-F]+;?|#\\d+;?)", "g");
            var replace = getReplacer(entities_json_1.default);

            function replacer(str) {
                if (str.substr(-1) !== ";")
                    str += ";";
                return replace(str);
            }
            // TODO consider creating a merged map
            return function(str) { return String(str).replace(re, replacer); };
        })();

        function getReplacer(map) {
            return function replace(str) {
                if (str.charAt(1) === "#") {
                    var secondChar = str.charAt(2);
                    if (secondChar === "X" || secondChar === "x") {
                        return decode_codepoint_1.default(parseInt(str.substr(3), 16));
                    }
                    return decode_codepoint_1.default(parseInt(str.substr(2), 10));
                }
                // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                return map[str.slice(1, -1)] || str;
            };
        }

    }, { "./decode_codepoint": 38, "./maps/entities.json": 42, "./maps/legacy.json": 43, "./maps/xml.json": 44 }],
    38: [function(require, module, exports) {
        "use strict";
        var __importDefault = (this && this.__importDefault) || function(mod) {
            return (mod && mod.__esModule) ? mod : { "default": mod };
        };
        Object.defineProperty(exports, "__esModule", { value: true });
        var decode_json_1 = __importDefault(require("./maps/decode.json"));
        // Adapted from https://github.com/mathiasbynens/he/blob/master/src/he.js#L94-L119
        var fromCodePoint =
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            String.fromCodePoint ||
            function(codePoint) {
                var output = "";
                if (codePoint > 0xffff) {
                    codePoint -= 0x10000;
                    output += String.fromCharCode(((codePoint >>> 10) & 0x3ff) | 0xd800);
                    codePoint = 0xdc00 | (codePoint & 0x3ff);
                }
                output += String.fromCharCode(codePoint);
                return output;
            };

        function decodeCodePoint(codePoint) {
            if ((codePoint >= 0xd800 && codePoint <= 0xdfff) || codePoint > 0x10ffff) {
                return "\uFFFD";
            }
            if (codePoint in decode_json_1.default) {
                codePoint = decode_json_1.default[codePoint];
            }
            return fromCodePoint(codePoint);
        }
        exports.default = decodeCodePoint;

    }, { "./maps/decode.json": 41 }],
    39: [function(require, module, exports) {
        "use strict";
        var __importDefault = (this && this.__importDefault) || function(mod) {
            return (mod && mod.__esModule) ? mod : { "default": mod };
        };
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.escapeUTF8 = exports.escape = exports.encodeNonAsciiHTML = exports.encodeHTML = exports.encodeXML = void 0;
        var xml_json_1 = __importDefault(require("./maps/xml.json"));
        var inverseXML = getInverseObj(xml_json_1.default);
        var xmlReplacer = getInverseReplacer(inverseXML);
        /**
         * Encodes all non-ASCII characters, as well as characters not valid in XML
         * documents using XML entities.
         *
         * If a character has no equivalent entity, a
         * numeric hexadecimal reference (eg. `&#xfc;`) will be used.
         */
        exports.encodeXML = getASCIIEncoder(inverseXML);
        var entities_json_1 = __importDefault(require("./maps/entities.json"));
        var inverseHTML = getInverseObj(entities_json_1.default);
        var htmlReplacer = getInverseReplacer(inverseHTML);
        /**
         * Encodes all entities and non-ASCII characters in the input.
         *
         * This includes characters that are valid ASCII characters in HTML documents.
         * For example `#` will be encoded as `&num;`. To get a more compact output,
         * consider using the `encodeNonAsciiHTML` function.
         *
         * If a character has no equivalent entity, a
         * numeric hexadecimal reference (eg. `&#xfc;`) will be used.
         */
        exports.encodeHTML = getInverse(inverseHTML, htmlReplacer);
        /**
         * Encodes all non-ASCII characters, as well as characters not valid in HTML
         * documents using HTML entities.
         *
         * If a character has no equivalent entity, a
         * numeric hexadecimal reference (eg. `&#xfc;`) will be used.
         */
        exports.encodeNonAsciiHTML = getASCIIEncoder(inverseHTML);

        function getInverseObj(obj) {
            return Object.keys(obj)
                .sort()
                .reduce(function(inverse, name) {
                    inverse[obj[name]] = "&" + name + ";";
                    return inverse;
                }, {});
        }

        function getInverseReplacer(inverse) {
            var single = [];
            var multiple = [];
            for (var _i = 0, _a = Object.keys(inverse); _i < _a.length; _i++) {
                var k = _a[_i];
                if (k.length === 1) {
                    // Add value to single array
                    single.push("\\" + k);
                } else {
                    // Add value to multiple array
                    multiple.push(k);
                }
            }
            // Add ranges to single characters.
            single.sort();
            for (var start = 0; start < single.length - 1; start++) {
                // Find the end of a run of characters
                var end = start;
                while (end < single.length - 1 &&
                    single[end].charCodeAt(1) + 1 === single[end + 1].charCodeAt(1)) {
                    end += 1;
                }
                var count = 1 + end - start;
                // We want to replace at least three characters
                if (count < 3)
                    continue;
                single.splice(start, count, single[start] + "-" + single[end]);
            }
            multiple.unshift("[" + single.join("") + "]");
            return new RegExp(multiple.join("|"), "g");
        }
        // /[^\0-\x7F]/gu
        var reNonASCII = /(?:[\x80-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/g;
        var getCodePoint =
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            String.prototype.codePointAt != null ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            function(str) { return str.codePointAt(0); } : // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
            function(c) {
                return (c.charCodeAt(0) - 0xd800) * 0x400 +
                    c.charCodeAt(1) -
                    0xdc00 +
                    0x10000;
            };

        function singleCharReplacer(c) {
            return "&#x" + (c.length > 1 ? getCodePoint(c) : c.charCodeAt(0))
                .toString(16)
                .toUpperCase() + ";";
        }

        function getInverse(inverse, re) {
            return function(data) {
                return data
                    .replace(re, function(name) { return inverse[name]; })
                    .replace(reNonASCII, singleCharReplacer);
            };
        }
        var reEscapeChars = new RegExp(xmlReplacer.source + "|" + reNonASCII.source, "g");
        /**
         * Encodes all non-ASCII characters, as well as characters not valid in XML
         * documents using numeric hexadecimal reference (eg. `&#xfc;`).
         *
         * Have a look at `escapeUTF8` if you want a more concise output at the expense
         * of reduced transportability.
         *
         * @param data String to escape.
         */
        function escape(data) {
            return data.replace(reEscapeChars, singleCharReplacer);
        }
        exports.escape = escape;
        /**
         * Encodes all characters not valid in XML documents using numeric hexadecimal
         * reference (eg. `&#xfc;`).
         *
         * Note that the output will be character-set dependent.
         *
         * @param data String to escape.
         */
        function escapeUTF8(data) {
            return data.replace(xmlReplacer, singleCharReplacer);
        }
        exports.escapeUTF8 = escapeUTF8;

        function getASCIIEncoder(obj) {
            return function(data) {
                return data.replace(reEscapeChars, function(c) { return obj[c] || singleCharReplacer(c); });
            };
        }

    }, { "./maps/entities.json": 42, "./maps/xml.json": 44 }],
    40: [function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.decodeXMLStrict = exports.decodeHTML5Strict = exports.decodeHTML4Strict = exports.decodeHTML5 = exports.decodeHTML4 = exports.decodeHTMLStrict = exports.decodeHTML = exports.decodeXML = exports.encodeHTML5 = exports.encodeHTML4 = exports.escapeUTF8 = exports.escape = exports.encodeNonAsciiHTML = exports.encodeHTML = exports.encodeXML = exports.encode = exports.decodeStrict = exports.decode = void 0;
        var decode_1 = require("./decode");
        var encode_1 = require("./encode");
        /**
         * Decodes a string with entities.
         *
         * @param data String to decode.
         * @param level Optional level to decode at. 0 = XML, 1 = HTML. Default is 0.
         * @deprecated Use `decodeXML` or `decodeHTML` directly.
         */
        function decode(data, level) {
            return (!level || level <= 0 ? decode_1.decodeXML : decode_1.decodeHTML)(data);
        }
        exports.decode = decode;
        /**
         * Decodes a string with entities. Does not allow missing trailing semicolons for entities.
         *
         * @param data String to decode.
         * @param level Optional level to decode at. 0 = XML, 1 = HTML. Default is 0.
         * @deprecated Use `decodeHTMLStrict` or `decodeXML` directly.
         */
        function decodeStrict(data, level) {
            return (!level || level <= 0 ? decode_1.decodeXML : decode_1.decodeHTMLStrict)(data);
        }
        exports.decodeStrict = decodeStrict;
        /**
         * Encodes a string with entities.
         *
         * @param data String to encode.
         * @param level Optional level to encode at. 0 = XML, 1 = HTML. Default is 0.
         * @deprecated Use `encodeHTML`, `encodeXML` or `encodeNonAsciiHTML` directly.
         */
        function encode(data, level) {
            return (!level || level <= 0 ? encode_1.encodeXML : encode_1.encodeHTML)(data);
        }
        exports.encode = encode;
        var encode_2 = require("./encode");
        Object.defineProperty(exports, "encodeXML", { enumerable: true, get: function() { return encode_2.encodeXML; } });
        Object.defineProperty(exports, "encodeHTML", { enumerable: true, get: function() { return encode_2.encodeHTML; } });
        Object.defineProperty(exports, "encodeNonAsciiHTML", { enumerable: true, get: function() { return encode_2.encodeNonAsciiHTML; } });
        Object.defineProperty(exports, "escape", { enumerable: true, get: function() { return encode_2.escape; } });
        Object.defineProperty(exports, "escapeUTF8", { enumerable: true, get: function() { return encode_2.escapeUTF8; } });
        // Legacy aliases (deprecated)
        Object.defineProperty(exports, "encodeHTML4", { enumerable: true, get: function() { return encode_2.encodeHTML; } });
        Object.defineProperty(exports, "encodeHTML5", { enumerable: true, get: function() { return encode_2.encodeHTML; } });
        var decode_2 = require("./decode");
        Object.defineProperty(exports, "decodeXML", { enumerable: true, get: function() { return decode_2.decodeXML; } });
        Object.defineProperty(exports, "decodeHTML", { enumerable: true, get: function() { return decode_2.decodeHTML; } });
        Object.defineProperty(exports, "decodeHTMLStrict", { enumerable: true, get: function() { return decode_2.decodeHTMLStrict; } });
        // Legacy aliases (deprecated)
        Object.defineProperty(exports, "decodeHTML4", { enumerable: true, get: function() { return decode_2.decodeHTML; } });
        Object.defineProperty(exports, "decodeHTML5", { enumerable: true, get: function() { return decode_2.decodeHTML; } });
        Object.defineProperty(exports, "decodeHTML4Strict", { enumerable: true, get: function() { return decode_2.decodeHTMLStrict; } });
        Object.defineProperty(exports, "decodeHTML5Strict", { enumerable: true, get: function() { return decode_2.decodeHTMLStrict; } });
        Object.defineProperty(exports, "decodeXMLStrict", { enumerable: true, get: function() { return decode_2.decodeXML; } });

    }, { "./decode": 37, "./encode": 39 }],
    41: [function(require, module, exports) {
        module.exports = { "0": 65533, "128": 8364, "130": 8218, "131": 402, "132": 8222, "133": 8230, "134": 8224, "135": 8225, "136": 710, "137": 8240, "138": 352, "139": 8249, "140": 338, "142": 381, "145": 8216, "146": 8217, "147": 8220, "148": 8221, "149": 8226, "150": 8211, "151": 8212, "152": 732, "153": 8482, "154": 353, "155": 8250, "156": 339, "158": 382, "159": 376 }

    }, {}],
    42: [function(require, module, exports) {
        module.exports = { "Aacute": "Á", "aacute": "á", "Abreve": "Ă", "abreve": "ă", "ac": "∾", "acd": "∿", "acE": "∾̳", "Acirc": "Â", "acirc": "â", "acute": "´", "Acy": "А", "acy": "а", "AElig": "Æ", "aelig": "æ", "af": "⁡", "Afr": "𝔄", "afr": "𝔞", "Agrave": "À", "agrave": "à", "alefsym": "ℵ", "aleph": "ℵ", "Alpha": "Α", "alpha": "α", "Amacr": "Ā", "amacr": "ā", "amalg": "⨿", "amp": "&", "AMP": "&", "andand": "⩕", "And": "⩓", "and": "∧", "andd": "⩜", "andslope": "⩘", "andv": "⩚", "ang": "∠", "ange": "⦤", "angle": "∠", "angmsdaa": "⦨", "angmsdab": "⦩", "angmsdac": "⦪", "angmsdad": "⦫", "angmsdae": "⦬", "angmsdaf": "⦭", "angmsdag": "⦮", "angmsdah": "⦯", "angmsd": "∡", "angrt": "∟", "angrtvb": "⊾", "angrtvbd": "⦝", "angsph": "∢", "angst": "Å", "angzarr": "⍼", "Aogon": "Ą", "aogon": "ą", "Aopf": "𝔸", "aopf": "𝕒", "apacir": "⩯", "ap": "≈", "apE": "⩰", "ape": "≊", "apid": "≋", "apos": "'", "ApplyFunction": "⁡", "approx": "≈", "approxeq": "≊", "Aring": "Å", "aring": "å", "Ascr": "𝒜", "ascr": "𝒶", "Assign": "≔", "ast": "*", "asymp": "≈", "asympeq": "≍", "Atilde": "Ã", "atilde": "ã", "Auml": "Ä", "auml": "ä", "awconint": "∳", "awint": "⨑", "backcong": "≌", "backepsilon": "϶", "backprime": "‵", "backsim": "∽", "backsimeq": "⋍", "Backslash": "∖", "Barv": "⫧", "barvee": "⊽", "barwed": "⌅", "Barwed": "⌆", "barwedge": "⌅", "bbrk": "⎵", "bbrktbrk": "⎶", "bcong": "≌", "Bcy": "Б", "bcy": "б", "bdquo": "„", "becaus": "∵", "because": "∵", "Because": "∵", "bemptyv": "⦰", "bepsi": "϶", "bernou": "ℬ", "Bernoullis": "ℬ", "Beta": "Β", "beta": "β", "beth": "ℶ", "between": "≬", "Bfr": "𝔅", "bfr": "𝔟", "bigcap": "⋂", "bigcirc": "◯", "bigcup": "⋃", "bigodot": "⨀", "bigoplus": "⨁", "bigotimes": "⨂", "bigsqcup": "⨆", "bigstar": "★", "bigtriangledown": "▽", "bigtriangleup": "△", "biguplus": "⨄", "bigvee": "⋁", "bigwedge": "⋀", "bkarow": "⤍", "blacklozenge": "⧫", "blacksquare": "▪", "blacktriangle": "▴", "blacktriangledown": "▾", "blacktriangleleft": "◂", "blacktriangleright": "▸", "blank": "␣", "blk12": "▒", "blk14": "░", "blk34": "▓", "block": "█", "bne": "=⃥", "bnequiv": "≡⃥", "bNot": "⫭", "bnot": "⌐", "Bopf": "𝔹", "bopf": "𝕓", "bot": "⊥", "bottom": "⊥", "bowtie": "⋈", "boxbox": "⧉", "boxdl": "┐", "boxdL": "╕", "boxDl": "╖", "boxDL": "╗", "boxdr": "┌", "boxdR": "╒", "boxDr": "╓", "boxDR": "╔", "boxh": "─", "boxH": "═", "boxhd": "┬", "boxHd": "╤", "boxhD": "╥", "boxHD": "╦", "boxhu": "┴", "boxHu": "╧", "boxhU": "╨", "boxHU": "╩", "boxminus": "⊟", "boxplus": "⊞", "boxtimes": "⊠", "boxul": "┘", "boxuL": "╛", "boxUl": "╜", "boxUL": "╝", "boxur": "└", "boxuR": "╘", "boxUr": "╙", "boxUR": "╚", "boxv": "│", "boxV": "║", "boxvh": "┼", "boxvH": "╪", "boxVh": "╫", "boxVH": "╬", "boxvl": "┤", "boxvL": "╡", "boxVl": "╢", "boxVL": "╣", "boxvr": "├", "boxvR": "╞", "boxVr": "╟", "boxVR": "╠", "bprime": "‵", "breve": "˘", "Breve": "˘", "brvbar": "¦", "bscr": "𝒷", "Bscr": "ℬ", "bsemi": "⁏", "bsim": "∽", "bsime": "⋍", "bsolb": "⧅", "bsol": "\\", "bsolhsub": "⟈", "bull": "•", "bullet": "•", "bump": "≎", "bumpE": "⪮", "bumpe": "≏", "Bumpeq": "≎", "bumpeq": "≏", "Cacute": "Ć", "cacute": "ć", "capand": "⩄", "capbrcup": "⩉", "capcap": "⩋", "cap": "∩", "Cap": "⋒", "capcup": "⩇", "capdot": "⩀", "CapitalDifferentialD": "ⅅ", "caps": "∩︀", "caret": "⁁", "caron": "ˇ", "Cayleys": "ℭ", "ccaps": "⩍", "Ccaron": "Č", "ccaron": "č", "Ccedil": "Ç", "ccedil": "ç", "Ccirc": "Ĉ", "ccirc": "ĉ", "Cconint": "∰", "ccups": "⩌", "ccupssm": "⩐", "Cdot": "Ċ", "cdot": "ċ", "cedil": "¸", "Cedilla": "¸", "cemptyv": "⦲", "cent": "¢", "centerdot": "·", "CenterDot": "·", "cfr": "𝔠", "Cfr": "ℭ", "CHcy": "Ч", "chcy": "ч", "check": "✓", "checkmark": "✓", "Chi": "Χ", "chi": "χ", "circ": "ˆ", "circeq": "≗", "circlearrowleft": "↺", "circlearrowright": "↻", "circledast": "⊛", "circledcirc": "⊚", "circleddash": "⊝", "CircleDot": "⊙", "circledR": "®", "circledS": "Ⓢ", "CircleMinus": "⊖", "CirclePlus": "⊕", "CircleTimes": "⊗", "cir": "○", "cirE": "⧃", "cire": "≗", "cirfnint": "⨐", "cirmid": "⫯", "cirscir": "⧂", "ClockwiseContourIntegral": "∲", "CloseCurlyDoubleQuote": "”", "CloseCurlyQuote": "’", "clubs": "♣", "clubsuit": "♣", "colon": ":", "Colon": "∷", "Colone": "⩴", "colone": "≔", "coloneq": "≔", "comma": ",", "commat": "@", "comp": "∁", "compfn": "∘", "complement": "∁", "complexes": "ℂ", "cong": "≅", "congdot": "⩭", "Congruent": "≡", "conint": "∮", "Conint": "∯", "ContourIntegral": "∮", "copf": "𝕔", "Copf": "ℂ", "coprod": "∐", "Coproduct": "∐", "copy": "©", "COPY": "©", "copysr": "℗", "CounterClockwiseContourIntegral": "∳", "crarr": "↵", "cross": "✗", "Cross": "⨯", "Cscr": "𝒞", "cscr": "𝒸", "csub": "⫏", "csube": "⫑", "csup": "⫐", "csupe": "⫒", "ctdot": "⋯", "cudarrl": "⤸", "cudarrr": "⤵", "cuepr": "⋞", "cuesc": "⋟", "cularr": "↶", "cularrp": "⤽", "cupbrcap": "⩈", "cupcap": "⩆", "CupCap": "≍", "cup": "∪", "Cup": "⋓", "cupcup": "⩊", "cupdot": "⊍", "cupor": "⩅", "cups": "∪︀", "curarr": "↷", "curarrm": "⤼", "curlyeqprec": "⋞", "curlyeqsucc": "⋟", "curlyvee": "⋎", "curlywedge": "⋏", "curren": "¤", "curvearrowleft": "↶", "curvearrowright": "↷", "cuvee": "⋎", "cuwed": "⋏", "cwconint": "∲", "cwint": "∱", "cylcty": "⌭", "dagger": "†", "Dagger": "‡", "daleth": "ℸ", "darr": "↓", "Darr": "↡", "dArr": "⇓", "dash": "‐", "Dashv": "⫤", "dashv": "⊣", "dbkarow": "⤏", "dblac": "˝", "Dcaron": "Ď", "dcaron": "ď", "Dcy": "Д", "dcy": "д", "ddagger": "‡", "ddarr": "⇊", "DD": "ⅅ", "dd": "ⅆ", "DDotrahd": "⤑", "ddotseq": "⩷", "deg": "°", "Del": "∇", "Delta": "Δ", "delta": "δ", "demptyv": "⦱", "dfisht": "⥿", "Dfr": "𝔇", "dfr": "𝔡", "dHar": "⥥", "dharl": "⇃", "dharr": "⇂", "DiacriticalAcute": "´", "DiacriticalDot": "˙", "DiacriticalDoubleAcute": "˝", "DiacriticalGrave": "`", "DiacriticalTilde": "˜", "diam": "⋄", "diamond": "⋄", "Diamond": "⋄", "diamondsuit": "♦", "diams": "♦", "die": "¨", "DifferentialD": "ⅆ", "digamma": "ϝ", "disin": "⋲", "div": "÷", "divide": "÷", "divideontimes": "⋇", "divonx": "⋇", "DJcy": "Ђ", "djcy": "ђ", "dlcorn": "⌞", "dlcrop": "⌍", "dollar": "$", "Dopf": "𝔻", "dopf": "𝕕", "Dot": "¨", "dot": "˙", "DotDot": "⃜", "doteq": "≐", "doteqdot": "≑", "DotEqual": "≐", "dotminus": "∸", "dotplus": "∔", "dotsquare": "⊡", "doublebarwedge": "⌆", "DoubleContourIntegral": "∯", "DoubleDot": "¨", "DoubleDownArrow": "⇓", "DoubleLeftArrow": "⇐", "DoubleLeftRightArrow": "⇔", "DoubleLeftTee": "⫤", "DoubleLongLeftArrow": "⟸", "DoubleLongLeftRightArrow": "⟺", "DoubleLongRightArrow": "⟹", "DoubleRightArrow": "⇒", "DoubleRightTee": "⊨", "DoubleUpArrow": "⇑", "DoubleUpDownArrow": "⇕", "DoubleVerticalBar": "∥", "DownArrowBar": "⤓", "downarrow": "↓", "DownArrow": "↓", "Downarrow": "⇓", "DownArrowUpArrow": "⇵", "DownBreve": "̑", "downdownarrows": "⇊", "downharpoonleft": "⇃", "downharpoonright": "⇂", "DownLeftRightVector": "⥐", "DownLeftTeeVector": "⥞", "DownLeftVectorBar": "⥖", "DownLeftVector": "↽", "DownRightTeeVector": "⥟", "DownRightVectorBar": "⥗", "DownRightVector": "⇁", "DownTeeArrow": "↧", "DownTee": "⊤", "drbkarow": "⤐", "drcorn": "⌟", "drcrop": "⌌", "Dscr": "𝒟", "dscr": "𝒹", "DScy": "Ѕ", "dscy": "ѕ", "dsol": "⧶", "Dstrok": "Đ", "dstrok": "đ", "dtdot": "⋱", "dtri": "▿", "dtrif": "▾", "duarr": "⇵", "duhar": "⥯", "dwangle": "⦦", "DZcy": "Џ", "dzcy": "џ", "dzigrarr": "⟿", "Eacute": "É", "eacute": "é", "easter": "⩮", "Ecaron": "Ě", "ecaron": "ě", "Ecirc": "Ê", "ecirc": "ê", "ecir": "≖", "ecolon": "≕", "Ecy": "Э", "ecy": "э", "eDDot": "⩷", "Edot": "Ė", "edot": "ė", "eDot": "≑", "ee": "ⅇ", "efDot": "≒", "Efr": "𝔈", "efr": "𝔢", "eg": "⪚", "Egrave": "È", "egrave": "è", "egs": "⪖", "egsdot": "⪘", "el": "⪙", "Element": "∈", "elinters": "⏧", "ell": "ℓ", "els": "⪕", "elsdot": "⪗", "Emacr": "Ē", "emacr": "ē", "empty": "∅", "emptyset": "∅", "EmptySmallSquare": "◻", "emptyv": "∅", "EmptyVerySmallSquare": "▫", "emsp13": " ", "emsp14": " ", "emsp": " ", "ENG": "Ŋ", "eng": "ŋ", "ensp": " ", "Eogon": "Ę", "eogon": "ę", "Eopf": "𝔼", "eopf": "𝕖", "epar": "⋕", "eparsl": "⧣", "eplus": "⩱", "epsi": "ε", "Epsilon": "Ε", "epsilon": "ε", "epsiv": "ϵ", "eqcirc": "≖", "eqcolon": "≕", "eqsim": "≂", "eqslantgtr": "⪖", "eqslantless": "⪕", "Equal": "⩵", "equals": "=", "EqualTilde": "≂", "equest": "≟", "Equilibrium": "⇌", "equiv": "≡", "equivDD": "⩸", "eqvparsl": "⧥", "erarr": "⥱", "erDot": "≓", "escr": "ℯ", "Escr": "ℰ", "esdot": "≐", "Esim": "⩳", "esim": "≂", "Eta": "Η", "eta": "η", "ETH": "Ð", "eth": "ð", "Euml": "Ë", "euml": "ë", "euro": "€", "excl": "!", "exist": "∃", "Exists": "∃", "expectation": "ℰ", "exponentiale": "ⅇ", "ExponentialE": "ⅇ", "fallingdotseq": "≒", "Fcy": "Ф", "fcy": "ф", "female": "♀", "ffilig": "ﬃ", "fflig": "ﬀ", "ffllig": "ﬄ", "Ffr": "𝔉", "ffr": "𝔣", "filig": "ﬁ", "FilledSmallSquare": "◼", "FilledVerySmallSquare": "▪", "fjlig": "fj", "flat": "♭", "fllig": "ﬂ", "fltns": "▱", "fnof": "ƒ", "Fopf": "𝔽", "fopf": "𝕗", "forall": "∀", "ForAll": "∀", "fork": "⋔", "forkv": "⫙", "Fouriertrf": "ℱ", "fpartint": "⨍", "frac12": "½", "frac13": "⅓", "frac14": "¼", "frac15": "⅕", "frac16": "⅙", "frac18": "⅛", "frac23": "⅔", "frac25": "⅖", "frac34": "¾", "frac35": "⅗", "frac38": "⅜", "frac45": "⅘", "frac56": "⅚", "frac58": "⅝", "frac78": "⅞", "frasl": "⁄", "frown": "⌢", "fscr": "𝒻", "Fscr": "ℱ", "gacute": "ǵ", "Gamma": "Γ", "gamma": "γ", "Gammad": "Ϝ", "gammad": "ϝ", "gap": "⪆", "Gbreve": "Ğ", "gbreve": "ğ", "Gcedil": "Ģ", "Gcirc": "Ĝ", "gcirc": "ĝ", "Gcy": "Г", "gcy": "г", "Gdot": "Ġ", "gdot": "ġ", "ge": "≥", "gE": "≧", "gEl": "⪌", "gel": "⋛", "geq": "≥", "geqq": "≧", "geqslant": "⩾", "gescc": "⪩", "ges": "⩾", "gesdot": "⪀", "gesdoto": "⪂", "gesdotol": "⪄", "gesl": "⋛︀", "gesles": "⪔", "Gfr": "𝔊", "gfr": "𝔤", "gg": "≫", "Gg": "⋙", "ggg": "⋙", "gimel": "ℷ", "GJcy": "Ѓ", "gjcy": "ѓ", "gla": "⪥", "gl": "≷", "glE": "⪒", "glj": "⪤", "gnap": "⪊", "gnapprox": "⪊", "gne": "⪈", "gnE": "≩", "gneq": "⪈", "gneqq": "≩", "gnsim": "⋧", "Gopf": "𝔾", "gopf": "𝕘", "grave": "`", "GreaterEqual": "≥", "GreaterEqualLess": "⋛", "GreaterFullEqual": "≧", "GreaterGreater": "⪢", "GreaterLess": "≷", "GreaterSlantEqual": "⩾", "GreaterTilde": "≳", "Gscr": "𝒢", "gscr": "ℊ", "gsim": "≳", "gsime": "⪎", "gsiml": "⪐", "gtcc": "⪧", "gtcir": "⩺", "gt": ">", "GT": ">", "Gt": "≫", "gtdot": "⋗", "gtlPar": "⦕", "gtquest": "⩼", "gtrapprox": "⪆", "gtrarr": "⥸", "gtrdot": "⋗", "gtreqless": "⋛", "gtreqqless": "⪌", "gtrless": "≷", "gtrsim": "≳", "gvertneqq": "≩︀", "gvnE": "≩︀", "Hacek": "ˇ", "hairsp": " ", "half": "½", "hamilt": "ℋ", "HARDcy": "Ъ", "hardcy": "ъ", "harrcir": "⥈", "harr": "↔", "hArr": "⇔", "harrw": "↭", "Hat": "^", "hbar": "ℏ", "Hcirc": "Ĥ", "hcirc": "ĥ", "hearts": "♥", "heartsuit": "♥", "hellip": "…", "hercon": "⊹", "hfr": "𝔥", "Hfr": "ℌ", "HilbertSpace": "ℋ", "hksearow": "⤥", "hkswarow": "⤦", "hoarr": "⇿", "homtht": "∻", "hookleftarrow": "↩", "hookrightarrow": "↪", "hopf": "𝕙", "Hopf": "ℍ", "horbar": "―", "HorizontalLine": "─", "hscr": "𝒽", "Hscr": "ℋ", "hslash": "ℏ", "Hstrok": "Ħ", "hstrok": "ħ", "HumpDownHump": "≎", "HumpEqual": "≏", "hybull": "⁃", "hyphen": "‐", "Iacute": "Í", "iacute": "í", "ic": "⁣", "Icirc": "Î", "icirc": "î", "Icy": "И", "icy": "и", "Idot": "İ", "IEcy": "Е", "iecy": "е", "iexcl": "¡", "iff": "⇔", "ifr": "𝔦", "Ifr": "ℑ", "Igrave": "Ì", "igrave": "ì", "ii": "ⅈ", "iiiint": "⨌", "iiint": "∭", "iinfin": "⧜", "iiota": "℩", "IJlig": "Ĳ", "ijlig": "ĳ", "Imacr": "Ī", "imacr": "ī", "image": "ℑ", "ImaginaryI": "ⅈ", "imagline": "ℐ", "imagpart": "ℑ", "imath": "ı", "Im": "ℑ", "imof": "⊷", "imped": "Ƶ", "Implies": "⇒", "incare": "℅", "in": "∈", "infin": "∞", "infintie": "⧝", "inodot": "ı", "intcal": "⊺", "int": "∫", "Int": "∬", "integers": "ℤ", "Integral": "∫", "intercal": "⊺", "Intersection": "⋂", "intlarhk": "⨗", "intprod": "⨼", "InvisibleComma": "⁣", "InvisibleTimes": "⁢", "IOcy": "Ё", "iocy": "ё", "Iogon": "Į", "iogon": "į", "Iopf": "𝕀", "iopf": "𝕚", "Iota": "Ι", "iota": "ι", "iprod": "⨼", "iquest": "¿", "iscr": "𝒾", "Iscr": "ℐ", "isin": "∈", "isindot": "⋵", "isinE": "⋹", "isins": "⋴", "isinsv": "⋳", "isinv": "∈", "it": "⁢", "Itilde": "Ĩ", "itilde": "ĩ", "Iukcy": "І", "iukcy": "і", "Iuml": "Ï", "iuml": "ï", "Jcirc": "Ĵ", "jcirc": "ĵ", "Jcy": "Й", "jcy": "й", "Jfr": "𝔍", "jfr": "𝔧", "jmath": "ȷ", "Jopf": "𝕁", "jopf": "𝕛", "Jscr": "𝒥", "jscr": "𝒿", "Jsercy": "Ј", "jsercy": "ј", "Jukcy": "Є", "jukcy": "є", "Kappa": "Κ", "kappa": "κ", "kappav": "ϰ", "Kcedil": "Ķ", "kcedil": "ķ", "Kcy": "К", "kcy": "к", "Kfr": "𝔎", "kfr": "𝔨", "kgreen": "ĸ", "KHcy": "Х", "khcy": "х", "KJcy": "Ќ", "kjcy": "ќ", "Kopf": "𝕂", "kopf": "𝕜", "Kscr": "𝒦", "kscr": "𝓀", "lAarr": "⇚", "Lacute": "Ĺ", "lacute": "ĺ", "laemptyv": "⦴", "lagran": "ℒ", "Lambda": "Λ", "lambda": "λ", "lang": "⟨", "Lang": "⟪", "langd": "⦑", "langle": "⟨", "lap": "⪅", "Laplacetrf": "ℒ", "laquo": "«", "larrb": "⇤", "larrbfs": "⤟", "larr": "←", "Larr": "↞", "lArr": "⇐", "larrfs": "⤝", "larrhk": "↩", "larrlp": "↫", "larrpl": "⤹", "larrsim": "⥳", "larrtl": "↢", "latail": "⤙", "lAtail": "⤛", "lat": "⪫", "late": "⪭", "lates": "⪭︀", "lbarr": "⤌", "lBarr": "⤎", "lbbrk": "❲", "lbrace": "{", "lbrack": "[", "lbrke": "⦋", "lbrksld": "⦏", "lbrkslu": "⦍", "Lcaron": "Ľ", "lcaron": "ľ", "Lcedil": "Ļ", "lcedil": "ļ", "lceil": "⌈", "lcub": "{", "Lcy": "Л", "lcy": "л", "ldca": "⤶", "ldquo": "“", "ldquor": "„", "ldrdhar": "⥧", "ldrushar": "⥋", "ldsh": "↲", "le": "≤", "lE": "≦", "LeftAngleBracket": "⟨", "LeftArrowBar": "⇤", "leftarrow": "←", "LeftArrow": "←", "Leftarrow": "⇐", "LeftArrowRightArrow": "⇆", "leftarrowtail": "↢", "LeftCeiling": "⌈", "LeftDoubleBracket": "⟦", "LeftDownTeeVector": "⥡", "LeftDownVectorBar": "⥙", "LeftDownVector": "⇃", "LeftFloor": "⌊", "leftharpoondown": "↽", "leftharpoonup": "↼", "leftleftarrows": "⇇", "leftrightarrow": "↔", "LeftRightArrow": "↔", "Leftrightarrow": "⇔", "leftrightarrows": "⇆", "leftrightharpoons": "⇋", "leftrightsquigarrow": "↭", "LeftRightVector": "⥎", "LeftTeeArrow": "↤", "LeftTee": "⊣", "LeftTeeVector": "⥚", "leftthreetimes": "⋋", "LeftTriangleBar": "⧏", "LeftTriangle": "⊲", "LeftTriangleEqual": "⊴", "LeftUpDownVector": "⥑", "LeftUpTeeVector": "⥠", "LeftUpVectorBar": "⥘", "LeftUpVector": "↿", "LeftVectorBar": "⥒", "LeftVector": "↼", "lEg": "⪋", "leg": "⋚", "leq": "≤", "leqq": "≦", "leqslant": "⩽", "lescc": "⪨", "les": "⩽", "lesdot": "⩿", "lesdoto": "⪁", "lesdotor": "⪃", "lesg": "⋚︀", "lesges": "⪓", "lessapprox": "⪅", "lessdot": "⋖", "lesseqgtr": "⋚", "lesseqqgtr": "⪋", "LessEqualGreater": "⋚", "LessFullEqual": "≦", "LessGreater": "≶", "lessgtr": "≶", "LessLess": "⪡", "lesssim": "≲", "LessSlantEqual": "⩽", "LessTilde": "≲", "lfisht": "⥼", "lfloor": "⌊", "Lfr": "𝔏", "lfr": "𝔩", "lg": "≶", "lgE": "⪑", "lHar": "⥢", "lhard": "↽", "lharu": "↼", "lharul": "⥪", "lhblk": "▄", "LJcy": "Љ", "ljcy": "љ", "llarr": "⇇", "ll": "≪", "Ll": "⋘", "llcorner": "⌞", "Lleftarrow": "⇚", "llhard": "⥫", "lltri": "◺", "Lmidot": "Ŀ", "lmidot": "ŀ", "lmoustache": "⎰", "lmoust": "⎰", "lnap": "⪉", "lnapprox": "⪉", "lne": "⪇", "lnE": "≨", "lneq": "⪇", "lneqq": "≨", "lnsim": "⋦", "loang": "⟬", "loarr": "⇽", "lobrk": "⟦", "longleftarrow": "⟵", "LongLeftArrow": "⟵", "Longleftarrow": "⟸", "longleftrightarrow": "⟷", "LongLeftRightArrow": "⟷", "Longleftrightarrow": "⟺", "longmapsto": "⟼", "longrightarrow": "⟶", "LongRightArrow": "⟶", "Longrightarrow": "⟹", "looparrowleft": "↫", "looparrowright": "↬", "lopar": "⦅", "Lopf": "𝕃", "lopf": "𝕝", "loplus": "⨭", "lotimes": "⨴", "lowast": "∗", "lowbar": "_", "LowerLeftArrow": "↙", "LowerRightArrow": "↘", "loz": "◊", "lozenge": "◊", "lozf": "⧫", "lpar": "(", "lparlt": "⦓", "lrarr": "⇆", "lrcorner": "⌟", "lrhar": "⇋", "lrhard": "⥭", "lrm": "‎", "lrtri": "⊿", "lsaquo": "‹", "lscr": "𝓁", "Lscr": "ℒ", "lsh": "↰", "Lsh": "↰", "lsim": "≲", "lsime": "⪍", "lsimg": "⪏", "lsqb": "[", "lsquo": "‘", "lsquor": "‚", "Lstrok": "Ł", "lstrok": "ł", "ltcc": "⪦", "ltcir": "⩹", "lt": "<", "LT": "<", "Lt": "≪", "ltdot": "⋖", "lthree": "⋋", "ltimes": "⋉", "ltlarr": "⥶", "ltquest": "⩻", "ltri": "◃", "ltrie": "⊴", "ltrif": "◂", "ltrPar": "⦖", "lurdshar": "⥊", "luruhar": "⥦", "lvertneqq": "≨︀", "lvnE": "≨︀", "macr": "¯", "male": "♂", "malt": "✠", "maltese": "✠", "Map": "⤅", "map": "↦", "mapsto": "↦", "mapstodown": "↧", "mapstoleft": "↤", "mapstoup": "↥", "marker": "▮", "mcomma": "⨩", "Mcy": "М", "mcy": "м", "mdash": "—", "mDDot": "∺", "measuredangle": "∡", "MediumSpace": " ", "Mellintrf": "ℳ", "Mfr": "𝔐", "mfr": "𝔪", "mho": "℧", "micro": "µ", "midast": "*", "midcir": "⫰", "mid": "∣", "middot": "·", "minusb": "⊟", "minus": "−", "minusd": "∸", "minusdu": "⨪", "MinusPlus": "∓", "mlcp": "⫛", "mldr": "…", "mnplus": "∓", "models": "⊧", "Mopf": "𝕄", "mopf": "𝕞", "mp": "∓", "mscr": "𝓂", "Mscr": "ℳ", "mstpos": "∾", "Mu": "Μ", "mu": "μ", "multimap": "⊸", "mumap": "⊸", "nabla": "∇", "Nacute": "Ń", "nacute": "ń", "nang": "∠⃒", "nap": "≉", "napE": "⩰̸", "napid": "≋̸", "napos": "ŉ", "napprox": "≉", "natural": "♮", "naturals": "ℕ", "natur": "♮", "nbsp": " ", "nbump": "≎̸", "nbumpe": "≏̸", "ncap": "⩃", "Ncaron": "Ň", "ncaron": "ň", "Ncedil": "Ņ", "ncedil": "ņ", "ncong": "≇", "ncongdot": "⩭̸", "ncup": "⩂", "Ncy": "Н", "ncy": "н", "ndash": "–", "nearhk": "⤤", "nearr": "↗", "neArr": "⇗", "nearrow": "↗", "ne": "≠", "nedot": "≐̸", "NegativeMediumSpace": "​", "NegativeThickSpace": "​", "NegativeThinSpace": "​", "NegativeVeryThinSpace": "​", "nequiv": "≢", "nesear": "⤨", "nesim": "≂̸", "NestedGreaterGreater": "≫", "NestedLessLess": "≪", "NewLine": "\n", "nexist": "∄", "nexists": "∄", "Nfr": "𝔑", "nfr": "𝔫", "ngE": "≧̸", "nge": "≱", "ngeq": "≱", "ngeqq": "≧̸", "ngeqslant": "⩾̸", "nges": "⩾̸", "nGg": "⋙̸", "ngsim": "≵", "nGt": "≫⃒", "ngt": "≯", "ngtr": "≯", "nGtv": "≫̸", "nharr": "↮", "nhArr": "⇎", "nhpar": "⫲", "ni": "∋", "nis": "⋼", "nisd": "⋺", "niv": "∋", "NJcy": "Њ", "njcy": "њ", "nlarr": "↚", "nlArr": "⇍", "nldr": "‥", "nlE": "≦̸", "nle": "≰", "nleftarrow": "↚", "nLeftarrow": "⇍", "nleftrightarrow": "↮", "nLeftrightarrow": "⇎", "nleq": "≰", "nleqq": "≦̸", "nleqslant": "⩽̸", "nles": "⩽̸", "nless": "≮", "nLl": "⋘̸", "nlsim": "≴", "nLt": "≪⃒", "nlt": "≮", "nltri": "⋪", "nltrie": "⋬", "nLtv": "≪̸", "nmid": "∤", "NoBreak": "⁠", "NonBreakingSpace": " ", "nopf": "𝕟", "Nopf": "ℕ", "Not": "⫬", "not": "¬", "NotCongruent": "≢", "NotCupCap": "≭", "NotDoubleVerticalBar": "∦", "NotElement": "∉", "NotEqual": "≠", "NotEqualTilde": "≂̸", "NotExists": "∄", "NotGreater": "≯", "NotGreaterEqual": "≱", "NotGreaterFullEqual": "≧̸", "NotGreaterGreater": "≫̸", "NotGreaterLess": "≹", "NotGreaterSlantEqual": "⩾̸", "NotGreaterTilde": "≵", "NotHumpDownHump": "≎̸", "NotHumpEqual": "≏̸", "notin": "∉", "notindot": "⋵̸", "notinE": "⋹̸", "notinva": "∉", "notinvb": "⋷", "notinvc": "⋶", "NotLeftTriangleBar": "⧏̸", "NotLeftTriangle": "⋪", "NotLeftTriangleEqual": "⋬", "NotLess": "≮", "NotLessEqual": "≰", "NotLessGreater": "≸", "NotLessLess": "≪̸", "NotLessSlantEqual": "⩽̸", "NotLessTilde": "≴", "NotNestedGreaterGreater": "⪢̸", "NotNestedLessLess": "⪡̸", "notni": "∌", "notniva": "∌", "notnivb": "⋾", "notnivc": "⋽", "NotPrecedes": "⊀", "NotPrecedesEqual": "⪯̸", "NotPrecedesSlantEqual": "⋠", "NotReverseElement": "∌", "NotRightTriangleBar": "⧐̸", "NotRightTriangle": "⋫", "NotRightTriangleEqual": "⋭", "NotSquareSubset": "⊏̸", "NotSquareSubsetEqual": "⋢", "NotSquareSuperset": "⊐̸", "NotSquareSupersetEqual": "⋣", "NotSubset": "⊂⃒", "NotSubsetEqual": "⊈", "NotSucceeds": "⊁", "NotSucceedsEqual": "⪰̸", "NotSucceedsSlantEqual": "⋡", "NotSucceedsTilde": "≿̸", "NotSuperset": "⊃⃒", "NotSupersetEqual": "⊉", "NotTilde": "≁", "NotTildeEqual": "≄", "NotTildeFullEqual": "≇", "NotTildeTilde": "≉", "NotVerticalBar": "∤", "nparallel": "∦", "npar": "∦", "nparsl": "⫽⃥", "npart": "∂̸", "npolint": "⨔", "npr": "⊀", "nprcue": "⋠", "nprec": "⊀", "npreceq": "⪯̸", "npre": "⪯̸", "nrarrc": "⤳̸", "nrarr": "↛", "nrArr": "⇏", "nrarrw": "↝̸", "nrightarrow": "↛", "nRightarrow": "⇏", "nrtri": "⋫", "nrtrie": "⋭", "nsc": "⊁", "nsccue": "⋡", "nsce": "⪰̸", "Nscr": "𝒩", "nscr": "𝓃", "nshortmid": "∤", "nshortparallel": "∦", "nsim": "≁", "nsime": "≄", "nsimeq": "≄", "nsmid": "∤", "nspar": "∦", "nsqsube": "⋢", "nsqsupe": "⋣", "nsub": "⊄", "nsubE": "⫅̸", "nsube": "⊈", "nsubset": "⊂⃒", "nsubseteq": "⊈", "nsubseteqq": "⫅̸", "nsucc": "⊁", "nsucceq": "⪰̸", "nsup": "⊅", "nsupE": "⫆̸", "nsupe": "⊉", "nsupset": "⊃⃒", "nsupseteq": "⊉", "nsupseteqq": "⫆̸", "ntgl": "≹", "Ntilde": "Ñ", "ntilde": "ñ", "ntlg": "≸", "ntriangleleft": "⋪", "ntrianglelefteq": "⋬", "ntriangleright": "⋫", "ntrianglerighteq": "⋭", "Nu": "Ν", "nu": "ν", "num": "#", "numero": "№", "numsp": " ", "nvap": "≍⃒", "nvdash": "⊬", "nvDash": "⊭", "nVdash": "⊮", "nVDash": "⊯", "nvge": "≥⃒", "nvgt": ">⃒", "nvHarr": "⤄", "nvinfin": "⧞", "nvlArr": "⤂", "nvle": "≤⃒", "nvlt": "<⃒", "nvltrie": "⊴⃒", "nvrArr": "⤃", "nvrtrie": "⊵⃒", "nvsim": "∼⃒", "nwarhk": "⤣", "nwarr": "↖", "nwArr": "⇖", "nwarrow": "↖", "nwnear": "⤧", "Oacute": "Ó", "oacute": "ó", "oast": "⊛", "Ocirc": "Ô", "ocirc": "ô", "ocir": "⊚", "Ocy": "О", "ocy": "о", "odash": "⊝", "Odblac": "Ő", "odblac": "ő", "odiv": "⨸", "odot": "⊙", "odsold": "⦼", "OElig": "Œ", "oelig": "œ", "ofcir": "⦿", "Ofr": "𝔒", "ofr": "𝔬", "ogon": "˛", "Ograve": "Ò", "ograve": "ò", "ogt": "⧁", "ohbar": "⦵", "ohm": "Ω", "oint": "∮", "olarr": "↺", "olcir": "⦾", "olcross": "⦻", "oline": "‾", "olt": "⧀", "Omacr": "Ō", "omacr": "ō", "Omega": "Ω", "omega": "ω", "Omicron": "Ο", "omicron": "ο", "omid": "⦶", "ominus": "⊖", "Oopf": "𝕆", "oopf": "𝕠", "opar": "⦷", "OpenCurlyDoubleQuote": "“", "OpenCurlyQuote": "‘", "operp": "⦹", "oplus": "⊕", "orarr": "↻", "Or": "⩔", "or": "∨", "ord": "⩝", "order": "ℴ", "orderof": "ℴ", "ordf": "ª", "ordm": "º", "origof": "⊶", "oror": "⩖", "orslope": "⩗", "orv": "⩛", "oS": "Ⓢ", "Oscr": "𝒪", "oscr": "ℴ", "Oslash": "Ø", "oslash": "ø", "osol": "⊘", "Otilde": "Õ", "otilde": "õ", "otimesas": "⨶", "Otimes": "⨷", "otimes": "⊗", "Ouml": "Ö", "ouml": "ö", "ovbar": "⌽", "OverBar": "‾", "OverBrace": "⏞", "OverBracket": "⎴", "OverParenthesis": "⏜", "para": "¶", "parallel": "∥", "par": "∥", "parsim": "⫳", "parsl": "⫽", "part": "∂", "PartialD": "∂", "Pcy": "П", "pcy": "п", "percnt": "%", "period": ".", "permil": "‰", "perp": "⊥", "pertenk": "‱", "Pfr": "𝔓", "pfr": "𝔭", "Phi": "Φ", "phi": "φ", "phiv": "ϕ", "phmmat": "ℳ", "phone": "☎", "Pi": "Π", "pi": "π", "pitchfork": "⋔", "piv": "ϖ", "planck": "ℏ", "planckh": "ℎ", "plankv": "ℏ", "plusacir": "⨣", "plusb": "⊞", "pluscir": "⨢", "plus": "+", "plusdo": "∔", "plusdu": "⨥", "pluse": "⩲", "PlusMinus": "±", "plusmn": "±", "plussim": "⨦", "plustwo": "⨧", "pm": "±", "Poincareplane": "ℌ", "pointint": "⨕", "popf": "𝕡", "Popf": "ℙ", "pound": "£", "prap": "⪷", "Pr": "⪻", "pr": "≺", "prcue": "≼", "precapprox": "⪷", "prec": "≺", "preccurlyeq": "≼", "Precedes": "≺", "PrecedesEqual": "⪯", "PrecedesSlantEqual": "≼", "PrecedesTilde": "≾", "preceq": "⪯", "precnapprox": "⪹", "precneqq": "⪵", "precnsim": "⋨", "pre": "⪯", "prE": "⪳", "precsim": "≾", "prime": "′", "Prime": "″", "primes": "ℙ", "prnap": "⪹", "prnE": "⪵", "prnsim": "⋨", "prod": "∏", "Product": "∏", "profalar": "⌮", "profline": "⌒", "profsurf": "⌓", "prop": "∝", "Proportional": "∝", "Proportion": "∷", "propto": "∝", "prsim": "≾", "prurel": "⊰", "Pscr": "𝒫", "pscr": "𝓅", "Psi": "Ψ", "psi": "ψ", "puncsp": " ", "Qfr": "𝔔", "qfr": "𝔮", "qint": "⨌", "qopf": "𝕢", "Qopf": "ℚ", "qprime": "⁗", "Qscr": "𝒬", "qscr": "𝓆", "quaternions": "ℍ", "quatint": "⨖", "quest": "?", "questeq": "≟", "quot": "\"", "QUOT": "\"", "rAarr": "⇛", "race": "∽̱", "Racute": "Ŕ", "racute": "ŕ", "radic": "√", "raemptyv": "⦳", "rang": "⟩", "Rang": "⟫", "rangd": "⦒", "range": "⦥", "rangle": "⟩", "raquo": "»", "rarrap": "⥵", "rarrb": "⇥", "rarrbfs": "⤠", "rarrc": "⤳", "rarr": "→", "Rarr": "↠", "rArr": "⇒", "rarrfs": "⤞", "rarrhk": "↪", "rarrlp": "↬", "rarrpl": "⥅", "rarrsim": "⥴", "Rarrtl": "⤖", "rarrtl": "↣", "rarrw": "↝", "ratail": "⤚", "rAtail": "⤜", "ratio": "∶", "rationals": "ℚ", "rbarr": "⤍", "rBarr": "⤏", "RBarr": "⤐", "rbbrk": "❳", "rbrace": "}", "rbrack": "]", "rbrke": "⦌", "rbrksld": "⦎", "rbrkslu": "⦐", "Rcaron": "Ř", "rcaron": "ř", "Rcedil": "Ŗ", "rcedil": "ŗ", "rceil": "⌉", "rcub": "}", "Rcy": "Р", "rcy": "р", "rdca": "⤷", "rdldhar": "⥩", "rdquo": "”", "rdquor": "”", "rdsh": "↳", "real": "ℜ", "realine": "ℛ", "realpart": "ℜ", "reals": "ℝ", "Re": "ℜ", "rect": "▭", "reg": "®", "REG": "®", "ReverseElement": "∋", "ReverseEquilibrium": "⇋", "ReverseUpEquilibrium": "⥯", "rfisht": "⥽", "rfloor": "⌋", "rfr": "𝔯", "Rfr": "ℜ", "rHar": "⥤", "rhard": "⇁", "rharu": "⇀", "rharul": "⥬", "Rho": "Ρ", "rho": "ρ", "rhov": "ϱ", "RightAngleBracket": "⟩", "RightArrowBar": "⇥", "rightarrow": "→", "RightArrow": "→", "Rightarrow": "⇒", "RightArrowLeftArrow": "⇄", "rightarrowtail": "↣", "RightCeiling": "⌉", "RightDoubleBracket": "⟧", "RightDownTeeVector": "⥝", "RightDownVectorBar": "⥕", "RightDownVector": "⇂", "RightFloor": "⌋", "rightharpoondown": "⇁", "rightharpoonup": "⇀", "rightleftarrows": "⇄", "rightleftharpoons": "⇌", "rightrightarrows": "⇉", "rightsquigarrow": "↝", "RightTeeArrow": "↦", "RightTee": "⊢", "RightTeeVector": "⥛", "rightthreetimes": "⋌", "RightTriangleBar": "⧐", "RightTriangle": "⊳", "RightTriangleEqual": "⊵", "RightUpDownVector": "⥏", "RightUpTeeVector": "⥜", "RightUpVectorBar": "⥔", "RightUpVector": "↾", "RightVectorBar": "⥓", "RightVector": "⇀", "ring": "˚", "risingdotseq": "≓", "rlarr": "⇄", "rlhar": "⇌", "rlm": "‏", "rmoustache": "⎱", "rmoust": "⎱", "rnmid": "⫮", "roang": "⟭", "roarr": "⇾", "robrk": "⟧", "ropar": "⦆", "ropf": "𝕣", "Ropf": "ℝ", "roplus": "⨮", "rotimes": "⨵", "RoundImplies": "⥰", "rpar": ")", "rpargt": "⦔", "rppolint": "⨒", "rrarr": "⇉", "Rrightarrow": "⇛", "rsaquo": "›", "rscr": "𝓇", "Rscr": "ℛ", "rsh": "↱", "Rsh": "↱", "rsqb": "]", "rsquo": "’", "rsquor": "’", "rthree": "⋌", "rtimes": "⋊", "rtri": "▹", "rtrie": "⊵", "rtrif": "▸", "rtriltri": "⧎", "RuleDelayed": "⧴", "ruluhar": "⥨", "rx": "℞", "Sacute": "Ś", "sacute": "ś", "sbquo": "‚", "scap": "⪸", "Scaron": "Š", "scaron": "š", "Sc": "⪼", "sc": "≻", "sccue": "≽", "sce": "⪰", "scE": "⪴", "Scedil": "Ş", "scedil": "ş", "Scirc": "Ŝ", "scirc": "ŝ", "scnap": "⪺", "scnE": "⪶", "scnsim": "⋩", "scpolint": "⨓", "scsim": "≿", "Scy": "С", "scy": "с", "sdotb": "⊡", "sdot": "⋅", "sdote": "⩦", "searhk": "⤥", "searr": "↘", "seArr": "⇘", "searrow": "↘", "sect": "§", "semi": ";", "seswar": "⤩", "setminus": "∖", "setmn": "∖", "sext": "✶", "Sfr": "𝔖", "sfr": "𝔰", "sfrown": "⌢", "sharp": "♯", "SHCHcy": "Щ", "shchcy": "щ", "SHcy": "Ш", "shcy": "ш", "ShortDownArrow": "↓", "ShortLeftArrow": "←", "shortmid": "∣", "shortparallel": "∥", "ShortRightArrow": "→", "ShortUpArrow": "↑", "shy": "­", "Sigma": "Σ", "sigma": "σ", "sigmaf": "ς", "sigmav": "ς", "sim": "∼", "simdot": "⩪", "sime": "≃", "simeq": "≃", "simg": "⪞", "simgE": "⪠", "siml": "⪝", "simlE": "⪟", "simne": "≆", "simplus": "⨤", "simrarr": "⥲", "slarr": "←", "SmallCircle": "∘", "smallsetminus": "∖", "smashp": "⨳", "smeparsl": "⧤", "smid": "∣", "smile": "⌣", "smt": "⪪", "smte": "⪬", "smtes": "⪬︀", "SOFTcy": "Ь", "softcy": "ь", "solbar": "⌿", "solb": "⧄", "sol": "/", "Sopf": "𝕊", "sopf": "𝕤", "spades": "♠", "spadesuit": "♠", "spar": "∥", "sqcap": "⊓", "sqcaps": "⊓︀", "sqcup": "⊔", "sqcups": "⊔︀", "Sqrt": "√", "sqsub": "⊏", "sqsube": "⊑", "sqsubset": "⊏", "sqsubseteq": "⊑", "sqsup": "⊐", "sqsupe": "⊒", "sqsupset": "⊐", "sqsupseteq": "⊒", "square": "□", "Square": "□", "SquareIntersection": "⊓", "SquareSubset": "⊏", "SquareSubsetEqual": "⊑", "SquareSuperset": "⊐", "SquareSupersetEqual": "⊒", "SquareUnion": "⊔", "squarf": "▪", "squ": "□", "squf": "▪", "srarr": "→", "Sscr": "𝒮", "sscr": "𝓈", "ssetmn": "∖", "ssmile": "⌣", "sstarf": "⋆", "Star": "⋆", "star": "☆", "starf": "★", "straightepsilon": "ϵ", "straightphi": "ϕ", "strns": "¯", "sub": "⊂", "Sub": "⋐", "subdot": "⪽", "subE": "⫅", "sube": "⊆", "subedot": "⫃", "submult": "⫁", "subnE": "⫋", "subne": "⊊", "subplus": "⪿", "subrarr": "⥹", "subset": "⊂", "Subset": "⋐", "subseteq": "⊆", "subseteqq": "⫅", "SubsetEqual": "⊆", "subsetneq": "⊊", "subsetneqq": "⫋", "subsim": "⫇", "subsub": "⫕", "subsup": "⫓", "succapprox": "⪸", "succ": "≻", "succcurlyeq": "≽", "Succeeds": "≻", "SucceedsEqual": "⪰", "SucceedsSlantEqual": "≽", "SucceedsTilde": "≿", "succeq": "⪰", "succnapprox": "⪺", "succneqq": "⪶", "succnsim": "⋩", "succsim": "≿", "SuchThat": "∋", "sum": "∑", "Sum": "∑", "sung": "♪", "sup1": "¹", "sup2": "²", "sup3": "³", "sup": "⊃", "Sup": "⋑", "supdot": "⪾", "supdsub": "⫘", "supE": "⫆", "supe": "⊇", "supedot": "⫄", "Superset": "⊃", "SupersetEqual": "⊇", "suphsol": "⟉", "suphsub": "⫗", "suplarr": "⥻", "supmult": "⫂", "supnE": "⫌", "supne": "⊋", "supplus": "⫀", "supset": "⊃", "Supset": "⋑", "supseteq": "⊇", "supseteqq": "⫆", "supsetneq": "⊋", "supsetneqq": "⫌", "supsim": "⫈", "supsub": "⫔", "supsup": "⫖", "swarhk": "⤦", "swarr": "↙", "swArr": "⇙", "swarrow": "↙", "swnwar": "⤪", "szlig": "ß", "Tab": "\t", "target": "⌖", "Tau": "Τ", "tau": "τ", "tbrk": "⎴", "Tcaron": "Ť", "tcaron": "ť", "Tcedil": "Ţ", "tcedil": "ţ", "Tcy": "Т", "tcy": "т", "tdot": "⃛", "telrec": "⌕", "Tfr": "𝔗", "tfr": "𝔱", "there4": "∴", "therefore": "∴", "Therefore": "∴", "Theta": "Θ", "theta": "θ", "thetasym": "ϑ", "thetav": "ϑ", "thickapprox": "≈", "thicksim": "∼", "ThickSpace": "  ", "ThinSpace": " ", "thinsp": " ", "thkap": "≈", "thksim": "∼", "THORN": "Þ", "thorn": "þ", "tilde": "˜", "Tilde": "∼", "TildeEqual": "≃", "TildeFullEqual": "≅", "TildeTilde": "≈", "timesbar": "⨱", "timesb": "⊠", "times": "×", "timesd": "⨰", "tint": "∭", "toea": "⤨", "topbot": "⌶", "topcir": "⫱", "top": "⊤", "Topf": "𝕋", "topf": "𝕥", "topfork": "⫚", "tosa": "⤩", "tprime": "‴", "trade": "™", "TRADE": "™", "triangle": "▵", "triangledown": "▿", "triangleleft": "◃", "trianglelefteq": "⊴", "triangleq": "≜", "triangleright": "▹", "trianglerighteq": "⊵", "tridot": "◬", "trie": "≜", "triminus": "⨺", "TripleDot": "⃛", "triplus": "⨹", "trisb": "⧍", "tritime": "⨻", "trpezium": "⏢", "Tscr": "𝒯", "tscr": "𝓉", "TScy": "Ц", "tscy": "ц", "TSHcy": "Ћ", "tshcy": "ћ", "Tstrok": "Ŧ", "tstrok": "ŧ", "twixt": "≬", "twoheadleftarrow": "↞", "twoheadrightarrow": "↠", "Uacute": "Ú", "uacute": "ú", "uarr": "↑", "Uarr": "↟", "uArr": "⇑", "Uarrocir": "⥉", "Ubrcy": "Ў", "ubrcy": "ў", "Ubreve": "Ŭ", "ubreve": "ŭ", "Ucirc": "Û", "ucirc": "û", "Ucy": "У", "ucy": "у", "udarr": "⇅", "Udblac": "Ű", "udblac": "ű", "udhar": "⥮", "ufisht": "⥾", "Ufr": "𝔘", "ufr": "𝔲", "Ugrave": "Ù", "ugrave": "ù", "uHar": "⥣", "uharl": "↿", "uharr": "↾", "uhblk": "▀", "ulcorn": "⌜", "ulcorner": "⌜", "ulcrop": "⌏", "ultri": "◸", "Umacr": "Ū", "umacr": "ū", "uml": "¨", "UnderBar": "_", "UnderBrace": "⏟", "UnderBracket": "⎵", "UnderParenthesis": "⏝", "Union": "⋃", "UnionPlus": "⊎", "Uogon": "Ų", "uogon": "ų", "Uopf": "𝕌", "uopf": "𝕦", "UpArrowBar": "⤒", "uparrow": "↑", "UpArrow": "↑", "Uparrow": "⇑", "UpArrowDownArrow": "⇅", "updownarrow": "↕", "UpDownArrow": "↕", "Updownarrow": "⇕", "UpEquilibrium": "⥮", "upharpoonleft": "↿", "upharpoonright": "↾", "uplus": "⊎", "UpperLeftArrow": "↖", "UpperRightArrow": "↗", "upsi": "υ", "Upsi": "ϒ", "upsih": "ϒ", "Upsilon": "Υ", "upsilon": "υ", "UpTeeArrow": "↥", "UpTee": "⊥", "upuparrows": "⇈", "urcorn": "⌝", "urcorner": "⌝", "urcrop": "⌎", "Uring": "Ů", "uring": "ů", "urtri": "◹", "Uscr": "𝒰", "uscr": "𝓊", "utdot": "⋰", "Utilde": "Ũ", "utilde": "ũ", "utri": "▵", "utrif": "▴", "uuarr": "⇈", "Uuml": "Ü", "uuml": "ü", "uwangle": "⦧", "vangrt": "⦜", "varepsilon": "ϵ", "varkappa": "ϰ", "varnothing": "∅", "varphi": "ϕ", "varpi": "ϖ", "varpropto": "∝", "varr": "↕", "vArr": "⇕", "varrho": "ϱ", "varsigma": "ς", "varsubsetneq": "⊊︀", "varsubsetneqq": "⫋︀", "varsupsetneq": "⊋︀", "varsupsetneqq": "⫌︀", "vartheta": "ϑ", "vartriangleleft": "⊲", "vartriangleright": "⊳", "vBar": "⫨", "Vbar": "⫫", "vBarv": "⫩", "Vcy": "В", "vcy": "в", "vdash": "⊢", "vDash": "⊨", "Vdash": "⊩", "VDash": "⊫", "Vdashl": "⫦", "veebar": "⊻", "vee": "∨", "Vee": "⋁", "veeeq": "≚", "vellip": "⋮", "verbar": "|", "Verbar": "‖", "vert": "|", "Vert": "‖", "VerticalBar": "∣", "VerticalLine": "|", "VerticalSeparator": "❘", "VerticalTilde": "≀", "VeryThinSpace": " ", "Vfr": "𝔙", "vfr": "𝔳", "vltri": "⊲", "vnsub": "⊂⃒", "vnsup": "⊃⃒", "Vopf": "𝕍", "vopf": "𝕧", "vprop": "∝", "vrtri": "⊳", "Vscr": "𝒱", "vscr": "𝓋", "vsubnE": "⫋︀", "vsubne": "⊊︀", "vsupnE": "⫌︀", "vsupne": "⊋︀", "Vvdash": "⊪", "vzigzag": "⦚", "Wcirc": "Ŵ", "wcirc": "ŵ", "wedbar": "⩟", "wedge": "∧", "Wedge": "⋀", "wedgeq": "≙", "weierp": "℘", "Wfr": "𝔚", "wfr": "𝔴", "Wopf": "𝕎", "wopf": "𝕨", "wp": "℘", "wr": "≀", "wreath": "≀", "Wscr": "𝒲", "wscr": "𝓌", "xcap": "⋂", "xcirc": "◯", "xcup": "⋃", "xdtri": "▽", "Xfr": "𝔛", "xfr": "𝔵", "xharr": "⟷", "xhArr": "⟺", "Xi": "Ξ", "xi": "ξ", "xlarr": "⟵", "xlArr": "⟸", "xmap": "⟼", "xnis": "⋻", "xodot": "⨀", "Xopf": "𝕏", "xopf": "𝕩", "xoplus": "⨁", "xotime": "⨂", "xrarr": "⟶", "xrArr": "⟹", "Xscr": "𝒳", "xscr": "𝓍", "xsqcup": "⨆", "xuplus": "⨄", "xutri": "△", "xvee": "⋁", "xwedge": "⋀", "Yacute": "Ý", "yacute": "ý", "YAcy": "Я", "yacy": "я", "Ycirc": "Ŷ", "ycirc": "ŷ", "Ycy": "Ы", "ycy": "ы", "yen": "¥", "Yfr": "𝔜", "yfr": "𝔶", "YIcy": "Ї", "yicy": "ї", "Yopf": "𝕐", "yopf": "𝕪", "Yscr": "𝒴", "yscr": "𝓎", "YUcy": "Ю", "yucy": "ю", "yuml": "ÿ", "Yuml": "Ÿ", "Zacute": "Ź", "zacute": "ź", "Zcaron": "Ž", "zcaron": "ž", "Zcy": "З", "zcy": "з", "Zdot": "Ż", "zdot": "ż", "zeetrf": "ℨ", "ZeroWidthSpace": "​", "Zeta": "Ζ", "zeta": "ζ", "zfr": "𝔷", "Zfr": "ℨ", "ZHcy": "Ж", "zhcy": "ж", "zigrarr": "⇝", "zopf": "𝕫", "Zopf": "ℤ", "Zscr": "𝒵", "zscr": "𝓏", "zwj": "‍", "zwnj": "‌" }

    }, {}],
    43: [function(require, module, exports) {
        module.exports = { "Aacute": "Á", "aacute": "á", "Acirc": "Â", "acirc": "â", "acute": "´", "AElig": "Æ", "aelig": "æ", "Agrave": "À", "agrave": "à", "amp": "&", "AMP": "&", "Aring": "Å", "aring": "å", "Atilde": "Ã", "atilde": "ã", "Auml": "Ä", "auml": "ä", "brvbar": "¦", "Ccedil": "Ç", "ccedil": "ç", "cedil": "¸", "cent": "¢", "copy": "©", "COPY": "©", "curren": "¤", "deg": "°", "divide": "÷", "Eacute": "É", "eacute": "é", "Ecirc": "Ê", "ecirc": "ê", "Egrave": "È", "egrave": "è", "ETH": "Ð", "eth": "ð", "Euml": "Ë", "euml": "ë", "frac12": "½", "frac14": "¼", "frac34": "¾", "gt": ">", "GT": ">", "Iacute": "Í", "iacute": "í", "Icirc": "Î", "icirc": "î", "iexcl": "¡", "Igrave": "Ì", "igrave": "ì", "iquest": "¿", "Iuml": "Ï", "iuml": "ï", "laquo": "«", "lt": "<", "LT": "<", "macr": "¯", "micro": "µ", "middot": "·", "nbsp": " ", "not": "¬", "Ntilde": "Ñ", "ntilde": "ñ", "Oacute": "Ó", "oacute": "ó", "Ocirc": "Ô", "ocirc": "ô", "Ograve": "Ò", "ograve": "ò", "ordf": "ª", "ordm": "º", "Oslash": "Ø", "oslash": "ø", "Otilde": "Õ", "otilde": "õ", "Ouml": "Ö", "ouml": "ö", "para": "¶", "plusmn": "±", "pound": "£", "quot": "\"", "QUOT": "\"", "raquo": "»", "reg": "®", "REG": "®", "sect": "§", "shy": "­", "sup1": "¹", "sup2": "²", "sup3": "³", "szlig": "ß", "THORN": "Þ", "thorn": "þ", "times": "×", "Uacute": "Ú", "uacute": "ú", "Ucirc": "Û", "ucirc": "û", "Ugrave": "Ù", "ugrave": "ù", "uml": "¨", "Uuml": "Ü", "uuml": "ü", "Yacute": "Ý", "yacute": "ý", "yen": "¥", "yuml": "ÿ" }

    }, {}],
    44: [function(require, module, exports) {
        module.exports = { "amp": "&", "apos": "'", "gt": ">", "lt": "<", "quot": "\"" }

    }, {}],
    45: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || (function() {
            var extendStatics = function(d, b) {
                extendStatics = Object.setPrototypeOf ||
                    ({ __proto__: [] }
                        instanceof Array && function(d, b) { d.__proto__ = b; }) ||
                    function(d, b) {
                        for (var p in b)
                            if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
                    };
                return extendStatics(d, b);
            };
            return function(d, b) {
                if (typeof b !== "function" && b !== null)
                    throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
                extendStatics(d, b);

                function __() { this.constructor = d; }
                d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
            };
        })();
        var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
            if (k2 === undefined) k2 = k;
            Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
        }) : (function(o, m, k, k2) {
            if (k2 === undefined) k2 = k;
            o[k2] = m[k];
        }));
        var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
            Object.defineProperty(o, "default", { enumerable: true, value: v });
        }) : function(o, v) {
            o["default"] = v;
        });
        var __importStar = (this && this.__importStar) || function(mod) {
            if (mod && mod.__esModule) return mod;
            var result = {};
            if (mod != null)
                for (var k in mod)
                    if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
            __setModuleDefault(result, mod);
            return result;
        };
        var __importDefault = (this && this.__importDefault) || function(mod) {
            return (mod && mod.__esModule) ? mod : { "default": mod };
        };
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.parseFeed = exports.FeedHandler = void 0;
        var domhandler_1 = __importDefault(require("domhandler"));
        var DomUtils = __importStar(require("domutils"));
        var Parser_1 = require("./Parser");
        var FeedItemMediaMedium;
        (function(FeedItemMediaMedium) {
            FeedItemMediaMedium[FeedItemMediaMedium["image"] = 0] = "image";
            FeedItemMediaMedium[FeedItemMediaMedium["audio"] = 1] = "audio";
            FeedItemMediaMedium[FeedItemMediaMedium["video"] = 2] = "video";
            FeedItemMediaMedium[FeedItemMediaMedium["document"] = 3] = "document";
            FeedItemMediaMedium[FeedItemMediaMedium["executable"] = 4] = "executable";
        })(FeedItemMediaMedium || (FeedItemMediaMedium = {}));
        var FeedItemMediaExpression;
        (function(FeedItemMediaExpression) {
            FeedItemMediaExpression[FeedItemMediaExpression["sample"] = 0] = "sample";
            FeedItemMediaExpression[FeedItemMediaExpression["full"] = 1] = "full";
            FeedItemMediaExpression[FeedItemMediaExpression["nonstop"] = 2] = "nonstop";
        })(FeedItemMediaExpression || (FeedItemMediaExpression = {}));
        // TODO: Consume data as it is coming in
        var FeedHandler = /** @class */ (function(_super) {
            __extends(FeedHandler, _super);
            /**
             *
             * @param callback
             * @param options
             */
            function FeedHandler(callback, options) {
                var _this = this;
                if (typeof callback === "object") {
                    callback = undefined;
                    options = callback;
                }
                _this = _super.call(this, callback, options) || this;
                return _this;
            }
            FeedHandler.prototype.onend = function() {
                var _a, _b;
                var feedRoot = getOneElement(isValidFeed, this.dom);
                if (!feedRoot) {
                    this.handleCallback(new Error("couldn't find root of feed"));
                    return;
                }
                var feed = {};
                if (feedRoot.name === "feed") {
                    var childs = feedRoot.children;
                    feed.type = "atom";
                    addConditionally(feed, "id", "id", childs);
                    addConditionally(feed, "title", "title", childs);
                    var href = getAttribute("href", getOneElement("link", childs));
                    if (href) {
                        feed.link = href;
                    }
                    addConditionally(feed, "description", "subtitle", childs);
                    var updated = fetch("updated", childs);
                    if (updated) {
                        feed.updated = new Date(updated);
                    }
                    addConditionally(feed, "author", "email", childs, true);
                    feed.items = getElements("entry", childs).map(function(item) {
                        var entry = {};
                        var children = item.children;
                        addConditionally(entry, "id", "id", children);
                        addConditionally(entry, "title", "title", children);
                        var href = getAttribute("href", getOneElement("link", children));
                        if (href) {
                            entry.link = href;
                        }
                        var description = fetch("summary", children) || fetch("content", children);
                        if (description) {
                            entry.description = description;
                        }
                        var pubDate = fetch("updated", children);
                        if (pubDate) {
                            entry.pubDate = new Date(pubDate);
                        }
                        entry.media = getMediaElements(children);
                        return entry;
                    });
                } else {
                    var childs = (_b = (_a = getOneElement("channel", feedRoot.children)) === null || _a === void 0 ? void 0 : _a.children) !== null && _b !== void 0 ? _b : [];
                    feed.type = feedRoot.name.substr(0, 3);
                    feed.id = "";
                    addConditionally(feed, "title", "title", childs);
                    addConditionally(feed, "link", "link", childs);
                    addConditionally(feed, "description", "description", childs);
                    var updated = fetch("lastBuildDate", childs);
                    if (updated) {
                        feed.updated = new Date(updated);
                    }
                    addConditionally(feed, "author", "managingEditor", childs, true);
                    feed.items = getElements("item", feedRoot.children).map(function(item) {
                        var entry = {};
                        var children = item.children;
                        addConditionally(entry, "id", "guid", children);
                        addConditionally(entry, "title", "title", children);
                        addConditionally(entry, "link", "link", children);
                        addConditionally(entry, "description", "description", children);
                        var pubDate = fetch("pubDate", children);
                        if (pubDate)
                            entry.pubDate = new Date(pubDate);
                        entry.media = getMediaElements(children);
                        return entry;
                    });
                }
                this.feed = feed;
                this.handleCallback(null);
            };
            return FeedHandler;
        }(domhandler_1.default));
        exports.FeedHandler = FeedHandler;

        function getMediaElements(where) {
            return getElements("media:content", where).map(function(elem) {
                var media = {
                    medium: elem.attribs.medium,
                    isDefault: !!elem.attribs.isDefault,
                };
                if (elem.attribs.url) {
                    media.url = elem.attribs.url;
                }
                if (elem.attribs.fileSize) {
                    media.fileSize = parseInt(elem.attribs.fileSize, 10);
                }
                if (elem.attribs.type) {
                    media.type = elem.attribs.type;
                }
                if (elem.attribs.expression) {
                    media.expression = elem.attribs
                        .expression;
                }
                if (elem.attribs.bitrate) {
                    media.bitrate = parseInt(elem.attribs.bitrate, 10);
                }
                if (elem.attribs.framerate) {
                    media.framerate = parseInt(elem.attribs.framerate, 10);
                }
                if (elem.attribs.samplingrate) {
                    media.samplingrate = parseInt(elem.attribs.samplingrate, 10);
                }
                if (elem.attribs.channels) {
                    media.channels = parseInt(elem.attribs.channels, 10);
                }
                if (elem.attribs.duration) {
                    media.duration = parseInt(elem.attribs.duration, 10);
                }
                if (elem.attribs.height) {
                    media.height = parseInt(elem.attribs.height, 10);
                }
                if (elem.attribs.width) {
                    media.width = parseInt(elem.attribs.width, 10);
                }
                if (elem.attribs.lang) {
                    media.lang = elem.attribs.lang;
                }
                return media;
            });
        }

        function getElements(tagName, where) {
            return DomUtils.getElementsByTagName(tagName, where, true);
        }

        function getOneElement(tagName, node) {
            return DomUtils.getElementsByTagName(tagName, node, true, 1)[0];
        }

        function fetch(tagName, where, recurse) {
            if (recurse === void 0) { recurse = false; }
            return DomUtils.getText(DomUtils.getElementsByTagName(tagName, where, recurse, 1)).trim();
        }

        function getAttribute(name, elem) {
            if (!elem) {
                return null;
            }
            var attribs = elem.attribs;
            return attribs[name];
        }

        function addConditionally(obj, prop, what, where, recurse) {
            if (recurse === void 0) { recurse = false; }
            var tmp = fetch(what, where, recurse);
            if (tmp)
                obj[prop] = tmp;
        }

        function isValidFeed(value) {
            return value === "rss" || value === "feed" || value === "rdf:RDF";
        }
        /**
         * Parse a feed.
         *
         * @param feed The feed that should be parsed, as a string.
         * @param options Optionally, options for parsing. When using this option, you should set `xmlMode` to `true`.
         */
        function parseFeed(feed, options) {
            if (options === void 0) { options = { xmlMode: true }; }
            var handler = new FeedHandler(options);
            new Parser_1.Parser(handler, options).end(feed);
            return handler.feed;
        }
        exports.parseFeed = parseFeed;

    }, { "./Parser": 46, "domhandler": 27, "domutils": 31 }],
    46: [function(require, module, exports) {
        "use strict";
        var __importDefault = (this && this.__importDefault) || function(mod) {
            return (mod && mod.__esModule) ? mod : { "default": mod };
        };
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.Parser = void 0;
        var Tokenizer_1 = __importDefault(require("./Tokenizer"));
        var formTags = new Set([
            "input",
            "option",
            "optgroup",
            "select",
            "button",
            "datalist",
            "textarea",
        ]);
        var pTag = new Set(["p"]);
        var openImpliesClose = {
            tr: new Set(["tr", "th", "td"]),
            th: new Set(["th"]),
            td: new Set(["thead", "th", "td"]),
            body: new Set(["head", "link", "script"]),
            li: new Set(["li"]),
            p: pTag,
            h1: pTag,
            h2: pTag,
            h3: pTag,
            h4: pTag,
            h5: pTag,
            h6: pTag,
            select: formTags,
            input: formTags,
            output: formTags,
            button: formTags,
            datalist: formTags,
            textarea: formTags,
            option: new Set(["option"]),
            optgroup: new Set(["optgroup", "option"]),
            dd: new Set(["dt", "dd"]),
            dt: new Set(["dt", "dd"]),
            address: pTag,
            article: pTag,
            aside: pTag,
            blockquote: pTag,
            details: pTag,
            div: pTag,
            dl: pTag,
            fieldset: pTag,
            figcaption: pTag,
            figure: pTag,
            footer: pTag,
            form: pTag,
            header: pTag,
            hr: pTag,
            main: pTag,
            nav: pTag,
            ol: pTag,
            pre: pTag,
            section: pTag,
            table: pTag,
            ul: pTag,
            rt: new Set(["rt", "rp"]),
            rp: new Set(["rt", "rp"]),
            tbody: new Set(["thead", "tbody"]),
            tfoot: new Set(["thead", "tbody"]),
        };
        var voidElements = new Set([
            "area",
            "base",
            "basefont",
            "br",
            "col",
            "command",
            "embed",
            "frame",
            "hr",
            "img",
            "input",
            "isindex",
            "keygen",
            "link",
            "meta",
            "param",
            "source",
            "track",
            "wbr",
        ]);
        var foreignContextElements = new Set(["math", "svg"]);
        var htmlIntegrationElements = new Set([
            "mi",
            "mo",
            "mn",
            "ms",
            "mtext",
            "annotation-xml",
            "foreignObject",
            "desc",
            "title",
        ]);
        var reNameEnd = /\s|\//;
        var Parser = /** @class */ (function() {
            function Parser(cbs, options) {
                if (options === void 0) { options = {}; }
                var _a, _b, _c, _d, _e;
                /** The start index of the last event. */
                this.startIndex = 0;
                /** The end index of the last event. */
                this.endIndex = null;
                this.tagname = "";
                this.attribname = "";
                this.attribvalue = "";
                this.attribs = null;
                this.stack = [];
                this.foreignContext = [];
                this.options = options;
                this.cbs = cbs !== null && cbs !== void 0 ? cbs : {};
                this.lowerCaseTagNames = (_a = options.lowerCaseTags) !== null && _a !== void 0 ? _a : !options.xmlMode;
                this.lowerCaseAttributeNames =
                    (_b = options.lowerCaseAttributeNames) !== null && _b !== void 0 ? _b : !options.xmlMode;
                this.tokenizer = new((_c = options.Tokenizer) !== null && _c !== void 0 ? _c : Tokenizer_1.default)(this.options, this);
                (_e = (_d = this.cbs).onparserinit) === null || _e === void 0 ? void 0 : _e.call(_d, this);
            }
            Parser.prototype.updatePosition = function(initialOffset) {
                if (this.endIndex === null) {
                    if (this.tokenizer.sectionStart <= initialOffset) {
                        this.startIndex = 0;
                    } else {
                        this.startIndex = this.tokenizer.sectionStart - initialOffset;
                    }
                } else {
                    this.startIndex = this.endIndex + 1;
                }
                this.endIndex = this.tokenizer.getAbsoluteIndex();
            };
            // Tokenizer event handlers
            Parser.prototype.ontext = function(data) {
                var _a, _b;
                this.updatePosition(1);
                this.endIndex--;
                (_b = (_a = this.cbs).ontext) === null || _b === void 0 ? void 0 : _b.call(_a, data);
            };
            Parser.prototype.onopentagname = function(name) {
                var _a, _b;
                if (this.lowerCaseTagNames) {
                    name = name.toLowerCase();
                }
                this.tagname = name;
                if (!this.options.xmlMode &&
                    Object.prototype.hasOwnProperty.call(openImpliesClose, name)) {
                    var el = void 0;
                    while (this.stack.length > 0 &&
                        openImpliesClose[name].has((el = this.stack[this.stack.length - 1]))) {
                        this.onclosetag(el);
                    }
                }
                if (this.options.xmlMode || !voidElements.has(name)) {
                    this.stack.push(name);
                    if (foreignContextElements.has(name)) {
                        this.foreignContext.push(true);
                    } else if (htmlIntegrationElements.has(name)) {
                        this.foreignContext.push(false);
                    }
                }
                (_b = (_a = this.cbs).onopentagname) === null || _b === void 0 ? void 0 : _b.call(_a, name);
                if (this.cbs.onopentag)
                    this.attribs = {};
            };
            Parser.prototype.onopentagend = function() {
                var _a, _b;
                this.updatePosition(1);
                if (this.attribs) {
                    (_b = (_a = this.cbs).onopentag) === null || _b === void 0 ? void 0 : _b.call(_a, this.tagname, this.attribs);
                    this.attribs = null;
                }
                if (!this.options.xmlMode &&
                    this.cbs.onclosetag &&
                    voidElements.has(this.tagname)) {
                    this.cbs.onclosetag(this.tagname);
                }
                this.tagname = "";
            };
            Parser.prototype.onclosetag = function(name) {
                this.updatePosition(1);
                if (this.lowerCaseTagNames) {
                    name = name.toLowerCase();
                }
                if (foreignContextElements.has(name) ||
                    htmlIntegrationElements.has(name)) {
                    this.foreignContext.pop();
                }
                if (this.stack.length &&
                    (this.options.xmlMode || !voidElements.has(name))) {
                    var pos = this.stack.lastIndexOf(name);
                    if (pos !== -1) {
                        if (this.cbs.onclosetag) {
                            pos = this.stack.length - pos;
                            while (pos--) {
                                // We know the stack has sufficient elements.
                                this.cbs.onclosetag(this.stack.pop());
                            }
                        } else
                            this.stack.length = pos;
                    } else if (name === "p" && !this.options.xmlMode) {
                        this.onopentagname(name);
                        this.closeCurrentTag();
                    }
                } else if (!this.options.xmlMode && (name === "br" || name === "p")) {
                    this.onopentagname(name);
                    this.closeCurrentTag();
                }
            };
            Parser.prototype.onselfclosingtag = function() {
                if (this.options.xmlMode ||
                    this.options.recognizeSelfClosing ||
                    this.foreignContext[this.foreignContext.length - 1]) {
                    this.closeCurrentTag();
                } else {
                    this.onopentagend();
                }
            };
            Parser.prototype.closeCurrentTag = function() {
                var _a, _b;
                var name = this.tagname;
                this.onopentagend();
                /*
                 * Self-closing tags will be on the top of the stack
                 * (cheaper check than in onclosetag)
                 */
                if (this.stack[this.stack.length - 1] === name) {
                    (_b = (_a = this.cbs).onclosetag) === null || _b === void 0 ? void 0 : _b.call(_a, name);
                    this.stack.pop();
                }
            };
            Parser.prototype.onattribname = function(name) {
                if (this.lowerCaseAttributeNames) {
                    name = name.toLowerCase();
                }
                this.attribname = name;
            };
            Parser.prototype.onattribdata = function(value) {
                this.attribvalue += value;
            };
            Parser.prototype.onattribend = function(quote) {
                var _a, _b;
                (_b = (_a = this.cbs).onattribute) === null || _b === void 0 ? void 0 : _b.call(_a, this.attribname, this.attribvalue, quote);
                if (this.attribs &&
                    !Object.prototype.hasOwnProperty.call(this.attribs, this.attribname)) {
                    this.attribs[this.attribname] = this.attribvalue;
                }
                this.attribname = "";
                this.attribvalue = "";
            };
            Parser.prototype.getInstructionName = function(value) {
                var idx = value.search(reNameEnd);
                var name = idx < 0 ? value : value.substr(0, idx);
                if (this.lowerCaseTagNames) {
                    name = name.toLowerCase();
                }
                return name;
            };
            Parser.prototype.ondeclaration = function(value) {
                if (this.cbs.onprocessinginstruction) {
                    var name_1 = this.getInstructionName(value);
                    this.cbs.onprocessinginstruction("!" + name_1, "!" + value);
                }
            };
            Parser.prototype.onprocessinginstruction = function(value) {
                if (this.cbs.onprocessinginstruction) {
                    var name_2 = this.getInstructionName(value);
                    this.cbs.onprocessinginstruction("?" + name_2, "?" + value);
                }
            };
            Parser.prototype.oncomment = function(value) {
                var _a, _b, _c, _d;
                this.updatePosition(4);
                (_b = (_a = this.cbs).oncomment) === null || _b === void 0 ? void 0 : _b.call(_a, value);
                (_d = (_c = this.cbs).oncommentend) === null || _d === void 0 ? void 0 : _d.call(_c);
            };
            Parser.prototype.oncdata = function(value) {
                var _a, _b, _c, _d, _e, _f;
                this.updatePosition(1);
                if (this.options.xmlMode || this.options.recognizeCDATA) {
                    (_b = (_a = this.cbs).oncdatastart) === null || _b === void 0 ? void 0 : _b.call(_a);
                    (_d = (_c = this.cbs).ontext) === null || _d === void 0 ? void 0 : _d.call(_c, value);
                    (_f = (_e = this.cbs).oncdataend) === null || _f === void 0 ? void 0 : _f.call(_e);
                } else {
                    this.oncomment("[CDATA[" + value + "]]");
                }
            };
            Parser.prototype.onerror = function(err) {
                var _a, _b;
                (_b = (_a = this.cbs).onerror) === null || _b === void 0 ? void 0 : _b.call(_a, err);
            };
            Parser.prototype.onend = function() {
                var _a, _b;
                if (this.cbs.onclosetag) {
                    for (var i = this.stack.length; i > 0; this.cbs.onclosetag(this.stack[--i]))
                    ;
                }
                (_b = (_a = this.cbs).onend) === null || _b === void 0 ? void 0 : _b.call(_a);
            };
            /**
             * Resets the parser to a blank state, ready to parse a new HTML document
             */
            Parser.prototype.reset = function() {
                var _a, _b, _c, _d;
                (_b = (_a = this.cbs).onreset) === null || _b === void 0 ? void 0 : _b.call(_a);
                this.tokenizer.reset();
                this.tagname = "";
                this.attribname = "";
                this.attribs = null;
                this.stack = [];
                (_d = (_c = this.cbs).onparserinit) === null || _d === void 0 ? void 0 : _d.call(_c, this);
            };
            /**
             * Resets the parser, then parses a complete document and
             * pushes it to the handler.
             *
             * @param data Document to parse.
             */
            Parser.prototype.parseComplete = function(data) {
                this.reset();
                this.end(data);
            };
            /**
             * Parses a chunk of data and calls the corresponding callbacks.
             *
             * @param chunk Chunk to parse.
             */
            Parser.prototype.write = function(chunk) {
                this.tokenizer.write(chunk);
            };
            /**
             * Parses the end of the buffer and clears the stack, calls onend.
             *
             * @param chunk Optional final chunk to parse.
             */
            Parser.prototype.end = function(chunk) {
                this.tokenizer.end(chunk);
            };
            /**
             * Pauses parsing. The parser won't emit events until `resume` is called.
             */
            Parser.prototype.pause = function() {
                this.tokenizer.pause();
            };
            /**
             * Resumes parsing after `pause` was called.
             */
            Parser.prototype.resume = function() {
                this.tokenizer.resume();
            };
            /**
             * Alias of `write`, for backwards compatibility.
             *
             * @param chunk Chunk to parse.
             * @deprecated
             */
            Parser.prototype.parseChunk = function(chunk) {
                this.write(chunk);
            };
            /**
             * Alias of `end`, for backwards compatibility.
             *
             * @param chunk Optional final chunk to parse.
             * @deprecated
             */
            Parser.prototype.done = function(chunk) {
                this.end(chunk);
            };
            return Parser;
        }());
        exports.Parser = Parser;

    }, { "./Tokenizer": 47 }],
    47: [function(require, module, exports) {
        "use strict";
        var __importDefault = (this && this.__importDefault) || function(mod) {
            return (mod && mod.__esModule) ? mod : { "default": mod };
        };
        Object.defineProperty(exports, "__esModule", { value: true });
        var decode_codepoint_1 = __importDefault(require("entities/lib/decode_codepoint"));
        var entities_json_1 = __importDefault(require("entities/lib/maps/entities.json"));
        var legacy_json_1 = __importDefault(require("entities/lib/maps/legacy.json"));
        var xml_json_1 = __importDefault(require("entities/lib/maps/xml.json"));

        function whitespace(c) {
            return c === " " || c === "\n" || c === "\t" || c === "\f" || c === "\r";
        }

        function isASCIIAlpha(c) {
            return (c >= "a" && c <= "z") || (c >= "A" && c <= "Z");
        }

        function ifElseState(upper, SUCCESS, FAILURE) {
            var lower = upper.toLowerCase();
            if (upper === lower) {
                return function(t, c) {
                    if (c === lower) {
                        t._state = SUCCESS;
                    } else {
                        t._state = FAILURE;
                        t._index--;
                    }
                };
            }
            return function(t, c) {
                if (c === lower || c === upper) {
                    t._state = SUCCESS;
                } else {
                    t._state = FAILURE;
                    t._index--;
                }
            };
        }

        function consumeSpecialNameChar(upper, NEXT_STATE) {
            var lower = upper.toLowerCase();
            return function(t, c) {
                if (c === lower || c === upper) {
                    t._state = NEXT_STATE;
                } else {
                    t._state = 3 /* InTagName */ ;
                    t._index--; // Consume the token again
                }
            };
        }
        var stateBeforeCdata1 = ifElseState("C", 24 /* BeforeCdata2 */ , 16 /* InDeclaration */ );
        var stateBeforeCdata2 = ifElseState("D", 25 /* BeforeCdata3 */ , 16 /* InDeclaration */ );
        var stateBeforeCdata3 = ifElseState("A", 26 /* BeforeCdata4 */ , 16 /* InDeclaration */ );
        var stateBeforeCdata4 = ifElseState("T", 27 /* BeforeCdata5 */ , 16 /* InDeclaration */ );
        var stateBeforeCdata5 = ifElseState("A", 28 /* BeforeCdata6 */ , 16 /* InDeclaration */ );
        var stateBeforeScript1 = consumeSpecialNameChar("R", 35 /* BeforeScript2 */ );
        var stateBeforeScript2 = consumeSpecialNameChar("I", 36 /* BeforeScript3 */ );
        var stateBeforeScript3 = consumeSpecialNameChar("P", 37 /* BeforeScript4 */ );
        var stateBeforeScript4 = consumeSpecialNameChar("T", 38 /* BeforeScript5 */ );
        var stateAfterScript1 = ifElseState("R", 40 /* AfterScript2 */ , 1 /* Text */ );
        var stateAfterScript2 = ifElseState("I", 41 /* AfterScript3 */ , 1 /* Text */ );
        var stateAfterScript3 = ifElseState("P", 42 /* AfterScript4 */ , 1 /* Text */ );
        var stateAfterScript4 = ifElseState("T", 43 /* AfterScript5 */ , 1 /* Text */ );
        var stateBeforeStyle1 = consumeSpecialNameChar("Y", 45 /* BeforeStyle2 */ );
        var stateBeforeStyle2 = consumeSpecialNameChar("L", 46 /* BeforeStyle3 */ );
        var stateBeforeStyle3 = consumeSpecialNameChar("E", 47 /* BeforeStyle4 */ );
        var stateAfterStyle1 = ifElseState("Y", 49 /* AfterStyle2 */ , 1 /* Text */ );
        var stateAfterStyle2 = ifElseState("L", 50 /* AfterStyle3 */ , 1 /* Text */ );
        var stateAfterStyle3 = ifElseState("E", 51 /* AfterStyle4 */ , 1 /* Text */ );
        var stateBeforeSpecialT = consumeSpecialNameChar("I", 54 /* BeforeTitle1 */ );
        var stateBeforeTitle1 = consumeSpecialNameChar("T", 55 /* BeforeTitle2 */ );
        var stateBeforeTitle2 = consumeSpecialNameChar("L", 56 /* BeforeTitle3 */ );
        var stateBeforeTitle3 = consumeSpecialNameChar("E", 57 /* BeforeTitle4 */ );
        var stateAfterSpecialTEnd = ifElseState("I", 58 /* AfterTitle1 */ , 1 /* Text */ );
        var stateAfterTitle1 = ifElseState("T", 59 /* AfterTitle2 */ , 1 /* Text */ );
        var stateAfterTitle2 = ifElseState("L", 60 /* AfterTitle3 */ , 1 /* Text */ );
        var stateAfterTitle3 = ifElseState("E", 61 /* AfterTitle4 */ , 1 /* Text */ );
        var stateBeforeEntity = ifElseState("#", 63 /* BeforeNumericEntity */ , 64 /* InNamedEntity */ );
        var stateBeforeNumericEntity = ifElseState("X", 66 /* InHexEntity */ , 65 /* InNumericEntity */ );
        var Tokenizer = /** @class */ (function() {
            function Tokenizer(options, cbs) {
                var _a;
                /** The current state the tokenizer is in. */
                this._state = 1 /* Text */ ;
                /** The read buffer. */
                this.buffer = "";
                /** The beginning of the section that is currently being read. */
                this.sectionStart = 0;
                /** The index within the buffer that we are currently looking at. */
                this._index = 0;
                /**
                 * Data that has already been processed will be removed from the buffer occasionally.
                 * `_bufferOffset` keeps track of how many characters have been removed, to make sure position information is accurate.
                 */
                this.bufferOffset = 0;
                /** Some behavior, eg. when decoding entities, is done while we are in another state. This keeps track of the other state type. */
                this.baseState = 1 /* Text */ ;
                /** For special parsing behavior inside of script and style tags. */
                this.special = 1 /* None */ ;
                /** Indicates whether the tokenizer has been paused. */
                this.running = true;
                /** Indicates whether the tokenizer has finished running / `.end` has been called. */
                this.ended = false;
                this.cbs = cbs;
                this.xmlMode = !!(options === null || options === void 0 ? void 0 : options.xmlMode);
                this.decodeEntities = (_a = options === null || options === void 0 ? void 0 : options.decodeEntities) !== null && _a !== void 0 ? _a : true;
            }
            Tokenizer.prototype.reset = function() {
                this._state = 1 /* Text */ ;
                this.buffer = "";
                this.sectionStart = 0;
                this._index = 0;
                this.bufferOffset = 0;
                this.baseState = 1 /* Text */ ;
                this.special = 1 /* None */ ;
                this.running = true;
                this.ended = false;
            };
            Tokenizer.prototype.write = function(chunk) {
                if (this.ended)
                    this.cbs.onerror(Error(".write() after done!"));
                this.buffer += chunk;
                this.parse();
            };
            Tokenizer.prototype.end = function(chunk) {
                if (this.ended)
                    this.cbs.onerror(Error(".end() after done!"));
                if (chunk)
                    this.write(chunk);
                this.ended = true;
                if (this.running)
                    this.finish();
            };
            Tokenizer.prototype.pause = function() {
                this.running = false;
            };
            Tokenizer.prototype.resume = function() {
                this.running = true;
                if (this._index < this.buffer.length) {
                    this.parse();
                }
                if (this.ended) {
                    this.finish();
                }
            };
            /**
             * The current index within all of the written data.
             */
            Tokenizer.prototype.getAbsoluteIndex = function() {
                return this.bufferOffset + this._index;
            };
            Tokenizer.prototype.stateText = function(c) {
                if (c === "<") {
                    if (this._index > this.sectionStart) {
                        this.cbs.ontext(this.getSection());
                    }
                    this._state = 2 /* BeforeTagName */ ;
                    this.sectionStart = this._index;
                } else if (this.decodeEntities &&
                    c === "&" &&
                    (this.special === 1 /* None */ || this.special === 4 /* Title */ )) {
                    if (this._index > this.sectionStart) {
                        this.cbs.ontext(this.getSection());
                    }
                    this.baseState = 1 /* Text */ ;
                    this._state = 62 /* BeforeEntity */ ;
                    this.sectionStart = this._index;
                }
            };
            /**
             * HTML only allows ASCII alpha characters (a-z and A-Z) at the beginning of a tag name.
             *
             * XML allows a lot more characters here (@see https://www.w3.org/TR/REC-xml/#NT-NameStartChar).
             * We allow anything that wouldn't end the tag.
             */
            Tokenizer.prototype.isTagStartChar = function(c) {
                return (isASCIIAlpha(c) ||
                    (this.xmlMode && !whitespace(c) && c !== "/" && c !== ">"));
            };
            Tokenizer.prototype.stateBeforeTagName = function(c) {
                if (c === "/") {
                    this._state = 5 /* BeforeClosingTagName */ ;
                } else if (c === "<") {
                    this.cbs.ontext(this.getSection());
                    this.sectionStart = this._index;
                } else if (c === ">" ||
                    this.special !== 1 /* None */ ||
                    whitespace(c)) {
                    this._state = 1 /* Text */ ;
                } else if (c === "!") {
                    this._state = 15 /* BeforeDeclaration */ ;
                    this.sectionStart = this._index + 1;
                } else if (c === "?") {
                    this._state = 17 /* InProcessingInstruction */ ;
                    this.sectionStart = this._index + 1;
                } else if (!this.isTagStartChar(c)) {
                    this._state = 1 /* Text */ ;
                } else {
                    this._state = !this.xmlMode && (c === "s" || c === "S") ?
                        32 /* BeforeSpecialS */ :
                        !this.xmlMode && (c === "t" || c === "T") ?
                        52 /* BeforeSpecialT */ :
                        3 /* InTagName */ ;
                    this.sectionStart = this._index;
                }
            };
            Tokenizer.prototype.stateInTagName = function(c) {
                if (c === "/" || c === ">" || whitespace(c)) {
                    this.emitToken("onopentagname");
                    this._state = 8 /* BeforeAttributeName */ ;
                    this._index--;
                }
            };
            Tokenizer.prototype.stateBeforeClosingTagName = function(c) {
                if (whitespace(c)) {
                    // Ignore
                } else if (c === ">") {
                    this._state = 1 /* Text */ ;
                } else if (this.special !== 1 /* None */ ) {
                    if (this.special !== 4 /* Title */ && (c === "s" || c === "S")) {
                        this._state = 33 /* BeforeSpecialSEnd */ ;
                    } else if (this.special === 4 /* Title */ &&
                        (c === "t" || c === "T")) {
                        this._state = 53 /* BeforeSpecialTEnd */ ;
                    } else {
                        this._state = 1 /* Text */ ;
                        this._index--;
                    }
                } else if (!this.isTagStartChar(c)) {
                    this._state = 20 /* InSpecialComment */ ;
                    this.sectionStart = this._index;
                } else {
                    this._state = 6 /* InClosingTagName */ ;
                    this.sectionStart = this._index;
                }
            };
            Tokenizer.prototype.stateInClosingTagName = function(c) {
                if (c === ">" || whitespace(c)) {
                    this.emitToken("onclosetag");
                    this._state = 7 /* AfterClosingTagName */ ;
                    this._index--;
                }
            };
            Tokenizer.prototype.stateAfterClosingTagName = function(c) {
                // Skip everything until ">"
                if (c === ">") {
                    this._state = 1 /* Text */ ;
                    this.sectionStart = this._index + 1;
                }
            };
            Tokenizer.prototype.stateBeforeAttributeName = function(c) {
                if (c === ">") {
                    this.cbs.onopentagend();
                    this._state = 1 /* Text */ ;
                    this.sectionStart = this._index + 1;
                } else if (c === "/") {
                    this._state = 4 /* InSelfClosingTag */ ;
                } else if (!whitespace(c)) {
                    this._state = 9 /* InAttributeName */ ;
                    this.sectionStart = this._index;
                }
            };
            Tokenizer.prototype.stateInSelfClosingTag = function(c) {
                if (c === ">") {
                    this.cbs.onselfclosingtag();
                    this._state = 1 /* Text */ ;
                    this.sectionStart = this._index + 1;
                    this.special = 1 /* None */ ; // Reset special state, in case of self-closing special tags
                } else if (!whitespace(c)) {
                    this._state = 8 /* BeforeAttributeName */ ;
                    this._index--;
                }
            };
            Tokenizer.prototype.stateInAttributeName = function(c) {
                if (c === "=" || c === "/" || c === ">" || whitespace(c)) {
                    this.cbs.onattribname(this.getSection());
                    this.sectionStart = -1;
                    this._state = 10 /* AfterAttributeName */ ;
                    this._index--;
                }
            };
            Tokenizer.prototype.stateAfterAttributeName = function(c) {
                if (c === "=") {
                    this._state = 11 /* BeforeAttributeValue */ ;
                } else if (c === "/" || c === ">") {
                    this.cbs.onattribend(undefined);
                    this._state = 8 /* BeforeAttributeName */ ;
                    this._index--;
                } else if (!whitespace(c)) {
                    this.cbs.onattribend(undefined);
                    this._state = 9 /* InAttributeName */ ;
                    this.sectionStart = this._index;
                }
            };
            Tokenizer.prototype.stateBeforeAttributeValue = function(c) {
                if (c === '"') {
                    this._state = 12 /* InAttributeValueDq */ ;
                    this.sectionStart = this._index + 1;
                } else if (c === "'") {
                    this._state = 13 /* InAttributeValueSq */ ;
                    this.sectionStart = this._index + 1;
                } else if (!whitespace(c)) {
                    this._state = 14 /* InAttributeValueNq */ ;
                    this.sectionStart = this._index;
                    this._index--; // Reconsume token
                }
            };
            Tokenizer.prototype.handleInAttributeValue = function(c, quote) {
                if (c === quote) {
                    this.emitToken("onattribdata");
                    this.cbs.onattribend(quote);
                    this._state = 8 /* BeforeAttributeName */ ;
                } else if (this.decodeEntities && c === "&") {
                    this.emitToken("onattribdata");
                    this.baseState = this._state;
                    this._state = 62 /* BeforeEntity */ ;
                    this.sectionStart = this._index;
                }
            };
            Tokenizer.prototype.stateInAttributeValueDoubleQuotes = function(c) {
                this.handleInAttributeValue(c, '"');
            };
            Tokenizer.prototype.stateInAttributeValueSingleQuotes = function(c) {
                this.handleInAttributeValue(c, "'");
            };
            Tokenizer.prototype.stateInAttributeValueNoQuotes = function(c) {
                if (whitespace(c) || c === ">") {
                    this.emitToken("onattribdata");
                    this.cbs.onattribend(null);
                    this._state = 8 /* BeforeAttributeName */ ;
                    this._index--;
                } else if (this.decodeEntities && c === "&") {
                    this.emitToken("onattribdata");
                    this.baseState = this._state;
                    this._state = 62 /* BeforeEntity */ ;
                    this.sectionStart = this._index;
                }
            };
            Tokenizer.prototype.stateBeforeDeclaration = function(c) {
                this._state =
                    c === "[" ?
                    23 /* BeforeCdata1 */ :
                    c === "-" ?
                    18 /* BeforeComment */ :
                    16 /* InDeclaration */ ;
            };
            Tokenizer.prototype.stateInDeclaration = function(c) {
                if (c === ">") {
                    this.cbs.ondeclaration(this.getSection());
                    this._state = 1 /* Text */ ;
                    this.sectionStart = this._index + 1;
                }
            };
            Tokenizer.prototype.stateInProcessingInstruction = function(c) {
                if (c === ">") {
                    this.cbs.onprocessinginstruction(this.getSection());
                    this._state = 1 /* Text */ ;
                    this.sectionStart = this._index + 1;
                }
            };
            Tokenizer.prototype.stateBeforeComment = function(c) {
                if (c === "-") {
                    this._state = 19 /* InComment */ ;
                    this.sectionStart = this._index + 1;
                } else {
                    this._state = 16 /* InDeclaration */ ;
                }
            };
            Tokenizer.prototype.stateInComment = function(c) {
                if (c === "-")
                    this._state = 21 /* AfterComment1 */ ;
            };
            Tokenizer.prototype.stateInSpecialComment = function(c) {
                if (c === ">") {
                    this.cbs.oncomment(this.buffer.substring(this.sectionStart, this._index));
                    this._state = 1 /* Text */ ;
                    this.sectionStart = this._index + 1;
                }
            };
            Tokenizer.prototype.stateAfterComment1 = function(c) {
                if (c === "-") {
                    this._state = 22 /* AfterComment2 */ ;
                } else {
                    this._state = 19 /* InComment */ ;
                }
            };
            Tokenizer.prototype.stateAfterComment2 = function(c) {
                if (c === ">") {
                    // Remove 2 trailing chars
                    this.cbs.oncomment(this.buffer.substring(this.sectionStart, this._index - 2));
                    this._state = 1 /* Text */ ;
                    this.sectionStart = this._index + 1;
                } else if (c !== "-") {
                    this._state = 19 /* InComment */ ;
                }
                // Else: stay in AFTER_COMMENT_2 (`--->`)
            };
            Tokenizer.prototype.stateBeforeCdata6 = function(c) {
                if (c === "[") {
                    this._state = 29 /* InCdata */ ;
                    this.sectionStart = this._index + 1;
                } else {
                    this._state = 16 /* InDeclaration */ ;
                    this._index--;
                }
            };
            Tokenizer.prototype.stateInCdata = function(c) {
                if (c === "]")
                    this._state = 30 /* AfterCdata1 */ ;
            };
            Tokenizer.prototype.stateAfterCdata1 = function(c) {
                if (c === "]")
                    this._state = 31 /* AfterCdata2 */ ;
                else
                    this._state = 29 /* InCdata */ ;
            };
            Tokenizer.prototype.stateAfterCdata2 = function(c) {
                if (c === ">") {
                    // Remove 2 trailing chars
                    this.cbs.oncdata(this.buffer.substring(this.sectionStart, this._index - 2));
                    this._state = 1 /* Text */ ;
                    this.sectionStart = this._index + 1;
                } else if (c !== "]") {
                    this._state = 29 /* InCdata */ ;
                }
                // Else: stay in AFTER_CDATA_2 (`]]]>`)
            };
            Tokenizer.prototype.stateBeforeSpecialS = function(c) {
                if (c === "c" || c === "C") {
                    this._state = 34 /* BeforeScript1 */ ;
                } else if (c === "t" || c === "T") {
                    this._state = 44 /* BeforeStyle1 */ ;
                } else {
                    this._state = 3 /* InTagName */ ;
                    this._index--; // Consume the token again
                }
            };
            Tokenizer.prototype.stateBeforeSpecialSEnd = function(c) {
                if (this.special === 2 /* Script */ && (c === "c" || c === "C")) {
                    this._state = 39 /* AfterScript1 */ ;
                } else if (this.special === 3 /* Style */ && (c === "t" || c === "T")) {
                    this._state = 48 /* AfterStyle1 */ ;
                } else
                    this._state = 1 /* Text */ ;
            };
            Tokenizer.prototype.stateBeforeSpecialLast = function(c, special) {
                if (c === "/" || c === ">" || whitespace(c)) {
                    this.special = special;
                }
                this._state = 3 /* InTagName */ ;
                this._index--; // Consume the token again
            };
            Tokenizer.prototype.stateAfterSpecialLast = function(c, sectionStartOffset) {
                if (c === ">" || whitespace(c)) {
                    this.special = 1 /* None */ ;
                    this._state = 6 /* InClosingTagName */ ;
                    this.sectionStart = this._index - sectionStartOffset;
                    this._index--; // Reconsume the token
                } else
                    this._state = 1 /* Text */ ;
            };
            // For entities terminated with a semicolon
            Tokenizer.prototype.parseFixedEntity = function(map) {
                if (map === void 0) { map = this.xmlMode ? xml_json_1.default : entities_json_1.default; }
                // Offset = 1
                if (this.sectionStart + 1 < this._index) {
                    var entity = this.buffer.substring(this.sectionStart + 1, this._index);
                    if (Object.prototype.hasOwnProperty.call(map, entity)) {
                        this.emitPartial(map[entity]);
                        this.sectionStart = this._index + 1;
                    }
                }
            };
            // Parses legacy entities (without trailing semicolon)
            Tokenizer.prototype.parseLegacyEntity = function() {
                var start = this.sectionStart + 1;
                // The max length of legacy entities is 6
                var limit = Math.min(this._index - start, 6);
                while (limit >= 2) {
                    // The min length of legacy entities is 2
                    var entity = this.buffer.substr(start, limit);
                    if (Object.prototype.hasOwnProperty.call(legacy_json_1.default, entity)) {
                        this.emitPartial(legacy_json_1.default[entity]);
                        this.sectionStart += limit + 1;
                        return;
                    }
                    limit--;
                }
            };
            Tokenizer.prototype.stateInNamedEntity = function(c) {
                if (c === ";") {
                    this.parseFixedEntity();
                    // Retry as legacy entity if entity wasn't parsed
                    if (this.baseState === 1 /* Text */ &&
                        this.sectionStart + 1 < this._index &&
                        !this.xmlMode) {
                        this.parseLegacyEntity();
                    }
                    this._state = this.baseState;
                } else if ((c < "0" || c > "9") && !isASCIIAlpha(c)) {
                    if (this.xmlMode || this.sectionStart + 1 === this._index) {
                        // Ignore
                    } else if (this.baseState !== 1 /* Text */ ) {
                        if (c !== "=") {
                            // Parse as legacy entity, without allowing additional characters.
                            this.parseFixedEntity(legacy_json_1.default);
                        }
                    } else {
                        this.parseLegacyEntity();
                    }
                    this._state = this.baseState;
                    this._index--;
                }
            };
            Tokenizer.prototype.decodeNumericEntity = function(offset, base, strict) {
                var sectionStart = this.sectionStart + offset;
                if (sectionStart !== this._index) {
                    // Parse entity
                    var entity = this.buffer.substring(sectionStart, this._index);
                    var parsed = parseInt(entity, base);
                    this.emitPartial(decode_codepoint_1.default(parsed));
                    this.sectionStart = strict ? this._index + 1 : this._index;
                }
                this._state = this.baseState;
            };
            Tokenizer.prototype.stateInNumericEntity = function(c) {
                if (c === ";") {
                    this.decodeNumericEntity(2, 10, true);
                } else if (c < "0" || c > "9") {
                    if (!this.xmlMode) {
                        this.decodeNumericEntity(2, 10, false);
                    } else {
                        this._state = this.baseState;
                    }
                    this._index--;
                }
            };
            Tokenizer.prototype.stateInHexEntity = function(c) {
                if (c === ";") {
                    this.decodeNumericEntity(3, 16, true);
                } else if ((c < "a" || c > "f") &&
                    (c < "A" || c > "F") &&
                    (c < "0" || c > "9")) {
                    if (!this.xmlMode) {
                        this.decodeNumericEntity(3, 16, false);
                    } else {
                        this._state = this.baseState;
                    }
                    this._index--;
                }
            };
            Tokenizer.prototype.cleanup = function() {
                if (this.sectionStart < 0) {
                    this.buffer = "";
                    this.bufferOffset += this._index;
                    this._index = 0;
                } else if (this.running) {
                    if (this._state === 1 /* Text */ ) {
                        if (this.sectionStart !== this._index) {
                            this.cbs.ontext(this.buffer.substr(this.sectionStart));
                        }
                        this.buffer = "";
                        this.bufferOffset += this._index;
                        this._index = 0;
                    } else if (this.sectionStart === this._index) {
                        // The section just started
                        this.buffer = "";
                        this.bufferOffset += this._index;
                        this._index = 0;
                    } else {
                        // Remove everything unnecessary
                        this.buffer = this.buffer.substr(this.sectionStart);
                        this._index -= this.sectionStart;
                        this.bufferOffset += this.sectionStart;
                    }
                    this.sectionStart = 0;
                }
            };
            /**
             * Iterates through the buffer, calling the function corresponding to the current state.
             *
             * States that are more likely to be hit are higher up, as a performance improvement.
             */
            Tokenizer.prototype.parse = function() {
                while (this._index < this.buffer.length && this.running) {
                    var c = this.buffer.charAt(this._index);
                    if (this._state === 1 /* Text */ ) {
                        this.stateText(c);
                    } else if (this._state === 12 /* InAttributeValueDq */ ) {
                        this.stateInAttributeValueDoubleQuotes(c);
                    } else if (this._state === 9 /* InAttributeName */ ) {
                        this.stateInAttributeName(c);
                    } else if (this._state === 19 /* InComment */ ) {
                        this.stateInComment(c);
                    } else if (this._state === 20 /* InSpecialComment */ ) {
                        this.stateInSpecialComment(c);
                    } else if (this._state === 8 /* BeforeAttributeName */ ) {
                        this.stateBeforeAttributeName(c);
                    } else if (this._state === 3 /* InTagName */ ) {
                        this.stateInTagName(c);
                    } else if (this._state === 6 /* InClosingTagName */ ) {
                        this.stateInClosingTagName(c);
                    } else if (this._state === 2 /* BeforeTagName */ ) {
                        this.stateBeforeTagName(c);
                    } else if (this._state === 10 /* AfterAttributeName */ ) {
                        this.stateAfterAttributeName(c);
                    } else if (this._state === 13 /* InAttributeValueSq */ ) {
                        this.stateInAttributeValueSingleQuotes(c);
                    } else if (this._state === 11 /* BeforeAttributeValue */ ) {
                        this.stateBeforeAttributeValue(c);
                    } else if (this._state === 5 /* BeforeClosingTagName */ ) {
                        this.stateBeforeClosingTagName(c);
                    } else if (this._state === 7 /* AfterClosingTagName */ ) {
                        this.stateAfterClosingTagName(c);
                    } else if (this._state === 32 /* BeforeSpecialS */ ) {
                        this.stateBeforeSpecialS(c);
                    } else if (this._state === 21 /* AfterComment1 */ ) {
                        this.stateAfterComment1(c);
                    } else if (this._state === 14 /* InAttributeValueNq */ ) {
                        this.stateInAttributeValueNoQuotes(c);
                    } else if (this._state === 4 /* InSelfClosingTag */ ) {
                        this.stateInSelfClosingTag(c);
                    } else if (this._state === 16 /* InDeclaration */ ) {
                        this.stateInDeclaration(c);
                    } else if (this._state === 15 /* BeforeDeclaration */ ) {
                        this.stateBeforeDeclaration(c);
                    } else if (this._state === 22 /* AfterComment2 */ ) {
                        this.stateAfterComment2(c);
                    } else if (this._state === 18 /* BeforeComment */ ) {
                        this.stateBeforeComment(c);
                    } else if (this._state === 33 /* BeforeSpecialSEnd */ ) {
                        this.stateBeforeSpecialSEnd(c);
                    } else if (this._state === 53 /* BeforeSpecialTEnd */ ) {
                        stateAfterSpecialTEnd(this, c);
                    } else if (this._state === 39 /* AfterScript1 */ ) {
                        stateAfterScript1(this, c);
                    } else if (this._state === 40 /* AfterScript2 */ ) {
                        stateAfterScript2(this, c);
                    } else if (this._state === 41 /* AfterScript3 */ ) {
                        stateAfterScript3(this, c);
                    } else if (this._state === 34 /* BeforeScript1 */ ) {
                        stateBeforeScript1(this, c);
                    } else if (this._state === 35 /* BeforeScript2 */ ) {
                        stateBeforeScript2(this, c);
                    } else if (this._state === 36 /* BeforeScript3 */ ) {
                        stateBeforeScript3(this, c);
                    } else if (this._state === 37 /* BeforeScript4 */ ) {
                        stateBeforeScript4(this, c);
                    } else if (this._state === 38 /* BeforeScript5 */ ) {
                        this.stateBeforeSpecialLast(c, 2 /* Script */ );
                    } else if (this._state === 42 /* AfterScript4 */ ) {
                        stateAfterScript4(this, c);
                    } else if (this._state === 43 /* AfterScript5 */ ) {
                        this.stateAfterSpecialLast(c, 6);
                    } else if (this._state === 44 /* BeforeStyle1 */ ) {
                        stateBeforeStyle1(this, c);
                    } else if (this._state === 29 /* InCdata */ ) {
                        this.stateInCdata(c);
                    } else if (this._state === 45 /* BeforeStyle2 */ ) {
                        stateBeforeStyle2(this, c);
                    } else if (this._state === 46 /* BeforeStyle3 */ ) {
                        stateBeforeStyle3(this, c);
                    } else if (this._state === 47 /* BeforeStyle4 */ ) {
                        this.stateBeforeSpecialLast(c, 3 /* Style */ );
                    } else if (this._state === 48 /* AfterStyle1 */ ) {
                        stateAfterStyle1(this, c);
                    } else if (this._state === 49 /* AfterStyle2 */ ) {
                        stateAfterStyle2(this, c);
                    } else if (this._state === 50 /* AfterStyle3 */ ) {
                        stateAfterStyle3(this, c);
                    } else if (this._state === 51 /* AfterStyle4 */ ) {
                        this.stateAfterSpecialLast(c, 5);
                    } else if (this._state === 52 /* BeforeSpecialT */ ) {
                        stateBeforeSpecialT(this, c);
                    } else if (this._state === 54 /* BeforeTitle1 */ ) {
                        stateBeforeTitle1(this, c);
                    } else if (this._state === 55 /* BeforeTitle2 */ ) {
                        stateBeforeTitle2(this, c);
                    } else if (this._state === 56 /* BeforeTitle3 */ ) {
                        stateBeforeTitle3(this, c);
                    } else if (this._state === 57 /* BeforeTitle4 */ ) {
                        this.stateBeforeSpecialLast(c, 4 /* Title */ );
                    } else if (this._state === 58 /* AfterTitle1 */ ) {
                        stateAfterTitle1(this, c);
                    } else if (this._state === 59 /* AfterTitle2 */ ) {
                        stateAfterTitle2(this, c);
                    } else if (this._state === 60 /* AfterTitle3 */ ) {
                        stateAfterTitle3(this, c);
                    } else if (this._state === 61 /* AfterTitle4 */ ) {
                        this.stateAfterSpecialLast(c, 5);
                    } else if (this._state === 17 /* InProcessingInstruction */ ) {
                        this.stateInProcessingInstruction(c);
                    } else if (this._state === 64 /* InNamedEntity */ ) {
                        this.stateInNamedEntity(c);
                    } else if (this._state === 23 /* BeforeCdata1 */ ) {
                        stateBeforeCdata1(this, c);
                    } else if (this._state === 62 /* BeforeEntity */ ) {
                        stateBeforeEntity(this, c);
                    } else if (this._state === 24 /* BeforeCdata2 */ ) {
                        stateBeforeCdata2(this, c);
                    } else if (this._state === 25 /* BeforeCdata3 */ ) {
                        stateBeforeCdata3(this, c);
                    } else if (this._state === 30 /* AfterCdata1 */ ) {
                        this.stateAfterCdata1(c);
                    } else if (this._state === 31 /* AfterCdata2 */ ) {
                        this.stateAfterCdata2(c);
                    } else if (this._state === 26 /* BeforeCdata4 */ ) {
                        stateBeforeCdata4(this, c);
                    } else if (this._state === 27 /* BeforeCdata5 */ ) {
                        stateBeforeCdata5(this, c);
                    } else if (this._state === 28 /* BeforeCdata6 */ ) {
                        this.stateBeforeCdata6(c);
                    } else if (this._state === 66 /* InHexEntity */ ) {
                        this.stateInHexEntity(c);
                    } else if (this._state === 65 /* InNumericEntity */ ) {
                        this.stateInNumericEntity(c);
                        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                    } else if (this._state === 63 /* BeforeNumericEntity */ ) {
                        stateBeforeNumericEntity(this, c);
                    } else {
                        this.cbs.onerror(Error("unknown _state"), this._state);
                    }
                    this._index++;
                }
                this.cleanup();
            };
            Tokenizer.prototype.finish = function() {
                // If there is remaining data, emit it in a reasonable way
                if (this.sectionStart < this._index) {
                    this.handleTrailingData();
                }
                this.cbs.onend();
            };
            Tokenizer.prototype.handleTrailingData = function() {
                var data = this.buffer.substr(this.sectionStart);
                if (this._state === 29 /* InCdata */ ||
                    this._state === 30 /* AfterCdata1 */ ||
                    this._state === 31 /* AfterCdata2 */ ) {
                    this.cbs.oncdata(data);
                } else if (this._state === 19 /* InComment */ ||
                    this._state === 21 /* AfterComment1 */ ||
                    this._state === 22 /* AfterComment2 */ ) {
                    this.cbs.oncomment(data);
                } else if (this._state === 64 /* InNamedEntity */ && !this.xmlMode) {
                    this.parseLegacyEntity();
                    if (this.sectionStart < this._index) {
                        this._state = this.baseState;
                        this.handleTrailingData();
                    }
                } else if (this._state === 65 /* InNumericEntity */ && !this.xmlMode) {
                    this.decodeNumericEntity(2, 10, false);
                    if (this.sectionStart < this._index) {
                        this._state = this.baseState;
                        this.handleTrailingData();
                    }
                } else if (this._state === 66 /* InHexEntity */ && !this.xmlMode) {
                    this.decodeNumericEntity(3, 16, false);
                    if (this.sectionStart < this._index) {
                        this._state = this.baseState;
                        this.handleTrailingData();
                    }
                } else if (this._state !== 3 /* InTagName */ &&
                    this._state !== 8 /* BeforeAttributeName */ &&
                    this._state !== 11 /* BeforeAttributeValue */ &&
                    this._state !== 10 /* AfterAttributeName */ &&
                    this._state !== 9 /* InAttributeName */ &&
                    this._state !== 13 /* InAttributeValueSq */ &&
                    this._state !== 12 /* InAttributeValueDq */ &&
                    this._state !== 14 /* InAttributeValueNq */ &&
                    this._state !== 6 /* InClosingTagName */ ) {
                    this.cbs.ontext(data);
                }
                /*
                 * Else, ignore remaining data
                 * TODO add a way to remove current tag
                 */
            };
            Tokenizer.prototype.getSection = function() {
                return this.buffer.substring(this.sectionStart, this._index);
            };
            Tokenizer.prototype.emitToken = function(name) {
                this.cbs[name](this.getSection());
                this.sectionStart = -1;
            };
            Tokenizer.prototype.emitPartial = function(value) {
                if (this.baseState !== 1 /* Text */ ) {
                    this.cbs.onattribdata(value); // TODO implement the new event
                } else {
                    this.cbs.ontext(value);
                }
            };
            return Tokenizer;
        }());
        exports.default = Tokenizer;

    }, { "entities/lib/decode_codepoint": 38, "entities/lib/maps/entities.json": 42, "entities/lib/maps/legacy.json": 43, "entities/lib/maps/xml.json": 44 }],
    48: [function(require, module, exports) {
        "use strict";
        var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
            if (k2 === undefined) k2 = k;
            Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
        }) : (function(o, m, k, k2) {
            if (k2 === undefined) k2 = k;
            o[k2] = m[k];
        }));
        var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
            Object.defineProperty(o, "default", { enumerable: true, value: v });
        }) : function(o, v) {
            o["default"] = v;
        });
        var __importStar = (this && this.__importStar) || function(mod) {
            if (mod && mod.__esModule) return mod;
            var result = {};
            if (mod != null)
                for (var k in mod)
                    if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
            __setModuleDefault(result, mod);
            return result;
        };
        var __exportStar = (this && this.__exportStar) || function(m, exports) {
            for (var p in m)
                if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
        };
        var __importDefault = (this && this.__importDefault) || function(mod) {
            return (mod && mod.__esModule) ? mod : { "default": mod };
        };
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.RssHandler = exports.DefaultHandler = exports.DomUtils = exports.ElementType = exports.Tokenizer = exports.createDomStream = exports.parseDOM = exports.parseDocument = exports.DomHandler = exports.Parser = void 0;
        var Parser_1 = require("./Parser");
        Object.defineProperty(exports, "Parser", { enumerable: true, get: function() { return Parser_1.Parser; } });
        var domhandler_1 = require("domhandler");
        Object.defineProperty(exports, "DomHandler", { enumerable: true, get: function() { return domhandler_1.DomHandler; } });
        Object.defineProperty(exports, "DefaultHandler", { enumerable: true, get: function() { return domhandler_1.DomHandler; } });
        // Helper methods
        /**
         * Parses the data, returns the resulting document.
         *
         * @param data The data that should be parsed.
         * @param options Optional options for the parser and DOM builder.
         */
        function parseDocument(data, options) {
            var handler = new domhandler_1.DomHandler(undefined, options);
            new Parser_1.Parser(handler, options).end(data);
            return handler.root;
        }
        exports.parseDocument = parseDocument;
        /**
         * Parses data, returns an array of the root nodes.
         *
         * Note that the root nodes still have a `Document` node as their parent.
         * Use `parseDocument` to get the `Document` node instead.
         *
         * @param data The data that should be parsed.
         * @param options Optional options for the parser and DOM builder.
         * @deprecated Use `parseDocument` instead.
         */
        function parseDOM(data, options) {
            return parseDocument(data, options).children;
        }
        exports.parseDOM = parseDOM;
        /**
         * Creates a parser instance, with an attached DOM handler.
         *
         * @param cb A callback that will be called once parsing has been completed.
         * @param options Optional options for the parser and DOM builder.
         * @param elementCb An optional callback that will be called every time a tag has been completed inside of the DOM.
         */
        function createDomStream(cb, options, elementCb) {
            var handler = new domhandler_1.DomHandler(cb, options, elementCb);
            return new Parser_1.Parser(handler, options);
        }
        exports.createDomStream = createDomStream;
        var Tokenizer_1 = require("./Tokenizer");
        Object.defineProperty(exports, "Tokenizer", { enumerable: true, get: function() { return __importDefault(Tokenizer_1).default; } });
        var ElementType = __importStar(require("domelementtype"));
        exports.ElementType = ElementType;
        /*
         * All of the following exports exist for backwards-compatibility.
         * They should probably be removed eventually.
         */
        __exportStar(require("./FeedHandler"), exports);
        exports.DomUtils = __importStar(require("domutils"));
        var FeedHandler_1 = require("./FeedHandler");
        Object.defineProperty(exports, "RssHandler", { enumerable: true, get: function() { return FeedHandler_1.FeedHandler; } });

    }, { "./FeedHandler": 45, "./Parser": 46, "./Tokenizer": 47, "domelementtype": 26, "domhandler": 27, "domutils": 31 }],
    49: [function(require, module, exports) {
        var getNative = require('./_getNative'),
            root = require('./_root');

        /* Built-in method references that are verified to be native. */
        var DataView = getNative(root, 'DataView');

        module.exports = DataView;

    }, { "./_getNative": 107, "./_root": 144 }],
    50: [function(require, module, exports) {
        var hashClear = require('./_hashClear'),
            hashDelete = require('./_hashDelete'),
            hashGet = require('./_hashGet'),
            hashHas = require('./_hashHas'),
            hashSet = require('./_hashSet');

        /**
         * Creates a hash object.
         *
         * @private
         * @constructor
         * @param {Array} [entries] The key-value pairs to cache.
         */
        function Hash(entries) {
            var index = -1,
                length = entries == null ? 0 : entries.length;

            this.clear();
            while (++index < length) {
                var entry = entries[index];
                this.set(entry[0], entry[1]);
            }
        }

        // Add methods to `Hash`.
        Hash.prototype.clear = hashClear;
        Hash.prototype['delete'] = hashDelete;
        Hash.prototype.get = hashGet;
        Hash.prototype.has = hashHas;
        Hash.prototype.set = hashSet;

        module.exports = Hash;

    }, { "./_hashClear": 114, "./_hashDelete": 115, "./_hashGet": 116, "./_hashHas": 117, "./_hashSet": 118 }],
    51: [function(require, module, exports) {
        var listCacheClear = require('./_listCacheClear'),
            listCacheDelete = require('./_listCacheDelete'),
            listCacheGet = require('./_listCacheGet'),
            listCacheHas = require('./_listCacheHas'),
            listCacheSet = require('./_listCacheSet');

        /**
         * Creates an list cache object.
         *
         * @private
         * @constructor
         * @param {Array} [entries] The key-value pairs to cache.
         */
        function ListCache(entries) {
            var index = -1,
                length = entries == null ? 0 : entries.length;

            this.clear();
            while (++index < length) {
                var entry = entries[index];
                this.set(entry[0], entry[1]);
            }
        }

        // Add methods to `ListCache`.
        ListCache.prototype.clear = listCacheClear;
        ListCache.prototype['delete'] = listCacheDelete;
        ListCache.prototype.get = listCacheGet;
        ListCache.prototype.has = listCacheHas;
        ListCache.prototype.set = listCacheSet;

        module.exports = ListCache;

    }, { "./_listCacheClear": 127, "./_listCacheDelete": 128, "./_listCacheGet": 129, "./_listCacheHas": 130, "./_listCacheSet": 131 }],
    52: [function(require, module, exports) {
        var getNative = require('./_getNative'),
            root = require('./_root');

        /* Built-in method references that are verified to be native. */
        var Map = getNative(root, 'Map');

        module.exports = Map;

    }, { "./_getNative": 107, "./_root": 144 }],
    53: [function(require, module, exports) {
        var mapCacheClear = require('./_mapCacheClear'),
            mapCacheDelete = require('./_mapCacheDelete'),
            mapCacheGet = require('./_mapCacheGet'),
            mapCacheHas = require('./_mapCacheHas'),
            mapCacheSet = require('./_mapCacheSet');

        /**
         * Creates a map cache object to store key-value pairs.
         *
         * @private
         * @constructor
         * @param {Array} [entries] The key-value pairs to cache.
         */
        function MapCache(entries) {
            var index = -1,
                length = entries == null ? 0 : entries.length;

            this.clear();
            while (++index < length) {
                var entry = entries[index];
                this.set(entry[0], entry[1]);
            }
        }

        // Add methods to `MapCache`.
        MapCache.prototype.clear = mapCacheClear;
        MapCache.prototype['delete'] = mapCacheDelete;
        MapCache.prototype.get = mapCacheGet;
        MapCache.prototype.has = mapCacheHas;
        MapCache.prototype.set = mapCacheSet;

        module.exports = MapCache;

    }, { "./_mapCacheClear": 132, "./_mapCacheDelete": 133, "./_mapCacheGet": 134, "./_mapCacheHas": 135, "./_mapCacheSet": 136 }],
    54: [function(require, module, exports) {
        var getNative = require('./_getNative'),
            root = require('./_root');

        /* Built-in method references that are verified to be native. */
        var Promise = getNative(root, 'Promise');

        module.exports = Promise;

    }, { "./_getNative": 107, "./_root": 144 }],
    55: [function(require, module, exports) {
        var getNative = require('./_getNative'),
            root = require('./_root');

        /* Built-in method references that are verified to be native. */
        var Set = getNative(root, 'Set');

        module.exports = Set;

    }, { "./_getNative": 107, "./_root": 144 }],
    56: [function(require, module, exports) {
        var ListCache = require('./_ListCache'),
            stackClear = require('./_stackClear'),
            stackDelete = require('./_stackDelete'),
            stackGet = require('./_stackGet'),
            stackHas = require('./_stackHas'),
            stackSet = require('./_stackSet');

        /**
         * Creates a stack cache object to store key-value pairs.
         *
         * @private
         * @constructor
         * @param {Array} [entries] The key-value pairs to cache.
         */
        function Stack(entries) {
            var data = this.__data__ = new ListCache(entries);
            this.size = data.size;
        }

        // Add methods to `Stack`.
        Stack.prototype.clear = stackClear;
        Stack.prototype['delete'] = stackDelete;
        Stack.prototype.get = stackGet;
        Stack.prototype.has = stackHas;
        Stack.prototype.set = stackSet;

        module.exports = Stack;

    }, { "./_ListCache": 51, "./_stackClear": 148, "./_stackDelete": 149, "./_stackGet": 150, "./_stackHas": 151, "./_stackSet": 152 }],
    57: [function(require, module, exports) {
        var root = require('./_root');

        /** Built-in value references. */
        var Symbol = root.Symbol;

        module.exports = Symbol;

    }, { "./_root": 144 }],
    58: [function(require, module, exports) {
        var root = require('./_root');

        /** Built-in value references. */
        var Uint8Array = root.Uint8Array;

        module.exports = Uint8Array;

    }, { "./_root": 144 }],
    59: [function(require, module, exports) {
        var getNative = require('./_getNative'),
            root = require('./_root');

        /* Built-in method references that are verified to be native. */
        var WeakMap = getNative(root, 'WeakMap');

        module.exports = WeakMap;

    }, { "./_getNative": 107, "./_root": 144 }],
    60: [function(require, module, exports) {
        /**
         * A faster alternative to `Function#apply`, this function invokes `func`
         * with the `this` binding of `thisArg` and the arguments of `args`.
         *
         * @private
         * @param {Function} func The function to invoke.
         * @param {*} thisArg The `this` binding of `func`.
         * @param {Array} args The arguments to invoke `func` with.
         * @returns {*} Returns the result of `func`.
         */
        function apply(func, thisArg, args) {
            switch (args.length) {
                case 0:
                    return func.call(thisArg);
                case 1:
                    return func.call(thisArg, args[0]);
                case 2:
                    return func.call(thisArg, args[0], args[1]);
                case 3:
                    return func.call(thisArg, args[0], args[1], args[2]);
            }
            return func.apply(thisArg, args);
        }

        module.exports = apply;

    }, {}],
    61: [function(require, module, exports) {
        /**
         * A specialized version of `_.forEach` for arrays without support for
         * iteratee shorthands.
         *
         * @private
         * @param {Array} [array] The array to iterate over.
         * @param {Function} iteratee The function invoked per iteration.
         * @returns {Array} Returns `array`.
         */
        function arrayEach(array, iteratee) {
            var index = -1,
                length = array == null ? 0 : array.length;

            while (++index < length) {
                if (iteratee(array[index], index, array) === false) {
                    break;
                }
            }
            return array;
        }

        module.exports = arrayEach;

    }, {}],
    62: [function(require, module, exports) {
        /**
         * A specialized version of `_.filter` for arrays without support for
         * iteratee shorthands.
         *
         * @private
         * @param {Array} [array] The array to iterate over.
         * @param {Function} predicate The function invoked per iteration.
         * @returns {Array} Returns the new filtered array.
         */
        function arrayFilter(array, predicate) {
            var index = -1,
                length = array == null ? 0 : array.length,
                resIndex = 0,
                result = [];

            while (++index < length) {
                var value = array[index];
                if (predicate(value, index, array)) {
                    result[resIndex++] = value;
                }
            }
            return result;
        }

        module.exports = arrayFilter;

    }, {}],
    63: [function(require, module, exports) {
        var baseTimes = require('./_baseTimes'),
            isArguments = require('./isArguments'),
            isArray = require('./isArray'),
            isBuffer = require('./isBuffer'),
            isIndex = require('./_isIndex'),
            isTypedArray = require('./isTypedArray');

        /** Used for built-in method references. */
        var objectProto = Object.prototype;

        /** Used to check objects for own properties. */
        var hasOwnProperty = objectProto.hasOwnProperty;

        /**
         * Creates an array of the enumerable property names of the array-like `value`.
         *
         * @private
         * @param {*} value The value to query.
         * @param {boolean} inherited Specify returning inherited property names.
         * @returns {Array} Returns the array of property names.
         */
        function arrayLikeKeys(value, inherited) {
            var isArr = isArray(value),
                isArg = !isArr && isArguments(value),
                isBuff = !isArr && !isArg && isBuffer(value),
                isType = !isArr && !isArg && !isBuff && isTypedArray(value),
                skipIndexes = isArr || isArg || isBuff || isType,
                result = skipIndexes ? baseTimes(value.length, String) : [],
                length = result.length;

            for (var key in value) {
                if ((inherited || hasOwnProperty.call(value, key)) &&
                    !(skipIndexes && (
                        // Safari 9 has enumerable `arguments.length` in strict mode.
                        key == 'length' ||
                        // Node.js 0.10 has enumerable non-index properties on buffers.
                        (isBuff && (key == 'offset' || key == 'parent')) ||
                        // PhantomJS 2 has enumerable non-index properties on typed arrays.
                        (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
                        // Skip index properties.
                        isIndex(key, length)
                    ))) {
                    result.push(key);
                }
            }
            return result;
        }

        module.exports = arrayLikeKeys;

    }, { "./_baseTimes": 87, "./_isIndex": 122, "./isArguments": 158, "./isArray": 159, "./isBuffer": 162, "./isTypedArray": 170 }],
    64: [function(require, module, exports) {
        /**
         * Appends the elements of `values` to `array`.
         *
         * @private
         * @param {Array} array The array to modify.
         * @param {Array} values The values to append.
         * @returns {Array} Returns `array`.
         */
        function arrayPush(array, values) {
            var index = -1,
                length = values.length,
                offset = array.length;

            while (++index < length) {
                array[offset + index] = values[index];
            }
            return array;
        }

        module.exports = arrayPush;

    }, {}],
    65: [function(require, module, exports) {
        var baseAssignValue = require('./_baseAssignValue'),
            eq = require('./eq');

        /**
         * This function is like `assignValue` except that it doesn't assign
         * `undefined` values.
         *
         * @private
         * @param {Object} object The object to modify.
         * @param {string} key The key of the property to assign.
         * @param {*} value The value to assign.
         */
        function assignMergeValue(object, key, value) {
            if ((value !== undefined && !eq(object[key], value)) ||
                (value === undefined && !(key in object))) {
                baseAssignValue(object, key, value);
            }
        }

        module.exports = assignMergeValue;

    }, { "./_baseAssignValue": 70, "./eq": 156 }],
    66: [function(require, module, exports) {
        var baseAssignValue = require('./_baseAssignValue'),
            eq = require('./eq');

        /** Used for built-in method references. */
        var objectProto = Object.prototype;

        /** Used to check objects for own properties. */
        var hasOwnProperty = objectProto.hasOwnProperty;

        /**
         * Assigns `value` to `key` of `object` if the existing value is not equivalent
         * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
         * for equality comparisons.
         *
         * @private
         * @param {Object} object The object to modify.
         * @param {string} key The key of the property to assign.
         * @param {*} value The value to assign.
         */
        function assignValue(object, key, value) {
            var objValue = object[key];
            if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
                (value === undefined && !(key in object))) {
                baseAssignValue(object, key, value);
            }
        }

        module.exports = assignValue;

    }, { "./_baseAssignValue": 70, "./eq": 156 }],
    67: [function(require, module, exports) {
        var eq = require('./eq');

        /**
         * Gets the index at which the `key` is found in `array` of key-value pairs.
         *
         * @private
         * @param {Array} array The array to inspect.
         * @param {*} key The key to search for.
         * @returns {number} Returns the index of the matched value, else `-1`.
         */
        function assocIndexOf(array, key) {
            var length = array.length;
            while (length--) {
                if (eq(array[length][0], key)) {
                    return length;
                }
            }
            return -1;
        }

        module.exports = assocIndexOf;

    }, { "./eq": 156 }],
    68: [function(require, module, exports) {
        var copyObject = require('./_copyObject'),
            keys = require('./keys');

        /**
         * The base implementation of `_.assign` without support for multiple sources
         * or `customizer` functions.
         *
         * @private
         * @param {Object} object The destination object.
         * @param {Object} source The source object.
         * @returns {Object} Returns `object`.
         */
        function baseAssign(object, source) {
            return object && copyObject(source, keys(source), object);
        }

        module.exports = baseAssign;

    }, { "./_copyObject": 96, "./keys": 171 }],
    69: [function(require, module, exports) {
        var copyObject = require('./_copyObject'),
            keysIn = require('./keysIn');

        /**
         * The base implementation of `_.assignIn` without support for multiple sources
         * or `customizer` functions.
         *
         * @private
         * @param {Object} object The destination object.
         * @param {Object} source The source object.
         * @returns {Object} Returns `object`.
         */
        function baseAssignIn(object, source) {
            return object && copyObject(source, keysIn(source), object);
        }

        module.exports = baseAssignIn;

    }, { "./_copyObject": 96, "./keysIn": 172 }],
    70: [function(require, module, exports) {
        var defineProperty = require('./_defineProperty');

        /**
         * The base implementation of `assignValue` and `assignMergeValue` without
         * value checks.
         *
         * @private
         * @param {Object} object The object to modify.
         * @param {string} key The key of the property to assign.
         * @param {*} value The value to assign.
         */
        function baseAssignValue(object, key, value) {
            if (key == '__proto__' && defineProperty) {
                defineProperty(object, key, {
                    'configurable': true,
                    'enumerable': true,
                    'value': value,
                    'writable': true
                });
            } else {
                object[key] = value;
            }
        }

        module.exports = baseAssignValue;

    }, { "./_defineProperty": 102 }],
    71: [function(require, module, exports) {
        var Stack = require('./_Stack'),
            arrayEach = require('./_arrayEach'),
            assignValue = require('./_assignValue'),
            baseAssign = require('./_baseAssign'),
            baseAssignIn = require('./_baseAssignIn'),
            cloneBuffer = require('./_cloneBuffer'),
            copyArray = require('./_copyArray'),
            copySymbols = require('./_copySymbols'),
            copySymbolsIn = require('./_copySymbolsIn'),
            getAllKeys = require('./_getAllKeys'),
            getAllKeysIn = require('./_getAllKeysIn'),
            getTag = require('./_getTag'),
            initCloneArray = require('./_initCloneArray'),
            initCloneByTag = require('./_initCloneByTag'),
            initCloneObject = require('./_initCloneObject'),
            isArray = require('./isArray'),
            isBuffer = require('./isBuffer'),
            isMap = require('./isMap'),
            isObject = require('./isObject'),
            isSet = require('./isSet'),
            keys = require('./keys'),
            keysIn = require('./keysIn');

        /** Used to compose bitmasks for cloning. */
        var CLONE_DEEP_FLAG = 1,
            CLONE_FLAT_FLAG = 2,
            CLONE_SYMBOLS_FLAG = 4;

        /** `Object#toString` result references. */
        var argsTag = '[object Arguments]',
            arrayTag = '[object Array]',
            boolTag = '[object Boolean]',
            dateTag = '[object Date]',
            errorTag = '[object Error]',
            funcTag = '[object Function]',
            genTag = '[object GeneratorFunction]',
            mapTag = '[object Map]',
            numberTag = '[object Number]',
            objectTag = '[object Object]',
            regexpTag = '[object RegExp]',
            setTag = '[object Set]',
            stringTag = '[object String]',
            symbolTag = '[object Symbol]',
            weakMapTag = '[object WeakMap]';

        var arrayBufferTag = '[object ArrayBuffer]',
            dataViewTag = '[object DataView]',
            float32Tag = '[object Float32Array]',
            float64Tag = '[object Float64Array]',
            int8Tag = '[object Int8Array]',
            int16Tag = '[object Int16Array]',
            int32Tag = '[object Int32Array]',
            uint8Tag = '[object Uint8Array]',
            uint8ClampedTag = '[object Uint8ClampedArray]',
            uint16Tag = '[object Uint16Array]',
            uint32Tag = '[object Uint32Array]';

        /** Used to identify `toStringTag` values supported by `_.clone`. */
        var cloneableTags = {};
        cloneableTags[argsTag] = cloneableTags[arrayTag] =
            cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
            cloneableTags[boolTag] = cloneableTags[dateTag] =
            cloneableTags[float32Tag] = cloneableTags[float64Tag] =
            cloneableTags[int8Tag] = cloneableTags[int16Tag] =
            cloneableTags[int32Tag] = cloneableTags[mapTag] =
            cloneableTags[numberTag] = cloneableTags[objectTag] =
            cloneableTags[regexpTag] = cloneableTags[setTag] =
            cloneableTags[stringTag] = cloneableTags[symbolTag] =
            cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
            cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
        cloneableTags[errorTag] = cloneableTags[funcTag] =
            cloneableTags[weakMapTag] = false;

        /**
         * The base implementation of `_.clone` and `_.cloneDeep` which tracks
         * traversed objects.
         *
         * @private
         * @param {*} value The value to clone.
         * @param {boolean} bitmask The bitmask flags.
         *  1 - Deep clone
         *  2 - Flatten inherited properties
         *  4 - Clone symbols
         * @param {Function} [customizer] The function to customize cloning.
         * @param {string} [key] The key of `value`.
         * @param {Object} [object] The parent object of `value`.
         * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
         * @returns {*} Returns the cloned value.
         */
        function baseClone(value, bitmask, customizer, key, object, stack) {
            var result,
                isDeep = bitmask & CLONE_DEEP_FLAG,
                isFlat = bitmask & CLONE_FLAT_FLAG,
                isFull = bitmask & CLONE_SYMBOLS_FLAG;

            if (customizer) {
                result = object ? customizer(value, key, object, stack) : customizer(value);
            }
            if (result !== undefined) {
                return result;
            }
            if (!isObject(value)) {
                return value;
            }
            var isArr = isArray(value);
            if (isArr) {
                result = initCloneArray(value);
                if (!isDeep) {
                    return copyArray(value, result);
                }
            } else {
                var tag = getTag(value),
                    isFunc = tag == funcTag || tag == genTag;

                if (isBuffer(value)) {
                    return cloneBuffer(value, isDeep);
                }
                if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
                    result = (isFlat || isFunc) ? {} : initCloneObject(value);
                    if (!isDeep) {
                        return isFlat ?
                            copySymbolsIn(value, baseAssignIn(result, value)) :
                            copySymbols(value, baseAssign(result, value));
                    }
                } else {
                    if (!cloneableTags[tag]) {
                        return object ? value : {};
                    }
                    result = initCloneByTag(value, tag, isDeep);
                }
            }
            // Check for circular references and return its corresponding clone.
            stack || (stack = new Stack);
            var stacked = stack.get(value);
            if (stacked) {
                return stacked;
            }
            stack.set(value, result);

            if (isSet(value)) {
                value.forEach(function(subValue) {
                    result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
                });
            } else if (isMap(value)) {
                value.forEach(function(subValue, key) {
                    result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack));
                });
            }

            var keysFunc = isFull ?
                (isFlat ? getAllKeysIn : getAllKeys) :
                (isFlat ? keysIn : keys);

            var props = isArr ? undefined : keysFunc(value);
            arrayEach(props || value, function(subValue, key) {
                if (props) {
                    key = subValue;
                    subValue = value[key];
                }
                // Recursively populate clone (susceptible to call stack limits).
                assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
            });
            return result;
        }

        module.exports = baseClone;

    }, { "./_Stack": 56, "./_arrayEach": 61, "./_assignValue": 66, "./_baseAssign": 68, "./_baseAssignIn": 69, "./_cloneBuffer": 90, "./_copyArray": 95, "./_copySymbols": 97, "./_copySymbolsIn": 98, "./_getAllKeys": 104, "./_getAllKeysIn": 105, "./_getTag": 112, "./_initCloneArray": 119, "./_initCloneByTag": 120, "./_initCloneObject": 121, "./isArray": 159, "./isBuffer": 162, "./isMap": 165, "./isObject": 166, "./isSet": 169, "./keys": 171, "./keysIn": 172 }],
    72: [function(require, module, exports) {
        var isObject = require('./isObject');

        /** Built-in value references. */
        var objectCreate = Object.create;

        /**
         * The base implementation of `_.create` without support for assigning
         * properties to the created object.
         *
         * @private
         * @param {Object} proto The object to inherit from.
         * @returns {Object} Returns the new object.
         */
        var baseCreate = (function() {
            function object() {}
            return function(proto) {
                if (!isObject(proto)) {
                    return {};
                }
                if (objectCreate) {
                    return objectCreate(proto);
                }
                object.prototype = proto;
                var result = new object;
                object.prototype = undefined;
                return result;
            };
        }());

        module.exports = baseCreate;

    }, { "./isObject": 166 }],
    73: [function(require, module, exports) {
        var createBaseFor = require('./_createBaseFor');

        /**
         * The base implementation of `baseForOwn` which iterates over `object`
         * properties returned by `keysFunc` and invokes `iteratee` for each property.
         * Iteratee functions may exit iteration early by explicitly returning `false`.
         *
         * @private
         * @param {Object} object The object to iterate over.
         * @param {Function} iteratee The function invoked per iteration.
         * @param {Function} keysFunc The function to get the keys of `object`.
         * @returns {Object} Returns `object`.
         */
        var baseFor = createBaseFor();

        module.exports = baseFor;

    }, { "./_createBaseFor": 101 }],
    74: [function(require, module, exports) {
        var arrayPush = require('./_arrayPush'),
            isArray = require('./isArray');

        /**
         * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
         * `keysFunc` and `symbolsFunc` to get the enumerable property names and
         * symbols of `object`.
         *
         * @private
         * @param {Object} object The object to query.
         * @param {Function} keysFunc The function to get the keys of `object`.
         * @param {Function} symbolsFunc The function to get the symbols of `object`.
         * @returns {Array} Returns the array of property names and symbols.
         */
        function baseGetAllKeys(object, keysFunc, symbolsFunc) {
            var result = keysFunc(object);
            return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
        }

        module.exports = baseGetAllKeys;

    }, { "./_arrayPush": 64, "./isArray": 159 }],
    75: [function(require, module, exports) {
        var Symbol = require('./_Symbol'),
            getRawTag = require('./_getRawTag'),
            objectToString = require('./_objectToString');

        /** `Object#toString` result references. */
        var nullTag = '[object Null]',
            undefinedTag = '[object Undefined]';

        /** Built-in value references. */
        var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

        /**
         * The base implementation of `getTag` without fallbacks for buggy environments.
         *
         * @private
         * @param {*} value The value to query.
         * @returns {string} Returns the `toStringTag`.
         */
        function baseGetTag(value) {
            if (value == null) {
                return value === undefined ? undefinedTag : nullTag;
            }
            return (symToStringTag && symToStringTag in Object(value)) ?
                getRawTag(value) :
                objectToString(value);
        }

        module.exports = baseGetTag;

    }, { "./_Symbol": 57, "./_getRawTag": 109, "./_objectToString": 141 }],
    76: [function(require, module, exports) {
        var baseGetTag = require('./_baseGetTag'),
            isObjectLike = require('./isObjectLike');

        /** `Object#toString` result references. */
        var argsTag = '[object Arguments]';

        /**
         * The base implementation of `_.isArguments`.
         *
         * @private
         * @param {*} value The value to check.
         * @returns {boolean} Returns `true` if `value` is an `arguments` object,
         */
        function baseIsArguments(value) {
            return isObjectLike(value) && baseGetTag(value) == argsTag;
        }

        module.exports = baseIsArguments;

    }, { "./_baseGetTag": 75, "./isObjectLike": 167 }],
    77: [function(require, module, exports) {
        var getTag = require('./_getTag'),
            isObjectLike = require('./isObjectLike');

        /** `Object#toString` result references. */
        var mapTag = '[object Map]';

        /**
         * The base implementation of `_.isMap` without Node.js optimizations.
         *
         * @private
         * @param {*} value The value to check.
         * @returns {boolean} Returns `true` if `value` is a map, else `false`.
         */
        function baseIsMap(value) {
            return isObjectLike(value) && getTag(value) == mapTag;
        }

        module.exports = baseIsMap;

    }, { "./_getTag": 112, "./isObjectLike": 167 }],
    78: [function(require, module, exports) {
        var isFunction = require('./isFunction'),
            isMasked = require('./_isMasked'),
            isObject = require('./isObject'),
            toSource = require('./_toSource');

        /**
         * Used to match `RegExp`
         * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
         */
        var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

        /** Used to detect host constructors (Safari). */
        var reIsHostCtor = /^\[object .+?Constructor\]$/;

        /** Used for built-in method references. */
        var funcProto = Function.prototype,
            objectProto = Object.prototype;

        /** Used to resolve the decompiled source of functions. */
        var funcToString = funcProto.toString;

        /** Used to check objects for own properties. */
        var hasOwnProperty = objectProto.hasOwnProperty;

        /** Used to detect if a method is native. */
        var reIsNative = RegExp('^' +
            funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
            .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
        );

        /**
         * The base implementation of `_.isNative` without bad shim checks.
         *
         * @private
         * @param {*} value The value to check.
         * @returns {boolean} Returns `true` if `value` is a native function,
         *  else `false`.
         */
        function baseIsNative(value) {
            if (!isObject(value) || isMasked(value)) {
                return false;
            }
            var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
            return pattern.test(toSource(value));
        }

        module.exports = baseIsNative;

    }, { "./_isMasked": 125, "./_toSource": 153, "./isFunction": 163, "./isObject": 166 }],
    79: [function(require, module, exports) {
        var getTag = require('./_getTag'),
            isObjectLike = require('./isObjectLike');

        /** `Object#toString` result references. */
        var setTag = '[object Set]';

        /**
         * The base implementation of `_.isSet` without Node.js optimizations.
         *
         * @private
         * @param {*} value The value to check.
         * @returns {boolean} Returns `true` if `value` is a set, else `false`.
         */
        function baseIsSet(value) {
            return isObjectLike(value) && getTag(value) == setTag;
        }

        module.exports = baseIsSet;

    }, { "./_getTag": 112, "./isObjectLike": 167 }],
    80: [function(require, module, exports) {
        var baseGetTag = require('./_baseGetTag'),
            isLength = require('./isLength'),
            isObjectLike = require('./isObjectLike');

        /** `Object#toString` result references. */
        var argsTag = '[object Arguments]',
            arrayTag = '[object Array]',
            boolTag = '[object Boolean]',
            dateTag = '[object Date]',
            errorTag = '[object Error]',
            funcTag = '[object Function]',
            mapTag = '[object Map]',
            numberTag = '[object Number]',
            objectTag = '[object Object]',
            regexpTag = '[object RegExp]',
            setTag = '[object Set]',
            stringTag = '[object String]',
            weakMapTag = '[object WeakMap]';

        var arrayBufferTag = '[object ArrayBuffer]',
            dataViewTag = '[object DataView]',
            float32Tag = '[object Float32Array]',
            float64Tag = '[object Float64Array]',
            int8Tag = '[object Int8Array]',
            int16Tag = '[object Int16Array]',
            int32Tag = '[object Int32Array]',
            uint8Tag = '[object Uint8Array]',
            uint8ClampedTag = '[object Uint8ClampedArray]',
            uint16Tag = '[object Uint16Array]',
            uint32Tag = '[object Uint32Array]';

        /** Used to identify `toStringTag` values of typed arrays. */
        var typedArrayTags = {};
        typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
            typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
            typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
            typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
            typedArrayTags[uint32Tag] = true;
        typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
            typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
            typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
            typedArrayTags[errorTag] = typedArrayTags[funcTag] =
            typedArrayTags[mapTag] = typedArrayTags[numberTag] =
            typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
            typedArrayTags[setTag] = typedArrayTags[stringTag] =
            typedArrayTags[weakMapTag] = false;

        /**
         * The base implementation of `_.isTypedArray` without Node.js optimizations.
         *
         * @private
         * @param {*} value The value to check.
         * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
         */
        function baseIsTypedArray(value) {
            return isObjectLike(value) &&
                isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
        }

        module.exports = baseIsTypedArray;

    }, { "./_baseGetTag": 75, "./isLength": 164, "./isObjectLike": 167 }],
    81: [function(require, module, exports) {
        var isPrototype = require('./_isPrototype'),
            nativeKeys = require('./_nativeKeys');

        /** Used for built-in method references. */
        var objectProto = Object.prototype;

        /** Used to check objects for own properties. */
        var hasOwnProperty = objectProto.hasOwnProperty;

        /**
         * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
         *
         * @private
         * @param {Object} object The object to query.
         * @returns {Array} Returns the array of property names.
         */
        function baseKeys(object) {
            if (!isPrototype(object)) {
                return nativeKeys(object);
            }
            var result = [];
            for (var key in Object(object)) {
                if (hasOwnProperty.call(object, key) && key != 'constructor') {
                    result.push(key);
                }
            }
            return result;
        }

        module.exports = baseKeys;

    }, { "./_isPrototype": 126, "./_nativeKeys": 138 }],
    82: [function(require, module, exports) {
        var isObject = require('./isObject'),
            isPrototype = require('./_isPrototype'),
            nativeKeysIn = require('./_nativeKeysIn');

        /** Used for built-in method references. */
        var objectProto = Object.prototype;

        /** Used to check objects for own properties. */
        var hasOwnProperty = objectProto.hasOwnProperty;

        /**
         * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
         *
         * @private
         * @param {Object} object The object to query.
         * @returns {Array} Returns the array of property names.
         */
        function baseKeysIn(object) {
            if (!isObject(object)) {
                return nativeKeysIn(object);
            }
            var isProto = isPrototype(object),
                result = [];

            for (var key in object) {
                if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
                    result.push(key);
                }
            }
            return result;
        }

        module.exports = baseKeysIn;

    }, { "./_isPrototype": 126, "./_nativeKeysIn": 139, "./isObject": 166 }],
    83: [function(require, module, exports) {
        var Stack = require('./_Stack'),
            assignMergeValue = require('./_assignMergeValue'),
            baseFor = require('./_baseFor'),
            baseMergeDeep = require('./_baseMergeDeep'),
            isObject = require('./isObject'),
            keysIn = require('./keysIn'),
            safeGet = require('./_safeGet');

        /**
         * The base implementation of `_.merge` without support for multiple sources.
         *
         * @private
         * @param {Object} object The destination object.
         * @param {Object} source The source object.
         * @param {number} srcIndex The index of `source`.
         * @param {Function} [customizer] The function to customize merged values.
         * @param {Object} [stack] Tracks traversed source values and their merged
         *  counterparts.
         */
        function baseMerge(object, source, srcIndex, customizer, stack) {
            if (object === source) {
                return;
            }
            baseFor(source, function(srcValue, key) {
                stack || (stack = new Stack);
                if (isObject(srcValue)) {
                    baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
                } else {
                    var newValue = customizer ?
                        customizer(safeGet(object, key), srcValue, (key + ''), object, source, stack) :
                        undefined;

                    if (newValue === undefined) {
                        newValue = srcValue;
                    }
                    assignMergeValue(object, key, newValue);
                }
            }, keysIn);
        }

        module.exports = baseMerge;

    }, { "./_Stack": 56, "./_assignMergeValue": 65, "./_baseFor": 73, "./_baseMergeDeep": 84, "./_safeGet": 145, "./isObject": 166, "./keysIn": 172 }],
    84: [function(require, module, exports) {
        var assignMergeValue = require('./_assignMergeValue'),
            cloneBuffer = require('./_cloneBuffer'),
            cloneTypedArray = require('./_cloneTypedArray'),
            copyArray = require('./_copyArray'),
            initCloneObject = require('./_initCloneObject'),
            isArguments = require('./isArguments'),
            isArray = require('./isArray'),
            isArrayLikeObject = require('./isArrayLikeObject'),
            isBuffer = require('./isBuffer'),
            isFunction = require('./isFunction'),
            isObject = require('./isObject'),
            isPlainObject = require('./isPlainObject'),
            isTypedArray = require('./isTypedArray'),
            safeGet = require('./_safeGet'),
            toPlainObject = require('./toPlainObject');

        /**
         * A specialized version of `baseMerge` for arrays and objects which performs
         * deep merges and tracks traversed objects enabling objects with circular
         * references to be merged.
         *
         * @private
         * @param {Object} object The destination object.
         * @param {Object} source The source object.
         * @param {string} key The key of the value to merge.
         * @param {number} srcIndex The index of `source`.
         * @param {Function} mergeFunc The function to merge values.
         * @param {Function} [customizer] The function to customize assigned values.
         * @param {Object} [stack] Tracks traversed source values and their merged
         *  counterparts.
         */
        function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
            var objValue = safeGet(object, key),
                srcValue = safeGet(source, key),
                stacked = stack.get(srcValue);

            if (stacked) {
                assignMergeValue(object, key, stacked);
                return;
            }
            var newValue = customizer ?
                customizer(objValue, srcValue, (key + ''), object, source, stack) :
                undefined;

            var isCommon = newValue === undefined;

            if (isCommon) {
                var isArr = isArray(srcValue),
                    isBuff = !isArr && isBuffer(srcValue),
                    isTyped = !isArr && !isBuff && isTypedArray(srcValue);

                newValue = srcValue;
                if (isArr || isBuff || isTyped) {
                    if (isArray(objValue)) {
                        newValue = objValue;
                    } else if (isArrayLikeObject(objValue)) {
                        newValue = copyArray(objValue);
                    } else if (isBuff) {
                        isCommon = false;
                        newValue = cloneBuffer(srcValue, true);
                    } else if (isTyped) {
                        isCommon = false;
                        newValue = cloneTypedArray(srcValue, true);
                    } else {
                        newValue = [];
                    }
                } else if (isPlainObject(srcValue) || isArguments(srcValue)) {
                    newValue = objValue;
                    if (isArguments(objValue)) {
                        newValue = toPlainObject(objValue);
                    } else if (!isObject(objValue) || isFunction(objValue)) {
                        newValue = initCloneObject(srcValue);
                    }
                } else {
                    isCommon = false;
                }
            }
            if (isCommon) {
                // Recursively merge objects and arrays (susceptible to call stack limits).
                stack.set(srcValue, newValue);
                mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
                stack['delete'](srcValue);
            }
            assignMergeValue(object, key, newValue);
        }

        module.exports = baseMergeDeep;

    }, { "./_assignMergeValue": 65, "./_cloneBuffer": 90, "./_cloneTypedArray": 94, "./_copyArray": 95, "./_initCloneObject": 121, "./_safeGet": 145, "./isArguments": 158, "./isArray": 159, "./isArrayLikeObject": 161, "./isBuffer": 162, "./isFunction": 163, "./isObject": 166, "./isPlainObject": 168, "./isTypedArray": 170, "./toPlainObject": 176 }],
    85: [function(require, module, exports) {
        var identity = require('./identity'),
            overRest = require('./_overRest'),
            setToString = require('./_setToString');

        /**
         * The base implementation of `_.rest` which doesn't validate or coerce arguments.
         *
         * @private
         * @param {Function} func The function to apply a rest parameter to.
         * @param {number} [start=func.length-1] The start position of the rest parameter.
         * @returns {Function} Returns the new function.
         */
        function baseRest(func, start) {
            return setToString(overRest(func, start, identity), func + '');
        }

        module.exports = baseRest;

    }, { "./_overRest": 143, "./_setToString": 146, "./identity": 157 }],
    86: [function(require, module, exports) {
        var constant = require('./constant'),
            defineProperty = require('./_defineProperty'),
            identity = require('./identity');

        /**
         * The base implementation of `setToString` without support for hot loop shorting.
         *
         * @private
         * @param {Function} func The function to modify.
         * @param {Function} string The `toString` result.
         * @returns {Function} Returns `func`.
         */
        var baseSetToString = !defineProperty ? identity : function(func, string) {
            return defineProperty(func, 'toString', {
                'configurable': true,
                'enumerable': false,
                'value': constant(string),
                'writable': true
            });
        };

        module.exports = baseSetToString;

    }, { "./_defineProperty": 102, "./constant": 155, "./identity": 157 }],
    87: [function(require, module, exports) {
        /**
         * The base implementation of `_.times` without support for iteratee shorthands
         * or max array length checks.
         *
         * @private
         * @param {number} n The number of times to invoke `iteratee`.
         * @param {Function} iteratee The function invoked per iteration.
         * @returns {Array} Returns the array of results.
         */
        function baseTimes(n, iteratee) {
            var index = -1,
                result = Array(n);

            while (++index < n) {
                result[index] = iteratee(index);
            }
            return result;
        }

        module.exports = baseTimes;

    }, {}],
    88: [function(require, module, exports) {
        /**
         * The base implementation of `_.unary` without support for storing metadata.
         *
         * @private
         * @param {Function} func The function to cap arguments for.
         * @returns {Function} Returns the new capped function.
         */
        function baseUnary(func) {
            return function(value) {
                return func(value);
            };
        }

        module.exports = baseUnary;

    }, {}],
    89: [function(require, module, exports) {
        var Uint8Array = require('./_Uint8Array');

        /**
         * Creates a clone of `arrayBuffer`.
         *
         * @private
         * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
         * @returns {ArrayBuffer} Returns the cloned array buffer.
         */
        function cloneArrayBuffer(arrayBuffer) {
            var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
            new Uint8Array(result).set(new Uint8Array(arrayBuffer));
            return result;
        }

        module.exports = cloneArrayBuffer;

    }, { "./_Uint8Array": 58 }],
    90: [function(require, module, exports) {
        var root = require('./_root');

        /** Detect free variable `exports`. */
        var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

        /** Detect free variable `module`. */
        var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

        /** Detect the popular CommonJS extension `module.exports`. */
        var moduleExports = freeModule && freeModule.exports === freeExports;

        /** Built-in value references. */
        var Buffer = moduleExports ? root.Buffer : undefined,
            allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;

        /**
         * Creates a clone of  `buffer`.
         *
         * @private
         * @param {Buffer} buffer The buffer to clone.
         * @param {boolean} [isDeep] Specify a deep clone.
         * @returns {Buffer} Returns the cloned buffer.
         */
        function cloneBuffer(buffer, isDeep) {
            if (isDeep) {
                return buffer.slice();
            }
            var length = buffer.length,
                result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

            buffer.copy(result);
            return result;
        }

        module.exports = cloneBuffer;

    }, { "./_root": 144 }],
    91: [function(require, module, exports) {
        var cloneArrayBuffer = require('./_cloneArrayBuffer');

        /**
         * Creates a clone of `dataView`.
         *
         * @private
         * @param {Object} dataView The data view to clone.
         * @param {boolean} [isDeep] Specify a deep clone.
         * @returns {Object} Returns the cloned data view.
         */
        function cloneDataView(dataView, isDeep) {
            var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
            return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
        }

        module.exports = cloneDataView;

    }, { "./_cloneArrayBuffer": 89 }],
    92: [function(require, module, exports) {
        /** Used to match `RegExp` flags from their coerced string values. */
        var reFlags = /\w*$/;

        /**
         * Creates a clone of `regexp`.
         *
         * @private
         * @param {Object} regexp The regexp to clone.
         * @returns {Object} Returns the cloned regexp.
         */
        function cloneRegExp(regexp) {
            var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
            result.lastIndex = regexp.lastIndex;
            return result;
        }

        module.exports = cloneRegExp;

    }, {}],
    93: [function(require, module, exports) {
        var Symbol = require('./_Symbol');

        /** Used to convert symbols to primitives and strings. */
        var symbolProto = Symbol ? Symbol.prototype : undefined,
            symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

        /**
         * Creates a clone of the `symbol` object.
         *
         * @private
         * @param {Object} symbol The symbol object to clone.
         * @returns {Object} Returns the cloned symbol object.
         */
        function cloneSymbol(symbol) {
            return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
        }

        module.exports = cloneSymbol;

    }, { "./_Symbol": 57 }],
    94: [function(require, module, exports) {
        var cloneArrayBuffer = require('./_cloneArrayBuffer');

        /**
         * Creates a clone of `typedArray`.
         *
         * @private
         * @param {Object} typedArray The typed array to clone.
         * @param {boolean} [isDeep] Specify a deep clone.
         * @returns {Object} Returns the cloned typed array.
         */
        function cloneTypedArray(typedArray, isDeep) {
            var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
            return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
        }

        module.exports = cloneTypedArray;

    }, { "./_cloneArrayBuffer": 89 }],
    95: [function(require, module, exports) {
        /**
         * Copies the values of `source` to `array`.
         *
         * @private
         * @param {Array} source The array to copy values from.
         * @param {Array} [array=[]] The array to copy values to.
         * @returns {Array} Returns `array`.
         */
        function copyArray(source, array) {
            var index = -1,
                length = source.length;

            array || (array = Array(length));
            while (++index < length) {
                array[index] = source[index];
            }
            return array;
        }

        module.exports = copyArray;

    }, {}],
    96: [function(require, module, exports) {
        var assignValue = require('./_assignValue'),
            baseAssignValue = require('./_baseAssignValue');

        /**
         * Copies properties of `source` to `object`.
         *
         * @private
         * @param {Object} source The object to copy properties from.
         * @param {Array} props The property identifiers to copy.
         * @param {Object} [object={}] The object to copy properties to.
         * @param {Function} [customizer] The function to customize copied values.
         * @returns {Object} Returns `object`.
         */
        function copyObject(source, props, object, customizer) {
            var isNew = !object;
            object || (object = {});

            var index = -1,
                length = props.length;

            while (++index < length) {
                var key = props[index];

                var newValue = customizer ?
                    customizer(object[key], source[key], key, object, source) :
                    undefined;

                if (newValue === undefined) {
                    newValue = source[key];
                }
                if (isNew) {
                    baseAssignValue(object, key, newValue);
                } else {
                    assignValue(object, key, newValue);
                }
            }
            return object;
        }

        module.exports = copyObject;

    }, { "./_assignValue": 66, "./_baseAssignValue": 70 }],
    97: [function(require, module, exports) {
        var copyObject = require('./_copyObject'),
            getSymbols = require('./_getSymbols');

        /**
         * Copies own symbols of `source` to `object`.
         *
         * @private
         * @param {Object} source The object to copy symbols from.
         * @param {Object} [object={}] The object to copy symbols to.
         * @returns {Object} Returns `object`.
         */
        function copySymbols(source, object) {
            return copyObject(source, getSymbols(source), object);
        }

        module.exports = copySymbols;

    }, { "./_copyObject": 96, "./_getSymbols": 110 }],
    98: [function(require, module, exports) {
        var copyObject = require('./_copyObject'),
            getSymbolsIn = require('./_getSymbolsIn');

        /**
         * Copies own and inherited symbols of `source` to `object`.
         *
         * @private
         * @param {Object} source The object to copy symbols from.
         * @param {Object} [object={}] The object to copy symbols to.
         * @returns {Object} Returns `object`.
         */
        function copySymbolsIn(source, object) {
            return copyObject(source, getSymbolsIn(source), object);
        }

        module.exports = copySymbolsIn;

    }, { "./_copyObject": 96, "./_getSymbolsIn": 111 }],
    99: [function(require, module, exports) {
        var root = require('./_root');

        /** Used to detect overreaching core-js shims. */
        var coreJsData = root['__core-js_shared__'];

        module.exports = coreJsData;

    }, { "./_root": 144 }],
    100: [function(require, module, exports) {
        var baseRest = require('./_baseRest'),
            isIterateeCall = require('./_isIterateeCall');

        /**
         * Creates a function like `_.assign`.
         *
         * @private
         * @param {Function} assigner The function to assign values.
         * @returns {Function} Returns the new assigner function.
         */
        function createAssigner(assigner) {
            return baseRest(function(object, sources) {
                var index = -1,
                    length = sources.length,
                    customizer = length > 1 ? sources[length - 1] : undefined,
                    guard = length > 2 ? sources[2] : undefined;

                customizer = (assigner.length > 3 && typeof customizer == 'function') ?
                    (length--, customizer) :
                    undefined;

                if (guard && isIterateeCall(sources[0], sources[1], guard)) {
                    customizer = length < 3 ? undefined : customizer;
                    length = 1;
                }
                object = Object(object);
                while (++index < length) {
                    var source = sources[index];
                    if (source) {
                        assigner(object, source, index, customizer);
                    }
                }
                return object;
            });
        }

        module.exports = createAssigner;

    }, { "./_baseRest": 85, "./_isIterateeCall": 123 }],
    101: [function(require, module, exports) {
        /**
         * Creates a base function for methods like `_.forIn` and `_.forOwn`.
         *
         * @private
         * @param {boolean} [fromRight] Specify iterating from right to left.
         * @returns {Function} Returns the new base function.
         */
        function createBaseFor(fromRight) {
            return function(object, iteratee, keysFunc) {
                var index = -1,
                    iterable = Object(object),
                    props = keysFunc(object),
                    length = props.length;

                while (length--) {
                    var key = props[fromRight ? length : ++index];
                    if (iteratee(iterable[key], key, iterable) === false) {
                        break;
                    }
                }
                return object;
            };
        }

        module.exports = createBaseFor;

    }, {}],
    102: [function(require, module, exports) {
        var getNative = require('./_getNative');

        var defineProperty = (function() {
            try {
                var func = getNative(Object, 'defineProperty');
                func({}, '', {});
                return func;
            } catch (e) {}
        }());

        module.exports = defineProperty;

    }, { "./_getNative": 107 }],
    103: [function(require, module, exports) {
        (function(global) {
            (function() {
                /** Detect free variable `global` from Node.js. */
                var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

                module.exports = freeGlobal;

            }).call(this)
        }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
    }, {}],
    104: [function(require, module, exports) {
        var baseGetAllKeys = require('./_baseGetAllKeys'),
            getSymbols = require('./_getSymbols'),
            keys = require('./keys');

        /**
         * Creates an array of own enumerable property names and symbols of `object`.
         *
         * @private
         * @param {Object} object The object to query.
         * @returns {Array} Returns the array of property names and symbols.
         */
        function getAllKeys(object) {
            return baseGetAllKeys(object, keys, getSymbols);
        }

        module.exports = getAllKeys;

    }, { "./_baseGetAllKeys": 74, "./_getSymbols": 110, "./keys": 171 }],
    105: [function(require, module, exports) {
        var baseGetAllKeys = require('./_baseGetAllKeys'),
            getSymbolsIn = require('./_getSymbolsIn'),
            keysIn = require('./keysIn');

        /**
         * Creates an array of own and inherited enumerable property names and
         * symbols of `object`.
         *
         * @private
         * @param {Object} object The object to query.
         * @returns {Array} Returns the array of property names and symbols.
         */
        function getAllKeysIn(object) {
            return baseGetAllKeys(object, keysIn, getSymbolsIn);
        }

        module.exports = getAllKeysIn;

    }, { "./_baseGetAllKeys": 74, "./_getSymbolsIn": 111, "./keysIn": 172 }],
    106: [function(require, module, exports) {
        var isKeyable = require('./_isKeyable');

        /**
         * Gets the data for `map`.
         *
         * @private
         * @param {Object} map The map to query.
         * @param {string} key The reference key.
         * @returns {*} Returns the map data.
         */
        function getMapData(map, key) {
            var data = map.__data__;
            return isKeyable(key) ?
                data[typeof key == 'string' ? 'string' : 'hash'] :
                data.map;
        }

        module.exports = getMapData;

    }, { "./_isKeyable": 124 }],
    107: [function(require, module, exports) {
        var baseIsNative = require('./_baseIsNative'),
            getValue = require('./_getValue');

        /**
         * Gets the native function at `key` of `object`.
         *
         * @private
         * @param {Object} object The object to query.
         * @param {string} key The key of the method to get.
         * @returns {*} Returns the function if it's native, else `undefined`.
         */
        function getNative(object, key) {
            var value = getValue(object, key);
            return baseIsNative(value) ? value : undefined;
        }

        module.exports = getNative;

    }, { "./_baseIsNative": 78, "./_getValue": 113 }],
    108: [function(require, module, exports) {
        var overArg = require('./_overArg');

        /** Built-in value references. */
        var getPrototype = overArg(Object.getPrototypeOf, Object);

        module.exports = getPrototype;

    }, { "./_overArg": 142 }],
    109: [function(require, module, exports) {
        var Symbol = require('./_Symbol');

        /** Used for built-in method references. */
        var objectProto = Object.prototype;

        /** Used to check objects for own properties. */
        var hasOwnProperty = objectProto.hasOwnProperty;

        /**
         * Used to resolve the
         * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
         * of values.
         */
        var nativeObjectToString = objectProto.toString;

        /** Built-in value references. */
        var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

        /**
         * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
         *
         * @private
         * @param {*} value The value to query.
         * @returns {string} Returns the raw `toStringTag`.
         */
        function getRawTag(value) {
            var isOwn = hasOwnProperty.call(value, symToStringTag),
                tag = value[symToStringTag];

            try {
                value[symToStringTag] = undefined;
                var unmasked = true;
            } catch (e) {}

            var result = nativeObjectToString.call(value);
            if (unmasked) {
                if (isOwn) {
                    value[symToStringTag] = tag;
                } else {
                    delete value[symToStringTag];
                }
            }
            return result;
        }

        module.exports = getRawTag;

    }, { "./_Symbol": 57 }],
    110: [function(require, module, exports) {
        var arrayFilter = require('./_arrayFilter'),
            stubArray = require('./stubArray');

        /** Used for built-in method references. */
        var objectProto = Object.prototype;

        /** Built-in value references. */
        var propertyIsEnumerable = objectProto.propertyIsEnumerable;

        /* Built-in method references for those with the same name as other `lodash` methods. */
        var nativeGetSymbols = Object.getOwnPropertySymbols;

        /**
         * Creates an array of the own enumerable symbols of `object`.
         *
         * @private
         * @param {Object} object The object to query.
         * @returns {Array} Returns the array of symbols.
         */
        var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
            if (object == null) {
                return [];
            }
            object = Object(object);
            return arrayFilter(nativeGetSymbols(object), function(symbol) {
                return propertyIsEnumerable.call(object, symbol);
            });
        };

        module.exports = getSymbols;

    }, { "./_arrayFilter": 62, "./stubArray": 174 }],
    111: [function(require, module, exports) {
        var arrayPush = require('./_arrayPush'),
            getPrototype = require('./_getPrototype'),
            getSymbols = require('./_getSymbols'),
            stubArray = require('./stubArray');

        /* Built-in method references for those with the same name as other `lodash` methods. */
        var nativeGetSymbols = Object.getOwnPropertySymbols;

        /**
         * Creates an array of the own and inherited enumerable symbols of `object`.
         *
         * @private
         * @param {Object} object The object to query.
         * @returns {Array} Returns the array of symbols.
         */
        var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
            var result = [];
            while (object) {
                arrayPush(result, getSymbols(object));
                object = getPrototype(object);
            }
            return result;
        };

        module.exports = getSymbolsIn;

    }, { "./_arrayPush": 64, "./_getPrototype": 108, "./_getSymbols": 110, "./stubArray": 174 }],
    112: [function(require, module, exports) {
        var DataView = require('./_DataView'),
            Map = require('./_Map'),
            Promise = require('./_Promise'),
            Set = require('./_Set'),
            WeakMap = require('./_WeakMap'),
            baseGetTag = require('./_baseGetTag'),
            toSource = require('./_toSource');

        /** `Object#toString` result references. */
        var mapTag = '[object Map]',
            objectTag = '[object Object]',
            promiseTag = '[object Promise]',
            setTag = '[object Set]',
            weakMapTag = '[object WeakMap]';

        var dataViewTag = '[object DataView]';

        /** Used to detect maps, sets, and weakmaps. */
        var dataViewCtorString = toSource(DataView),
            mapCtorString = toSource(Map),
            promiseCtorString = toSource(Promise),
            setCtorString = toSource(Set),
            weakMapCtorString = toSource(WeakMap);

        /**
         * Gets the `toStringTag` of `value`.
         *
         * @private
         * @param {*} value The value to query.
         * @returns {string} Returns the `toStringTag`.
         */
        var getTag = baseGetTag;

        // Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
        if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
            (Map && getTag(new Map) != mapTag) ||
            (Promise && getTag(Promise.resolve()) != promiseTag) ||
            (Set && getTag(new Set) != setTag) ||
            (WeakMap && getTag(new WeakMap) != weakMapTag)) {
            getTag = function(value) {
                var result = baseGetTag(value),
                    Ctor = result == objectTag ? value.constructor : undefined,
                    ctorString = Ctor ? toSource(Ctor) : '';

                if (ctorString) {
                    switch (ctorString) {
                        case dataViewCtorString:
                            return dataViewTag;
                        case mapCtorString:
                            return mapTag;
                        case promiseCtorString:
                            return promiseTag;
                        case setCtorString:
                            return setTag;
                        case weakMapCtorString:
                            return weakMapTag;
                    }
                }
                return result;
            };
        }

        module.exports = getTag;

    }, { "./_DataView": 49, "./_Map": 52, "./_Promise": 54, "./_Set": 55, "./_WeakMap": 59, "./_baseGetTag": 75, "./_toSource": 153 }],
    113: [function(require, module, exports) {
        /**
         * Gets the value at `key` of `object`.
         *
         * @private
         * @param {Object} [object] The object to query.
         * @param {string} key The key of the property to get.
         * @returns {*} Returns the property value.
         */
        function getValue(object, key) {
            return object == null ? undefined : object[key];
        }

        module.exports = getValue;

    }, {}],
    114: [function(require, module, exports) {
        var nativeCreate = require('./_nativeCreate');

        /**
         * Removes all key-value entries from the hash.
         *
         * @private
         * @name clear
         * @memberOf Hash
         */
        function hashClear() {
            this.__data__ = nativeCreate ? nativeCreate(null) : {};
            this.size = 0;
        }

        module.exports = hashClear;

    }, { "./_nativeCreate": 137 }],
    115: [function(require, module, exports) {
        /**
         * Removes `key` and its value from the hash.
         *
         * @private
         * @name delete
         * @memberOf Hash
         * @param {Object} hash The hash to modify.
         * @param {string} key The key of the value to remove.
         * @returns {boolean} Returns `true` if the entry was removed, else `false`.
         */
        function hashDelete(key) {
            var result = this.has(key) && delete this.__data__[key];
            this.size -= result ? 1 : 0;
            return result;
        }

        module.exports = hashDelete;

    }, {}],
    116: [function(require, module, exports) {
        var nativeCreate = require('./_nativeCreate');

        /** Used to stand-in for `undefined` hash values. */
        var HASH_UNDEFINED = '__lodash_hash_undefined__';

        /** Used for built-in method references. */
        var objectProto = Object.prototype;

        /** Used to check objects for own properties. */
        var hasOwnProperty = objectProto.hasOwnProperty;

        /**
         * Gets the hash value for `key`.
         *
         * @private
         * @name get
         * @memberOf Hash
         * @param {string} key The key of the value to get.
         * @returns {*} Returns the entry value.
         */
        function hashGet(key) {
            var data = this.__data__;
            if (nativeCreate) {
                var result = data[key];
                return result === HASH_UNDEFINED ? undefined : result;
            }
            return hasOwnProperty.call(data, key) ? data[key] : undefined;
        }

        module.exports = hashGet;

    }, { "./_nativeCreate": 137 }],
    117: [function(require, module, exports) {
        var nativeCreate = require('./_nativeCreate');

        /** Used for built-in method references. */
        var objectProto = Object.prototype;

        /** Used to check objects for own properties. */
        var hasOwnProperty = objectProto.hasOwnProperty;

        /**
         * Checks if a hash value for `key` exists.
         *
         * @private
         * @name has
         * @memberOf Hash
         * @param {string} key The key of the entry to check.
         * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
         */
        function hashHas(key) {
            var data = this.__data__;
            return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
        }

        module.exports = hashHas;

    }, { "./_nativeCreate": 137 }],
    118: [function(require, module, exports) {
        var nativeCreate = require('./_nativeCreate');

        /** Used to stand-in for `undefined` hash values. */
        var HASH_UNDEFINED = '__lodash_hash_undefined__';

        /**
         * Sets the hash `key` to `value`.
         *
         * @private
         * @name set
         * @memberOf Hash
         * @param {string} key The key of the value to set.
         * @param {*} value The value to set.
         * @returns {Object} Returns the hash instance.
         */
        function hashSet(key, value) {
            var data = this.__data__;
            this.size += this.has(key) ? 0 : 1;
            data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
            return this;
        }

        module.exports = hashSet;

    }, { "./_nativeCreate": 137 }],
    119: [function(require, module, exports) {
        /** Used for built-in method references. */
        var objectProto = Object.prototype;

        /** Used to check objects for own properties. */
        var hasOwnProperty = objectProto.hasOwnProperty;

        /**
         * Initializes an array clone.
         *
         * @private
         * @param {Array} array The array to clone.
         * @returns {Array} Returns the initialized clone.
         */
        function initCloneArray(array) {
            var length = array.length,
                result = new array.constructor(length);

            // Add properties assigned by `RegExp#exec`.
            if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
                result.index = array.index;
                result.input = array.input;
            }
            return result;
        }

        module.exports = initCloneArray;

    }, {}],
    120: [function(require, module, exports) {
        var cloneArrayBuffer = require('./_cloneArrayBuffer'),
            cloneDataView = require('./_cloneDataView'),
            cloneRegExp = require('./_cloneRegExp'),
            cloneSymbol = require('./_cloneSymbol'),
            cloneTypedArray = require('./_cloneTypedArray');

        /** `Object#toString` result references. */
        var boolTag = '[object Boolean]',
            dateTag = '[object Date]',
            mapTag = '[object Map]',
            numberTag = '[object Number]',
            regexpTag = '[object RegExp]',
            setTag = '[object Set]',
            stringTag = '[object String]',
            symbolTag = '[object Symbol]';

        var arrayBufferTag = '[object ArrayBuffer]',
            dataViewTag = '[object DataView]',
            float32Tag = '[object Float32Array]',
            float64Tag = '[object Float64Array]',
            int8Tag = '[object Int8Array]',
            int16Tag = '[object Int16Array]',
            int32Tag = '[object Int32Array]',
            uint8Tag = '[object Uint8Array]',
            uint8ClampedTag = '[object Uint8ClampedArray]',
            uint16Tag = '[object Uint16Array]',
            uint32Tag = '[object Uint32Array]';

        /**
         * Initializes an object clone based on its `toStringTag`.
         *
         * **Note:** This function only supports cloning values with tags of
         * `Boolean`, `Date`, `Error`, `Map`, `Number`, `RegExp`, `Set`, or `String`.
         *
         * @private
         * @param {Object} object The object to clone.
         * @param {string} tag The `toStringTag` of the object to clone.
         * @param {boolean} [isDeep] Specify a deep clone.
         * @returns {Object} Returns the initialized clone.
         */
        function initCloneByTag(object, tag, isDeep) {
            var Ctor = object.constructor;
            switch (tag) {
                case arrayBufferTag:
                    return cloneArrayBuffer(object);

                case boolTag:
                case dateTag:
                    return new Ctor(+object);

                case dataViewTag:
                    return cloneDataView(object, isDeep);

                case float32Tag:
                case float64Tag:
                case int8Tag:
                case int16Tag:
                case int32Tag:
                case uint8Tag:
                case uint8ClampedTag:
                case uint16Tag:
                case uint32Tag:
                    return cloneTypedArray(object, isDeep);

                case mapTag:
                    return new Ctor;

                case numberTag:
                case stringTag:
                    return new Ctor(object);

                case regexpTag:
                    return cloneRegExp(object);

                case setTag:
                    return new Ctor;

                case symbolTag:
                    return cloneSymbol(object);
            }
        }

        module.exports = initCloneByTag;

    }, { "./_cloneArrayBuffer": 89, "./_cloneDataView": 91, "./_cloneRegExp": 92, "./_cloneSymbol": 93, "./_cloneTypedArray": 94 }],
    121: [function(require, module, exports) {
        var baseCreate = require('./_baseCreate'),
            getPrototype = require('./_getPrototype'),
            isPrototype = require('./_isPrototype');

        /**
         * Initializes an object clone.
         *
         * @private
         * @param {Object} object The object to clone.
         * @returns {Object} Returns the initialized clone.
         */
        function initCloneObject(object) {
            return (typeof object.constructor == 'function' && !isPrototype(object)) ?
                baseCreate(getPrototype(object)) : {};
        }

        module.exports = initCloneObject;

    }, { "./_baseCreate": 72, "./_getPrototype": 108, "./_isPrototype": 126 }],
    122: [function(require, module, exports) {
        /** Used as references for various `Number` constants. */
        var MAX_SAFE_INTEGER = 9007199254740991;

        /** Used to detect unsigned integer values. */
        var reIsUint = /^(?:0|[1-9]\d*)$/;

        /**
         * Checks if `value` is a valid array-like index.
         *
         * @private
         * @param {*} value The value to check.
         * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
         * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
         */
        function isIndex(value, length) {
            var type = typeof value;
            length = length == null ? MAX_SAFE_INTEGER : length;

            return !!length &&
                (type == 'number' ||
                    (type != 'symbol' && reIsUint.test(value))) &&
                (value > -1 && value % 1 == 0 && value < length);
        }

        module.exports = isIndex;

    }, {}],
    123: [function(require, module, exports) {
        var eq = require('./eq'),
            isArrayLike = require('./isArrayLike'),
            isIndex = require('./_isIndex'),
            isObject = require('./isObject');

        /**
         * Checks if the given arguments are from an iteratee call.
         *
         * @private
         * @param {*} value The potential iteratee value argument.
         * @param {*} index The potential iteratee index or key argument.
         * @param {*} object The potential iteratee object argument.
         * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
         *  else `false`.
         */
        function isIterateeCall(value, index, object) {
            if (!isObject(object)) {
                return false;
            }
            var type = typeof index;
            if (type == 'number' ?
                (isArrayLike(object) && isIndex(index, object.length)) :
                (type == 'string' && index in object)
            ) {
                return eq(object[index], value);
            }
            return false;
        }

        module.exports = isIterateeCall;

    }, { "./_isIndex": 122, "./eq": 156, "./isArrayLike": 160, "./isObject": 166 }],
    124: [function(require, module, exports) {
        /**
         * Checks if `value` is suitable for use as unique object key.
         *
         * @private
         * @param {*} value The value to check.
         * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
         */
        function isKeyable(value) {
            var type = typeof value;
            return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean') ?
                (value !== '__proto__') :
                (value === null);
        }

        module.exports = isKeyable;

    }, {}],
    125: [function(require, module, exports) {
        var coreJsData = require('./_coreJsData');

        /** Used to detect methods masquerading as native. */
        var maskSrcKey = (function() {
            var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
            return uid ? ('Symbol(src)_1.' + uid) : '';
        }());

        /**
         * Checks if `func` has its source masked.
         *
         * @private
         * @param {Function} func The function to check.
         * @returns {boolean} Returns `true` if `func` is masked, else `false`.
         */
        function isMasked(func) {
            return !!maskSrcKey && (maskSrcKey in func);
        }

        module.exports = isMasked;

    }, { "./_coreJsData": 99 }],
    126: [function(require, module, exports) {
        /** Used for built-in method references. */
        var objectProto = Object.prototype;

        /**
         * Checks if `value` is likely a prototype object.
         *
         * @private
         * @param {*} value The value to check.
         * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
         */
        function isPrototype(value) {
            var Ctor = value && value.constructor,
                proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

            return value === proto;
        }

        module.exports = isPrototype;

    }, {}],
    127: [function(require, module, exports) {
        /**
         * Removes all key-value entries from the list cache.
         *
         * @private
         * @name clear
         * @memberOf ListCache
         */
        function listCacheClear() {
            this.__data__ = [];
            this.size = 0;
        }

        module.exports = listCacheClear;

    }, {}],
    128: [function(require, module, exports) {
        var assocIndexOf = require('./_assocIndexOf');

        /** Used for built-in method references. */
        var arrayProto = Array.prototype;

        /** Built-in value references. */
        var splice = arrayProto.splice;

        /**
         * Removes `key` and its value from the list cache.
         *
         * @private
         * @name delete
         * @memberOf ListCache
         * @param {string} key The key of the value to remove.
         * @returns {boolean} Returns `true` if the entry was removed, else `false`.
         */
        function listCacheDelete(key) {
            var data = this.__data__,
                index = assocIndexOf(data, key);

            if (index < 0) {
                return false;
            }
            var lastIndex = data.length - 1;
            if (index == lastIndex) {
                data.pop();
            } else {
                splice.call(data, index, 1);
            }
            --this.size;
            return true;
        }

        module.exports = listCacheDelete;

    }, { "./_assocIndexOf": 67 }],
    129: [function(require, module, exports) {
        var assocIndexOf = require('./_assocIndexOf');

        /**
         * Gets the list cache value for `key`.
         *
         * @private
         * @name get
         * @memberOf ListCache
         * @param {string} key The key of the value to get.
         * @returns {*} Returns the entry value.
         */
        function listCacheGet(key) {
            var data = this.__data__,
                index = assocIndexOf(data, key);

            return index < 0 ? undefined : data[index][1];
        }

        module.exports = listCacheGet;

    }, { "./_assocIndexOf": 67 }],
    130: [function(require, module, exports) {
        var assocIndexOf = require('./_assocIndexOf');

        /**
         * Checks if a list cache value for `key` exists.
         *
         * @private
         * @name has
         * @memberOf ListCache
         * @param {string} key The key of the entry to check.
         * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
         */
        function listCacheHas(key) {
            return assocIndexOf(this.__data__, key) > -1;
        }

        module.exports = listCacheHas;

    }, { "./_assocIndexOf": 67 }],
    131: [function(require, module, exports) {
        var assocIndexOf = require('./_assocIndexOf');

        /**
         * Sets the list cache `key` to `value`.
         *
         * @private
         * @name set
         * @memberOf ListCache
         * @param {string} key The key of the value to set.
         * @param {*} value The value to set.
         * @returns {Object} Returns the list cache instance.
         */
        function listCacheSet(key, value) {
            var data = this.__data__,
                index = assocIndexOf(data, key);

            if (index < 0) {
                ++this.size;
                data.push([key, value]);
            } else {
                data[index][1] = value;
            }
            return this;
        }

        module.exports = listCacheSet;

    }, { "./_assocIndexOf": 67 }],
    132: [function(require, module, exports) {
        var Hash = require('./_Hash'),
            ListCache = require('./_ListCache'),
            Map = require('./_Map');

        /**
         * Removes all key-value entries from the map.
         *
         * @private
         * @name clear
         * @memberOf MapCache
         */
        function mapCacheClear() {
            this.size = 0;
            this.__data__ = {
                'hash': new Hash,
                'map': new(Map || ListCache),
                'string': new Hash
            };
        }

        module.exports = mapCacheClear;

    }, { "./_Hash": 50, "./_ListCache": 51, "./_Map": 52 }],
    133: [function(require, module, exports) {
        var getMapData = require('./_getMapData');

        /**
         * Removes `key` and its value from the map.
         *
         * @private
         * @name delete
         * @memberOf MapCache
         * @param {string} key The key of the value to remove.
         * @returns {boolean} Returns `true` if the entry was removed, else `false`.
         */
        function mapCacheDelete(key) {
            var result = getMapData(this, key)['delete'](key);
            this.size -= result ? 1 : 0;
            return result;
        }

        module.exports = mapCacheDelete;

    }, { "./_getMapData": 106 }],
    134: [function(require, module, exports) {
        var getMapData = require('./_getMapData');

        /**
         * Gets the map value for `key`.
         *
         * @private
         * @name get
         * @memberOf MapCache
         * @param {string} key The key of the value to get.
         * @returns {*} Returns the entry value.
         */
        function mapCacheGet(key) {
            return getMapData(this, key).get(key);
        }

        module.exports = mapCacheGet;

    }, { "./_getMapData": 106 }],
    135: [function(require, module, exports) {
        var getMapData = require('./_getMapData');

        /**
         * Checks if a map value for `key` exists.
         *
         * @private
         * @name has
         * @memberOf MapCache
         * @param {string} key The key of the entry to check.
         * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
         */
        function mapCacheHas(key) {
            return getMapData(this, key).has(key);
        }

        module.exports = mapCacheHas;

    }, { "./_getMapData": 106 }],
    136: [function(require, module, exports) {
        var getMapData = require('./_getMapData');

        /**
         * Sets the map `key` to `value`.
         *
         * @private
         * @name set
         * @memberOf MapCache
         * @param {string} key The key of the value to set.
         * @param {*} value The value to set.
         * @returns {Object} Returns the map cache instance.
         */
        function mapCacheSet(key, value) {
            var data = getMapData(this, key),
                size = data.size;

            data.set(key, value);
            this.size += data.size == size ? 0 : 1;
            return this;
        }

        module.exports = mapCacheSet;

    }, { "./_getMapData": 106 }],
    137: [function(require, module, exports) {
        var getNative = require('./_getNative');

        /* Built-in method references that are verified to be native. */
        var nativeCreate = getNative(Object, 'create');

        module.exports = nativeCreate;

    }, { "./_getNative": 107 }],
    138: [function(require, module, exports) {
        var overArg = require('./_overArg');

        /* Built-in method references for those with the same name as other `lodash` methods. */
        var nativeKeys = overArg(Object.keys, Object);

        module.exports = nativeKeys;

    }, { "./_overArg": 142 }],
    139: [function(require, module, exports) {
        /**
         * This function is like
         * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
         * except that it includes inherited enumerable properties.
         *
         * @private
         * @param {Object} object The object to query.
         * @returns {Array} Returns the array of property names.
         */
        function nativeKeysIn(object) {
            var result = [];
            if (object != null) {
                for (var key in Object(object)) {
                    result.push(key);
                }
            }
            return result;
        }

        module.exports = nativeKeysIn;

    }, {}],
    140: [function(require, module, exports) {
        var freeGlobal = require('./_freeGlobal');

        /** Detect free variable `exports`. */
        var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

        /** Detect free variable `module`. */
        var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

        /** Detect the popular CommonJS extension `module.exports`. */
        var moduleExports = freeModule && freeModule.exports === freeExports;

        /** Detect free variable `process` from Node.js. */
        var freeProcess = moduleExports && freeGlobal.process;

        /** Used to access faster Node.js helpers. */
        var nodeUtil = (function() {
            try {
                // Use `util.types` for Node.js 10+.
                var types = freeModule && freeModule.require && freeModule.require('util').types;

                if (types) {
                    return types;
                }

                // Legacy `process.binding('util')` for Node.js < 10.
                return freeProcess && freeProcess.binding && freeProcess.binding('util');
            } catch (e) {}
        }());

        module.exports = nodeUtil;

    }, { "./_freeGlobal": 103 }],
    141: [function(require, module, exports) {
        /** Used for built-in method references. */
        var objectProto = Object.prototype;

        /**
         * Used to resolve the
         * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
         * of values.
         */
        var nativeObjectToString = objectProto.toString;

        /**
         * Converts `value` to a string using `Object.prototype.toString`.
         *
         * @private
         * @param {*} value The value to convert.
         * @returns {string} Returns the converted string.
         */
        function objectToString(value) {
            return nativeObjectToString.call(value);
        }

        module.exports = objectToString;

    }, {}],
    142: [function(require, module, exports) {
        /**
         * Creates a unary function that invokes `func` with its argument transformed.
         *
         * @private
         * @param {Function} func The function to wrap.
         * @param {Function} transform The argument transform.
         * @returns {Function} Returns the new function.
         */
        function overArg(func, transform) {
            return function(arg) {
                return func(transform(arg));
            };
        }

        module.exports = overArg;

    }, {}],
    143: [function(require, module, exports) {
        var apply = require('./_apply');

        /* Built-in method references for those with the same name as other `lodash` methods. */
        var nativeMax = Math.max;

        /**
         * A specialized version of `baseRest` which transforms the rest array.
         *
         * @private
         * @param {Function} func The function to apply a rest parameter to.
         * @param {number} [start=func.length-1] The start position of the rest parameter.
         * @param {Function} transform The rest array transform.
         * @returns {Function} Returns the new function.
         */
        function overRest(func, start, transform) {
            start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
            return function() {
                var args = arguments,
                    index = -1,
                    length = nativeMax(args.length - start, 0),
                    array = Array(length);

                while (++index < length) {
                    array[index] = args[start + index];
                }
                index = -1;
                var otherArgs = Array(start + 1);
                while (++index < start) {
                    otherArgs[index] = args[index];
                }
                otherArgs[start] = transform(array);
                return apply(func, this, otherArgs);
            };
        }

        module.exports = overRest;

    }, { "./_apply": 60 }],
    144: [function(require, module, exports) {
        var freeGlobal = require('./_freeGlobal');

        /** Detect free variable `self`. */
        var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

        /** Used as a reference to the global object. */
        var root = freeGlobal || freeSelf || Function('return this')();

        module.exports = root;

    }, { "./_freeGlobal": 103 }],
    145: [function(require, module, exports) {
        /**
         * Gets the value at `key`, unless `key` is "__proto__" or "constructor".
         *
         * @private
         * @param {Object} object The object to query.
         * @param {string} key The key of the property to get.
         * @returns {*} Returns the property value.
         */
        function safeGet(object, key) {
            if (key === 'constructor' && typeof object[key] === 'function') {
                return;
            }

            if (key == '__proto__') {
                return;
            }

            return object[key];
        }

        module.exports = safeGet;

    }, {}],
    146: [function(require, module, exports) {
        var baseSetToString = require('./_baseSetToString'),
            shortOut = require('./_shortOut');

        /**
         * Sets the `toString` method of `func` to return `string`.
         *
         * @private
         * @param {Function} func The function to modify.
         * @param {Function} string The `toString` result.
         * @returns {Function} Returns `func`.
         */
        var setToString = shortOut(baseSetToString);

        module.exports = setToString;

    }, { "./_baseSetToString": 86, "./_shortOut": 147 }],
    147: [function(require, module, exports) {
        /** Used to detect hot functions by number of calls within a span of milliseconds. */
        var HOT_COUNT = 800,
            HOT_SPAN = 16;

        /* Built-in method references for those with the same name as other `lodash` methods. */
        var nativeNow = Date.now;

        /**
         * Creates a function that'll short out and invoke `identity` instead
         * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
         * milliseconds.
         *
         * @private
         * @param {Function} func The function to restrict.
         * @returns {Function} Returns the new shortable function.
         */
        function shortOut(func) {
            var count = 0,
                lastCalled = 0;

            return function() {
                var stamp = nativeNow(),
                    remaining = HOT_SPAN - (stamp - lastCalled);

                lastCalled = stamp;
                if (remaining > 0) {
                    if (++count >= HOT_COUNT) {
                        return arguments[0];
                    }
                } else {
                    count = 0;
                }
                return func.apply(undefined, arguments);
            };
        }

        module.exports = shortOut;

    }, {}],
    148: [function(require, module, exports) {
        var ListCache = require('./_ListCache');

        /**
         * Removes all key-value entries from the stack.
         *
         * @private
         * @name clear
         * @memberOf Stack
         */
        function stackClear() {
            this.__data__ = new ListCache;
            this.size = 0;
        }

        module.exports = stackClear;

    }, { "./_ListCache": 51 }],
    149: [function(require, module, exports) {
        /**
         * Removes `key` and its value from the stack.
         *
         * @private
         * @name delete
         * @memberOf Stack
         * @param {string} key The key of the value to remove.
         * @returns {boolean} Returns `true` if the entry was removed, else `false`.
         */
        function stackDelete(key) {
            var data = this.__data__,
                result = data['delete'](key);

            this.size = data.size;
            return result;
        }

        module.exports = stackDelete;

    }, {}],
    150: [function(require, module, exports) {
        /**
         * Gets the stack value for `key`.
         *
         * @private
         * @name get
         * @memberOf Stack
         * @param {string} key The key of the value to get.
         * @returns {*} Returns the entry value.
         */
        function stackGet(key) {
            return this.__data__.get(key);
        }

        module.exports = stackGet;

    }, {}],
    151: [function(require, module, exports) {
        /**
         * Checks if a stack value for `key` exists.
         *
         * @private
         * @name has
         * @memberOf Stack
         * @param {string} key The key of the entry to check.
         * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
         */
        function stackHas(key) {
            return this.__data__.has(key);
        }

        module.exports = stackHas;

    }, {}],
    152: [function(require, module, exports) {
        var ListCache = require('./_ListCache'),
            Map = require('./_Map'),
            MapCache = require('./_MapCache');

        /** Used as the size to enable large array optimizations. */
        var LARGE_ARRAY_SIZE = 200;

        /**
         * Sets the stack `key` to `value`.
         *
         * @private
         * @name set
         * @memberOf Stack
         * @param {string} key The key of the value to set.
         * @param {*} value The value to set.
         * @returns {Object} Returns the stack cache instance.
         */
        function stackSet(key, value) {
            var data = this.__data__;
            if (data instanceof ListCache) {
                var pairs = data.__data__;
                if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
                    pairs.push([key, value]);
                    this.size = ++data.size;
                    return this;
                }
                data = this.__data__ = new MapCache(pairs);
            }
            data.set(key, value);
            this.size = data.size;
            return this;
        }

        module.exports = stackSet;

    }, { "./_ListCache": 51, "./_Map": 52, "./_MapCache": 53 }],
    153: [function(require, module, exports) {
        /** Used for built-in method references. */
        var funcProto = Function.prototype;

        /** Used to resolve the decompiled source of functions. */
        var funcToString = funcProto.toString;

        /**
         * Converts `func` to its source code.
         *
         * @private
         * @param {Function} func The function to convert.
         * @returns {string} Returns the source code.
         */
        function toSource(func) {
            if (func != null) {
                try {
                    return funcToString.call(func);
                } catch (e) {}
                try {
                    return (func + '');
                } catch (e) {}
            }
            return '';
        }

        module.exports = toSource;

    }, {}],
    154: [function(require, module, exports) {
        var baseClone = require('./_baseClone');

        /** Used to compose bitmasks for cloning. */
        var CLONE_DEEP_FLAG = 1,
            CLONE_SYMBOLS_FLAG = 4;

        /**
         * This method is like `_.clone` except that it recursively clones `value`.
         *
         * @static
         * @memberOf _
         * @since 1.0.0
         * @category Lang
         * @param {*} value The value to recursively clone.
         * @returns {*} Returns the deep cloned value.
         * @see _.clone
         * @example
         *
         * var objects = [{ 'a': 1 }, { 'b': 2 }];
         *
         * var deep = _.cloneDeep(objects);
         * console.log(deep[0] === objects[0]);
         * // => false
         */
        function cloneDeep(value) {
            return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
        }

        module.exports = cloneDeep;

    }, { "./_baseClone": 71 }],
    155: [function(require, module, exports) {
        /**
         * Creates a function that returns `value`.
         *
         * @static
         * @memberOf _
         * @since 2.4.0
         * @category Util
         * @param {*} value The value to return from the new function.
         * @returns {Function} Returns the new constant function.
         * @example
         *
         * var objects = _.times(2, _.constant({ 'a': 1 }));
         *
         * console.log(objects);
         * // => [{ 'a': 1 }, { 'a': 1 }]
         *
         * console.log(objects[0] === objects[1]);
         * // => true
         */
        function constant(value) {
            return function() {
                return value;
            };
        }

        module.exports = constant;

    }, {}],
    156: [function(require, module, exports) {
        /**
         * Performs a
         * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
         * comparison between two values to determine if they are equivalent.
         *
         * @static
         * @memberOf _
         * @since 4.0.0
         * @category Lang
         * @param {*} value The value to compare.
         * @param {*} other The other value to compare.
         * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
         * @example
         *
         * var object = { 'a': 1 };
         * var other = { 'a': 1 };
         *
         * _.eq(object, object);
         * // => true
         *
         * _.eq(object, other);
         * // => false
         *
         * _.eq('a', 'a');
         * // => true
         *
         * _.eq('a', Object('a'));
         * // => false
         *
         * _.eq(NaN, NaN);
         * // => true
         */
        function eq(value, other) {
            return value === other || (value !== value && other !== other);
        }

        module.exports = eq;

    }, {}],
    157: [function(require, module, exports) {
        /**
         * This method returns the first argument it receives.
         *
         * @static
         * @since 0.1.0
         * @memberOf _
         * @category Util
         * @param {*} value Any value.
         * @returns {*} Returns `value`.
         * @example
         *
         * var object = { 'a': 1 };
         *
         * console.log(_.identity(object) === object);
         * // => true
         */
        function identity(value) {
            return value;
        }

        module.exports = identity;

    }, {}],
    158: [function(require, module, exports) {
        var baseIsArguments = require('./_baseIsArguments'),
            isObjectLike = require('./isObjectLike');

        /** Used for built-in method references. */
        var objectProto = Object.prototype;

        /** Used to check objects for own properties. */
        var hasOwnProperty = objectProto.hasOwnProperty;

        /** Built-in value references. */
        var propertyIsEnumerable = objectProto.propertyIsEnumerable;

        /**
         * Checks if `value` is likely an `arguments` object.
         *
         * @static
         * @memberOf _
         * @since 0.1.0
         * @category Lang
         * @param {*} value The value to check.
         * @returns {boolean} Returns `true` if `value` is an `arguments` object,
         *  else `false`.
         * @example
         *
         * _.isArguments(function() { return arguments; }());
         * // => true
         *
         * _.isArguments([1, 2, 3]);
         * // => false
         */
        var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
            return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
                !propertyIsEnumerable.call(value, 'callee');
        };

        module.exports = isArguments;

    }, { "./_baseIsArguments": 76, "./isObjectLike": 167 }],
    159: [function(require, module, exports) {
        /**
         * Checks if `value` is classified as an `Array` object.
         *
         * @static
         * @memberOf _
         * @since 0.1.0
         * @category Lang
         * @param {*} value The value to check.
         * @returns {boolean} Returns `true` if `value` is an array, else `false`.
         * @example
         *
         * _.isArray([1, 2, 3]);
         * // => true
         *
         * _.isArray(document.body.children);
         * // => false
         *
         * _.isArray('abc');
         * // => false
         *
         * _.isArray(_.noop);
         * // => false
         */
        var isArray = Array.isArray;

        module.exports = isArray;

    }, {}],
    160: [function(require, module, exports) {
        var isFunction = require('./isFunction'),
            isLength = require('./isLength');

        /**
         * Checks if `value` is array-like. A value is considered array-like if it's
         * not a function and has a `value.length` that's an integer greater than or
         * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
         *
         * @static
         * @memberOf _
         * @since 4.0.0
         * @category Lang
         * @param {*} value The value to check.
         * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
         * @example
         *
         * _.isArrayLike([1, 2, 3]);
         * // => true
         *
         * _.isArrayLike(document.body.children);
         * // => true
         *
         * _.isArrayLike('abc');
         * // => true
         *
         * _.isArrayLike(_.noop);
         * // => false
         */
        function isArrayLike(value) {
            return value != null && isLength(value.length) && !isFunction(value);
        }

        module.exports = isArrayLike;

    }, { "./isFunction": 163, "./isLength": 164 }],
    161: [function(require, module, exports) {
        var isArrayLike = require('./isArrayLike'),
            isObjectLike = require('./isObjectLike');

        /**
         * This method is like `_.isArrayLike` except that it also checks if `value`
         * is an object.
         *
         * @static
         * @memberOf _
         * @since 4.0.0
         * @category Lang
         * @param {*} value The value to check.
         * @returns {boolean} Returns `true` if `value` is an array-like object,
         *  else `false`.
         * @example
         *
         * _.isArrayLikeObject([1, 2, 3]);
         * // => true
         *
         * _.isArrayLikeObject(document.body.children);
         * // => true
         *
         * _.isArrayLikeObject('abc');
         * // => false
         *
         * _.isArrayLikeObject(_.noop);
         * // => false
         */
        function isArrayLikeObject(value) {
            return isObjectLike(value) && isArrayLike(value);
        }

        module.exports = isArrayLikeObject;

    }, { "./isArrayLike": 160, "./isObjectLike": 167 }],
    162: [function(require, module, exports) {
        var root = require('./_root'),
            stubFalse = require('./stubFalse');

        /** Detect free variable `exports`. */
        var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

        /** Detect free variable `module`. */
        var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

        /** Detect the popular CommonJS extension `module.exports`. */
        var moduleExports = freeModule && freeModule.exports === freeExports;

        /** Built-in value references. */
        var Buffer = moduleExports ? root.Buffer : undefined;

        /* Built-in method references for those with the same name as other `lodash` methods. */
        var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

        /**
         * Checks if `value` is a buffer.
         *
         * @static
         * @memberOf _
         * @since 4.3.0
         * @category Lang
         * @param {*} value The value to check.
         * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
         * @example
         *
         * _.isBuffer(new Buffer(2));
         * // => true
         *
         * _.isBuffer(new Uint8Array(2));
         * // => false
         */
        var isBuffer = nativeIsBuffer || stubFalse;

        module.exports = isBuffer;

    }, { "./_root": 144, "./stubFalse": 175 }],
    163: [function(require, module, exports) {
        var baseGetTag = require('./_baseGetTag'),
            isObject = require('./isObject');

        /** `Object#toString` result references. */
        var asyncTag = '[object AsyncFunction]',
            funcTag = '[object Function]',
            genTag = '[object GeneratorFunction]',
            proxyTag = '[object Proxy]';

        /**
         * Checks if `value` is classified as a `Function` object.
         *
         * @static
         * @memberOf _
         * @since 0.1.0
         * @category Lang
         * @param {*} value The value to check.
         * @returns {boolean} Returns `true` if `value` is a function, else `false`.
         * @example
         *
         * _.isFunction(_);
         * // => true
         *
         * _.isFunction(/abc/);
         * // => false
         */
        function isFunction(value) {
            if (!isObject(value)) {
                return false;
            }
            // The use of `Object#toString` avoids issues with the `typeof` operator
            // in Safari 9 which returns 'object' for typed arrays and other constructors.
            var tag = baseGetTag(value);
            return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
        }

        module.exports = isFunction;

    }, { "./_baseGetTag": 75, "./isObject": 166 }],
    164: [function(require, module, exports) {
        /** Used as references for various `Number` constants. */
        var MAX_SAFE_INTEGER = 9007199254740991;

        /**
         * Checks if `value` is a valid array-like length.
         *
         * **Note:** This method is loosely based on
         * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
         *
         * @static
         * @memberOf _
         * @since 4.0.0
         * @category Lang
         * @param {*} value The value to check.
         * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
         * @example
         *
         * _.isLength(3);
         * // => true
         *
         * _.isLength(Number.MIN_VALUE);
         * // => false
         *
         * _.isLength(Infinity);
         * // => false
         *
         * _.isLength('3');
         * // => false
         */
        function isLength(value) {
            return typeof value == 'number' &&
                value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
        }

        module.exports = isLength;

    }, {}],
    165: [function(require, module, exports) {
        var baseIsMap = require('./_baseIsMap'),
            baseUnary = require('./_baseUnary'),
            nodeUtil = require('./_nodeUtil');

        /* Node.js helper references. */
        var nodeIsMap = nodeUtil && nodeUtil.isMap;

        /**
         * Checks if `value` is classified as a `Map` object.
         *
         * @static
         * @memberOf _
         * @since 4.3.0
         * @category Lang
         * @param {*} value The value to check.
         * @returns {boolean} Returns `true` if `value` is a map, else `false`.
         * @example
         *
         * _.isMap(new Map);
         * // => true
         *
         * _.isMap(new WeakMap);
         * // => false
         */
        var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;

        module.exports = isMap;

    }, { "./_baseIsMap": 77, "./_baseUnary": 88, "./_nodeUtil": 140 }],
    166: [function(require, module, exports) {
        /**
         * Checks if `value` is the
         * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
         * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
         *
         * @static
         * @memberOf _
         * @since 0.1.0
         * @category Lang
         * @param {*} value The value to check.
         * @returns {boolean} Returns `true` if `value` is an object, else `false`.
         * @example
         *
         * _.isObject({});
         * // => true
         *
         * _.isObject([1, 2, 3]);
         * // => true
         *
         * _.isObject(_.noop);
         * // => true
         *
         * _.isObject(null);
         * // => false
         */
        function isObject(value) {
            var type = typeof value;
            return value != null && (type == 'object' || type == 'function');
        }

        module.exports = isObject;

    }, {}],
    167: [function(require, module, exports) {
        /**
         * Checks if `value` is object-like. A value is object-like if it's not `null`
         * and has a `typeof` result of "object".
         *
         * @static
         * @memberOf _
         * @since 4.0.0
         * @category Lang
         * @param {*} value The value to check.
         * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
         * @example
         *
         * _.isObjectLike({});
         * // => true
         *
         * _.isObjectLike([1, 2, 3]);
         * // => true
         *
         * _.isObjectLike(_.noop);
         * // => false
         *
         * _.isObjectLike(null);
         * // => false
         */
        function isObjectLike(value) {
            return value != null && typeof value == 'object';
        }

        module.exports = isObjectLike;

    }, {}],
    168: [function(require, module, exports) {
        var baseGetTag = require('./_baseGetTag'),
            getPrototype = require('./_getPrototype'),
            isObjectLike = require('./isObjectLike');

        /** `Object#toString` result references. */
        var objectTag = '[object Object]';

        /** Used for built-in method references. */
        var funcProto = Function.prototype,
            objectProto = Object.prototype;

        /** Used to resolve the decompiled source of functions. */
        var funcToString = funcProto.toString;

        /** Used to check objects for own properties. */
        var hasOwnProperty = objectProto.hasOwnProperty;

        /** Used to infer the `Object` constructor. */
        var objectCtorString = funcToString.call(Object);

        /**
         * Checks if `value` is a plain object, that is, an object created by the
         * `Object` constructor or one with a `[[Prototype]]` of `null`.
         *
         * @static
         * @memberOf _
         * @since 0.8.0
         * @category Lang
         * @param {*} value The value to check.
         * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
         * @example
         *
         * function Foo() {
         *   this.a = 1;
         * }
         *
         * _.isPlainObject(new Foo);
         * // => false
         *
         * _.isPlainObject([1, 2, 3]);
         * // => false
         *
         * _.isPlainObject({ 'x': 0, 'y': 0 });
         * // => true
         *
         * _.isPlainObject(Object.create(null));
         * // => true
         */
        function isPlainObject(value) {
            if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
                return false;
            }
            var proto = getPrototype(value);
            if (proto === null) {
                return true;
            }
            var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
            return typeof Ctor == 'function' && Ctor instanceof Ctor &&
                funcToString.call(Ctor) == objectCtorString;
        }

        module.exports = isPlainObject;

    }, { "./_baseGetTag": 75, "./_getPrototype": 108, "./isObjectLike": 167 }],
    169: [function(require, module, exports) {
        var baseIsSet = require('./_baseIsSet'),
            baseUnary = require('./_baseUnary'),
            nodeUtil = require('./_nodeUtil');

        /* Node.js helper references. */
        var nodeIsSet = nodeUtil && nodeUtil.isSet;

        /**
         * Checks if `value` is classified as a `Set` object.
         *
         * @static
         * @memberOf _
         * @since 4.3.0
         * @category Lang
         * @param {*} value The value to check.
         * @returns {boolean} Returns `true` if `value` is a set, else `false`.
         * @example
         *
         * _.isSet(new Set);
         * // => true
         *
         * _.isSet(new WeakSet);
         * // => false
         */
        var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;

        module.exports = isSet;

    }, { "./_baseIsSet": 79, "./_baseUnary": 88, "./_nodeUtil": 140 }],
    170: [function(require, module, exports) {
        var baseIsTypedArray = require('./_baseIsTypedArray'),
            baseUnary = require('./_baseUnary'),
            nodeUtil = require('./_nodeUtil');

        /* Node.js helper references. */
        var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

        /**
         * Checks if `value` is classified as a typed array.
         *
         * @static
         * @memberOf _
         * @since 3.0.0
         * @category Lang
         * @param {*} value The value to check.
         * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
         * @example
         *
         * _.isTypedArray(new Uint8Array);
         * // => true
         *
         * _.isTypedArray([]);
         * // => false
         */
        var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

        module.exports = isTypedArray;

    }, { "./_baseIsTypedArray": 80, "./_baseUnary": 88, "./_nodeUtil": 140 }],
    171: [function(require, module, exports) {
        var arrayLikeKeys = require('./_arrayLikeKeys'),
            baseKeys = require('./_baseKeys'),
            isArrayLike = require('./isArrayLike');

        /**
         * Creates an array of the own enumerable property names of `object`.
         *
         * **Note:** Non-object values are coerced to objects. See the
         * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
         * for more details.
         *
         * @static
         * @since 0.1.0
         * @memberOf _
         * @category Object
         * @param {Object} object The object to query.
         * @returns {Array} Returns the array of property names.
         * @example
         *
         * function Foo() {
         *   this.a = 1;
         *   this.b = 2;
         * }
         *
         * Foo.prototype.c = 3;
         *
         * _.keys(new Foo);
         * // => ['a', 'b'] (iteration order is not guaranteed)
         *
         * _.keys('hi');
         * // => ['0', '1']
         */
        function keys(object) {
            return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
        }

        module.exports = keys;

    }, { "./_arrayLikeKeys": 63, "./_baseKeys": 81, "./isArrayLike": 160 }],
    172: [function(require, module, exports) {
        var arrayLikeKeys = require('./_arrayLikeKeys'),
            baseKeysIn = require('./_baseKeysIn'),
            isArrayLike = require('./isArrayLike');

        /**
         * Creates an array of the own and inherited enumerable property names of `object`.
         *
         * **Note:** Non-object values are coerced to objects.
         *
         * @static
         * @memberOf _
         * @since 3.0.0
         * @category Object
         * @param {Object} object The object to query.
         * @returns {Array} Returns the array of property names.
         * @example
         *
         * function Foo() {
         *   this.a = 1;
         *   this.b = 2;
         * }
         *
         * Foo.prototype.c = 3;
         *
         * _.keysIn(new Foo);
         * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
         */
        function keysIn(object) {
            return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
        }

        module.exports = keysIn;

    }, { "./_arrayLikeKeys": 63, "./_baseKeysIn": 82, "./isArrayLike": 160 }],
    173: [function(require, module, exports) {
        var baseMerge = require('./_baseMerge'),
            createAssigner = require('./_createAssigner');

        /**
         * This method is like `_.assign` except that it recursively merges own and
         * inherited enumerable string keyed properties of source objects into the
         * destination object. Source properties that resolve to `undefined` are
         * skipped if a destination value exists. Array and plain object properties
         * are merged recursively. Other objects and value types are overridden by
         * assignment. Source objects are applied from left to right. Subsequent
         * sources overwrite property assignments of previous sources.
         *
         * **Note:** This method mutates `object`.
         *
         * @static
         * @memberOf _
         * @since 0.5.0
         * @category Object
         * @param {Object} object The destination object.
         * @param {...Object} [sources] The source objects.
         * @returns {Object} Returns `object`.
         * @example
         *
         * var object = {
         *   'a': [{ 'b': 2 }, { 'd': 4 }]
         * };
         *
         * var other = {
         *   'a': [{ 'c': 3 }, { 'e': 5 }]
         * };
         *
         * _.merge(object, other);
         * // => { 'a': [{ 'b': 2, 'c': 3 }, { 'd': 4, 'e': 5 }] }
         */
        var merge = createAssigner(function(object, source, srcIndex) {
            baseMerge(object, source, srcIndex);
        });

        module.exports = merge;

    }, { "./_baseMerge": 83, "./_createAssigner": 100 }],
    174: [function(require, module, exports) {
        /**
         * This method returns a new empty array.
         *
         * @static
         * @memberOf _
         * @since 4.13.0
         * @category Util
         * @returns {Array} Returns the new empty array.
         * @example
         *
         * var arrays = _.times(2, _.stubArray);
         *
         * console.log(arrays);
         * // => [[], []]
         *
         * console.log(arrays[0] === arrays[1]);
         * // => false
         */
        function stubArray() {
            return [];
        }

        module.exports = stubArray;

    }, {}],
    175: [function(require, module, exports) {
        /**
         * This method returns `false`.
         *
         * @static
         * @memberOf _
         * @since 4.13.0
         * @category Util
         * @returns {boolean} Returns `false`.
         * @example
         *
         * _.times(2, _.stubFalse);
         * // => [false, false]
         */
        function stubFalse() {
            return false;
        }

        module.exports = stubFalse;

    }, {}],
    176: [function(require, module, exports) {
        var copyObject = require('./_copyObject'),
            keysIn = require('./keysIn');

        /**
         * Converts `value` to a plain object flattening inherited enumerable string
         * keyed properties of `value` to own properties of the plain object.
         *
         * @static
         * @memberOf _
         * @since 3.0.0
         * @category Lang
         * @param {*} value The value to convert.
         * @returns {Object} Returns the converted plain object.
         * @example
         *
         * function Foo() {
         *   this.b = 2;
         * }
         *
         * Foo.prototype.c = 3;
         *
         * _.assign({ 'a': 1 }, new Foo);
         * // => { 'a': 1, 'b': 2 }
         *
         * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
         * // => { 'a': 1, 'b': 2, 'c': 3 }
         */
        function toPlainObject(value) {
            return copyObject(value, keysIn(value));
        }

        module.exports = toPlainObject;

    }, { "./_copyObject": 96, "./keysIn": 172 }],
    177: [function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.compile = void 0;
        var boolbase_1 = require("boolbase");
        /**
         * Returns a function that checks if an elements index matches the given rule
         * highly optimized to return the fastest solution.
         *
         * @param parsed A tuple [a, b], as returned by `parse`.
         * @returns A highly optimized function that returns whether an index matches the nth-check.
         * @example
         * const check = nthCheck.compile([2, 3]);
         *
         * check(0); // `false`
         * check(1); // `false`
         * check(2); // `true`
         * check(3); // `false`
         * check(4); // `true`
         * check(5); // `false`
         * check(6); // `true`
         */
        function compile(parsed) {
            var a = parsed[0];
            // Subtract 1 from `b`, to convert from one- to zero-indexed.
            var b = parsed[1] - 1;
            /*
             * When `b <= 0`, `a * n` won't be lead to any matches for `a < 0`.
             * Besides, the specification states that no elements are
             * matched when `a` and `b` are 0.
             *
             * `b < 0` here as we subtracted 1 from `b` above.
             */
            if (b < 0 && a <= 0)
                return boolbase_1.falseFunc;
            // When `a` is in the range -1..1, it matches any element (so only `b` is checked).
            if (a === -1)
                return function(index) { return index <= b; };
            if (a === 0)
                return function(index) { return index === b; };
            // When `b <= 0` and `a === 1`, they match any element.
            if (a === 1)
                return b < 0 ? boolbase_1.trueFunc : function(index) { return index >= b; };
            /*
             * Otherwise, modulo can be used to check if there is a match.
             *
             * Modulo doesn't care about the sign, so let's use `a`s absolute value.
             */
            var absA = Math.abs(a);
            // Get `b mod a`, + a if this is negative.
            var bMod = ((b % absA) + absA) % absA;
            return a > 1 ?

                function(index) { return index >= b && index % absA === bMod; } :
                function(index) { return index <= b && index % absA === bMod; };
        }
        exports.compile = compile;

    }, { "boolbase": 5 }],
    178: [function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.compile = exports.parse = void 0;
        var parse_1 = require("./parse");
        Object.defineProperty(exports, "parse", { enumerable: true, get: function() { return parse_1.parse; } });
        var compile_1 = require("./compile");
        Object.defineProperty(exports, "compile", { enumerable: true, get: function() { return compile_1.compile; } });
        /**
         * Parses and compiles a formula to a highly optimized function.
         * Combination of `parse` and `compile`.
         *
         * If the formula doesn't match any elements,
         * it returns [`boolbase`](https://github.com/fb55/boolbase)'s `falseFunc`.
         * Otherwise, a function accepting an _index_ is returned, which returns
         * whether or not the passed _index_ matches the formula.
         *
         * Note: The nth-rule starts counting at `1`, the returned function at `0`.
         *
         * @param formula The formula to compile.
         * @example
         * const check = nthCheck("2n+3");
         *
         * check(0); // `false`
         * check(1); // `false`
         * check(2); // `true`
         * check(3); // `false`
         * check(4); // `true`
         * check(5); // `false`
         * check(6); // `true`
         */
        function nthCheck(formula) {
            return (0, compile_1.compile)((0, parse_1.parse)(formula));
        }
        exports.default = nthCheck;

    }, { "./compile": 177, "./parse": 179 }],
    179: [function(require, module, exports) {
        "use strict";
        // Following http://www.w3.org/TR/css3-selectors/#nth-child-pseudo
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.parse = void 0;
        // Whitespace as per https://www.w3.org/TR/selectors-3/#lex is " \t\r\n\f"
        var whitespace = new Set([9, 10, 12, 13, 32]);
        var ZERO = "0".charCodeAt(0);
        var NINE = "9".charCodeAt(0);
        /**
         * Parses an expression.
         *
         * @throws An `Error` if parsing fails.
         * @returns An array containing the integer step size and the integer offset of the nth rule.
         * @example nthCheck.parse("2n+3"); // returns [2, 3]
         */
        function parse(formula) {
            formula = formula.trim().toLowerCase();
            if (formula === "even") {
                return [2, 0];
            } else if (formula === "odd") {
                return [2, 1];
            }
            // Parse [ ['-'|'+']? INTEGER? {N} [ S* ['-'|'+'] S* INTEGER ]?
            var idx = 0;
            var a = 0;
            var sign = readSign();
            var number = readNumber();
            if (idx < formula.length && formula.charAt(idx) === "n") {
                idx++;
                a = sign * (number !== null && number !== void 0 ? number : 1);
                skipWhitespace();
                if (idx < formula.length) {
                    sign = readSign();
                    skipWhitespace();
                    number = readNumber();
                } else {
                    sign = number = 0;
                }
            }
            // Throw if there is anything else
            if (number === null || idx < formula.length) {
                throw new Error("n-th rule couldn't be parsed ('" + formula + "')");
            }
            return [a, sign * number];

            function readSign() {
                if (formula.charAt(idx) === "-") {
                    idx++;
                    return -1;
                }
                if (formula.charAt(idx) === "+") {
                    idx++;
                }
                return 1;
            }

            function readNumber() {
                var start = idx;
                var value = 0;
                while (idx < formula.length &&
                    formula.charCodeAt(idx) >= ZERO &&
                    formula.charCodeAt(idx) <= NINE) {
                    value = value * 10 + (formula.charCodeAt(idx) - ZERO);
                    idx++;
                }
                // Return `null` if we didn't read anything.
                return idx === start ? null : value;
            }

            function skipWhitespace() {
                while (idx < formula.length &&
                    whitespace.has(formula.charCodeAt(idx))) {
                    idx++;
                }
            }
        }
        exports.parse = parse;

    }, {}],
    180: [function(require, module, exports) {
        // Generated by CoffeeScript 1.8.0
        var ParsedError, prop, sysPath, _fn, _i, _len, _ref;

        sysPath = require('path');

        module.exports = ParsedError = (function() {
            function ParsedError(error) {
                this.error = error;
                this._parse();
            }

            ParsedError.prototype._parse = function() {
                var m;
                this._trace = [];
                this._kind = 'Error';
                this._wrapper = '';
                if (this.error.wrapper != null) {
                    this._wrapper = String(this.error.wrapper);
                }
                if (typeof this.error !== 'object') {
                    this._message = String(this.error);
                } else {
                    this._stack = this.error.stack;
                    if (this.error.kind != null) {
                        this._kind = String(this.error.kind);
                    } else if (typeof this._stack === 'string') {
                        if (m = this._stack.match(/^([a-zA-Z0-9\_\$]+):\ /)) {
                            this._kind = m[1];
                        }
                    }
                    this._message = (this.error.message != null) && String(this.error.message) || '';
                    if (typeof this._stack === 'string') {
                        this._parseStack();
                    }
                }
            };

            ParsedError.prototype._parseStack = function() {
                var line, message, messageLines, reachedTrace, _i, _len, _ref;
                messageLines = [];
                reachedTrace = false;
                _ref = this._stack.split('\n');
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    line = _ref[_i];
                    if (line.trim() === '') {
                        continue;
                    }
                    if (reachedTrace) {
                        this._trace.push(this._parseTraceItem(line));
                    } else {
                        if (line.match(/^\s*at\s.+/)) {
                            reachedTrace = true;
                            this._trace.push(this._parseTraceItem(line));
                        } else if (!this._message.split('\n'.indexOf(line))) {
                            messageLines.push(line);
                        }
                    }
                }
                message = messageLines.join('\n');
                if (message.substr(0, this._kind.length) === this._kind) {
                    message = message.substr(this._kind.length, message.length).replace(/^\:\s+/, '');
                }
                if (message.length) {
                    this._message = this._message.length ? [this._message, message].join('\n') : message;
                }
            };

            ParsedError.prototype._parseTraceItem = function(text) {
                var addr, col, d, dir, file, jsCol, jsLine, line, m, original, packageName, packages, path, r, remaining, shortenedAddr, shortenedPath, what;
                text = text.trim();
                if (text === '') {
                    return;
                }
                if (!text.match(/^at\ /)) {
                    return text;
                }
                text = text.replace(/^at /, '');
                if (text === 'Error (<anonymous>)' || text === 'Error (<anonymous>:null:null)') {
                    return;
                }
                original = text;
                what = null;
                addr = null;
                path = null;
                dir = null;
                file = null;
                line = null;
                col = null;
                jsLine = null;
                jsCol = null;
                shortenedPath = null;
                shortenedAddr = null;
                packageName = '[current]';
                if (m = text.match(/\(([^\)]+)\)$/)) {
                    addr = m[1].trim();
                }
                if (addr != null) {
                    what = text.substr(0, text.length - addr.length - 2);
                    what = what.trim();
                }
                if (addr == null) {
                    addr = text.trim();
                }
                addr = this._fixPath(addr);
                remaining = addr;
                if (m = remaining.match(/\,\ <js>:(\d+):(\d+)$/)) {
                    jsLine = m[1];
                    jsCol = m[2];
                    remaining = remaining.substr(0, remaining.length - m[0].length);
                }
                if (m = remaining.match(/:(\d+):(\d+)$/)) {
                    line = m[1];
                    col = m[2];
                    remaining = remaining.substr(0, remaining.length - m[0].length);
                    path = remaining;
                }
                if (path != null) {
                    file = sysPath.basename(path);
                    dir = sysPath.dirname(path);
                    if (dir === '.') {
                        dir = '';
                    }
                    path = this._fixPath(path);
                    file = this._fixPath(file);
                    dir = this._fixPath(dir);
                }
                if (dir != null) {
                    d = dir.replace(/[\\]{1,2}/g, '/');
                    if (m = d.match(/node_modules\/([^\/]+)(?!.*node_modules.*)/)) {
                        packageName = m[1];
                    }
                }
                if (jsLine == null) {
                    jsLine = line;
                    jsCol = col;
                }
                if (path != null) {
                    r = this._rectifyPath(path);
                    shortenedPath = r.path;
                    shortenedAddr = shortenedPath + addr.substr(path.length, addr.length);
                    packages = r.packages;
                }
                return {
                    original: original,
                    what: what,
                    addr: addr,
                    path: path,
                    dir: dir,
                    file: file,
                    line: parseInt(line),
                    col: parseInt(col),
                    jsLine: parseInt(jsLine),
                    jsCol: parseInt(jsCol),
                    packageName: packageName,
                    shortenedPath: shortenedPath,
                    shortenedAddr: shortenedAddr,
                    packages: packages || []
                };
            };

            ParsedError.prototype._getMessage = function() {
                return this._message;
            };

            ParsedError.prototype._getKind = function() {
                return this._kind;
            };

            ParsedError.prototype._getWrapper = function() {
                return this._wrapper;
            };

            ParsedError.prototype._getStack = function() {
                return this._stack;
            };

            ParsedError.prototype._getArguments = function() {
                return this.error["arguments"];
            };

            ParsedError.prototype._getType = function() {
                return this.error.type;
            };

            ParsedError.prototype._getTrace = function() {
                return this._trace;
            };

            ParsedError.prototype._fixPath = function(path) {
                return path.replace(/[\\]{1,2}/g, '/');
            };

            ParsedError.prototype._rectifyPath = function(path, nameForCurrentPackage) {
                var m, packages, parts, remaining, rest;
                path = String(path);
                remaining = path;
                if (!(m = path.match(/^(.+?)\/node_modules\/(.+)$/))) {
                    return {
                        path: path,
                        packages: []
                    };
                }
                parts = [];
                packages = [];
                if (typeof nameForCurrentPackage === 'string') {
                    parts.push("[" + nameForCurrentPackage + "]");
                    packages.push("[" + nameForCurrentPackage + "]");
                } else {
                    parts.push("[" + (m[1].match(/([^\/]+)$/)[1]) + "]");
                    packages.push(m[1].match(/([^\/]+)$/)[1]);
                }
                rest = m[2];
                while (m = rest.match(/([^\/]+)\/node_modules\/(.+)$/)) {
                    parts.push("[" + m[1] + "]");
                    packages.push(m[1]);
                    rest = m[2];
                }
                if (m = rest.match(/([^\/]+)\/(.+)$/)) {
                    parts.push("[" + m[1] + "]");
                    packages.push(m[1]);
                    rest = m[2];
                }
                parts.push(rest);
                return {
                    path: parts.join("/"),
                    packages: packages
                };
            };

            return ParsedError;

        })();

        _ref = ['message', 'kind', 'arguments', 'type', 'stack', 'trace', 'wrapper'];
        _fn = function() {
            var methodName;
            methodName = '_get' + prop[0].toUpperCase() + prop.substr(1, prop.length);
            return Object.defineProperty(ParsedError.prototype, prop, {
                get: function() {
                    return this[methodName]();
                }
            });
        };
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            prop = _ref[_i];
            _fn();
        }

    }, { "path": 1 }],
    181: [function(require, module, exports) {
        // Generated by CoffeeScript 1.8.0
        var ParsedError, PrettyError, RenderKid, arrayUtils, defaultStyle, instance, isPlainObject, merge, nodePaths, prop, _fn, _i, _len, _ref,
            __slice = [].slice,
            __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

        isPlainObject = require('lodash/isPlainObject');

        defaultStyle = require('./defaultStyle');

        ParsedError = require('./ParsedError');

        nodePaths = require('./nodePaths');

        RenderKid = require('renderkid');

        merge = require('lodash/merge');

        arrayUtils = {
            pluckByCallback: function(a, cb) {
                var index, removed, value, _i, _len;
                if (a.length < 1) {
                    return a;
                }
                removed = 0;
                for (index = _i = 0, _len = a.length; _i < _len; index = ++_i) {
                    value = a[index];
                    if (cb(value, index)) {
                        removed++;
                        continue;
                    }
                    if (removed !== 0) {
                        a[index - removed] = a[index];
                    }
                }
                if (removed > 0) {
                    a.length = a.length - removed;
                }
                return a;
            },
            pluckOneItem: function(a, item) {
                var index, reached, value, _i, _len;
                if (a.length < 1) {
                    return a;
                }
                reached = false;
                for (index = _i = 0, _len = a.length; _i < _len; index = ++_i) {
                    value = a[index];
                    if (!reached) {
                        if (value === item) {
                            reached = true;
                            continue;
                        }
                    } else {
                        a[index - 1] = a[index];
                    }
                }
                if (reached) {
                    a.length = a.length - 1;
                }
                return a;
            }
        };

        instance = null;

        module.exports = PrettyError = (function() {
            var self;

            self = PrettyError;

            PrettyError._filters = {
                'module.exports': function(item) {
                    if (item.what == null) {
                        return;
                    }
                    item.what = item.what.replace(/\.module\.exports\./g, ' - ');
                }
            };

            PrettyError._getDefaultStyle = function() {
                return defaultStyle();
            };

            PrettyError.start = function() {
                if (instance == null) {
                    instance = new self;
                    instance.start();
                }
                return instance;
            };

            PrettyError.stop = function() {
                return instance != null ? instance.stop() : void 0;
            };

            function PrettyError() {
                this._useColors = true;
                this._maxItems = 50;
                this._packagesToSkip = [];
                this._pathsToSkip = [];
                this._skipCallbacks = [];
                this._filterCallbacks = [];
                this._parsedErrorFilters = [];
                this._aliases = [];
                this._renderer = new RenderKid;
                this._style = self._getDefaultStyle();
                this._renderer.style(this._style);
            }

            PrettyError.prototype.start = function() {
                var prepeare;
                this._oldPrepareStackTrace = Error.prepareStackTrace;
                prepeare = this._oldPrepareStackTrace || function(exc, frames) {
                    var result;
                    result = exc.toString();
                    frames = frames.map(function(frame) {
                        return "  at " + (frame.toString());
                    });
                    return result + "\n" + frames.join("\n");
                };
                Error.prepareStackTrace = (function(_this) {
                    return function(exc, trace) {
                        var stack;
                        stack = prepeare.apply(null, arguments);
                        return _this.render({
                            stack: stack,
                            message: exc.toString().replace(/^.*: /, '')
                        }, false);
                    };
                })(this);
                return this;
            };

            PrettyError.prototype.stop = function() {
                Error.prepareStackTrace = this._oldPrepareStackTrace;
                return this._oldPrepareStackTrace = null;
            };

            PrettyError.prototype.config = function(c) {
                var alias, path, _ref;
                if (c.skipPackages != null) {
                    if (c.skipPackages === false) {
                        this.unskipAllPackages();
                    } else {
                        this.skipPackage.apply(this, c.skipPackages);
                    }
                }
                if (c.skipPaths != null) {
                    if (c.skipPaths === false) {
                        this.unskipAllPaths();
                    } else {
                        this.skipPath.apply(this, c.skipPaths);
                    }
                }
                if (c.skip != null) {
                    if (c.skip === false) {
                        this.unskipAll();
                    } else {
                        this.skip.apply(this, c.skip);
                    }
                }
                if (c.maxItems != null) {
                    this.setMaxItems(c.maxItems);
                }
                if (c.skipNodeFiles === true) {
                    this.skipNodeFiles();
                } else if (c.skipNodeFiles === false) {
                    this.unskipNodeFiles();
                }
                if (c.filters != null) {
                    if (c.filters === false) {
                        this.removeAllFilters();
                    } else {
                        this.filter.apply(this, c.filters);
                    }
                }
                if (c.parsedErrorFilters != null) {
                    if (c.parsedErrorFilters === false) {
                        this.removeAllParsedErrorFilters();
                    } else {
                        this.filterParsedError.apply(this, c.parsedErrorFilters);
                    }
                }
                if (c.aliases != null) {
                    if (isPlainObject(c.aliases)) {
                        _ref = c.aliases;
                        for (path in _ref) {
                            alias = _ref[path];
                            this.alias(path, alias);
                        }
                    } else if (c.aliases === false) {
                        this.removeAllAliases();
                    }
                }
                return this;
            };

            PrettyError.prototype.withoutColors = function() {
                this._useColors = false;
                return this;
            };

            PrettyError.prototype.withColors = function() {
                this._useColors = true;
                return this;
            };

            PrettyError.prototype.skipPackage = function() {
                var packages, pkg, _i, _len;
                packages = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
                for (_i = 0, _len = packages.length; _i < _len; _i++) {
                    pkg = packages[_i];
                    this._packagesToSkip.push(String(pkg));
                }
                return this;
            };

            PrettyError.prototype.unskipPackage = function() {
                var packages, pkg, _i, _len;
                packages = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
                for (_i = 0, _len = packages.length; _i < _len; _i++) {
                    pkg = packages[_i];
                    arrayUtils.pluckOneItem(this._packagesToSkip, pkg);
                }
                return this;
            };

            PrettyError.prototype.unskipAllPackages = function() {
                this._packagesToSkip.length = 0;
                return this;
            };

            PrettyError.prototype.skipPath = function() {
                var path, paths, _i, _len;
                paths = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
                for (_i = 0, _len = paths.length; _i < _len; _i++) {
                    path = paths[_i];
                    this._pathsToSkip.push(path);
                }
                return this;
            };

            PrettyError.prototype.unskipPath = function() {
                var path, paths, _i, _len;
                paths = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
                for (_i = 0, _len = paths.length; _i < _len; _i++) {
                    path = paths[_i];
                    arrayUtils.pluckOneItem(this._pathsToSkip, path);
                }
                return this;
            };

            PrettyError.prototype.unskipAllPaths = function() {
                this._pathsToSkip.length = 0;
                return this;
            };

            PrettyError.prototype.skip = function() {
                var callbacks, cb, _i, _len;
                callbacks = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
                for (_i = 0, _len = callbacks.length; _i < _len; _i++) {
                    cb = callbacks[_i];
                    this._skipCallbacks.push(cb);
                }
                return this;
            };

            PrettyError.prototype.unskip = function() {
                var callbacks, cb, _i, _len;
                callbacks = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
                for (_i = 0, _len = callbacks.length; _i < _len; _i++) {
                    cb = callbacks[_i];
                    arrayUtils.pluckOneItem(this._skipCallbacks, cb);
                }
                return this;
            };

            PrettyError.prototype.unskipAll = function() {
                this._skipCallbacks.length = 0;
                return this;
            };

            PrettyError.prototype.skipNodeFiles = function() {
                return this.skipPath.apply(this, nodePaths);
            };

            PrettyError.prototype.unskipNodeFiles = function() {
                return this.unskipPath.apply(this, nodePaths);
            };

            PrettyError.prototype.filter = function() {
                var callbacks, cb, _i, _len;
                callbacks = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
                for (_i = 0, _len = callbacks.length; _i < _len; _i++) {
                    cb = callbacks[_i];
                    this._filterCallbacks.push(cb);
                }
                return this;
            };

            PrettyError.prototype.removeFilter = function() {
                var callbacks, cb, _i, _len;
                callbacks = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
                for (_i = 0, _len = callbacks.length; _i < _len; _i++) {
                    cb = callbacks[_i];
                    arrayUtils.pluckOneItem(this._filterCallbacks, cb);
                }
                return this;
            };

            PrettyError.prototype.removeAllFilters = function() {
                this._filterCallbacks.length = 0;
                return this;
            };

            PrettyError.prototype.filterParsedError = function() {
                var callbacks, cb, _i, _len;
                callbacks = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
                for (_i = 0, _len = callbacks.length; _i < _len; _i++) {
                    cb = callbacks[_i];
                    this._parsedErrorFilters.push(cb);
                }
                return this;
            };

            PrettyError.prototype.removeParsedErrorFilter = function() {
                var callbacks, cb, _i, _len;
                callbacks = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
                for (_i = 0, _len = callbacks.length; _i < _len; _i++) {
                    cb = callbacks[_i];
                    arrayUtils.pluckOneItem(this._parsedErrorFilters, cb);
                }
                return this;
            };

            PrettyError.prototype.removeAllParsedErrorFilters = function() {
                this._parsedErrorFilters.length = 0;
                return this;
            };

            PrettyError.prototype.setMaxItems = function(maxItems) {
                if (maxItems == null) {
                    maxItems = 50;
                }
                if (maxItems === 0) {
                    maxItems = 50;
                }
                this._maxItems = maxItems | 0;
                return this;
            };

            PrettyError.prototype.alias = function(stringOrRx, alias) {
                this._aliases.push({
                    stringOrRx: stringOrRx,
                    alias: alias
                });
                return this;
            };

            PrettyError.prototype.removeAlias = function(stringOrRx) {
                arrayUtils.pluckByCallback(this._aliases, function(pair) {
                    return pair.stringOrRx === stringOrRx;
                });
                return this;
            };

            PrettyError.prototype.removeAllAliases = function() {
                this._aliases.length = 0;
                return this;
            };

            PrettyError.prototype._getStyle = function() {
                return this._style;
            };

            PrettyError.prototype.appendStyle = function(toAppend) {
                merge(this._style, toAppend);
                this._renderer.style(toAppend);
                return this;
            };

            PrettyError.prototype._getRenderer = function() {
                return this._renderer;
            };

            PrettyError.prototype.render = function(e, logIt, useColors) {
                var obj, rendered;
                if (logIt == null) {
                    logIt = false;
                }
                if (useColors == null) {
                    useColors = this._useColors;
                }
                obj = this.getObject(e);
                rendered = this._renderer.render(obj, useColors);
                if (logIt === true) {
                    console.error(rendered);
                }
                return rendered;
            };

            PrettyError.prototype.getObject = function(e) {
                var count, header, i, item, obj, traceItems, _i, _len, _ref;
                if (!(e instanceof ParsedError)) {
                    e = new ParsedError(e);
                }
                this._applyParsedErrorFiltersOn(e);
                header = {
                    title: (function() {
                        var ret;
                        ret = {};
                        if (e.wrapper !== '') {
                            ret.wrapper = "" + e.wrapper;
                        }
                        ret.kind = e.kind;
                        return ret;
                    })(),
                    colon: ':',
                    message: String(e.message).trim()
                };
                traceItems = [];
                count = -1;
                _ref = e.trace;
                for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
                    item = _ref[i];
                    if (item == null) {
                        continue;
                    }
                    if (this._skipOrFilter(item, i) === true) {
                        continue;
                    }
                    count++;
                    if (count > this._maxItems) {
                        break;
                    }
                    if (typeof item === 'string') {
                        traceItems.push({
                            item: {
                                custom: item
                            }
                        });
                        continue;
                    }
                    traceItems.push((function() {
                        var markupItem;
                        markupItem = {
                            item: {
                                header: {
                                    pointer: (function() {
                                        if (item.file == null) {
                                            return '';
                                        }
                                        return {
                                            file: item.file,
                                            colon: ':',
                                            line: item.line
                                        };
                                    })()
                                },
                                footer: (function() {
                                    var foooter;
                                    foooter = {
                                        addr: item.shortenedAddr
                                    };
                                    if (item.extra != null) {
                                        foooter.extra = item.extra;
                                    }
                                    return foooter;
                                })()
                            }
                        };
                        if (typeof item.what === 'string' && item.what.trim().length > 0) {
                            markupItem.item.header.what = item.what;
                        }
                        return markupItem;
                    })());
                }
                obj = {
                    'pretty-error': {
                        header: header
                    }
                };
                if (traceItems.length > 0) {
                    obj['pretty-error'].trace = traceItems;
                }
                return obj;
            };

            PrettyError.prototype._skipOrFilter = function(item, itemNumber) {
                var cb, modName, pair, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
                if (typeof item === 'object') {
                    if (_ref = item.modName, __indexOf.call(this._packagesToSkip, _ref) >= 0) {
                        return true;
                    }
                    if (_ref1 = item.path, __indexOf.call(this._pathsToSkip, _ref1) >= 0) {
                        return true;
                    }
                    _ref2 = item.packages;
                    for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
                        modName = _ref2[_i];
                        if (__indexOf.call(this._packagesToSkip, modName) >= 0) {
                            return true;
                        }
                    }
                    if (typeof item.shortenedAddr === 'string') {
                        _ref3 = this._aliases;
                        for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) {
                            pair = _ref3[_j];
                            item.shortenedAddr = item.shortenedAddr.replace(pair.stringOrRx, pair.alias);
                        }
                    }
                }
                _ref4 = this._skipCallbacks;
                for (_k = 0, _len2 = _ref4.length; _k < _len2; _k++) {
                    cb = _ref4[_k];
                    if (cb(item, itemNumber) === true) {
                        return true;
                    }
                }
                _ref5 = this._filterCallbacks;
                for (_l = 0, _len3 = _ref5.length; _l < _len3; _l++) {
                    cb = _ref5[_l];
                    cb(item, itemNumber);
                }
                return false;
            };

            PrettyError.prototype._applyParsedErrorFiltersOn = function(error) {
                var cb, _i, _len, _ref;
                _ref = this._parsedErrorFilters;
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    cb = _ref[_i];
                    cb(error);
                }
            };

            return PrettyError;

        })();

        _ref = ['renderer', 'style'];
        _fn = function() {
            var methodName;
            methodName = '_get' + prop[0].toUpperCase() + prop.substr(1, prop.length);
            return PrettyError.prototype.__defineGetter__(prop, function() {
                return this[methodName]();
            });
        };
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            prop = _ref[_i];
            _fn();
        }

    }, { "./ParsedError": 180, "./defaultStyle": 182, "./nodePaths": 183, "lodash/isPlainObject": 168, "lodash/merge": 173, "renderkid": 186 }],
    182: [function(require, module, exports) {
        // Generated by CoffeeScript 1.8.0
        module.exports = function() {
            return {
                'pretty-error': {
                    display: 'block',
                    marginLeft: '2'
                },
                'pretty-error > header': {
                    display: 'block'
                },
                'pretty-error > header > title > kind': {
                    background: 'red',
                    color: 'bright-white'
                },
                'pretty-error > header > title > wrapper': {
                    marginRight: '1',
                    color: 'grey'
                },
                'pretty-error > header > colon': {
                    color: 'grey',
                    marginRight: 1
                },
                'pretty-error > header > message': {
                    color: 'bright-white'
                },
                'pretty-error > trace': {
                    display: 'block',
                    marginTop: 1
                },
                'pretty-error > trace > item': {
                    display: 'block',
                    marginBottom: 1,
                    marginLeft: 2,
                    bullet: '"<grey>-</grey>"'
                },
                'pretty-error > trace > item > header': {
                    display: 'block'
                },
                'pretty-error > trace > item > header > pointer > file': {
                    color: 'bright-yellow'
                },
                'pretty-error > trace > item > header > pointer > colon': {
                    color: 'grey'
                },
                'pretty-error > trace > item > header > pointer > line': {
                    color: 'bright-yellow',
                    marginRight: 1
                },
                'pretty-error > trace > item > header > what': {
                    color: 'white'
                },
                'pretty-error > trace > item > footer': {
                    display: 'block'
                },
                'pretty-error > trace > item > footer > addr': {
                    display: 'block',
                    color: 'grey'
                },
                'pretty-error > trace > item > footer > extra': {
                    display: 'block',
                    color: 'grey'
                }
            };
        };

    }, {}],
    183: [function(require, module, exports) {
        // Generated by CoffeeScript 1.8.0
        module.exports = ['_debugger.js', '_http_agent.js', '_http_client.js', '_http_common.js', '_http_incoming.js', '_http_outgoing.js', '_http_server.js', '_linklist.js', '_stream_duplex.js', '_stream_passthrough.js', '_stream_readable.js', '_stream_transform.js', '_stream_writable.js', '_tls_legacy.js', '_tls_wrap.js', 'assert.js', 'buffer.js', 'child_process.js', 'cluster.js', 'console.js', 'constants.js', 'crypto.js', 'dgram.js', 'dns.js', 'domain.js', 'events.js', 'freelist.js', 'fs.js', 'http.js', 'https.js', 'module.js', 'net.js', 'os.js', 'path.js', 'punycode.js', 'querystring.js', 'readline.js', 'repl.js', 'smalloc.js', 'stream.js', 'string_decoder.js', 'sys.js', 'timers.js', 'tls.js', 'tty.js', 'url.js', 'util.js', 'vm.js', 'zlib.js', 'node.js'];

    }, {}],
    184: [function(require, module, exports) {
        "use strict";

        function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

        function _defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

        // Generated by CoffeeScript 2.5.1
        var AnsiPainter,
            styles,
            tags,
            tools,
            hasProp = {}.hasOwnProperty;
        tools = require('./tools');
        tags = require('./ansiPainter/tags');
        styles = require('./ansiPainter/styles');

        module.exports = AnsiPainter = function() {
            var self;

            var AnsiPainter = /*#__PURE__*/ function() {
                function AnsiPainter() {
                    _classCallCheck(this, AnsiPainter);
                }

                _createClass(AnsiPainter, [{
                    key: "paint",
                    value: function paint(s) {
                        return this._replaceSpecialStrings(this._renderDom(this._parse(s)));
                    }
                }, {
                    key: "_replaceSpecialStrings",
                    value: function _replaceSpecialStrings(str) {
                        return str.replace(/&sp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
                    }
                }, {
                    key: "_parse",
                    value: function _parse(string) {
                        var injectFakeRoot = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

                        if (injectFakeRoot) {
                            string = '<none>' + string + '</none>';
                        }

                        return tools.toDom(string);
                    }
                }, {
                    key: "_renderDom",
                    value: function _renderDom(dom) {
                        var parentStyles;
                        parentStyles = {
                            bg: 'none',
                            color: 'none'
                        };
                        return this._renderChildren(dom, parentStyles);
                    }
                }, {
                    key: "_renderChildren",
                    value: function _renderChildren(children, parentStyles) {
                        var child, n, ret;
                        ret = '';

                        for (n in children) {
                            if (!hasProp.call(children, n)) continue;
                            child = children[n];
                            ret += this._renderNode(child, parentStyles);
                        }

                        return ret;
                    }
                }, {
                    key: "_renderNode",
                    value: function _renderNode(node, parentStyles) {
                        if (node.type === 'text') {
                            return this._renderTextNode(node, parentStyles);
                        } else {
                            return this._renderTag(node, parentStyles);
                        }
                    }
                }, {
                    key: "_renderTextNode",
                    value: function _renderTextNode(node, parentStyles) {
                        return this._wrapInStyle(node.data, parentStyles);
                    }
                }, {
                    key: "_wrapInStyle",
                    value: function _wrapInStyle(str, style) {
                        return styles.color(style.color) + styles.bg(style.bg) + str + styles.none();
                    }
                }, {
                    key: "_renderTag",
                    value: function _renderTag(node, parentStyles) {
                        var currentStyles, tagStyles;
                        tagStyles = this._getStylesForTagName(node.name);
                        currentStyles = this._mixStyles(parentStyles, tagStyles);
                        return this._renderChildren(node.children, currentStyles);
                    }
                }, {
                    key: "_mixStyles",
                    value: function _mixStyles() {
                        var final, i, key, len, style, val;
                        final = {};

                        for (var _len = arguments.length, styles = new Array(_len), _key = 0; _key < _len; _key++) {
                            styles[_key] = arguments[_key];
                        }

                        for (i = 0, len = styles.length; i < len; i++) {
                            style = styles[i];

                            for (key in style) {
                                if (!hasProp.call(style, key)) continue;
                                val = style[key];

                                if (final[key] == null || val !== 'inherit') {
                                    final[key] = val;
                                }
                            }
                        }

                        return final;
                    }
                }, {
                    key: "_getStylesForTagName",
                    value: function _getStylesForTagName(name) {
                        if (tags[name] == null) {
                            throw Error("Unknown tag name `".concat(name, "`"));
                        }

                        return tags[name];
                    }
                }], [{
                    key: "getInstance",
                    value: function getInstance() {
                        if (self._instance == null) {
                            self._instance = new self();
                        }

                        return self._instance;
                    }
                }, {
                    key: "paint",
                    value: function paint(str) {
                        return self.getInstance().paint(str);
                    }
                }, {
                    key: "strip",
                    value: function strip(s) {
                        return s.replace(/\x1b\[[0-9]+m/g, '');
                    }
                }]);

                return AnsiPainter;
            }();

            ;
            AnsiPainter.tags = tags;
            self = AnsiPainter;
            return AnsiPainter;
        }.call(void 0);
    }, { "./ansiPainter/styles": 187, "./ansiPainter/tags": 188, "./tools": 229 }],
    185: [function(require, module, exports) {
        "use strict";

        function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

        function _defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

        // Generated by CoffeeScript 2.5.1
        var Block, Layout, SpecialString, cloneAndMergeDeep, i, len, prop, ref, terminalWidth;
        Block = require('./layout/Block');

        var _require = require('./tools');

        cloneAndMergeDeep = _require.cloneAndMergeDeep;
        SpecialString = require('./layout/SpecialString');
        terminalWidth = require('./tools').getCols();

        module.exports = Layout = function() {
            var self;

            var Layout = /*#__PURE__*/ function() {
                function Layout() {
                    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                    var rootBlockConfig = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

                    _classCallCheck(this, Layout);

                    var rootConfig;
                    this._written = [];
                    this._activeBlock = null;
                    this._config = cloneAndMergeDeep(self._defaultConfig, config); // Every layout has a root block

                    rootConfig = cloneAndMergeDeep(self._rootBlockDefaultConfig, rootBlockConfig);
                    this._root = new Block(this, null, rootConfig, '__root');

                    this._root._open();
                }

                _createClass(Layout, [{
                    key: "getRootBlock",
                    value: function getRootBlock() {
                        return this._root;
                    }
                }, {
                    key: "_append",
                    value: function _append(text) {
                        return this._written.push(text);
                    }
                }, {
                    key: "_appendLine",
                    value: function _appendLine(text) {
                        var s;

                        this._append(text);

                        s = new SpecialString(text);

                        if (s.length < this._config.terminalWidth) {
                            this._append('<none>\n</none>');
                        }

                        return this;
                    }
                }, {
                    key: "get",
                    value: function get() {
                        this._ensureClosed();

                        if (this._written[this._written.length - 1] === '<none>\n</none>') {
                            this._written.pop();
                        }

                        return this._written.join("");
                    }
                }, {
                    key: "_ensureClosed",
                    value: function _ensureClosed() {
                        if (this._activeBlock !== this._root) {
                            throw Error("Not all the blocks have been closed. Please call block.close() on all open blocks.");
                        }

                        if (this._root.isOpen()) {
                            this._root.close();
                        }
                    }
                }]);

                return Layout;
            }();

            ;
            self = Layout;
            Layout._rootBlockDefaultConfig = {
                linePrependor: {
                    options: {
                        amount: 0
                    }
                },
                lineAppendor: {
                    options: {
                        amount: 0
                    }
                },
                blockPrependor: {
                    options: {
                        amount: 0
                    }
                },
                blockAppendor: {
                    options: {
                        amount: 0
                    }
                }
            };
            Layout._defaultConfig = {
                terminalWidth: terminalWidth
            };
            return Layout;
        }.call(void 0);

        ref = ['openBlock', 'write'];

        for (i = 0, len = ref.length; i < len; i++) {
            prop = ref[i];

            (function() {
                var method;
                method = prop;
                return Layout.prototype[method] = function() {
                    return this._root[method].apply(this._root, arguments);
                };
            })();
        }
    }, { "./layout/Block": 189, "./layout/SpecialString": 190, "./tools": 229 }],
    186: [function(require, module, exports) {
        "use strict";

        function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

        function _defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

        // Generated by CoffeeScript 2.5.1
        var AnsiPainter, Layout, RenderKid, Styles, blockStyleApplier, cloneAndMergeDeep, inlineStyleApplier, isPlainObject, stripAnsi, terminalWidth, tools;
        inlineStyleApplier = require('./renderKid/styleApplier/inline');
        blockStyleApplier = require('./renderKid/styleApplier/block');
        isPlainObject = require('lodash/isPlainObject');

        var _require = require('./tools');

        cloneAndMergeDeep = _require.cloneAndMergeDeep;
        AnsiPainter = require('./AnsiPainter');
        Styles = require('./renderKid/Styles');
        Layout = require('./Layout');
        tools = require('./tools');
        stripAnsi = require('strip-ansi');
        terminalWidth = require('./tools').getCols();

        module.exports = RenderKid = function() {
            var self;

            var RenderKid = /*#__PURE__*/ function() {
                function RenderKid() {
                    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                    _classCallCheck(this, RenderKid);

                    this.tools = self.tools;
                    this._config = cloneAndMergeDeep(self._defaultConfig, config);

                    this._initStyles();
                }

                _createClass(RenderKid, [{
                    key: "_initStyles",
                    value: function _initStyles() {
                        return this._styles = new Styles();
                    }
                }, {
                    key: "style",
                    value: function style() {
                        return this._styles.setRule.apply(this._styles, arguments);
                    }
                }, {
                    key: "_getStyleFor",
                    value: function _getStyleFor(el) {
                        return this._styles.getStyleFor(el);
                    }
                }, {
                    key: "render",
                    value: function render(input) {
                        var withColors = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
                        return this._paint(this._renderDom(this._toDom(input)), withColors);
                    }
                }, {
                    key: "_toDom",
                    value: function _toDom(input) {
                        if (typeof input === 'string') {
                            return this._parse(input);
                        } else if (isPlainObject(input) || Array.isArray(input)) {
                            return this._objToDom(input);
                        } else {
                            throw Error("Invalid input type. Only strings, arrays and objects are accepted");
                        }
                    }
                }, {
                    key: "_objToDom",
                    value: function _objToDom(o) {
                        var injectFakeRoot = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

                        if (injectFakeRoot) {
                            o = {
                                body: o
                            };
                        }

                        return tools.objectToDom(o);
                    }
                }, {
                    key: "_paint",
                    value: function _paint(text, withColors) {
                        var painted;
                        painted = AnsiPainter.paint(text);

                        if (withColors) {
                            return painted;
                        } else {
                            return stripAnsi(painted);
                        }
                    }
                }, {
                    key: "_parse",
                    value: function _parse(string) {
                        var injectFakeRoot = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

                        if (injectFakeRoot) {
                            string = '<body>' + string + '</body>';
                        }

                        return tools.stringToDom(string);
                    }
                }, {
                    key: "_renderDom",
                    value: function _renderDom(dom) {
                        var bodyTag, layout, rootBlock;
                        bodyTag = dom[0];
                        layout = new Layout(this._config.layout);
                        rootBlock = layout.getRootBlock();

                        this._renderBlockNode(bodyTag, null, rootBlock);

                        return layout.get();
                    }
                }, {
                    key: "_renderChildrenOf",
                    value: function _renderChildrenOf(parentNode, parentBlock) {
                        var i, len, node, nodes;
                        nodes = parentNode.children;

                        for (i = 0, len = nodes.length; i < len; i++) {
                            node = nodes[i];

                            this._renderNode(node, parentNode, parentBlock);
                        }
                    }
                }, {
                    key: "_renderNode",
                    value: function _renderNode(node, parentNode, parentBlock) {
                        if (node.type === 'text') {
                            this._renderText(node, parentNode, parentBlock);
                        } else if (node.name === 'br') {
                            this._renderBr(node, parentNode, parentBlock);
                        } else if (this._isBlock(node)) {
                            this._renderBlockNode(node, parentNode, parentBlock);
                        } else if (this._isNone(node)) {
                            return;
                        } else {
                            this._renderInlineNode(node, parentNode, parentBlock);
                        }
                    }
                }, {
                    key: "_renderText",
                    value: function _renderText(node, parentNode, parentBlock) {
                        var ref, text;
                        text = node.data;
                        text = text.replace(/\s+/g, ' '); // let's only trim if the parent is an inline element

                        if ((parentNode != null ? (ref = parentNode.styles) != null ? ref.display : void 0 : void 0) !== 'inline') {
                            text = text.trim();
                        }

                        if (text.length === 0) {
                            return;
                        }

                        text = text.replace(/&nl;/g, "\n");
                        return parentBlock.write(text);
                    }
                }, {
                    key: "_renderBlockNode",
                    value: function _renderBlockNode(node, parentNode, parentBlock) {
                        var after, before, block, blockConfig;

                        var _blockStyleApplier$ap = blockStyleApplier.applyTo(node, this._getStyleFor(node));

                        before = _blockStyleApplier$ap.before;
                        after = _blockStyleApplier$ap.after;
                        blockConfig = _blockStyleApplier$ap.blockConfig;
                        block = parentBlock.openBlock(blockConfig);

                        if (before !== '') {
                            block.write(before);
                        }

                        this._renderChildrenOf(node, block);

                        if (after !== '') {
                            block.write(after);
                        }

                        return block.close();
                    }
                }, {
                    key: "_renderInlineNode",
                    value: function _renderInlineNode(node, parentNode, parentBlock) {
                        var after, before;

                        var _inlineStyleApplier$a = inlineStyleApplier.applyTo(node, this._getStyleFor(node));

                        before = _inlineStyleApplier$a.before;
                        after = _inlineStyleApplier$a.after;

                        if (before !== '') {
                            parentBlock.write(before);
                        }

                        this._renderChildrenOf(node, parentBlock);

                        if (after !== '') {
                            return parentBlock.write(after);
                        }
                    }
                }, {
                    key: "_renderBr",
                    value: function _renderBr(node, parentNode, parentBlock) {
                        return parentBlock.write("\n");
                    }
                }, {
                    key: "_isBlock",
                    value: function _isBlock(node) {
                        return !(node.type === 'text' || node.name === 'br' || this._getStyleFor(node).display !== 'block');
                    }
                }, {
                    key: "_isNone",
                    value: function _isNone(node) {
                        return !(node.type === 'text' || node.name === 'br' || this._getStyleFor(node).display !== 'none');
                    }
                }]);

                return RenderKid;
            }();

            ;
            self = RenderKid;
            RenderKid.AnsiPainter = AnsiPainter;
            RenderKid.Layout = Layout;
            RenderKid.quote = tools.quote;
            RenderKid.tools = tools;
            RenderKid._defaultConfig = {
                layout: {
                    terminalWidth: terminalWidth
                }
            };
            return RenderKid;
        }.call(void 0);
    }, { "./AnsiPainter": 184, "./Layout": 185, "./renderKid/Styles": 201, "./renderKid/styleApplier/block": 203, "./renderKid/styleApplier/inline": 204, "./tools": 229, "lodash/isPlainObject": 168, "strip-ansi": 230 }],
    187: [function(require, module, exports) {
        "use strict";

        // Generated by CoffeeScript 2.5.1
        var codes, styles;
        module.exports = styles = {};
        styles.codes = codes = {
            'none': 0,
            'black': 30,
            'red': 31,
            'green': 32,
            'yellow': 33,
            'blue': 34,
            'magenta': 35,
            'cyan': 36,
            'white': 37,
            'grey': 90,
            'bright-red': 91,
            'bright-green': 92,
            'bright-yellow': 93,
            'bright-blue': 94,
            'bright-magenta': 95,
            'bright-cyan': 96,
            'bright-white': 97,
            'bg-black': 40,
            'bg-red': 41,
            'bg-green': 42,
            'bg-yellow': 43,
            'bg-blue': 44,
            'bg-magenta': 45,
            'bg-cyan': 46,
            'bg-white': 47,
            'bg-grey': 100,
            'bg-bright-red': 101,
            'bg-bright-green': 102,
            'bg-bright-yellow': 103,
            'bg-bright-blue': 104,
            'bg-bright-magenta': 105,
            'bg-bright-cyan': 106,
            'bg-bright-white': 107
        };

        styles.color = function(str) {
            var code;

            if (str === 'none') {
                return '';
            }

            code = codes[str];

            if (code == null) {
                throw Error("Unknown color `".concat(str, "`"));
            }

            return "\x1b[" + code + "m";
        };

        styles.bg = function(str) {
            var code;

            if (str === 'none') {
                return '';
            }

            code = codes['bg-' + str];

            if (code == null) {
                throw Error("Unknown bg color `".concat(str, "`"));
            }

            return "\x1B[" + code + "m";
        };

        styles.none = function(str) {
            return "\x1B[" + codes.none + "m";
        };
    }, {}],
    188: [function(require, module, exports) {
        "use strict";

        // Generated by CoffeeScript 2.5.1
        var color, colors, i, len, tags;
        module.exports = tags = {
            'none': {
                color: 'none',
                bg: 'none'
            },
            'bg-none': {
                color: 'inherit',
                bg: 'none'
            },
            'color-none': {
                color: 'none',
                bg: 'inherit'
            }
        };
        colors = ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white', 'grey', 'bright-red', 'bright-green', 'bright-yellow', 'bright-blue', 'bright-magenta', 'bright-cyan', 'bright-white'];

        for (i = 0, len = colors.length; i < len; i++) {
            color = colors[i];
            tags[color] = {
                color: color,
                bg: 'inherit'
            };
            tags["color-".concat(color)] = {
                color: color,
                bg: 'inherit'
            };
            tags["bg-".concat(color)] = {
                color: 'inherit',
                bg: color
            };
        }
    }, {}],
    189: [function(require, module, exports) {
        "use strict";

        function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

        function _defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

        // Generated by CoffeeScript 2.5.1
        var Block, SpecialString, cloneAndMergeDeep, terminalWidth;
        SpecialString = require('./SpecialString');
        terminalWidth = require('../tools').getCols();

        var _require = require('../tools');

        cloneAndMergeDeep = _require.cloneAndMergeDeep;

        module.exports = Block = function() {
            var self;

            var Block = /*#__PURE__*/ function() {
                function Block(_layout, _parent) {
                    var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

                    var _name = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';

                    _classCallCheck(this, Block);

                    this._layout = _layout;
                    this._parent = _parent;
                    this._name = _name;
                    this._config = cloneAndMergeDeep(self.defaultConfig, config);
                    this._closed = false;
                    this._wasOpenOnce = false;
                    this._active = false;
                    this._buffer = '';
                    this._didSeparateBlock = false;
                    this._linePrependor = new this._config.linePrependor.fn(this._config.linePrependor.options);
                    this._lineAppendor = new this._config.lineAppendor.fn(this._config.lineAppendor.options);
                    this._blockPrependor = new this._config.blockPrependor.fn(this._config.blockPrependor.options);
                    this._blockAppendor = new this._config.blockAppendor.fn(this._config.blockAppendor.options);
                }

                _createClass(Block, [{
                    key: "_activate",
                    value: function _activate() {
                        var deactivateParent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

                        if (this._active) {
                            throw Error("This block is already active. This is probably a bug in RenderKid itself");
                        }

                        if (this._closed) {
                            throw Error("This block is closed and cannot be activated. This is probably a bug in RenderKid itself");
                        }

                        this._active = true;
                        this._layout._activeBlock = this;

                        if (deactivateParent) {
                            if (this._parent != null) {
                                this._parent._deactivate(false);
                            }
                        }

                        return this;
                    }
                }, {
                    key: "_deactivate",
                    value: function _deactivate() {
                        var activateParent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

                        this._ensureActive();

                        this._flushBuffer();

                        if (activateParent) {
                            if (this._parent != null) {
                                this._parent._activate(false);
                            }
                        }

                        this._active = false;
                        return this;
                    }
                }, {
                    key: "_ensureActive",
                    value: function _ensureActive() {
                        if (!this._wasOpenOnce) {
                            throw Error("This block has never been open before. This is probably a bug in RenderKid itself.");
                        }

                        if (!this._active) {
                            throw Error("This block is not active. This is probably a bug in RenderKid itself.");
                        }

                        if (this._closed) {
                            throw Error("This block is already closed. This is probably a bug in RenderKid itself.");
                        }
                    }
                }, {
                    key: "_open",
                    value: function _open() {
                        if (this._wasOpenOnce) {
                            throw Error("Block._open() has been called twice. This is probably a RenderKid bug.");
                        }

                        this._wasOpenOnce = true;

                        if (this._parent != null) {
                            this._parent.write(this._whatToPrependToBlock());
                        }

                        this._activate();

                        return this;
                    }
                }, {
                    key: "close",
                    value: function close() {
                        this._deactivate();

                        this._closed = true;

                        if (this._parent != null) {
                            this._parent.write(this._whatToAppendToBlock());
                        }

                        return this;
                    }
                }, {
                    key: "isOpen",
                    value: function isOpen() {
                        return this._wasOpenOnce && !this._closed;
                    }
                }, {
                    key: "write",
                    value: function write(str) {
                        this._ensureActive();

                        if (str === '') {
                            return;
                        }

                        str = String(str);
                        this._buffer += str;
                        return this;
                    }
                }, {
                    key: "openBlock",
                    value: function openBlock(config, name) {
                        var block;

                        this._ensureActive();

                        block = new Block(this._layout, this, config, name);

                        block._open();

                        return block;
                    }
                }, {
                    key: "_flushBuffer",
                    value: function _flushBuffer() {
                        var str;

                        if (this._buffer === '') {
                            return;
                        }

                        str = this._buffer;
                        this._buffer = '';

                        this._writeInline(str);
                    }
                }, {
                    key: "_toPrependToLine",
                    value: function _toPrependToLine() {
                        var fromParent;
                        fromParent = '';

                        if (this._parent != null) {
                            fromParent = this._parent._toPrependToLine();
                        }

                        return this._linePrependor.render(fromParent);
                    }
                }, {
                    key: "_toAppendToLine",
                    value: function _toAppendToLine() {
                        var fromParent;
                        fromParent = '';

                        if (this._parent != null) {
                            fromParent = this._parent._toAppendToLine();
                        }

                        return this._lineAppendor.render(fromParent);
                    }
                }, {
                    key: "_whatToPrependToBlock",
                    value: function _whatToPrependToBlock() {
                        return this._blockPrependor.render();
                    }
                }, {
                    key: "_whatToAppendToBlock",
                    value: function _whatToAppendToBlock() {
                        return this._blockAppendor.render();
                    }
                }, {
                    key: "_writeInline",
                    value: function _writeInline(str) {
                            var i, j, k, l, lineBreaksToAppend, m, ref, ref1, ref2, remaining; // special characters (such as <bg-white>) don't require
                            // any wrapping...

                            if (new SpecialString(str).isOnlySpecialChars()) {
                                // ... and directly get appended to the layout.
                                this._layout._append(str);

                                return;
                            } // we'll be removing from the original string till it's empty


                            remaining = str; // we might need to add a few line breaks at the end of the text.

                            lineBreaksToAppend = 0; // if text starts with line breaks...

                            if (m = remaining.match(/^\n+/)) {
                                // ... we want to write the exact same number of line breaks
                                // to the layout.
                                for (i = j = 1, ref = m[0].length; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
                                    this._writeLine('');
                                }

                                remaining = remaining.substr(m[0].length, remaining.length);
                            } // and if the text ends with line breaks...


                            if (m = remaining.match(/\n+$/)) {
                                // we want to write the exact same number of line breaks
                                // to the end of the layout.
                                lineBreaksToAppend = m[0].length;
                                remaining = remaining.substr(0, remaining.length - m[0].length);
                            } // now let's parse the body of the text:


                            while (remaining.length > 0) {
                                // anything other than a break line...
                                if (m = remaining.match(/^[^\n]+/)) {
                                    // ... should be wrapped as a block of text.
                                    this._writeLine(m[0]);

                                    remaining = remaining.substr(m[0].length, remaining.length); // for any number of line breaks we find inside the text...
                                } else if (m = remaining.match(/^\n+/)) {
                                    // ... we write one less break line to the layout.
                                    for (i = k = 1, ref1 = m[0].length; 1 <= ref1 ? k < ref1 : k > ref1; i = 1 <= ref1 ? ++k : --k) {
                                        this._writeLine('');
                                    }

                                    remaining = remaining.substr(m[0].length, remaining.length);
                                }
                            } // if we had line breaks to append to the layout...


                            if (lineBreaksToAppend > 0) {
                                // ... we append the exact same number of line breaks to the layout.
                                for (i = l = 1, ref2 = lineBreaksToAppend; 1 <= ref2 ? l <= ref2 : l >= ref2; i = 1 <= ref2 ? ++l : --l) {
                                    this._writeLine('');
                                }
                            }
                        } // wraps a line into multiple lines if necessary, adds horizontal margins,
                        // etc, and appends it to the layout.

                }, {
                    key: "_writeLine",
                    value: function _writeLine(str) {
                        var line, lineContent, lineContentLength, remaining, roomLeft, toAppend, toAppendLength, toPrepend, toPrependLength; // we'll be cutting from our string as we go

                        remaining = new SpecialString(str);

                        while (true) {
                            // left margin...
                            // this will continue until nothing is left of our block.
                            toPrepend = this._toPrependToLine(); // ... and its length

                            toPrependLength = new SpecialString(toPrepend).length; // right margin...

                            toAppend = this._toAppendToLine(); // ... and its length

                            toAppendLength = new SpecialString(toAppend).length; // how much room is left for content

                            roomLeft = this._layout._config.terminalWidth - (toPrependLength + toAppendLength); // how much room each line of content will have

                            lineContentLength = Math.min(this._config.width, roomLeft); // cut line content, only for the amount needed

                            lineContent = remaining.cut(0, lineContentLength, true); // line will consist of both margins and the content

                            line = toPrepend + lineContent.str + toAppend; // send it off to layout

                            this._layout._appendLine(line);

                            if (remaining.isEmpty()) {
                                break;
                            }
                        }
                    }
                }]);

                return Block;
            }();

            ;
            self = Block;
            Block.defaultConfig = {
                blockPrependor: {
                    fn: require('./block/blockPrependor/Default'),
                    options: {
                        amount: 0
                    }
                },
                blockAppendor: {
                    fn: require('./block/blockAppendor/Default'),
                    options: {
                        amount: 0
                    }
                },
                linePrependor: {
                    fn: require('./block/linePrependor/Default'),
                    options: {
                        amount: 0
                    }
                },
                lineAppendor: {
                    fn: require('./block/lineAppendor/Default'),
                    options: {
                        amount: 0
                    }
                },
                lineWrapper: {
                    fn: require('./block/lineWrapper/Default'),
                    options: {
                        lineWidth: null
                    }
                },
                width: terminalWidth,
                prefixRaw: '',
                suffixRaw: ''
            };
            return Block;
        }.call(void 0);
    }, { "../tools": 229, "./SpecialString": 190, "./block/blockAppendor/Default": 191, "./block/blockPrependor/Default": 193, "./block/lineAppendor/Default": 195, "./block/linePrependor/Default": 197, "./block/lineWrapper/Default": 199 }],
    190: [function(require, module, exports) {
        "use strict";

        function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

        function _defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

        // Generated by CoffeeScript 2.5.1
        var SpecialString, i, len, prop, ref;

        module.exports = SpecialString = function() {
            var self;

            var SpecialString = /*#__PURE__*/ function() {
                function SpecialString(str) {
                    _classCallCheck(this, SpecialString);

                    if (!(this instanceof self)) {
                        return new self(str);
                    }

                    this._str = String(str);
                    this._len = 0;
                }

                _createClass(SpecialString, [{
                    key: "_getStr",
                    value: function _getStr() {
                        return this._str;
                    }
                }, {
                    key: "set",
                    value: function set(str) {
                        this._str = String(str);
                        return this;
                    }
                }, {
                    key: "clone",
                    value: function clone() {
                        return new SpecialString(this._str);
                    }
                }, {
                    key: "isEmpty",
                    value: function isEmpty() {
                        return this._str === '';
                    }
                }, {
                    key: "isOnlySpecialChars",
                    value: function isOnlySpecialChars() {
                        return !this.isEmpty() && this.length === 0;
                    }
                }, {
                    key: "_reset",
                    value: function _reset() {
                        return this._len = 0;
                    }
                }, {
                    key: "splitIn",
                    value: function splitIn(limit) {
                        var trimLeftEachLine = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
                        var buffer, bufferLength, justSkippedSkipChar, lines;
                        buffer = '';
                        bufferLength = 0;
                        lines = [];
                        justSkippedSkipChar = false;

                        self._countChars(this._str, function(char, charLength) {
                            if (bufferLength > limit || bufferLength + charLength > limit) {
                                lines.push(buffer);
                                buffer = '';
                                bufferLength = 0;
                            }

                            if (bufferLength === 0 && char === ' ' && !justSkippedSkipChar && trimLeftEachLine) {
                                return justSkippedSkipChar = true;
                            } else {
                                buffer += char;
                                bufferLength += charLength;
                                return justSkippedSkipChar = false;
                            }
                        });

                        if (buffer.length > 0) {
                            lines.push(buffer);
                        }

                        return lines;
                    }
                }, {
                    key: "trim",
                    value: function trim() {
                        return new SpecialString(this.str.trim());
                    }
                }, {
                    key: "_getLength",
                    value: function _getLength() {
                        var sum;
                        sum = 0;

                        self._countChars(this._str, function(char, charLength) {
                            sum += charLength;
                        });

                        return sum;
                    }
                }, {
                    key: "cut",
                    value: function cut(from, to) {
                        var _this = this;

                        var trimLeft = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
                        var after, before, cur, cut;

                        if (to == null) {
                            to = this.length;
                        }

                        from = parseInt(from);

                        if (from >= to) {
                            throw Error("`from` shouldn't be larger than `to`");
                        }

                        before = '';
                        after = '';
                        cut = '';
                        cur = 0;

                        self._countChars(this._str, function(char, charLength) {
                            if (_this.str === 'ab<tag>') {
                                console.log(charLength, char);
                            }

                            if (cur === from && char.match(/^\s+$/) && trimLeft) {
                                return;
                            }

                            if (cur < from) {
                                before += char; // let's be greedy
                            } else if (cur < to || cur + charLength <= to) {
                                cut += char;
                            } else {
                                after += char;
                            }

                            cur += charLength;
                        });

                        this._str = before + after;

                        this._reset();

                        return new SpecialString(cut);
                    }
                }], [{
                    key: "_countChars",
                    value: function _countChars(text, cb) {
                        var char, charLength, m;

                        while (text.length !== 0) {
                            if (m = text.match(self._tagRx)) {
                                char = m[0];
                                charLength = 0;
                                text = text.substr(char.length, text.length);
                            } else if (m = text.match(self._quotedHtmlRx)) {
                                char = m[0];
                                charLength = 1;
                                text = text.substr(char.length, text.length);
                            } else if (text.match(self._tabRx)) {
                                char = "\t";
                                charLength = 8;
                                text = text.substr(1, text.length);
                            } else {
                                char = text[0];
                                charLength = 1;
                                text = text.substr(1, text.length);
                            }

                            cb.call(null, char, charLength);
                        }
                    }
                }]);

                return SpecialString;
            }();

            ;
            self = SpecialString;
            SpecialString._tabRx = /^\t/;
            SpecialString._tagRx = /^<[^>]+>/;
            SpecialString._quotedHtmlRx = /^&(gt|lt|quot|amp|apos|sp);/;
            return SpecialString;
        }.call(void 0);

        ref = ['str', 'length'];

        for (i = 0, len = ref.length; i < len; i++) {
            prop = ref[i];

            (function() {
                var methodName;
                methodName = '_get' + prop[0].toUpperCase() + prop.substr(1, prop.length);
                return SpecialString.prototype.__defineGetter__(prop, function() {
                    return this[methodName]();
                });
            })();
        }
    }, {}],
    191: [function(require, module, exports) {
        "use strict";

        function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

        function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

        function _defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

        function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); }
            subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });
            if (superClass) _setPrototypeOf(subClass, superClass);
        }

        function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

        function _createSuper(Derived) {
            var hasNativeReflectConstruct = _isNativeReflectConstruct();
            return function _createSuperInternal() {
                var Super = _getPrototypeOf(Derived),
                    result;
                if (hasNativeReflectConstruct) {
                    var NewTarget = _getPrototypeOf(this).constructor;
                    result = Reflect.construct(Super, arguments, NewTarget);
                } else { result = Super.apply(this, arguments); }
                return _possibleConstructorReturn(this, result);
            };
        }

        function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

        function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

        function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})); return true; } catch (e) { return false; } }

        function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

        // Generated by CoffeeScript 2.5.1
        var DefaultBlockAppendor, tools;
        tools = require('../../../tools');

        module.exports = DefaultBlockAppendor = /*#__PURE__*/ function(_require) {
            _inherits(DefaultBlockAppendor, _require);

            var _super = _createSuper(DefaultBlockAppendor);

            function DefaultBlockAppendor() {
                _classCallCheck(this, DefaultBlockAppendor);

                return _super.apply(this, arguments);
            }

            _createClass(DefaultBlockAppendor, [{
                key: "_render",
                value: function _render(options) {
                    return tools.repeatString("\n", this._config.amount);
                }
            }]);

            return DefaultBlockAppendor;
        }(require('./_BlockAppendor'));
    }, { "../../../tools": 229, "./_BlockAppendor": 192 }],
    192: [function(require, module, exports) {
        "use strict";

        function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

        function _defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

        // Generated by CoffeeScript 2.5.1
        var _BlockAppendor;

        module.exports = _BlockAppendor = /*#__PURE__*/ function() {
            function _BlockAppendor(_config) {
                _classCallCheck(this, _BlockAppendor);

                this._config = _config;
            }

            _createClass(_BlockAppendor, [{
                key: "render",
                value: function render(options) {
                    return this._render(options);
                }
            }]);

            return _BlockAppendor;
        }();
    }, {}],
    193: [function(require, module, exports) {
        "use strict";

        function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

        function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

        function _defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

        function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); }
            subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });
            if (superClass) _setPrototypeOf(subClass, superClass);
        }

        function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

        function _createSuper(Derived) {
            var hasNativeReflectConstruct = _isNativeReflectConstruct();
            return function _createSuperInternal() {
                var Super = _getPrototypeOf(Derived),
                    result;
                if (hasNativeReflectConstruct) {
                    var NewTarget = _getPrototypeOf(this).constructor;
                    result = Reflect.construct(Super, arguments, NewTarget);
                } else { result = Super.apply(this, arguments); }
                return _possibleConstructorReturn(this, result);
            };
        }

        function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

        function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

        function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})); return true; } catch (e) { return false; } }

        function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

        // Generated by CoffeeScript 2.5.1
        var DefaultBlockPrependor, tools;
        tools = require('../../../tools');

        module.exports = DefaultBlockPrependor = /*#__PURE__*/ function(_require) {
            _inherits(DefaultBlockPrependor, _require);

            var _super = _createSuper(DefaultBlockPrependor);

            function DefaultBlockPrependor() {
                _classCallCheck(this, DefaultBlockPrependor);

                return _super.apply(this, arguments);
            }

            _createClass(DefaultBlockPrependor, [{
                key: "_render",
                value: function _render(options) {
                    return tools.repeatString("\n", this._config.amount);
                }
            }]);

            return DefaultBlockPrependor;
        }(require('./_BlockPrependor'));
    }, { "../../../tools": 229, "./_BlockPrependor": 194 }],
    194: [function(require, module, exports) {
        "use strict";

        function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

        function _defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

        // Generated by CoffeeScript 2.5.1
        var _BlockPrependor;

        module.exports = _BlockPrependor = /*#__PURE__*/ function() {
            function _BlockPrependor(_config) {
                _classCallCheck(this, _BlockPrependor);

                this._config = _config;
            }

            _createClass(_BlockPrependor, [{
                key: "render",
                value: function render(options) {
                    return this._render(options);
                }
            }]);

            return _BlockPrependor;
        }();
    }, {}],
    195: [function(require, module, exports) {
        "use strict";

        function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

        function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

        function _defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

        function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); }
            subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });
            if (superClass) _setPrototypeOf(subClass, superClass);
        }

        function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

        function _createSuper(Derived) {
            var hasNativeReflectConstruct = _isNativeReflectConstruct();
            return function _createSuperInternal() {
                var Super = _getPrototypeOf(Derived),
                    result;
                if (hasNativeReflectConstruct) {
                    var NewTarget = _getPrototypeOf(this).constructor;
                    result = Reflect.construct(Super, arguments, NewTarget);
                } else { result = Super.apply(this, arguments); }
                return _possibleConstructorReturn(this, result);
            };
        }

        function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

        function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

        function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})); return true; } catch (e) { return false; } }

        function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

        // Generated by CoffeeScript 2.5.1
        var DefaultLineAppendor, tools;
        tools = require('../../../tools');

        module.exports = DefaultLineAppendor = /*#__PURE__*/ function(_require) {
            _inherits(DefaultLineAppendor, _require);

            var _super = _createSuper(DefaultLineAppendor);

            function DefaultLineAppendor() {
                _classCallCheck(this, DefaultLineAppendor);

                return _super.apply(this, arguments);
            }

            _createClass(DefaultLineAppendor, [{
                key: "_render",
                value: function _render(inherited, options) {
                    return inherited + tools.repeatString(" ", this._config.amount);
                }
            }]);

            return DefaultLineAppendor;
        }(require('./_LineAppendor'));
    }, { "../../../tools": 229, "./_LineAppendor": 196 }],
    196: [function(require, module, exports) {
        "use strict";

        function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

        function _defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

        // Generated by CoffeeScript 2.5.1
        var _LineAppendor;

        module.exports = _LineAppendor = /*#__PURE__*/ function() {
            function _LineAppendor(_config) {
                _classCallCheck(this, _LineAppendor);

                this._config = _config;
                this._lineNo = 0;
            }

            _createClass(_LineAppendor, [{
                key: "render",
                value: function render(inherited, options) {
                    this._lineNo++;
                    return '<none>' + this._render(inherited, options) + '</none>';
                }
            }]);

            return _LineAppendor;
        }();
    }, {}],
    197: [function(require, module, exports) {
        "use strict";

        function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

        function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

        function _defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

        function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); }
            subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });
            if (superClass) _setPrototypeOf(subClass, superClass);
        }

        function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

        function _createSuper(Derived) {
            var hasNativeReflectConstruct = _isNativeReflectConstruct();
            return function _createSuperInternal() {
                var Super = _getPrototypeOf(Derived),
                    result;
                if (hasNativeReflectConstruct) {
                    var NewTarget = _getPrototypeOf(this).constructor;
                    result = Reflect.construct(Super, arguments, NewTarget);
                } else { result = Super.apply(this, arguments); }
                return _possibleConstructorReturn(this, result);
            };
        }

        function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

        function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

        function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})); return true; } catch (e) { return false; } }

        function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

        // Generated by CoffeeScript 2.5.1
        var DefaultLinePrependor, SpecialString, tools;
        tools = require('../../../tools');
        SpecialString = require('../../SpecialString');

        module.exports = DefaultLinePrependor = function() {
            var self;

            var DefaultLinePrependor = /*#__PURE__*/ function(_require) {
                _inherits(DefaultLinePrependor, _require);

                var _super = _createSuper(DefaultLinePrependor);

                function DefaultLinePrependor() {
                    _classCallCheck(this, DefaultLinePrependor);

                    return _super.apply(this, arguments);
                }

                _createClass(DefaultLinePrependor, [{
                    key: "_render",
                    value: function _render(inherited, options) {
                        var addToLeft, addToRight, alignment, bullet, char, charLen, diff, left, output, space, toWrite;

                        if (this._lineNo === 0 && (bullet = this._config.bullet)) {
                            char = bullet.char;
                            charLen = new SpecialString(char).length;
                            alignment = bullet.alignment;
                            space = this._config.amount;
                            toWrite = char;
                            addToLeft = '';
                            addToRight = '';

                            if (space > charLen) {
                                diff = space - charLen;

                                if (alignment === 'right') {
                                    addToLeft = self.pad(diff);
                                } else if (alignment === 'left') {
                                    addToRight = self.pad(diff);
                                } else if (alignment === 'center') {
                                    left = Math.round(diff / 2);
                                    addToLeft = self.pad(left);
                                    addToRight = self.pad(diff - left);
                                } else {
                                    throw Error("Unknown alignment `".concat(alignment, "`"));
                                }
                            }

                            output = addToLeft + char + addToRight;
                        } else {
                            output = self.pad(this._config.amount);
                        }

                        return inherited + output;
                    }
                }], [{
                    key: "pad",
                    value: function pad(howMuch) {
                        return tools.repeatString(" ", howMuch);
                    }
                }]);

                return DefaultLinePrependor;
            }(require('./_LinePrependor'));

            ;
            self = DefaultLinePrependor;
            return DefaultLinePrependor;
        }.call(void 0);
    }, { "../../../tools": 229, "../../SpecialString": 190, "./_LinePrependor": 198 }],
    198: [function(require, module, exports) {
        "use strict";

        function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

        function _defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

        // Generated by CoffeeScript 2.5.1
        var _LinePrependor;

        module.exports = _LinePrependor = /*#__PURE__*/ function() {
            function _LinePrependor(_config) {
                _classCallCheck(this, _LinePrependor);

                this._config = _config;
                this._lineNo = -1;
            }

            _createClass(_LinePrependor, [{
                key: "render",
                value: function render(inherited, options) {
                    this._lineNo++;
                    return '<none>' + this._render(inherited, options) + '</none>';
                }
            }]);

            return _LinePrependor;
        }();
    }, {}],
    199: [function(require, module, exports) {
        "use strict";

        function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

        function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

        function _defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

        function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); }
            subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });
            if (superClass) _setPrototypeOf(subClass, superClass);
        }

        function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

        function _createSuper(Derived) {
            var hasNativeReflectConstruct = _isNativeReflectConstruct();
            return function _createSuperInternal() {
                var Super = _getPrototypeOf(Derived),
                    result;
                if (hasNativeReflectConstruct) {
                    var NewTarget = _getPrototypeOf(this).constructor;
                    result = Reflect.construct(Super, arguments, NewTarget);
                } else { result = Super.apply(this, arguments); }
                return _possibleConstructorReturn(this, result);
            };
        }

        function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

        function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

        function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})); return true; } catch (e) { return false; } }

        function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

        // Generated by CoffeeScript 2.5.1
        var DefaultLineWrapper;

        module.exports = DefaultLineWrapper = /*#__PURE__*/ function(_require) {
            _inherits(DefaultLineWrapper, _require);

            var _super = _createSuper(DefaultLineWrapper);

            function DefaultLineWrapper() {
                _classCallCheck(this, DefaultLineWrapper);

                return _super.apply(this, arguments);
            }

            _createClass(DefaultLineWrapper, [{
                key: "_render",
                value: function _render() {}
            }]);

            return DefaultLineWrapper;
        }(require('./_LineWrapper'));
    }, { "./_LineWrapper": 200 }],
    200: [function(require, module, exports) {
        "use strict";

        function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

        function _defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

        // Generated by CoffeeScript 2.5.1
        var _LineWrapper;

        module.exports = _LineWrapper = /*#__PURE__*/ function() {
            function _LineWrapper() {
                _classCallCheck(this, _LineWrapper);
            }

            _createClass(_LineWrapper, [{
                key: "render",
                value: function render(str, options) {
                    return this._render(str, options);
                }
            }]);

            return _LineWrapper;
        }();
    }, {}],
    201: [function(require, module, exports) {
        "use strict";

        function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

        function _defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

        // Generated by CoffeeScript 2.5.1
        var MixedDeclarationSet, StyleSheet, Styles, terminalWidth;
        StyleSheet = require('./styles/StyleSheet');
        MixedDeclarationSet = require('./styles/rule/MixedDeclarationSet');
        terminalWidth = require('../tools').getCols();

        module.exports = Styles = function() {
            var self;

            var Styles = /*#__PURE__*/ function() {
                function Styles() {
                    _classCallCheck(this, Styles);

                    this._defaultStyles = new StyleSheet();
                    this._userStyles = new StyleSheet();

                    this._setDefaultStyles();
                }

                _createClass(Styles, [{
                    key: "_setDefaultStyles",
                    value: function _setDefaultStyles() {
                        this._defaultStyles.setRule(self.defaultRules);
                    }
                }, {
                    key: "setRule",
                    value: function setRule(selector, rules) {
                        this._userStyles.setRule.apply(this._userStyles, arguments);

                        return this;
                    }
                }, {
                    key: "getStyleFor",
                    value: function getStyleFor(el) {
                        var styles;
                        styles = el.styles;

                        if (styles == null) {
                            el.styles = styles = this._getComputedStyleFor(el);
                        }

                        return styles;
                    }
                }, {
                    key: "_getRawStyleFor",
                    value: function _getRawStyleFor(el) {
                        var def, user;
                        def = this._defaultStyles.getRulesFor(el);
                        user = this._userStyles.getRulesFor(el);
                        return MixedDeclarationSet.mix(def, user).toObject();
                    }
                }, {
                    key: "_getComputedStyleFor",
                    value: function _getComputedStyleFor(el) {
                        var decs, parent, prop, ref, val;
                        decs = {};
                        parent = el.parent;
                        ref = this._getRawStyleFor(el);

                        for (prop in ref) {
                            val = ref[prop];

                            if (val !== 'inherit') {
                                decs[prop] = val;
                            } else {
                                throw Error("Inherited styles are not supported yet.");
                            }
                        }

                        return decs;
                    }
                }]);

                return Styles;
            }();

            ;
            self = Styles;
            Styles.defaultRules = {
                '*': {
                    display: 'inline'
                },
                'body': {
                    background: 'none',
                    color: 'white',
                    display: 'block',
                    width: terminalWidth + ' !important'
                }
            };
            return Styles;
        }.call(void 0);
    }, { "../tools": 229, "./styles/StyleSheet": 206, "./styles/rule/MixedDeclarationSet": 208 }],
    202: [function(require, module, exports) {
        "use strict";

        // Generated by CoffeeScript 2.5.1
        var AnsiPainter, _common;

        AnsiPainter = require('../../AnsiPainter');
        module.exports = _common = {
            getStyleTagsFor: function getStyleTagsFor(style) {
                var i, len, ret, tag, tagName, tagsToAdd;
                tagsToAdd = [];

                if (style.color != null) {
                    tagName = 'color-' + style.color;

                    if (AnsiPainter.tags[tagName] == null) {
                        throw Error("Unknown color `".concat(style.color, "`"));
                    }

                    tagsToAdd.push(tagName);
                }

                if (style.background != null) {
                    tagName = 'bg-' + style.background;

                    if (AnsiPainter.tags[tagName] == null) {
                        throw Error("Unknown background `".concat(style.background, "`"));
                    }

                    tagsToAdd.push(tagName);
                }

                ret = {
                    before: '',
                    after: ''
                };

                for (i = 0, len = tagsToAdd.length; i < len; i++) {
                    tag = tagsToAdd[i];
                    ret.before = "<".concat(tag, ">") + ret.before;
                    ret.after = ret.after + "</".concat(tag, ">");
                }

                return ret;
            }
        };
    }, { "../../AnsiPainter": 184 }],
    203: [function(require, module, exports) {
        "use strict";

        // Generated by CoffeeScript 2.5.1
        var _common, blockStyleApplier, merge, self;

        _common = require('./_common');
        merge = require('lodash/merge');
        module.exports = blockStyleApplier = self = {
            applyTo: function applyTo(el, style) {
                var config, ret;
                ret = _common.getStyleTagsFor(style);
                ret.blockConfig = config = {};

                this._margins(style, config);

                this._bullet(style, config);

                this._dims(style, config);

                return ret;
            },
            _margins: function _margins(style, config) {
                if (style.marginLeft != null) {
                    merge(config, {
                        linePrependor: {
                            options: {
                                amount: parseInt(style.marginLeft)
                            }
                        }
                    });
                }

                if (style.marginRight != null) {
                    merge(config, {
                        lineAppendor: {
                            options: {
                                amount: parseInt(style.marginRight)
                            }
                        }
                    });
                }

                if (style.marginTop != null) {
                    merge(config, {
                        blockPrependor: {
                            options: {
                                amount: parseInt(style.marginTop)
                            }
                        }
                    });
                }

                if (style.marginBottom != null) {
                    merge(config, {
                        blockAppendor: {
                            options: {
                                amount: parseInt(style.marginBottom)
                            }
                        }
                    });
                }
            },
            _bullet: function _bullet(style, config) {
                var after, before, bullet, conf;

                if (style.bullet != null && style.bullet.enabled) {
                    bullet = style.bullet;
                    conf = {};
                    conf.alignment = style.bullet.alignment;

                    var _common$getStyleTagsF = _common.getStyleTagsFor({
                        color: bullet.color,
                        background: bullet.background
                    });

                    before = _common$getStyleTagsF.before;
                    after = _common$getStyleTagsF.after;
                    conf.char = before + bullet.char + after;
                    merge(config, {
                        linePrependor: {
                            options: {
                                bullet: conf
                            }
                        }
                    });
                }
            },
            _dims: function _dims(style, config) {
                var w;

                if (style.width != null) {
                    w = parseInt(style.width);
                    config.width = w;
                }
            }
        };
    }, { "./_common": 202, "lodash/merge": 173 }],
    204: [function(require, module, exports) {
        "use strict";

        // Generated by CoffeeScript 2.5.1
        var _common, inlineStyleApplier, self, tools;

        tools = require('../../tools');
        _common = require('./_common');
        module.exports = inlineStyleApplier = self = {
            applyTo: function applyTo(el, style) {
                var ret;
                ret = _common.getStyleTagsFor(style);

                if (style.marginLeft != null) {
                    ret.before = tools.repeatString("&sp;", parseInt(style.marginLeft)) + ret.before;
                }

                if (style.marginRight != null) {
                    ret.after += tools.repeatString("&sp;", parseInt(style.marginRight));
                }

                if (style.paddingLeft != null) {
                    ret.before += tools.repeatString("&sp;", parseInt(style.paddingLeft));
                }

                if (style.paddingRight != null) {
                    ret.after = tools.repeatString("&sp;", parseInt(style.paddingRight)) + ret.after;
                }

                return ret;
            }
        };
    }, { "../../tools": 229, "./_common": 202 }],
    205: [function(require, module, exports) {
        "use strict";

        function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

        function _defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

        // Generated by CoffeeScript 2.5.1
        var DeclarationBlock, Rule, Selector;
        Selector = require('./rule/Selector');
        DeclarationBlock = require('./rule/DeclarationBlock');

        module.exports = Rule = /*#__PURE__*/ function() {
            function Rule(selector) {
                _classCallCheck(this, Rule);

                this.selector = new Selector(selector);
                this.styles = new DeclarationBlock();
            }

            _createClass(Rule, [{
                key: "setStyles",
                value: function setStyles(styles) {
                    this.styles.set(styles);
                    return this;
                }
            }]);

            return Rule;
        }();
    }, { "./rule/DeclarationBlock": 207, "./rule/Selector": 209 }],
    206: [function(require, module, exports) {
        "use strict";

        function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

        function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

        function _defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

        // Generated by CoffeeScript 2.5.1
        var Rule, StyleSheet;
        Rule = require('./Rule');

        module.exports = StyleSheet = function() {
            var self;

            var StyleSheet = /*#__PURE__*/ function() {
                function StyleSheet() {
                    _classCallCheck(this, StyleSheet);

                    this._rulesBySelector = {};
                }

                _createClass(StyleSheet, [{
                    key: "setRule",
                    value: function setRule(selector, styles) {
                        var key, val;

                        if (typeof selector === 'string') {
                            this._setRule(selector, styles);
                        } else if (_typeof(selector) === 'object') {
                            for (key in selector) {
                                val = selector[key];

                                this._setRule(key, val);
                            }
                        }

                        return this;
                    }
                }, {
                    key: "_setRule",
                    value: function _setRule(s, styles) {
                        var i, len, ref, selector;
                        ref = self.splitSelectors(s);

                        for (i = 0, len = ref.length; i < len; i++) {
                            selector = ref[i];

                            this._setSingleRule(selector, styles);
                        }

                        return this;
                    }
                }, {
                    key: "_setSingleRule",
                    value: function _setSingleRule(s, styles) {
                        var rule, selector;
                        selector = self.normalizeSelector(s);

                        if (!(rule = this._rulesBySelector[selector])) {
                            rule = new Rule(selector);
                            this._rulesBySelector[selector] = rule;
                        }

                        rule.setStyles(styles);
                        return this;
                    }
                }, {
                    key: "getRulesFor",
                    value: function getRulesFor(el) {
                        var ref, rule, rules, selector;
                        rules = [];
                        ref = this._rulesBySelector;

                        for (selector in ref) {
                            rule = ref[selector];

                            if (rule.selector.matches(el)) {
                                rules.push(rule);
                            }
                        }

                        return rules;
                    }
                }], [{
                    key: "normalizeSelector",
                    value: function normalizeSelector(selector) {
                        return selector.replace(/[\s]+/g, ' ').replace(/[\s]*([>\,\+]{1})[\s]*/g, '$1').trim();
                    }
                }, {
                    key: "splitSelectors",
                    value: function splitSelectors(s) {
                        return s.trim().split(',');
                    }
                }]);

                return StyleSheet;
            }();

            ;
            self = StyleSheet;
            return StyleSheet;
        }.call(void 0);
    }, { "./Rule": 205 }],
    207: [function(require, module, exports) {
        "use strict";

        function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

        function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

        function _defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

        // Generated by CoffeeScript 2.5.1
        var Arbitrary, DeclarationBlock, declarationClasses;

        module.exports = DeclarationBlock = function() {
            var self;

            var DeclarationBlock = /*#__PURE__*/ function() {
                function DeclarationBlock() {
                    _classCallCheck(this, DeclarationBlock);

                    this._declarations = {};
                }

                _createClass(DeclarationBlock, [{
                    key: "set",
                    value: function set(prop, value) {
                        var key, val;

                        if (_typeof(prop) === 'object') {
                            for (key in prop) {
                                val = prop[key];
                                this.set(key, val);
                            }

                            return this;
                        }

                        prop = self.sanitizeProp(prop);

                        this._getDeclarationClass(prop).setOnto(this._declarations, prop, value);

                        return this;
                    }
                }, {
                    key: "_getDeclarationClass",
                    value: function _getDeclarationClass(prop) {
                        var cls;

                        if (prop[0] === '_') {
                            return Arbitrary;
                        }

                        if (!(cls = declarationClasses[prop])) {
                            throw Error("Unknown property `".concat(prop, "`. Write it as `_").concat(prop, "` if you're defining a custom property"));
                        }

                        return cls;
                    }
                }], [{
                    key: "sanitizeProp",
                    value: function sanitizeProp(prop) {
                        return String(prop).trim();
                    }
                }]);

                return DeclarationBlock;
            }();

            ;
            self = DeclarationBlock;
            return DeclarationBlock;
        }.call(void 0);

        Arbitrary = require('./declarationBlock/Arbitrary');
        declarationClasses = {
            color: require('./declarationBlock/Color'),
            background: require('./declarationBlock/Background'),
            width: require('./declarationBlock/Width'),
            height: require('./declarationBlock/Height'),
            bullet: require('./declarationBlock/Bullet'),
            display: require('./declarationBlock/Display'),
            margin: require('./declarationBlock/Margin'),
            marginTop: require('./declarationBlock/MarginTop'),
            marginLeft: require('./declarationBlock/MarginLeft'),
            marginRight: require('./declarationBlock/MarginRight'),
            marginBottom: require('./declarationBlock/MarginBottom'),
            padding: require('./declarationBlock/Padding'),
            paddingTop: require('./declarationBlock/PaddingTop'),
            paddingLeft: require('./declarationBlock/PaddingLeft'),
            paddingRight: require('./declarationBlock/PaddingRight'),
            paddingBottom: require('./declarationBlock/PaddingBottom')
        };
    }, { "./declarationBlock/Arbitrary": 210, "./declarationBlock/Background": 211, "./declarationBlock/Bullet": 212, "./declarationBlock/Color": 213, "./declarationBlock/Display": 214, "./declarationBlock/Height": 215, "./declarationBlock/Margin": 216, "./declarationBlock/MarginBottom": 217, "./declarationBlock/MarginLeft": 218, "./declarationBlock/MarginRight": 219, "./declarationBlock/MarginTop": 220, "./declarationBlock/Padding": 221, "./declarationBlock/PaddingBottom": 222, "./declarationBlock/PaddingLeft": 223, "./declarationBlock/PaddingRight": 224, "./declarationBlock/PaddingTop": 225, "./declarationBlock/Width": 226 }],
    208: [function(require, module, exports) {
        "use strict";

        function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

        function _defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

        // Generated by CoffeeScript 2.5.1
        var MixedDeclarationSet;

        module.exports = MixedDeclarationSet = function() {
            var self;

            var MixedDeclarationSet = /*#__PURE__*/ function() {
                function MixedDeclarationSet() {
                    _classCallCheck(this, MixedDeclarationSet);

                    this._declarations = {};
                }

                _createClass(MixedDeclarationSet, [{
                    key: "mixWithList",
                    value: function mixWithList(rules) {
                        var i, len, rule;
                        rules.sort(function(a, b) {
                            return a.selector.priority > b.selector.priority;
                        });

                        for (i = 0, len = rules.length; i < len; i++) {
                            rule = rules[i];

                            this._mixWithRule(rule);
                        }

                        return this;
                    }
                }, {
                    key: "_mixWithRule",
                    value: function _mixWithRule(rule) {
                        var dec, prop, ref;
                        ref = rule.styles._declarations;

                        for (prop in ref) {
                            dec = ref[prop];

                            this._mixWithDeclaration(dec);
                        }
                    }
                }, {
                    key: "_mixWithDeclaration",
                    value: function _mixWithDeclaration(dec) {
                        var cur;
                        cur = this._declarations[dec.prop];

                        if (cur != null && cur.important && !dec.important) {
                            return;
                        }

                        this._declarations[dec.prop] = dec;
                    }
                }, {
                    key: "get",
                    value: function get(prop) {
                        if (prop == null) {
                            return this._declarations;
                        }

                        if (this._declarations[prop] == null) {
                            return null;
                        }

                        return this._declarations[prop].val;
                    }
                }, {
                    key: "toObject",
                    value: function toObject() {
                        var dec, obj, prop, ref;
                        obj = {};
                        ref = this._declarations;

                        for (prop in ref) {
                            dec = ref[prop];
                            obj[prop] = dec.val;
                        }

                        return obj;
                    }
                }], [{
                    key: "mix",
                    value: function mix() {
                        var i, len, mixed, rules;
                        mixed = new self();

                        for (var _len = arguments.length, ruleSets = new Array(_len), _key = 0; _key < _len; _key++) {
                            ruleSets[_key] = arguments[_key];
                        }

                        for (i = 0, len = ruleSets.length; i < len; i++) {
                            rules = ruleSets[i];
                            mixed.mixWithList(rules);
                        }

                        return mixed;
                    }
                }]);

                return MixedDeclarationSet;
            }();

            ;
            self = MixedDeclarationSet;
            return MixedDeclarationSet;
        }.call(void 0);
    }, {}],
    209: [function(require, module, exports) {
        "use strict";

        function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

        function _defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

        // Generated by CoffeeScript 2.5.1
        var CSSSelect, Selector;
        CSSSelect = require('css-select');

        module.exports = Selector = function() {
            var self;

            var Selector = /*#__PURE__*/ function() {
                function Selector(text1) {
                    _classCallCheck(this, Selector);

                    this.text = text1;
                    this._fn = CSSSelect.compile(this.text);
                    this.priority = self.calculatePriority(this.text);
                }

                _createClass(Selector, [{
                    key: "matches",
                    value: function matches(elem) {
                            return CSSSelect.is(elem, this._fn);
                        } // This stupid piece of code is supposed to calculate
                        // selector priority, somehow according to
                        // http://www.w3.org/wiki/CSS/Training/Priority_level_of_selector

                }], [{
                    key: "calculatePriority",
                    value: function calculatePriority(text) {
                        var n, priotrity;
                        priotrity = 0;

                        if (n = text.match(/[\#]{1}/g)) {
                            priotrity += 100 * n.length;
                        }

                        if (n = text.match(/[a-zA-Z]+/g)) {
                            priotrity += 2 * n.length;
                        }

                        if (n = text.match(/\*/g)) {
                            priotrity += 1 * n.length;
                        }

                        return priotrity;
                    }
                }]);

                return Selector;
            }();

            ;
            self = Selector;
            return Selector;
        }.call(void 0);
    }, { "css-select": 9 }],
    210: [function(require, module, exports) {
        "use strict";

        function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

        function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

        function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); }
            subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });
            if (superClass) _setPrototypeOf(subClass, superClass);
        }

        function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

        function _createSuper(Derived) {
            var hasNativeReflectConstruct = _isNativeReflectConstruct();
            return function _createSuperInternal() {
                var Super = _getPrototypeOf(Derived),
                    result;
                if (hasNativeReflectConstruct) {
                    var NewTarget = _getPrototypeOf(this).constructor;
                    result = Reflect.construct(Super, arguments, NewTarget);
                } else { result = Super.apply(this, arguments); }
                return _possibleConstructorReturn(this, result);
            };
        }

        function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

        function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

        function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})); return true; } catch (e) { return false; } }

        function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

        // Generated by CoffeeScript 2.5.1
        var Arbitrary, _Declaration;

        _Declaration = require('./_Declaration');

        module.exports = Arbitrary = /*#__PURE__*/ function(_Declaration2) {
            _inherits(Arbitrary, _Declaration2);

            var _super = _createSuper(Arbitrary);

            function Arbitrary() {
                _classCallCheck(this, Arbitrary);

                return _super.apply(this, arguments);
            }

            return Arbitrary;
        }(_Declaration);
    }, { "./_Declaration": 227 }],
    211: [function(require, module, exports) {
        "use strict";

        function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

        function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

        function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); }
            subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });
            if (superClass) _setPrototypeOf(subClass, superClass);
        }

        function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

        function _createSuper(Derived) {
            var hasNativeReflectConstruct = _isNativeReflectConstruct();
            return function _createSuperInternal() {
                var Super = _getPrototypeOf(Derived),
                    result;
                if (hasNativeReflectConstruct) {
                    var NewTarget = _getPrototypeOf(this).constructor;
                    result = Reflect.construct(Super, arguments, NewTarget);
                } else { result = Super.apply(this, arguments); }
                return _possibleConstructorReturn(this, result);
            };
        }

        function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

        function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

        function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})); return true; } catch (e) { return false; } }

        function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

        // Generated by CoffeeScript 2.5.1
        var Background, _Declaration;

        _Declaration = require('./_Declaration');

        module.exports = Background = /*#__PURE__*/ function(_Declaration2) {
            _inherits(Background, _Declaration2);

            var _super = _createSuper(Background);

            function Background() {
                _classCallCheck(this, Background);

                return _super.apply(this, arguments);
            }

            return Background;
        }(_Declaration);
    }, { "./_Declaration": 227 }],
    212: [function(require, module, exports) {
        "use strict";

        function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

        function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

        function _defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

        function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); }
            subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });
            if (superClass) _setPrototypeOf(subClass, superClass);
        }

        function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

        function _createSuper(Derived) {
            var hasNativeReflectConstruct = _isNativeReflectConstruct();
            return function _createSuperInternal() {
                var Super = _getPrototypeOf(Derived),
                    result;
                if (hasNativeReflectConstruct) {
                    var NewTarget = _getPrototypeOf(this).constructor;
                    result = Reflect.construct(Super, arguments, NewTarget);
                } else { result = Super.apply(this, arguments); }
                return _possibleConstructorReturn(this, result);
            };
        }

        function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

        function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

        function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})); return true; } catch (e) { return false; } }

        function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

        // Generated by CoffeeScript 2.5.1
        var Bullet, _Declaration;

        _Declaration = require('./_Declaration');

        module.exports = Bullet = function() {
            var self;

            var Bullet = /*#__PURE__*/ function(_Declaration2) {
                _inherits(Bullet, _Declaration2);

                var _super = _createSuper(Bullet);

                function Bullet() {
                    _classCallCheck(this, Bullet);

                    return _super.apply(this, arguments);
                }

                _createClass(Bullet, [{
                    key: "_set",
                    value: function _set(val) {
                        var alignment, bg, char, color, enabled, m, original;
                        val = String(val);
                        original = val;
                        char = null;
                        enabled = false;
                        color = 'none';
                        bg = 'none';

                        if (m = val.match(/\"([^"]+)\"/) || (m = val.match(/\'([^']+)\'/))) {
                            char = m[1];
                            val = val.replace(m[0], '');
                            enabled = true;
                        }

                        if (m = val.match(/(none|left|right|center)/)) {
                            alignment = m[1];
                            val = val.replace(m[0], '');
                        } else {
                            alignment = 'left';
                        }

                        if (alignment === 'none') {
                            enabled = false;
                        }

                        if (m = val.match(/color\:([\w\-]+)/)) {
                            color = m[1];
                            val = val.replace(m[0], '');
                        }

                        if (m = val.match(/bg\:([\w\-]+)/)) {
                            bg = m[1];
                            val = val.replace(m[0], '');
                        }

                        if (val.trim() !== '') {
                            throw Error("Unrecognizable value `".concat(original, "` for `").concat(this.prop, "`"));
                        }

                        return this.val = {
                            enabled: enabled,
                            char: char,
                            alignment: alignment,
                            background: bg,
                            color: color
                        };
                    }
                }]);

                return Bullet;
            }(_Declaration);

            ;
            self = Bullet;
            return Bullet;
        }.call(void 0);
    }, { "./_Declaration": 227 }],
    213: [function(require, module, exports) {
        "use strict";

        function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

        function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

        function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); }
            subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });
            if (superClass) _setPrototypeOf(subClass, superClass);
        }

        function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

        function _createSuper(Derived) {
            var hasNativeReflectConstruct = _isNativeReflectConstruct();
            return function _createSuperInternal() {
                var Super = _getPrototypeOf(Derived),
                    result;
                if (hasNativeReflectConstruct) {
                    var NewTarget = _getPrototypeOf(this).constructor;
                    result = Reflect.construct(Super, arguments, NewTarget);
                } else { result = Super.apply(this, arguments); }
                return _possibleConstructorReturn(this, result);
            };
        }

        function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

        function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

        function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})); return true; } catch (e) { return false; } }

        function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

        // Generated by CoffeeScript 2.5.1
        var Color, _Declaration;

        _Declaration = require('./_Declaration');

        module.exports = Color = /*#__PURE__*/ function(_Declaration2) {
            _inherits(Color, _Declaration2);

            var _super = _createSuper(Color);

            function Color() {
                _classCallCheck(this, Color);

                return _super.apply(this, arguments);
            }

            return Color;
        }(_Declaration);
    }, { "./_Declaration": 227 }],
    214: [function(require, module, exports) {
        "use strict";

        function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

        function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

        function _defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

        function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); }
            subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });
            if (superClass) _setPrototypeOf(subClass, superClass);
        }

        function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

        function _createSuper(Derived) {
            var hasNativeReflectConstruct = _isNativeReflectConstruct();
            return function _createSuperInternal() {
                var Super = _getPrototypeOf(Derived),
                    result;
                if (hasNativeReflectConstruct) {
                    var NewTarget = _getPrototypeOf(this).constructor;
                    result = Reflect.construct(Super, arguments, NewTarget);
                } else { result = Super.apply(this, arguments); }
                return _possibleConstructorReturn(this, result);
            };
        }

        function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

        function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

        function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})); return true; } catch (e) { return false; } }

        function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

        // Generated by CoffeeScript 2.5.1
        var Display,
            _Declaration,
            indexOf = [].indexOf;

        _Declaration = require('./_Declaration');

        module.exports = Display = function() {
            var self;

            var Display = /*#__PURE__*/ function(_Declaration2) {
                _inherits(Display, _Declaration2);

                var _super = _createSuper(Display);

                function Display() {
                    _classCallCheck(this, Display);

                    return _super.apply(this, arguments);
                }

                _createClass(Display, [{
                    key: "_set",
                    value: function _set(val) {
                        val = String(val).toLowerCase();

                        if (indexOf.call(self._allowed, val) < 0) {
                            throw Error("Unrecognizable value `".concat(val, "` for `").concat(this.prop, "`"));
                        }

                        return this.val = val;
                    }
                }]);

                return Display;
            }(_Declaration);

            ;
            self = Display;
            Display._allowed = ['inline', 'block', 'none'];
            return Display;
        }.call(void 0);
    }, { "./_Declaration": 227 }],
    215: [function(require, module, exports) {
        "use strict";

        function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

        function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

        function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); }
            subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });
            if (superClass) _setPrototypeOf(subClass, superClass);
        }

        function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

        function _createSuper(Derived) {
            var hasNativeReflectConstruct = _isNativeReflectConstruct();
            return function _createSuperInternal() {
                var Super = _getPrototypeOf(Derived),
                    result;
                if (hasNativeReflectConstruct) {
                    var NewTarget = _getPrototypeOf(this).constructor;
                    result = Reflect.construct(Super, arguments, NewTarget);
                } else { result = Super.apply(this, arguments); }
                return _possibleConstructorReturn(this, result);
            };
        }

        function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

        function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

        function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})); return true; } catch (e) { return false; } }

        function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

        // Generated by CoffeeScript 2.5.1
        var Height, _Length;

        _Length = require('./_Length');

        module.exports = Height = /*#__PURE__*/ function(_Length2) {
            _inherits(Height, _Length2);

            var _super = _createSuper(Height);

            function Height() {
                _classCallCheck(this, Height);

                return _super.apply(this, arguments);
            }

            return Height;
        }(_Length);
    }, { "./_Length": 228 }],
    216: [function(require, module, exports) {
        "use strict";

        function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

        function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

        function _defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

        function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); }
            subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });
            if (superClass) _setPrototypeOf(subClass, superClass);
        }

        function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

        function _createSuper(Derived) {
            var hasNativeReflectConstruct = _isNativeReflectConstruct();
            return function _createSuperInternal() {
                var Super = _getPrototypeOf(Derived),
                    result;
                if (hasNativeReflectConstruct) {
                    var NewTarget = _getPrototypeOf(this).constructor;
                    result = Reflect.construct(Super, arguments, NewTarget);
                } else { result = Super.apply(this, arguments); }
                return _possibleConstructorReturn(this, result);
            };
        }

        function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

        function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

        function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})); return true; } catch (e) { return false; } }

        function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

        // Generated by CoffeeScript 2.5.1
        var Margin, MarginBottom, MarginLeft, MarginRight, MarginTop, _Declaration;

        _Declaration = require('./_Declaration');
        MarginTop = require('./MarginTop');
        MarginLeft = require('./MarginLeft');
        MarginRight = require('./MarginRight');
        MarginBottom = require('./MarginBottom');

        module.exports = Margin = function() {
            var self;

            var Margin = /*#__PURE__*/ function(_Declaration2) {
                _inherits(Margin, _Declaration2);

                var _super = _createSuper(Margin);

                function Margin() {
                    _classCallCheck(this, Margin);

                    return _super.apply(this, arguments);
                }

                _createClass(Margin, null, [{
                    key: "setOnto",
                    value: function setOnto(declarations, prop, originalValue) {
                        var append, val, vals;
                        append = '';
                        val = _Declaration.sanitizeValue(originalValue);

                        if (_Declaration.importantClauseRx.test(String(val))) {
                            append = ' !important';
                            val = val.replace(_Declaration.importantClauseRx, '');
                        }

                        val = val.trim();

                        if (val.length === 0) {
                            return self._setAllDirections(declarations, append, append, append, append);
                        }

                        vals = val.split(" ").map(function(val) {
                            return val + append;
                        });

                        if (vals.length === 1) {
                            return self._setAllDirections(declarations, vals[0], vals[0], vals[0], vals[0]);
                        } else if (vals.length === 2) {
                            return self._setAllDirections(declarations, vals[0], vals[1], vals[0], vals[1]);
                        } else if (vals.length === 3) {
                            return self._setAllDirections(declarations, vals[0], vals[1], vals[2], vals[1]);
                        } else if (vals.length === 4) {
                            return self._setAllDirections(declarations, vals[0], vals[1], vals[2], vals[3]);
                        } else {
                            throw Error("Can't understand value for margin: `".concat(originalValue, "`"));
                        }
                    }
                }, {
                    key: "_setAllDirections",
                    value: function _setAllDirections(declarations, top, right, bottom, left) {
                        MarginTop.setOnto(declarations, 'marginTop', top);
                        MarginTop.setOnto(declarations, 'marginRight', right);
                        MarginTop.setOnto(declarations, 'marginBottom', bottom);
                        MarginTop.setOnto(declarations, 'marginLeft', left);
                    }
                }]);

                return Margin;
            }(_Declaration);

            ;
            self = Margin;
            return Margin;
        }.call(void 0);
    }, { "./MarginBottom": 217, "./MarginLeft": 218, "./MarginRight": 219, "./MarginTop": 220, "./_Declaration": 227 }],
    217: [function(require, module, exports) {
        "use strict";

        function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

        function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

        function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); }
            subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });
            if (superClass) _setPrototypeOf(subClass, superClass);
        }

        function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

        function _createSuper(Derived) {
            var hasNativeReflectConstruct = _isNativeReflectConstruct();
            return function _createSuperInternal() {
                var Super = _getPrototypeOf(Derived),
                    result;
                if (hasNativeReflectConstruct) {
                    var NewTarget = _getPrototypeOf(this).constructor;
                    result = Reflect.construct(Super, arguments, NewTarget);
                } else { result = Super.apply(this, arguments); }
                return _possibleConstructorReturn(this, result);
            };
        }

        function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

        function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

        function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})); return true; } catch (e) { return false; } }

        function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

        // Generated by CoffeeScript 2.5.1
        var MarginBottom, _Length;

        _Length = require('./_Length');

        module.exports = MarginBottom = /*#__PURE__*/ function(_Length2) {
            _inherits(MarginBottom, _Length2);

            var _super = _createSuper(MarginBottom);

            function MarginBottom() {
                _classCallCheck(this, MarginBottom);

                return _super.apply(this, arguments);
            }

            return MarginBottom;
        }(_Length);
    }, { "./_Length": 228 }],
    218: [function(require, module, exports) {
        "use strict";

        function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

        function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

        function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); }
            subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });
            if (superClass) _setPrototypeOf(subClass, superClass);
        }

        function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

        function _createSuper(Derived) {
            var hasNativeReflectConstruct = _isNativeReflectConstruct();
            return function _createSuperInternal() {
                var Super = _getPrototypeOf(Derived),
                    result;
                if (hasNativeReflectConstruct) {
                    var NewTarget = _getPrototypeOf(this).constructor;
                    result = Reflect.construct(Super, arguments, NewTarget);
                } else { result = Super.apply(this, arguments); }
                return _possibleConstructorReturn(this, result);
            };
        }

        function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

        function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

        function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})); return true; } catch (e) { return false; } }

        function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

        // Generated by CoffeeScript 2.5.1
        var MarginLeft, _Length;

        _Length = require('./_Length');

        module.exports = MarginLeft = /*#__PURE__*/ function(_Length2) {
            _inherits(MarginLeft, _Length2);

            var _super = _createSuper(MarginLeft);

            function MarginLeft() {
                _classCallCheck(this, MarginLeft);

                return _super.apply(this, arguments);
            }

            return MarginLeft;
        }(_Length);
    }, { "./_Length": 228 }],
    219: [function(require, module, exports) {
        "use strict";

        function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

        function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

        function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); }
            subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });
            if (superClass) _setPrototypeOf(subClass, superClass);
        }

        function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

        function _createSuper(Derived) {
            var hasNativeReflectConstruct = _isNativeReflectConstruct();
            return function _createSuperInternal() {
                var Super = _getPrototypeOf(Derived),
                    result;
                if (hasNativeReflectConstruct) {
                    var NewTarget = _getPrototypeOf(this).constructor;
                    result = Reflect.construct(Super, arguments, NewTarget);
                } else { result = Super.apply(this, arguments); }
                return _possibleConstructorReturn(this, result);
            };
        }

        function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

        function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

        function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})); return true; } catch (e) { return false; } }

        function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

        // Generated by CoffeeScript 2.5.1
        var MarginRight, _Length;

        _Length = require('./_Length');

        module.exports = MarginRight = /*#__PURE__*/ function(_Length2) {
            _inherits(MarginRight, _Length2);

            var _super = _createSuper(MarginRight);

            function MarginRight() {
                _classCallCheck(this, MarginRight);

                return _super.apply(this, arguments);
            }

            return MarginRight;
        }(_Length);
    }, { "./_Length": 228 }],
    220: [function(require, module, exports) {
        "use strict";

        function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

        function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

        function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); }
            subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });
            if (superClass) _setPrototypeOf(subClass, superClass);
        }

        function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

        function _createSuper(Derived) {
            var hasNativeReflectConstruct = _isNativeReflectConstruct();
            return function _createSuperInternal() {
                var Super = _getPrototypeOf(Derived),
                    result;
                if (hasNativeReflectConstruct) {
                    var NewTarget = _getPrototypeOf(this).constructor;
                    result = Reflect.construct(Super, arguments, NewTarget);
                } else { result = Super.apply(this, arguments); }
                return _possibleConstructorReturn(this, result);
            };
        }

        function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

        function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

        function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})); return true; } catch (e) { return false; } }

        function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

        // Generated by CoffeeScript 2.5.1
        var MarginTop, _Length;

        _Length = require('./_Length');

        module.exports = MarginTop = /*#__PURE__*/ function(_Length2) {
            _inherits(MarginTop, _Length2);

            var _super = _createSuper(MarginTop);

            function MarginTop() {
                _classCallCheck(this, MarginTop);

                return _super.apply(this, arguments);
            }

            return MarginTop;
        }(_Length);
    }, { "./_Length": 228 }],
    221: [function(require, module, exports) {
        "use strict";

        function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

        function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

        function _defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

        function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); }
            subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });
            if (superClass) _setPrototypeOf(subClass, superClass);
        }

        function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

        function _createSuper(Derived) {
            var hasNativeReflectConstruct = _isNativeReflectConstruct();
            return function _createSuperInternal() {
                var Super = _getPrototypeOf(Derived),
                    result;
                if (hasNativeReflectConstruct) {
                    var NewTarget = _getPrototypeOf(this).constructor;
                    result = Reflect.construct(Super, arguments, NewTarget);
                } else { result = Super.apply(this, arguments); }
                return _possibleConstructorReturn(this, result);
            };
        }

        function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

        function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

        function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})); return true; } catch (e) { return false; } }

        function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

        // Generated by CoffeeScript 2.5.1
        var Padding, PaddingBottom, PaddingLeft, PaddingRight, PaddingTop, _Declaration;

        _Declaration = require('./_Declaration');
        PaddingTop = require('./PaddingTop');
        PaddingLeft = require('./PaddingLeft');
        PaddingRight = require('./PaddingRight');
        PaddingBottom = require('./PaddingBottom');

        module.exports = Padding = function() {
            var self;

            var Padding = /*#__PURE__*/ function(_Declaration2) {
                _inherits(Padding, _Declaration2);

                var _super = _createSuper(Padding);

                function Padding() {
                    _classCallCheck(this, Padding);

                    return _super.apply(this, arguments);
                }

                _createClass(Padding, null, [{
                    key: "setOnto",
                    value: function setOnto(declarations, prop, originalValue) {
                        var append, val, vals;
                        append = '';
                        val = _Declaration.sanitizeValue(originalValue);

                        if (_Declaration.importantClauseRx.test(String(val))) {
                            append = ' !important';
                            val = val.replace(_Declaration.importantClauseRx, '');
                        }

                        val = val.trim();

                        if (val.length === 0) {
                            return self._setAllDirections(declarations, append, append, append, append);
                        }

                        vals = val.split(" ").map(function(val) {
                            return val + append;
                        });

                        if (vals.length === 1) {
                            return self._setAllDirections(declarations, vals[0], vals[0], vals[0], vals[0]);
                        } else if (vals.length === 2) {
                            return self._setAllDirections(declarations, vals[0], vals[1], vals[0], vals[1]);
                        } else if (vals.length === 3) {
                            return self._setAllDirections(declarations, vals[0], vals[1], vals[2], vals[1]);
                        } else if (vals.length === 4) {
                            return self._setAllDirections(declarations, vals[0], vals[1], vals[2], vals[3]);
                        } else {
                            throw Error("Can't understand value for padding: `".concat(originalValue, "`"));
                        }
                    }
                }, {
                    key: "_setAllDirections",
                    value: function _setAllDirections(declarations, top, right, bottom, left) {
                        PaddingTop.setOnto(declarations, 'paddingTop', top);
                        PaddingTop.setOnto(declarations, 'paddingRight', right);
                        PaddingTop.setOnto(declarations, 'paddingBottom', bottom);
                        PaddingTop.setOnto(declarations, 'paddingLeft', left);
                    }
                }]);

                return Padding;
            }(_Declaration);

            ;
            self = Padding;
            return Padding;
        }.call(void 0);
    }, { "./PaddingBottom": 222, "./PaddingLeft": 223, "./PaddingRight": 224, "./PaddingTop": 225, "./_Declaration": 227 }],
    222: [function(require, module, exports) {
        "use strict";

        function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

        function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

        function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); }
            subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });
            if (superClass) _setPrototypeOf(subClass, superClass);
        }

        function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

        function _createSuper(Derived) {
            var hasNativeReflectConstruct = _isNativeReflectConstruct();
            return function _createSuperInternal() {
                var Super = _getPrototypeOf(Derived),
                    result;
                if (hasNativeReflectConstruct) {
                    var NewTarget = _getPrototypeOf(this).constructor;
                    result = Reflect.construct(Super, arguments, NewTarget);
                } else { result = Super.apply(this, arguments); }
                return _possibleConstructorReturn(this, result);
            };
        }

        function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

        function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

        function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})); return true; } catch (e) { return false; } }

        function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

        // Generated by CoffeeScript 2.5.1
        var PaddingBottom, _Length;

        _Length = require('./_Length');

        module.exports = PaddingBottom = /*#__PURE__*/ function(_Length2) {
            _inherits(PaddingBottom, _Length2);

            var _super = _createSuper(PaddingBottom);

            function PaddingBottom() {
                _classCallCheck(this, PaddingBottom);

                return _super.apply(this, arguments);
            }

            return PaddingBottom;
        }(_Length);
    }, { "./_Length": 228 }],
    223: [function(require, module, exports) {
        "use strict";

        function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

        function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

        function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); }
            subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });
            if (superClass) _setPrototypeOf(subClass, superClass);
        }

        function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

        function _createSuper(Derived) {
            var hasNativeReflectConstruct = _isNativeReflectConstruct();
            return function _createSuperInternal() {
                var Super = _getPrototypeOf(Derived),
                    result;
                if (hasNativeReflectConstruct) {
                    var NewTarget = _getPrototypeOf(this).constructor;
                    result = Reflect.construct(Super, arguments, NewTarget);
                } else { result = Super.apply(this, arguments); }
                return _possibleConstructorReturn(this, result);
            };
        }

        function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

        function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

        function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})); return true; } catch (e) { return false; } }

        function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

        // Generated by CoffeeScript 2.5.1
        var PaddingLeft, _Length;

        _Length = require('./_Length');

        module.exports = PaddingLeft = /*#__PURE__*/ function(_Length2) {
            _inherits(PaddingLeft, _Length2);

            var _super = _createSuper(PaddingLeft);

            function PaddingLeft() {
                _classCallCheck(this, PaddingLeft);

                return _super.apply(this, arguments);
            }

            return PaddingLeft;
        }(_Length);
    }, { "./_Length": 228 }],
    224: [function(require, module, exports) {
        "use strict";

        function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

        function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

        function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); }
            subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });
            if (superClass) _setPrototypeOf(subClass, superClass);
        }

        function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

        function _createSuper(Derived) {
            var hasNativeReflectConstruct = _isNativeReflectConstruct();
            return function _createSuperInternal() {
                var Super = _getPrototypeOf(Derived),
                    result;
                if (hasNativeReflectConstruct) {
                    var NewTarget = _getPrototypeOf(this).constructor;
                    result = Reflect.construct(Super, arguments, NewTarget);
                } else { result = Super.apply(this, arguments); }
                return _possibleConstructorReturn(this, result);
            };
        }

        function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

        function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

        function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})); return true; } catch (e) { return false; } }

        function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

        // Generated by CoffeeScript 2.5.1
        var PaddingRight, _Length;

        _Length = require('./_Length');

        module.exports = PaddingRight = /*#__PURE__*/ function(_Length2) {
            _inherits(PaddingRight, _Length2);

            var _super = _createSuper(PaddingRight);

            function PaddingRight() {
                _classCallCheck(this, PaddingRight);

                return _super.apply(this, arguments);
            }

            return PaddingRight;
        }(_Length);
    }, { "./_Length": 228 }],
    225: [function(require, module, exports) {
        "use strict";

        function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

        function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

        function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); }
            subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });
            if (superClass) _setPrototypeOf(subClass, superClass);
        }

        function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

        function _createSuper(Derived) {
            var hasNativeReflectConstruct = _isNativeReflectConstruct();
            return function _createSuperInternal() {
                var Super = _getPrototypeOf(Derived),
                    result;
                if (hasNativeReflectConstruct) {
                    var NewTarget = _getPrototypeOf(this).constructor;
                    result = Reflect.construct(Super, arguments, NewTarget);
                } else { result = Super.apply(this, arguments); }
                return _possibleConstructorReturn(this, result);
            };
        }

        function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

        function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

        function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})); return true; } catch (e) { return false; } }

        function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

        // Generated by CoffeeScript 2.5.1
        var PaddingTop, _Length;

        _Length = require('./_Length');

        module.exports = PaddingTop = /*#__PURE__*/ function(_Length2) {
            _inherits(PaddingTop, _Length2);

            var _super = _createSuper(PaddingTop);

            function PaddingTop() {
                _classCallCheck(this, PaddingTop);

                return _super.apply(this, arguments);
            }

            return PaddingTop;
        }(_Length);
    }, { "./_Length": 228 }],
    226: [function(require, module, exports) {
        "use strict";

        function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

        function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

        function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); }
            subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });
            if (superClass) _setPrototypeOf(subClass, superClass);
        }

        function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

        function _createSuper(Derived) {
            var hasNativeReflectConstruct = _isNativeReflectConstruct();
            return function _createSuperInternal() {
                var Super = _getPrototypeOf(Derived),
                    result;
                if (hasNativeReflectConstruct) {
                    var NewTarget = _getPrototypeOf(this).constructor;
                    result = Reflect.construct(Super, arguments, NewTarget);
                } else { result = Super.apply(this, arguments); }
                return _possibleConstructorReturn(this, result);
            };
        }

        function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

        function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

        function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})); return true; } catch (e) { return false; } }

        function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

        // Generated by CoffeeScript 2.5.1
        var Width, _Length;

        _Length = require('./_Length');

        module.exports = Width = /*#__PURE__*/ function(_Length2) {
            _inherits(Width, _Length2);

            var _super = _createSuper(Width);

            function Width() {
                _classCallCheck(this, Width);

                return _super.apply(this, arguments);
            }

            return Width;
        }(_Length);
    }, { "./_Length": 228 }],
    227: [function(require, module, exports) {
        "use strict";

        function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

        function _defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

        // Generated by CoffeeScript 2.5.1
        // Abstract Style Declaration
        var _Declaration;

        module.exports = _Declaration = function() {
            var self;

            var _Declaration = /*#__PURE__*/ function() {
                function _Declaration(prop1, val) {
                    _classCallCheck(this, _Declaration);

                    this.prop = prop1;
                    this.important = false;
                    this.set(val);
                }

                _createClass(_Declaration, [{
                    key: "get",
                    value: function get() {
                        return this._get();
                    }
                }, {
                    key: "_get",
                    value: function _get() {
                        return this.val;
                    }
                }, {
                    key: "_pickImportantClause",
                    value: function _pickImportantClause(val) {
                        if (self.importantClauseRx.test(String(val))) {
                            this.important = true;
                            return val.replace(self.importantClauseRx, '');
                        } else {
                            this.important = false;
                            return val;
                        }
                    }
                }, {
                    key: "set",
                    value: function set(val) {
                        val = self.sanitizeValue(val);
                        val = this._pickImportantClause(val);
                        val = val.trim();

                        if (this._handleNullOrInherit(val)) {
                            return this;
                        }

                        this._set(val);

                        return this;
                    }
                }, {
                    key: "_set",
                    value: function _set(val) {
                        return this.val = val;
                    }
                }, {
                    key: "_handleNullOrInherit",
                    value: function _handleNullOrInherit(val) {
                        if (val === '') {
                            this.val = '';
                            return true;
                        }

                        if (val === 'inherit') {
                            if (this.constructor.inheritAllowed) {
                                this.val = 'inherit';
                            } else {
                                throw Error("Inherit is not allowed for `".concat(this.prop, "`"));
                            }

                            return true;
                        } else {
                            return false;
                        }
                    }
                }], [{
                    key: "setOnto",
                    value: function setOnto(declarations, prop, val) {
                        var dec;

                        if (!(dec = declarations[prop])) {
                            return declarations[prop] = new this(prop, val);
                        } else {
                            return dec.set(val);
                        }
                    }
                }, {
                    key: "sanitizeValue",
                    value: function sanitizeValue(val) {
                        return String(val).trim().replace(/[\s]+/g, ' ');
                    }
                }]);

                return _Declaration;
            }();

            ;
            self = _Declaration;
            _Declaration.importantClauseRx = /(\s\!important)$/;
            _Declaration.inheritAllowed = false;
            return _Declaration;
        }.call(void 0);
    }, {}],
    228: [function(require, module, exports) {
        "use strict";

        function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

        function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

        function _defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

        function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); }
            subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });
            if (superClass) _setPrototypeOf(subClass, superClass);
        }

        function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

        function _createSuper(Derived) {
            var hasNativeReflectConstruct = _isNativeReflectConstruct();
            return function _createSuperInternal() {
                var Super = _getPrototypeOf(Derived),
                    result;
                if (hasNativeReflectConstruct) {
                    var NewTarget = _getPrototypeOf(this).constructor;
                    result = Reflect.construct(Super, arguments, NewTarget);
                } else { result = Super.apply(this, arguments); }
                return _possibleConstructorReturn(this, result);
            };
        }

        function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

        function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

        function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})); return true; } catch (e) { return false; } }

        function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

        // Generated by CoffeeScript 2.5.1
        var _Declaration, _Length;

        _Declaration = require('./_Declaration');

        module.exports = _Length = /*#__PURE__*/ function(_Declaration2) {
            _inherits(_Length, _Declaration2);

            var _super = _createSuper(_Length);

            function _Length() {
                _classCallCheck(this, _Length);

                return _super.apply(this, arguments);
            }

            _createClass(_Length, [{
                key: "_set",
                value: function _set(val) {
                    if (!/^[0-9]+$/.test(String(val))) {
                        throw Error("`".concat(this.prop, "` only takes an integer for value"));
                    }

                    return this.val = parseInt(val);
                }
            }]);

            return _Length;
        }(_Declaration);
    }, { "./_Declaration": 227 }],
    229: [function(require, module, exports) {
        (function(process) {
            (function() {
                "use strict";

                // Generated by CoffeeScript 2.5.1
                var cloneDeep, htmlparser, isPlainObject, merge, _objectToDom, self;

                htmlparser = require('htmlparser2');

                var _require = require('dom-converter');

                _objectToDom = _require.objectToDom;
                merge = require('lodash/merge');
                cloneDeep = require('lodash/cloneDeep');
                isPlainObject = require('lodash/isPlainObject');
                module.exports = self = {
                    repeatString: function repeatString(str, times) {
                        var i, j, output, ref;
                        output = '';

                        for (i = j = 0, ref = times; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
                            output += str;
                        }

                        return output;
                    },
                    cloneAndMergeDeep: function cloneAndMergeDeep(base, toAppend) {
                        return merge(cloneDeep(base), toAppend);
                    },
                    toDom: function toDom(subject) {
                        if (typeof subject === 'string') {
                            return self.stringToDom(subject);
                        } else if (isPlainObject(subject)) {
                            return self._objectToDom(subject);
                        } else {
                            throw Error("tools.toDom() only supports strings and objects");
                        }
                    },
                    stringToDom: function stringToDom(string) {
                        var handler, parser;
                        handler = new htmlparser.DomHandler();
                        parser = new htmlparser.Parser(handler);
                        parser.write(string);
                        parser.end();
                        return handler.dom;
                    },
                    _fixQuotesInDom: function _fixQuotesInDom(input) {
                        var j, len, node;

                        if (Array.isArray(input)) {
                            for (j = 0, len = input.length; j < len; j++) {
                                node = input[j];

                                self._fixQuotesInDom(node);
                            }

                            return input;
                        }

                        node = input;

                        if (node.type === 'text') {
                            return node.data = self._quoteNodeText(node.data);
                        } else {
                            return self._fixQuotesInDom(node.children);
                        }
                    },
                    objectToDom: function objectToDom(o) {
                        if (!Array.isArray(o)) {
                            if (!isPlainObject(o)) {
                                throw Error("objectToDom() only accepts a bare object or an array");
                            }
                        }

                        return self._fixQuotesInDom(_objectToDom(o));
                    },
                    quote: function quote(str) {
                        return String(str).replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;').replace(/\ /g, '&sp;').replace(/\n/g, '<br />');
                    },
                    _quoteNodeText: function _quoteNodeText(text) {
                        return String(text).replace(/\&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;').replace(/\ /g, '&sp;').replace(/\n/g, "&nl;");
                    },
                    getCols: function getCols() {
                        var cols, tty; // Based on https://github.com/jonschlinkert/window-size

                        tty = require('tty');

                        cols = function() {
                            try {
                                if (tty.isatty(1) && tty.isatty(2)) {
                                    if (process.stdout.getWindowSize) {
                                        return process.stdout.getWindowSize(1)[0];
                                    } else if (tty.getWindowSize) {
                                        return tty.getWindowSize()[1];
                                    } else if (process.stdout.columns) {
                                        return process.stdout.columns;
                                    }
                                }
                            } catch (error) {}
                        }();

                        if (typeof cols === 'number' && cols > 30) {
                            return cols;
                        } else {
                            return 80;
                        }
                    }
                };
            }).call(this)
        }).call(this, require('_process'))
    }, { "_process": 2, "dom-converter": 20, "htmlparser2": 48, "lodash/cloneDeep": 154, "lodash/isPlainObject": 168, "lodash/merge": 173, "tty": 3 }],
    230: [function(require, module, exports) {
        'use strict';
        const ansiRegex = require('ansi-regex');

        module.exports = string => typeof string === 'string' ? string.replace(ansiRegex(), '') : string;

    }, { "ansi-regex": 4 }],
    231: [function(require, module, exports) {
        // Generated by CoffeeScript 1.6.3
        var Emitter, array;

        array = require('./array');

        module.exports = Emitter = (function() {
            function Emitter() {
                this._listeners = {};
                this._listenersForAnyEvent = [];
                this._disabledEmitters = {};
            }

            Emitter.prototype.on = function(eventName, listener) {
                if (this._listeners[eventName] == null) {
                    this._listeners[eventName] = [];
                }
                this._listeners[eventName].push(listener);
                return this;
            };

            Emitter.prototype.once = function(eventName, listener) {
                var cb, ran,
                    _this = this;
                ran = false;
                cb = function() {
                    if (ran) {
                        return;
                    }
                    ran = true;
                    listener();
                    return setTimeout(function() {
                        return _this.removeEvent(eventName, cb);
                    }, 0);
                };
                this.on(eventName, cb);
                return this;
            };

            Emitter.prototype.onAnyEvent = function(listener) {
                this._listenersForAnyEvent.push(listener);
                return this;
            };

            Emitter.prototype.removeEvent = function(eventName, listener) {
                if (this._listeners[eventName] == null) {
                    return this;
                }
                array.pluckOneItem(this._listeners[eventName], listener);
                return this;
            };

            Emitter.prototype.removeListeners = function(eventName) {
                if (this._listeners[eventName] == null) {
                    return this;
                }
                this._listeners[eventName].length = 0;
                return this;
            };

            Emitter.prototype.removeAllListeners = function() {
                var listeners, name, _ref;
                _ref = this._listeners;
                for (name in _ref) {
                    listeners = _ref[name];
                    listeners.length = 0;
                }
                return this;
            };

            Emitter.prototype._emit = function(eventName, data) {
                var listener, _i, _j, _len, _len1, _ref, _ref1;
                _ref = this._listenersForAnyEvent;
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    listener = _ref[_i];
                    listener.call(this, data, eventName);
                }
                if (this._listeners[eventName] == null) {
                    return;
                }
                _ref1 = this._listeners[eventName];
                for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                    listener = _ref1[_j];
                    listener.call(this, data);
                }
            };

            Emitter.prototype._throttleEmitterMethod = function(fnName, time) {
                var lastCallArgs, originalFn, pend, pending, runIt, timer,
                    _this = this;
                if (time == null) {
                    time = 1000;
                }
                originalFn = this[fnName];
                if (typeof originalFn !== 'function') {
                    throw Error("this class does not have a method called '" + fnName + "'");
                }
                lastCallArgs = null;
                pending = false;
                timer = null;
                this[fnName] = function() {
                    lastCallArgs = arguments;
                    return pend();
                };
                pend = function() {
                    if (pending) {
                        clearTimeout(timer);
                    }
                    timer = setTimeout(runIt, time);
                    return pending = true;
                };
                return runIt = function() {
                    pending = false;
                    return originalFn.apply(_this, lastCallArgs);
                };
            };

            Emitter.prototype._disableEmitter = function(fnName) {
                if (this._disabledEmitters[fnName] != null) {
                    throw Error("" + fnName + " is already a disabled emitter");
                }
                this._disabledEmitters[fnName] = this[fnName];
                return this[fnName] = function() {};
            };

            Emitter.prototype._enableEmitter = function(fnName) {
                var fn;
                fn = this._disabledEmitters[fnName];
                if (fn == null) {
                    throw Error("" + fnName + " is not a disabled emitter");
                }
                this[fnName] = fn;
                return delete this._disabledEmitters[fnName];
            };

            return Emitter;

        })();

    }, { "./array": 233 }],
    232: [function(require, module, exports) {
        // Generated by CoffeeScript 1.6.3
        var common;

        module.exports = common = {
            /*
            	Checks to see if o is an object, and it isn't an instance
            	of some class.
            */

            isBareObject: function(o) {
                if ((o != null) && o.constructor === Object) {
                    return true;
                }
                return false;
            },
            /*
            	Returns type of an object, including:
            	undefined, null, string, number, array,
            	arguments, element, textnode, whitespace, and object
            */

            typeOf: function(item) {
                var _ref;
                if (item === null) {
                    return 'null';
                }
                if (typeof item !== 'object') {
                    return typeof item;
                }
                if (Array.isArray(item)) {
                    return 'array';
                }
                if (item.nodeName) {
                    if (item.nodeType === 1) {
                        return 'element';
                    }
                    if (item.nodeType === 3) {
                        return (_ref = /\S/.test(item.nodeValue)) != null ? _ref : {
                            'textnode': 'whitespace'
                        };
                    }
                } else if (typeof item.length === 'number') {
                    if (item.callee) {
                        return 'arguments';
                    }
                }
                return typeof item;
            },
            clone: function(item, includePrototype) {
                if (includePrototype == null) {
                    includePrototype = false;
                }
                switch (common.typeOf(item)) {
                    case 'array':
                        return common._cloneArray(item, includePrototype);
                    case 'object':
                        return common._cloneObject(item, includePrototype);
                    default:
                        return item;
                }
            },
            /*
            	Deep clone of an object.
            	From MooTools
            */

            _cloneObject: function(o, includePrototype) {
                var clone, key;
                if (includePrototype == null) {
                    includePrototype = false;
                }
                if (common.isBareObject(o)) {
                    clone = {};
                    for (key in o) {
                        clone[key] = common.clone(o[key], includePrototype);
                    }
                    return clone;
                } else {
                    if (!includePrototype) {
                        return o;
                    }
                    if (o instanceof Function) {
                        return o;
                    }
                    clone = Object.create(o.constructor.prototype);
                    for (key in o) {
                        if (o.hasOwnProperty(key)) {
                            clone[key] = common.clone(o[key], includePrototype);
                        }
                    }
                    return clone;
                }
            },
            /*
            	Deep clone of an array.
            	From MooTools
            */

            _cloneArray: function(a, includePrototype) {
                var clone, i;
                if (includePrototype == null) {
                    includePrototype = false;
                }
                i = a.length;
                clone = new Array(i);
                while (i--) {
                    clone[i] = common.clone(a[i], includePrototype);
                }
                return clone;
            }
        };

    }, {}],
    233: [function(require, module, exports) {
        // Generated by CoffeeScript 1.6.3
        var array;

        module.exports = array = {
            /*
            	Tries to turn anything into an array.
            */

            from: function(r) {
                return Array.prototype.slice.call(r);
            },
            /*
            	Clone of an array. Properties will be shallow copies.
            */

            simpleClone: function(a) {
                return a.slice(0);
            },
            shallowEqual: function(a1, a2) {
                var i, val, _i, _len;
                if (!(Array.isArray(a1) && Array.isArray(a2) && a1.length === a2.length)) {
                    return false;
                }
                for (i = _i = 0, _len = a1.length; _i < _len; i = ++_i) {
                    val = a1[i];
                    if (a2[i] !== val) {
                        return false;
                    }
                }
                return true;
            },
            pluck: function(a, i) {
                var index, value, _i, _len;
                if (a.length < 1) {
                    return a;
                }
                for (index = _i = 0, _len = a.length; _i < _len; index = ++_i) {
                    value = a[index];
                    if (index > i) {
                        a[index - 1] = a[index];
                    }
                }
                a.length = a.length - 1;
                return a;
            },
            pluckItem: function(a, item) {
                var index, removed, value, _i, _len;
                if (a.length < 1) {
                    return a;
                }
                removed = 0;
                for (index = _i = 0, _len = a.length; _i < _len; index = ++_i) {
                    value = a[index];
                    if (value === item) {
                        removed++;
                        continue;
                    }
                    if (removed !== 0) {
                        a[index - removed] = a[index];
                    }
                }
                if (removed > 0) {
                    a.length = a.length - removed;
                }
                return a;
            },
            pluckOneItem: function(a, item) {
                var index, reached, value, _i, _len;
                if (a.length < 1) {
                    return a;
                }
                reached = false;
                for (index = _i = 0, _len = a.length; _i < _len; index = ++_i) {
                    value = a[index];
                    if (!reached) {
                        if (value === item) {
                            reached = true;
                            continue;
                        }
                    } else {
                        a[index - 1] = a[index];
                    }
                }
                if (reached) {
                    a.length = a.length - 1;
                }
                return a;
            },
            pluckByCallback: function(a, cb) {
                var index, removed, value, _i, _len;
                if (a.length < 1) {
                    return a;
                }
                removed = 0;
                for (index = _i = 0, _len = a.length; _i < _len; index = ++_i) {
                    value = a[index];
                    if (cb(value, index)) {
                        removed++;
                        continue;
                    }
                    if (removed !== 0) {
                        a[index - removed] = a[index];
                    }
                }
                if (removed > 0) {
                    a.length = a.length - removed;
                }
                return a;
            },
            pluckMultiple: function(array, indexesToRemove) {
                var i, removedSoFar, _i, _len;
                if (array.length < 1) {
                    return array;
                }
                removedSoFar = 0;
                indexesToRemove.sort();
                for (_i = 0, _len = indexesToRemove.length; _i < _len; _i++) {
                    i = indexesToRemove[_i];
                    this.pluck(array, i - removedSoFar);
                    removedSoFar++;
                }
                return array;
            },
            injectByCallback: function(a, toInject, shouldInject) {
                var i, len, val, valA, valB, _i, _len;
                valA = null;
                valB = null;
                len = a.length;
                if (len < 1) {
                    a.push(toInject);
                    return a;
                }
                for (i = _i = 0, _len = a.length; _i < _len; i = ++_i) {
                    val = a[i];
                    valA = valB;
                    valB = val;
                    if (shouldInject(valA, valB, toInject)) {
                        return a.splice(i, 0, toInject);
                    }
                }
                a.push(toInject);
                return a;
            },
            injectInIndex: function(a, index, toInject) {
                var i, len, toPut, toPutNext;
                len = a.length;
                i = index;
                if (len < 1) {
                    a.push(toInject);
                    return a;
                }
                toPut = toInject;
                toPutNext = null;
                for (; i <= len; i++) {

                    toPutNext = a[i];

                    a[i] = toPut;

                    toPut = toPutNext;

                };
                return null;
            }
        };

    }, {}],
    234: [function(require, module, exports) {
        // Generated by CoffeeScript 1.6.3
        var classic,
            __slice = [].slice;

        module.exports = classic = {};

        classic.implement = function() {
            var classProto, classReference, desc, member, mixin, mixins, _i, _j, _len;
            mixins = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), classReference = arguments[_i++];
            for (_j = 0, _len = mixins.length; _j < _len; _j++) {
                mixin = mixins[_j];
                classProto = classReference.prototype;
                for (member in mixin.prototype) {
                    if (!Object.getOwnPropertyDescriptor(classProto, member)) {
                        desc = Object.getOwnPropertyDescriptor(mixin.prototype, member);
                        Object.defineProperty(classProto, member, desc);
                    }
                }
            }
            return classReference;
        };

        classic.mix = function() {
            var classProto, classReference, desc, member, mixin, mixins, _i, _j, _len;
            mixins = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), classReference = arguments[_i++];
            classProto = classReference.prototype;
            classReference.__mixinCloners = [];
            classReference.__applyClonersFor = function(instance, args) {
                var cloner, _j, _len, _ref;
                if (args == null) {
                    args = null;
                }
                _ref = classReference.__mixinCloners;
                for (_j = 0, _len = _ref.length; _j < _len; _j++) {
                    cloner = _ref[_j];
                    cloner.apply(instance, args);
                }
            };
            classReference.__mixinInitializers = [];
            classReference.__initMixinsFor = function(instance, args) {
                var initializer, _j, _len, _ref;
                if (args == null) {
                    args = null;
                }
                _ref = classReference.__mixinInitializers;
                for (_j = 0, _len = _ref.length; _j < _len; _j++) {
                    initializer = _ref[_j];
                    initializer.apply(instance, args);
                }
            };
            classReference.__mixinQuitters = [];
            classReference.__applyQuittersFor = function(instance, args) {
                var quitter, _j, _len, _ref;
                if (args == null) {
                    args = null;
                }
                _ref = classReference.__mixinQuitters;
                for (_j = 0, _len = _ref.length; _j < _len; _j++) {
                    quitter = _ref[_j];
                    quitter.apply(instance, args);
                }
            };
            for (_j = 0, _len = mixins.length; _j < _len; _j++) {
                mixin = mixins[_j];
                if (!(mixin.constructor instanceof Function)) {
                    throw Error("Mixin should be a function");
                }
                for (member in mixin.prototype) {
                    if (member.substr(0, 11) === '__initMixin') {
                        classReference.__mixinInitializers.push(mixin.prototype[member]);
                        continue;
                    } else if (member.substr(0, 11) === '__clonerFor') {
                        classReference.__mixinCloners.push(mixin.prototype[member]);
                        continue;
                    } else if (member.substr(0, 12) === '__quitterFor') {
                        classReference.__mixinQuitters.push(mixin.prototype[member]);
                        continue;
                    }
                    if (!Object.getOwnPropertyDescriptor(classProto, member)) {
                        desc = Object.getOwnPropertyDescriptor(mixin.prototype, member);
                        Object.defineProperty(classProto, member, desc);
                    }
                }
            }
            return classReference;
        };

    }, {}],
    235: [function(require, module, exports) {
        // Generated by CoffeeScript 1.6.3
        var object, _common,
            __hasProp = {}.hasOwnProperty;

        _common = require('./_common');

        module.exports = object = {
            isBareObject: _common.isBareObject.bind(_common),
            /*
            	if object is an instance of a class
            */

            isInstance: function(what) {
                return !this.isBareObject(what);
            },
            /*
            	Alias to _common.typeOf
            */

            typeOf: _common.typeOf.bind(_common),
            /*
            	Alias to _common.clone
            */

            clone: _common.clone.bind(_common),
            /*
            	Empties an object of its properties.
            */

            empty: function(o) {
                var prop;
                for (prop in o) {
                    if (o.hasOwnProperty(prop)) {
                        delete o[prop];
                    }
                }
                return o;
            },
            /*
            	Empties an object. Doesn't check for hasOwnProperty, so it's a tiny
            	bit faster. Use it for plain objects.
            */

            fastEmpty: function(o) {
                var property;
                for (property in o) {
                    delete o[property];
                }
                return o;
            },
            /*
            	Overrides values fomr `newValues` on `base`, as long as they
            	already exist in base.
            */

            overrideOnto: function(base, newValues) {
                var key, newVal, oldVal;
                if (!this.isBareObject(newValues) || !this.isBareObject(base)) {
                    return base;
                }
                for (key in base) {
                    oldVal = base[key];
                    newVal = newValues[key];
                    if (newVal === void 0) {
                        continue;
                    }
                    if (typeof newVal !== 'object' || this.isInstance(newVal)) {
                        base[key] = this.clone(newVal);
                    } else {
                        if (typeof oldVal !== 'object' || this.isInstance(oldVal)) {
                            base[key] = this.clone(newVal);
                        } else {
                            this.overrideOnto(oldVal, newVal);
                        }
                    }
                }
                return base;
            },
            /*
            	Takes a clone of 'base' and runs #overrideOnto on it
            */

            override: function(base, newValues) {
                return this.overrideOnto(this.clone(base), newValues);
            },
            append: function(base, toAppend) {
                return this.appendOnto(this.clone(base), toAppend);
            },
            appendOnto: function(base, toAppend) {
                var key, newVal, oldVal;
                if (!this.isBareObject(toAppend) || !this.isBareObject(base)) {
                    return base;
                }
                for (key in toAppend) {
                    if (!__hasProp.call(toAppend, key)) continue;
                    newVal = toAppend[key];
                    if (newVal === void 0) {
                        continue;
                    }
                    if (typeof newVal !== 'object' || this.isInstance(newVal)) {
                        base[key] = newVal;
                    } else {
                        oldVal = base[key];
                        if (typeof oldVal !== 'object' || this.isInstance(oldVal)) {
                            base[key] = this.clone(newVal);
                        } else {
                            this.appendOnto(oldVal, newVal);
                        }
                    }
                }
                return base;
            },
            groupProps: function(obj, groups) {
                var def, defs, grouped, key, name, shouldAdd, val, _i, _len;
                grouped = {};
                for (name in groups) {
                    defs = groups[name];
                    grouped[name] = {};
                }
                grouped['rest'] = {};
                top: //;
                    for (key in obj) {
                        val = obj[key];
                        shouldAdd = false;
                        for (name in groups) {
                            defs = groups[name];
                            if (!Array.isArray(defs)) {
                                defs = [defs];
                            }
                            for (_i = 0, _len = defs.length; _i < _len; _i++) {
                                def = defs[_i];
                                if (typeof def === 'string') {
                                    if (key === def) {
                                        shouldAdd = true;
                                    }
                                } else if (def instanceof RegExp) {
                                    if (def.test(key)) {
                                        shouldAdd = true;
                                    }
                                } else if (def instanceof Function) {
                                    if (def(key)) {
                                        shouldAdd = true;
                                    }
                                } else {
                                    throw Error('Group definitions must either\
						be strings, regexes, or functions.');
                                }
                                if (shouldAdd) {
                                    grouped[name][key] = val;
                                    continue top;
                                }
                            }
                        }
                        grouped['rest'][key] = val;
                    }
                return grouped;
            }
        };

    }, { "./_common": 232 }],
    236: [function(require, module, exports) {
        // Generated by CoffeeScript 1.6.3
        module.exports = {
            pad: function(n, width, z) {
                if (z == null) {
                    z = '0';
                }
                n = n + '';
                if (n.length >= width) {
                    return n;
                } else {
                    return new Array(width - n.length + 1).join(z) + n;
                }
            }
        };

    }, {}],
    237: [function(require, module, exports) {
        // Generated by CoffeeScript 1.6.3
        var utila;

        module.exports = utila = {
            array: require('./array'),
            classic: require('./classic'),
            object: require('./object'),
            string: require('./string'),
            Emitter: require('./Emitter')
        };

    }, { "./Emitter": 231, "./array": 233, "./classic": 234, "./object": 235, "./string": 236 }],
    238: [function(require, module, exports) {
        const PrettyError = require('pretty-error');
        TAF.setExport(
            import.meta.url, {
                default: new PrettyError()
            })
    }, { "pretty-error": 181 }]
}, {}, [238]);