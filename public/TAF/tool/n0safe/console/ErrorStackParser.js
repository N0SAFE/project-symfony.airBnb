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
        (function(root, factory) {
            'use strict';
            // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js, Rhino, and browsers.

            /* istanbul ignore next */
            if (typeof define === 'function' && define.amd) {
                define('error-stack-parser', ['stackframe'], factory);
            } else if (typeof exports === 'object') {
                module.exports = factory(require('stackframe'));
            } else {
                root.ErrorStackParser = factory(root.StackFrame);
            }
        }(this, function ErrorStackParser(StackFrame) {
            'use strict';

            var FIREFOX_SAFARI_STACK_REGEXP = /(^|@)\S+:\d+/;
            var CHROME_IE_STACK_REGEXP = /^\s*at .*(\S+:\d+|\(native\))/m;
            var SAFARI_NATIVE_CODE_REGEXP = /^(eval@)?(\[native code])?$/;

            return {
                /**
                 * Given an Error object, extract the most information from it.
                 *
                 * @param {Error} error object
                 * @return {Array} of StackFrames
                 */
                parse: function ErrorStackParser$$parse(error) {
                    if (typeof error.stacktrace !== 'undefined' || typeof error['opera#sourceloc'] !== 'undefined') {
                        return this.parseOpera(error);
                    } else if (error.stack && error.stack.match(CHROME_IE_STACK_REGEXP)) {
                        return this.parseV8OrIE(error);
                    } else if (error.stack) {
                        return this.parseFFOrSafari(error);
                    } else {
                        throw new Error('Cannot parse given Error object');
                    }
                },

                // Separate line and column numbers from a string of the form: (URI:Line:Column)
                extractLocation: function ErrorStackParser$$extractLocation(urlLike) {
                    // Fail-fast but return locations like "(native)"
                    if (urlLike.indexOf(':') === -1) {
                        return [urlLike];
                    }

                    var regExp = /(.+?)(?::(\d+))?(?::(\d+))?$/;
                    var parts = regExp.exec(urlLike.replace(/[()]/g, ''));
                    return [parts[1], parts[2] || undefined, parts[3] || undefined];
                },

                parseV8OrIE: function ErrorStackParser$$parseV8OrIE(error) {
                    var filtered = error.stack.split('\n').filter(function(line) {
                        return !!line.match(CHROME_IE_STACK_REGEXP);
                    }, this);

                    return filtered.map(function(line) {
                        if (line.indexOf('(eval ') > -1) {
                            // Throw away eval information until we implement stacktrace.js/stackframe#8
                            line = line.replace(/eval code/g, 'eval').replace(/(\(eval at [^()]*)|(,.*$)/g, '');
                        }
                        var sanitizedLine = line.replace(/^\s+/, '').replace(/\(eval code/g, '(').replace(/^.*?\s+/, '');

                        // capture and preseve the parenthesized location "(/foo/my bar.js:12:87)" in
                        // case it has spaces in it, as the string is split on \s+ later on
                        var location = sanitizedLine.match(/ (\(.+\)$)/);

                        // remove the parenthesized location from the line, if it was matched
                        sanitizedLine = location ? sanitizedLine.replace(location[0], '') : sanitizedLine;

                        // if a location was matched, pass it to extractLocation() otherwise pass all sanitizedLine
                        // because this line doesn't have function name
                        var locationParts = this.extractLocation(location ? location[1] : sanitizedLine);
                        var functionName = location && sanitizedLine || undefined;
                        var fileName = ['eval', '<anonymous>'].indexOf(locationParts[0]) > -1 ? undefined : locationParts[0];

                        return new StackFrame({
                            functionName: functionName,
                            fileName: fileName,
                            lineNumber: locationParts[1],
                            columnNumber: locationParts[2],
                            source: line
                        });
                    }, this);
                },

                parseFFOrSafari: function ErrorStackParser$$parseFFOrSafari(error) {
                    var filtered = error.stack.split('\n').filter(function(line) {
                        return !line.match(SAFARI_NATIVE_CODE_REGEXP);
                    }, this);

                    return filtered.map(function(line) {
                        // Throw away eval information until we implement stacktrace.js/stackframe#8
                        if (line.indexOf(' > eval') > -1) {
                            line = line.replace(/ line (\d+)(?: > eval line \d+)* > eval:\d+:\d+/g, ':$1');
                        }

                        if (line.indexOf('@') === -1 && line.indexOf(':') === -1) {
                            // Safari eval frames only have function names and nothing else
                            return new StackFrame({
                                functionName: line
                            });
                        } else {
                            var functionNameRegex = /((.*".+"[^@]*)?[^@]*)(?:@)/;
                            var matches = line.match(functionNameRegex);
                            var functionName = matches && matches[1] ? matches[1] : undefined;
                            var locationParts = this.extractLocation(line.replace(functionNameRegex, ''));

                            return new StackFrame({
                                functionName: functionName,
                                fileName: locationParts[0],
                                lineNumber: locationParts[1],
                                columnNumber: locationParts[2],
                                source: line
                            });
                        }
                    }, this);
                },

                parseOpera: function ErrorStackParser$$parseOpera(e) {
                    if (!e.stacktrace || (e.message.indexOf('\n') > -1 &&
                            e.message.split('\n').length > e.stacktrace.split('\n').length)) {
                        return this.parseOpera9(e);
                    } else if (!e.stack) {
                        return this.parseOpera10(e);
                    } else {
                        return this.parseOpera11(e);
                    }
                },

                parseOpera9: function ErrorStackParser$$parseOpera9(e) {
                    var lineRE = /Line (\d+).*script (?:in )?(\S+)/i;
                    var lines = e.message.split('\n');
                    var result = [];

                    for (var i = 2, len = lines.length; i < len; i += 2) {
                        var match = lineRE.exec(lines[i]);
                        if (match) {
                            result.push(new StackFrame({
                                fileName: match[2],
                                lineNumber: match[1],
                                source: lines[i]
                            }));
                        }
                    }

                    return result;
                },

                parseOpera10: function ErrorStackParser$$parseOpera10(e) {
                    var lineRE = /Line (\d+).*script (?:in )?(\S+)(?:: In function (\S+))?$/i;
                    var lines = e.stacktrace.split('\n');
                    var result = [];

                    for (var i = 0, len = lines.length; i < len; i += 2) {
                        var match = lineRE.exec(lines[i]);
                        if (match) {
                            result.push(
                                new StackFrame({
                                    functionName: match[3] || undefined,
                                    fileName: match[2],
                                    lineNumber: match[1],
                                    source: lines[i]
                                })
                            );
                        }
                    }

                    return result;
                },

                // Opera 10.65+ Error.stack very similar to FF/Safari
                parseOpera11: function ErrorStackParser$$parseOpera11(error) {
                    var filtered = error.stack.split('\n').filter(function(line) {
                        return !!line.match(FIREFOX_SAFARI_STACK_REGEXP) && !line.match(/^Error created at/);
                    }, this);

                    return filtered.map(function(line) {
                        var tokens = line.split('@');
                        var locationParts = this.extractLocation(tokens.pop());
                        var functionCall = (tokens.shift() || '');
                        var functionName = functionCall
                            .replace(/<anonymous function(: (\w+))?>/, '$2')
                            .replace(/\([^)]*\)/g, '') || undefined;
                        var argsRaw;
                        if (functionCall.match(/\(([^)]*)\)/)) {
                            argsRaw = functionCall.replace(/^[^(]+\(([^)]*)\)$/, '$1');
                        }
                        var args = (argsRaw === undefined || argsRaw === '[arguments not available]') ?
                            undefined : argsRaw.split(',');

                        return new StackFrame({
                            functionName: functionName,
                            args: args,
                            fileName: locationParts[0],
                            lineNumber: locationParts[1],
                            columnNumber: locationParts[2],
                            source: line
                        });
                    }, this);
                }
            };
        }));

    }, { "stackframe": 2 }],
    2: [function(require, module, exports) {
        (function(root, factory) {
            'use strict';
            // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js, Rhino, and browsers.

            /* istanbul ignore next */
            if (typeof define === 'function' && define.amd) {
                define('stackframe', [], factory);
            } else if (typeof exports === 'object') {
                module.exports = factory();
            } else {
                root.StackFrame = factory();
            }
        }(this, function() {
            'use strict';

            function _isNumber(n) {
                return !isNaN(parseFloat(n)) && isFinite(n);
            }

            function _capitalize(str) {
                return str.charAt(0).toUpperCase() + str.substring(1);
            }

            function _getter(p) {
                return function() {
                    return this[p];
                };
            }

            var booleanProps = ['isConstructor', 'isEval', 'isNative', 'isToplevel'];
            var numericProps = ['columnNumber', 'lineNumber'];
            var stringProps = ['fileName', 'functionName', 'source'];
            var arrayProps = ['args'];
            var objectProps = ['evalOrigin'];

            var props = booleanProps.concat(numericProps, stringProps, arrayProps, objectProps);

            function StackFrame(obj) {
                if (!obj) return;
                for (var i = 0; i < props.length; i++) {
                    if (obj[props[i]] !== undefined) {
                        this['set' + _capitalize(props[i])](obj[props[i]]);
                    }
                }
            }

            StackFrame.prototype = {
                getArgs: function() {
                    return this.args;
                },
                setArgs: function(v) {
                    if (Object.prototype.toString.call(v) !== '[object Array]') {
                        throw new TypeError('Args must be an Array');
                    }
                    this.args = v;
                },

                getEvalOrigin: function() {
                    return this.evalOrigin;
                },
                setEvalOrigin: function(v) {
                    if (v instanceof StackFrame) {
                        this.evalOrigin = v;
                    } else if (v instanceof Object) {
                        this.evalOrigin = new StackFrame(v);
                    } else {
                        throw new TypeError('Eval Origin must be an Object or StackFrame');
                    }
                },

                toString: function() {
                    var fileName = this.getFileName() || '';
                    var lineNumber = this.getLineNumber() || '';
                    var columnNumber = this.getColumnNumber() || '';
                    var functionName = this.getFunctionName() || '';
                    if (this.getIsEval()) {
                        if (fileName) {
                            return '[eval] (' + fileName + ':' + lineNumber + ':' + columnNumber + ')';
                        }
                        return '[eval]:' + lineNumber + ':' + columnNumber;
                    }
                    if (functionName) {
                        return functionName + ' (' + fileName + ':' + lineNumber + ':' + columnNumber + ')';
                    }
                    return fileName + ':' + lineNumber + ':' + columnNumber;
                }
            };

            StackFrame.fromString = function StackFrame$$fromString(str) {
                var argsStartIndex = str.indexOf('(');
                var argsEndIndex = str.lastIndexOf(')');

                var functionName = str.substring(0, argsStartIndex);
                var args = str.substring(argsStartIndex + 1, argsEndIndex).split(',');
                var locationString = str.substring(argsEndIndex + 1);

                if (locationString.indexOf('@') === 0) {
                    var parts = /@(.+?)(?::(\d+))?(?::(\d+))?$/.exec(locationString, '');
                    var fileName = parts[1];
                    var lineNumber = parts[2];
                    var columnNumber = parts[3];
                }

                return new StackFrame({
                    functionName: functionName,
                    args: args || undefined,
                    fileName: fileName,
                    lineNumber: lineNumber || undefined,
                    columnNumber: columnNumber || undefined
                });
            };

            for (var i = 0; i < booleanProps.length; i++) {
                StackFrame.prototype['get' + _capitalize(booleanProps[i])] = _getter(booleanProps[i]);
                StackFrame.prototype['set' + _capitalize(booleanProps[i])] = (function(p) {
                    return function(v) {
                        this[p] = Boolean(v);
                    };
                })(booleanProps[i]);
            }

            for (var j = 0; j < numericProps.length; j++) {
                StackFrame.prototype['get' + _capitalize(numericProps[j])] = _getter(numericProps[j]);
                StackFrame.prototype['set' + _capitalize(numericProps[j])] = (function(p) {
                    return function(v) {
                        if (!_isNumber(v)) {
                            throw new TypeError(p + ' must be a Number');
                        }
                        this[p] = Number(v);
                    };
                })(numericProps[j]);
            }

            for (var k = 0; k < stringProps.length; k++) {
                StackFrame.prototype['get' + _capitalize(stringProps[k])] = _getter(stringProps[k]);
                StackFrame.prototype['set' + _capitalize(stringProps[k])] = (function(p) {
                    return function(v) {
                        this[p] = String(v);
                    };
                })(stringProps[k]);
            }

            return StackFrame;
        }));

    }, {}],
    3: [function(require, module, exports) {
        TAF.setExport(
            import.meta.url, {
                default: require("error-stack-parser")
            })
    }, { "error-stack-parser": 1 }]
}, {}, [3]);