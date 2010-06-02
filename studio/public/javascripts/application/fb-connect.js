/*    HTTP Host:  static.ak.fbcdn.net                                          */
/*    Generated:  August 12th 2009 3:59:34 PM PDT                              */
/*      Machine:  10.16.140.101                                                */
/*       Source:  Global Cache                                                 */
/*     Location:  js/connect.js.pkg.php h:8cx9ovtr                             */
/*       Locale:  nu_ll                                                        */
/*         Path:  js/connect.js.pkg.php                                        */

if (!window.FB) {
    FB = {};
}
FB.Type = {
    createNamespace: function (name) {
        if (!FB.__namespaces) {
            FB.__namespaces = {};
        }
        if (!FB.__rootNamespaces) {
            FB.__rootNamespaces = [];
        }
        if (FB.__namespaces[name]) {
            return;
        }
        var ns = window;
        var nameParts = name.split('.');
        for (var i = 0; i < nameParts.length; i++) {
            var part = nameParts[i];
            var nso = ns[part];
            if (!nso) {
                ns[part] = nso = {};
                if (i == 0) {
                    FB.__rootNamespaces[FB.__rootNamespaces.length] = nso;
                }
            }
            ns = nso;
        }
    },
    createEnum: function (fields, flags) {
        var cls = function () {};
        cls.prototype = fields;
        for (var field in fields) {
            cls[field] = fields[field];
        }
        if (flags) {
            cls.__flags = true;
        }
        return cls;
    },
    createClass2: function (cls, baseType) {
        if (baseType && typeof(baseType) == "string") {
            baseType = eval(baseType);
        }
        cls.prototype.constructor = cls;
        this.extend(cls, FB.Type.Methods);
        cls.__baseType = baseType || Object;
        if (baseType) {
            cls.__basePrototypePending = true;
        }
    },
    createClass: function (fullName, info) {
        if (arguments.length == 1 && typeof(fullName) != "string") {
            return this._createClass(fullName);
        } else {
            var i = fullName.lastIndexOf('.');
            var className;
            var scope = window;
            if (i > 0) {
                var ns = fullName.substring(0, i);
                this.createNamespace(ns);
                className = fullName.substring(i + 1);
                scope = eval(ns);
            } else {
                className = fullName;
            }
            scope[className] = this._createClass(info);
        }
    },
    _createClass: function (info) {
        var cls = info['ctor'] ||
        function () {};
        if (info['static_ctor']) {
            this.addStaticInit(info['static_ctor']);
        }
        if (info['instance']) {
            cls.prototype = info['instance'];
        }
        if (info['static']) {
            this.extend(cls, info['static']);
        }
        this.createClass2(cls, info['base']);
        return cls;
    },
    addStaticInit: function (callback) {
        if (!FB.Type._pendingInits) {
            FB.Type._pendingInits = [];
        }
        FB.Type._pendingInits[FB.Type._pendingInits.length] = callback;
        window.setTimeout(FB.Type.runPendingInits, 0);
    },
    runPendingInits: function () {
        if (FB.Type._pendingInits) {
            var callbacks = FB.Type._pendingInits;
            FB.Type._pendingInits = null;
            var c = callbacks.length;
            for (var i = 0; i < c; i++) {
                callbacks[i]();
            }
        }
    },
    extend: function (destination, source) {
        for (var property in source)
        destination[property] = source[property];
        return destination;
    },
    getInstanceType: function (inst) {
        return inst.constructor;
    }
};
FB.Type.Methods = {
    setupBase: function () {
        if (this.__basePrototypePending) {
            var baseType = this.__baseType;
            if (baseType.__basePrototypePending) {
                baseType.setupBase();
            }
            for (var memberName in baseType.prototype) {
                var memberValue = baseType.prototype[memberName];
                if (!this.prototype[memberName]) {
                    this.prototype[memberName] = memberValue;
                }
            }
            delete this.__basePrototypePending;
        }
    },
    constructBase: function (instance, args) {
        if (this.__basePrototypePending) {
            this.setupBase();
        }
        if (!args) {
            this.__baseType.apply(instance);
        }
        else {
            this.__baseType.apply(instance, args);
        }
    },
    callBase: function (instance, name, args) {
        var baseMethod = this.__baseType.prototype[name];
        if (!args) {
            return baseMethod.apply(instance);
        }
        else {
            return baseMethod.apply(instance, args);
        }
    },
    get_baseType: function () {
        return this.__baseType || null;
    }
}
FB.$ = function (id) {
    return document.getElementById(id);
}
FB.Debug = FB.Type.createClass({
    static: {
        logLevel: 0,
        assert: function (condition, message) {
            if (FB.Debug.logLevel > 0 && !condition) {
                message = 'Assert failed: ' + message;
                if (confirm(message + '\r\n\r\nBreak into debugger?')) {
                    FB.Debug._fail(message);
                }
            }
        },
        writeLine: function (message) {
            if (FB.Debug.logLevel > 0) {
                if (window.Debug && window.Debug.writeln) {
                    window.Debug.writeln(message);
                } else if (window.console) {
                    if (window.console.debug) {
                        window.console.debug(message);
                    } else if (window.console.log) {
                        window.console.log(message);
                    }
                }
                else if (window.opera && window.opera.postError) {
                    window.opera.postError(message);
                }
            }
        },
        logLine: function (logLevel, message) {
            if (logLevel <= FB.Debug.logLevel) {
                FB.Debug.writeLine(message);
            }
        },
        _fail: function (message) {
            FB.Debug.writeLine(message);
            debugger;
        },
        _dumpCore: function (sb, object, name, indentation, dumpedObjects) {
            if (object === null) {
                sb.appendLine(indentation + name + ': null');
                return;
            }
            switch (typeof(object)) {
            case 'undefined':
                sb.appendLine(indentation + name + ': undefined');
                break;
            case 'number':
            case 'string':
            case 'boolean':
                sb.appendLine(indentation + name + ': ' + object);
                break;
            default:
                if (object instanceof Date || object instanceof RegExp) {
                    sb.appendLine(indentation + name + ': ' + object);
                    break;
                }
                if (FB.Sys.contains(dumpedObjects, object)) {
                    sb.appendLine(indentation + name + ': ...');
                    break;
                }
                dumpedObjects[dumpedObjects.length] = object;
                var recursiveIndentation = indentation + '  ';
                if (object.tagName) {
                    sb.appendLine(indentation + name + ': <' + object.tagName + '>');
                    var attributes = object.attributes;
                    for (var i = 0; i < attributes.length; i++) {
                        var attrValue = attributes[i].nodeValue;
                        if (attrValue) {
                            FB.Debug._dumpCore(sb, attrValue, attributes[i].nodeName, recursiveIndentation, dumpedObjects);
                        }
                    }
                }
                else {
                    sb.appendLine(indentation + name + ': ');
                    for (var field in object) {
                        var v = object[field];
                        if (! (v instanceof Function)) {
                            FB.Debug._dumpCore(sb, v, field, recursiveIndentation, dumpedObjects);
                        }
                    }
                }
                FB.Sys.remove(dumpedObjects, object);
                break;
            }
        },
        dump: function (object, name, logLevel) {
            if (logLevel && logLevel > FB.Debug.logLevel) {
                return;
            }
            if ((!name || !name.length) && (object !== null)) {
                name = typeof(object);
            }
            if (!name || !name.length) {
                return;
            }
            var sb = new FB.StringBuilder();
            FB.Debug._dumpCore(sb, object, name, '', []);
            FB.Debug.writeLine(sb.toString());
        },
        fail: function (message) {
            FB.Debug._fail(message);
        }
    }
});
FB.FBDebug = FB.Debug;
FB.Enum = function () {}
FB.Type.createClass2(FB.Enum);
FB.Enum.parse = function Enum$parse(enumType, s) {
    var values = enumType.prototype;
    if (!enumType.__flags) {
        for (var f in values) {
            if (f === s) {
                return values[f];
            }
        }
    }
    else {
        var parts = s.split('|');
        var value = 0;
        var parsed = true;
        for (var i = parts.length - 1; i >= 0; i--) {
            var part = parts[i].trim();
            var found = false;
            for (var f in values) {
                if (f === part) {
                    value |= values[f];
                    found = true;
                    break;
                }
            }
            if (!found) {
                parsed = false;
                break;
            }
        }
        if (parsed) {
            return value;
        }
    }
    throw 'Invalid Enumeration Value';
}
FB.Enum.toString = function Enum$toString(enumType, value) {
    var values = enumType.prototype;
    if (!enumType.__flags || (value === 0)) {
        for (var i in values) {
            if (values[i] === value) {
                return i;
            }
        }
        throw 'Invalid Enumeration Value';
    }
    else {
        var parts = [];
        for (var i in values) {
            if (values[i] & value) {
                if (parts.length) {
                    arts[arts.length] = ' | ';
                }
                parts[parts.length] = i;
            }
        }
        if (!parts.length) {
            throw 'Invalid Enumeration Value';
        }
        return parts.join('');
    }
}
FB.Delegate = function () {}
FB.Type.createClass2(FB.Delegate);
FB.Delegate.Null = function () {}
FB.Delegate._create = function Delegate$_create(targets) {
    var delegate = function () {
        if (targets.length == 2) {
            return targets[1].apply(targets[0], arguments);
        }
        else {
            var targets_copy = targets.slice();
            for (var i = 0; i < targets_copy.length; i += 2) {
                targets_copy[i + 1].apply(targets_copy[i], arguments);
            }
            return null;
        }
    };
    delegate.invoke = delegate;
    delegate._targets = targets;
    return delegate;
}
FB.Delegate.create = function Delegate$create(object, method) {
    if (!object) {
        return method;
    }
    return FB.Delegate._create([object, method]);
}
FB.Delegate.combine = function Delegate$combine(delegate1, delegate2) {
    if (!delegate1) {
        if (!delegate2._targets) {
            return FB.Delegate.create(null, delegate2);
        }
        return delegate2;
    }
    if (!delegate2) {
        if (!delegate1._targets) {
            return FB.Delegate.create(null, delegate1);
        }
        return delegate1;
    }
    var targets1 = delegate1._targets ? delegate1._targets : [null, delegate1];
    var targets2 = delegate2._targets ? delegate2._targets : [null, delegate2];
    return FB.Delegate._create(targets1.concat(targets2));
}
FB.Delegate.remove = function Delegate$remove(delegate1, delegate2) {
    if (!delegate1 || (delegate1 === delegate2)) {
        return null;
    }
    if (!delegate2) {
        return delegate1;
    }
    var targets = delegate1._targets;
    var object = null;
    var method;
    if (delegate2._targets) {
        object = delegate2._targets[0];
        method = delegate2._targets[1];
    }
    else {
        method = delegate2;
    }
    for (var i = 0; i < targets.length; i += 2) {
        if ((targets[i] === object) && (targets[i + 1] === method)) {
            if (targets.length == 2) {
                return null;
            }
            targets.splice(i, 2);
            return FB.Delegate._create(targets);
        }
    }
    return delegate1;
}
FB.ArrayEnumerator = function ArrayEnumerator$(array) {
    this._array = array;
    this._index = -1;
}
FB.ArrayEnumerator.prototype = {
    get_current: function () {
        return this._array[this._index];
    },
    moveNext: function () {
        this._index++;
        return (this._index < this._array.length);
    },
    reset: function () {
        this._index = -1;
    }
}
FB.Type.createClass2(FB.ArrayEnumerator);
FB.Type.createNamespace('FB');
FB.Sys = function () {}
FB.Sys.isUndefined = function (o) {
    return (o === undefined);
}
FB.Sys.isNullOrUndefined = function (o) {
    return (o === null) || (o === undefined);
}
FB.Sys.isNullOrEmpty = function (s) {
    return !s || !s.length;
}
FB.Sys.parseBool = function (s) {
    return (s.toLowerCase() == 'true');
}
FB.Sys.trim = function (s) {
    return s.replace(/^\s*|\s*$/g, '');
}
FB.Sys.compare = function (s1, s2, ignoreCase) {
    if (ignoreCase) {
        if (s1) {
            s1 = s1.toUpperCase();
        }
        if (s2) {
            s2 = s2.toUpperCase();
        }
    }
    s1 = s1 || '';
    s2 = s2 || '';
    if (s1 == s2) {
        return 0;
    }
    if (s1 < s2) {
        return -1;
    }
    return 1;
}
FB.Sys.quote = function (value) {
    var m = {
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '"': '\\"',
        '\\': '\\\\'
    };
    var a, i, k, l, r = /["\\\x00-\x1f\x7f-\x9f]/g,
    v;
    return r.test(value) ? '"' + value.replace(r, function (a) {
        var c = m[a];
        if (c) {
            return c;
        }
        c = a.charCodeAt();
        return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
    }) + '"' : '"' + value + '"';
}
FB.Sys.startsWith = function (s, substr) {
    return s.substring(0, substr.length) == substr;
}
FB.Sys.format = function (format) {
    if (!FB.Sys.format._formatRE) {
        FB.Sys.format._formatRE = /(\{[^\}^\{]+\})/g;
    }
    var values = arguments;
    if (!format) {
        return '';
    }
    return format.replace(FB.Sys.format._formatRE, function (str, m) {
        var index = parseInt(m.substr(1));
        var value = values[index + 1];
        if (FB.Sys.isNullOrUndefined(value)) {
            return '';
        }
        return value.toString();
    });
}
FB.Sys.htmlDecode = function (s) {
    htmlDecMap = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"'
    };
    htmlDecRE = /(&amp;|&lt;|&gt;|&quot;)/gi;
    s = s.replace(htmlDecRE, function (str, m) {
        return htmlDecMap[m];
    });
    return s;
}
FB.Sys.htmlEncode = function (s) {
    htmlEncMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;'
    };
    htmlEncRE = /([&<>"])/g;
    if (htmlEncRE.test(s)) {
        s = s.replace(htmlEncRE, function (str, m) {
            return htmlEncMap[m];
        });
    }
    return s;
}
FB.Sys.endsWith = function (s, substr) {
    return s.length >= substr.length && s.substring(s.length - substr.length) == substr;
}
FB.Sys.contains = function (a, item) {
    var index = FB.Sys.indexOf(a, item);
    return (index >= 0);
}
FB.Sys.add = function (a, item) {
    a[a.length] = item;
}
FB.Sys.remove = function (a, item) {
    var index = FB.Sys.indexOf(a, item);
    if (index >= 0) {
        a.splice(index, 1);
        return true;
    }
    return false;
}
FB.Sys.indexOf = function (a, item) {
    var length = a.length;
    if (length) {
        for (var index = 0; index < length; index++) {
            if (a[index] === item) {
                return index;
            }
        }
    }
    return -1;
}
FB.Sys.addRange = function (a, items) {
    var length = items.length;
    for (var index = 0; index < length; index++) {
        a[a.length] = items[index];
    }
}
FB.Sys.clear = function (a) {
    if (a.length > 0) {
        a.splice(0, a.length);
    }
}
FB.Sys.clearKeys = function (d) {
    for (var n in d) {
        delete d[n];
    }
}
FB.Sys.containsKey = function (d, key) {
    return d[key] !== undefined;
}
FB.Sys.getKeyCount = function (d) {
    var count = 0;
    for (var n in d) {
        count++;
    }
    return count;
}
FB.Sys.isAssignableFrom = function (from, to) {
    while (from != to) {
        if (from.__baseType) {
            from = from.__baseType;
        } else {
            return false;
        }
    }
    return true;
}
FB.Sys.createException = function (message, userData, innerException) {
    var e = new Error(message);
    if (userData) {
        e.userData = userData;
    }
    if (innerException) {
        e.innerException = innerException;
    }
    return e;
}
FB.Type.createClass2(FB.Sys);
FB.StringBuilder = FB.Type.createClass({
    ctor: function (s) {
        if ((s !== undefined) && (s !== null)) {
            this._parts = [s];
        }
        else {
            this._parts = [];
        }
    },
    instance: {
        get_isEmpty: function () {
            return (this._parts.length == 0);
        },
        append: function (s) {
            if ((s !== undefined) && (s !== null)) {
                FB.Sys.add(this._parts, s);
            }
        },
        appendLine: function (s) {
            this.append(s);
            this.append('\r\n');
        },
        clear: function () {
            this._parts.clear();
        },
        toString: function () {
            return this._parts.join('');
        }
    }
});
if (!window.Delegate) {
    window.Delegate = FB.Delegate;
}
FB.Type.createNamespace('FB');
FB.FeatureLoader = FB.Type.createClass({
    ctor: function () {
        this._loadedFeatures = {};
        this._requestedFeatures = {};
        this._scriptsToLoad = [];
        this._loadedStyleSheets = {};
    },
    static_ctor: function () {
        FB.FeatureLoader.singleton = new FB.FeatureLoader();
    },
    static: {
        onScriptLoaded: function (featuresLoaded) {
            FB.Type.runPendingInits();
            var singleton = FB.FeatureLoader.singleton;
            singleton._isWaiting = false;
            var loadedFeatures = singleton._loadedFeatures;
            var $enum1 = new FB.ArrayEnumerator(featuresLoaded);
            while ($enum1.moveNext()) {
                var featureLoaded = $enum1.get_current();
                FB.FBDebug.assert(!FB.Sys.containsKey(loadedFeatures, featureLoaded), 'Feature ' + featuresLoaded + ' was already loaded.');
                var info = singleton._getFeatureInfo(featureLoaded);
                if (info) {
                    singleton._loadedStyleSheetsForFeature(info);
                }
                loadedFeatures[featureLoaded] = true;
            }
            window.setTimeout(FB.Delegate.create(singleton, singleton.checkRequestQueue), 0);
        }
    },
    instance: {
        get_requestQueue: function () {
            return window.self.FB.Bootstrap.FeatureRequestQueue;
        },
        get_featureMap: function () {
            return window.self.FB.Bootstrap.FeatureMap;
        },
        get_customFeatureMap: function () {
            return FB.Bootstrap.CustomFeatureMap;
        },
        isFeatureRequestedAndLoaded: function (feature) {
            return FB.Sys.containsKey(this._loadedFeatures, feature) && FB.Sys.containsKey(this._requestedFeatures, feature);
        },
        _getFeatureInfo: function (feature) {
            var info = null;
            if (this.get_customFeatureMap()) {
                info = this.get_customFeatureMap()[feature];
            }
            if (!info) {
                info = this.get_featureMap()[feature];
            }
            return info;
        },
        _addFeature: function (feature) {
            var info = this._getFeatureInfo(feature);
            if (!info) {
                FB.FBDebug.logLine(1, 'Unknown feature: ' + feature);
            }
            else { if (info.dependencies) {
                    var $enum1 = new FB.ArrayEnumerator(info.dependencies);
                    while ($enum1.moveNext()) {
                        var dependentFeature = $enum1.get_current();
                        this._addFeature(dependentFeature);
                    }
                }
                if (!FB.Sys.containsKey(this._loadedFeatures, feature) && !FB.Sys.containsKey(this._requestedFeatures, feature) && !FB.Sys.contains(this._scriptsToLoad, info.src)) {
                    FB.Sys.add(this._scriptsToLoad, info.src);
                }
            }
        },
        checkRequestQueue: function () {
            var requestQueue = this.get_requestQueue();
            var $enum1 = new FB.ArrayEnumerator(requestQueue);
            while ($enum1.moveNext()) {
                var request = $enum1.get_current();
                if (!request.addedToScriptsQueue) {
                    var $enum2 = new FB.ArrayEnumerator(request.features);
                    while ($enum2.moveNext()) {
                        var feature = $enum2.get_current();
                        this._addFeature(feature);
                    }
                    request.addedToScriptsQueue = true;
                }
            }
            var filledRequests = [];
            for (var i = 0; i < requestQueue.length; i++) {
                var request = requestQueue[i];
                var loadedCount = 0;
                for (var j = 0; j < request.features.length; j++) {
                    var feature = request.features[j];
                    this._requestedFeatures[feature] = true;
                    if (FB.Sys.containsKey(this._loadedFeatures, feature)) {
                        loadedCount++;
                    }
                }
                if (loadedCount === request.features.length) {
                    FB.Sys.add(filledRequests, request);
                }
            }
            var $enum3 = new FB.ArrayEnumerator(filledRequests);
            while ($enum3.moveNext()) {
                var request = $enum3.get_current();
                FB.Sys.remove(requestQueue, request);
                if (request.callback) {
                    request.callback();
                }
            }
            this._loadNextScript();
        },
        _loadNextScript: function () {
            if (!this._isWaiting) {
                if (this._scriptsToLoad.length > 0) {
                    var src = this._scriptsToLoad[0];
                    this._scriptsToLoad.splice(0, 1);
                    this._isWaiting = true;
                    var scriptElement = document.createElement('script');
                    scriptElement.type = 'text/javascript';
                    scriptElement.src = src;
                    document.getElementsByTagName('HEAD')[0].appendChild(scriptElement);
                }
            }
        },
        _loadedStyleSheetsForFeature: function (info) {
            if (info.styleSheets) {
                var $enum1 = new FB.ArrayEnumerator(info.styleSheets);
                while ($enum1.moveNext()) {
                    var styleSheet = $enum1.get_current();
                    this._loadStyleSheet(styleSheet);
                }
            }
        },
        _loadStyleSheet: function (cssSrc) {
            if (!FB.Sys.containsKey(this._loadedStyleSheets, cssSrc)) {
                var linkElement = document.createElement('link');
                linkElement.setAttribute('rel', 'stylesheet');
                linkElement.setAttribute('type', 'text/css');
                linkElement.setAttribute('href', cssSrc);
                document.getElementsByTagName('head')[0].appendChild(linkElement);
                this._loadedStyleSheets[cssSrc] = true;
            }
        },
        _isWaiting: false
    }
});
FB.FeatureLoader.onScriptLoaded(['Base']);

FB.Type.createNamespace('FB');
FB.$create_Size = function FB_Size(w, h) {
    var $o = {};
    $o.w = w;
    $o.h = h;
    return $o;
}
FB.$create_Point = function FB_Point(x, y) {
    var $o = {};
    $o.x = x;
    $o.y = y;
    return $o;
}
FB.Waitable = FB.Type.createClass({
    ctor: function () {},
    instance: {
        onChange: function () {
            if (this.__changed) {
                this.__changed(this);
            }
        },
        waitUntilReady: function (callback) {
            if (this.get_isReady()) {
                callback(this.result);
            }
            else {
                var onReady = null;
                onReady = FB.Delegate.create(this, function (waitable) {
                    this.remove_changed(onReady);
                    callback(this.result);
                });
                this.add_changed(onReady);
            }
        },
        waitForValue: function (expectedValue, callback) {
            this.waitForCondition(FB.Delegate.create(this, function (waitable) {
                if (this.get_isReady() && this.result === expectedValue) {
                    callback();
                    return true;
                }
                return false;
            }));
        },
        waitForCondition: function (callback) {
            if (!callback(this)) {
                var onChange = null;
                onChange = FB.Delegate.create(this, function (waitable) {
                    if (callback(waitable)) {
                        this.remove_changed(onChange);
                    }
                });
                this.add_changed(onChange);
            }
        },
        resetChange: function () {
            this.__changed = null;
        },
        result: null,
        add_changed: function (value) {
            this.__changed = FB.Delegate.combine(this.__changed, value);
        },
        remove_changed: function (value) {
            this.__changed = FB.Delegate.remove(this.__changed, value);
        },
        __changed: null
    }
});
FB.SimpleWaitable = FB.Type.createClass({
    base: FB.Waitable,
    ctor: function () {
        FB.SimpleWaitable.constructBase(this);
    },
    instance: {
        get_isReady: function () {
            return this._isReady$1;
        },
        setResult: function (result, unsetReady) {
            var type = typeof(result);
            if (this._isReady$1 && !unsetReady && this.result === result && (type === 'undefined' || type === 'number' || type === 'string')) {
                return;
            }
            this.result = result;
            this._isReady$1 = (!unsetReady);
            this.onChange();
        },
        _isReady$1: false
    }
});
FB.DependentWaitable = FB.Type.createClass({
    base: FB.Waitable,
    ctor: function () {
        this._dependents$1 = [];
        FB.DependentWaitable.constructBase(this);
    },
    instance: {
        get_isReady: function () {
            return this._waitItems$1 <= 0;
        },
        addDependent: function (dependent) {
            if (!dependent.get_isReady()) {
                FB.Sys.add(this._dependents$1, dependent);
                this._waitItems$1++;
                dependent.add_changed(FB.Delegate.create(this, this._dependent_OnReady$1));
            }
        },
        removeAll: function () {
            var $enum1 = new FB.ArrayEnumerator(this._dependents$1);
            while ($enum1.moveNext()) {
                var dependent = $enum1.get_current();
                dependent.remove_changed(FB.Delegate.create(this, this._dependent_OnReady$1));
            }
            this._dependents$1 = [];
            this._waitItems$1 = 0;
        },
        _dependent_OnReady$1: function (waitable) {
            waitable.remove_changed(FB.Delegate.create(this, this._dependent_OnReady$1));
            this._waitItems$1--;
            if (!this._waitItems$1) {
                this.onChange();
            }
        },
        _waitItems$1: 0
    }
});
FB.Type.createNamespace('FBIntern');
FBIntern.HostName = FB.Type.createEnum({
    IE: 0,
    MOZILLA: 1,
    SAFARI: 2,
    OPERA: 3,
    OTHER: 4
},
false);
FBIntern.Cookie = FB.Type.createClass({
    ctor: function () {},
    static: {
        set: function (name, value, path, domain, days) {
            if (FB.Sys.isNullOrUndefined(value)) {
                value = '';
            }
            var cookie = name + '=' + encodeURIComponent(value) + ';';
            if (days) {
                var today = new Date();
                var expire = new Date(today.getTime() + 3600000 * 24 * days);
                cookie += 'expires=' + expire.toUTCString() + ';';
            }
            if (path) {
                cookie += 'path=' + path + ';';
            }
            if (domain) {
                cookie += 'domain=' + domain + ';';
            }
            document.cookie = cookie;
        },
        clear: function (name, path, domain) {
            FBIntern.Cookie.set(name, '', path, domain, -10);
        },
        getValue: function (name) {
            var nameEQ = name + '=';
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                c = FB.Sys.trim(c);
                if (!c.indexOf(nameEQ)) {
                    c = decodeURIComponent(c.substr(nameEQ.length));
                    return c;
                }
            }
            return null;
        }
    }
});
FBIntern.FbGlobals = FB.Type.createClass({
    ctor: function () {},
    static: {
        get_fB_StaticResourceVersions: function () {
            return FB.dynData ? FB.dynData['resources'] : {};
        }
    }
});
FBIntern.HostInfo = FB.Type.createClass({
    ctor: function () {
        var userAgent = window.navigator.userAgent.toLowerCase();
        var index;
        var version = null;
        if ((index = userAgent.indexOf('msie')) >= 0) {
            this._hostName = FBIntern.HostName.IE;
            version = userAgent.substr(index + 5);
        }
        else if ((index = userAgent.indexOf('firefox')) >= 0) {
            this._hostName = FBIntern.HostName.MOZILLA;
            version = userAgent.substr(index + 8);
        }
        else if ((index = userAgent.indexOf('safari')) >= 0) {
            this._hostName = FBIntern.HostName.SAFARI;
            version = userAgent.substr(index + 7);
        }
        else if ((index = userAgent.indexOf('gecko')) >= 0) {
            this._hostName = FBIntern.HostName.MOZILLA;
            version = window.navigator.appVersion;
        }
        else {
            this._hostName = FBIntern.HostName.OTHER;
        }
        if (version) {
            var verFloat = parseFloat(version);
            this.majorVersion = parseInt(verFloat);
            if ((index = version.indexOf('.')) >= 0) {
                this.minorVersion = parseInt(version.substr(index + 1));
            }
        }
    },
    instance: {
        get_hostName: function () {
            return this._hostName;
        },
        majorVersion: 0,
        minorVersion: 0,
        _hostName: 0
    }
});
FBIntern.AppInfo = FB.Type.createClass({
    ctor: function () {
        this._hostInfo = new FBIntern.HostInfo();
    },
    static_ctor: function () {
        FBIntern.AppInfo._current = null;
    },
    static: {
        get_singleton: function () {
            if (!FBIntern.AppInfo._current) {
                FBIntern.AppInfo._current = new FBIntern.AppInfo();
            }
            return FBIntern.AppInfo._current;
        }
    },
    instance: {
        get_hostInfo: function () {
            return this._hostInfo;
        },
        _hostInfo: null
    }
});
FBIntern.Uri = FB.Type.createClass({
    ctor: function (uriString) {
        this._uriString = uriString;
    },
    static: {
        create: function (baseUri, relativeUri) {
            var uri;
            if (FBIntern.Uri.isAbsoluteUri(relativeUri)) {
                uri = relativeUri;
            }
            else if (relativeUri.charAt(0) === '/') {
                uri = baseUri.get_schemeAndDomain() + relativeUri;
            }
            else {
                var i = baseUri.get_uriString().lastIndexOf('/');
                uri = baseUri.get_uriString().substr(0, i + 1) + relativeUri;
            }
            return new FBIntern.Uri(uri);
        },
        isAbsoluteUri: function (uri) {
            return uri.indexOf('://') > 0;
        },
        addQueryParameters: function (url, queryParameters) {
            if (url.indexOf('?') > 0) {
                return url + '&' + queryParameters;
            }
            else {
                return url + '?' + queryParameters;
            }
        },
        createQueryString: function (q_params) {
            var url = '';
            var $dict1 = q_params;
            for (var $key2 in $dict1) {
                var param = {
                    key: $key2,
                    value: $dict1[$key2]
                };
                url += param.key + '=' + encodeURIComponent((param.value)) + '&';
            }
            if (url !== '' && url.charAt(url.length - 1) === '&') {
                url = url.substr(0, url.length - 1);
            }
            return url;
        }
    },
    instance: {
        get_uriString: function () {
            return this._uriString;
        },
        get_pathAndQuery: function () {
            var i = this._uriString.indexOf('://');
            if (i >= 0) {
                i = this._uriString.indexOf('/', i + 3);
                if (i >= 0) {
                    return this._uriString.substr(i);
                }
            }
            return this._uriString;
        },
        get_schemeAndDomain: function () {
            var i = this._uriString.indexOf('http://');
            if (i) {
                i = this._uriString.indexOf('https://');
            }
            if (!i) {
                var pathIndex = this._uriString.indexOf('/', 8);
                if (pathIndex >= 0) {
                    return this._uriString.substr(0, pathIndex);
                }
                else {
                    return this._uriString;
                }
            }
            throw new Error('This object is not an absolute URI.');
        },
        get_queryParameters: function () {
            if (!this._queryParameters) {
                this._queryParameters = {};
                var queryString;
                var i = this._uriString.indexOf('?');
                if (i > -1) {
                    queryString = this._uriString.substr(i + 1);
                    i = queryString.indexOf('#');
                    if (i > 0) {
                        queryString = queryString.substring(0, i - 1);
                    }
                    var segments = queryString.split('&');
                    var $enum1 = new FB.ArrayEnumerator(segments);
                    while ($enum1.moveNext()) {
                        var segment = $enum1.get_current();
                        i = segment.indexOf('=');
                        if (i > 0) {
                            var key = segment.substr(0, i);
                            var value = segment.substr(i + 1);
                            this._queryParameters[key] = decodeURIComponent(value);
                        }
                    }
                }
            }
            return this._queryParameters;
        },
        _queryParameters: null,
        _uriString: null
    }
});
FBIntern.Utility = FB.Type.createClass({
    ctor: function () {},
    static: {
        getFacebookUrl: function (subDomain) {
            return FB.Sys.format(FBIntern.FbGlobals.get_fB_StaticResourceVersions()['base_url_format'], subDomain);
        },
        getNonConnectFacebookUrl: function (subDomain) {
            var baseUrlFormat = FBIntern.FbGlobals.get_fB_StaticResourceVersions()['base_url_format'];
            if (baseUrlFormat.indexOf('connect.facebook.com') >= 0) {
                var protocol = (!baseUrlFormat.indexOf('https')) ? 'https' : 'http';
                baseUrlFormat = protocol + '://{0}.facebook.com/';
                return FB.Sys.format(baseUrlFormat, subDomain);
            }
            else {
                return FBIntern.Utility.getFacebookUrl(subDomain);
            }
        },
        createFacebookUrl: function (subDomain, page, q_params, allowConnectSubdomain) {
            var url;
            if (allowConnectSubdomain) {
                url = FBIntern.Utility.getFacebookUrl(subDomain);
            }
            else {
                url = FBIntern.Utility.getNonConnectFacebookUrl(subDomain);
            }
            url += page;
            var locale = FB.locale;
            if (!FB.Sys.isNullOrEmpty(locale)) {
                q_params['locale'] = locale;
            }
            return FBIntern.Uri.addQueryParameters(url, FBIntern.Uri.createQueryString(q_params));
        },
        isSecure: function () {
            return window.location.href.indexOf('https') === 0;
        },
        id64BitEquals: function (id1, id2) {
            var val1 = '';
            var val2 = '';
            if (typeof(id1) === 'number') {
                if (id1 > 2147483647) {
                    FB.FBDebug.logLine(1, 'This integer is great than 32 bit and can\'t be properly in comparison in JavaScript. It should be stored as string instead.');
                }
                val1 = id1.toString();
            }
            else {
                val1 = id1;
            }
            if (typeof(id2) === 'number') {
                if (id2 > 2147483647) {
                    FB.FBDebug.logLine(1, 'This integer is great than 32 bit and can\'t be properly in comparison in JavaScript. It should be stored as string instead.');
                }
                val2 = id2.toString();
            }
            else {
                val2 = id2;
            }
            return !FB.Sys.compare(val1, val2, false);
        },
        waitForLoaded: function (domElement, callback) {
            var eventHandler = null;
            eventHandler = function (e) {
                FBIntern.Utility.removeEventListener(domElement, 'load', eventHandler);
                callback();
            };
            FBIntern.Utility.addEventListener(domElement, 'load', eventHandler);
        },
        get_windowLocation: function () {
            var location = FB.$create_Point(0, 0);
            var l, t;
            if (window.screenLeft) {
                l = window.screenLeft;
                t = window.screenTop;
            } else {
                l = window.screenX;
                t = window.screenY;
            }
            location.x = l;
            location.y = t;;
            if (FB.Sys.isUndefined(location.x)) {
                location.x = 0;
            }
            if (FB.Sys.isUndefined(location.y)) {
                location.y = 0;
            }
            return location;
        },
        get_windowSize: function () {
            var size = FB.$create_Size((window && window.innerWidth) || (document && document.documentElement && document.documentElement.clientWidth) || (document && document.body && document.body.clientWidth) || 0, (window && window.innerHeight) || (document && document.documentElement && document.documentElement.clientHeight) || (document && document.body && document.body.clientHeight) || 0);
            return size;
        },
        get_documentSize: function () {
            var s = FB.$create_Size(document.body.scrollWidth, document.body.scrollHeight);
            if (s.w <= 0 || s.w > document.documentElement.scrollWidth) {
                s.w = document.documentElement.scrollWidth;
            }
            if (s.h <= 0 || s.h > document.documentElement.scrollHeight) {
                s.h = document.documentElement.scrollHeight;
            }
            if (window && window.getComputedStyle) {
                var
                computed = window.getComputedStyle(document.body, null),
                h = parseInt(computed.getPropertyValue('height'), 10);
                if (h < s.h) {
                    s.h = h;
                }
            };
            return s;
        },
        get_isInUserActionCallstack: function () {
            var e = FBIntern.Utility.get_currentEvent();
            if (!e) {
                return false;
            }
            else {
                var userEventTypes = ['onclick', 'oncontextmenu', 'ondblclick', 'onfocus', 'onkeydown', 'onkeypress', 'onkeyup', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'click', 'ctextmenu', 'dblclick', 'focus', 'keydown', 'keypress', 'keyup', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup'];
                var eventType = e.type;
                return eventType && FB.Sys.contains(userEventTypes, eventType);
            }
        },
        get_currentEvent: function () {
            var e = window.event;
            if (!e && FBIntern.AppInfo.get_singleton().get_hostInfo().get_hostName() === FBIntern.HostName.MOZILLA) {
                var frame = arguments.callee;
                var frameList = [];
                var caller;
                while (true) {
                    FB.Sys.add(frameList, frame);
                    caller = frame.caller;
                    if (!caller) {
                        break;
                    }
                    if (FB.Sys.indexOf(frameList, caller) >= 0) {
                        FB.FBDebug.logLine(1, 'FB.Connect.get_isInUserActionCallstack(): we can\'t correctly make a detection because of recursion in call stack');
                        return null;
                    }
                    frame = caller;
                }
                e = frame.arguments.length == 1 && frame.arguments[0] && frame.arguments[0].type ? frame.arguments[0] : null;
            }
            return e;
        },
        addEventListener: function (element, type, handler) {
            if (FBIntern.AppInfo.get_singleton().get_hostInfo().get_hostName() !== FBIntern.HostName.IE) {
                (element).addEventListener(type, handler, false);
            }
            else {
                handler._ieEventHandler = function () {
                    handler(window.event);
                };
                (element).attachEvent('on' + type, (handler._ieEventHandler));
            }
        },
        removeEventListener: function (element, type, handler) {
            if (FBIntern.AppInfo.get_singleton().get_hostInfo().get_hostName() !== FBIntern.HostName.IE) {
                (element).removeEventListener(type, handler, false);
            }
            else {
                (element).detachEvent('on' + type, (handler._ieEventHandler));
            }
        },
        createXMLHttpRequest: function () {
            if (!FB.XMLHttpRequest) {
                if (!window.XMLHttpRequest) {
                    FB.XMLHttpRequest = function () {
                        var progIDs = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP'];
                        for (var i = 0; i < progIDs.length; i++) {
                            try {
                                var xmlHttp = new ActiveXObject(progIDs[i]);
                                return xmlHttp;
                            }
                            catch(ex) {}
                        }
                    };
                } else {
                    FB.XMLHttpRequest = window.XMLHttpRequest;
                }
            };
            return new FB.XMLHttpRequest();;
        },
        getIFrameDocument: function (iframeName, iframe, callback) {
            var frameWindow = (window.self.frames)[iframeName];
            var iframeDoc = null;
            if (window.location.hostname === document.domain) {
                try {
                    iframeDoc = frameWindow.document;
                }
                catch($e1) {
                    FB.FBDebug.logLine(1, 'Failed to get frameWindow.document, will try again later');
                }
            }
            if (iframeDoc) {
                callback(iframeDoc);
            }
            else {
                FBIntern.Utility.waitForLoaded(iframe, function () {
                    callback(frameWindow.document);
                });
            }
        },
        isConnectSession: function (sessionKey) {
            if (!sessionKey) {
                throw new Error('session key is null');
            }
            return sessionKey.substr(0, 2) === '3.';
        },
        isStrInt: function (x) {
            return parseInt(x).toString() === x;
        },
        createException: function (message, userData, innerException) {
            var exception = new Error(message);
            if (userData) {
                exception.userData = userData;
            }
            if (innerException) {
                exception.innerException = innerException;
            }
            return exception;
        },
        getSiteVar: function (key, defaultValue) {
            var dynData = FB.dynData;
            if (dynData) {
                var sitevars = dynData['site_vars'];
                if (FB.Sys.containsKey(sitevars, key)) {
                    return sitevars[key];
                }
            }
            return defaultValue;
        },
        setSiteVar: function (key, value) {
            var sitevars = FB.dynData['site_vars'];
            sitevars[key] = value;
        },
        paymentsLog: function (stepId, apiKey) {
            var qsParams = {
                step_id: stepId,
                api_key: apiKey
            };
            var baseUrl = FBIntern.Utility.getFacebookUrl('www') + '/connect/waterfall_log.php';
            var logUrl = FBIntern.Uri.addQueryParameters(baseUrl, FBIntern.Uri.createQueryString(qsParams));
            var root = FB.$('FB_HiddenContainer');
            FB.FBDebug.assert(root, 'Can\'t find the DOM element with id FB_HiddenContainer');
            var img = document.createElement('img');
            img.setAttribute('src', logUrl);
            root.appendChild(img);
        }
    }
});
FBIntern.Flash = FB.Type.createClass({
    ctor: function () {},
    static_ctor: function () {
        FBIntern.Flash.xdComm = null;
        FBIntern.Flash.curMajor = 0;
        FBIntern.Flash.curMinor = 0;
        FBIntern.Flash.versionDetected = false;
    },
    static: {
        hasRequireVersion: function () {
            return FBIntern.Flash._verifyMinimumVersion(9, 0);
        },
        _verifyMinimumVersion: function (major, minor) {
            if (!FBIntern.Flash.versionDetected) {
                var verArray = ['0', '0'];
                var isIE = FBIntern.AppInfo.get_singleton().get_hostInfo().get_hostName() === FBIntern.HostName.IE;
                var plugins = navigator.plugins;
                if (plugins && plugins.length > 0) {
                    if (plugins['Shockwave Flash 2.0'] || plugins['Shockwave Flash']) {
                        var description;
                        if (plugins['Shockwave Flash 2.0']) {
                            description = (plugins['Shockwave Flash 2.0'].description);
                        }
                        else {
                            description = (plugins['Shockwave Flash'].description);
                        }
                        var array1 = description.split(' ');
                        verArray = array1[2].split('.');
                    }
                }
                else if (isIE) {
                    var versionStr = null;
                    var activexObj;
                    try {
                        activexObj = new ActiveXObject('ShockwaveFlash.ShockwaveFlash.7');
                        versionStr = activexObj.GetVariable('$version');
                    }
                    catch($e1) {}
                    if (!verArray) {
                        try {
                            activexObj = new ActiveXObject('ShockwaveFlash.ShockwaveFlash.6');
                            versionStr = 'WIN 6,0,21,0';
                        }
                        catch($e2) {}
                    }
                    if (!FB.Sys.isNullOrEmpty(versionStr)) {
                        verArray = versionStr.split(' ')[1].split(',');
                    }
                }
                if (FBIntern.AppInfo.get_singleton().get_hostInfo().get_hostName() === FBIntern.HostName.MOZILLA) {
                    FB.FBDebug.logLine(1, 'Cannot use Flash on Firefox due to a possible bug in Flash');
                    FBIntern.Flash.curMajor = 0;
                    FBIntern.Flash.curMinor = 0;
                }
                else if (FBIntern.Utility.isSecure() && isIE) {
                    FB.FBDebug.logLine(1, 'Currenty, Flash is not used on IE in SSL pages');
                    FBIntern.Flash.curMajor = 0;
                    FBIntern.Flash.curMinor = 0;
                }
                else {
                    FBIntern.Flash.curMajor = parseInt(verArray[0]);
                    FBIntern.Flash.curMinor = parseInt(verArray[1]);
                }
                FBIntern.Flash.versionDetected = true;
            }
            return FBIntern.Flash.curMajor > major || (FBIntern.Flash.curMajor === major && FBIntern.Flash.curMinor >= minor);
        },
        _createFlashObject: function (id, srcUrl) {
            var html;
            if (FBIntern.AppInfo.get_singleton().get_hostInfo().get_hostName() === FBIntern.HostName.IE) {
                html = FB.Sys.format('<object width=\"1\" height=\"\"  id=\"{0}\" name=\"{1}\" type=\"application/x-shockwave-flash\" classid=\"clsid:d27cdb6e-ae6d-11cf-96b8-444553540000\" ><param name=\"movie\" value=\"{2}\" /> <param name=\"quality\" value=\"high\" /> <param name=\"bgcolor\" value=\"#869ca7\" /> <param name=\"allowScriptAccess\" value=\"always\" /> </object>', id, id, srcUrl);
            }
            else {
                html = FB.Sys.format('<embed width=\'1\' height=\'1\' type=\'application/x-shockwave-flash\' pluginspage=\'http://get.adobe.com/flashplayer\' allowscriptaccess=\'always\' name=\'{0}\' id=\'{1}\' bgcolor=\'#869ca7\' quality=\'high\'  src=\'{2}\' />', id, id, srcUrl);
            }
            var div = document.createElement('div');
            FB.$('FB_HiddenContainer').appendChild(div);
            div.innerHTML = html;
            if (FBIntern.AppInfo.get_singleton().get_hostInfo().get_hostName() === FBIntern.HostName.IE) {
                var parent = div.parentNode;
                while (parent && parent.tagName !== 'HTML') {
                    if (parent.tagName === 'FORM') {
                        window[id] = parent[id];
                        break;
                    }
                    parent = parent.parentNode;
                }
                return window[id];
            }
            else {
                return document[id];
            }
        },
        get_xdComm: function () {
            if (!FBIntern.Flash.xdComm && FBIntern.Flash.hasRequireVersion()) {
                FB.FBDebug.logLine(3, 'Create Flash XdComm object');
                FBIntern.Flash.xdComm = new FB.SimpleWaitable();
                var flashObj = null;
                var isReady = false;
                window.FB_OnFlashXdCommReady = function () {
                    FB.FBDebug.logLine(3, 'Flash XdComm ready');
                    isReady = true;
                    if (flashObj) {
                        FBIntern.Flash.xdComm.setResult(flashObj);
                    }
                };
                flashObj = FBIntern.Flash._createFlashObject('flashXdComm', FBIntern.FbGlobals.get_fB_StaticResourceVersions()['xd_comm_swf_url']);
                if (flashObj && isReady) {
                    FBIntern.Flash.xdComm.setResult(flashObj);
                }
            }
            return FBIntern.Flash.xdComm;
        },
        decode: function (data) {
            if (data && data.length && typeof data != "string") {
                data = data[0];
            }
            if (!data || typeof data != "string") {
                return data;
            }
            data = data.replace(/\&custom_lt\;/g, "<");
            data = data.replace(/\&custom_gt\;/g, ">");
            data = data.replace(/\&custom_backslash\;/g, '\\');
            data = data.replace(/\\0/g, "\0");;
            return data;
        }
    }
});
FB.Type.createNamespace('FB.UI');
FB.UI.DomResources = FB.Type.createClass({
    ctor: function () {},
    static_ctor: function () {
        FB.UI.DomResources._dicts = [];
    },
    static: {
        addResourceDict: function (dict) {
            FB.Sys.add(FB.UI.DomResources._dicts, dict);
        },
        getResourceById: function (id) {
            var c = FB.UI.DomResources._dicts.length;
            var element;
            for (var i = 0; i < c; i++) {
                element = ((FB.UI.DomResources._dicts[i])).getClonedElement(id);
                if (element) {
                    return element;
                }
            }
            return null;
        }
    }
});
FB.UI.DomResDict = FB.Type.createClass({
    ctor: function (resMarkup) {
        this._docFragment = document.createDocumentFragment();
        var root = document.createElement('div');
        root.innerHTML = resMarkup;
        this._docFragment.appendChild(root);
    },
    static: {
        _getElementInFragment: function (fragment, id) {
            if (FBIntern.AppInfo.get_singleton().get_hostInfo().get_hostName() === FBIntern.HostName.IE) {
                return fragment.getElementById(id);
            }
            else {
                var nodeQueue = [];
                var childNodes = fragment.childNodes;
                var node;
                var c;
                for (c = 0; c < childNodes.length; c++) {
                    node = childNodes[c];
                    if (node.nodeType == 1) {
                        nodeQueue[nodeQueue.length] = node;
                    }
                }
                while (nodeQueue.length) {
                    node = nodeQueue.shift();
                    if (node.id == id) {
                        return node;
                    }
                    childNodes = node.childNodes;
                    if (childNodes.length != 0) {
                        for (c = 0; c < childNodes.length; c++) {
                            node = childNodes[c];
                            if (node.nodeType == 1) {
                                nodeQueue.push(node);
                            }
                        }
                    }
                };
                return null;
            }
        }
    },
    instance: {
        getClonedElement: function (id) {
            var element = FB.UI.DomResDict._getElementInFragment(this._docFragment, 'RES_ID_' + id);
            if (element) {
                return element.cloneNode(true);
            }
            else {
                return null;
            }
        },
        _docFragment: null
    }
});
FB.JSON = function FB_JSON() {}
FB.JSON.deserialize = function (s, convert64bitIntToString) {
    if (FB.Sys.isNullOrEmpty(s)) {
        return null;
    }
    if (convert64bitIntToString) {
        if (!FB.JSON._64bitIntRegex) {
            FB.JSON._64bitIntRegex = new RegExp('([^\\\\]\"\:)([0-9]{11,20})(,|}|])', 'gm');
        }
        s = s.replace(FB.JSON._64bitIntRegex, '$1"$2"$3');
    }
    return eval('(' + s + ')');
}
FB.JSON.serialize = function (o) {
    if (FB.Sys.isNullOrUndefined(o)) {
        return '';
    }
    var sb = new FB.StringBuilder();
    FB.JSON._serializeCore(sb, o);
    return sb.toString();
}
FB.JSON._serializeCore = function (sb, o) {
    if (FB.Sys.isNullOrUndefined(o)) {
        sb.append('null');
        return;
    }
    var scriptType = typeof(o);
    switch (scriptType) {
    case 'boolean':
        sb.append(o.toString());
        return;
    case 'number':
        sb.append((isFinite(o)) ? o.toString() : 'null');
        return;
    case 'string':
        sb.append(FB.Sys.quote(o));
        return;
    case 'object':
        if (o instanceof Array) {
            sb.append('[');
            var a = o;
            var length = a.length;
            var first = true;
            for (var i = 0; i < length; i++) {
                if (typeof(a[i]) == 'function') {
                    continue;
                }
                if (first) {
                    first = false;
                }
                else {
                    sb.append(',');
                }
                FB.JSON._serializeCore(sb, a[i]);
            }
            sb.append(']');
        }
        else if (o instanceof Date) {
            var d = o;
            var utcValue = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds(), d.getUTCMilliseconds());
            sb.append('\"\\@');
            sb.append(utcValue.toString());
            sb.append('@\"');
        }
        else if (o instanceof RegExp) {
            sb.append(o.toString());
        }
        else {
            sb.append('{');
            var first = true;
            var $dict1 = o;
            for (var $key2 in $dict1) {
                var entry = {
                    key: $key2,
                    value: $dict1[$key2]
                };
                if (FB.Sys.startsWith(entry.key, '$')) {
                    continue;
                }
                if (typeof(entry.value) == 'function') {
                    continue;
                }
                if (first) {
                    first = false;
                }
                else {
                    sb.append(',');
                }
                sb.append('"' + entry.key + '"');
                sb.append(':');
                FB.JSON._serializeCore(sb, entry.value);
            }
            sb.append('}');
        }
        return;
    default:
        sb.append('null');
        return;
    }
}
FBIntern.Intl = function FBIntern_Intl() {}
FBIntern.Intl._tx = function FBIntern_Intl$_tx(str, args) {
    function intl_ends_in_punct(str) {
        if (typeof str != 'string') {
            return false;
        }
        return str.match(new RegExp(intl_ends_in_punct.punct_char_class + '[' + ')"' + "'" + '\u00BB' + '\u0F3B' + '\u0F3D' + '\u2019' + '\u201D' + '\u203A' + '\u3009' + '\u300B' + '\u300D' + '\u300F' + '\u3011' + '\u3015' + '\u3017' + '\u3019' + '\u301B' + '\u301E' + '\u301F' + '\uFD3F' + '\uFF07' + '\uFF09' + '\uFF3D' + '\s' + ']*$'));
    }
    intl_ends_in_punct.punct_char_class = '[' + '.!?' + '\u3002' + '\uFF01' + '\uFF1F' + '\u0964' + '\u2026' + '\u0EAF' + '\u1801' + '\u0E2F' + '\uFF0E' + ']';
    function intl_phonological_rules(str) {
        var rules = window.intl_locale_rewrites;
        var regexp;
        if (rules !== undefined) {
            var pats = [];
            var reps = [];
            for (var p in rules['patterns']) {
                var pat = p;
                var rep = rules['patterns'][p];
                for (var m in rules['meta']) {
                    regexp = new RegExp(m.slice(1, -1), 'g');
                    pat = pat.replace(regexp, rules['meta'][m]);
                    rep = rep.replace(regexp, rules['meta'][m]);
                }
                regexp = new RegExp("\\+", 'g');
                pats[pats.length] = pat.replace(regexp, '\x01');
                reps[reps.length] = rep.replace(regexp, '\x01');
            }
            for (var ii = 0; ii < pats.length; ii++) {
                regexp = new RegExp(pats[ii].slice(1, -1), 'g');
                str = str.replace(regexp, reps[ii]);
            }
        }
        regexp = new RegExp('\x01', 'g');
        str = str.replace(regexp, '');
        return str;
    }
    if (args !== undefined) {
        if (typeof args != 'object') {
            FB.Debug.writeLine('intl.js: the 2nd argument must be a keyed array (not a string) for tx(' + str + ', ...)');
        } else {
            var regexp;
            for (var key in args) {
                if (intl_ends_in_punct(args[key])) {
                    regexp = new RegExp('\{' + key + '\}' + intl_ends_in_punct.punct_char_class + '*', 'g');
                } else {
                    regexp = new RegExp('\{' + key + '\}', 'g');
                }
                str = str.replace(regexp, '\x01' + args[key] + '\x01');
            }
            str = intl_phonological_rules(str);
        }
    }
    return str;
}
FBIntern.Intl.tx = function FBIntern_Intl$tx(string, object) {
    function tx(str, args) {
        if (typeof _string_table == 'undefined') {
            return null;
        }
        str = _string_table[str];
        return FBIntern.Intl._tx(str, args);
    }
}
FB.Type.createClass('FBIntern.Md5', {
    requires: [],
    ctor: function () {},
    static: {
        computeHashToString: function (string) {
            function RotateLeft(lValue, iShiftBits) {
                return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
            }
            function AddUnsigned(lX, lY) {
                var lX4, lY4, lX8, lY8, lResult;
                lX8 = (lX & 0x80000000);
                lY8 = (lY & 0x80000000);
                lX4 = (lX & 0x40000000);
                lY4 = (lY & 0x40000000);
                lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
                if (lX4 & lY4) {
                    return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
                }
                if (lX4 | lY4) {
                    if (lResult & 0x40000000) {
                        return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                    } else {
                        return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
                    }
                } else {
                    return (lResult ^ lX8 ^ lY8);
                }
            }
            function F(x, y, z) {
                return (x & y) | ((~x) & z);
            }
            function G(x, y, z) {
                return (x & z) | (y & (~z));
            }
            function H(x, y, z) {
                return (x ^ y ^ z);
            }
            function I(x, y, z) {
                return (y ^ (x | (~z)));
            }
            function FF(a, b, c, d, x, s, ac) {
                a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
                return AddUnsigned(RotateLeft(a, s), b);
            };
            function GG(a, b, c, d, x, s, ac) {
                a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
                return AddUnsigned(RotateLeft(a, s), b);
            };
            function HH(a, b, c, d, x, s, ac) {
                a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
                return AddUnsigned(RotateLeft(a, s), b);
            };
            function II(a, b, c, d, x, s, ac) {
                a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
                return AddUnsigned(RotateLeft(a, s), b);
            };
            function ConvertToWordArray(string) {
                var lWordCount;
                var lMessageLength = string.length;
                var lNumberOfWords_temp1 = lMessageLength + 8;
                var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
                var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
                var lWordArray = Array(lNumberOfWords - 1);
                var lBytePosition = 0;
                var lByteCount = 0;
                while (lByteCount < lMessageLength) {
                    lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                    lBytePosition = (lByteCount % 4) * 8;
                    lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
                    lByteCount++;
                }
                lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                lBytePosition = (lByteCount % 4) * 8;
                lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
                lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
                lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
                return lWordArray;
            };
            function WordToHex(lValue) {
                var WordToHexValue = "",
                WordToHexValue_temp = "",
                lByte, lCount;
                for (lCount = 0; lCount <= 3; lCount++) {
                    lByte = (lValue >>> (lCount * 8)) & 255;
                    WordToHexValue_temp = "0" + lByte.toString(16);
                    WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
                }
                return WordToHexValue;
            };
            function Utf8Encode(string) {
                string = string.replace(/\r\n/g, "\n");
                var utftext = "";
                for (var n = 0; n < string.length; n++) {
                    var c = string.charCodeAt(n);
                    if (c < 128) {
                        utftext += String.fromCharCode(c);
                    }
                    else if ((c > 127) && (c < 2048)) {
                        utftext += String.fromCharCode((c >> 6) | 192);
                        utftext += String.fromCharCode((c & 63) | 128);
                    }
                    else {
                        utftext += String.fromCharCode((c >> 12) | 224);
                        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                        utftext += String.fromCharCode((c & 63) | 128);
                    }
                }
                return utftext;
            };
            var x = Array();
            var k, AA, BB, CC, DD, a, b, c, d;
            var S11 = 7,
            S12 = 12,
            S13 = 17,
            S14 = 22;
            var S21 = 5,
            S22 = 9,
            S23 = 14,
            S24 = 20;
            var S31 = 4,
            S32 = 11,
            S33 = 16,
            S34 = 23;
            var S41 = 6,
            S42 = 10,
            S43 = 15,
            S44 = 21;
            string = Utf8Encode(string);
            x = ConvertToWordArray(string);
            a = 0x67452301;
            b = 0xEFCDAB89;
            c = 0x98BADCFE;
            d = 0x10325476;
            for (k = 0; k < x.length; k += 16) {
                AA = a;
                BB = b;
                CC = c;
                DD = d;
                a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
                d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
                c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
                b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
                a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
                d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
                c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
                b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
                a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
                d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
                c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
                b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
                a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
                d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
                c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
                b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
                a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
                d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
                c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
                b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
                a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
                d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
                c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
                b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
                a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
                d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
                c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
                b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
                a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
                d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
                c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
                b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
                a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
                d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
                c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
                b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
                a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
                d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
                c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
                b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
                a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
                d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
                c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
                b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
                a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
                d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
                c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
                b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
                a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
                d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
                c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
                b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
                a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
                d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
                c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
                b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
                a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
                d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
                c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
                b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
                a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
                d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
                c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
                b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
                a = AddUnsigned(a, AA);
                b = AddUnsigned(b, BB);
                c = AddUnsigned(c, CC);
                d = AddUnsigned(d, DD);
            }
            var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);
            return temp.toLowerCase();
        }
    }
});
FB.FeatureLoader.onScriptLoaded(['Common']);

FB.Type.createNamespace('FB');
FB.$create_XdHttpRequestResult = function FB_XdHttpRequestResult(id, status, statusText, responseText) {
    var $o = {};
    $o.status = status;
    $o.statusText = statusText;
    $o.responseText = responseText;
    $o.id = id;
    return $o;
}
FB.Type.createNamespace('FB.XdComm');
FB.XdComm.$create__packet = function FB_XdComm__packet() {
    return {};
}
FB.XdComm._packetType = FB.Type.createEnum({
    data: 0,
    dataFragment: 1,
    dataFragmentEnd: 2,
    udpSingle: 3,
    ack: 4
},
false);
FB.XdComm.PacketDataFormat = FB.Type.createEnum({
    JSON: 0,
    rawText: 1,
    OBJ: 2
},
false);
FB.XdComm.PageRelation = FB.Type.createEnum({
    parent: 1,
    child: 2,
    self: 3,
    opener: 4,
    openee: 5
},
false);
FB.XdComm.$create_XdRpcMethodInfo = function FB_XdComm_XdRpcMethodInfo(method, asyncMethod) {
    var $o = {};
    FB.FBDebug.assert((!method) ^ (!asyncMethod), 'One and only one of method or asyncMethod parameters must not be null.');
    $o.method = method;
    $o.asyncMethod = asyncMethod;
    return $o;
}
FB.XdComm._receiveChannel = FB.Type.createClass({
    ctor: function (id, endPoint) {
        this._fragDataDict = {};
        this._ackList = [];
        this._id = id;
        this._endPoint = endPoint;
    },
    instance: {
        _onReceivedPacket: function (packet) {
            FB.FBDebug.logLine(3, 'XdComm: Received packet');
            var fullPacket = null;
            if (packet.t === FB.XdComm._packetType.dataFragment || packet.t === FB.XdComm._packetType.dataFragmentEnd) {
                var holder = this._fragDataDict[packet.id.toString()];
                if (!holder) {
                    holder = new FB.XdComm._fragDataHolder();
                    this._fragDataDict[packet.id.toString()] = holder;
                }
                fullPacket = holder._addSegment(packet);
                if (fullPacket) {
                    delete this._fragDataDict[fullPacket.id.toString()];
                }
            }
            else {
                fullPacket = packet;
            }
            if (fullPacket) {
                if (!fullPacket.id) {
                    this._endPoint = new FB.XdComm.EndPoint(fullPacket.sf, fullPacket.sr, fullPacket.sc);
                    if (this._queuedPackets) {
                        var $enum1 = new FB.ArrayEnumerator(this._queuedPackets);
                        while ($enum1.moveNext()) {
                            var queuedPacket = $enum1.get_current();
                            this._onFullDataReceived(queuedPacket);
                        }
                        this._queuedPackets = null;
                    }
                }
                if (this._endPoint) {
                    this._onFullDataReceived(fullPacket);
                }
                else { if (!this._queuedPackets) {
                        this._queuedPackets = [];
                        FB.Sys.add(this._queuedPackets, fullPacket);
                    }
                }
            }
        },
        _onFullDataReceived: function (packet) {
            var server = FB.XdComm.Server.singleton;
            server._onFullDataReceived(packet, this._endPoint);
            FB.Sys.add(this._ackList, packet.id);
            if (this._ackList.length > 5) {
                if (FB.FBDebug.logLevel > 4) {
                    FB.FBDebug.writeLine('ReceiveChannel.Ack: ' + this._ackList.toString());
                }
                var ackPacket = FB.XdComm.$create__packet();
                ackPacket.t = FB.XdComm._packetType.ack;
                ackPacket.sid = server._id;
                ackPacket.sc = server.get_receiverUrl();
                ackPacket.sf = window.name;
                ackPacket.sr = FB.XdComm._sendChannel._getReverseRelation(this._endPoint.relation);
                var ackIframeSrc = server._createPacketUrl(ackPacket, this._endPoint);
                ackIframeSrc += encodeURIComponent(FB.JSON.serialize(this._ackList));
                server._removeIframe(this._ackIframe);
                this._ackIframe = server._createHiddenIFrame(ackIframeSrc);
                FB.Sys.clear(this._ackList);
            }
        },
        _queuedPackets: null,
        _endPoint: null,
        _ackIframe: null,
        _id: null
    }
});
FB.XdComm._fragDataHolder = FB.Type.createClass({
    ctor: function () {
        this._segments = {};
        this._totalSegments = -1;
    },
    instance: {
        _addSegment: function (packet) {
            if (packet.t === FB.XdComm._packetType.dataFragmentEnd) {
                this._totalSegments = packet.fid + 1;
            }
            if (!packet.fid) {
                this._combinedPacket = packet;
            }
            this._segments[packet.fid.toString()] = packet.d;
            if (this._totalSegments !== -1 && this._totalSegments === FB.Sys.getKeyCount(this._segments)) {
                var builder = new FB.StringBuilder();
                for (var i = 0; i < this._totalSegments; i++) {
                    builder.append(this._segments[i.toString()]);
                }
                this._combinedPacket.d = builder.toString();
                this._combinedPacket.t = FB.XdComm._packetType.data;
                return this._combinedPacket;
            }
            else {
                return null;
            }
        },
        _combinedPacket: null
    }
});
FB.XdComm._sendChannel = FB.Type.createClass({
    ctor: function (endPoint) {
        this._iframes = {};
        this._endPoint = endPoint;
    },
    static: {
        _getReverseRelation: function (relation) {
            switch (relation) {
            case FB.XdComm.PageRelation.child:
                return FB.XdComm.PageRelation.parent;
            case FB.XdComm.PageRelation.parent:
                return FB.XdComm.PageRelation.child;
            case FB.XdComm.PageRelation.self:
                return FB.XdComm.PageRelation.self;
            case FB.XdComm.PageRelation.opener:
                return FB.XdComm.PageRelation.openee;
            default:
                throw new Error('Unknown relation');
            }
        }
    },
    instance: {
        _send: function (handlerName, data) {
            var server = FB.XdComm.Server.singleton;
            var serializedData = FB.JSON.serialize(data);
            var dataLength = serializedData.length;
            var offset = 0;
            var sendComplete = false;
            var fid = 0;
            while (!sendComplete) {
                var type = FB.XdComm._packetType.data;
                var packet = FB.XdComm.$create__packet();
                packet.id = this._sendIdCount;
                if (!this._sendIdCount && !offset) {
                    packet.sc = server.get_receiverUrl();
                    packet.sf = window.name;
                    packet.sr = FB.XdComm._sendChannel._getReverseRelation(this._endPoint.relation);
                }
                if (!offset) {
                    packet.h = handlerName;
                }
                var packetData;
                if (!offset && dataLength <= server._maxPacketDataLength) {
                    packetData = serializedData;
                    sendComplete = true;
                }
                else {
                    packet.fid = fid++;
                    var packetLength = dataLength - offset;
                    if (packetLength > server._maxPacketDataLength) {
                        packetLength = server._maxPacketDataLength;
                        type = FB.XdComm._packetType.dataFragment;
                    }
                    else {
                        type = FB.XdComm._packetType.dataFragmentEnd;
                        sendComplete = true;
                    }
                    packetData = serializedData.substr(offset, packetLength);
                    offset += packetLength;
                }
                packet.sid = server._id;
                packet.t = type;
                var iframeSrc = server._createPacketUrl(packet, this._endPoint);
                iframeSrc += encodeURIComponent(packetData);
                this._addIframe(iframeSrc, packet);
            }
            this._sendIdCount++;
        },
        _onAck: function (ackedPacketIds) {
            if (FB.FBDebug.logLevel > 4) {
                FB.FBDebug.writeLine('SendChannel.OnAck: ' + ackedPacketIds.toString());
            }
            var $enum1 = new FB.ArrayEnumerator(ackedPacketIds);
            while ($enum1.moveNext()) {
                var ackedPacketId = $enum1.get_current();
                var key = ackedPacketId.toString();
                var list = this._iframes[key];
                var $enum2 = new FB.ArrayEnumerator(list);
                while ($enum2.moveNext()) {
                    var iframe = $enum2.get_current();
                    FB.XdComm.Server.singleton._removeIframe(iframe);
                }
                delete this._iframes[key];
            }
        },
        _addIframe: function (iframeSrc, packet) {
            var iframe = FB.XdComm.Server.singleton._createHiddenIFrame(iframeSrc);
            var key = packet.id.toString();
            var list = this._iframes[key];
            if (!list) {
                this._iframes[key] = list = [];
            }
            FB.Sys.add(list, iframe);
        },
        _sendIdCount: 0,
        _endPoint: null
    }
});
FB.XdComm.EndPoint = FB.Type.createClass({
    ctor: function (frameName, relation, channelUrl) {
        this.frameName = (!frameName) ? '' : frameName;
        this.relation = relation;
        this.channelUrl = channelUrl;
        this.UID = 0;
    },
    instance: {
        isEqual: function (x) {
            return x.frameName === this.frameName && x.relation === this.relation && x.UID === this.UID;
        },
        get_xdCommID: function () {
            if (!this._xdCommID && (this.relation === FB.XdComm.PageRelation.parent || this.relation === FB.XdComm.PageRelation.opener)) {
                this._xdCommID = FB.XdComm.Server.singleton.get_xdCommID().substr(0, FB.XdComm.Server.singleton.get_xdCommID().lastIndexOf(':'));
            }
            return this._xdCommID;
        },
        set_xdCommID: function (value) {
            this._xdCommID = value;
            return value;
        },
        frameName: null,
        relation: 0,
        channelUrl: null,
        UID: 0,
        _xdCommID: null,
        origin: null
    }
});
FB.XdComm.Server = FB.Type.createClass({
    ctor: function () {
        this._sendChannels = [];
        this._receiveChannels = [];
        this._handlers = {};
        this._dataRequestQueues = {};
        this._nativeXdState = -1;
        this._flashXdState = -1;
        this._nativeMsgsSendQueue = {};
        this._nativeMsgsReceiveQueue = {};
        this._id = Math.random().toString().substr(0, 5);
        FB.FBDebug.logLine(2, 'Init XdComm.Server with ID ' + this._id + ' for ' + document.URL);
        switch (FBIntern.AppInfo.get_singleton().get_hostInfo().get_hostName()) {
        case FBIntern.HostName.IE:
            this._maxPacketDataLength = 1024;
            break;
        case FBIntern.HostName.MOZILLA:
            this._maxPacketDataLength = 100000;
            break;
        case FBIntern.HostName.SAFARI:
            this._maxPacketDataLength = 100000;
            break;
        case FBIntern.HostName.OPERA:
            this._maxPacketDataLength = 190000;
            break;
        default:
            this._maxPacketDataLength = 1024;
            break;
        }
        if (this.get__useNativeXd()) {
            FBIntern.Utility.addEventListener(window.self, 'message', FB.Delegate.create(this, this._onMessageEvent));
        }
    },
    static_ctor: function () {
        FB.XdComm.Server.singleton = new FB.XdComm.Server();
        FB.XdComm.Server.postMessageHeader = 'FB_msg:';
        FB.XdComm.Server.postMessageAckHeader = 'FB_msg_ack:';
    },
    static: {
        init: function (receiverUrl) {
            FB.XdComm.Server.singleton.set_receiverUrl(receiverUrl);
        },
        registerSimpleHandler: function (handlerName, callback) {
            if (!FB.XdComm.Server.singleton.isDataHandlerRegistered(handlerName)) {
                FB.XdComm.Server.singleton.registerDataHandler(handlerName, function (data, endpoint) {
                    callback(data);
                });
            }
        }
    },
    instance: {
        get_receiverUrl: function () {
            return this._receiverUrl;
        },
        set_receiverUrl: function (value) {
            if (!value) {
                FB.FBDebug.logLine(0, 'Cross Domain Channel cannot be null. We will use the current page as cross domain channel, but it would be inefficient');
                value = FB.Bootstrap.createDefaultXdChannelUrl();
            }
            var uri = FBIntern.Uri.create(new FBIntern.Uri(document.URL), value);
            if (window.location.hostname !== document.domain) {
                FB.FBDebug.logLine(2, 'You appear to have changed the document.domain property.\nIf you run into problems with the Facebook Connect library, please refer to\n http://wiki.developers.facebook.com/index.php/How_To_Support_Subdomain_In_Connect for\nhelp.');
            }
            this._receiverUrl = uri.get_uriString();
            return value;
        },
        get_xdCommID: function () {
            if (!this.get__useFlashXd()) {
                return null;
            }
            if (!this._xdCommId) {
                var xdCommId;
                if (this._receiverUrl) {
                    xdCommId = this._receiverUrl;
                }
                else {
                    xdCommId = window.location.protocol + '//' + document.domain;
                }
                this.set_xdCommID(xdCommId + '/:' + Math.random().toString());
            }
            return this._xdCommId;
        },
        set_xdCommID: function (value) {
            this._xdCommId = value;
            if (this.get__useFlashXd()) {
                FBIntern.Flash.get_xdComm().waitUntilReady(FB.Delegate.create(this, function (result) {
                    var flashXdComm = result;
                    window.FB_ReceiveFlashMessage = FB.Delegate.create(this, function (m) {
                        this._receiveFlashMessage(m);
                    });
                    flashXdComm.postMessage_init('FB_ReceiveFlashMessage', value);
                }));
            }
            return value;
        },
        send: function (endPoint, handlerName, data) {
            if (FB.FBDebug.logLevel > 2) {
                FB.FBDebug.writeLine('<<<<<<< ' + document.URL);
                FB.FBDebug.writeLine('Server.send: handler=' + handlerName);
                FB.FBDebug.dump(data, 'data');
                FB.FBDebug.dump(endPoint, 'endPoint');
            }
            if (this.get__useNativeXd()) {
                this._postMessage(endPoint, handlerName, data);
            }
            else if (this.get__useFlashXd()) {
                this._sendWithFlash(endPoint, handlerName, data);
            }
            else {
                this._sendWithIframe(endPoint, handlerName, data);
            }
        },
        _sendWithIframe: function (endPoint, handlerName, data) {
            var channel = null;
            var $enum1 = new FB.ArrayEnumerator(this._sendChannels);
            while ($enum1.moveNext()) {
                var item = $enum1.get_current();
                if (endPoint.isEqual(item._endPoint)) {
                    channel = item;
                }
            }
            if (!channel) {
                channel = new FB.XdComm._sendChannel(endPoint);
                FB.Sys.add(this._sendChannels, channel);
            }
            channel._send(handlerName, data);
        },
        _postMessage: function (endPoint, handlerName, data) {
            var packet = this._prepareMessagePacket(endPoint, handlerName, data);
            var targetWindow;
            switch (endPoint.relation) {
            case FB.XdComm.PageRelation.child:
                targetWindow = window.frames[endPoint.frameName];
                break;
            case FB.XdComm.PageRelation.opener:
                targetWindow = window.opener;
                break;
            case FB.XdComm.PageRelation.parent:
                targetWindow = window.parent;
                break;
            default:
                throw new Error('Can\'t send message to endpoint with type = ' + FB.Enum.toString(FB.XdComm.PageRelation, endPoint.relation));
            }
            var message = FB.XdComm.Server.postMessageHeader + FB.JSON.serialize(packet);
            var origin = (endPoint.origin) ? endPoint.origin : '*';
            this._retrySender(packet.id.toString(), FB.Delegate.create(this, function () {
                targetWindow.postMessage(message, origin);
            }));
        },
        _sendWithFlash: function (endPoint, handlerName, data) {
            var packet = this._prepareMessagePacket(endPoint, handlerName, data);
            var message = FB.XdComm.Server.postMessageHeader + FB.JSON.serialize(packet);
            FBIntern.Flash.get_xdComm().waitUntilReady(FB.Delegate.create(this, function (result) {
                var flashXdComm = result;
                this._retrySender(packet.id.toString(), FB.Delegate.create(this, function () {
                    flashXdComm.postMessage_send(endPoint.get_xdCommID(), message);
                }));
            }));
        },
        _prepareMessagePacket: function (endPoint, handlerName, data) {
            var packet = FB.XdComm.$create__packet();
            packet.sc = this.get_receiverUrl();
            packet.sf = window.name;
            packet.sr = FB.XdComm._sendChannel._getReverseRelation(endPoint.relation);
            packet.h = handlerName;
            packet.nd = data;
            packet.df = FB.XdComm.PacketDataFormat.OBJ;
            packet.id = this._nativeMsgId;
            packet.sid = this._id;
            if (this.get__useFlashXd()) {
                packet.sxid = this.get_xdCommID();
            }
            this._nativeMsgId++;
            return packet;
        },
        _retrySender: function (id, cb) {
            var tries = 1;
            var timerId = -1;
            var sendMessageCallback = FB.Delegate.create(this, function () {
                FB.FBDebug.logLine(2, 'RetrySender ' + tries.toString() + 'rd try');
                tries++;
                if (tries < 100) {
                    cb();
                }
                else {
                    window.clearInterval(timerId);
                    FB.FBDebug.logLine(0, 'Message couldn\'t be delivered: id' + id);
                    delete this._nativeMsgsSendQueue[id];
                }
            });
            sendMessageCallback();
            timerId = window.setInterval(sendMessageCallback, 500);
            this._nativeMsgsSendQueue[id] = timerId;
        },
        _handleAckMessage: function (message) {
            message = message.substr(FB.XdComm.Server.postMessageAckHeader.length);
            if (!message.indexOf(this._id)) {
                var packetId = parseInt(message.substr(this._id.length));
                var timerId = this._nativeMsgsSendQueue[packetId.toString()];
                if (timerId) {
                    delete this._nativeMsgsSendQueue[packetId.toString()];
                    window.clearInterval(timerId);
                }
            }
            else {
                FB.FBDebug.logLine(0, 'Ignore XdComm Ack message because send id does not match');
            }
        },
        _onMessageEvent: function (e) {
            var message = e.data;
            if (!message.indexOf(FB.XdComm.Server.postMessageHeader)) {
                message = message.substr(FB.XdComm.Server.postMessageHeader.length);
                var packet = FB.JSON.deserialize(message);
                var origin = new FBIntern.Uri(e.origin);
                var xdReceiver = new FBIntern.Uri(packet.sc);
                var ackMsg = FB.XdComm.Server.postMessageAckHeader + packet.sid + packet.id.toString();
                ((e.source)).postMessage(ackMsg, e.origin);
                var receiveId = packet.sid + packet.id.toString();
                if (!this._nativeMsgsReceiveQueue[receiveId]) {
                    this._nativeMsgsReceiveQueue[receiveId] = true;
                    var sender = new FB.XdComm.EndPoint(packet.sf, packet.sr, packet.sc);
                    this._ensureReceiveChannel(packet.sid, sender);
                    this._onFullDataReceived(packet, sender);
                }
            }
            else if (!message.indexOf(FB.XdComm.Server.postMessageAckHeader)) {
                this._handleAckMessage(message);
            }
        },
        _receiveFlashMessage: function (message) {
            message = decodeURIComponent(message);
            if (!message.indexOf(FB.XdComm.Server.postMessageAckHeader)) {
                this._handleAckMessage(message);
                return;
            }
            else if (message.indexOf(FB.XdComm.Server.postMessageHeader)) {
                FB.FBDebug.logLine(3, 'Ignoring message with unknown header.');
                return;
            }
            message = message.substr(FB.XdComm.Server.postMessageHeader.length);
            var packet = FB.JSON.deserialize(message);
            var sender = new FB.XdComm.EndPoint(packet.sf, packet.sr, packet.sc);
            var receiveId = packet.sid + packet.id.toString();
            if (this._nativeMsgsReceiveQueue[receiveId]) {
                return;
            }
            this._nativeMsgsReceiveQueue[receiveId] = true;
            FBIntern.Flash.get_xdComm().waitUntilReady(FB.Delegate.create(this, function (result) {
                var ackMsg = FB.XdComm.Server.postMessageAckHeader + receiveId;
                var flashXdComm = result;
                flashXdComm.postMessage_send(packet.sxid, ackMsg);
            }));
            this._ensureReceiveChannel(packet.sid, sender);
            this._onFullDataReceived(packet, sender);
        },
        createUdpUrl: function (handlerName, data, endPoint) {
            return this._createUdpUrlWithFormat(handlerName, data, endPoint, FB.XdComm.PacketDataFormat.JSON);
        },
        createUdpUrlWithRawText: function (handlerName, data, endPoint) {
            return this._createUdpUrlWithFormat(handlerName, data, endPoint, FB.XdComm.PacketDataFormat.rawText);
        },
        _createUdpUrlWithFormat: function (handlerName, data, endPoint, dataFormat) {
            var packet = FB.XdComm.$create__packet();
            packet.t = FB.XdComm._packetType.udpSingle;
            packet.h = handlerName;
            packet.sid = this._id;
            if (dataFormat !== FB.XdComm.PacketDataFormat.JSON) {
                packet.df = dataFormat;
            }
            var url = this._createPacketUrl(packet, endPoint);
            var packetData = FB.JSON.serialize(data);
            if (packetData.length > this._maxPacketDataLength) {
                throw new Error('data length is too long');
            }
            url += encodeURIComponent(packetData);
            return url;
        },
        unregisterDataHandler: function (handlerName) {
            FB.FBDebug.logLine(2, 'Unregister data handler ' + handlerName);
            if (!FB.Sys.containsKey(this._handlers, handlerName)) {
                throw new Error('Handler doesn\'t exist');
            }
            delete this._handlers[handlerName];
        },
        getUniqueHandlerName: function (prefix) {
            if (!prefix) {
                prefix = 'handler_';
            }
            var i = 0;
            var handlerName = prefix + i.toString();
            while (FB.Sys.containsKey(this._handlers, handlerName)) {
                i++;
                handlerName = prefix + i.toString();
            }
            return handlerName;
        },
        registerDataHandler: function (handlerName, handler) {
            FB.FBDebug.logLine(2, 'Register data handler ' + handlerName);
            if (FB.Sys.containsKey(this._handlers, handlerName)) {
                throw new Error('Handler already exists');
            }
            this._handlers[handlerName] = handler;
            var queue = this._dataRequestQueues[handlerName];
            if (queue) {
                var $enum1 = new FB.ArrayEnumerator(queue);
                while ($enum1.moveNext()) {
                    var packet = $enum1.get_current();
                    FB.FBDebug.logLine(2, 'handle queued request');
                    var endPoint = null;
                    var $enum2 = new FB.ArrayEnumerator(this._receiveChannels);
                    while ($enum2.moveNext()) {
                        var item = $enum2.get_current();
                        if (item._id === packet.sid) {
                            endPoint = item._endPoint;
                            break;
                        }
                    }
                    FB.FBDebug.assert(endPoint, 'can\'t find endpoint');
                    handler(this._getDataObject(packet), endPoint);
                }
            }
        },
        isDataHandlerRegistered: function (handlerName) {
            return this._handlers[handlerName];
        },
        createNamedHiddenIFrame: function (frameName, srcUrl, className, otherAttributes) {
            var divDom = document.createElement('div');
            divDom = FB.HiddenContainer.get().appendChild(divDom);
            if (!this._iframeCreated && FBIntern.AppInfo.get_singleton().get_hostInfo().get_hostName() === FBIntern.HostName.IE) {
                divDom.innerHTML = '<iframe src=\'javascript:false\' ></iframe>';
                this._iframeCreated = true;
            }
            if (!className) {
                className = 'FB_SERVER_IFRAME';
            }
            var iframe_markup = '<iframe name=\"' + frameName + '\" ';
            if (otherAttributes) {
                iframe_markup += otherAttributes;
            }
            iframe_markup += ' src=\"' + srcUrl + '\" class=\"' + className + '\" scrolling=\"no\" frameborder=\"0\"></iframe>';
            divDom.innerHTML = iframe_markup;
            return divDom.childNodes[0];
        },
        onReceiverLoaded: function (hash) {
            if (hash) {
                window.setTimeout(FB.Delegate.create(this, function () {
                    this._onHashReceived(hash);
                }), 0);
            }
        },
        _createPacketUrl: function (packet, endPoint) {
            var serializedPacket = FB.JSON.serialize(packet);
            serializedPacket = encodeURIComponent(serializedPacket);
            if (endPoint.channelUrl.indexOf('http')) {
                throw new Error('Invalid channel url ' + endPoint.channelUrl);
            }
            var src = endPoint.channelUrl + '#';
            if (FB.FBDebug.logLevel > 4) {
                src += 'debug=1&';
            }
            if (endPoint.relation === FB.XdComm.PageRelation.child) {
                FB.FBDebug.assert(endPoint.frameName, 'XdComm.Server.CreatePacketUrl: end point does not have child name name specified');
                src += 'fname=' + endPoint.frameName + '&';
            }
            else if (endPoint.relation === FB.XdComm.PageRelation.self) {
                src += 'fname=_parent&';
            }
            else if (endPoint.relation === FB.XdComm.PageRelation.opener) {
                src += 'fname=_opener&';
            }
            else if (endPoint.relation === FB.XdComm.PageRelation.openee) {
                throw new Error('Can\'t handle endPoint ' + FB.Enum.toString(FB.XdComm.PageRelation, endPoint.relation));
            }
            src += serializedPacket;
            return src;
        },
        _createHiddenIFrame: function (src) {
            if (FB.FBDebug.logLevel > 4) {
                FB.FBDebug.writeLine('Create iframe ' + src + ' in ' + document.URL);
            }
            var receiverDom;
            receiverDom = document.createElement('iframe');
            receiverDom.className = 'FB_RECEIVER_DOM';
            if (!this._iframeCreated && FBIntern.AppInfo.get_singleton().get_hostInfo().get_hostName() === FBIntern.HostName.IE) {
                receiverDom.src = 'javascript:false';
                this._iframeCreated = true;
            }
            if (FBIntern.AppInfo.get_singleton().get_hostInfo().get_hostName() === FBIntern.HostName.IE) {
                receiverDom.src = src;
                receiverDom = FB.HiddenContainer.get().appendChild(receiverDom);
            }
            else {
                receiverDom = FB.HiddenContainer.get().appendChild(receiverDom);
                receiverDom.src = src;
            }
            return receiverDom;
        },
        _removeIframe: function (element) {
            if (FB.FBDebug.logLevel > 4) {
                FB.FBDebug.writeLine('Remove iframe in ' + document.URL);
            }
            if (element) {
                var parent = element.parentNode;
                if (parent) {
                    parent.removeChild(element);
                }
            }
        },
        _onHashReceived: function (hash) {
            if (FB.FBDebug.logLevel > 3) {
                FB.FBDebug.writeLine('>>>>>> ' + document.URL);
                FB.FBDebug.writeLine('received hash ' + hash);
            }
            if (FB.Sys.startsWith(hash, 'guid=')) {
                var decodedHash = decodeURIComponent(hash);
                var guidEnd = decodedHash.indexOf('&');
                var guid = decodedHash.substring(5, guidEnd);
                if (this.get_GUID() !== guid) {
                    return;
                }
                var hashMess = decodedHash.substr(guidEnd + 9);
                if (hashMess === 'loggedout') {
                    if (FB.Sys.containsKey(this._handlers, 'fbLogout')) {
                        var logoutHandler = this._handlers['fbLogout'];
                        logoutHandler(hashMess, null);
                    }
                }
                else { if (FB.Sys.containsKey(this._handlers, 'fbLogin')) {
                        var loginHandler = this._handlers['fbLogin'];
                        loginHandler(hashMess, null);
                    }
                }
            }
            else {
                var packetEndDelimiter = encodeURIComponent('}');
                var packetLength = hash.indexOf(packetEndDelimiter) + packetEndDelimiter.length;
                var packetString = decodeURIComponent(hash.substring(0, packetLength));
                var dataString = hash.substr(packetLength);
                var packet = FB.JSON.deserialize(packetString);
                packet.d = dataString;
                switch (packet.t) {
                case FB.XdComm._packetType.udpSingle:
                    this._onFullDataReceived(packet, new FB.XdComm.EndPoint(packet.sf, packet.sr, packet.sc));
                    break;
                case FB.XdComm._packetType.ack:
                    var endPoint = new FB.XdComm.EndPoint(packet.sf, packet.sr, packet.sc);
                    var $enum1 = new FB.ArrayEnumerator(this._sendChannels);
                    while ($enum1.moveNext()) {
                        var sChannel = $enum1.get_current();
                        if (endPoint.isEqual(sChannel._endPoint)) {
                            sChannel._onAck(this._getDataObject(packet));
                        }
                    }
                    break;
                default:
                    var rChannel = this._ensureReceiveChannel(packet.sid, null);
                    rChannel._onReceivedPacket(packet);
                    break;
                }
            }
        },
        _ensureReceiveChannel: function (sid, endPoint) {
            var rChannel = null;
            var $enum1 = new FB.ArrayEnumerator(this._receiveChannels);
            while ($enum1.moveNext()) {
                var item = $enum1.get_current();
                if (item._id === sid) {
                    rChannel = item;
                    break;
                }
            }
            if (!rChannel) {
                rChannel = new FB.XdComm._receiveChannel(sid, endPoint);
                FB.Sys.add(this._receiveChannels, rChannel);
            }
            return rChannel;
        },
        _onFullDataReceived: function (fullPacket, endPoint) {
            if (FB.FBDebug.logLevel > 3) {
                FB.FBDebug.dump(fullPacket, 'received full packet');
                FB.FBDebug.dump(endPoint, 'sender');
            }
            if (FB.Sys.containsKey(this._handlers, fullPacket.h)) {
                var handler = this._handlers[fullPacket.h];
                handler(this._getDataObject(fullPacket), endPoint);
            }
            else {
                FB.FBDebug.logLine(2, 'queue request to unknown handler {0} ' + fullPacket.h);
                var queue = this._dataRequestQueues[fullPacket.h];
                if (!queue) {
                    this._dataRequestQueues[fullPacket.h] = queue = [];
                }
                FB.Sys.add(queue, fullPacket);
            }
        },
        _getDataObject: function (packet) {
            var dataString = packet.d;
            switch (packet.df) {
            case FB.XdComm.PacketDataFormat.rawText:
                return dataString;
            case FB.XdComm.PacketDataFormat.OBJ:
                return packet.nd;
            case FB.XdComm.PacketDataFormat.JSON:
            default:
                return FB.JSON.deserialize(decodeURIComponent(dataString));
            }
        },
        get__useNativeXd: function () {
            if (!FBIntern.Utility.getSiteVar('use_postMessage')) {
                this._nativeXdState = 0;
            }
            else if (this._nativeXdState === -1) {
                if ((FBIntern.AppInfo.get_singleton().get_hostInfo().get_hostName() === FBIntern.HostName.IE && FBIntern.AppInfo.get_singleton().get_hostInfo().majorVersion < 8)) {
                    this._nativeXdState = 0;
                }
                else {
                    this._nativeXdState = window.postMessage != null ? 1 : 0;
                }
            }
            return this._nativeXdState === 1;
        },
        get_GUID: function () {
            if (!this._guid) {
                this._guid = Math.random().toString();
            }
            return this._guid;
        },
        get__useFlashXd: function () {
            if (this._flashXdState === -1) {
                if (!FBIntern.Utility.getSiteVar('use_flashXd')) {
                    this._flashXdState = 0;
                }
                else if (!this.get__useNativeXd() && FBIntern.Flash.hasRequireVersion()) {
                    this._flashXdState = 1;
                }
                else {
                    this._flashXdState = 0;
                }
            }
            return this._flashXdState === 1;
        },
        _receiverUrl: null,
        _xdCommId: null,
        _iframeCreated: false,
        _id: null,
        _maxPacketDataLength: 0,
        _nativeMsgId: 0,
        _guid: null
    }
});
FB.XdComm.XdRpcClient = FB.Type.createClass({
    ctor: function (rpcServerName, rpcClientName, serverEndPoint) {
        this._requestQueue = {};
        this._serverEndPoint = serverEndPoint;
        this._rpcClientName = (rpcClientName) ? rpcClientName : FB.XdComm.Server.singleton.getUniqueHandlerName('rpcClient');
        this._rcpServerName = rpcServerName;
        FB.XdComm.Server.singleton.registerDataHandler(rpcClientName, FB.Delegate.create(this, this._onDataReceived));
    },
    instance: {
        send: function (methodName, arg, callback) {
            FB.FBDebug.logLine(3, 'XdRpcClient.Send: ' + methodName);
            var request_id = this._idCount++;
            var request_data = [request_id, this._rpcClientName, methodName, arg, (callback) ? true : false];
            this._requestQueue[request_id.toString()] = callback;
            FB.XdComm.Server.singleton.send(this._serverEndPoint, this._rcpServerName, request_data);
        },
        _onDataReceived: function (data, endPoint) {
            var array = data;
            var requestId = array[0];
            var callback = this._requestQueue[requestId];
            if (callback) {
                callback(array[1]);
            }
        },
        detachClient: function () {
            FB.XdComm.Server.singleton.unregisterDataHandler(this._rpcClientName);
        },
        _serverEndPoint: null,
        _rpcClientName: null,
        _rcpServerName: null,
        _idCount: 0
    }
});
FB.XdComm.XdRpcServer = FB.Type.createClass({
    ctor: function (rpcServerName, registeredMethodMap) {
        if (registeredMethodMap) {
            this.registeredMethodMap = registeredMethodMap;
        }
        else {
            this.registeredMethodMap = {};
        }
        FB.XdComm.Server.singleton.registerDataHandler(rpcServerName, FB.Delegate.create(this, this._onDataReceived));
    },
    instance: {
        _onDataReceived: function (data, senderEndPoint) {
            var requestData = data;
            if (requestData.length !== 5) {
                FB.FBDebug.logLine(1, 'XdRpcServer.OnDataReceived: invalid parameters.');
            }
            var requestId = requestData[0];
            var clientName = requestData[1];
            var methodName = requestData[2];
            var arg = requestData[3];
            var needResultBack = requestData[4];
            if (!FB.Sys.containsKey(this.registeredMethodMap, methodName)) {
                FB.FBDebug.logLine(1, 'XD RPC server: method ' + methodName + ' is not allowed or doesn\'t exist.');
                return;
            }
            var methodInfo = this.registeredMethodMap[methodName];
            FB.FBDebug.logLine(3, 'XdRpcServer.Received: ' + methodName);
            if (methodInfo.method) {
                var result = methodInfo.method(arg, senderEndPoint);
                if (needResultBack) {
                    FB.XdComm.Server.singleton.send(senderEndPoint, clientName, [requestId, result]);
                }
            }
            else if (methodInfo.asyncMethod) {
                methodInfo.asyncMethod(arg, FB.Delegate.create(this, function (result) {
                    if (needResultBack) {
                        FB.XdComm.Server.singleton.send(senderEndPoint, clientName, [requestId, result]);
                    }
                }), senderEndPoint);
            }
            else {
                FB.FBDebug.logLine(1, 'MethodInfo for ' + methodName + ' does not contain any function pointers.');
            }
        },
        registeredMethodMap: null
    }
});
FB.FeatureLoader.onScriptLoaded(['XdComm']);

FB.Type.createNamespace('FB');
FB.$create_SessionRecord = function FB_SessionRecord(session_key, uid, expires, secret, base_domain, sig) {
    var $o = {};
    $o.session_key = session_key;
    $o.uid = uid;
    $o.expires = expires;
    $o.secret = secret;
    $o.sig = sig;
    $o.base_domain = base_domain;
    return $o;
}
FB.$create_SignedPublicSessionData = function FB_SignedPublicSessionData() {
    return {};
}
FB.FeedStorySetting = FB.Type.createEnum({
    preview: 1,
    autoaccept: 2,
    doNotSend: 3
},
false);
FB.FeedStorySize = FB.Type.createEnum({
    oneLine: 1,
    shortStory: 2,
    full: 4
},
false);
FB.ConnectState = FB.Type.createEnum({
    connected: 1,
    userNotLoggedIn: 2,
    appNotAuthorized: 3
},
false);
FB.$create_UserInfoRecord = function FB_UserInfoRecord(connect_state, one_line_setting, short_setting, in_facebook) {
    var $o = {};
    $o.connectState = connect_state;
    $o.oneLineStorySetting = one_line_setting;
    $o.shortStorySetting = short_setting;
    $o.inFacebook = in_facebook;
    return $o;
}
FB.Type.createNamespace('FB');
FB.$create_ApiErrorResult = function FB_ApiErrorResult() {
    return {};
}
FB.$create_ApiErrorRequestArg = function FB_ApiErrorRequestArg() {
    return {};
}
FB.ApiErrorCode = FB.Type.createEnum({
    unknown: 1,
    service_not_available: 2,
    max_requests_reached: 4,
    remote_address_not_allowed: 5,
    invalid_parameter: 100,
    invalid_api_key: 101,
    invalid_session_key: 102,
    invalid_call_id: 103,
    invalid_signature: 104,
    permission_denied: 200,
    internal_error: 800,
    invalid_operation: 801,
    quota_exceeded: 802,
    object_already_exists: 804,
    temporary_Database_failure: 805
},
false);
FB.$create__stepInfo = function FB__stepInfo(jsonRequest, pendingResult) {
    var $o = {};
    $o.jsonRequest = jsonRequest;
    $o.result = pendingResult;
    return $o;
}
FB.ApiClient = FB.Type.createClass({
    ctor: function (apiKey) {
        this._sessionWaitable = new FB.SimpleWaitable();
        this._sessionRefreshInterval = 20 * 60 * 1000;
        this._apiKey = apiKey;
        if (!FB.Facebook.apiKey) {
            FB.Facebook.apiKey = apiKey;
        }
        var server_root = FBIntern.Utility.getFacebookUrl('api');
        this._serverAddress = server_root + 'restserver.php';
        var xdServerUrl = server_root + 'static/v0.4/client_restserver.php?r=' + FBIntern.FbGlobals.get_fB_StaticResourceVersions()['api_server'];
        var xdReceiverUrl = server_root + 'static/v0.4/xd_receiver.php?r=' + FBIntern.FbGlobals.get_fB_StaticResourceVersions()['api_channel'];
        if (FB.FBDebug.logLevel > 0) {
            xdServerUrl = FBIntern.Uri.addQueryParameters(xdServerUrl, 'debug_level=' + FB.FBDebug.logLevel.toString());
        }
        this._xdHttpClient = new FB._xdHttpRequestClient(xdServerUrl, xdReceiverUrl, 'fb_api_server');
        this._isLoggedIn = window.location.href.match("fb_sig_user") != null;;
        var session = FB.ApiClient._getSessionFromUrl(document.URL);
        if (!session) {
            if (FB.Facebook.get_isInCanvas() && !this._isLoggedIn) {
                this._setSessionCookies(null);
            }
            else {
                session = this._getSessionFromCookies();
            }
        }
        if (session && !FB.ApiClient.sessionIsExpired(session)) {
            this.set_session(session);
        }
    },
    static_ctor: function () {
        FB.ApiClient.createSessionDelegate = FB.ApiClient.defaultCreateSession;
    },
    static: {
        sessionIsExpired: function (record) {
            if (!record.expires) {
                return false;
            }
            else if (record.expires !== -1) {
                var currentUnixTime = Math.round((new Date()).getTime() / 1000);
                var expireUnixTime = record.expires;
                var isExpired = !(expireUnixTime > currentUnixTime);
                return isExpired;
            }
            return true;
        },
        defaultCreateSession: function (apiClient, callback) {
            window.location = apiClient._createLoginUrl();;
        },
        getSessionFromSigParams: function (sigParams) {
            var sessionKeyStringC = 'fb_sig_session_key';
            var userStringC = 'fb_sig_user';
            var expiresStringC = 'fb_sig_expires';
            var secretStringC = 'fb_sig_ss';
            var sigStringC = 'fb_sig';
            var domainStringC = 'fb_sig_base_domain';
            if (FB.Sys.containsKey(sigParams, sessionKeyStringC) && FB.Sys.containsKey(sigParams, userStringC) && FB.Sys.containsKey(sigParams, expiresStringC) && FB.Sys.containsKey(sigParams, secretStringC) && FB.Sys.containsKey(sigParams, sigStringC)) {
                var sigString = sigParams[sigStringC];
                var userString = sigParams[userStringC];
                var sessionSecretString = sigParams[secretStringC];
                var sessionKeyString = sigParams[sessionKeyStringC];
                var expireString = parseInt(sigParams[expiresStringC]);
                var domainString = sigParams[domainStringC];
                if (sigString && userString && sessionSecretString && sessionKeyString && expireString !== -1) {
                    var s = FB.$create_SessionRecord(sessionKeyString, userString, expireString, sessionSecretString, domainString, sigString);
                    return s;
                }
            }
            return null;
        },
        _getSessionFromUrl: function (url) {
            var sessionTokenString = 'session';
            var documentUri = new FBIntern.Uri(url);
            if (FB.Sys.containsKey(documentUri.get_queryParameters(), sessionTokenString)) {
                var sessionToken = documentUri.get_queryParameters()[sessionTokenString];
                return FB.JSON.deserialize(sessionToken);
            }
            return FB.ApiClient.getSessionFromSigParams(documentUri.get_queryParameters());
        }
    },
    instance: {
        get_session: function () {
            return this._session;
        },
        set_session: function (value) {
            if (value !== this._session) {
                this._session = value;
                if (this._session) {
                    FB.Facebook.set_baseDomain(this._session.base_domain);
                }
                this._setSessionCookies(value);
                window.setInterval(FB.Delegate.create(this, function () {
                    this._refreshSession(null);
                }), this._sessionRefreshInterval);
                this._sessionWaitable.setResult(value, !value);
            }
            return value;
        },
        get_sessionWaitable: function () {
            return this._sessionWaitable;
        },
        requireLogin: function (callback) {
            if (this._session) {
                if (callback) {
                    callback(null);
                }
            }
            else {
                FB.ApiClient.createSessionDelegate(this, FB.Delegate.create(this, function (session) {
                    FB.FBDebug.assert(session, 'Invalid session returned');
                    this._session = session;
                }));
            }
        },
        _getSessionFromCookies: function () {
            var sigCookie = FBIntern.Cookie.getValue(this._apiKey);
            var userCookie = FBIntern.Cookie.getValue(this._apiKey + '_user');
            var sessionSecretCookie = FBIntern.Cookie.getValue(this._apiKey + '_ss');
            var sessionKeyCookie = FBIntern.Cookie.getValue(this._apiKey + '_session_key');
            var expireCookie = parseInt(FBIntern.Cookie.getValue(this._apiKey + '_expires'));
            if (sigCookie && userCookie && sessionSecretCookie && sessionKeyCookie && expireCookie !== -1) {
                var s = FB.$create_SessionRecord(sessionKeyCookie, userCookie, expireCookie, sessionSecretCookie, FB.Facebook.get_baseDomain(), sigCookie);
                return s;
            }
            return null;
        },
        _setSessionCookies: function (record) {
            if (record && record.expires !== -1 && record.secret && record.session_key && record.uid && record.sig) {
                FBIntern.Cookie.set(this._apiKey, record.sig, '/', FB.Facebook.get_baseDomain(), 0);
                FBIntern.Cookie.set(this._apiKey + '_user', record.uid, '/', FB.Facebook.get_baseDomain(), 0);
                FBIntern.Cookie.set(this._apiKey + '_ss', record.secret, '/', FB.Facebook.get_baseDomain(), 0);
                FBIntern.Cookie.set(this._apiKey + '_session_key', record.session_key, '/', FB.Facebook.get_baseDomain(), 0);
                FBIntern.Cookie.set(this._apiKey + '_expires', record.expires.toString(), '/', FB.Facebook.get_baseDomain(), 0);
            }
            else if (!record) {
                FBIntern.Cookie.clear(this._apiKey, '/', FB.Facebook.get_baseDomain());
                FBIntern.Cookie.clear(this._apiKey + '_user', '/', FB.Facebook.get_baseDomain());
                FBIntern.Cookie.clear(this._apiKey + '_ss', '/', FB.Facebook.get_baseDomain());
                FBIntern.Cookie.clear(this._apiKey + '_session_key', '/', FB.Facebook.get_baseDomain());
                FBIntern.Cookie.clear(this._apiKey + '_expires', '/', FB.Facebook.get_baseDomain());
            }
        },
        _createLoginUrl: function () {
            var q_params = {
                extern: FB.Facebook.get_isInConnect(),
                return_session: 1,
                api_key: this._apiKey,
                v: FB.Facebook.version,
                next: document.URL
            };
            return FBIntern.Utility.createFacebookUrl('www', 'login.php', q_params, false);
        },
        _refreshSession: function (callback) {
            var requestUrl = FBIntern.Utility.getFacebookUrl('api') + 'session_state.php';
            var requestBody = 'api_key=' + this._apiKey.toString() + '&session_key=' + ((!this._session) ? 'null' : this._session.session_key.toString());
            var headers = {};
            headers['Content-Type'] = 'application/x-www-form-urlencoded';
            var r = new FB._xdJsonRequest(this._xdHttpClient, 'POST', requestUrl, requestBody, headers);
            r.callback = FB.Delegate.create(this, function (result, e) {
                if (result) {
                    var dict = result;
                    if (!dict['error']) {
                        this._session = dict['session'];
                        this._setSessionCookies(this._session);
                        if (callback) {
                            callback(null);
                        }
                    }
                    else if (dict['error'] === -1) {
                        FB.FBDebug.logLine(1, 'User has not authorized the application.');
                    }
                    else if (dict['error'] === -2) {
                        FB.FBDebug.logLine(1, 'User is not logged into Facebook.');
                    }
                    else if (dict['error'] === -3) {
                        FB.FBDebug.logLine(1, 'Unknown error while refreshing user session.');
                    }
                }
            });
            r.sendRequest();
        },
        auth_getAppPublicKey: function (target_app_key, sequencer) {
            return this.callMethod('auth.getAppPublicKey', {
                target_app_key: target_app_key
            },
            sequencer);
        },
        auth_getSignedPublicSessionData: function (sequencer) {
            return this.callMethod('auth.getSignedPublicSessionData', null, sequencer);
        },
        connect_getUnconnectedFriendsCount: function (sequencer) {
            return this.callMethod('connect.getUnconnectedFriendsCount', null, sequencer);
        },
        events_get: function (uid, eids, startTime, endTime, rsvpStatus, sequencer) {
            var parameters = {};
            if (uid) {
                parameters['uid'] = uid;
            }
            if (eids) {
                parameters['eids'] = eids;
            }
            parameters['start_time'] = startTime;
            parameters['end_time'] = endTime;
            if (rsvpStatus) {
                parameters['rsvp_status'] = rsvpStatus;
            }
            return this.callMethod('events.get', parameters, sequencer);
        },
        events_getMembers: function (eid, sequencer) {
            var parameters = {};
            parameters['eid'] = eid;
            return this.callMethod('events.getMembers', parameters, sequencer);
        },
        fbml_refreshImgSrc: function (url, sequencer) {
            var parameters = {};
            parameters['url'] = url;
            return this.callMethod('fbml.refreshImgSrc', parameters, sequencer);
        },
        fbml_refreshRefUrl: function (url, sequencer) {
            var parameters = {};
            parameters['url'] = url;
            return this.callMethod('fbml.refreshRefUrl', parameters, sequencer);
        },
        fbml_setRefHandle: function (handle, fbml, sequencer) {
            var parameters = {};
            parameters['handle'] = handle;
            parameters['fbml'] = fbml;
            return this.callMethod('fbml.setRefHandle', parameters, sequencer);
        },
        intl_uploadNativeStrings: function (native_strings, sequencer) {
            var parameters = {};
            parameters['native_strings'] = native_strings;
            return this.callMethod('fbml.uploadNativeStrings', parameters, sequencer);
        },
        feed_publishUserAction: function (template_bundle_id, template_data, target_ids, body_general, story_size, user_message, sequencer) {
            var parameters = {};
            parameters['template_bundle_id'] = template_bundle_id.toString();
            if (template_data) {
                parameters['template_data'] = template_data;
            }
            if (target_ids) {
                parameters['target_ids'] = target_ids.toString();
            }
            if (body_general) {
                parameters['body_general'] = body_general;
            }
            if (story_size > 0) {
                parameters['story_size'] = story_size;
            }
            if (user_message) {
                parameters['user_message'] = user_message;
            }
            return this.callMethod('feed.publishUserAction', parameters, sequencer);
        },
        feed_registerTemplateBundle: function () {
            FB.FBDebug.logLine(1, 'Please call Feed.registerTemplateBundle server side.');
        },
        friends_get: function (flid, sequencer) {
            var parameters = {};
            if (flid) {
                parameters['flid'] = flid;
            }
            else if (FB.Facebook.get_isInCanvas() && this._isLoggedIn && FB.XdComm.Server.singleton.get_receiverUrl() && typeof(sequencer) === 'function') {
                FB_RequireFeatures(['CacheData'], function () {
                    FBIntern.CacheClient.friendsGet(sequencer);
                });;
                return null;
            }
            return this.callMethod('friends.get', parameters, sequencer);
        },
        revokeAuthorization: function (uid, sequencer) {
            return this.callMethod('auth.revokeAuthorization', null, sequencer);
        },
        preloadFQL_get: function (callback) {
            if (FB.Facebook.get_isInCanvas() && this._isLoggedIn && FB.XdComm.Server.singleton.get_receiverUrl()) {
                FB_RequireFeatures(['CacheData'], function () {
                    FBIntern.CacheClient.preloadFQLGet(callback);
                });;
                return true;
            }
            else {
                callback(Array());;
                return false;
            }
        },
        friends_areFriends: function (uids1, uids2, sequencer) {
            var parameters = {};
            parameters['uids1'] = uids1.toString();
            parameters['uids2'] = uids2.toString();
            return this.callMethod('friends.areFriends', parameters, sequencer);
        },
        friends_getAppUsers: function (sequencer) {
            return this.callMethod('friends.getAppUsers', null, sequencer);
        },
        friends_getLists: function (sequencer) {
            return this.callMethod('friends.getLists', null, sequencer);
        },
        groups_get: function (uid, gids, sequencer) {
            var parameters = {};
            if (uid) {
                parameters['uid'] = uid;
            }
            if (gids) {
                parameters['gids'] = gids.toString();
            }
            return this.callMethod('groups.get', parameters, sequencer);
        },
        groups_getMembers: function (gid, sequencer) {
            var parameters = {};
            parameters['gid'] = gid;
            return this.callMethod('groups.getMembers', parameters, sequencer);
        },
        privacy_canSee: function (uids, whats, sequencer) {
            var parameters = {};
            parameters['uids'] = uids.toString();
            parameters['whats'] = whats.toString();
            return this.callMethod('privacy.canSee', parameters, sequencer);
        },
        notifications_get: function (sequencer) {
            var parameters = {};
            return this.callMethod('notifications.get', parameters, sequencer);
        },
        notifications_send: function (to_ids, notification, sequencer) {
            var parameters = {};
            parameters['to_ids'] = to_ids.toString();
            parameters['notification'] = notification;
            return this.callMethod('notifications.send', parameters, sequencer);
        },
        notifications_sendEmail: function (recipients, subject, text, fbml, sequencer) {
            var parameters = {};
            parameters['recipients'] = recipients.toString();
            parameters['subject'] = subject;
            if (text) {
                parameters['text'] = text;
            }
            if (fbml) {
                parameters['fbml'] = fbml;
            }
            return this.callMethod('notifications.sendEmail', parameters, sequencer);
        },
        pages_getInfo: function (fields, page_ids, uid, sequencer) {
            var parameters = {};
            parameters['fields'] = fields.toString();
            parameters['page_ids'] = page_ids.toString();
            if (uid) {
                parameters['uid'] = uid;
            }
            return this.callMethod('pages.getInfo', parameters, sequencer);
        },
        pages_isAdmin: function (page_id, sequencer) {
            var parameters = {};
            parameters['page_id'] = page_id;
            return this.callMethod('pages.isAdmin', parameters, sequencer);
        },
        pages_isAppAdded: function (page_id, sequencer) {
            var parameters = {};
            parameters['page_id'] = page_id;
            return this.callMethod('pages.isAppAdded', parameters, sequencer);
        },
        pages_isFan: function (page_id, uid, sequencer) {
            var parameters = {};
            parameters['page_id'] = page_id;
            parameters['uid'] = uid;
            return this.callMethod('pages.isFan', parameters, sequencer);
        },
        photos_addTag: function (pid, tag_uid, tag_text, x, y, tags, sequencer) {
            var parameters = {};
            parameters['pid'] = pid;
            if (tags) {
                parameters['tags'] = tags;
            }
            else { if (tag_uid) {
                    parameters['tag_uid'] = tag_uid;
                }
                else if (tag_text) {
                    parameters['tag_text'] = tag_text;
                }
                else {
                    FB.FBDebug.logLine(1, 'Either tag_uid or tag_text must specified');
                }
                parameters['x'] = x;
                parameters['y'] = y;
            }
            return this.callMethod('photos.addTag', parameters, sequencer);
        },
        photos_createAlbum: function (name, location, description, sequencer) {
            var parameters = {};
            parameters['name'] = name;
            parameters['location'] = location;
            parameters['description'] = description;
            return this.callMethod('photos.createAlbum', parameters, sequencer);
        },
        photos_get: function (subj_id, aid, pids, sequencer) {
            var parameters = {};
            if (subj_id) {
                parameters['subj_id'] = subj_id;
            }
            if (aid) {
                parameters['aid'] = aid;
            }
            if (pids) {
                parameters['pids'] = pids.toString();
            }
            return this.callMethod('photos.get', parameters, sequencer);
        },
        photos_getAlbums: function (uid, aids, sequencer) {
            var parameters = {};
            if (uid) {
                parameters['uid'] = uid;
            }
            if (aids) {
                parameters['aids'] = aids.toString();
            }
            return this.callMethod('photos.getAlbums', parameters, sequencer);
        },
        photos_getTags: function (pids, sequencer) {
            var parameters = {};
            parameters['pids'] = pids.toString();
            return this.callMethod('photos.getTags', parameters, sequencer);
        },
        users_getInfo: function (uids, fields, sequencer) {
            var parameters = {};
            parameters['uids'] = uids.toString();
            parameters['fields'] = fields.toString();
            return this.callMethod('users.getInfo', parameters, sequencer);
        },
        users_getLoggedInUser: function (sequencer) {
            var parameters = {};
            return this.callMethod('users.getLoggedInUser', parameters, sequencer);
        },
        users_hasAppPermission: function (ext_perm, sequencer) {
            var parameters = {};
            parameters['ext_perm'] = ext_perm;
            return this.callMethod('users.hasAppPermission', parameters, sequencer);
        },
        users_isAppAdded: function (sequencer) {
            var parameters = {};
            return this.callMethod('users.isAppAdded', parameters, sequencer);
        },
        users_isAppUser: function (sequencer) {
            var parameters = {};
            return this.callMethod('users.isAppUser', parameters, sequencer);
        },
        users_setStatus: function (status, clear, status_includes_verb, sequencer) {
            var parameters = {};
            parameters['status'] = status;
            parameters['clear'] = clear;
            parameters['status_includes_verb'] = status_includes_verb;
            return this.callMethod('users.setStatus', parameters, sequencer);
        },
        stream_get: function (source_ids, start_time, end_time, limit, filter_key, sequencer) {
            var parameters = {};
            parameters['source_ids'] = source_ids;
            parameters['start_time'] = start_time;
            parameters['end_time'] = end_time;
            parameters['limit'] = limit;
            parameters['filter_key'] = filter_key;
            return this.callMethod('stream.get', parameters, sequencer);
        },
        stream_getComments: function (post_id, sequencer) {
            var parameters = {};
            parameters['post_id'] = post_id;
            return this.callMethod('stream.getComments', parameters, sequencer);
        },
        stream_getFilters: function (sequencer) {
            return this.callMethod('stream.getFilters', {},
            sequencer);
        },
        fql_query: function (query, sequencer) {
            var parameters = {};
            parameters['query'] = query;
            return this.callMethod('fql.query', parameters, sequencer);
        },
        profile_setFBML: function (uid, profile, profile_action, mobile_profile, profile_main, sequencer) {
            var parameters = {};
            if (uid) {
                parameters['uid'] = uid;
            }
            parameters['profile'] = profile;
            parameters['profile_action'] = profile_action;
            parameters['mobile_profile'] = mobile_profile;
            parameters['profile_main'] = profile_main;
            return this.callMethod('profile.setFBML', parameters, sequencer);
        },
        profile_getFBML: function (uid, sequencer) {
            var parameters = {};
            parameters['uid'] = uid;
            return this.callMethod('profile.getFBML', parameters, sequencer);
        },
        callMethod: function (method, parameters, executeUnit) {
            var invalidSession = !this._session && !FB.Facebook.appSecret && method !== 'fql.query';
            var jsonRequest = this._generateJsonRequest(method, parameters);
            if (typeof(executeUnit) !== 'function') {
                var pendingResult = new FB.PendingResult();
                if (!invalidSession) {
                    executeUnit._api = this;
                    executeUnit._addStep(jsonRequest, pendingResult);
                }
                else {
                    pendingResult.setPendingResult(null, FBIntern.Utility.createException('Invalid session state', FB.ApiErrorCode.invalid_session_key));
                }
                return pendingResult;
            }
            else {
                var callback = (executeUnit);
                if (!invalidSession) {
                    jsonRequest.callback = FB.Delegate.create(this, function (result, exception) {
                        if (!exception && (exception = this._checkError(result))) {
                            result = null;
                        }
                        callback(result, exception);
                    });
                    jsonRequest.sendRequest();
                }
                else {
                    callback(null, FBIntern.Utility.createException('Invalid session state', FB.ApiErrorCode.invalid_session_key));
                }
                return null;
            }
        },
        _checkError: function (result) {
            var apiError = result;
            if (!FB.Sys.isUndefined(apiError.error_code)) {
                FB.FBDebug.logLine(1, 'API failed with error code = ' + FB.Enum.toString(FB.ApiErrorCode, apiError.error_code));
                if (apiError.error_code === FB.ApiErrorCode.invalid_session_key) {
                    FB.FBDebug.logLine(1, 'Bad session key, clear it');
                    this.set_session(null);
                }
                return FBIntern.Utility.createException(apiError.error_msg, apiError);
            }
            return null;
        },
        _generateJsonRequest: function (method, parameters) {
            if (!parameters) {
                parameters = {};
            }
            var $dict1 = parameters;
            for (var $key2 in $dict1) {
                var entry = {
                    key: $key2,
                    value: $dict1[$key2]
                };
                var scriptType = typeof(entry.value);
                if (scriptType === 'boolean') {
                    parameters[entry.key] = (parameters[entry.key]) ? 1 : 0;
                }
                else if (scriptType === 'object') {
                    parameters[entry.key] = FB.JSON.serialize(entry.value);
                }
            }
            parameters['method'] = method;
            parameters['api_key'] = this._apiKey;
            parameters['format'] = 'JSON';
            var callId = (new Date()).getMilliseconds();
            if (callId === this._lastCallId) {
                callId = this._lastCallId + 1;
            }
            this._lastCallId = callId;
            parameters['call_id'] = callId;
            if (!parameters['v']) {
                parameters['v'] = FB.Facebook.version;
            }
            if (this._session) {
                FB.FBDebug.writeLine('session key = ' + this._session.session_key);
                parameters['session_key'] = this._session.session_key;
            }
            if (FB.Facebook.appSecret) {
                parameters['sig'] = this._generateSignature(parameters, FB.Facebook.appSecret);
            }
            else if (this._session && this._session.secret) {
                parameters['ss'] = 1;
                parameters['sig'] = this._generateSignature(parameters, this._session.secret);
            }
            var queryBuilder = new FB.StringBuilder();
            var $dict3 = parameters;
            for (var $key4 in $dict3) {
                var entry = {
                    key: $key4,
                    value: $dict3[$key4]
                };
                if (!queryBuilder.get_isEmpty()) {
                    queryBuilder.append('&');
                }
                queryBuilder.append(entry.key + '=' + encodeURIComponent(entry.value.toString()));
            }
            var requestUrl = this._serverAddress;
            requestUrl += ('?method=' + parameters['method']);
            var requestBody = queryBuilder.toString();
            var headers = {};
            headers['Content-Type'] = 'application/x-www-form-urlencoded';
            var jsonRequest = new FB._xdJsonRequest(this._xdHttpClient, 'POST', requestUrl, requestBody, headers);
            return jsonRequest;
        },
        get_apiKey: function () {
            return this._apiKey;
        },
        _convertDictKeysToList: function (dictionary) {
            var keyList = [];
            var $dict1 = dictionary;
            for (var $key2 in $dict1) {
                var entry = {
                    key: $key2,
                    value: $dict1[$key2]
                };
                FB.Sys.add(keyList, entry.key);
            }
            return keyList;
        },
        _generateSignature: function (parameters, secret) {
            var signatureBuilder = new FB.StringBuilder();
            var keyList = this._convertDictKeysToList(parameters);
            keyList.sort();
            var $enum1 = new FB.ArrayEnumerator(keyList);
            while ($enum1.moveNext()) {
                var key = $enum1.get_current();
                signatureBuilder.append(key + '=' + parameters[key]);
            }
            signatureBuilder.append(secret);
            var hashString = FB.Sys.trim(FBIntern.Md5.computeHashToString(signatureBuilder.toString()));
            return hashString;
        },
        _apiKey: null,
        _session: null,
        _serverAddress: null,
        _lastCallId: 0,
        _xdHttpClient: null,
        _isLoggedIn: false
    }
});
FB.Helper = FB.Type.createClass({
    ctor: function () {},
    static: {
        invokeAsCallbackOrRedirect: function (obj) {
            if (!obj) {
                return;
            }
            if (FB.Sys.isAssignableFrom(FB.Type.getInstanceType(obj), String)) {
                window.location = obj;;
            }
            else {
                var callback = obj;
                var session = FB.Facebook.apiClient.get_session();
                callback((session) ? session.uid : null);
            }
        }
    }
});
FB._xdHttpRequestClient = FB.Type.createClass({
    ctor: function (requestServerUrl, receiverUrl, server_iframe_name) {
        if (!FBIntern.Flash.hasRequireVersion()) {
            FB.XdComm.Server.singleton.createNamedHiddenIFrame(server_iframe_name, requestServerUrl, 'FB_SERVER_IFRAME', null);
            this._serverEndPoint = new FB.XdComm.EndPoint(server_iframe_name, FB.XdComm.PageRelation.child, receiverUrl);
        }
        else if (!window.FB_OnXdHttpResult) {
            FB.FBDebug.logLine(2, 'Set window.FB_OnXdHttpResult');
            window.FB_OnXdHttpResult = FB._xdHttpRequestClient._onFlashDataReceived;
        }
    },
    static_ctor: function () {
        FB._xdHttpRequestClient._requestQueue = {};
        FB._xdHttpRequestClient._handlerRegistered = false;
        FB._xdHttpRequestClient._idCount = 0;
    },
    static: {
        _ensureListenerStarted: function () {
            if (!FB._xdHttpRequestClient._handlerRegistered) {
                FB.XdComm.Server.singleton.registerDataHandler('http_client', FB._xdHttpRequestClient._onDataReceived);
                FB._xdHttpRequestClient._handlerRegistered = true;
            }
        },
        _onFlashDataReceived: function (id, responseText) {
            responseText = FBIntern.Flash.decode(responseText);
            var result = FB.$create_XdHttpRequestResult(id, 200, 'Success', responseText);
            window.setTimeout(function () {
                FB._xdHttpRequestClient._onDataReceived(result, null);
            },
            0);
        },
        _onDataReceived: function (data, senderEndPoint) {
            FB.FBDebug.logLine(3, 'XdHttpRequestClient: got result ');
            var result = data;
            var callback = FB._xdHttpRequestClient._requestQueue[result.id];
            callback(result);
        }
    },
    instance: {
        send: function (method, url, requestBody, extraHeaders, callback) {
            if (!FBIntern.Flash.hasRequireVersion()) {
                var uri = new FBIntern.Uri(url);
                var rootedUrl = uri.get_pathAndQuery();
                FB._xdHttpRequestClient._ensureListenerStarted();
                var requestId = FB._xdHttpRequestClient._idCount++;
                var request_data = [requestId, method, rootedUrl, requestBody, extraHeaders];
                FB._xdHttpRequestClient._requestQueue[requestId.toString()] = callback;
                FB.FBDebug.logLine(3, 'XdHttpRequestClient: send request for ' + url);
                FB.XdComm.Server.singleton.send(this._serverEndPoint, 'http_server', request_data);
            }
            else {
                FBIntern.Flash.get_xdComm().waitUntilReady(FB.Delegate.create(this, function (result) {
                    var flashXdComm = result;
                    FB.FBDebug.logLine(3, 'XdHttpRequestClient: send flash request for ' + url);
                    var requestId = flashXdComm.sendXdHttpRequest(method, url, requestBody, extraHeaders);
                    FB._xdHttpRequestClient._requestQueue[requestId.toString()] = callback;
                }));
            }
        },
        _serverEndPoint: null
    }
});
FB.PendingResult = FB.Type.createClass({
    base: FB.SimpleWaitable,
    ctor: function () {
        FB.PendingResult.constructBase(this);
    },
    instance: {
        exception: null,
        setPendingResult: function (result, exception) {
            var apiError = result;
            if (!exception && apiError && !FB.Sys.isUndefined(apiError.error_code)) {
                exception = FBIntern.Utility.createException(apiError.error_msg, apiError);
                FB.FBDebug.logLine(1, 'Facebook API error: ' + apiError.error_msg);
                result = null;
            }
            this.exception = exception;
            this.setResult(result);
        }
    }
});
FB.SequencerBase = FB.Type.createClass({
    ctor: function () {},
    instance: {
        _completedCallback: null,
        isParallel: true,
        _api: null
    }
});
FB.BatchSequencer = FB.Type.createClass({
    base: FB.SequencerBase,
    ctor: function () {
        this.stepsList = [];
        FB.BatchSequencer.constructBase(this);
    },
    instance: {
        execute: function (completedCallback) {
            this._completedCallback = completedCallback;
            var stepsCount = this.stepsList.length;
            if (stepsCount > 1) {
                var parameters = {};
                var methodFeed = [];
                var $enum1 = new FB.ArrayEnumerator(this.stepsList);
                while ($enum1.moveNext()) {
                    var stepInfo = $enum1.get_current();
                    FB.Sys.add(methodFeed, stepInfo.jsonRequest._requestBody);
                }
                parameters['method_feed'] = methodFeed;
                parameters['serial_only'] = !this.isParallel;
                var batchRequest = this._api._generateJsonRequest('batch.run', parameters);
                batchRequest.callback = FB.Delegate.create(this, function (result, exception) {
                    if (!exception && (exception = this._api._checkError(result))) {
                        result = null;
                    }
                    this._setStepResults$1(result, exception);
                    this.onAllCompleted();
                });
                batchRequest.sendRequest();
            }
            else if (stepsCount === 1) {
                var stepInfo = this.stepsList[0];
                stepInfo.jsonRequest.callback = FB.Delegate.create(this, function (result, exception) {
                    stepInfo.result.setPendingResult(result, exception);
                    this.onAllCompleted();
                });
                stepInfo.jsonRequest.sendRequest();
            }
            else {
                this.onAllCompleted();
            }
        },
        _setStepResults$1: function (batchResult, exception) {
            var batchResultList = batchResult;
            FB.FBDebug.assert(!batchResultList || batchResultList.length === this.stepsList.length, 'Malformed batch result');
            var stepsCount = this.stepsList.length;
            for (var i = 0; i < stepsCount; i++) {
                var pendingResult = (this.stepsList[i]).result;
                if (exception) {
                    pendingResult.exception = exception;
                    pendingResult.result = null;
                }
                else if (batchResultList) {
                    var individualResultString = batchResultList[i];
                    var individualResult = FB.JSON.deserialize(individualResultString, true);
                    pendingResult.setPendingResult(individualResult, null);
                }
            }
        },
        onAllCompleted: function () {
            FB.Sys.clear(this.stepsList);
            if (this._completedCallback) {
                var callback = this._completedCallback;
                this._completedCallback = null;
                callback();
            }
        },
        _addStep: function (jsonRequest, pendingResult) {
            var stepInfo = FB.$create__stepInfo(jsonRequest, pendingResult);
            FB.Sys.add(this.stepsList, stepInfo);
        }
    }
});
FB.ImmediateSequencer = FB.Type.createClass({
    base: FB.BatchSequencer,
    ctor: function (callback) {
        FB.ImmediateSequencer.constructBase(this);
        this.isParallel = false;
        this._callback$2 = callback;
    },
    instance: {
        _addStep: function (jsonRequest, pendingResult) {
            this.pendingResult = pendingResult;
            FB.ImmediateSequencer.callBase(this, '_addStep', [jsonRequest, pendingResult]);
            this.execute(null);
        },
        onAllCompleted: function () {
            FB.Sys.clear(this.stepsList);
            if (this._callback$2) {
                this._callback$2(this.pendingResult.result, this.pendingResult.exception);
            }
        },
        pendingResult: null,
        _callback$2: null
    }
});
FB._xdJsonRequest = FB.Type.createClass({
    ctor: function (xdHttpClient, method, url, requestBody, extraHeaders) {
        this._method = method;
        this._url = url;
        this._requestBody = requestBody;
        this._extraHeaders = extraHeaders;
        this._xdHttpClient = xdHttpClient;
    },
    instance: {
        sendRequest: function () {
            this._xdHttpClient.send(this._method, this._url, this._requestBody, this._extraHeaders, FB.Delegate.create(this, function (xd_result) {
                if (xd_result.status < 400) {
                    var responseText = xd_result.responseText;
                    var result;
                    try {
                        result = FB.JSON.deserialize(responseText, true);
                    }
                    catch(exception) {
                        var jsonException = FBIntern.Utility.createException('JSON exception during deserialization.', responseText, exception);
                        this.callback(null, exception);
                        return;
                    }
                    this.callback(result, null);
                }
                else {
                    var exception = new Error(FB.Sys.format('HTTP request failure status code=\'{0}\', text=\'{1}\'', xd_result.status, xd_result.statusText));
                    this.callback(null, exception);
                }
            }));
        },
        callback: null,
        _method: null,
        _url: null,
        _requestBody: null,
        _extraHeaders: null,
        _xdHttpClient: null
    }
});
FB.Facebook = FB.Type.createClass({
    ctor: function () {},
    static_ctor: function () {
        FB.Facebook.apiKey = null;
        FB.Facebook.apiClient = null;
        FB.Facebook.appSecret = null;
        FB.Facebook.version = '1.0';
        FB.Facebook.__initCalled = null;
        FB.Facebook.appSettings = {};
        FB.Facebook.isInConnect = 0;
        FB.Facebook.locale = 'en_US';
        FB.Facebook._initialized = null;
        FB.Facebook._baseDomain = null;
        FB.Facebook._isBaseDomainInitialized = false;
        FB.Facebook._isInCanvas = -1;
        FB.Facebook._isInitialNoSession = false;
        FB.Facebook._publicSessionData = new FB.SimpleWaitable();
    },
    static: {
        init: function (apiKey, xdChannelUrl, appSettings) {
            if (typeof(apiKey) === 'object' && !xdChannelUrl && !appSettings) {
                appSettings = arguments[0];
                apiKey = null;
                xdChannelUrl = null;
            }
            if (FB.Facebook.apiClient) {
                FB.FBDebug.writeLine('Error: Facebook.init() has already been called.');
            }
            else { if (apiKey) {
                    FB.Facebook.apiKey = apiKey;
                }
                else if (appSettings) {
                    FB.Facebook.apiKey = appSettings['apiKey'];
                }
                if (!FB.Facebook.apiKey) {
                    FB.FBDebug.logLine(0, 'API Key is not specified');
                }
                if (!xdChannelUrl && appSettings) {
                    xdChannelUrl = appSettings['xdChannelUrl'];
                }
                FB.XdComm.Server.singleton.set_receiverUrl(xdChannelUrl);
                FB.Facebook.apiClient = new FB.ApiClient(FB.Facebook.apiKey);
                FB.Facebook._isInitialNoSession = !FB.Facebook.get_sessionState().result;
                if (appSettings) {
                    FB.Facebook.appSettings = appSettings;
                    FB.Facebook._processOptionalAppSettings();
                } (FB.Facebook.get_initialized()).setResult(true);
            }
            if (FB.Facebook.__initCalled) {
                FB.Facebook.__initCalled();
            }
        },
        _reloadIfSessionStateChanged: function () {
            FB.Facebook.get_sessionWaitable().add_changed(function (waitable) {
                window.setTimeout(function () {
                    var newNoSession = !waitable.result;
                    if (newNoSession !== FB.Facebook._isInitialNoSession && FB.Facebook.appSettings['reloadIfSessionStateChanged']) {
                        FB.FBDebug.logLine(3, 'reloading ...');
                        window.setTimeout(function () {
                            window.location.reload(true);
                        },
                        0);
                    }
                },
                0);
            });
        },
        _processOptionalAppSettings: function () {
            var $dict1 = FB.Facebook.appSettings;
            for (var $key2 in $dict1) {
                var entry = {
                    key: $key2,
                    value: $dict1[$key2]
                };
                switch (entry.key) {
                case 'debugLogLevel':
                    FB.FBDebug.logLevel = entry.value;
                    break;
                case 'apiKey':
                case 'xdChannelUrl':
                case 'fetchSignedPublicSessionData':
                case 'ifUserConnected':
                case 'ifUserNotConnected':
                case 'doNotUseCachedConnectState':
                case 'permsToRequestOnConnect':
                    break;
                case 'reloadIfSessionStateChanged':
                    FB.Facebook._reloadIfSessionStateChanged();
                    break;
                default:
                    FB.FBDebug.logLine(1, 'Invalid app setting key: ' + entry.key);
                    break;
                }
            }
            if (FB.Facebook.appSettings['ifUserConnected'] || FB.Facebook.appSettings['ifUserNotConnected']) {
                FB.Connect.ifUserConnected(FB.Facebook.appSettings['ifUserConnected'], FB.Facebook.appSettings['ifUserNotConnected']);
            }
        },
        get_sessionState: function () {
            return FB.Facebook.get_sessionWaitable();
        },
        get_sessionWaitable: function () {
            FB.FBDebug.assert(FB.Facebook.apiClient, 'Facebook.init() is not called yet');
            return FB.Facebook.apiClient.get_sessionWaitable();
        },
        get_initialized: function () {
            if (!FB.Facebook._initialized) {
                FB.Facebook._initialized = new FB.SimpleWaitable();
            }
            return FB.Facebook._initialized;
        },
        get_baseDomain: function () {
            if (!FB.Facebook._isBaseDomainInitialized) {
                if (FB.Facebook.apiKey) {
                    FB.Facebook._baseDomain = FBIntern.Cookie.getValue('base_domain_' + FB.Facebook.apiKey);
                }
                else {
                    FB.FBDebug.logLine(0, 'Can\'t get BaseDomain property when API key is not set');
                }
            }
            return FB.Facebook._baseDomain;
        },
        set_baseDomain: function (value) {
            FB.Facebook._isBaseDomainInitialized = true;
            if (FB.Sys.isUndefined(value)) {
                FB.Facebook._baseDomain = null;
            }
            else {
                FB.Facebook._baseDomain = value;
            }
            if (FB.Facebook.apiKey) {
                var baseDomainCookie = 'base_domain_' + FB.Facebook.apiKey;
                if (!FB.Facebook._baseDomain) {
                    FBIntern.Cookie.clear(baseDomainCookie, '/', null);
                }
                else {
                    FBIntern.Cookie.set(baseDomainCookie, FB.Facebook._baseDomain, '/', FB.Facebook._baseDomain, 0);
                }
            }
            else {
                throw new Error('Can\'t set BaseDomain property when api key is set');
            }
            return value;
        },
        get_isInCanvas: function () {
            if (FB.Facebook._isInCanvas === -1) {
                FB.Facebook._isInCanvas = window.parent != window && window.location.href.match("fb_sig_in_iframe=1") != null ? 1 : 0;
            }
            var inCanvas = (FB.Facebook._isInCanvas === 1);
            return inCanvas;
        },
        get_isInConnect: function () {
            return FB.Facebook.isInConnect;
        },
        add_initCalled: function (value) {
            FB.Facebook.__initCalled = FB.Delegate.combine(FB.Facebook.__initCalled, value);
        },
        remove_initCalled: function (value) {
            FB.Facebook.__initCalled = FB.Delegate.remove(FB.Facebook.__initCalled, value);
        }
    }
});
FB.Type.createNamespace('FB');
FB.XdHttpRequestServer = FB.Type.createClass({
    ctor: function () {},
    static_ctor: function () {
        FB.XdHttpRequestServer._rootUrl = null;
        FB.XdHttpRequestServer._allowedUrlFilter = null;
        FB.XdHttpRequestServer._allowedUrls = null;
    },
    static: {
        main: function (args) {
            var receiverUrl = args['receiver'];
            if (FB.Sys.containsKey(args, 'allowed_url_filter')) {
                FB.XdHttpRequestServer._allowedUrlFilter = new RegExp(args['allowed_url_filter']);
            }
            if (FB.Sys.containsKey(args, 'allowed_urls')) {
                FB.XdHttpRequestServer._allowedUrls = args['allowed_urls'];
            }
            var rootUri = new FBIntern.Uri(document.URL);
            FB.XdHttpRequestServer._rootUrl = rootUri.get_schemeAndDomain();
            var debugLevel = rootUri.get_queryParameters()['debug_level'];
            if (debugLevel) {
                var level = parseInt(debugLevel);
                if (level > FB.FBDebug.logLevel) {
                    FB.FBDebug.logLevel = level;
                }
            }
            FB.XdComm.Server.singleton.set_receiverUrl(receiverUrl);
            FB.XdComm.Server.singleton.registerDataHandler('http_server', FB.XdHttpRequestServer._onDataReceived);
        },
        _isUrlAllowed: function (url) {
            if (FB.XdHttpRequestServer._allowedUrlFilter && FB.XdHttpRequestServer._allowedUrlFilter.test(url)) {
                return true;
            }
            if (FB.XdHttpRequestServer._allowedUrls) {
                var $enum1 = new FB.ArrayEnumerator(FB.XdHttpRequestServer._allowedUrls);
                while ($enum1.moveNext()) {
                    var allowed_url = $enum1.get_current();
                    if (allowed_url === url) {
                        return true;
                    }
                }
            }
            return false;
        },
        _onDataReceived: function (data, sender) {
            var request_data = data;
            var request = FBIntern.Utility.createXMLHttpRequest();
            var url = request_data[2];
            if (!FB.XdHttpRequestServer._isUrlAllowed(url)) {
                FB.FBDebug.logLine(1, 'URL ' + url + ' is not allowed.');
                return;
            }
            url = FB.XdHttpRequestServer._rootUrl + url;
            FB.FBDebug.logLine(3, 'XdHttpRequestServer: make XHR request to ' + url);
            request.onreadystatechange = function () {
                if (request.readyState === 4) {
                    var result = FB.$create_XdHttpRequestResult(request_data[0], request.status, request.statusText, request.responseText);
                    FB.FBDebug.logLine(3, 'XdHttpRequestServer: send result back http_client');
                    FB.XdComm.Server.singleton.send(sender, 'http_client', result);
                }
            };
            request.open(request_data[1], request_data[2], true);
            var extraHeaders = request_data[4];
            if (extraHeaders) {
                var $dict1 = extraHeaders;
                for (var $key2 in $dict1) {
                    var headerItem = {
                        key: $key2,
                        value: $dict1[$key2]
                    };
                    request.setRequestHeader(headerItem.key, headerItem.value.toString());
                }
            }
            request.send(request_data[3]);
        }
    }
});
FB.FeatureLoader.onScriptLoaded(['Api']);

FB.Type.createNamespace('FB');
FB._contentSizeMethod = FB.Type.createEnum({
    oldMthod: 0,
    newOnlyForFbml: 1,
    newMethod: 2
},
false);
FB.CanvasClient = FB.Type.createClass({
    ctor: function () {},
    static_ctor: function () {
        FB.CanvasClient.serverReceiverUrl = FBIntern.Utility.getFacebookUrl((FBIntern.Utility.isSecure()) ? 'ssl' : 'static.ak') + 'xd_receiver_v0.4.php?r=' + FBIntern.FbGlobals.get_fB_StaticResourceVersions()['www_channel'];
        FB.CanvasClient.allowWidthChange = false;
        FB.CanvasClient.__windowSizeChangedCallback = null;
        FB.CanvasClient._rpcClient = null;
        FB.CanvasClient._rpcServer = null;
        FB.CanvasClient._lastSize = FB.$create_Size(-1, -1);
        FB.CanvasClient._timer = -1;
        FB.CanvasClient._timerInternal = 100;
        FB.CanvasClient._modifyBodyStyle = true;
        FB.CanvasClient._urlHandler = FB.CanvasClient.defaultUrlHandler;
        FB.CanvasClient._allowCallback = null;
        FB.CanvasClient._cancelCallback = null;
        FB.CanvasClient._feedCallback = null;
        FB.CanvasClient._isRenderFbml = false;
        FB.CanvasClient._allowCallback = function (ignore) {};
        FB.CanvasClient._cancelCallback = Delegate.Null;
        FB.CanvasClient._feedCallback = Delegate.Null;
    },
    static: {
        _ensureRpcClient: function () {
            if (!FB.CanvasClient._rpcClient) {
                FB.CanvasClient._rpcClient = new FB.XdComm.XdRpcClient('iframeOuterServer', 'iframeInnerClient', new FB.XdComm.EndPoint(null, FB.XdComm.PageRelation.parent, FB.CanvasClient.serverReceiverUrl));
            }
        },
        run: function () {
            if (!FB.CanvasClient._rpcServer) {
                var methodMap = {
                    loadNewUrl: FB.XdComm.$create_XdRpcMethodInfo(FB.CanvasClient.loadNewUrl, null),
                    loginResponse: FB.XdComm.$create_XdRpcMethodInfo(FB.CanvasClient.loginResponse, null),
                    feedResponse: FB.XdComm.$create_XdRpcMethodInfo(FB.CanvasClient.feedResponse, null)
                };
                var serverName = 'iframeInnerServer';
                FB.CanvasClient._rpcServer = new FB.XdComm.XdRpcServer(serverName, methodMap);
                FB.CanvasClient._rpcClient.send('setInnerReceiver', {
                    receiverUrl: FB.XdComm.Server.singleton.get_receiverUrl()
                },
                null);
            }
        },
        get_timerInterval: function () {
            return FB.CanvasClient._timerInternal;
        },
        set_timerInterval: function (value) {
            FB.CanvasClient._timerInternal = value;
            return value;
        },
        startTimerToSizeToContent: function () {
            FB.FBDebug.logLine(4, 'CanvasClient: StartTimerToSizeToContent');
            FB.CanvasClient.setSizeToContent();
            if (FB.CanvasClient._timer === -1) {
                FB.CanvasClient._timer = window.setInterval(FB.CanvasClient.setSizeToContent, FB.CanvasClient._timerInternal);
            }
        },
        stopTimerToSizeToContent: function () {
            if (FB.CanvasClient._timer !== -1) {
                window.clearInterval(FB.CanvasClient._timer);
                FB.CanvasClient._timer = -1;
            }
        },
        setSizeToContent: function () {
            if (FB.CanvasClient.get__isInDialog()) {
                FB.CanvasClient._sizeDialogToContent();
                return;
            }
            var docElement = document.documentElement;
            if (FB.CanvasClient._modifyBodyStyle) {
                docElement.style.overflow = 'hidden';
            }
            var size = FB.CanvasClient._computeContentSize();
            if (FB.CanvasClient.allowWidthChange) {
                if (size.w !== FB.CanvasClient._lastSize.w || size.h !== FB.CanvasClient._lastSize.h) {
                    FB.CanvasClient._lastSize = size;
                    FB.CanvasClient._setCanvasSize(size.w.toString() + 'px', size.h.toString() + 'px', null);
                }
            }
            else if (size.h !== FB.CanvasClient._lastSize.h) {
                FB.CanvasClient._lastSize = size;
                FB.CanvasClient.setCanvasHeight(size.h.toString() + 'px', null);
            }
        },
        _sizeDialogToContent: function () {
            var docViewSize = FBIntern.Utility.get_windowSize();
            var docSize = FBIntern.Utility.get_documentSize();
            var hOffset = docSize.h - docViewSize.h;
            var wOffset = docSize.w - docViewSize.w;
            if (hOffset || wOffset) {
                FB.FBDebug.logLine(2, FB.Sys.format('CanvasClient: resize dialog by ({0}, {1})', wOffset, hOffset));
                try {
                    window.resizeBy(wOffset, hOffset);
                }
                catch($e1) {
                    FB.FBDebug.logLine(2, FB.Sys.format('CanvasClient: resize faield'));
                }
            }
        },
        setCanvasHeight: function (height, callback) {
            FB.FBDebug.logLine(2, 'CanvasClient: set canvas height to ' + height);
            FB.CanvasClient._ensureRpcClient();
            FB.CanvasClient._rpcClient.send('setCanvasHeight', height, callback);
        },
        _setCanvasSize: function (width, height, callback) {
            FB.FBDebug.logLine(2, FB.Sys.format('CanvasClient: set canvas size to {0}, {1}', width, height));
            FB.CanvasClient._ensureRpcClient();
            FB.CanvasClient._rpcClient.send('setCanvasSize', {
                w: width,
                h: height
            },
            callback);
        },
        getCanvasInfo: function (callback) {
            FB.CanvasClient._ensureRpcClient();
            FB.CanvasClient._rpcClient.send('getCanvasInfo', null, callback);
        },
        scrollTo: function (x, y, callback) {
            FB.CanvasClient._ensureRpcClient();
            FB.CanvasClient._rpcClient.send('scrollTo', FB.$create_Point(x, y), callback);
        },
        changeUrlSuffix: function (suffix, callback) {
            FB.CanvasClient._ensureRpcClient();
            FB.CanvasClient._rpcClient.send('changeUrlSuffix', suffix, callback);
        },
        syncUrl: function () {
            FB.CanvasClient._ensureRpcClient();
            var curUrl = document.location;
            FB.CanvasClient._rpcClient.send('refreshUrl', curUrl, null);
            FB.CanvasClient.run();
        },
        requireLogin: function (allow, cancel) {
            FB.CanvasClient._ensureRpcClient();
            FB.CanvasClient.run();
            FB.CanvasClient._allowCallback = allow;
            FB.CanvasClient._cancelCallback = cancel;
            FB.CanvasClient._rpcClient.send('requireLogin', null, null);
        },
        closeLogin: function () {
            FB.CanvasClient._ensureRpcClient();
            FB.CanvasClient.run();
            FB.CanvasClient._rpcClient.send('closeLogin', null, null);
        },
        loginResponse: function (arg, senderEndPoint) {
            if (arg) {
                FB.CanvasClient._allowCallback(arg);
            }
            else {
                FB.CanvasClient._cancelCallback();
            }
            return null;
        },
        showFeedDialog: function (template_bundle_id, template_data, body_general, target_id, callback, user_message_prompt, user_message) {
            FB.CanvasClient._ensureRpcClient();
            FB.CanvasClient.run();
            FB.CanvasClient._feedCallback = callback;
            var args = {
                template_bundle_id: template_bundle_id,
                template_data: template_data,
                body_general: body_general,
                target_id: target_id,
                user_message_prompt: user_message_prompt,
                user_message: user_message
            };
            FB.CanvasClient._rpcClient.send('showFeedDialog', args, null);
        },
        feedResponse: function (arg, senderEndPoint) {
            FB.CanvasClient._feedCallback();
            return null;
        },
        setUrlHandler: function (urlHandler) {
            FB.CanvasClient._urlHandler = urlHandler;
        },
        loadNewUrl: function (arg, senderEndPoint) {
            var url = arg;
            FB.FBDebug.logLine(2, FB.Sys.format('CanvasClient: set internal url to  {0}', url));
            FB.CanvasClient._urlHandler(url);
            return null;
        },
        defaultUrlHandler: function (url) {
            window.location.replace(url);;
        },
        go: function (url) {
            FB.CanvasClient._ensureRpcClient();
            FB.CanvasClient._rpcClient.send('goURI', url, null);
        },
        add_windowSizeChanged: function (value) {
            var rpcEventAttachedAlready = FB.CanvasClient.__windowSizeChangedCallback;
            FB.CanvasClient.add__windowSizeChangedCallback(value);
            if (!rpcEventAttachedAlready) {
                FB.CanvasClient._ensureRpcClient();
                FB.CanvasClient._rpcClient.send('attachToWindowResizeEvent', null, FB.CanvasClient._onRpcCompleted);
            }
        },
        remove_windowSizeChanged: function (value) {
            FB.CanvasClient.remove__windowSizeChangedCallback(value);
        },
        _onRpcCompleted: function (result) {
            if (FB.CanvasClient.__windowSizeChangedCallback) {
                FB.CanvasClient.__windowSizeChangedCallback(result);
            }
        },
        _computeContentSize: function () {
            var body = document.body;
            var docElement = document.documentElement;
            var right = 0;
            var bottom;
            var computeMethod = FBIntern.Utility.getSiteVar('canvas_client_compute_content_size_method', FB._contentSizeMethod.oldMthod);
            if ((computeMethod === FB._contentSizeMethod.newOnlyForFbml && FB.CanvasClient._isRenderFbml) || computeMethod === FB._contentSizeMethod.newMethod) {
                bottom = Math.max(Math.max(body.offsetHeight, body.scrollHeight) + body.offsetTop, Math.max(docElement.offsetHeight, docElement.scrollHeight) + docElement.offsetTop);
            }
            else { if (FBIntern.AppInfo.get_singleton().get_hostInfo().get_hostName() === FBIntern.HostName.IE) {
                    bottom = Math.max(body.offsetHeight, body.scrollHeight) + body.offsetTop;
                }
                else {
                    bottom = docElement.offsetHeight + docElement.offsetTop;
                }
            }
            if (FB.CanvasClient._isRenderFbml) {
                var dialog_table = FB.$('pop_dialog_table');
                if (dialog_table) {
                    var dialog_bottom = Rect.getElementBounds(dialog_table).b;
                    bottom = Math.max(bottom, dialog_bottom);
                }
            }
            if (FB.CanvasClient.allowWidthChange) {
                if (body.offsetWidth < body.scrollWidth) {
                    right = body.scrollWidth + body.offsetLeft;
                }
                else {
                    var children = body.childNodes;
                    right = 0;
                    for (var i = 0; i < children.length; i++) {
                        var child = children[i];
                        var childRight = child.offsetWidth + child.offsetLeft;
                        if (childRight > right) {
                            right = childRight;
                        }
                    }
                }
                if (docElement.clientLeft > 0) {
                    right += (docElement.clientLeft * 2);
                }
                if (docElement.clientTop > 0) {
                    bottom += (docElement.clientTop * 2);
                }
            }
            return FB.$create_Size(right, bottom);
        },
        get__isInDialog: function () {
            return window.opener && window.opener !== window.self;
        },
        add__windowSizeChangedCallback: function (value) {
            FB.CanvasClient.__windowSizeChangedCallback = FB.Delegate.combine(FB.CanvasClient.__windowSizeChangedCallback, value);
        },
        remove__windowSizeChangedCallback: function (value) {
            FB.CanvasClient.__windowSizeChangedCallback = FB.Delegate.remove(FB.CanvasClient.__windowSizeChangedCallback, value);
        }
    }
});
FB.Type.createNamespace('FB.IFrameUtil');
FB.IFrameUtil._resizeUtil = FB.Type.createClass({
    ctor: function (allowWidthChange) {
        this.allowWidthChange = allowWidthChange;
    },
    instance: {
        setCanvasHeight: function (arg, senderEndPoint) {
            var height = arg;
            FB.FBDebug.logLine(2, 'ResizeUtil: set canvas height to ' + height);
            if (!height) {
                FB.FBDebug.logLine(1, 'Called ResizeUtil.SetCanvasHeight() with invalid input paramters.');
            }
            else {
                var iframe = this.getIFrameElement(senderEndPoint.frameName);
                if (iframe) {
                    iframe.style.height = height;
                }
            }
            return null;
        },
        setCanvasSize: function (arg, senderEndPoint) {
            var parameters = arg;
            var width = parameters['w'];
            var height = parameters['h'];
            FB.FBDebug.logLine(2, FB.Sys.format('ResizeUtil: set canvas size to {0}, {1}', width, height));
            if (height) {
                var iframe = this.getIFrameElement(senderEndPoint.frameName);
                if (iframe) {
                    iframe.style.height = height;
                }
            }
            if (width) {
                if (this.allowWidthChange) {
                    var iframe = this.getIFrameElement(senderEndPoint.frameName);
                    if (iframe) {
                        iframe.style.width = width;
                    }
                }
                else {
                    FB.FBDebug.logLine(1, 'Iframe width change is disallowed.');
                }
            }
            return null;
        },
        getIFrameElement: function (senderIframeName) {
            var iframes = document.getElementsByTagName('iframe');
            for (var i = 0; i < iframes.length; i++) {
                var iframe = iframes[i];
                if (iframe.name === senderIframeName) {
                    return iframe;
                }
            }
            return null;
        },
        allowWidthChange: false
    }
});
FB.IFrameUtil._canvasUtil = FB.Type.createClass({
    base: FB.IFrameUtil._resizeUtil,
    ctor: function (allowWidthChange) {
        FB.IFrameUtil._canvasUtil.constructBase(this, [allowWidthChange]);
    },
    instance: {
        getCanvasInfo: function (arg, senderEndPoint) {
            var iframe = this.getIFrameElement(senderEndPoint.frameName);
            if (iframe) {
                var viewPortVec = Vector2.getViewportDimensions();
                var docVec = Vector2.getDocumentDimensions();
                var scrollVec = Vector2.getScrollPosition(null);
                var iframePosVect = Vector2.getElementPosition(iframe, 'document');
                var result = {
                    window: {
                        w: viewPortVec.x,
                        h: viewPortVec.y
                    },
                    page: {
                        w: docVec.x,
                        h: docVec.y
                    },
                    scrollPos: {
                        x: scrollVec.x,
                        y: scrollVec.y
                    },
                    canvas: {
                        w: iframe.offsetWidth,
                        h: iframe.offsetHeight
                    },
                    canvasPos: {
                        x: iframePosVect.x,
                        y: iframePosVect.y
                    }
                };
                return result;
            }
            else {
                return null;
            }
        },
        changeUrlSuffix: function (arg, senderEndPoint) {
            var suffix = arg;
            PlatformCanvasController.singleton.changeUrlSuffix(suffix, false);
            return null;
        },
        refreshUrl: function (arg, senderEndPoint) {
            var url = arg;
            PlatformCanvasController.refreshUrl(url);
            return null;
        },
        scrollTo: function (arg, senderEndPoint) {
            var pos = arg;
            var vector = new Vector2(pos.x, pos.y, 'document');
            DOMScroll.scrollTo(vector, false);
            return null;
        },
        attachToWindowResizeEvent: function (arg, callback, senderEndPoint) {
            this.add_windowSizeChangedCallback(callback);
            FBIntern.Utility.addEventListener(window.self, 'resize', FB.Delegate.create(this, function (e) {
                if (this.__windowSizeChangedCallback$1) {
                    var canvasInfo = this.getCanvasInfo(null, senderEndPoint);
                    this.__windowSizeChangedCallback$1(canvasInfo);
                }
            }));
        },
        requireLogin: function (arg, callback, senderEndPoint) {
            PlatformCanvasController.singleton.requireLogin();
        },
        goURI: function (arg, callback, senderEndPoint) {
            var url = arg;
            PlatformCanvasController.singleton.goURI(url);
        },
        closeLogin: function (arg, callback, senderEndPoint) {
            PlatformCanvasController.singleton.closeLogin();
        },
        showFeedDialog: function (arg, callback, senderEndPoint) {
            var args = arg;
            PlatformCanvasController.singleton.showFeedDialog(args['template_bundle_id'], args['template_data'], args['body_general'], args['target_id'], args['user_message_prompt'], args['user_message']);
        },
        add_windowSizeChangedCallback: function (value) {
            this.__windowSizeChangedCallback$1 = FB.Delegate.combine(this.__windowSizeChangedCallback$1, value);
        },
        remove_windowSizeChangedCallback: function (value) {
            this.__windowSizeChangedCallback$1 = FB.Delegate.remove(this.__windowSizeChangedCallback$1, value);
        },
        __windowSizeChangedCallback$1: null
    }
});
FB.IFrameUtil.CanvasUtilServer = FB.Type.createClass({
    ctor: function () {},
    static_ctor: function () {
        FB.IFrameUtil.CanvasUtilServer._rpcServer = null;
        FB.IFrameUtil.CanvasUtilServer._rpcClient = null;
        FB.IFrameUtil.CanvasUtilServer._canvasUtil = null;
    },
    static: {
        run: function (allowWidthChange) {
            if (!FB.IFrameUtil.CanvasUtilServer._rpcServer) {
                FB.IFrameUtil.CanvasUtilServer._canvasUtil = new FB.IFrameUtil._canvasUtil(allowWidthChange);
                var methodMap = {
                    setCanvasHeight: FB.XdComm.$create_XdRpcMethodInfo(FB.Delegate.create(FB.IFrameUtil.CanvasUtilServer._canvasUtil, FB.IFrameUtil.CanvasUtilServer._canvasUtil.setCanvasHeight), null),
                    setCanvasSize: FB.XdComm.$create_XdRpcMethodInfo(FB.Delegate.create(FB.IFrameUtil.CanvasUtilServer._canvasUtil, FB.IFrameUtil.CanvasUtilServer._canvasUtil.setCanvasSize), null),
                    getCanvasInfo: FB.XdComm.$create_XdRpcMethodInfo(FB.Delegate.create(FB.IFrameUtil.CanvasUtilServer._canvasUtil, FB.IFrameUtil.CanvasUtilServer._canvasUtil.getCanvasInfo), null),
                    scrollTo: FB.XdComm.$create_XdRpcMethodInfo(FB.Delegate.create(FB.IFrameUtil.CanvasUtilServer._canvasUtil, FB.IFrameUtil.CanvasUtilServer._canvasUtil.scrollTo), null),
                    changeUrlSuffix: FB.XdComm.$create_XdRpcMethodInfo(FB.Delegate.create(FB.IFrameUtil.CanvasUtilServer._canvasUtil, FB.IFrameUtil.CanvasUtilServer._canvasUtil.changeUrlSuffix), null),
                    refreshUrl: FB.XdComm.$create_XdRpcMethodInfo(FB.Delegate.create(FB.IFrameUtil.CanvasUtilServer._canvasUtil, FB.IFrameUtil.CanvasUtilServer._canvasUtil.refreshUrl), null),
                    setInnerReceiver: FB.XdComm.$create_XdRpcMethodInfo(FB.IFrameUtil.CanvasUtilServer.setInnerReceiver, null),
                    attachToWindowResizeEvent: FB.XdComm.$create_XdRpcMethodInfo(null, FB.Delegate.create(FB.IFrameUtil.CanvasUtilServer._canvasUtil, FB.IFrameUtil.CanvasUtilServer._canvasUtil.attachToWindowResizeEvent)),
                    requireLogin: FB.XdComm.$create_XdRpcMethodInfo(null, FB.Delegate.create(FB.IFrameUtil.CanvasUtilServer._canvasUtil, FB.IFrameUtil.CanvasUtilServer._canvasUtil.requireLogin)),
                    closeLogin: FB.XdComm.$create_XdRpcMethodInfo(null, FB.Delegate.create(FB.IFrameUtil.CanvasUtilServer._canvasUtil, FB.IFrameUtil.CanvasUtilServer._canvasUtil.closeLogin)),
                    goURI: FB.XdComm.$create_XdRpcMethodInfo(null, FB.Delegate.create(FB.IFrameUtil.CanvasUtilServer._canvasUtil, FB.IFrameUtil.CanvasUtilServer._canvasUtil.goURI)),
                    showFeedDialog: FB.XdComm.$create_XdRpcMethodInfo(null, FB.Delegate.create(FB.IFrameUtil.CanvasUtilServer._canvasUtil, FB.IFrameUtil.CanvasUtilServer._canvasUtil.showFeedDialog))
                };
                FB.FBDebug.assert(FB.XdComm.Server.singleton.get_receiverUrl(), 'FB.XdComm.Server not initialized');
                FB.IFrameUtil.CanvasUtilServer._rpcServer = new FB.XdComm.XdRpcServer('iframeOuterServer', methodMap);
            }
            else if (allowWidthChange && !FB.IFrameUtil.CanvasUtilServer._canvasUtil.allowWidthChange) {
                FB.IFrameUtil.CanvasUtilServer._canvasUtil.allowWidthChange = true;
            }
        },
        setInnerReceiver: function (args, senderEndPoint) {
            var dict = args;
            FB.FBDebug.logLine(2, FB.Sys.format('CanvasClient: set innner url to  {0}', dict['receiverUrl']));
            FB.IFrameUtil.CanvasUtilServer.refreshRpcClient(dict['receiverUrl']);
            return null;
        },
        loadNewUrl: function (url) {
            FB.IFrameUtil.CanvasUtilServer.ensureRpcClient();
            FB.IFrameUtil.CanvasUtilServer._rpcClient.send('loadNewUrl', url, null);
        },
        loginResponse: function (loggedIn, sigParams) {
            FB.IFrameUtil.CanvasUtilServer.ensureRpcClient();
            if (!loggedIn) {
                FB.IFrameUtil.CanvasUtilServer._rpcClient.send('loginResponse', null, null);
            }
            else {
                FB.IFrameUtil.CanvasUtilServer._rpcClient.send('loginResponse', sigParams, null);
            }
        },
        feedResponse: function () {
            FB.IFrameUtil.CanvasUtilServer.ensureRpcClient();
            FB.IFrameUtil.CanvasUtilServer._rpcClient.send('feedResponse', null, null);
        },
        refreshRpcClient: function (innerReceiverUrl) {
            FB.FBDebug.assert(innerReceiverUrl, 'Inner receiver url is null.');
            if (FB.IFrameUtil.CanvasUtilServer._rpcClient) {
                FB.IFrameUtil.CanvasUtilServer._rpcClient.detachClient();
            }
            var uniqEndPoint = new FB.XdComm.EndPoint('iframe_canvas', FB.XdComm.PageRelation.child, innerReceiverUrl);
            uniqEndPoint.UID = Math.floor(Math.random() * 1000000);
            FB.IFrameUtil.CanvasUtilServer._rpcClient = new FB.XdComm.XdRpcClient('iframeInnerServer', 'iframeOuterClient', uniqEndPoint);
        },
        ensureRpcClient: function () {
            FB.FBDebug.assert(FB.IFrameUtil.CanvasUtilServer._rpcClient, 'Inner iframe server not ready.');
        }
    }
});
FB.IFrameUtil.ResizeUtilServer = FB.Type.createClass({
    ctor: function () {},
    static: {
        run: function () {
            FB.IFrameUtil.CanvasUtilServer.run(true);
        }
    }
});
FB.FeatureLoader.onScriptLoaded(['CanvasUtil']);

FB.Type.createNamespace('FB');
FB.RequireConnect = FB.Type.createEnum({
    doNotRequire: 0,
    require: 1,
    promptConnect: 2
},
false);
FB.DialogType = FB.Type.createEnum({
    popUp: 0,
    iframe: 1,
    canvas: 2
},
false);
FB.FeedDialogInfo = FB.Type.createClass({
    ctor: function (parameters, callback, showLoginDialog) {
        this.parameters = parameters;
        this.callback = callback;
        this.showLoginDialog = showLoginDialog;
    },
    instance: {
        parameters: null,
        callback: null,
        showLoginDialog: false
    }
});
FB.Connect = FB.Type.createClass({
    ctor: function () {
        this._status = new FB.SimpleWaitable();
    },
    static_ctor: function () {
        FB.Connect._singleton = new FB.Connect();
        FB.Connect._logoutMethod_infoDialog = 'info_dialog';
        FB.Connect._logoutMethod_prompt = 'prompt';
        FB.Connect._logoutMethod_noUI = 'no_ui';
        FB.Connect._logoutMethod = FB.Connect._logoutMethod_infoDialog;
        var dictionary_string = '\n     <table id=\"RES_ID_fb_pop_dialog_table\" class=\"fb_pop_dialog_table\">\n       <tr>\n         <td class=\"fb_pop_topleft\"></td>\n         <td class=\"fb_pop_border\"></td>\n         <td class=\"fb_pop_topright\"></td>\n       </tr>\n       <tr>\n         <td class=\"fb_pop_border\"></td>\n         <td class=\"fb_pop_content\" id=\"pop_content\">\n           <div class =\"fb_pop_content_container\">\n              <h2 class=\"fb_resetstyles\">\n                <div class=\"fb_dialog_icon\"></div>\n                <span class=\"fb_dialog_header\" id=\"fb_dialog_header\"></span>\n                <div class=\"fb_dialog_loading_spinner\" id=\"fb_dialog_loading_spinner\">&nbsp;</div>\n                <a id=\"fb_dialog_cancel_button\" class=\"fb_dialog_cancel_button\" title=\"close dialog\" href=\"#\" onclick=\"return false;\">&nbsp;</a>\n              </h2>\n              <div id=\"fb_dialog_content\" class=\"fb_dialog_content\"></div>\n           </div>\n         </td>\n         <td class=\"fb_pop_border\"></td>\n       </tr>\n       <tr>\n         <td class=\"fb_pop_bottomleft\"></td>\n         <td class=\"fb_pop_border\"></td>\n         <td class=\"fb_pop_bottomright\"></td>\n       </tr>\n    </table>\n    <div id=\"RES_ID_fb_logout_confirmation\" class=\"fb_logout_confirm_content\">\n      <div class=\"fb_confirmation_stripes\"></div>\n      <div class=\"fb_confirmation_content\">';
        dictionary_string += '<p>' + FBIntern.Intl._tx("Do you want to log out of both this site and Facebook?") + '</p>';
        dictionary_string += '\n      </div>\n      <div class=\"fb_dialog_buttons\">';
        dictionary_string += '<input id=\"fb_confirm\" type=\"button\" ' + 'class=\"fb_inputsubmit\" value=\"' + FBIntern.Intl._tx("Log out") + '\"/>';
        dictionary_string += '<input id=\"fb_cancel\" type=\"button\" ' + 'class=\"fb_inputbutton fb_inputaux\" value=\"' + FBIntern.Intl._tx("Cancel") + '\"/>';
        dictionary_string += '\n        </div>\n    </div>\n    <div id=\"RES_ID_fb_logout_info\" class=\"fb_logout_confirm_content\">\n      <div class=\"fb_confirmation_stripes\"></div>\n      <div class=\"fb_confirmation_content\">';
        dictionary_string += '<p>' + FBIntern.Intl._tx("You are logging out of both this site and Facebook.") + '</p>';
        dictionary_string += '\n      </div>\n      <div class=\"fb_dialog_buttons\">';
        dictionary_string += '<input id=\"fb_confirm\" type=\"button\" ' + 'class=\"fb_inputsubmit\" value=\"' + FBIntern.Intl._tx("Close") + '\"/>';
        dictionary_string += '\n       </div>\n   </div>';
        FB.UI.DomResources.addResourceDict(new FB.UI.DomResDict(dictionary_string));
    },
    static: {
        get_status: function () {
            var singleton = FB.Connect._singleton;
            singleton._ensureQueryStatus();
            return singleton._status;
        },
        _getLogoutUrl: function (next) {
            var q_params = {
                api_key: FB.Facebook.apiKey,
                session_key: FB.Facebook.apiClient.get_session().session_key,
                extern: FB.Connect._singleton.get__isInConnect(),
                next: next
            };
            return FBIntern.Utility.createFacebookUrl('www', 'logout.php', q_params, false);
        },
        logout: function (callback) {
            FB.Connect._handleLogout(callback, function (logoutConfirmed) {
                if (logoutConfirmed) {
                    var singleton = FB.Connect._singleton;
                    var guid = FB.XdComm.Server.singleton.get_GUID();
                    var nextUrl = FBIntern.Uri.addQueryParameters(FB.XdComm.Server.singleton.get_receiverUrl(), 'fb_login&fname=_parent&guid=' + guid + '&session=loggedout');
                    singleton._ensureLoginHandler();
                    singleton._logoutCallback = callback;
                    var logoutUrl = FB.Connect._getLogoutUrl(nextUrl);
                    singleton._logoutIframe = FB.XdComm.Server.singleton.createNamedHiddenIFrame('fbLogout', logoutUrl, 'fb_logout', null);
                }
                else if (callback) {
                    callback(false);
                }
            });
        },
        logoutAndRedirect: function (redirectUrl) {
            FB.Connect._handleLogout(null, function (logoutConfirmed) {
                if (logoutConfirmed) {
                    var singleton = FB.Connect._singleton;
                    var nextUrl = FBIntern.Uri.create(new FBIntern.Uri(document.URL), redirectUrl).get_uriString();
                    var logoutUrl = FB.Connect._getLogoutUrl(nextUrl);
                    singleton.set__userInfo(null);
                    FB.Facebook.apiClient.set_session(null);
                    window.location = logoutUrl;;
                }
            });
        },
        ifUserConnected: function (connectedArg, notConnectedArg) {
            FB.Connect.get_status().waitForCondition(function (status) {
                FB.Connect._handleConnectStateLogout(connectedArg, notConnectedArg, status);
                return false;
            });
        },
        _handleConnectStateLogout: function (connectedArg, notConnectedArg, status) {
            if (status.get_isReady()) {
                window.setTimeout(function () {
                    var isConnected = status.result === FB.ConnectState.connected;
                    FB.Helper.invokeAsCallbackOrRedirect((isConnected) ? connectedArg : notConnectedArg);
                },
                0);
            }
        },
        listenForIframeConnect: function () {
            var singleton = FB.Connect._singleton;
            FB.Facebook.apiClient.get_sessionWaitable().waitUntilReady(FB.Delegate.create(singleton, singleton._apiClient_SessionReady));
        },
        clientConnectSetup: function (callback) {
            var singleton = FB.Connect._singleton;
            FB.Connect.listenForIframeConnect();
            FB.Connect.get_status().add_changed(function (waitable) {
                var newState = FB.Connect.get_status().result;
                callback(newState === FB.ConnectState.connected);
            });
        },
        _handleLogout: function (appCallback, confirmationCallback) {
            FB.Connect.get_status().waitUntilReady(function (result) {
                var session = FB.Facebook.apiClient.get_session();
                if (session) {
                    if (FB.Connect._logoutMethod === FB.Connect._logoutMethod_infoDialog) {
                        FB.Connect._createInfoDialog(confirmationCallback);
                    }
                    else if (FB.Connect._logoutMethod === FB.Connect._logoutMethod_noUI) {
                        confirmationCallback(true);
                    }
                    else {
                        FB.UI.PopupDialog._createConfirmationDialog(FBIntern.Intl._tx("Logging Out of Facebook?"), FB.UI.DomResources.getResourceById('fb_logout_confirmation'), confirmationCallback).show();
                    }
                }
                else {
                    FB.FBDebug.logLine(2, 'Cannot logout because user does not have a session');
                    if (appCallback) {
                        appCallback(false);
                    }
                }
            });
        },
        requireSession: function (callback, onCancelCallback, isUserActionHint) {
            if (arguments.length === 1) {
                if (typeof(callback) !== 'function') {
                    isUserActionHint = (callback);
                    callback = null;
                }
            }
            else if (arguments.length === 2) {
                if (typeof(onCancelCallback) !== 'function') {
                    isUserActionHint = (onCancelCallback);
                    onCancelCallback = null;
                }
            }
            var activeDialog = FB.SessionDialog.getActive();
            if (!activeDialog) {
                activeDialog = FB.SessionDialog.make();
                activeDialog.setIsUserActionHint(isUserActionHint).request();
            }
            else {
                activeDialog.focus();
            }
            if (callback) {
                FB.Connect.get_status().waitForValue(FB.ConnectState.connected, callback);
            }
            if (onCancelCallback) {
                activeDialog.add_cancelled(onCancelCallback);
            }
        },
        _createInfoDialog: function (confirmationCallback) {
            var dialog = null;
            dialog = FB.UI.PopupDialog._createConfirmationDialog(FBIntern.Intl._tx("Logged Out of Facebook"), FB.UI.DomResources.getResourceById('fb_logout_info'), function (result) {
                dialog = null;
            });
            dialog.show();
            dialog.add_closed(function (result) {
                if (confirmationCallback) {
                    confirmationCallback(true);
                }
            });
            window.setTimeout(function () {
                if (dialog) {
                    dialog.close(false);
                }
            },
            2000);
        },
        inviteConnectUsers: function () {
            FB.Facebook.get_sessionWaitable().waitUntilReady(function (result) {
                var dialog = new FB.UI.FBMLPopupDialog(FBIntern.Intl._tx("Invite Your Friends to Connect"), '');
                var closeUrl = dialog._createCrossDomainClosingLink(false);
                dialog.setFBMLContent('<fb:connect-form action=\"' + closeUrl + '\" view=\"dialog\" />');
                dialog.setContentWidth(474);
                dialog.setContentHeight(350);
                dialog.show();
            });
        },
        showPermissionDialog: function (permissions, callback, enableProfileSelector, profileSelectorIds) {
            var effectiveCallback = null;
            if (permissions.indexOf('offline_access') >= 0) {
                effectiveCallback = function (permissionsWasGranted) {
                    if (!FB.Sys.isNullOrEmpty(permissionsWasGranted) && (permissionsWasGranted).indexOf('offline_access') >= 0) {
                        FB.Connect.forceSessionRefresh(function () {
                            if (callback) {
                                callback(permissionsWasGranted);
                            }
                        });
                    }
                    else {
                        callback(permissionsWasGranted);
                    }
                };
            }
            else if (callback) {
                effectiveCallback = callback;
            }
            var q_params = {
                ext_perm: permissions
            };
            if (enableProfileSelector) {
                q_params['enable_profile_selector'] = 1;
            }
            if (profileSelectorIds) {
                var first = true;
                var ids_param = '';
                var $enum1 = new FB.ArrayEnumerator(profileSelectorIds);
                while ($enum1.moveNext()) {
                    var id = $enum1.get_current();
                    if (!first) {
                        ids_param += ',';
                    }
                    ids_param += id;
                    first = false;
                }
                q_params['profile_selector_ids'] = encodeURIComponent(ids_param);
            }
            FB.Connect._showConnectDialog(FBIntern.Intl._tx("Request for Special Permissions"), 'connect/prompt_permissions.php', q_params, 173, 480, effectiveCallback);
        },
        showAddFriendDialog: function (target_id, callback) {
            var effectiveCallback = null;
            if (callback) {
                effectiveCallback = function (booleanStr) {
                    var result = (booleanStr === 'true') ? true : false;
                    callback(result);
                };
            }
            var q_params = {
                id: target_id,
                display: 'dialog'
            };
            FB.Connect._showConnectDialog(FBIntern.Intl._tx("Add Friend"), 'addfriend.php', q_params, -1, 540, effectiveCallback);
        },
        _showConnectDialog: function (title, iframeUrl, iframeParams, height, width, callback) {
            FB.Connect.requireSession(function () {
                FB.IFrameUtil.ResizeUtilServer.run();
                var singleton = FB.Connect._singleton;
                var iframeDom = FB.XdComm.Server.singleton.createNamedHiddenIFrame('dialogContent' + Math.random().toString(), '', 'fb_permission_iframe', null);
                if (height > 0) {
                    iframeDom.style.height = height + 'px';
                }
                singleton._permissionDialog = new FB.UI.PopupDialog(title, iframeDom, true, false);
                singleton._permissionDialog.set_placement(FB.UI.PopupPlacement.topCenter);
                if (width > 0) {
                    singleton._permissionDialog.setContentWidth(width);
                }
                if (callback) {
                    singleton._permissionDialog.add_closed(callback);
                }
                var nextUrl = singleton._permissionDialog._createCrossDomainClosingLink('xxRESULTTOKENxx');
                var channelUrl = FB.XdComm.Server.singleton.get_receiverUrl();
                var q_params = {
                    api_key: FB.Facebook.apiKey,
                    v: FB.Facebook.version,
                    extern: singleton.get__isInConnect(),
                    next: nextUrl,
                    channel_url: channelUrl,
                    dialog_id: encodeURIComponent(singleton._permissionDialog.get_id())
                };
                if (iframeParams) {
                    var $dict1 = iframeParams;
                    for (var $key2 in $dict1) {
                        var entry = {
                            key: $key2,
                            value: $dict1[$key2]
                        };
                        q_params[entry.key] = entry.value;
                    }
                }
                iframeDom.src = FBIntern.Utility.createFacebookUrl('www', iframeUrl, q_params, false);
                singleton._permissionDialog.show();
            });
        },
        createApplication: function (name, callback) {
            FB.Facebook.get_sessionState().waitUntilReady(function (result) {
                FB.IFrameUtil.ResizeUtilServer.run();
                var singleton = FB.Connect._singleton;
                var iframeDom = FB.XdComm.Server.singleton.createNamedHiddenIFrame('dialogContent' + Math.random().toString(), '', 'fb_create_app_iframe', null);
                iframeDom.style.height = '214px';
                iframeDom.style.width = '448px';
                var createAppDialog = new FB.UI.PopupDialog(FBIntern.Intl._tx("Create a new application?"), iframeDom, true, false);
                if (callback) {
                    createAppDialog.add_closed(callback);
                }
                var allowUrl = createAppDialog._createCrossDomainClosingLink('create-app-return-val');
                var denyUrl = createAppDialog._createCrossDomainClosingLink(false);
                var q_params = {
                    api_key: FB.Facebook.apiKey,
                    v: FB.Facebook.version,
                    name: name,
                    next: allowUrl,
                    cancel: denyUrl,
                    channel_url: FB.XdComm.Server.singleton.get_receiverUrl()
                };
                iframeDom.src = FBIntern.Utility.createFacebookUrl('www', 'connect/create_app.php', q_params, false);
                createAppDialog.show();
            });
        },
        pollLoginStatus: function (pollInterval, pollTries, callback) {
            var singleton = FB.Connect._singleton;
            if (singleton.get__userInfo().connectState === FB.ConnectState.connected) {
                if (callback) {
                    callback();
                }
                return;
            }
            singleton._pollTries = pollTries;
            singleton._pollInterval = pollInterval;
            singleton._onConnectedCallback = callback;
            window.setTimeout(function () {
                singleton._refreshQueryStatus();
            },
            singleton._pollInterval);
        },
        forceSessionRefresh: function (callback) {
            var singleton = FB.Connect._singleton;
            ++singleton._pollTries;
            singleton._onConnectedCallback = callback;
            singleton._refreshQueryStatus();
        },
        showAddSectionButton: function (section, element) {
            var singleton = FB.Connect._singleton;
            var parameters = {
                api_key: FB.Facebook.apiKey,
                section: section,
                channel_url: FB.XdComm.Server.singleton.get_receiverUrl(),
                extern: singleton.get__isInConnect()
            };
            var iframeName = 'fb_section' + section;
            var handlerName = 'fbShowAddSection_' + section;
            var iframe = FB.XdComm.Server.singleton.createNamedHiddenIFrame(iframeName, FB.XdComm.Server.singleton.get_receiverUrl(), 'fb_addSection', FB.Sys.format('style=\"width:130px; height:25px\" frameborder=\"0\" allowTransparency=\"true\"'));
            element.appendChild(iframe);
            if (!FB.XdComm.Server.singleton.isDataHandlerRegistered(handlerName)) {
                FB.XdComm.Server.singleton.registerDataHandler(handlerName, function (data, endpoint) {
                    FB.Connect._showAddSectionDialog(data);
                });
            }
            var frameWindow = (window.self.frames)[iframeName];
            singleton._facebookIFrame(frameWindow.document, 'connect/section_button.php', parameters);
        },
        _showAddSectionDialog: function (section) {
            var singleton = FB.Connect._singleton;
            if (singleton._addSectionDialog) {
                return false;
            }
            FB.IFrameUtil.ResizeUtilServer.run();
            var parameters = {
                section: section,
                api_key: FB.Facebook.apiKey,
                channel_url: FB.XdComm.Server.singleton.get_receiverUrl(),
                extern: singleton.get__isInConnect()
            };
            singleton._addSectionNum++;
            var iframeName = 'fb_sectionIFrame_' + singleton._addSectionNum;
            var width = 0;
            var height = 0;
            var title = '';
            if (section === 'info') {
                width = 718;
                height = 350;
                title = FBIntern.Intl._tx("Add application section to your Info tab?");
            }
            else {
                width = 430;
                height = 321;
                title = FBIntern.Intl._tx("Add application to your profile?");
            }
            var iframe = FB.XdComm.Server.singleton.createNamedHiddenIFrame(iframeName, FB.XdComm.Server.singleton.get_receiverUrl(), 'fb_addSection', 'frameborder=\"0\"');
            iframe.style.height = FB.Sys.format('{0}px', height);
            iframe.style.width = FB.Sys.format('{0}px', width);
            var handlerName = 'fbCloseAddSection_' + section;
            singleton._addSectionDialog = FB.Connect._showStandardDialog(title, iframe, width, height);
            singleton._addSectionDialog.add_closed(function (result) {
                singleton._addSectionDialog = null;
            });
            if (!FB.XdComm.Server.singleton.isDataHandlerRegistered(handlerName)) {
                FB.XdComm.Server.singleton.registerDataHandler(handlerName, function (data, end) {
                    singleton._addSectionDialog.close(true);
                });
            }
            FBIntern.Utility.getIFrameDocument(iframeName, iframe, function (iframeDoc) {
                singleton._facebookIFrame(iframeDoc, 'connect/prompt_section.php', parameters);
            });
            return true;
        },
        _sessionlessPublishUserAction: function (template_bundle_id, template_data, target_ids, body_general, story_size, callback, user_message) {
            var singleton = FB.Connect._singleton;
            var feedInfo = {
                template_id: template_bundle_id.toString()
            };
            if (template_data) {
                feedInfo['template_data'] = template_data;
            }
            if (target_ids) {
                feedInfo['target_ids'] = target_ids;
            }
            if (body_general) {
                feedInfo['body_general'] = body_general;
            }
            var handlerName = 'sessionlessPublishCompletedHandler';
            if (!FB.XdComm.Server.singleton.isDataHandlerRegistered(handlerName)) {
                FB.XdComm.Server.singleton.registerDataHandler(handlerName, FB.Connect._onSessionlessPublishCompletedHandler);
            }
            singleton._sessionlessPublishCallback = callback;
            var parameters = {
                feed_info: FB.JSON.serialize(feedInfo),
                api_key: FB.Facebook.apiKey,
                user_message: user_message,
                extern: singleton.get__isInConnect()
            };
            if (callback) {
                parameters['callback'] = FB.XdComm.Server.singleton.createUdpUrl(handlerName, null, new FB.XdComm.EndPoint(null, FB.XdComm.PageRelation.self, FB.XdComm.Server.singleton.get_receiverUrl()));
            }
            if (story_size === FB.FeedStorySize.oneLine || story_size === FB.FeedStorySize.shortStory) {
                parameters['size'] = (story_size).toString();
            }
            singleton._sessionlessFeedFrameNum++;
            var iframeName = 'fb_sessionlessfeedIFrame_' + singleton._sessionlessFeedFrameNum;
            var iframe = FB.XdComm.Server.singleton.createNamedHiddenIFrame(iframeName, FB.XdComm.Server.singleton.get_receiverUrl(), '', '');
            FBIntern.Utility.getIFrameDocument(iframeName, iframe, function (iframeDoc) {
                singleton._facebookIFrame(iframeDoc, 'connect/sessionless_feed.php', parameters);
            });
        },
        _onSessionlessPublishCompletedHandler: function (data, endPoint) {
            var singleton = FB.Connect._singleton;
            if (singleton._sessionlessPublishCallback) {
                singleton._sessionlessPublishCallback();
            }
        },
        streamPublish: function (user_message, attachment, action_links, target_id, user_message_prompt, callback, auto_publish) {
            var singleton = FB.Connect._singleton;
            if (auto_publish && (singleton._userInfo) && (singleton._userInfo.shortStorySetting === FB.FeedStorySetting.autoaccept)) {
                var sequencer = new FB.ImmediateSequencer(function (result, exception) {
                    if (callback) {
                        callback(result, exception);
                    }
                });
                var apiParameters = {};
                apiParameters['message'] = user_message;
                apiParameters['attachment'] = attachment;
                apiParameters['action_links'] = action_links;
                apiParameters['target_id'] = target_id;
                FB.Facebook.apiClient.callMethod('stream.publish', apiParameters, sequencer);
                return true;
            }
            var parameters = {
                message: user_message,
                attachment: attachment,
                action_links: action_links,
                target_id: target_id,
                user_message_prompt: user_message_prompt
            };
            return FB.Connect._ShowFeedDialogGeneric(parameters, FB.RequireConnect.doNotRequire, callback, true);
        },
        showFeedDialog: function (template_bundle_id, template_data, target_id, body_general, story_size, require_connect, callback, user_message_prompt, user_message) {
            var parameters = {
                message: (!user_message) ? '' : user_message['value'],
                template_id: template_bundle_id,
                template_data: template_data,
                body_general: body_general,
                user_message_prompt: user_message_prompt,
                to_ids: target_id
            };
            return FB.Connect._ShowFeedDialogGeneric(parameters, require_connect, callback, false);
        },
        _ShowFeedDialogGeneric: function (parameters, require_connect, callback, showLoginDialog) {
            var singleton = FB.Connect._singleton;
            if (singleton._feedformDialog) {
                if (callback) {
                    callback(null, null);
                }
                return false;
            }
            if (singleton._feedStatusMustBeRefetched) {
                singleton._dialogInfo = new FB.FeedDialogInfo(parameters, callback, showLoginDialog);
                singleton._feedStatusRefetch();
                return true;
            }
            FB.Connect.get_status().waitUntilReady(function (result) {
                var login_state = result;
                if (require_connect === FB.RequireConnect.promptConnect && login_state !== FB.ConnectState.connected) {
                    singleton._dialogInfo = new FB.FeedDialogInfo(parameters, callback, showLoginDialog);
                    FB.Connect.requireSession(null);
                }
                else if (require_connect === FB.RequireConnect.require && login_state !== FB.ConnectState.connected) {
                    callback(null, null);
                }
                else {
                    FB.Connect._prepareFeedDialogParameters(parameters);
                    if (login_state === FB.ConnectState.connected) {
                        parameters['session_key'] = FB.Facebook.apiClient.get_session().session_key;
                    }
                    if (login_state === FB.ConnectState.userNotLoggedIn && showLoginDialog) {
                        FB.Connect._openFeedDialogWindow(parameters, callback);
                    }
                    else if (login_state !== FB.ConnectState.userNotLoggedIn) {
                        FB.Connect._openFeedDialogIframe(parameters, callback);
                    }
                    else {
                        callback(null, null);
                    }
                }
            });
            return true;
        },
        _prepareFeedDialogParameters: function (parameters) {
            var singleton = FB.Connect._singleton;
            parameters['preview'] = 'true';
            parameters['api_key'] = FB.Facebook.apiKey;
            parameters['channel_url'] = FB.XdComm.Server.singleton.get_receiverUrl();
            parameters['extern'] = singleton.get__isInConnect();
            var keys = ['template_data', 'attachment', 'action_links', 'to_ids'];
            var $enum1 = new FB.ArrayEnumerator(keys);
            while ($enum1.moveNext()) {
                var key = $enum1.get_current();
                if (parameters[key]) {
                    parameters[key] = encodeURIComponent(FB.JSON.serialize(parameters[key]));
                }
            }
            var $dict2 = parameters;
            for (var $key3 in $dict2) {
                var entry = {
                    key: $key3,
                    value: $dict2[$key3]
                };
                if (!parameters[entry.key]) {
                    delete parameters[entry.key];
                }
            }
        },
        _openFeedDialogWindow: function (parameters, callback) {
            FB.XdComm.Server.registerSimpleHandler('login', function (data) {
                FB.Connect.forceSessionRefresh(function () {});
            });
            FB.XdComm.Server.registerSimpleHandler('fbPublishPopup', function (data) {
                if (window.fbDialog) {
                    window.fbDialog.close();
                    window.fbDialog = null;
                };
                callback(data, null);
            });
            var queryString = FBIntern.Uri.createQueryString(parameters);
            window.fbDialog = window.open('http://www.facebook.com/connect/prompt_feed.php?' + queryString, 'sharer', 'toolbar=0,status=0,width=600,height=388');;
        },
        _openFeedDialogIframe: function (parameters, callback) {
            FB.IFrameUtil.CanvasUtilServer.run(false);
            var singleton = FB.Connect._singleton;
            singleton._feedformNum++;
            var iframeName = 'fb_feedIFrame_' + singleton._feedformNum;
            var switchUserHandlerName = 'switchUser';
            FB.XdComm.Server.registerSimpleHandler(switchUserHandlerName, function (data) {
                singleton.switchUser();
            });
            var switchUserUrl = FB.XdComm.Server.singleton.createUdpUrl(switchUserHandlerName, null, new FB.XdComm.EndPoint(null, FB.XdComm.PageRelation.self, FB.XdComm.Server.singleton.get_receiverUrl()));
            parameters['switch_user_url'] = switchUserUrl;
            var iframe = FB.XdComm.Server.singleton.createNamedHiddenIFrame(iframeName, FB.XdComm.Server.singleton.get_receiverUrl(), 'fb_feedIFrame', 'frameborder=\"0\"');
            var to_ids = parameters['to_ids'];
            var hasTarget = to_ids && to_ids.length > 0;
            var dialogTitle;
            if (hasTarget) {
                dialogTitle = FBIntern.Intl._tx("Publish this story to your friend's Facebook Wall?");
            }
            else {
                dialogTitle = FBIntern.Intl._tx("Publish this story to your Facebook Wall and your friends' home pages?");
            }
            singleton._feedformDialog = new FB.UI.PopupDialog(dialogTitle, iframe, true, true);
            singleton._feedformDialog.set_placement(FB.UI.PopupPlacement.topCenter);
            var callbackUrl = singleton._feedformDialog._createCrossDomainClosingLink('xxRESULTTOKENxx');
            parameters['callback'] = callbackUrl;
            singleton._feedformDialog.add_closed(function (closingResult) {
                singleton._feedformDialog = null;
                if (callback) {
                    if (closingResult === 'xxRESULTTOKENxx') {
                        closingResult = null;
                    }
                    callback(closingResult, null);
                }
            });
            parameters['in_iframe'] = 1;
            singleton._feedformDialog.setContentWidth(600);
            singleton._feedformDialog.show();
            FBIntern.Utility.getIFrameDocument(iframeName, iframe, function (iframeDoc) {
                singleton._facebookIFrame(iframeDoc, 'connect/prompt_feed.php', parameters);
            });
        },
        showShareDialog: function (url, callback) {
            var singleton = FB.Connect._singleton;
            if (singleton._shareDialog) {
                callback();
            }
            FB.Connect.get_status().waitUntilReady(function (result) {
                var login_state = result;
                if (login_state === FB.ConnectState.userNotLoggedIn) {
                    window.open('http://www.facebook.com/sharer.php?u=' + encodeURIComponent(url), 'sharer', 'toolbar=0,status=0,width=626,height=436');;
                }
                else {
                    var iframeName = 'fb_share_iframe';
                    var iframe = FB.XdComm.Server.singleton.createNamedHiddenIFrame(iframeName, FB.XdComm.Server.singleton.get_receiverUrl(), 'fb_shareIFrame', 'frameborder=\"0\"');
                    var title = FBIntern.Intl._tx("Share this story?");
                    singleton._shareDialog = new FB.UI.PopupDialog(title, iframe, true, true);
                    singleton._shareDialog.set_placement(FB.UI.PopupPlacement.topCenter);
                    singleton._shareDialog.add_closed(function (closingResult) {
                        singleton._shareDialog = null;
                        if (callback) {
                            callback();
                        }
                    });
                    var closeUrl = singleton._shareDialog._createCrossDomainClosingLink(false);
                    singleton._shareDialog.setContentWidth(630);
                    singleton._shareDialog.setContentHeight(400);
                    singleton._shareDialog.show();
                    FBIntern.Utility.getIFrameDocument(iframeName, iframe, function (iframeDoc) {
                        singleton._facebookIFrame(iframeDoc, 'sharer.php?u=' + encodeURIComponent(url) + '&connect', {
                            channel_url: FB.XdComm.Server.singleton.get_receiverUrl(),
                            close_url: closeUrl,
                            extern: singleton.get__isInConnect()
                        });
                    });
                }
            });
        },
        showBookmarkDialog: function (callback) {
            FB.Connect.requireSession(function () {
                var iframe = FB.XdComm.Server.singleton.createNamedHiddenIFrame('fb_bookmark_iframe', FB.XdComm.Server.singleton.get_receiverUrl(), 'fb_bookmarkIFrame', null);
                var bookmarkDialog = new FB.UI.PopupDialog(FBIntern.Intl._tx("Bookmark Application"), iframe, true, false);
                bookmarkDialog.set_placement(FB.UI.PopupPlacement.topCenter);
                if (callback) {
                    bookmarkDialog.add_closed(function (result) {
                        callback();
                    });
                }
                bookmarkDialog.setContentWidth(430);
                bookmarkDialog.setContentHeight(100);
                var closeUrl = bookmarkDialog._createCrossDomainClosingLink(false);
                var q_params = {
                    api_key: FB.Facebook.apiKey,
                    channel_url: FB.XdComm.Server.singleton.get_receiverUrl(),
                    close_url: closeUrl,
                    extern: FB.Connect._singleton.get__isInConnect(),
                    session_key: FB.Facebook.apiClient.get_session().session_key,
                    v: FB.Facebook.version
                };
                iframe.src = FBIntern.Utility.createFacebookUrl('connect', 'connect/bookmark.php', q_params, false);
                bookmarkDialog.show();
            });
        },
        get_loggedInUser: function () {
            var session = FB.Facebook.apiClient.get_session();
            return (session) ? session.uid : null;
        },
        getSignedPublicSessionData: function (callback) {
            var singleton = FB.Connect._singleton;
            FB.Connect.get_status().waitUntilReady(function (status) {
                if (singleton._publicSessionData && FB.Facebook.apiClient.get_session()) {
                    callback(singleton._publicSessionData, null);
                }
                else if (!FB.Facebook.apiClient.get_session()) {
                    callback(null, null);
                }
                else {
                    FB.Facebook.apiClient.auth_getSignedPublicSessionData(new FB.ImmediateSequencer(callback));
                }
            });
        },
        addSignedPublicSessionDataToUrl: function (url, callback) {
            FB.Connect.getSignedPublicSessionData(function (result, exception) {
                if (result) {
                    url = FBIntern.Uri.addQueryParameters(url, 'public_session_data=' + encodeURIComponent(FB.JSON.serialize(result)));
                }
                callback(url, null);
            });
        },
        _showStandardDialog: function (title, iframe, width, height) {
            var dialog = new FB.UI.PopupDialog(title, iframe, true, true);
            dialog.setContentWidth(width);
            dialog.setContentHeight(height);
            dialog.set_placement(FB.UI.PopupPlacement.topCenter);
            dialog.show();
            return dialog;
        }
    },
    instance: {
        get__userInfo: function () {
            return this._userInfo;
        },
        set__userInfo: function (value) {
            if (value !== this._userInfo) {
                this._userInfo = value;
                this._setInfoCookies(value);
            }
            return value;
        },
        _getInfoFromCookies: function () {
            var infoRecord = FB.JSON.deserialize(FBIntern.Cookie.getValue('fbsetting_' + FB.Facebook.apiKey));
            if (infoRecord && (infoRecord.connectState === FB.ConnectState.userNotLoggedIn || infoRecord.connectState === FB.ConnectState.appNotAuthorized || infoRecord.connectState === FB.ConnectState.connected) && infoRecord.oneLineStorySetting > 0 && infoRecord.shortStorySetting > 0) {
                return infoRecord;
            }
            return null;
        },
        _setInfoCookies: function (info_record) {
            if (info_record && info_record.oneLineStorySetting > 0 && info_record.shortStorySetting > 0) {
                FBIntern.Cookie.set('fbsetting_' + FB.Facebook.apiKey, FB.JSON.serialize(info_record), '/', FB.Facebook.get_baseDomain(), 1);
            }
            else if (!info_record) {
                FBIntern.Cookie.clear('fbsetting_' + FB.Facebook.apiKey, '/', FB.Facebook.get_baseDomain());
            }
        },
        _ensureQueryStatus: function () {
            if (!this._loginStatusIFrameCreated) {
                if (FB.Facebook.appSettings && !FB.Facebook.appSettings['doNotUseCachedConnectState']) {
                    var info = this._getInfoFromCookies();
                    if (info && (info.connectState === FB.ConnectState.userNotLoggedIn || info.connectState === FB.ConnectState.appNotAuthorized || info.connectState === FB.ConnectState.connected)) {
                        this.set__userInfo(info);
                        this._status.setResult(info.connectState);
                    }
                }
                this._refreshQueryStatus();
            }
        },
        _refreshQueryStatus: function () {
            if (!this._loginStatusIFrameCreated || this._pollTries > 0) {
                this._loginStatusIFrameCreated = true;
                if (this._pollTries > 0) {
                    this._pollTries--;
                }
                var info = this._getInfoFromCookies();
                var inConnect = 0;
                if (info) {
                    inConnect = (info.inFacebook) ? 1 : 2;
                }
                this._setInfoCookies(null);
                if (!this._rpcServer) {
                    this._rpcServer = new FB.XdComm.XdRpcServer('loginServer', {
                        InitLogin: FB.XdComm.$create_XdRpcMethodInfo(FB.Delegate.create(this, this._initLogin), null)
                    });
                }
                this._ensureLoginHandler();
                FB.FBDebug.assert(FB.Facebook.apiKey, 'API key can\'t be null');
                var q_params = {
                    api_key: FB.Facebook.apiKey,
                    extern: inConnect,
                    channel: FB.XdComm.Server.singleton.get_receiverUrl()
                };
                if (FB.XdComm.Server.singleton.get_xdCommID()) {
                    q_params['xd_comm_id'] = FB.XdComm.Server.singleton.get_xdCommID() + ':' + Math.random().toString();
                }
                if (FB.Facebook.appSettings['fetchSignedPublicSessionData']) {
                    q_params['public_session_data'] = 1;
                }
                var srcUrl = FBIntern.Utility.createFacebookUrl('www', 'extern/login_status.php', q_params, false);
                FB.XdComm.Server.singleton.createNamedHiddenIFrame('loginStatus', srcUrl, null, null);
            }
        },
        _ensureLoginHandler: function () {
            if (!FB.XdComm.Server.singleton.isDataHandlerRegistered('fbLogout')) {
                FB.XdComm.Server.singleton.registerDataHandler('fbLogout', FB.Delegate.create(this, this._onLogoutHandler));
            }
        },
        _onLogoutHandler: function (data, endPoint) {
            FB.FBDebug.logLine(2, 'User logged out');
            if (this._logoutIframe) {
                if (this._logoutIframe.parentNode) {
                    this._logoutIframe.parentNode.removeChild(this._logoutIframe);
                }
                this._logoutIframe = null;
            }
            FB.Facebook.apiClient.set_session(null);
            this.set__userInfo(null);
            this._status.setResult(FB.ConnectState.userNotLoggedIn);
            if (this._logoutCallback) {
                this._logoutCallback(true);
            }
        },
        _setupSession: function (session) {
            var singleton = FB.Connect._singleton;
            this._setInfoCookies(null);
            if (this._dialogInfo) {
                singleton._feedStatusRefetch();
            }
            else {
                this._feedStatusMustBeRefetched = true;
                FB.Facebook.apiClient.set_session(session);
            }
        },
        _feedStatusRefetch: function () {
            this._status.setResult(FB.ConnectState.connected, true);
            this._checkForPendingFeedDialog();
            this._loginStatusIFrameCreated = false;
            this._refreshQueryStatus();
            this._feedStatusMustBeRefetched = false;
        },
        _closeAllDialogs: function (callback) {
            FB.SessionDialog.closeAll();
            if (this._feedformDialog) {
                this._feedformDialog.close(false);
                this._feedformDialog = null;
            }
            if (this._addSectionDialog) {
                this._addSectionDialog.close(false);
                this._addSectionDialog = null;
            }
            if (this._permissionDialog) {
                this._permissionDialog.close(false);
                this._permissionDialog = null;
            }
            if (callback) {
                callback();
            }
        },
        switchUser: function () {
            this._closeAllDialogs(FB.Delegate.create(this, function () {
                FB.Connect.requireSession(null);
            }));
        },
        _initLogin: function (arg, sender) {
            var parameters = arg;
            var session = parameters['session'];
            var settings = parameters['settings'];
            var connectState = parameters['connectState'];
            var feedStorySettings = settings['feedStorySettings'];
            FB.Facebook.set_baseDomain(parameters['baseDomain']);
            FB.Facebook.locale = settings['locale'];
            this._publicSessionData = parameters['publicSessionData'];
            var oneLineSetting;
            var shortStorySetting;
            if (feedStorySettings) {
                oneLineSetting = feedStorySettings['one_line'];
                shortStorySetting = feedStorySettings['short'];
            }
            else {
                oneLineSetting = FB.FeedStorySetting.doNotSend;
                shortStorySetting = FB.FeedStorySetting.doNotSend;
            }
            var inFacebook = settings['inFacebook'];
            FB.Facebook.isInConnect = (inFacebook) ? 1 : 2;
            this.set__userInfo(FB.$create_UserInfoRecord(connectState, oneLineSetting, shortStorySetting, inFacebook));
            switch (connectState) {
            case FB.ConnectState.userNotLoggedIn:
                FB.Facebook.apiClient.set_session(null);
                this._status.setResult(FB.ConnectState.userNotLoggedIn);
                break;
            case FB.ConnectState.appNotAuthorized:
                FB.Facebook.apiClient.set_session(null);
                this._status.setResult(FB.ConnectState.appNotAuthorized);
                break;
            case FB.ConnectState.connected:
                var apiClient = FB.Facebook.apiClient;
                if (!apiClient.get_session() || FBIntern.Utility.isConnectSession(apiClient.get_session().session_key) || !FB.Facebook.get_isInCanvas()) {
                    apiClient.set_session(session);
                }
                this._status.setResult(FB.ConnectState.connected);
                break;
            }
            if (connectState === FB.ConnectState.connected) {
                if (this._onConnectedCallback) {
                    this._onConnectedCallback();
                }
                this._pollTries = 0;
                this._onConnectedCallback = null;
            }
            else { if (this._pollTries > 0) {
                    window.setTimeout(FB.Delegate.create(this, function () {
                        this._refreshQueryStatus();
                    }), this._pollInterval);
                }
                else {
                    this._onConnectedCallback = null;
                }
            }
            return null;
        },
        _checkForPendingFeedDialog: function () {
            var singleton = FB.Connect._singleton;
            if (singleton._dialogInfo) {
                FB.Connect.get_status().waitUntilReady(FB.Delegate.create(this, function (result) {
                    window.setTimeout(FB.Delegate.create(this, function () {
                        FB.Connect._ShowFeedDialogGeneric(singleton._dialogInfo.parameters, FB.RequireConnect.require, singleton._dialogInfo.callback, singleton._dialogInfo.showLoginDialog);
                        singleton._dialogInfo = null;
                    }), 0);
                }));
            }
        },
        _apiClient_SessionReady: function (result) {
            this._status.setResult(FB.ConnectState.connected);
        },
        _facebookIFrame: function (iframeDoc, relUrl, postParams) {
            iframeDoc.open();
            var builder = new FB.StringBuilder();
            builder.append('\n<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">\n<html xmlns=\"http://www.w3.org/1999/xhtml\" >\n<head><title></title></head>\n<body>');
            var url = FBIntern.Utility.createFacebookUrl('www', relUrl, {},
            false);
            builder.append(FB.Sys.format('<form method=\"post\" action=\"{0}\" id=\"tempform\" name=\"tempform\" >', url));
            var $dict1 = postParams;
            for (var $key2 in $dict1) {
                var entry = {
                    key: $key2,
                    value: $dict1[$key2]
                };
                builder.append(FB.Sys.format('<input type=\"hidden\" name=\"{0}\" id=\"{1}\" value=\"{2}\"  />', entry.key, entry.key, FB.Sys.htmlEncode(entry.value)));
            }
            builder.append('\n</form>\n    <script type=\"text/javascript\">\n      window.setTimeout(function(){document.forms[\'tempform\'].submit();}, 0);\n    </script>\n</body>\n</html>\n        ');
            var html = builder.toString();
            iframeDoc.write(html);
            iframeDoc.close();
        },
        get__isInConnect: function () {
            var r = FB.Connect._singleton.get__userInfo();
            if (!r) {
                return 0;
            }
            else {
                return (r.inFacebook) ? 1 : 2;
            }
        },
        _loginStatusIFrameCreated: false,
        _pollInterval: 0,
        _pollTries: 0,
        _onConnectedCallback: null,
        _feedStatusMustBeRefetched: false,
        _rpcServer: null,
        _feedformDialog: null,
        _addSectionDialog: null,
        _shareDialog: null,
        _permissionDialog: null,
        _feedformNum: 0,
        _sessionlessFeedFrameNum: 0,
        _addSectionNum: 0,
        _dialogInfo: null,
        _userInfo: null,
        _logoutCallback: null,
        _logoutIframe: null,
        _sessionlessPublishCallback: null,
        _publicSessionData: null
    }
});
FB.SessionDialog = FB.Type.createClass({
    ctor: function () {
        this._connect = FB.Connect._singleton;
        this._timerId = -1;
        this._channelUrl = FB.XdComm.Server.singleton.get_receiverUrl();
        this._cancelChannelUrl = FB.XdComm.Server.singleton.get_receiverUrl();
        this._apiKey = FB.Facebook.apiKey;
        this._initializeSession = true;
        this._forceBrowserPopup = FB.Facebook.appSettings['forceBrowserPopupForLogin'];
    },
    static_ctor: function () {
        FB.SessionDialog._singleton = null;
    },
    static: {
        closeAll: function () {
            if (FB.SessionDialog._singleton) {
                FB.SessionDialog._singleton.destroy();
                FB.SessionDialog._singleton = null;
            }
        },
        make: function () {
            FB.SessionDialog.closeAll();
            FB.SessionDialog._singleton = new FB.SessionDialog();
            return FB.SessionDialog._singleton;
        },
        getActive: function () {
            if (FB.SessionDialog._singleton && FB.SessionDialog._singleton.isActive()) {
                return FB.SessionDialog._singleton;
            }
            return null;
        }
    },
    instance: {
        setIsUserActionHint: function (isUserActionHint) {
            this._isUserActionHint = isUserActionHint;
            return this;
        },
        setUseBrowserPopup: function (useBrowserPopup) {
            this._forceBrowserPopup = useBrowserPopup;
            return this;
        },
        setTarget: function (target) {
            this._overrideTarget = target;
            return this;
        },
        setInitializeSession: function (initialize) {
            this._initializeSession = initialize;
            return this;
        },
        setChannelUrl: function (url) {
            this._channelUrl = url;
            return this;
        },
        setCancelChannelUrl: function (url) {
            this._cancelChannelUrl = url;
            return this;
        },
        setApiKey: function (apiKey) {
            this._apiKey = apiKey;
            return this;
        },
        _onCancelLoginHandler: function (data, endPoint) {
            this._cancelCallback();
        },
        _cancelCallback: function () {
            if (this.__cancelled) {
                this.__cancelled();
            }
            this.destroy();
        },
        _sessionCallback: function () {
            if (!this._session) {
                this._session = FB.Facebook.apiClient.get_session();
            }
            if (this.__sessionGranted) {
                this.__sessionGranted(this._session);
            }
            this.destroy();
        },
        _handleSession: function (connectState, isInUserActionCallstack) {
            switch (connectState) {
            case FB.ConnectState.userNotLoggedIn:
                this._show(false, isInUserActionCallstack);
                break;
            case FB.ConnectState.appNotAuthorized:
                this._show(true, isInUserActionCallstack);
                break;
            default:
                break;
            }
        },
        _ensureHandlers: function () {
            if (!FB.XdComm.Server.singleton.isDataHandlerRegistered('fbLogin')) {
                FB.XdComm.Server.singleton.registerDataHandler('fbLogin', FB.Delegate.create(this, this._onLoginHandler));
            }
            if (!FB.XdComm.Server.singleton.isDataHandlerRegistered('fbCancelLogin')) {
                FB.XdComm.Server.singleton.registerDataHandler('fbCancelLogin', FB.Delegate.create(this, this._onCancelLoginHandler));
            }
        },
        _onLoginHandler: function (data, endPoint) {
            this._close();
            var singleton = FB.Connect._singleton;
            var hash = data;
            var segments = (data).split('&');
            this._session = FB.JSON.deserialize(segments[0], true);
            if (this._initializeSession) {
                this._connect._setupSession(this._session);
            }
            else {
                this._sessionCallback();
            }
        },
        _show: function (isTosOnly, isInUserActionCallstack) {
            this._ensureHandlers();
            var relativeUrl = (isTosOnly) ? 'tos.php' : 'login.php';
            var useBrowserPopup = isInUserActionCallstack && (this._forceBrowserPopup || !isTosOnly);
            var useRedirect = false;
            if (FB.Facebook.apiClient) {
                FB.Facebook.apiClient.get_sessionWaitable().waitUntilReady(FB.Delegate.create(this._connect, this._connect._apiClient_SessionReady));
            }
            if (FB.Facebook.get_isInCanvas()) {
                this._showCanvasDialog();
            }
            else {
                var url = this._createLoginUrl(relativeUrl, useBrowserPopup);
                if (!useBrowserPopup && !useRedirect && !this._tosDialog) {
                    this._showIframeLoginDialog(url, isTosOnly);
                }
                else if (useBrowserPopup) {
                    this._showBrowserPopupLogin(url);
                    if (!this._loginWindow) {
                        useRedirect = true;
                    }
                }
            }
            if (useRedirect) {
                FB.FBDebug.logLine(1, 'Can\'t create login window because the call is not inside an user action event handler, will redirect instead');
                FB.Facebook.apiClient.requireLogin(null);
            }
        },
        _showCanvasDialog: function () {
            if (this._isActive) {
                this._dialogType = FB.DialogType.canvas;
                this._fbmlDialog = true;
                FB.CanvasClient.requireLogin(FB.Delegate.create(this, function (sig_params) {
                    this._session = sig_params;
                    if (this._initializeSession) {
                        this._connect._setupSession(this._session);
                    }
                    this._sessionCallback();
                }), FB.Delegate.create(this, this._cancelCallback));
            }
        },
        _showBrowserPopupLogin: function (url) {
            var windowLocation = FBIntern.Utility.get_windowLocation();
            var windowSize = FBIntern.Utility.get_windowSize();
            var popupSize = FB.$create_Size(448, 426);
            var popupScreen = FB.$create_Point(Math.max(0, windowLocation.x + (windowSize.w - popupSize.w) / 2), Math.max(0, windowLocation.y + (windowSize.h - popupSize.h) / 2));
            this._close();
            if (this._isActive) {
                this._dialogType = FB.DialogType.popUp;
                this._loginWindow = window.open(url, '_blank', FB.Sys.format('location=yes,left={0},top={1},width={2},height={3},resizable=yes', popupScreen.x, popupScreen.y, popupSize.w, popupSize.h), true);
                this._monitorPopupWindowClosed();
            }
        },
        isActive: function () {
            if (this._isActive && this._dialogType === FB.DialogType.popUp) {
                if (!this._loginWindow || this._loginWindow.closed) {
                    this._isActive = false;
                }
            }
            return this._isActive;
        },
        focus: function () {
            if (this._dialogType === FB.DialogType.popUp) {
                this._loginWindow.focus();
            }
        },
        _createLoginUrl: function (relativeUrl, isPopupWindow) {
            var target, display;
            var pageRelation;
            if (isPopupWindow) {
                target = '_opener';
                display = 'popup';
                pageRelation = FB.XdComm.PageRelation.opener;
            }
            else {
                target = '_parent';
                display = 'dialog';
                pageRelation = FB.XdComm.PageRelation.self;
            }
            if (this._overrideTarget) {
                target = this._overrideTarget;
            }
            var nextUrl = FBIntern.Uri.addQueryParameters(this._channelUrl, 'fb_login&fname=' + target + '&guid=' + FB.XdComm.Server.singleton.get_GUID());
            var cancelUrl = FB.XdComm.Server.singleton.createUdpUrl('fbCancelLogin', null, new FB.XdComm.EndPoint(null, pageRelation, this._cancelChannelUrl));
            var q_params = {
                return_session: 1,
                nochrome: 1,
                fbconnect: 1,
                extern: FB.Facebook.get_isInConnect(),
                display: display,
                api_key: this._apiKey,
                v: FB.Facebook.version,
                next: nextUrl,
                cancel_url: cancelUrl,
                channel_url: this._channelUrl
            };
            if (FB.Sys.containsKey(FB.Facebook.appSettings, 'permsToRequestOnConnect')) {
                q_params['req_perms'] = FB.Facebook.appSettings['permsToRequestOnConnect'];
            }
            return FBIntern.Utility.createFacebookUrl('www', relativeUrl, q_params, false);
        },
        _showIframeLoginDialog: function (url, isTosOnly) {
            FB.IFrameUtil.ResizeUtilServer.run();
            var popupTitle = FBIntern.Intl._tx("Connect with Facebook");
            if (this._isActive) {
                this._dialogType = FB.DialogType.iframe;
                this._tosDialog = new FB.UI.PopupDialog(popupTitle, null, true, false);
                url = FBIntern.Uri.addQueryParameters(url, 'dialog_id=' + this._tosDialog.get_id());
                var iframeDom = FB.XdComm.Server.singleton.createNamedHiddenIFrame('dialogContent' + Math.random().toString(), url, 'fb_tosIFrame', null);
                if (!isTosOnly) {
                    iframeDom.style.height = '340px';
                }
                else {
                    iframeDom.style.height = '288px';
                }
                this._tosDialog.set__content(iframeDom);
                this._tosDialog.add_closed(FB.Delegate.create(this, function (closingResult) {
                    this._tosDialog = null;
                    if (!closingResult) {
                        this._cancelCallback();
                    }
                }));
                this._tosDialog.show();
            }
        },
        request: function () {
            this._isActive = true;
            var isUserAction = FBIntern.Utility.get_isInUserActionCallstack() || this._isUserActionHint;
            if (!FB.Connect.get_status().get_isReady() && isUserAction) {
                this._waitForDialog();
                this._handleSession(FB.ConnectState.userNotLoggedIn, isUserAction);
            }
            else {
                FB.Connect.get_status().waitUntilReady(FB.Delegate.create(this, function (connectObj) {
                    var connectState = connectObj;
                    if (connectState === FB.ConnectState.connected) {
                        this._sessionCallback();
                    }
                    else {
                        this._waitForDialog();
                        this._handleSession(connectState, isUserAction);
                    }
                }));
            }
            isUserAction = false;
        },
        listen: function () {
            this._ensureHandlers();
        },
        _waitForDialog: function () {
            FB.Connect.get_status().waitForValue(FB.ConnectState.connected, FB.Delegate.create(this, this._sessionCallback));
        },
        _close: function () {
            if (this._tosDialog) {
                this._tosDialog.close(true);
                this._tosDialog = null;
            }
            if (this._loginWindow) {
                this._loginWindow.close();
                this._loginWindow = null;
            }
            if (this._fbmlDialog) {
                FB.CanvasClient.closeLogin();
                this._fbmlDialog = false;
            }
        },
        destroy: function () {
            this._close();
            this.__sessionGranted = null;
            this.__cancelled = null;
            this._isActive = false;
            if (FB.XdComm.Server.singleton.isDataHandlerRegistered('fbLogin')) {
                FB.XdComm.Server.singleton.unregisterDataHandler('fbLogin');
            }
            if (FB.XdComm.Server.singleton.isDataHandlerRegistered('fbCancelLogin')) {
                FB.XdComm.Server.singleton.unregisterDataHandler('fbCancelLogin');
            }
        },
        add_sessionGranted: function (value) {
            this.__sessionGranted = FB.Delegate.combine(this.__sessionGranted, value);
        },
        remove_sessionGranted: function (value) {
            this.__sessionGranted = FB.Delegate.remove(this.__sessionGranted, value);
        },
        __sessionGranted: null,
        addSessionHandler: function (handler) {
            this.add_sessionGranted(handler);
            return this;
        },
        add_cancelled: function (value) {
            this.__cancelled = FB.Delegate.combine(this.__cancelled, value);
        },
        remove_cancelled: function (value) {
            this.__cancelled = FB.Delegate.remove(this.__cancelled, value);
        },
        __cancelled: null,
        addCancelHandler: function (handler) {
            this.add_cancelled(handler);
            return this;
        },
        _monitorPopupWindowClosed: function () {
            if (this._loginWindow && this._timerId === -1) {
                this._timerId = window.setInterval(FB.Delegate.create(this, function () {
                    if (this._loginWindow && this._loginWindow.closed) {
                        this._loginWindow = null;
                        window.clearInterval(this._timerId);
                        this._timerId = -1;
                        this._cancelCallback();
                    }
                }), 200);
            }
        },
        _isActive: false,
        _isUserActionHint: true,
        _forceBrowserPopup: false,
        _loginWindow: null,
        _tosDialog: null,
        _fbmlDialog: false,
        _apiKey: null,
        _channelUrl: null,
        _cancelChannelUrl: null,
        _overrideTarget: null,
        _session: null,
        _initializeSession: false,
        _dialogType: 0
    }
});
FB.Type.createNamespace('FBIntern');
FBIntern.LoginStatus = FB.Type.createClass({
    ctor: function () {},
    instance: {
        initialize: function (channel, session, settings, connectState, baseDomain, publicSessionData, parent_window_url, xd_comm_id) {
            settings['inFacebook'] = this._checkIfInFacebook();
            if (!this._rpcClient) {
                FB.XdComm.Server.singleton.set_xdCommID(xd_comm_id);
                var endPoint = new FB.XdComm.EndPoint(null, FB.XdComm.PageRelation.parent, channel);
                if (FB.Sys.isNullOrEmpty(parent_window_url)) {
                    FB.FBDebug.logLine(1, 'Disable use of postMessage because ' + 'parent_window_url parameter is null or empty therefore we cannot ' + 'securely send message using postMessage');
                    FBIntern.Utility.setSiteVar('use_postMessage', false);
                }
                else {
                    endPoint.origin = parent_window_url;
                }
                this._rpcClient = new FB.XdComm.XdRpcClient('loginServer', 'loginStatus', endPoint);
            }
            var parameters = {
                session: session,
                settings: settings,
                connectState: connectState,
                baseDomain: baseDomain,
                publicSessionData: publicSessionData
            };
            this._rpcClient.send('InitLogin', parameters, null);
        },
        _checkIfInFacebook: function () {
            var inFacebook = false;
            try {
                var loca = window.top.location.href.split("/")[2];
                var idx = loca.lastIndexOf('facebook.com');
                inFacebook = (idx !== -1) && (idx + 12) === loca.length;
            }
            catch($e1) {}
            return inFacebook;
        },
        _rpcClient: null
    }
});
FBIntern.UIHelper = FB.Type.createClass({
    ctor: function () {},
    static: {
        findElementById: function (root, id) {
            if (root.id === id) {
                return root;
            }
            var c = root.childNodes.length;
            for (var i = 0; i < c; i++) {
                var child = root.childNodes[i];
                var result = FBIntern.UIHelper.findElementById(child, id);
                if (result) {
                    return result;
                }
            }
            return null;
        }
    }
});
FB.Type.createNamespace('FB.UI');
FB.UI.PopupPlacement = FB.Type.createEnum({
    center: 1,
    topCenter: 2,
    hidden: 3
},
false);
FB.UI.UIElement = FB.Type.createClass({
    ctor: function () {},
    static: {
        addCssClass: function (domElement, newClass) {
            var cssClassWithSpace = ' ' + domElement.className + ' ';
            var newClassWithSpace = ' ' + newClass + ' ';
            if (cssClassWithSpace.indexOf(newClassWithSpace) < 0) {
                domElement.className = domElement.className + ' ' + newClass;
            }
        },
        containsCssClass: function (domElement, className) {
            var cssClassWithSpace = ' ' + domElement.className + ' ';
            return cssClassWithSpace.indexOf(' ' + className + ' ') >= 0;
        },
        removeCssClass: function (domElement, className) {
            var cssClassWithSpace = ' ' + domElement.className + ' ';
            var classNameWithSpace = ' ' + className + ' ';
            var index = cssClassWithSpace.indexOf(classNameWithSpace);
            if (index >= 0) {
                var newClassName = cssClassWithSpace.substring(1, index) + cssClassWithSpace.substring(index + classNameWithSpace.length, cssClassWithSpace.length - 1);
                domElement.className = newClassName;
            }
        }
    },
    instance: {
        get_domElement: function () {
            return this._domElement;
        },
        set_domElement: function (value) {
            this._domElement = value;
            return value;
        },
        setLeft: function (left) {
            if (FB.localeIsRTL) {
                this._domElement.style.right = left.toString() + 'px';
            }
            else {
                this._domElement.style.left = left.toString() + 'px';
            }
        },
        setTop: function (top) {
            this._domElement.style.top = top.toString() + 'px';
        },
        _domElement: null
    }
});
FB.UI.Popup = FB.Type.createClass({
    base: FB.UI.UIElement,
    ctor: function () {
        this._placement$1 = FB.UI.PopupPlacement.center;
        this._offset$1 = FB.$create_Point(0, 0);
        this._popupHeight$1 = -1;
        this._popupWidth$1 = -1;
        FB.UI.Popup.constructBase(this);
    },
    static_ctor: function () {
        FB.UI.Popup._borderSize$1 = 22;
        FB.UI.Popup._popupContainer$1 = null;
    },
    static: {
        get__popupContainer$1: function () {
            if (!FB.UI.Popup._popupContainer$1) {
                FB.UI.Popup._popupContainer$1 = FB.$('fb_popupContainer');
                if (!FB.UI.Popup._popupContainer$1) {
                    var div = document.createElement('div');
                    div.className = 'fb_resetstyles fb_popupContainer';
                    FB.UI.Popup._popupContainer$1 = document.body.appendChild(div);
                }
            }
            else {
                FB.UI.Popup._popupContainer$1 = document.body.appendChild(FB.UI.Popup._popupContainer$1);
            }
            return FB.UI.Popup._popupContainer$1;
        }
    },
    instance: {
        setContentWidth: function (width) {
            this._popupWidth$1 = width + FB.UI.Popup._borderSize$1;
        },
        setContentHeight: function (height) {
            this._popupHeight$1 = height + FB.UI.Popup._borderSize$1;
        },
        show: function () {
            if (!this._loadedInDom$1) {
                FB.UI.UIElement.addCssClass(this.get_domElement(), 'fb_popup');
                FB.UI.Popup.get__popupContainer$1().appendChild(this.get_domElement());
                this._loadedInDom$1 = true;
            }
            this.sizing();
            this.onAfterShow();
        },
        sizing: function () {
            if (!this._loadedInDom$1) {
                return false;
            }
            if (this._popupWidth$1 >= 0) {
                this.get_domElement().style.width = this._popupWidth$1.toString() + 'px';
            }
            if (this._popupHeight$1 >= 0) {
                this.get_domElement().style.height = this._popupHeight$1.toString() + 'px';
            }
            var popupSize = FB.$create_Size(this.get_domElement().offsetWidth, this.get_domElement().offsetHeight);
            var location = null;
            var windowSize = FBIntern.Utility.get_windowSize();
            var target = document.documentElement;
            var dialog_placement = (this.hidden) ? FB.UI.PopupPlacement.hidden : this.get_placement();
            var topHeight;
            if (document.documentElement && document.documentElement.scrollTop > 0) {
                topHeight = document.documentElement.scrollTop;
            }
            else {
                topHeight = document.body.scrollTop;
            }
            switch (dialog_placement) {
            case FB.UI.PopupPlacement.topCenter:
                location = FB.$create_Point(target.scrollLeft + windowSize.w / 2, topHeight + 125);
                location.x -= (popupSize.w / 2);
                break;
            case FB.UI.PopupPlacement.center:
                location = FB.$create_Point(target.scrollLeft + windowSize.w / 2, topHeight + windowSize.h / 2);
                location.x -= (popupSize.w / 2);
                location.y -= (popupSize.h / 2);
                break;
            case FB.UI.PopupPlacement.hidden:
                location = FB.$create_Point(-100 - popupSize.w, -100 - popupSize.h);
                break;
            }
            location.x += this._offset$1.x;
            location.y += this._offset$1.y;
            if (location.x < 0) {
                location.x = 0;
            }
            if (location.y < 0 && dialog_placement !== FB.UI.PopupPlacement.hidden) {
                location.y = 0;
            }
            this.setLeft(location.x);
            this.setTop(location.y);
            return true;
        },
        onAfterShow: function () {},
        close: function (result) {
            if (this.__closing$1) {
                this.__closing$1(result);
            }
            if (FBIntern.AppInfo.get_singleton().get_hostInfo().get_hostName() !== FBIntern.HostName.IE) {
                FB.UI.Popup.get__popupContainer$1().removeChild(this.get_domElement());
            }
            else {
                var domElement = this.get_domElement();
                domElement.style.display = 'none';
                window.setTimeout(FB.Delegate.create(this, function () {
                    if (domElement.parentNode) {
                        domElement.parentNode.removeChild(domElement);
                    }
                }), 4000);
            }
            if (this.__closed$1) {
                this.__closed$1(result);
            }
        },
        get_placementTarget: function () {
            return this._placementTarget$1;
        },
        set_placementTarget: function (value) {
            this._placementTarget$1 = value;
            return value;
        },
        get_offset: function () {
            return this._offset$1;
        },
        set_offset: function (value) {
            this._offset$1 = value;
            return value;
        },
        get_placement: function () {
            return this._placement$1;
        },
        set_placement: function (value) {
            this._placement$1 = value;
            return value;
        },
        add_closing: function (value) {
            this.__closing$1 = FB.Delegate.combine(this.__closing$1, value);
        },
        remove_closing: function (value) {
            this.__closing$1 = FB.Delegate.remove(this.__closing$1, value);
        },
        __closing$1: null,
        add_closed: function (value) {
            this.__closed$1 = FB.Delegate.combine(this.__closed$1, value);
        },
        remove_closed: function (value) {
            this.__closed$1 = FB.Delegate.remove(this.__closed$1, value);
        },
        __closed$1: null,
        _placementTarget$1: null,
        _loadedInDom$1: false,
        hidden: false
    }
});
FB.UI.PopupDialog = FB.Type.createClass({
    base: FB.UI.Popup,
    ctor: function (title, content, showLoading, hideUntilLoaded) {
        FB.UI.PopupDialog.constructBase(this);
        this._content$2 = content;
        this._showLoading$2 = showLoading;
        if (hideUntilLoaded) {
            this.hidden = true;
        }
        this.set_domElement(FB.UI.DomResources.getResourceById('fb_pop_dialog_table'));
        this._contentParent$2 = FBIntern.UIHelper.findElementById(this.get_domElement(), 'fb_dialog_content');
        this._header$2 = FBIntern.UIHelper.findElementById(this.get_domElement(), 'fb_dialog_header');
        this._header$2.innerHTML = FB.Sys.htmlEncode(title);
        var closeButton = FBIntern.UIHelper.findElementById(this.get_domElement(), 'fb_dialog_cancel_button');
        this._loader$2 = FBIntern.UIHelper.findElementById(this.get_domElement(), 'fb_dialog_loading_spinner');
        if (closeButton) {
            FBIntern.Utility.addEventListener(closeButton, 'click', FB.Delegate.create(this, this._onCloseButtonClicked$2));
        }
        if (content) {
            this._contentParent$2.appendChild(content);
        }
    },
    static_ctor: function () {
        FB.UI.PopupDialog._dialogWithIds$2 = null;
        FB.UI.PopupDialog._rpcServer$2 = null;
    },
    static: {
        _createConfirmationDialog: function (title, content, callback) {
            var confirmDialog = new FB.UI.PopupDialog(title, content, false, false);
            confirmDialog.add_closing(callback);
            var confirmButton = FBIntern.UIHelper.findElementById(content, 'fb_confirm');
            var cancelButton = FBIntern.UIHelper.findElementById(content, 'fb_cancel');
            if (confirmButton) {
                FBIntern.Utility.addEventListener(confirmButton, 'click', function (e) {
                    confirmDialog.close(true);
                });
            }
            if (cancelButton) {
                FBIntern.Utility.addEventListener(cancelButton, 'click', function (e) {
                    confirmDialog.close(false);
                });
            }
            return confirmDialog;
        },
        getById: function (id) {
            if (FB.UI.PopupDialog._dialogWithIds$2) {
                return FB.UI.PopupDialog._dialogWithIds$2[id];
            }
            return null;
        },
        _enableXdTitleChange$2: function () {
            if (!FB.UI.PopupDialog._rpcServer$2) {
                FB.UI.PopupDialog._rpcServer$2 = new FB.XdComm.XdRpcServer('popupDialogServer', {
                    changeTitle: FB.XdComm.$create_XdRpcMethodInfo(FB.UI.PopupDialog._rpcChangeTitle$2, null)
                });
            }
        },
        _rpcChangeTitle$2: function (arg, senderEndPoint) {
            var data = arg;
            var id = data['id'];
            var dialog = FB.UI.PopupDialog.getById(id);
            if (dialog) {
                dialog.set__title((data['title']));
            }
            else {
                FB.FBDebug.logLine(0, 'Ignore changeTitle rpc request because we can\'t find the given dialog id = ' + id);
            }
            return null;
        },
        _onXdClosingDialogHandler$2: function (data, sender) {
            var dictionary = data;
            var token = dictionary['token'];
            var result = dictionary['result'];
            var dialog = FB.UI.PopupDialog.getById(token);
            if (dialog) {
                FB.FBDebug.logLine(3, 'Close dialog');
                dialog.close(result);
            }
            else {
                FB.FBDebug.logLine(1, 'Invalid token to close dialog: ' + token);
            }
        }
    },
    instance: {
        _onCloseButtonClicked$2: function (e) {
            this.close(false);
        },
        get__content: function () {
            return this._content$2;
        },
        set__content: function (value) {
            if (this._content$2) {
                this._contentParent$2.removeChild(this._content$2);
            }
            this._content$2 = value;
            this._contentParent$2.appendChild(this._content$2);
            return value;
        },
        get_id: function () {
            if (!this._id$2) {
                if (!FB.UI.PopupDialog._dialogWithIds$2) {
                    FB.UI.PopupDialog._dialogWithIds$2 = {};
                }
                this._id$2 = FB.Sys.getKeyCount(FB.UI.PopupDialog._dialogWithIds$2).toString() + '_' + Math.random().toString();
                FB.UI.PopupDialog._dialogWithIds$2[this._id$2] = this;
                FB.UI.PopupDialog._enableXdTitleChange$2();
            }
            return this._id$2;
        },
        get__title: function () {
            this._header$2 = FBIntern.UIHelper.findElementById(this.get_domElement(), 'fb_dialog_header');
            return this._header$2.innerHTML;
        },
        set__title: function (value) {
            this._header$2 = FBIntern.UIHelper.findElementById(this.get_domElement(), 'fb_dialog_header');
            this._header$2.innerHTML = FB.Sys.htmlEncode(value);
            return value;
        },
        _createCrossDomainClosingLink: function (result) {
            if (!FB.XdComm.Server.singleton.isDataHandlerRegistered('fbClosingDialog')) {
                FB.XdComm.Server.singleton.registerDataHandler('fbClosingDialog', FB.UI.PopupDialog._onXdClosingDialogHandler$2);
            }
            var data = {
                token: this.get_id(),
                result: result
            };
            var endpoint = new FB.XdComm.EndPoint(null, FB.XdComm.PageRelation.self, FB.XdComm.Server.singleton.get_receiverUrl());
            return FB.XdComm.Server.singleton.createUdpUrl('fbClosingDialog', data, endpoint);
        },
        onAfterShow: function () {
            if (this._showLoading$2) {
                FB.UI.UIElement.addCssClass(this._loader$2, 'fb_dialog_loading');
                FBIntern.Utility.waitForLoaded(this._content$2, FB.Delegate.create(this, function () {
                    FB.UI.UIElement.removeCssClass(this._loader$2, 'fb_dialog_loading');
                    if (this.hidden) {
                        this.hidden = false;
                        this.sizing();
                    }
                }));
            }
        },
        _content$2: null,
        _contentParent$2: null,
        _header$2: null,
        _loader$2: null,
        _id$2: null,
        _showLoading$2: false
    }
});
FB.UI.FBMLPopupDialog = FB.Type.createClass({
    base: FB.UI.PopupDialog,
    ctor: function (title, fbml) {
        FB.UI.FBMLPopupDialog.constructBase(this, [title, null, false, false]);
        var serverFbmlDom = document.createElement('div');
        this.set__content(serverFbmlDom);
        this.setFBMLContent(fbml);
    },
    instance: {
        setFBMLContent: function (fbml) {
            this.get__content().setAttribute('fbml', '<fb:fbml>' + fbml + '</fb:fbml>');
        },
        setContentWidth: function (width) {
            FB.UI.FBMLPopupDialog.callBase(this, 'setContentWidth', [width]);
            this.get__content().setAttribute('iframeWidth', width.toString() + 'px');
        },
        setContentHeight: function (height) {
            this.get__content().setAttribute('iframeHeight', height.toString() + 'px');
            this.get_offset().y = -height / 2;
        },
        onAfterShow: function () {
            FB.UI.FBMLPopupDialog.callBase(this, 'onAfterShow');
            var content = this.get__content();
            FB_RequireFeatures(['XFBML'], function () {
                serverFbml = new FB.XFBML.ServerFbml(content);
                FB.XFBML.Host.addElement(serverFbml);
            });;
        }
    }
});
FB.FeatureLoader.onScriptLoaded(['Connect']);

FB.Type.createNamespace('FBIntern');
FBIntern.DataHelper = FB.Type.createClass({
    ctor: function () {},
    static: {
        getPrimaryNetwork: function (userInfo) {
            if (userInfo.affiliations && userInfo.affiliations.length > 0) {
                return userInfo.affiliations[0].name;
            }
            else {
                return null;
            }
        }
    }
});
FB.Type.createNamespace('FB.XFBML.Data');
FB.XFBML.Data.$create__cachedItem = function FB_XFBML_Data__cachedItem(data, createTime) {
    var $o = {};
    $o.data = data;
    $o.createTime = createTime;
    return $o;
}
FB.XFBML.Data.$create__fqlCache = function FB_XFBML_Data__fqlCache(fields) {
    var $o = {};
    $o.fields = fields;
    $o.rows = {};
    return $o;
}
FB.XFBML.Data.CacheManager = FB.Type.createClass({
    ctor: function () {},
    static_ctor: function () {
        FB.XFBML.Data.CacheManager._maxUsableAge = 24 * 60 * 60 * 1000;
        FB.XFBML.Data.CacheManager._refreshInternal = 10 * 60 * 1000;
        FB.XFBML.Data.CacheManager._initialized = new FB.SimpleWaitable();
    },
    static: {
        clearAll: function () {
            if (FBIntern.Flash.get_xdComm()) {
                FBIntern.Flash.get_xdComm().waitUntilReady(function (result) {
                    (result).clearAllCache();
                });
            }
        },
        _changeContext: function (uid) {
            if (FBIntern.Flash.hasRequireVersion()) {
                FBIntern.Flash.get_xdComm().waitUntilReady(function (result) {
                    FB.FBDebug.logLine(3, 'CacheManager.ChangeContext to ' + uid);
                    (result).setCacheContext(uid);
                    FB.XFBML.Data.CacheManager._initialized.setResult(true);
                });
            }
            else {
                FB.XFBML.Data.CacheManager._initialized.setResult(true);
            }
        },
        _getValue: function (key) {
            try {
                var flash = FBIntern.Flash.get_xdComm();
                if (flash && flash.get_isReady()) {
                    var s = (flash.result).getCache(key);
                    if (s) {
                        s = FBIntern.Flash.decode(s);
                        if (FB.FBDebug.logLevel > 4) {
                            FB.FBDebug.writeLine('CacheManager.GetValue returns ' + s);
                        }
                        return FB.JSON.deserialize(s);
                    }
                }
            }
            catch(e) {
                FB.FBDebug.logLine(1, 'CacheManager.GetValue failed on key ' + key + ' exception=' + e.toString());
            }
            return null;
        },
        _setValue: function (key, value) {
            try {
                var flash = FBIntern.Flash.get_xdComm();
                if (flash && flash.get_isReady()) {
                    var s = FB.JSON.serialize(value);
                    if (FB.FBDebug.logLevel > 4) {
                        FB.FBDebug.writeLine('CacheManager.SetValue key=' + key + ', value=' + s);
                    } (flash.result).setCache(key, FB.JSON.serialize(value));
                }
            }
            catch(e) {
                FB.FBDebug.logLine(1, 'CacheManager.SetValue failed on key ' + key + ' exception=' + e.toString());
            }
        },
        get__initialized: function () {
            return FB.XFBML.Data.CacheManager._initialized;
        }
    }
});
FB.XFBML.Data.FqlTable = FB.Type.createClass({
    ctor: function (table, key) {
        this._pendingResults = {};
        this._specialTables = {};
        this._specialFields = {};
        this._table = table;
        this._key = key;
        this._specialTables['translation'] = true;
        this._specialFields['translation'] = 'pre_hash_string';
        this._cache = FB.XFBML.Data.CacheManager._getValue(this.get__cacheKey());
        if (!this._cache) {
            this._fields = [];
            this._cache = FB.XFBML.Data.$create__fqlCache(this._fields);
        }
        else {
            this._fields = this._cache.fields;
        }
    },
    instance: {
        selectByKey: function (fields, keyValue) {
            FB.FBDebug.assert(keyValue, 'value cannot be null');
            var clearCache = false;
            var $enum1 = new FB.ArrayEnumerator(fields);
            while ($enum1.moveNext()) {
                var field = $enum1.get_current();
                if (!FB.Sys.contains(this._fields, field)) {
                    FB.Sys.add(this._fields, field);
                    clearCache = true;
                }
            }
            if (clearCache) {
                this._cache = FB.XFBML.Data.$create__fqlCache(this._fields);
            }
            var result = this._pendingResults[keyValue];
            if (!result) {
                var cachedItem = this._cache.rows[keyValue];
                if (cachedItem) {
                    var age = (new Date()).getTime() - cachedItem.createTime;
                    if (age < FB.XFBML.Data.CacheManager._maxUsableAge) {
                        if (FB.FBDebug.logLevel > 5) {
                            FB.FBDebug.writeLine('Use cached value for key=' + keyValue + ' in fql table ' + this.get__cacheKey());
                        }
                        result = new FB.PendingResult();
                        result.setPendingResult(cachedItem.data, null);
                        if (age > FB.XFBML.Data.CacheManager._refreshInternal) {
                            this._pendingResults[keyValue] = result;
                        }
                        else {
                            return result;
                        }
                    }
                }
            }
            if (!result) {
                result = new FB.PendingResult();
                this._pendingResults[keyValue] = result;
            }
            var context = FB.XFBML.Context.singleton;
            if (!this._subscribedToEvent) {
                context.add_beforeSendBatchRequest(FB.Delegate.create(this, this._beforeSendBatchRequest));
                this._subscribedToEvent = true;
            }
            context.requestBatchProcess();
            return result;
        },
        invokeApi: function (fields, keyValues) {
            if (FB.Connect.get_status().get_isReady() && FB.Connect.get_status().result !== FB.ConnectState.connected && this._table !== 'user') {
                var pendingResult = new FB.PendingResult();
                pendingResult.setPendingResult(null, FBIntern.Utility.createException('Invalid session state', FB.ApiErrorCode.invalid_session_key));
                return pendingResult;
            }
            else {
                var query = FB.Sys.format('SELECT {0} from {1} WHERE {2} IN ({3})', fields.toString(), this._table, this._key, keyValues.toString());
                return FB.Facebook.apiClient.fql_query(query, FB.XFBML.Context.singleton.get_batchSequencer());
            }
        },
        _beforeSendBatchRequest: function () {
            var keyValues = [];
            var pendingResults = this._pendingResults;
            if (!FB.Sys.getKeyCount(pendingResults)) {
                return;
            }
            var $dict1 = pendingResults;
            for (var $key2 in $dict1) {
                var entry = {
                    key: $key2,
                    value: $dict1[$key2]
                };
                FB.Sys.add(keyValues, entry.key);
            }
            var requiredField = '';
            if (this._specialTables[this._table]) {
                requiredField = this._specialFields[this._table];
            }
            else {
                requiredField = this._key;
            }
            if (!FB.Sys.contains(this._fields, requiredField)) {
                FB.Sys.add(this._fields, requiredField);
            }
            var fieldsArray = this._fields;
            this._fields = [];
            this._pendingResults = {};
            var combinedResult = this.invokeApi(fieldsArray, keyValues);
            combinedResult.waitUntilReady(FB.Delegate.create(this, function (r) {
                var now = (new Date()).getTime();
                var rows = combinedResult.result;
                if (rows) {
                    var c = rows.length;
                    for (var i = 0; i < c; i++) {
                        var result = rows[i];
                        var keyValue = '';
                        if (!this._specialTables[this._table]) {
                            keyValue = result[this._key];
                        }
                        else {
                            keyValue = '\"' + result[this._specialFields[this._table]] + '\"';
                        }
                        if (result && pendingResults[keyValue]) {
                            (pendingResults[keyValue]).setPendingResult(result, combinedResult.exception);
                        }
                    }
                }
                var $dict1 = pendingResults;
                for (var $key2 in $dict1) {
                    var entry = {
                        key: $key2,
                        value: $dict1[$key2]
                    };
                    var pendingResult = entry.value;
                    if (!pendingResult.get_isReady()) {
                        pendingResult.setPendingResult(null, new Error('No data received from server from FQL query.'));
                        if (!combinedResult.exception) {
                            this._cache.rows[entry.key] = FB.XFBML.Data.$create__cachedItem(null, now);
                        }
                    }
                    else {
                        this._cache.rows[entry.key] = FB.XFBML.Data.$create__cachedItem(pendingResult.result, now);
                    }
                }
                FB.XFBML.Data.CacheManager._setValue(this.get__cacheKey(), this._cache);
            }));
        },
        get__cacheKey: function () {
            return 'v0.1_fql_' + this._table + '_' + this._key;
        },
        _key: null,
        _table: null,
        _fields: null,
        _cache: null,
        _subscribedToEvent: false
    }
});
FB.Type.createNamespace('FB.XFBML.Common');
FB.XFBML.Common.Constants = FB.Type.createClass({
    ctor: function () {},
    static_ctor: function () {
        FB.XFBML.Common.Constants.gendeR_MALE_SINGULAR = 'male';
        FB.XFBML.Common.Constants.gendeR_FEMALE_SINGULAR = 'female';
    }
});
FB.Type.createNamespace('FB.XFBML');
FB.XFBML.OperatorType = FB.Type.createEnum({
    and: 0,
    or: 1,
    xor: 2,
    not: 3,
    greaterThan: 4,
    lessThan: 5,
    equals: 6
},
false);
FB.XFBML._elementState = FB.Type.createEnum({
    none: 0,
    onProcessCalled: 1,
    onDataReadyCalled: 2,
    waitForCondition: 4,
    ready: 8
},
false);
FB.XFBML.$create_ElementsRegistration = function FB_XFBML_ElementsRegistration(nameSpace, name, implementationType) {
    var $o = {};
    $o.nameSpace = nameSpace;
    $o.name = name;
    $o.implementationType = implementationType;
    return $o;
}
FB.XFBML.Element = FB.Type.createClass({
    ctor: function (domElement) {
        this._dependents = new FB.DependentWaitable();
        this.domElement = domElement;
        this.domElement._fbElement = this;
    },
    static: {
        fromDomElement: function (domElement) {
            return domElement._fbElement;
        }
    },
    instance: {
        process: function () {
            this._state = FB.XFBML._elementState.none;
            var conditionAttribute = this.getAttribute('condition', null);
            if (conditionAttribute) {
                if (typeof(conditionAttribute) === 'string') {
                    this._conditionResult = eval(conditionAttribute);
                }
                else {
                    FB.FBDebug.assert(typeof(conditionAttribute) === 'function', 'Invalid condition value');
                    var conditionFunction = conditionAttribute;
                    this._conditionResult = conditionFunction();
                }
            }
            var result = true;
            var resultReady = true;
            var pendingResult = this._conditionResult;
            if (!FB.Sys.isNullOrUndefined(this._conditionResult)) {
                if (FB.Type.getInstanceType(this._conditionResult) === Boolean) {
                    result = this._conditionResult;
                }
                else {
                    resultReady = pendingResult.get_isReady();
                    result = pendingResult.result;
                }
            }
            if (!resultReady) {
                this._state |= FB.XFBML._elementState.waitForCondition;
                (this._conditionResult).add_changed(FB.Delegate.create(this, this._onConditionChanged));
            }
            if ((resultReady && result) || (!resultReady && !this.getAttribute('noPreProcess', false))) {
                this.onProcess();
                this._state |= FB.XFBML._elementState.onProcessCalled;
                this._checkDataReady();
            }
            else if (resultReady && !result) {
                this.onConditionFalse();
                this.set_isReady(true);
            }
        },
        isValid: function () {
            var parentNode = this.domElement;
            while (parentNode) {
                if (parentNode === document.body) {
                    return true;
                }
                else {
                    parentNode = parentNode.parentNode;
                }
            }
            return false;
        },
        refresh: function () {
            if ((this._state & FB.XFBML._elementState.waitForCondition) && this._conditionResult) {
                (this._conditionResult).remove_changed(FB.Delegate.create(this, this._onConditionChanged));
            }
            this._state = FB.XFBML._elementState.none;
            this._conditionResult = null;
            this._dependents.resetChange();
            this._dependents.removeAll();
            FB.UI.UIElement.removeCssClass(this.domElement, 'FB_ElementReady');
            this.clearVisual();
            this.process();
        },
        _onConditionChanged: function (condition) {
            if (condition.get_isReady()) {
                condition.remove_changed(FB.Delegate.create(this, this._onConditionChanged));
                this._state &= ~FB.XFBML._elementState.waitForCondition;
                if (condition.result) {
                    if (! (this._state & FB.XFBML._elementState.onProcessCalled)) {
                        this.onProcess();
                        this._state |= FB.XFBML._elementState.onProcessCalled;
                    }
                    this._checkDataReady();
                }
                else {
                    this.onConditionFalse();
                    this.set_isReady(true);
                }
            }
        },
        onConditionFalse: function () {
            FB.UI.UIElement.addCssClass(this.domElement, 'FB_ElementConditionFalse');
            this.domElement.style.display = 'none';
        },
        get_isReady: function () {
            return (this._state & FB.XFBML._elementState.ready);
        },
        set_isReady: function (value) {
            if (value !== this.get_isReady()) {
                if (value) {
                    this._state |= FB.XFBML._elementState.ready;
                }
                else {
                    this._state &= ~FB.XFBML._elementState.ready;
                }
                if (value) {
                    FB.UI.UIElement.addCssClass(this.domElement, 'FB_ElementReady');
                }
                else {
                    FB.UI.UIElement.removeCssClass(this.domElement, 'FB_ElementReady');
                }
                if (this.__isReadyChanged) {
                    this.__isReadyChanged(this, null);
                }
            }
            return value;
        },
        onProcess: function () {},
        onDataReady: function () {},
        clearVisual: function () {
            this.domElement.innerHTML = '';
        },
        _getAttributeFromList: function (name, defaultValue, acceptableValues) {
            var attrValue = this.getAttribute(name, defaultValue);
            var $enum1 = new FB.ArrayEnumerator(acceptableValues);
            while ($enum1.moveNext()) {
                var value = $enum1.get_current();
                if (attrValue === value) {
                    return value;
                }
            }
            return defaultValue;
        },
        getAttribute: function (name, defaultValue) {
            var value = this.domElement.getAttribute(name);
            if (!value) {
                value = defaultValue;
            }
            return value;
        },
        _getBoolAttribute: function (name, defaultValue) {
            var value = defaultValue;
            var s = this.domElement.getAttribute(name);
            if (s) {
                value = FB.Sys.parseBool(s);
            }
            return value;
        },
        addDataToWait: function (pendingResult) {
            this._dependents.addDependent(pendingResult);
        },
        _checkDataReady: function () {
            if (this._dependents.get_isReady()) {
                if (! (this._state & FB.XFBML._elementState.waitForCondition)) {
                    this.onDataReady();
                }
            }
            else {
                this._dependents.waitUntilReady(FB.Delegate.create(this, function (r) {
                    this._checkDataReady();
                }));
            }
        },
        add_isReadyChanged: function (value) {
            this.__isReadyChanged = FB.Delegate.combine(this.__isReadyChanged, value);
        },
        remove_isReadyChanged: function (value) {
            this.__isReadyChanged = FB.Delegate.remove(this.__isReadyChanged, value);
        },
        __isReadyChanged: null,
        domElement: null,
        _conditionResult: null,
        _state: 0
    }
});
FB.XFBML.UnconnectedFriendsCount = FB.Type.createClass({
    base: FB.XFBML.Element,
    ctor: function (domElement) {
        FB.XFBML.UnconnectedFriendsCount.constructBase(this, [domElement]);
    },
    instance: {
        onProcess: function () {
            this.addDataToWait(FB.XFBML.Context.singleton.get_unconnectedFriendsCount());
        },
        onDataReady: function () {
            var result = FB.XFBML.Context.singleton.get_unconnectedFriendsCount();
            if (!result.exception) {
                var count = FB.XFBML.Context.singleton.get_unconnectedFriendsCount().result;
                this.domElement.innerHTML = count.toString() + ' ';
            }
            else {
                FB.FBDebug.logLine(1, 'Can\'t render UnconnectedFriendsCount because of invalid data');
            }
            this.set_isReady(true);
        }
    }
});
FB.XFBML.Operator = FB.Type.createClass({
    base: FB.DependentWaitable,
    ctor: function (op, operands) {
        FB.XFBML.Operator.constructBase(this);
        this._op$2 = op;
        this._operands$2 = operands;
        var $enum1 = new FB.ArrayEnumerator(operands);
        while ($enum1.moveNext()) {
            var operand = $enum1.get_current();
            if (FB.Sys.isAssignableFrom(FB.Type.getInstanceType(operand), FB.Waitable)) {
                this.addDependent(operand);
            }
        }
    },
    static: {
        and: function (op1, op2) {
            return new FB.XFBML.Operator(FB.XFBML.OperatorType.and, [op1, op2]);
        },
        or: function (op1, op2) {
            return new FB.XFBML.Operator(FB.XFBML.OperatorType.or, [op1, op2]);
        },
        xor: function (op1, op2) {
            return new FB.XFBML.Operator(FB.XFBML.OperatorType.xor, [op1, op2]);
        },
        not: function (op) {
            return new FB.XFBML.Operator(FB.XFBML.OperatorType.not, [op]);
        },
        greaterThan: function (op1, op2) {
            return new FB.XFBML.Operator(FB.XFBML.OperatorType.greaterThan, [op1, op2]);
        },
        lessThan: function (op1, op2) {
            return new FB.XFBML.Operator(FB.XFBML.OperatorType.lessThan, [op1, op2]);
        },
        equals: function (op1, op2) {
            return new FB.XFBML.Operator(FB.XFBML.OperatorType.equals, [op1, op2]);
        }
    },
    instance: {
        onChange: function () {
            this._evaluate$2();
            FB.XFBML.Operator.callBase(this, 'onChange');
        },
        _evaluate$2: function () {
            switch (this._op$2) {
            case FB.XFBML.OperatorType.and:
                this.result = this._getOperandValue$2(0) && this._getOperandValue$2(1);
                break;
            case FB.XFBML.OperatorType.not:
                this.result = !this._getOperandValue$2(0);
                break;
            case FB.XFBML.OperatorType.or:
                this.result = this._getOperandValue$2(0) || this._getOperandValue$2(1);
                break;
            case FB.XFBML.OperatorType.xor:
                this.result = this._getOperandValue$2(0) ^ this._getOperandValue$2(1);
                break;
            case FB.XFBML.OperatorType.greaterThan:
                this.result = this._getOperandValue$2(0) > this._getOperandValue$2(1);
                break;
            case FB.XFBML.OperatorType.lessThan:
                this.result = this._getOperandValue$2(0) < this._getOperandValue$2(1);
                break;
            case FB.XFBML.OperatorType.equals:
                this.result = this._getOperandValue$2(0) === this._getOperandValue$2(1);
                break;
            }
        },
        _getOperandValue$2: function (i) {
            var obj = this._operands$2[i];
            if (FB.Sys.isAssignableFrom(FB.Type.getInstanceType(obj), FB.Waitable)) {
                return (obj).result;
            }
            else {
                return obj;
            }
        },
        _op$2: 0,
        _operands$2: null
    }
});
FB.XFBML.Conditions = FB.Type.createClass({
    ctor: function () {},
    static_ctor: function () {
        FB.XFBML.Conditions._table = new FB.XFBML._permisionTable();
    },
    static: {
        ifCanSee: function (uid, what) {
            return FB.XFBML.Conditions._table.ifCanSee(uid, what);
        }
    }
});
FB.XFBML._permisionTable = FB.Type.createClass({
    ctor: function () {
        this._calls = {};
    },
    instance: {
        ifCanSee: function (uid, what) {
            var key = uid + what;
            var result;
            var record = this._calls[key];
            if (!record) {
                result = new FB.PendingResult();
                record = {
                    uid: uid,
                    what: what,
                    result: result
                };
                this._calls[key] = record;
                var context = FB.XFBML.Context.singleton;
                if (!this._subscribedToEvent) {
                    context.add_beforeSendBatchRequest(FB.Delegate.create(this, this._beforeSendBatchRequest));
                    this._subscribedToEvent = true;
                }
                context.requestBatchProcess();
            }
            else {
                result = record['result'];
            }
            return result;
        },
        _beforeSendBatchRequest: function () {
            var uids = [];
            var permissions = [];
            var pendingResults = [];
            var $dict1 = this._calls;
            for (var $key2 in $dict1) {
                var entry = {
                    key: $key2,
                    value: $dict1[$key2]
                };
                var record = entry.value;
                FB.Sys.add(uids, record['uid']);
                FB.Sys.add(permissions, record['what']);
                FB.Sys.add(pendingResults, record['result']);
            }
            this._calls = {};
            var combinedResult = FB.Facebook.apiClient.privacy_canSee(uids, permissions, FB.XFBML.Context.singleton.get_batchSequencer());
            combinedResult.waitUntilReady(FB.Delegate.create(this, function (r) {
                var c = pendingResults.length;
                var rows = combinedResult.result;
                if (rows) {
                    FB.FBDebug.assert(c === rows.length, 'Returns results does not contains the exepcted number of items');
                    for (var i = 0; i < c; i++) {
                        (pendingResults[i]).setPendingResult(rows[i], combinedResult.exception);
                    }
                }
                else {
                    for (var i = 0; i < c; i++) {
                        (pendingResults[i]).setPendingResult(null, combinedResult.exception);
                    }
                }
            }));
        },
        _subscribedToEvent: false
    }
});
FB.XFBML.Context = FB.Type.createClass({
    ctor: function () {
        this.resources = new FB.XFBML.Resources.ResourceDict();
        this.fqlTables = {};
        this._timerId = -1;
        this._connectStatus = FB.ConnectState.userNotLoggedIn;
        FB.Facebook.add_initCalled(FB.Delegate.create(this, function () {
            if (!this._initialized) {
                this._initialized = true;
                this._connectStatus = FB.Connect.get_status().result;
                this._connectStatusReady = FB.Connect.get_status().get_isReady();
                FB.XFBML.Data.CacheManager._changeContext(FB.Connect.get_loggedInUser());
                FB.Connect.get_status().add_changed(FB.Delegate.create(this, this._onConnectStatusChanged));
            }
            if (FB.XFBML.Host.autoParseDomTree) {
                FB.XFBML.Host.parseDomTree();
            }
        }));
    },
    static_ctor: function () {
        FB.XFBML.Context.singleton = null;
        FB.XFBML.Context.singleton = new FB.XFBML.Context();
    },
    instance: {
        requestBatchProcess: function () {
            if (this._timerId === -1) {
                this._timerId = window.setTimeout(FB.Delegate.create(this, this._onTimer), 0);
            }
        },
        get_batchSequencer: function () {
            if (!this._batchSequencer) {
                this._batchSequencer = new FB.BatchSequencer();
                this._batchSequencer.isParallel = true;
                this.requestBatchProcess();
            }
            return this._batchSequencer;
        },
        _onTimer: function () {
            FB.Connect.get_status().waitUntilReady(FB.Delegate.create(this, function (status) {
                if (this.__beforeSendBatchRequest) {
                    this.__beforeSendBatchRequest();
                }
                this._timerId = -1;
                if (this._batchSequencer) {
                    this._batchSequencer.execute(null);
                    this._batchSequencer = null;
                }
            }));
        },
        getFqlTable: function (tableName, indexKey) {
            var key = tableName + indexKey;
            var table = this.fqlTables[key];
            if (!table) {
                table = new FB.XFBML.Data.FqlTable(tableName, indexKey);
                this.fqlTables[key] = table;
            }
            return table;
        },
        get_unconnectedFriendsCount: function () {
            if (!this._unconnectedFriendsCount) {
                this._unconnectedFriendsCount = new FB.PendingResult();
                FB.Connect.get_status().waitUntilReady(FB.Delegate.create(this, function (state) {
                    var cachedItem = FB.XFBML.Data.CacheManager._getValue('UnconnectedFriendsCount');
                    var fetch = true;
                    if (cachedItem) {
                        var age = (new Date()).getTime() - cachedItem.createTime;
                        if (age < FB.XFBML.Data.CacheManager._maxUsableAge) {
                            this._unconnectedFriendsCount.setPendingResult(cachedItem.data, null);
                            if (age < FB.XFBML.Data.CacheManager._refreshInternal) {
                                fetch = false;
                            }
                        }
                    }
                    if (fetch) {
                        var r = FB.Facebook.apiClient.connect_getUnconnectedFriendsCount(this.get_batchSequencer());
                        r.waitUntilReady(FB.Delegate.create(this, function (result) {
                            this._unconnectedFriendsCount.setPendingResult(r.result, r.exception);
                            FB.XFBML.Data.CacheManager._setValue('UnconnectedFriendsCount', FB.XFBML.Data.$create__cachedItem(r.result, (new Date()).getTime()));
                        }));
                    }
                }));
            }
            return this._unconnectedFriendsCount;
        },
        _onConnectStatusChanged: function (waitable) {
            var newState = FB.Connect.get_status().result;
            FB.XFBML.Data.CacheManager._changeContext(FB.Connect.get_loggedInUser());
            if (this._connectStatusReady && newState !== this._connectStatus && newState === FB.ConnectState.connected) {
                this._onConnectStateChangedToConnected();
            }
            this._connectStatusReady = FB.Connect.get_status().get_isReady();
            this._connectStatus = newState;
        },
        _onConnectStateChangedToConnected: function () {
            FB.FBDebug.logLine(2, 'Connect state changed from from ready but unconnected to ready and connected');
            this.fqlTables = {};
            this._unconnectedFriendsCount = null;
            FB.XFBML.Host.refresh();
        },
        add_beforeSendBatchRequest: function (value) {
            this.__beforeSendBatchRequest = FB.Delegate.combine(this.__beforeSendBatchRequest, value);
        },
        remove_beforeSendBatchRequest: function (value) {
            this.__beforeSendBatchRequest = FB.Delegate.remove(this.__beforeSendBatchRequest, value);
        },
        __beforeSendBatchRequest: null,
        _batchSequencer: null,
        _unconnectedFriendsCount: null,
        _connectStatusReady: false,
        _initialized: false
    }
});
FB.XFBML.ContainerElement = FB.Type.createClass({
    base: FB.XFBML.Element,
    ctor: function (domElement) {
        FB.XFBML.ContainerElement.constructBase(this, [domElement]);
    },
    instance: {
        onDataReady: function () {
            this.set_isReady(true);
        }
    }
});
FB.XFBML.LoginButton = FB.Type.createClass({
    base: FB.XFBML.Element,
    ctor: function (domElement) {
        this.status = FB.ConnectState.userNotLoggedIn;
        FB.XFBML.LoginButton.constructBase(this, [domElement]);
        FBIntern.Utility.addEventListener(this.domElement, 'click', FB.Delegate.create(this, this._onClick$1));
        this.domElement.innerHTML = '';
        this.domElement.appendChild(FB.UI.DomResources.getResourceById('fb_login'));
        this._updateUI$1(null);
        FB.Connect.get_status().add_changed(FB.Delegate.create(this, this._updateUI$1));
    },
    instance: {
        clearVisual: function () {},
        _onClick$1: function (e) {
            if (this.logoutOnClick) {
                FB.Connect.logout(null);
            }
            else {
                var onLoginHandler = this.getAttribute('onlogin', '');
                if (onLoginHandler !== '') {
                    FB.Facebook.get_sessionWaitable().waitUntilReady(FB.Delegate.create(this, function (state) {
                        if ((state).uid !== '') {
                            eval(onLoginHandler);
                        }
                    }));
                }
                FB.Connect.requireSession(null);
            }
        },
        _updateUI$1: function (statusWaitable) {
            var oldStatus = this.status;
            this.status = (FB.Connect.get_status().get_isReady()) ? FB.Connect.get_status().result : FB.ConnectState.userNotLoggedIn;
            var cssDict = {};
            cssDict[FB.Enum.toString(FB.ConnectState, FB.ConnectState.appNotAuthorized)] = 'fb_login_not_authorized';
            cssDict[FB.Enum.toString(FB.ConnectState, FB.ConnectState.connected)] = 'fb_login_ready';
            cssDict[FB.Enum.toString(FB.ConnectState, FB.ConnectState.userNotLoggedIn)] = 'fb_login_not_logged_in';
            FB.UI.UIElement.removeCssClass(this.domElement, cssDict[FB.Enum.toString(FB.ConnectState, oldStatus)]);
            FB.UI.UIElement.addCssClass(this.domElement, cssDict[FB.Enum.toString(FB.ConnectState, this.status)]);
            var image = FBIntern.UIHelper.findElementById(this.domElement, 'fb_login_image');
            this.logoutOnClick = (this.status === FB.ConnectState.connected && this._getBoolAttribute('autologoutlink', false));
            image.src = this.getImageSrc();
            image.alt = (this.logoutOnClick) ? 'Logout' : 'Connect';
        },
        getImageSrc: function () {
            var size = this._getAttributeFromList('size', 'large', ['small', 'medium', 'large']);
            var background = this._getAttributeFromList('background', 'light', ['white', 'light', 'dark']);
            var length = this._getAttributeFromList('length', 'short', ['long', 'short']);
            var resourceId;
            if (this.logoutOnClick) {
                resourceId = 'logout_img_' + size;
            }
            else {
                resourceId = 'login_img_' + background + '_' + size + '_' + length;
            }
            var src = FBIntern.FbGlobals.get_fB_StaticResourceVersions()[resourceId];
            FB.FBDebug.assert(src, 'Image source not found for resource ' + resourceId);
            return src;
        },
        onProcess: function () {
            this.set_isReady(true);
        },
        logoutOnClick: false
    }
});
FB.XFBML.UserStatus = FB.Type.createClass({
    base: FB.XFBML.Element,
    ctor: function (domElement) {
        FB.XFBML.UserStatus.constructBase(this, [domElement]);
    },
    instance: {
        onProcess: function () {
            this._uid$1 = FB.XFBML.ConnectUtility.normalizeInt64ForId(this.getAttribute('uid', null));
            if (!this._uid$1) {
                throw new Error('No \'uid\' parameter provided.');
            }
            this._data$1 = FB.XFBML.Context.singleton.getFqlTable('user', 'uid').selectByKey(['status'], this._uid$1);
            this.addDataToWait(this._data$1);
        },
        onDataReady: function () {
            var user = this._data$1.result;
            if (user && user.status) {
                var message = user.status.message;
                if (message) {
                    if ((message.length > 0) && (message.charAt(message.length - 1) !== '.')) {
                        message = message + '.';
                    }
                }
                else {
                    message = '';
                }
                this.domElement.innerHTML = FB.Sys.htmlEncode(message);
            }
            this.set_isReady(true);
        },
        _data$1: null,
        _uid$1: null
    }
});
FB.XFBML.UserLink = FB.Type.createClass({
    base: FB.XFBML.Element,
    ctor: function (domElement) {
        FB.XFBML.UserLink.constructBase(this, [domElement]);
    },
    instance: {
        onProcess: function () {
            this._uid$1 = FB.XFBML.ConnectUtility.normalizeInt64ForId(this.getAttribute('uid', null));
            if (!this._uid$1) {
                throw new Error('No uid parameter was provided.');
            }
            var fields = [];
            FB.Sys.addRange(fields, ['uid', 'name']);
            this._showNetwork$1 = this._getBoolAttribute('shownetwork', true);
            if (this._showNetwork$1) {
                FB.Sys.add(fields, 'affiliations');
            }
            this._data$1 = FB.XFBML.Context.singleton.getFqlTable('user', 'uid').selectByKey(fields, this._uid$1);
            this.addDataToWait(this._data$1);
        },
        onDataReady: function () {
            var user = this._data$1.result;
            if (user) {
                var q_params = {
                    id: user.uid
                };
                var href = FBIntern.Utility.createFacebookUrl('www', 'profile.php', q_params, true);
                var content = user.name;
                if (this._showNetwork$1) {
                    content += ' ' + FB.XFBML.ConnectUtility.getNetworkInParentheses(user);
                }
                var html = '<a href=\'' + href + '\'>' + FB.Sys.htmlEncode(content) + '</a>';
                this.domElement.innerHTML = html;
            }
            else {
                var altText = this.getAttribute('ifcantsee', null);
                if (altText) {
                    this.domElement.innerHTML = FB.Sys.htmlEncode(altText);
                }
            }
            this.set_isReady(true);
        },
        _data$1: null,
        _uid$1: null,
        _showNetwork$1: false
    }
});
FB.XFBML.Photo = FB.Type.createClass({
    base: FB.XFBML.Element,
    ctor: function (domElement) {
        FB.XFBML.Photo.constructBase(this, [domElement]);
    },
    instance: {
        onProcess: function () {
            this._pid$1 = FB.XFBML.ConnectUtility.normalizeInt64ForId(this.getAttribute('pid', null));
            if (!this._pid$1) {
                throw new Error('No pid parameter was provided.');
            }
            var size = this.getAttribute('size', 'normal');
            var sizeToSrcFieldMap = {
                thumb: 'src_small',
                t: 'src_small',
                small: 'src',
                s: 'src',
                normal: 'src_big',
                n: 'src_big'
            };
            this._srcFieldName$1 = sizeToSrcFieldMap[size];
            if (!this._srcFieldName$1) {
                this._srcFieldName$1 = 'src_big';
            }
            this._data$1 = FB.XFBML.Context.singleton.getFqlTable('photo', 'pid').selectByKey(['pid', 'caption', this._srcFieldName$1], this._pid$1);
            this.addDataToWait(this._data$1);
        },
        onDataReady: function () {
            var photo = this._data$1.result;
            if (photo) {
                var html = FB.Sys.format('<img src=\'{0}\' alt=\'{1}\' title=\'{1}\' />', photo[this._srcFieldName$1], photo.caption);
                this.domElement.innerHTML = html;
            }
            this.set_isReady(true);
        },
        _data$1: null,
        _pid$1: null,
        _srcFieldName$1: null
    }
});
FB.XFBML.Video = FB.Type.createClass({
    base: FB.XFBML.Element,
    ctor: function (domElement) {
        FB.XFBML.Video.constructBase(this, [domElement]);
    },
    instance: {
        onProcess: function () {
            this._vid$1 = FB.XFBML.ConnectUtility.normalizeInt64ForId(this.getAttribute('vid', null));
            this._width$1 = this.getAttribute('width', '576');
            this._height$1 = this.getAttribute('height', '432');
        },
        onDataReady: function () {
            var url = FB.Sys.format('http://www.facebook.com/swf/mvp.swf?vid={0}&stage_width={1}&stage_height={2}', this._vid$1, this._width$1, this._height$1);
            var html = FB.Sys.format('\n<object width=\"{0}\" height=\"{1}\">\n<param name=\"movie\" value=\"{2}\"></param>\n<param name=\"allowFullScreen\" value=\"true\"></param>\n<param name=\"allowScriptAccess\" value=\"always\"></param>\n<embed src=\"{2}\" type=\"application/x-shockwave-flash\" allowScriptAccess=\"always\" allowFullScreen=\"true\" width=\"{0}\" height=\"{1}\"></embed>\n</object>', this._width$1, this._height$1, url);
            this.domElement.innerHTML = html;
            this.set_isReady(true);
        },
        _vid$1: null,
        _width$1: null,
        _height$1: null
    }
});
FB.XFBML.GroupLink = FB.Type.createClass({
    base: FB.XFBML.Element,
    ctor: function (domElement) {
        FB.XFBML.GroupLink.constructBase(this, [domElement]);
    },
    instance: {
        onProcess: function () {
            this._gid$1 = FB.XFBML.ConnectUtility.normalizeInt64ForId(this.getAttribute('gid', null));
            if (!this._gid$1) {
                throw new Error('No gid parameter');
            }
            this._data$1 = FB.XFBML.Context.singleton.getFqlTable('group', 'gid').selectByKey(['gid', 'name'], this._gid$1);
            this.addDataToWait(this._data$1);
        },
        onDataReady: function () {
            var group = this._data$1.result;
            if (group) {
                var q_params = {
                    gid: group.gid
                };
                var href = FBIntern.Utility.createFacebookUrl('www', 'group.php', q_params, true);
                var html = '<a href=\'' + href + '\'>' + FB.Sys.htmlEncode(group.name) + '</a>';
                this.domElement.innerHTML = html;
            }
            this.set_isReady(true);
        },
        _data$1: null,
        _gid$1: null
    }
});
FB.XFBML.EventLink = FB.Type.createClass({
    base: FB.XFBML.Element,
    ctor: function (domElement) {
        FB.XFBML.EventLink.constructBase(this, [domElement]);
    },
    instance: {
        onProcess: function () {
            this._eid$1 = FB.XFBML.ConnectUtility.normalizeInt64ForId(this.getAttribute('eid', null));
            if (!this._eid$1) {
                throw new Error('No eid parameter');
            }
            this._data$1 = FB.XFBML.Context.singleton.getFqlTable('event', 'eid').selectByKey(['eid', 'name'], this._eid$1);
            this.addDataToWait(this._data$1);
        },
        onDataReady: function () {
            var e = this._data$1.result;
            if (e) {
                var q_params = {
                    eid: e.eid
                };
                var href = FBIntern.Utility.createFacebookUrl('www', 'event.php', q_params, true);
                var html = '<a href=\'' + href + '\'>' + FB.Sys.htmlEncode(e.name) + '</a>';
                this.domElement.innerHTML = html;
            }
            this.set_isReady(true);
        },
        _data$1: null,
        _eid$1: null
    }
});
FB.XFBML.ShareButton = FB.Type.createClass({
    base: FB.XFBML.Element,
    ctor: function (domElement) {
        FB.XFBML.ShareButton.constructBase(this, [domElement]);
    },
    instance: {
        onProcess: function () {
            this._href$1 = this.getAttribute('href', null);
            if (!this._href$1) {
                throw new Error('No href parameter');
            }
        },
        onDataReady: function () {
            var html = FB.Sys.format('<a href=\'{0}\' class=\'fb_share_button\' onclick=\'FB.Connect.showShareDialog(\"{0}\", function() {}); return false;\' target=\'_blank\' style=\'text-decoration:none;\'>Share</a>', this._href$1);
            this.domElement.innerHTML = html;
            this.set_isReady(true);
        },
        _href$1: null
    }
});
FB.XFBML.AddSectionButton = FB.Type.createClass({
    base: FB.XFBML.Element,
    ctor: function (domElement) {
        FB.XFBML.AddSectionButton.constructBase(this, [domElement]);
    },
    instance: {
        onProcess: function () {
            this._section$1 = this.getAttribute('section', null);
            if (!this._section$1) {
                this._section$1 = 'profile';
            }
        },
        onDataReady: function () {
            FB.Connect.showAddSectionButton(this._section$1, this.domElement);
            this.set_isReady(true);
        },
        _section$1: null
    }
});
FB.XFBML.Name = FB.Type.createClass({
    base: FB.XFBML.Element,
    ctor: function (domElement) {
        FB.XFBML.Name.constructBase(this, [domElement]);
    },
    instance: {
        onProcess: function () {
            this._uid$1 = FB.XFBML.ConnectUtility.normalizeInt64ForId(this.getAttribute('uid', null));
            if (this._uid$1 === 'loggedinuser') {
                if (FB.Facebook.apiClient.get_session()) {
                    this._uid$1 = FB.Connect.get_loggedInUser();
                }
                else {
                    FB.FBDebug.logLine(2, 'Cannot use loggedinuser, there is no session');
                    this._uid$1 = null;
                    return;
                }
            }
            if (!this._uid$1) {
                FB.FBDebug.logLine(2, 'fb:name has no user id');
                return;
            }
            var fields = [];
            FB.Sys.addRange(fields, ['first_name', 'last_name', 'sex', 'pic']);
            this._possessive$1 = this._getBoolAttribute('possessive', false);
            this._reflexive$1 = this._getBoolAttribute('reflexive', false);
            this._objective$1 = this._getBoolAttribute('objective', false);
            if (FB.Facebook.apiClient.get_session()) {
                this._shownetwork$1 = this._getBoolAttribute('shownetwork', false);
            }
            this._linked$1 = this._getBoolAttribute('linked', true);
            this._firstnameonly$1 = this._getBoolAttribute('firstnameonly', false);
            this._lastnameonly$1 = this._getBoolAttribute('lastnameonly', false);
            if (this._shownetwork$1) {
                FB.Sys.add(fields, 'affiliations');
            }
            this._data$1 = FB.XFBML.Context.singleton.getFqlTable('user', 'uid').selectByKey(fields, this._uid$1);
            this.addDataToWait(this._data$1);
            this._subjectId$1 = FB.XFBML.ConnectUtility.normalizeInt64ForId(this.getAttribute('subjectid', null));
            if (this._subjectId$1) {
                if (FBIntern.Utility.id64BitEquals(this._subjectId$1, FB.Connect.get_loggedInUser())) {
                    this._reflexive$1 = true;
                }
                this._pendingSubjectData$1 = FB.XFBML.Context.singleton.getFqlTable('user', 'uid').selectByKey(['first_name', 'last_name', 'sex', 'network'], this._subjectId$1);
                this.addDataToWait(this._pendingSubjectData$1);
            }
        },
        onDataReady: function () {
            if (this._uid$1) {
                if (FBIntern.Utility.id64BitEquals(this._subjectId$1, this._uid$1)) {
                    this.renderPronoun();
                }
                else {
                    this._renderOther$1();
                }
            }
            this.set_isReady(true);
        },
        renderPronoun: function () {
            var userInfo = this._data$1.result;
            var word = '';
            var objective = this._objective$1;
            if (this._subjectId$1) {
                objective = true;
                if (this._subjectId$1 === this._uid$1) {
                    this._reflexive$1 = true;
                }
            }
            if ((FBIntern.Utility.id64BitEquals(this._uid$1, FB.Connect.get_loggedInUser())) && this._getBoolAttribute('useyou', true)) {
                if (this._possessive$1) {
                    if (this._reflexive$1) {
                        word = 'your own';
                    }
                    else {
                        word = 'your';
                    }
                }
                else { if (this._reflexive$1) {
                        word = 'yourself';
                    }
                    else {
                        word = 'you';
                    }
                }
            }
            else {
                switch (userInfo.sex) {
                case FB.XFBML.Common.Constants.gendeR_MALE_SINGULAR:
                    if (this._possessive$1) {
                        word = (this._reflexive$1) ? 'his own' : 'his';
                    }
                    else { if (this._reflexive$1) {
                            word = 'himself';
                        }
                        else if (objective) {
                            word = 'him';
                        }
                        else {
                            word = 'he';
                        }
                    }
                    break;
                case FB.XFBML.Common.Constants.gendeR_FEMALE_SINGULAR:
                    if (this._possessive$1) {
                        word = (this._reflexive$1) ? 'her own' : 'her';
                    }
                    else { if (this._reflexive$1) {
                            word = 'herself';
                        }
                        else if (objective) {
                            word = 'her';
                        }
                        else {
                            word = 'she';
                        }
                    }
                    break;
                default:
                    if (this._getBoolAttribute('usethey', true)) {
                        if (this._possessive$1) {
                            if (this._reflexive$1) {
                                word = 'their own';
                            }
                            else {
                                word = 'their';
                            }
                        }
                        else { if (this._reflexive$1) {
                                word = 'themselves';
                            }
                            else if (objective) {
                                word = 'them';
                            }
                            else {
                                word = 'they';
                            }
                        }
                    }
                    else { if (this._possessive$1) {
                            if (this._reflexive$1) {
                                word = 'his/her own';
                            }
                            else {
                                word = 'his/her';
                            }
                        }
                        else { if (this._reflexive$1) {
                                word = 'himself/herself';
                            }
                            else if (objective) {
                                word = 'him/her';
                            }
                            else {
                                word = 'he/she';
                            }
                        }
                    }
                    break;
                }
            }
            if (this._getBoolAttribute('capitalize', false)) {
                word = FB.XFBML.ConnectUtility.upperCaseFirstChar(word);
            }
            this.domElement.innerHTML = word;
        },
        _renderOther$1: function () {
            var userInfo = this._data$1.result;
            if (!userInfo) {
                FB.FBDebug.logLine(1, 'no data available');
                return;
            }
            var name = '';
            var html = '';
            var network = '';
            if (FBIntern.Utility.id64BitEquals(this._uid$1, FB.Connect.get_loggedInUser()) && this._getBoolAttribute('useyou', true)) {
                if (this._reflexive$1) {
                    if (this._possessive$1) {
                        name = 'your own';
                    }
                    else {
                        name = 'yourself';
                    }
                }
                else { if (this._possessive$1) {
                        name = 'your';
                    }
                    else {
                        name = 'you';
                    }
                }
            }
            else { if (null === userInfo.first_name) {
                    userInfo.first_name = '';
                }
                if (null === userInfo.last_name) {
                    userInfo.last_name = '';
                }
                if (this._firstnameonly$1) {
                    name = userInfo.first_name;
                }
                else if (this._lastnameonly$1) {
                    name = userInfo.last_name;
                }
                else if (userInfo.first_name !== '') {
                    name = userInfo.first_name;
                    if (userInfo.last_name !== '') {
                        name += ' ' + userInfo.last_name;
                    }
                }
                if (name !== '' && this._possessive$1) {
                    name += '\'s';
                }
                if (this._shownetwork$1) {
                    network = FB.XFBML.ConnectUtility.getNetworkInParentheses(userInfo);
                }
            }
            if (name === '') {
                name = this.getAttribute('ifcantsee', 'Facebook User');
            }
            if (name !== '') {
                if (this._getBoolAttribute('capitalize', false)) {
                    name = FB.XFBML.ConnectUtility.upperCaseFirstChar(name);
                }
                if (this._linked$1) {
                    html = FB.XFBML.ConnectUtility._profileLink(userInfo, name, this.getAttribute('href', null));
                }
                else {
                    html = name;
                }
            }
            if (!FB.Facebook.apiClient.get_session()) {
                html = '<b>' + html + '</b>';
            }
            if (this._shownetwork$1) {
                html += ' ' + network;
            }
            this.domElement.innerHTML = html;
        },
        _data$1: null,
        _pendingSubjectData$1: null,
        _subjectId$1: null,
        _uid$1: null,
        _possessive$1: false,
        _firstnameonly$1: false,
        _linked$1: false,
        _lastnameonly$1: false,
        _reflexive$1: false,
        _shownetwork$1: false,
        _objective$1: false
    }
});
FB.XFBML.Pronoun = FB.Type.createClass({
    base: FB.XFBML.Name,
    ctor: function (domElement) {
        FB.XFBML.Pronoun.constructBase(this, [domElement]);
    },
    instance: {
        onDataReady: function () {
            this.renderPronoun();
            this.set_isReady(true);
        }
    }
});
FB.XFBML.ProfilePic = FB.Type.createClass({
    base: FB.XFBML.Element,
    ctor: function (domElement) {
        FB.XFBML.ProfilePic.constructBase(this, [domElement]);
    },
    static_ctor: function () {
        FB.XFBML.ProfilePic._defaultPicMap$1 = null;
        FB.XFBML.ProfilePic._defaultPicMap$1 = {
            pic_small: 't_silhouette.jpg',
            pic: 's_silhouette.jpg',
            pic_big: 'd_silhouette.gif',
            pic_square: 'q_silhouette.gif',
            pic_small_with_logo: 't_silhouette_logo.gif',
            pic_with_logo: 's_silhouette_logo.gif',
            pic_big_with_logo: 'd_silhouette_logo.gif',
            pic_square_with_logo: 'q_silhouette_logo.gif'
        };
    },
    static: {
        _addPxIfNecessary$1: function (unitAttribute) {
            return (FBIntern.Utility.isStrInt(unitAttribute)) ? unitAttribute + 'px' : unitAttribute;
        }
    },
    instance: {
        onProcess: function () {
            var size = this.getAttribute('size', 'thumb');
            var sizeToPicFieldMap = {
                thumb: 'pic_small',
                small: 'pic',
                normal: 'pic_big',
                square: 'pic_square',
                t: 'pic_small',
                s: 'pic',
                n: 'pic_big',
                q: 'pic_square'
            };
            this._picFieldName$1 = sizeToPicFieldMap[size];
            if (!this._picFieldName$1) {
                this._picFieldName$1 = 'pic';
            }
            if (this._getBoolAttribute('facebook-logo', false)) {
                this._picFieldName$1 += '_with_logo';
            }
            this._linked$1 = this._getBoolAttribute('linked', true);
            var widthAttribute = this.getAttribute('width', null);
            var heightAttribute = this.getAttribute('height', null);
            if (widthAttribute) {
                this.domElement.style.width = FB.XFBML.ProfilePic._addPxIfNecessary$1(widthAttribute);
            }
            if (heightAttribute) {
                this.domElement.style.height = FB.XFBML.ProfilePic._addPxIfNecessary$1(heightAttribute);
            }
            this._uid$1 = FB.XFBML.ConnectUtility.normalizeInt64ForId(this.getAttribute('uid', null));
            if (this._uid$1 === 'loggedinuser') {
                if (FB.Facebook.apiClient.get_session()) {
                    this._uid$1 = FB.Connect.get_loggedInUser();
                }
                else {
                    FB.FBDebug.logLine(2, 'cannot use loggedinuser, there is no session');
                    this._uid$1 = null;
                    return;
                }
            }
            this._data$1 = FB.XFBML.Context.singleton.getFqlTable('user', 'uid').selectByKey(['name', this._picFieldName$1], this._uid$1);
            this.addDataToWait(this._data$1);
            if (!this._dependents.get_isReady()) {
                this._renderImage$1(null);
            }
        },
        onDataReady: function () {
            var userInfo = (this._data$1) ? this._data$1.result : null;
            this._renderImage$1(userInfo);
            this.set_isReady(true);
        },
        _renderImage$1: function (userInfo) {
            var imageSrc = (userInfo) ? userInfo[this._picFieldName$1] : null;
            if (!imageSrc) {
                var subdomain = (FBIntern.Utility.isSecure()) ? 'ssl' : 'static.ak';
                imageSrc = FBIntern.Utility.getFacebookUrl(subdomain) + 'pics/' + FB.XFBML.ProfilePic._defaultPicMap$1[this._picFieldName$1];
            }
            var cssWidth = this.domElement.style.width;
            var cssHeight = this.domElement.style.height;
            var style = ((cssWidth) ? 'width:' + cssWidth + ';' : '') + ((cssHeight) ? 'height:' + cssHeight + ';' : '');
            var html = FB.Sys.format('<img src=\'{0}\' alt=\'{1}\' title=\'{1}\' style=\'{2}\' class=\'{3}\' />', imageSrc, (userInfo) ? userInfo.name : '', style, this.domElement.className);
            if (this._linked$1) {
                html = FB.XFBML.ConnectUtility._profileLink(userInfo, html, this.getAttribute('href', null));
            }
            this.domElement.innerHTML = html;
            FB.UI.UIElement.addCssClass(this.domElement, 'fb_profile_pic_rendered');
        },
        _uid$1: null,
        _picFieldName$1: null,
        _linked$1: false,
        _data$1: null
    }
});
FB.XFBML.ServerFbml = FB.Type.createClass({
    base: FB.XFBML.Element,
    ctor: function (domElement) {
        FB.XFBML.ServerFbml.constructBase(this, [domElement]);
    },
    static_ctor: function () {
        FB.XFBML.ServerFbml._iframeIdCount$1 = 0;
    },
    instance: {
        onDataReady: function () {
            FB.IFrameUtil.ResizeUtilServer.run();
            this._createIframeDoc$1();
        },
        clearVisual: function () {
            if (this._iframeContainer$1) {
                this._iframeContainer$1.parentNode.removeChild(this._iframeContainer$1);
                this._iframeContainer$1 = null;
            }
        },
        _createIframeDoc$1: function () {
            var iframeName = 'fbmlIFrame_' + FB.XFBML.ServerFbml._iframeIdCount$1.toString();
            FB.XFBML.ServerFbml._iframeIdCount$1++;
            if (this._iframeContainer$1) {
                this.clearVisual();
            }
            this._iframeContainer$1 = this.domElement.appendChild(FB.XdComm.Server.singleton.createNamedHiddenIFrame(iframeName, FB.XdComm.Server.singleton.get_receiverUrl(), 'fbmlIframe', 'frameborder=\"0\"'));
            var iframeWidth = this.getAttribute('iframeWidth', null);
            var iframeHeight = this.getAttribute('iframeHeight', null);
            if (iframeWidth) {
                this._iframeContainer$1.style.width = iframeWidth;
            }
            if (iframeHeight) {
                this._iframeContainer$1.style.height = iframeHeight;
            }
            var frameWindow = (window.self.frames)[iframeName];
            FB.FBDebug.assert(!FB.Sys.isUndefined(frameWindow), 'frameWindow is null in CreateIframeDoc. Make sure this.domElement is inserted in the DOM before creating an iframe. (Did you try to insert it in a Dialog before calling Dialog.Show?');
            FBIntern.Utility.getIFrameDocument(iframeName, this._iframeContainer$1, FB.Delegate.create(this, function (iframeDoc) {
                iframeDoc.open();
                this._writeDoc$1(iframeDoc);
            }));
        },
        _getFBML$1: function () {
            var fbml = this.getAttribute('fbml', null);
            if (!fbml) {
                var c = this.domElement.childNodes.length;
                for (var i = 0; i < c; i++) {
                    var child = this.domElement.childNodes[i];
                    if (child.tagName === 'SCRIPT' && (child).type === 'text/fbml') {
                        fbml = child.innerHTML;
                        break;
                    }
                }
            }
            return fbml;
        },
        _writeDoc$1: function (iframeDoc) {
            var fbml = this._getFBML$1();
            var postParams = {
                app_key: FB.Facebook.apiClient.get_apiKey(),
                channel_url: FB.XdComm.Server.singleton.get_receiverUrl(),
                fbml: fbml
            };
            var builder = new FB.StringBuilder();
            builder.append('\n<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">\n<html xmlns=\"http://www.w3.org/1999/xhtml\" >\n<head><title></title></head>\n<body>\n    <form method=\"post\" action=\"' + FBIntern.Utility.getFacebookUrl('www') + 'render_fbml.php\" id=\"form1\" name=\"form1\" >');
            var $dict1 = postParams;
            for (var $key2 in $dict1) {
                var entry = {
                    key: $key2,
                    value: $dict1[$key2]
                };
                builder.append(FB.Sys.format('<input type=\"hidden\" name=\"{0}\" id=\"{1}\" value=\"{2}\"  />', entry.key, entry.key, FB.Sys.htmlEncode(entry.value)));
            }
            builder.append('\n</form>\n    <script type=\"text/javascript\">\n      window.setTimeout(function(){document.forms[\'form1\'].submit();}, 0);\n    </script>\n</body>\n</html>\n        ');
            var html = builder.toString();
            iframeDoc.write(html);
            iframeDoc.close();
            this.set_isReady(true);
        },
        _iframeContainer$1: null
    }
});
FB.XFBML.PromptPermission = FB.Type.createClass({
    base: FB.XFBML.Element,
    ctor: function (domElement) {
        FB.XFBML.PromptPermission.constructBase(this, [domElement]);
    },
    instance: {
        onProcess: function () {
            var user = FB.Connect.get_loggedInUser();
            if (user) {
                this._permission$1 = this.getAttribute('perms', null);
                if (!this._permission$1) {
                    FB.FBDebug.logLine(1, 'No perms attribute was provided.');
                    return;
                }
                var table = FB.XFBML.Context.singleton.getFqlTable('permissions', 'uid');
                this._data$1 = table.selectByKey([this._permission$1], user);
                this.addDataToWait(this._data$1);
            }
        },
        onDataReady: function () {
            var permissions = null;
            if (this._data$1) {
                permissions = this._data$1.result;
            }
            var nextFbjs = this.getAttribute('next_fbjs', null);
            var callbackArg = 'null';
            if (nextFbjs) {
                callbackArg = 'function(result) { ' + '  if (result) { ' + nextFbjs + ' } ' + '}';
            }
            if ((permissions) && !(permissions[this._permission$1])) {
                this.domElement.innerHTML = '<a href=\"#\" onclick=\"FB.Connect.showPermissionDialog(\'' + this._permission$1 + '\', ' + callbackArg + '); return false;\">' + this.domElement.innerHTML + '</a>';
            }
            else {
                this.domElement.innerHTML = '';
            }
            this.set_isReady(true);
        },
        _data$1: null,
        _permission$1: null
    }
});
FB.XFBML.Comments = FB.Type.createClass({
    base: FB.XFBML.Element,
    ctor: function (domElement) {
        FB.XFBML.Comments.constructBase(this, [domElement]);
    },
    static_ctor: function () {
        FB.XFBML.Comments._iframeIdCount$1 = 0;
    },
    instance: {
        refresh: function () {},
        onDataReady: function () {
            FB.IFrameUtil.ResizeUtilServer.run();
            this._createCommentIframe$1();
        },
        _createCommentIframe$1: function () {
            if (this._iframeContainer$1) {
                return;
            }
            this._iframeName$1 = 'fbcommentsIFrame_' + FB.XFBML.Comments._iframeIdCount$1.toString();
            FB.XFBML.Comments._iframeIdCount$1++;
            var xid = this.getAttribute('xid', null);
            var width = this.getAttribute('width', '550');
            var url = this.getAttribute('url', document.URL);
            var title = this.getAttribute('title', document.title);
            var numposts = this.getAttribute('numposts', '10');
            var css = this.getAttribute('css', '');
            var simple = this.getAttribute('simple', '');
            var reverse = this.getAttribute('reverse', '');
            var quiet = this.getAttribute('quiet', '');
            width = width.replace('px', '');
            if (!xid) {
                var index = document.URL.indexOf('#');
                if (index > 0) {
                    xid = encodeURIComponent(document.URL.substring(0, index));
                }
                else {
                    xid = encodeURIComponent(document.URL);
                }
            }
            var q_params = {
                api_key: FB.Facebook.apiKey,
                channel_url: FB.XdComm.Server.singleton.get_receiverUrl(),
                xid: xid,
                width: width,
                url: url,
                title: title,
                numposts: numposts,
                css: css,
                simple: simple,
                reverse: reverse,
                quiet: quiet
            };
            var srcUrl = FBIntern.Utility.createFacebookUrl('www', 'comments.php', q_params, false);
            this._iframeContainer$1 = FB.XdComm.Server.singleton.createNamedHiddenIFrame(this._iframeName$1, srcUrl, '', 'frameborder=\"0\" allowtransparency=\"true\"');
            this._iframeContainer$1.style.width = width + 'px';
            this._iframeContainer$1.style.display = 'none';
            this._iframeContainer$1.style.border = 'none';
            FB.Bootstrap.requireFeatures(['Comments'], FB.Delegate.create(this, function () {
                FB.CommentClient.run();;
                var loaderGIF = document.createElement('div');
                FB.UI.UIElement.addCssClass(loaderGIF, 'fb_content_loader_gif');
                this._loader$1 = document.createElement('div');
                FB.UI.UIElement.addCssClass(this._loader$1, 'fb_content_loader');
                FB.UI.UIElement.addCssClass(this._loader$1, 'fb_content_loading');
                this._loader$1.style.width = width + 'px';
                this._loader$1.appendChild(loaderGIF);
                this.domElement.appendChild(this._loader$1);
                this.domElement.appendChild(this._iframeContainer$1);
                FBIntern.Utility.waitForLoaded(this._iframeContainer$1, FB.Delegate.create(this, function () {
                    FB.UI.UIElement.removeCssClass(this._loader$1, 'fb_content_loading');
                }));
                this.set_isReady(true);
            }));
        },
        _loader$1: null,
        _iframeContainer$1: null,
        _iframeName$1: null
    }
});
FB.XFBML.LiveStream = FB.Type.createClass({
    base: FB.XFBML.Element,
    ctor: function (domElement) {
        FB.XFBML.LiveStream.constructBase(this, [domElement]);
        this._createLiveStreamIframe$1();
    },
    static_ctor: function () {
        FB.XFBML.LiveStream._iframeIdCount$1 = 0;
    },
    instance: {
        refresh: function () {},
        onDataReady: function () {
            FB.IFrameUtil.ResizeUtilServer.run();
        },
        _createLiveStreamIframe$1: function () {
            if (this._iframeContainer$1) {
                return;
            }
            this._iframeName$1 = 'fblivestreamIFrame_' + FB.XFBML.LiveStream._iframeIdCount$1.toString();
            FB.XFBML.LiveStream._iframeIdCount$1++;
            var xid = this.getAttribute('xid', 'default');
            var width = this.getAttribute('width', '400');
            var height = this.getAttribute('height', '500');
            width = width.replace('px', '');
            height = height.replace('px', '');
            var redesigned = this.getAttribute('redesigned_stream', 'false');
            var hideFriendsTab = this.getAttribute('hide_friends_tab', '0');
            var q_params = {
                api_key: FB.Facebook.apiKey,
                xid: xid,
                width: width,
                height: height,
                hide_friends_tab: hideFriendsTab
            };
            var path;
            if (redesigned === 'true') {
                path = 'widgets/live_feed.php';
            }
            else {
                path = 'widgets/livefeed.php';
            }
            var srcUrl = FBIntern.Utility.createFacebookUrl('www', path, q_params, false);
            this._iframeContainer$1 = FB.XdComm.Server.singleton.createNamedHiddenIFrame(this._iframeName$1, srcUrl, '', 'width=\"' + width + '\" height=\"' + height + '\" ' + 'frameborder=\"0\" allowtransparency=\"true\"');
            this._iframeContainer$1.style.width = width + 'px';
            this._iframeContainer$1.style.height = height + 'px';
            this._iframeContainer$1.style.display = 'none';
            this._iframeContainer$1.style.border = 'none';
            var loaderGIF = document.createElement('div');
            FB.UI.UIElement.addCssClass(loaderGIF, 'fb_content_loader_gif');
            this._loader$1 = document.createElement('div');
            FB.UI.UIElement.addCssClass(this._loader$1, 'fb_content_loader');
            FB.UI.UIElement.addCssClass(this._loader$1, 'fb_content_loading');
            this._loader$1.style.width = width + 'px';
            this._loader$1.appendChild(loaderGIF);
            this.domElement.appendChild(this._loader$1);
            this.domElement.appendChild(this._iframeContainer$1);
            FBIntern.Utility.waitForLoaded(this._iframeContainer$1, FB.Delegate.create(this, function () {
                this._iframeContainer$1.style.display = 'block';
                FB.UI.UIElement.removeCssClass(this._loader$1, 'fb_content_loading');
            }));
            this.set_isReady(true);
        },
        _loader$1: null,
        _iframeContainer$1: null,
        _iframeName$1: null
    }
});
FB.XFBML.Fan = FB.Type.createClass({
    base: FB.XFBML.Element,
    ctor: function (domElement) {
        FB.XFBML.Fan.constructBase(this, [domElement]);
        this._createFanIframe$1();
    },
    static_ctor: function () {
        FB.XFBML.Fan._iframeIdCount$1 = 0;
    },
    instance: {
        onDataReady: function () {
            FB.IFrameUtil.ResizeUtilServer.run();
        },
        clearVisual: function () {
            if (this._iframeContainer$1) {
                this._iframeContainer$1.parentNode.removeChild(this._iframeContainer$1);
                this._iframeContainer$1 = null;
            }
            if (this._loader$1) {
                this._loader$1.parentNode.removeChild(this._loader$1);
                this._loader$1 = null;
            }
        },
        _createFanIframe$1: function () {
            if (this._iframeContainer$1 || this._loader$1) {
                this.clearVisual();
            }
            this._iframeName$1 = 'fbfanIFrame_' + FB.XFBML.Fan._iframeIdCount$1.toString();
            FB.XFBML.Fan._iframeIdCount$1++;
            var id = this.getAttribute('profile_id', '');
            var name = this.getAttribute('name', '');
            var width = this.getAttribute('width', '300');
            var connections = this.getAttribute('connections', '');
            var stream = this.getAttribute('stream', '');
            var height = this.getAttribute('height', '');
            var css = this.getAttribute('css', '');
            if (height === '') {
                if ((connections === '' || connections === '0') && (stream === '' || stream === '0')) {
                    height = '65';
                }
                else if (connections === '' || connections === '0') {
                    height = '375';
                }
                else if (stream === '' || stream === '0') {
                    height = '250';
                }
                else {
                    height = '550';
                }
            }
            width = width.replace('px', '');
            height = height.replace('px', '');
            var q_params = {
                api_key: FB.Facebook.apiKey,
                channel_url: FB.XdComm.Server.singleton.get_receiverUrl(),
                id: id,
                name: name,
                width: width,
                connections: connections,
                stream: stream,
                css: css
            };
            var widgetUrl = FBIntern.Utility.getFacebookUrl('www') + 'connect/connect.php';
            var srcUrl = FBIntern.Uri.addQueryParameters(widgetUrl, FBIntern.Uri.createQueryString(q_params));
            this._iframeContainer$1 = FB.XdComm.Server.singleton.createNamedHiddenIFrame(this._iframeName$1, srcUrl, '', 'frameborder=\"0\" allowtransparency=\"true\"');
            this._iframeContainer$1.style.width = width + 'px';
            this._iframeContainer$1.style.height = height + 'px';
            this._iframeContainer$1.style.border = 'none';
            this._iframeContainer$1.style.display = 'none';
            var loaderGIF = document.createElement('div');
            FB.UI.UIElement.addCssClass(loaderGIF, 'fb_content_loader_gif');
            this._loader$1 = document.createElement('div');
            FB.UI.UIElement.addCssClass(this._loader$1, 'fb_content_loader');
            FB.UI.UIElement.addCssClass(this._loader$1, 'fb_content_loading');
            this._loader$1.style.width = width + 'px';
            this._loader$1.style.height = height + 'px';
            this._loader$1.appendChild(loaderGIF);
            this.domElement.appendChild(this._iframeContainer$1);
            this.domElement.appendChild(this._loader$1);
            FBIntern.Utility.waitForLoaded(this._iframeContainer$1, FB.Delegate.create(this, function () {
                this._loader$1.parentNode.removeChild(this._loader$1);
                this._loader$1 = null;
                this._iframeContainer$1.style.display = '';
                this.set_isReady(true);
            }));
        },
        _loader$1: null,
        _iframeContainer$1: null,
        _iframeName$1: null
    }
});
FB.XFBML.Pay = FB.Type.createClass({
    base: FB.XFBML.Element,
    ctor: function (domElement) {
        FB.XFBML.Pay.constructBase(this, [domElement]);
    },
    instance: {
        onDataReady: function () {
            var button = this.getAttribute('button', 'large');
            var nextJs = this.getAttribute('next_js', null);
            var orderInfo = this.getAttribute('order_info', null);
            var nextUrl = this.getAttribute('next_url', null);
            var receiver = this.getAttribute('receiver', 0);
            var html = '';
            if (orderInfo) {
                var error = false;
                var onClick = 'var fbpay = new FB.Payments(); fbpay.setParam(\'order_info\', \'' + orderInfo + '\');';
                if (nextJs) {
                    onClick += 'fbpay.setParam(\'next_js\', ' + nextJs + ');';
                }
                if (nextUrl) {
                    onClick += 'fbpay.setParam(\'next_url\', \'' + nextUrl + '\');';
                }
                if (receiver) {
                    onClick += 'fbpay.setParam(\'receiver\', ' + receiver + ');';
                }
                var buttonUrl = null;
                switch (button) {
                case 'large':
                    buttonUrl = '/images/fbpayments/pay_white_large_long.gif';
                    break;
                case 'small':
                    buttonUrl = '/images/fbpayments/pay_white_large_short.gif';
                    break;
                default:
                    error = true;
                    break;
                }
                if (!error) {
                    onClick += 'fbpay.submitOrder(); return false;';
                    html = '<a onclick=\"' + onClick + '\">' + '<img src=\"' + buttonUrl + '\" />' + '</a>';
                }
            }
            FBIntern.Utility.paymentsLog('render_tag', FB.Facebook.apiKey);
            this.domElement.innerHTML = html;
            this.set_isReady(true);
        }
    }
});
FB.XFBML.Host = FB.Type.createClass({
    ctor: function () {},
    static_ctor: function () {
        FB.XFBML.Host.autoParseDomTree = true;
        FB.XFBML.Host._fbmlElements = [];
        FB.XFBML.Host._registeredElements = null;
        FB.XFBML.Host._areElementsReady = new FB.SimpleWaitable();
        FB.XFBML.Host._readyElementsCount = 0;
        FB.UI.DomResources.addResourceDict(new FB.UI.DomResDict('<a id=\"RES_ID_fb_login\" class=\"fbconnect_login_button\"><img id=\"fb_login_image\"  /></a>'));
        var list = [FB.XFBML.$create_ElementsRegistration('fb', 'login-button', FB.XFBML.LoginButton), FB.XFBML.$create_ElementsRegistration('fb', 'name', FB.XFBML.Name), FB.XFBML.$create_ElementsRegistration('fb', 'pronoun', FB.XFBML.Pronoun), FB.XFBML.$create_ElementsRegistration('fb', 'serverFbml', FB.XFBML.ServerFbml), FB.XFBML.$create_ElementsRegistration('fb', 'eventLink', FB.XFBML.EventLink), FB.XFBML.$create_ElementsRegistration('fb', 'groupLink', FB.XFBML.GroupLink), FB.XFBML.$create_ElementsRegistration('fb', 'photo', FB.XFBML.Photo), FB.XFBML.$create_ElementsRegistration('fb', 'video', FB.XFBML.Video), FB.XFBML.$create_ElementsRegistration('fb', 'unconnected-friends-count', FB.XFBML.UnconnectedFriendsCount), FB.XFBML.$create_ElementsRegistration('fb', 'container', FB.XFBML.ContainerElement), FB.XFBML.$create_ElementsRegistration('fb', 'user-status', FB.XFBML.UserStatus), FB.XFBML.$create_ElementsRegistration('fb', 'userLink', FB.XFBML.UserLink), FB.XFBML.$create_ElementsRegistration('fb', 'profile-pic', FB.XFBML.ProfilePic), FB.XFBML.$create_ElementsRegistration('fb', 'prompt-permission', FB.XFBML.PromptPermission), FB.XFBML.$create_ElementsRegistration('fb', 'share-button', FB.XFBML.ShareButton), FB.XFBML.$create_ElementsRegistration('fb', 'add-section-button', FB.XFBML.AddSectionButton), FB.XFBML.$create_ElementsRegistration('fb', 'comments', FB.XFBML.Comments), FB.XFBML.$create_ElementsRegistration('fb', 'live-stream', FB.XFBML.LiveStream), FB.XFBML.$create_ElementsRegistration('fb', 'pay', FB.XFBML.Pay), FB.XFBML.$create_ElementsRegistration('fb', 'fan', FB.XFBML.Fan)];
        FB.XFBML.Host._registeredElements = (list);
    },
    static: {
        registerCustomTag: function (nameSpace, name, implementationType) {
            FB.Sys.add(FB.XFBML.Host._registeredElements, FB.XFBML.$create_ElementsRegistration(nameSpace, name, implementationType));
        },
        _pruneFbmlElements: function () {
            var newFbmlElements = [];
            var count = FB.XFBML.Host._fbmlElements.length;
            for (var i = 0; i < count; i++) {
                var element = FB.XFBML.Host._fbmlElements[i];
                if (element.isValid()) {
                    FB.Sys.add(newFbmlElements, element);
                }
            }
            FB.XFBML.Host._fbmlElements = newFbmlElements;
        },
        parseDomTree: function () {
            FB.XFBML.Host.parseDomElement(document.body);
        },
        parseDomElement: function (domElement) {
            FB.XFBML.Data.CacheManager.get__initialized().waitUntilReady(function (isCacheReady) {
                FB.XFBML.Host._pruneFbmlElements();
                var subsetElements = [];
                var $enum1 = new FB.ArrayEnumerator(FB.XFBML.Host._registeredElements);
                while ($enum1.moveNext()) {
                    var entry = $enum1.get_current();
                    var names = FB.XFBML.ConnectUtility.getElementsByTagNameNS(domElement, entry.nameSpace, entry.name);
                    for (var i = 0; i < names.length; i++) {
                        var element = FB.XFBML.Element.fromDomElement(names[i]);
                        if (!element) {
                            element = new entry.implementationType(names[i]);
                            FB.XFBML.Host._addElementToList(element);
                        }
                        FB.Sys.add(subsetElements, element);
                    }
                }
                FB.XFBML.Host._readyElementsCount = 0;
                FB.XFBML.Host._areElementsReady.setResult(false, true);
                FB.Connect.get_status().waitUntilReady(function (r) {
                    var count = subsetElements.length;
                    for (var i = 0; i < count; i++) {
                        var element = subsetElements[i];
                        element.process();
                    }
                });
            });
        },
        refresh: function () {
            FB.XFBML.Host._pruneFbmlElements();
            var count = FB.XFBML.Host._fbmlElements.length;
            if (count > 0) {
                FB.FBDebug.logLine(2, 'Host.Refresh: refresh all existing XFBML elements');
                FB.XFBML.Host._readyElementsCount = 0;
                FB.XFBML.Host._areElementsReady.setResult(false, true);
                for (var i = 0; i < count; i++) {
                    var element = FB.XFBML.Host._fbmlElements[i];
                    element.refresh();
                }
            }
        },
        get_areElementsReady: function () {
            return FB.XFBML.Host._areElementsReady;
        },
        addElement: function (element) {
            FB.Connect.get_status().waitUntilReady(function (r) {
                FB.XFBML.Data.CacheManager.get__initialized().waitUntilReady(function (isCacheReady) {
                    FB.XFBML.Host._addElementToList(element);
                    element.process();
                });
            });
        },
        addElements: function (elements) {
            var $enum1 = new FB.ArrayEnumerator(elements);
            while ($enum1.moveNext()) {
                var element = $enum1.get_current();
                FB.XFBML.Host.addElement(element);
            }
        },
        _addElementToList: function (element) {
            FB.Sys.add(FB.XFBML.Host._fbmlElements, element);
            if (element.get_isReady()) {
                FB.XFBML.Host._readyElementsCount++;
                FB.XFBML.Host._checkReadyState();
            }
            else {
                element.add_isReadyChanged(FB.XFBML.Host._elementIsReadyChanged);
            }
        },
        _elementIsReadyChanged: function (sender, e) {
            (sender).remove_isReadyChanged(FB.XFBML.Host._elementIsReadyChanged);
            FB.XFBML.Host._readyElementsCount++;
            FB.XFBML.Host._checkReadyState();
        },
        _checkReadyState: function () {
            var isReady = FB.XFBML.Host._readyElementsCount === FB.XFBML.Host._fbmlElements.length;
            if (isReady && !FB.XFBML.Host._areElementsReady.get_isReady()) {
                FB.XFBML.Host._areElementsReady.setResult(true);
            }
        }
    }
});
FB.XFBML.ConnectUtility = FB.Type.createClass({
    ctor: function () {},
    static: {
        upperCaseFirstChar: function (s) {
            if (s.length > 0) {
                return s.substr(0, 1).toUpperCase() + s.substr(1);
            }
            else {
                return s;
            }
        },
        getElementsByTagNameNS: function (element, xmlns, localName) {
            var result = null;
            switch (FBIntern.AppInfo.get_singleton().get_hostInfo().get_hostName()) {
            case FBIntern.HostName.MOZILLA:
                localName = xmlns + ':' + localName;
                result = element.getElementsByTagNameNS(null, localName);
                break;
            case FBIntern.HostName.SAFARI:
                localName = xmlns + ':' + localName;
                result = element.getElementsByTagName(localName);
                break;
            case FBIntern.HostName.IE:
                var docNamespaces = document.namespaces;
                if (docNamespaces && FB.Sys.containsKey(docNamespaces, xmlns)) {
                    result = element.getElementsByTagName(localName);
                }
                else {
                    localName = xmlns + ':' + localName;
                    result = element.getElementsByTagName(localName);
                    if (result && result.length > 0) {
                        var message = 'You appear to be using the XFBML tag ' + localName + ' in your HTML markup. However, you are missing corresponding xmlns attribute in your <HTML> tag. That xmlns attribute is required in Internet Explorer. For example, to use XFBML tags with the \'fb\' namespace such as <fb:login-button></fb:login-button>, you must place xmlns:fb=\"http://www.facebook.com/2008/fbml\" in the <HTML> tag';
                        FB.FBDebug.logLine(0, message);
                        throw new Error(message);
                    }
                }
                break;
            default:
                result = element.getElementsByTagName(localName);
                break;
            }
            return result;
        },
        normalizeInt64ForId: function (id) {
            if (id) {
                var scriptType = typeof(id);
                if (scriptType === 'string' && (id).length < 10) {
                    id = parseInt(id);
                }
            }
            return id;
        },
        getNetworkInParentheses: function (userInfo) {
            var networkName = FBIntern.DataHelper.getPrimaryNetwork(userInfo);
            if (!networkName) {
                networkName = FB.XFBML.Context.singleton.resources.getResourceString('no_network');
            }
            return '(' + networkName + ')';
        },
        isNameAvailable: function (userInfo) {
            return userInfo && !(FB.Sys.isNullOrEmpty(userInfo.first_name) && FB.Sys.isNullOrEmpty(userInfo.last_name) && FB.Sys.isNullOrEmpty(userInfo.name));
        },
        _profileLink: function (userInfo, html, href) {
            if (!FBIntern.Utility.getSiteVar('enable_custom_href')) {
                href = null;
            }
            if (!href && FB.XFBML.ConnectUtility.isNameAvailable(userInfo)) {
                href = FBIntern.Utility.getNonConnectFacebookUrl('www') + 'profile.php?id=' + userInfo.uid;
            }
            if (href) {
                html = FB.Sys.format(FB.XFBML.Context.singleton.resources.getResourceString('link'), href, html);
            }
            return html;
        }
    }
});
FB.Type.createNamespace('FB.XFBML.Resources');
FB.XFBML.Resources.ResourceDict = FB.Type.createClass({
    ctor: function () {
        this._stringResources = {
            link: '<a class=\'FB_Link\' href=\'{0}\'>{1}</a>',
            no_network: 'no network'
        };
    },
    instance: {
        getResourceString: function (key) {
            return this._stringResources[key];
        },
        _stringResources: null
    }
});
FB.FeatureLoader.onScriptLoaded(['XFBML']);

if (window.Bootloader) {
    Bootloader.done(["js\/connect.js.pkg.php"]);
}