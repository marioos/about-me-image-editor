/**
 * jZU Javascript framework
 * 
 * (c) 2012 -2013 Class.PM www.class.pm
 * visit www.class.pm/projects/jzu for more info
 * @license GPL
 * @author Marius Stanciu - Sergiu <marius@picozu.net>
 * @version 1.1.0
 * 
 */

(function() {
    window.jZU = function(selector, context) {
        return new jZU.core().select(selector, context);
    };
    window.$ = jZU;
    jZU.namespace = function(ns) {
        if (!ns) {
            return;
        }
        var n = ns.split('.'), target = window, o;
        for (var i = 0, ni; ni = n[i]; i++) {
            target = (o = target[ni]) ? o : target[ni] = {};
        }
        return target;
    };
    jZU.extend = function() {
        var target = this, t = target, source, p, o, a0 = arguments[0], ai = 0, al = arguments.length;
        if (al > 1) {
            ai++;
            target = t = a0;
        }
        for (; source = arguments[ai]; ai++)
            for (var prop in source) {
                p = source[prop];
                if (prop.charAt(0) != '@') {
                    if (p && p.splice) {
                        var tp = t[prop];
                        t[prop] = tp && tp.splice ? tp.concat(p) : new Array().concat(p);
                    }
                    else if (p && typeof p == 'object') {
                        t[prop] = jZU.extend(t[prop] || {}, p);
                    }
                    else {
                        t[prop] = p;
                    }
                }
                else {
                    if (prop == '@init') {
                        p.call(t);
                    }
                    else if (prop == '@require') {
                        for (var ext in p) {
                            var v = p[ext];
                            o = t.extensions[ext] || null;
                            if (!o) {
                                throw 'The extension "' + ext + '" needs to be installed.';
                            }
                            else if (o < v && v != 'all') {
                                throw 'The extension "' + ext + '" requires version ' + v + ' or better.';
                            }
                        }
                    }
                    else if (prop == '@extension') {
                        o = t.extensions || (t.extensions = {});
                        for (var name in p) {
                            o[name] = p[name];
                        }
                    }
                }
            }
        return target;
    };
    jZU.extend({
        '@extension': {
            'core': '1.0.0'
        },
        id: function(id) {
            return document.getElementById(id);
        },
        each: function(a, fn) {
            for (var i = 0, ai; ai = a[i]; i++) {
                fn.call(ai, i, ai);
            }
        },
        noConflict: function(deep) {
            if (window.$ === jZU) {
                window.$ = jZU._$;
            }
            return this;
        },
        ready: function(fn) {
            if (document.addEventListener) {
                document.addEventListener("DOMContentLoaded", fn, false);
            }
            else if (document.attachEvent) {
                document.attachEvent("onreadystatechange", fn);
            }
        },
        trim: function(s) {
            return s.replace(/^\s*|\s*$/g, '');
        },
        emptyFn: function() {
        },
        _jZU: window.jZU,
        _$: window.$
    });
    jZU.core = function() {
    };
    jZU.core.prototype = new Array();
    jZU.set = jZU.core.prototype;
    var set = jZU.set;
    set.extend = jZU.extend;
    set.extend({
        '@extension': {
            'core': '1.0.0'
        },
        _lastSet: null,
        jZU: 'jZU.1.0.0',
        _chain: function(e) {
            var r = new jZU().copy(e);
            r._lastSet = this;
            return r;
        },
        select: function(selector, context) {
            var type = typeof selector;
            if (type == 'string') {
                return this.copy(query.select(selector, context));
            }
            else if (type == 'object') {
                if (selector.nodeName) {
                    this.push(selector);
                }
                else if (selector.length) {
                    return this.copy(selector);
                }
            }
            return this;
        },
        add: function(selector, context) {
            return this._chain(this).select(selector, context);
        },
        find: function(selector) {
            return this._chain().select(selector, this);
        },
        filter: function(selector) {
            return this._chain().copy(query.filter(this, selector));
        },
        not: function(selector) {
            return this._chain().copy(query.filter(this, selector, true));
        },
        next: function(selector) {
            for (var i = 0, l = this.length; i < l; i++)
                while ((this[i] = this[i].nextSibling) && this[i].nodeType != 1)
                    ;
            return selector ? this.filter(selector) : this;
        },
        prev: function(selector) {
            for (var i = 0, l = this.length; i < l; i++)
                while ((this[i] = this[i].previousSibling) && this[i].nodeType != 1)
                    ;
            return selector ? this.filter(selector) : this;
        },
        end: function() {
            return this._lastSet || new jZU.core();
        },
        each: function(fn) {
            for (var i = 0, ei; ei = this[i]; i++) {
                fn.call(ei, i);
            }
            return this;
        },
        copy: function(a) {
            if (a) {
                if (a.splice) {
                    this.push.apply(this, a);
                }
                else {
                    for (var i = 0, ai; ai = a[i]; i++) {
                        this.push(ai);
                    }
                }
            }
            return this;
        }
    });
    jZU.namespace('jZU.element');
    var element = jZU.element;
    jZU.extend(element, {
        '@extension': {
            'dom': '1.0.0'
        },
        attr: function(e, key, val) {
            return e ? val ? e[key] = val : e[key] : undefined;
        },
        val: function(e, val) {
            if (e) {
                if (val) {
                    var valType = typeof val;
                    if (valType == 'string') {
                        e.value = val;
                    }
                    else if (valType == 'object') {
                        var vl = val.length, tag, type;
                        if ((tag = e.nodeName.toLowerCase()) == 'input' && ((type = e.type) == 'checkbox' || type == 'radio')) {
                            e.checked = false;
                            for (var j = 0; j < vl; j++) {
                                if (e.value == val[j]) {
                                    e.checked = true;
                                }
                            }
                        }
                        else if (tag == 'select') {
                            for (var o = 0, op, op = e.options, ol = o.length; o < ol; o++) {
                                if (e.multiple) {
                                    op[o].selected = false;
                                }
                                for (var j = 0; j < vl; j++) {
                                    if (op[o].value == val[j]) {
                                        op[o].selected = true;
                                    }
                                }
                            }
                        }
                    }
                }
                else {
                    if (e.nodeName.toLowerCase() != 'select') {
                        return e.value;
                    }
                    else {
                        var r = new Array();
                        for (var i = 0, o = e.options, ol = o.length; i < ol; i++) {
                            if (o[i].selected) {
                                r.push(o[i].value);
                            }
                        }
                        return e.multiple ? r : r[0];
                    }
                }
            }
            else {
                return undefined;
            }
        },
        text: (function() {
            var txt = typeof document.textContent != 'undefined' ? 'textContent' : 'innerText';
            var text = function(e, val) {
                return e ? val ? e[txt] = val : e[txt] : undefined;
            };
            return text;
        })()
    });
    set.extend({
        '@extension': {
            'dom': '1.0.0'
        },
        attr: function(key, val) {
            if (val) {
                for (var i = 0, ei; ei = this[i]; i++) {
                    element.attr(ei, key, val);
                }
                return this;
            }
            else {
                return element.attr(this[0], key);
            }
        },
        val: function(val) {
            if (val) {
                for (var i = 0, ei; ei = this[i]; i++) {
                    element.val(ei, val);
                }
                return this;
            }
            else {
                return element.val(this[0]);
            }
        },
        html: function(val) {
            if (val) {
                for (var i = 0, ei; ei = this[i]; i++) {
                    ei.innerHTML = val;
                }
                return this;
            }
            else {
                return this[0] ? this[0].innerHTML : undefined;
            }
        },
        append: function(val) {
            for (var i = 0, ei; ei = this[i]; i++) {
                ei.innerHTML += val;
            }
            return this;
        },
        prepend: function(val) {
            for (var i = 0, ei; ei = this[i]; i++) {
                ei.innerHTML = val + ei.innerHTML;
            }
            return this;
        },
        text: function(val) {
            if (val) {
                for (var i = 0, ei; ei = this[i]; i++) {
                    element.text(ei, val);
                }
                return this;
            }
            else {
                return element.text(this[0]);
            }
        }
    });
    jZU.extend(element, {
        '@extension': {
            'css': '1.0.0'
        },
        hasClass: function(e, name) {
            return (' ' + e.className + ' ').indexOf(' ' + name + ' ') != -1;
        },
        addClass: function(e, name) {
            if ((' ' + e.className + ' ').indexOf(' ' + name + ' ') == -1) {
                e.className = e.className ? e.className + ' ' + name : name;
            }
        },
        removeClass: function(e, name) {
            e.className = (' ' + e.className + ' ').replace(new RegExp('(\\S*)\\s+' + name + '\\s+(\\S*)', 'g'), '$1 $2').replace(/^\s*|\s*$/g, '');
        },
        toggleClass: function(e, name) {
            if ((' ' + e.className + ' ').indexOf(' ' + name + ' ') >= 0) {
                this.removeClass(e, name)
            }
            else {
                this.addClass(e, name);
            }
        },
        css: function(e, name, val) {
            if (e) {
                if (val) {
                    e.style[name] = val;
                }
                else {
                    var type = typeof name;
                    if (type == 'object') {
                        for (p in name) {
                            e.style[p] = name[p]
                        }
                    }
                    else {
                        return window.getComputedStyle ? document.defaultView.getComputedStyle(e, null)[name] || e.style[name] : e.currentStyle ? e.currentStyle[name] || e.style[name] : undefined;
                    }
                }
            }
            else {
                return undefined;
            }
        }
    });
    set.extend({
        '@extension': {
            'css': '1.0.0'
        },
        hasClass: function(name) {
            return this[0] ? (' ' + this[0].className + ' ').indexOf(' ' + name + ' ') != -1 : undefined;
        },
        addClass: function(name) {
            for (var i = 0, ei; ei = this[i]; i++) {
                element.addClass(ei, name);
            }
            return this;
        },
        removeClass: function(name) {
            for (var i = 0, ei; ei = this[i]; i++) {
                element.removeClass(ei, name);
            }
            return this;
        },
        toggleClass: function(name) {
            for (var i = 0, ei; ei = this[i]; i++) {
                element.toggleClass(ei, name);
            }
            return this;
        },
        css: function(name, val) {
            if (val) {
                for (var i = 0, ei; ei = this[i]; i++) {
                    element.css(ei, name, val);
                }
                return this;
            }
            else {
                return element.css(this[0], name);
            }
        }
    });
    jZU.event = function() {
        var _events = new Array();
        var addEventListener = typeof document.addEventListener != 'undefined';
        var attachEvent = typeof document.attachEvent != 'undefined';
        return {
            version: 'jZU.event.1.0.0',
            add: function(e, type, fn) {
                _events.push({
                    e: e,
                    type: type,
                    fn: fn
                });
                if (addEventListener) {
                    e.addEventListener(type, fn, false)
                }
                else if (attachEvent) {
                    e['e' + type + fn] = fn;
                    e[type + fn] = function() {
                        e['e' + type + fn](window.event);
                    }
                    e.attachEvent('on' + type, e[type + fn]);
                }
            },
            remove: function(e, type, fn) {
                var l, fs = fn.toString();
                for (var i = 0, li; li = _events[i]; i++)
                    if (li.e == e && li.type == type && (li.fn == fn || li.fn.toString() == fs)) {
                        l = _events.splice(i, 1)[0];
                        break;
                    }
                if (l) {
                    fn = l.fn;
                    if (addEventListener) {
                        e.removeEventListener(type, fn, false)
                    }
                    else if (attachEvent) {
                        e.detachEvent('on' + type, e[type + fn]);
                        e[type + fn] = null;
                        e['e' + type + fn] = null;
                    }
                }
            },
            removeAll: function() {
                for (var i = 0; li = _events[i]; i++) {
                    this.remove(li.e, li.type, li.fn);
                }
            }
        }
    }();
    set.extend({
        '@extension': {
            'event': '1.0.0'
        },
        on: function(type, fn) {
            return this.each(function() {
                jZU.event.add(this, type, fn);
            });
        },
        off: function(type, fn) {
            return this.each(function() {
                jZU.event.remove(this, type, fn);
            });
        }
    });
    jZU.ajax = function(options) {
        return this.ajax.request(options);
    };
    var ajax = jZU.ajax;
    jZU.extend(ajax, function() {
        var _requests = new Array(), _transport = null, _callback = null, _states = ['Uninitialized', 'Loading', 'Loaded', 'Interactive', 'Complete'];
        var _sendRequest = function() {
            var t = _transport, r = _requests.shift(), data;
            t.open(r.type, r.url, r.async);
            t.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            if (data = jZU.serialize(r.data)) {
                t.setRequestHeader('Content-Type', r.contentType);
            }
            t.onreadystatechange = function() {
                _onStateChange(r);
            };
            t.send(data);
        };
        var _onStateChange = function(options) {
            var fn, o = options, t = _transport, state = _getState(t);
            if (fn = o['on' + state]) {
                fn(_getResponse(o), o);
            }
            if (state == 'Complete') {
                var success = t.status == 200, response = _getResponse(o);
                if (fn = o['onUpdate']) {
                    fn(response, o);
                }
                if (fn = o['on' + (success ? 'Success' : 'Error')]) {
                    fn(response, o);
                }
                t.onreadystatechange = jZU.emptyFn;
                if (_requests.length > 0) {
                    setTimeout(_sendRequest, 10);
                }
            }
        };
        var _getResponse = function(options) {
            var t = _transport, type = options.dataType;
            if (t.status != 200) {
                return t.statusText;
            }
            else if (type == 'text') {
                return t.responseText;
            }
            else if (type == 'html') {
                return t.responseText;
            }
            else if (type == 'xml') {
                return t.responseXML;
            }
            else if (type == 'json') {
                return eval('(' + t.responseText + ')');
            }
        };
        var _getState = function() {
            return _states[_transport.readyState];
        };
        return {
            '@extension': {
                'ajax': '1.0.0'
            },
            '@init': function() {
                _transport = null;
                try {
                    _transport = new XMLHttpRequest();
                }
                catch (e) {
                    try {
                        _transport = new ActiveXObject("Msxml2.XMLHTTP");
                    }
                    catch (e) {
                        try {
                            _transport = new ActiveXObject("Microsoft.XMLHTTP");
                        }
                        catch (e) {
                        }
                    }
                }
            },
            request: function(options) {
                var o = options || {};
                o.type = o.type && o.type.toLowerCase() || 'get';
                o.async = o.async || true;
                o.dataType = o.dataType || 'text';
                o.contentType = o.contentType || 'application/x-www-form-urlencoded';
                _requests.push(o);
                var s = _getState();
                if (s == 'Uninitialized' || s == 'Complete') {
                    _sendRequest();
                }
            }
        }
    }());
    set.extend({
        '@require': {
            'dom': '1.0.0'
        },
        '@extension': {
            'ajax': '1.0.0'
        },
        load: function(url, data, callback) {
            var d = data || null, fn = callback || null;
            if ((typeof data == 'function') && (typeof callback == 'undefined')) {
                d = null;
                fn = data;
            }
            ajax.request({
                url: url,
                data: d,
                onSuccess: fn,
                elements: this,
                onUpdate: function(r, o) {
                    $(o.elements).html(r);
                }
            });
            return this;
        }
    });
    jZU.extend({
        '@extension': {
            'ajax': '1.1.0'
        },
        serialize: function(data) {
            var r = [''], rl = 0;
            if (data) {
                if (typeof data == 'string') {
                    r[rl++] = data
                }
                else if (data.innerHTML && data.elements) {
                    for (var i = 0, el, l = (el = data.elements).length; i < l; i++)
                        if (el[i].name) {
                            r[rl++] = encodeURIComponent(el[i].name);
                            r[rl++] = '=';
                            r[rl++] = encodeURIComponent(el[i].value);
                            r[rl++] = '&';
                        }
                }
                else
                    for (var param in data) {
                        r[rl++] = encodeURIComponent(param);
                        r[rl++] = '=';
                        r[rl++] = encodeURIComponent(data[param]);
                        r[rl++] = '&';
                    }
            }
            return r.join('').replace(/&$/, "");
        },
        get: function(url, data, callback) {
            var d = data || null, fn = callback || null;
            if ((typeof data == 'function') && (typeof callback == 'undefined')) {
                d = null;
                fn = data;
            }
            ajax.request({
                url: url,
                data: d,
                onSuccess: fn
            });
        },
        getJSON: function(url, data, callback) {
            var d = data || null, fn = callback || null;
            if ((typeof data == 'function') && (typeof callback == 'undefined')) {
                d = null;
                fn = data;
            }
            ajax.request({
                url: url,
                data: d,
                dataType: 'json',
                onSuccess: fn
            });
        },
        getXML: function(url, data, callback) {
            var d = data || null, fn = callback || null;
            if ((typeof data == 'function') && (typeof callback == 'undefined')) {
                d = null;
                fn = data;
            }
            ajax.request({
                url: url,
                data: d,
                dataType: 'xml',
                onSuccess: fn
            });
        },
        post: function(url, data, callback) {
            var d = data || null, fn = callback || null;
            if ((typeof data == 'function') && (typeof callback == 'undefined')) {
                d = null;
                fn = data;
            }
            ajax.request({
                url: url,
                type: 'post',
                data: d,
                onSuccess: fn
            });
        },
        loadScript: function(url) {
            var script = document.getElementById('dynamicScript');
            if (script) {
                script.parentNode.removeChild(script);
            }
            script = document.createElement('script');
            script.setAttribute('src', url);
            script.setAttribute('id', 'dynamicScript');
            script.setAttribute('type', 'text/javascript');
            document.documentElement.firstChild.appendChild(script);
        },
        loadJSONP: function(url, jsonp, callback) {
            var j = jsonp || 'callback', fn = callback || jZU.emptyFn, script = document.getElementById('dynamicScript');
            if ((typeof jsonp == 'function') && (typeof callback == 'undefined')) {
                j = 'callback';
                fn = jsonp;
            }
            if (script) {
                script.parentNode.removeChild(script);
            }
            ajax._callback = fn;
            script = document.createElement('script');
            script.setAttribute('src', url + '&' + j + '=jZU.ajax._callback');
            script.setAttribute('id', 'dynamicScript');
            script.setAttribute('type', 'text/javascript');
            document.documentElement.firstChild.appendChild(script);
        }
    });
    jZU.query = function() {
        var cache = {}, simpleCache = {}, reTrim = /^\s+|\s+$/g, reTemplate = /\{(\d+)\}/g, reMode = /^(\s?[\/>+~]\s?|\s|$)/, reTag = /^(#)?([\w-\*]+)/, reNth = /(\d*)n\+?(\d*)/, reNth2 = /\D/, isIE = !!window.ActiveXObject, key = 30803;
        eval("var batch = 30803;");
        function _quickId(e, mode, context, val) {
            if (e == context) {
                var d = context.ownerDocument || context;
                return d.getElementById(val);
            }
            e = _getNodes(e, mode, "*");
            return _byId(e, val);
        }
        var _byId = function(e, val) {
            if (e.tagName || e == document) {
                e = [e];
            }
            var r = new Array(), rl = - 1;
            for (var i = 0, ei; ei = e[i]; i++) {
                if (ei && ei.id == val) {
                    r[++rl] = ei;
                    return r;
                }
            }
            return r;
        };
        var _byTag = function(e, val) {
            if (e.tagName || e == document) {
                e = [e];
            }
            var r = new Array(), rl = - 1;
            val = val.toLowerCase();
            for (var i = 0, ei; ei = e[i]; i++) {
                if (ei.nodeType == 1 && ei.tagName.toLowerCase() == val) {
                    r[++rl] = ei;
                }
            }
            return r;
        };
        var _byClass = function(e, val) {
            if (!val) {
                return e;
            }
            var r = new Array(), rl = - 1;
            for (var i = 0, ei; ei = e[i]; i++) {
                if ((' ' + ei.className + ' ').indexOf(val) != -1) {
                    r[++rl] = ei;
                }
            }
            return r;
        };
        var _byAttr = function(e, attr, op, val) {
            var r = new Array(), rl = -1, f = query.operators[op];
            for (var i = 0, ei, a; ei = e[i]; i++) {
                if (attr == "class" || attr == "className") {
                    a = ei.className;
                }
                else if (attr == "for") {
                    a = ei.htmlFor;
                }
                else if (attr == "href") {
                    a = ei.getAttribute("href", 2);
                }
                else {
                    a = ei.getAttribute(attr);
                }
                if ((f && f(a, val)) || (!f && a)) {
                    r[++rl] = ei;
                }
            }
            return r;
        };
        var _byPseudo = function(e, name, val) {
            return query.pseudos[name](e, val);
        };
        var _getNodes = function(e, mode, name) {
            var r = new Array(), rl = - 1;
            if (!e) {
                return r;
            }
            name = name || "*";
            if (typeof e.getElementsByTagName != "undefined") {
                e = [e];
            }
            if (!mode) {
                for (var i = 0, ei, n; ei = e[i]; i++) {
                    n = ei.getElementsByTagName(name);
                    for (var j = 0, nj; nj = n[j]; j++) {
                        r[++rl] = nj;
                    }
                }
            }
            else if (mode == "/" || mode == ">") {
                var utag = name.toUpperCase();
                for (var i = 0, ei, n; ei = e[i]; i++) {
                    n = ei.children || ei.childNodes;
                    for (var j = 0, nj; nj = n[j]; j++) {
                        if (nj.nodeName == utag || nj.nodeName == name || name == '*') {
                            r[++rl] = nj;
                        }
                    }
                }
            }
            else if (mode == "+") {
                var utag = name.toUpperCase();
                for (var i = 0, ei; ei = e[i]; i++) {
                    while ((ei = ei.nextSibling) && ei.nodeType != 1)
                        ;
                    if (ei && (ei.nodeName == utag || ei.nodeName == name || name == '*')) {
                        r[++rl] = ei;
                    }
                }
            }
            else if (mode == "~") {
                for (var i = 0, ei; ei = e[i]; i++) {
                    while ((ei = ei.nextSibling) && (ei.nodeType != 1 || (name == '*' || ei.tagName.toLowerCase() != name)))
                        ;
                    if (ei) {
                        r[++rl] = ei;
                    }
                }
            }
            return r;
        };
        var _unique = function(e) {
            if (!e) {
                return new Array();
            }
            var len = e.length, i, r = e, ei;
            if (!len || typeof e.nodeType != "undefined" || len == 1) {
                return e;
            }
            if (isIE && typeof e[0].selectSingleNode != "undefined") {
                var d = ++key;
                e[0].setAttribute("__unique", d);
                var r = [e[0]], rl = 0;
                for (var i = 1, ei; ei = e[i]; i++) {
                    if (!ei.getAttribute("__unique") != d) {
                        ei.setAttribute("__unique", d);
                        r[++rl] = ei;
                    }
                }
                for (var i = 0; ei = e[i]; i++) {
                    ei.removeAttribute("__unique");
                }
                return r;
            }
            var d = ++key;
            e[0].__unique = d;
            for (i = 1, ei; ei = e[i]; i++) {
                if (ei.__unique != d) {
                    ei.__unique = d;
                }
                else {
                    r = new Array(), rl = -1;
                    for (var j = 0; j < i; j++) {
                        r[++rl] = e[j];
                    }
                    for (j = i + 1; ej = e[j]; j++) {
                        if (ej.__unique != d) {
                            ej.__unique = d;
                            r[++rl] = ej;
                        }
                    }
                    return r;
                }
            }
            return r;
        };
        var _diff = function(e, e2) {
            if (!e.length) {
                return e2;
            }
            if (isIE && e[0].selectSingleNode) {
                var d = ++key, ei;
                for (var i = 0; ei = e[i]; i++) {
                    ei.setAttribute("__diff", d);
                }
                var r = new Array(), rl = - 1;
                for (var i = 0; ei = e2[i]; i++) {
                    if (ei.getAttribute("__diff") != d) {
                        r[++rl] = ei;
                    }
                }
                for (var i = 0; ei = e[i]; i++) {
                    ei.removeAttribute("__diff");
                }
                return r;
            }
            var d = ++key;
            for (var i = 0; ei = e[i]; i++) {
                ei.__diff = d;
            }
            var r = new Array(), rl = - 1;
            for (var i = 0; ei = e2[i]; i++) {
                if (ei.__diff != d) {
                    r[++rl] = ei;
                }
            }
            return r;
        };
        var _next = function(e) {
            while ((e = e.nextSibling) && e.nodeType != 1)
                ;
            return e;
        };
        var _prev = function(e) {
            while ((e = e.previousSibling) && e.nodeType != 1)
                ;
            return e;
        };
        return {
            compile: function(selector, type) {
                type = type || "select";
                var s = selector, ls, rules = query.rules, mm, tm, rm, matched, fl = 0, f = ["var fn=function(c){\nvar mode; var e=c||document; ++batch;\n"];
                mm = s.match(reMode);
                if (mm && mm[1]) {
                    f[++fl] = 'mode="' + mm[1].replace(reTrim, "") + '";';
                    s = s.replace(mm[1], "");
                }
                while (s.substr(0, 1) == "/") {
                    s = s.substr(1);
                }
                while (s && ls != s) {
                    ls = s;
                    tm = s.match(reTag);
                    if (type == "select") {
                        if (tm) {
                            if (tm[1] == "#") {
                                f[++fl] = 'e = _quickId(e, mode, c, "' + tm[2] + '");';
                            }
                            else {
                                f[++fl] = 'e = _getNodes(e, mode, "' + tm[2] + '");';
                            }
                            s = s.replace(tm[0], "");
                        }
                        else if (s.substr(0, 1) != '@') {
                            f[++fl] = 'e = _getNodes(e, mode, "*");';
                        }
                    }
                    else if (tm) {
                        if (tm[1] == "#") {
                            f[++fl] = 'e = _byId(e, "' + tm[2] + '");';
                        }
                        else {
                            f[++fl] = 'e = _byTag(e, "' + tm[2] + '");'
                        }
                        s = s.replace(tm[0], "");
                    }
                    while (!(mm = s.match(reMode))) {
                        matched = false;
                        for (var j = 0; rm = rules[j]; j++) {
                            var m = s.match(rm.re);
                            if (m) {
                                f[++fl] = rm.select.replace(reTemplate, function(e, i) {
                                    return m[i];
                                });
                                s = s.replace(m[0], "");
                                matched = true;
                                break;
                            }
                        }
                        if (!matched) {
                            throw 'Error parsing selector, parsing failed at "' + s + '"';
                        }
                    }
                    if (mm[1]) {
                        f[++fl] = 'mode="' + mm[1].replace(reTrim, "") + '";';
                        s = s.replace(mm[1], "");
                    }
                }
                f[++fl] = "return _unique(e);\n}";
                eval(f.join(""));
                return fn;
            },
            select: function(selector, context) {
                context = context || document;
                if (typeof context == "string") {
                    context = document.getElementById(context);
                }
                var selectors = selector.split(","), len = selectors.length, results = new Array();
                for (var i = 0; i < len; i++) {
                    var s = selectors[i].replace(reTrim, "");
                    if (!cache[s]) {
                        if (!(cache[s] = query.compile(s))) {
                            throw s + " is not a valid selector";
                        }
                    }
                    var result = cache[s](context);
                    if (result && result != document) {
                        results = results.concat(result);
                    }
                }
                if (len > 1) {
                    return _unique(results);
                }
                return results;
            },
            is: function(e, ss) {
                if (typeof e == "string") {
                    e = document.getElementById(e);
                }
                var isArray = !!e.splice, result = query.filter(isArray ? e : [e], ss);
                return isArray ? (result.length == e.length) : (result.length > 0);
            },
            filter: function(e, ss, nonMatches) {
                ss = ss.replace(reTrim, "");
                if (!simpleCache[ss]) {
                    simpleCache[ss] = query.compile(ss, "simple");
                }
                var result = simpleCache[ss](e);
                return nonMatches ? _diff(result, e) : result;
            },
            rules: [{
                    re: /^\.([\w-]+)/,
                    select: 'e = _byClass(e, " {1} ");'
                },
                {
                    re: /^\:([\w-]+)(?:\(((?:[^\s>\/]*|.*?))\))?/,
                    select: 'e = _byPseudo(e, "{1}", "{2}");'
                },
                {
                    re: /^\[([\w-]+)(?:(.?=)["']?(.+?)["']?)?\]/,
                    select: 'e = _byAttr(e, "{1}", "{2}", "{3}");'
                },
                {
                    re: /^#([\w-]+)/,
                    select: 'e = _byId(e, "{1}");'
                }],
            operators: {
                "=": function(attr, val) {
                    return attr == val;
                },
                "!=": function(attr, val) {
                    return attr != val;
                },
                "^=": function(attr, val) {
                    return attr && attr.substr(0, val.length) == val;
                },
                "$=": function(attr, val) {
                    return attr && attr.substr(attr.length - val.length) == val;
                },
                "*=": function(attr, val) {
                    return attr && attr.indexOf(val) !== -1;
                },
                "%=": function(attr, val) {
                    return (attr % val) == 0;
                },
                "|=": function(attr, val) {
                    return attr && (attr == val || attr.substr(0, val.length + 1) == val + '-');
                },
                "~=": function(attr, val) {
                    return attr && (' ' + attr + ' ').indexOf(' ' + val + ' ') != -1;
                }
            },
            pseudos: {
                "first-child": function(e) {
                    var r = new Array(), rl = -1, n;
                    for (var i = 0, ei; ei = n = e[i]; i++) {
                        while ((n = n.previousSibling) && n.nodeType != 1)
                            ;
                        if (!n) {
                            r[++rl] = ei;
                        }
                    }
                    return r;
                },
                "last-child": function(e) {
                    var r = new Array(), rl = -1, n;
                    for (var i = 0, ei; ei = n = e[i]; i++) {
                        while ((n = n.nextSibling) && n.nodeType != 1)
                            ;
                        if (!n) {
                            r[++rl] = ei;
                        }
                    }
                    return r;
                },
                "nth-child": function(e, val) {
                    var r = new Array(), rl = -1, m = reNth.exec(val == "even" && "2n" || val == "odd" && "2n+1" || !reNth2.test(val) && "n+" + val || val), f = (m[1] || 1) - 0, l = m[2] - 0;
                    for (var i = 0, ei; ei = e[i]; i++) {
                        var p = ei.parentNode;
                        if (batch != p._batch) {
                            var j = 0;
                            for (var n = p.firstChild; n; n = n.nextSibling)
                                if (n.nodeType == 1) {
                                    n.nodeIndex = ++j;
                                }
                            p._batch = batch;
                        }
                        if (f == 1) {
                            if (l == 0 || ei.nodeIndex == l) {
                                r[++rl] = ei;
                            }
                        }
                        else if ((ei.nodeIndex + l) % f == 0) {
                            r[++rl] = ei;
                        }
                    }
                    return r;
                },
                "only-child": function(e) {
                    var r = new Array(), rl = - 1;
                    ;
                    for (var i = 0, ei; ei = e[i]; i++)
                        if (!_prev(ei) && !_next(ei)) {
                            r[++rl] = ei;
                        }
                    return r;
                },
                "empty": function(e) {
                    var r = new Array(), rl = - 1;
                    for (var i = 0, ei; ei = e[i]; i++) {
                        var n = ei.childNodes, j = -1, nj, empty = true;
                        while (nj = n[++j])
                            if (nj.nodeType == 1 || nj.nodeType == 3) {
                                empty = false;
                                break;
                            }
                        if (empty) {
                            r[++rl] = ei;
                        }
                    }
                    return r;
                },
                "contains": function(e, val) {
                    var r = new Array(), rl = - 1;
                    for (var i = 0, ei; ei = e[i]; i++) {
                        if ((ei.textContent || ei.innerText || '').indexOf(val) != -1) {
                            r[++rl] = ei;
                        }
                    }
                    return r;
                },
                "nodeValue": function(e, val) {
                    var r = new Array(), rl = - 1;
                    for (var i = 0, ei; ei = e[i]; i++) {
                        if (ei.firstChild && ei.firstChild.nodeValue == val) {
                            r[++rl] = ei;
                        }
                    }
                    return r;
                },
                "checked": function(e) {
                    var r = new Array(), rl = - 1;
                    for (var i = 0, ei; ei = e[i]; i++) {
                        if (ei.checked == true) {
                            r[++rl] = ei;
                        }
                    }
                    return r;
                },
                "not": function(e, val) {
                    return query.filter(e, val, true);
                },
                "any": function(e, val) {
                    var r = new Array(), rl = -1, s, ss = val.split('|');
                    for (var i = 0, ei; ei = e[i]; i++) {
                        for (var j = 0; s = ss[j]; j++) {
                            if (query.is(ei, s)) {
                                r[++rl] = ei;
                                break;
                            }
                        }
                    }
                    return r;
                },
                "odd": function(e) {
                    return this["nth-child"](e, "odd");
                },
                "even": function(e) {
                    return this["nth-child"](e, "even");
                },
                "nth": function(e, val) {
                    return e[val - 1] || new Array();
                },
                "first": function(e) {
                    return e[0] || new Array();
                },
                "last": function(e) {
                    return e[e.length - 1] || new Array();
                },
                "has": function(e, val) {
                    var r = new Array(), rl = -1, s = query.select;
                    for (var i = 0, ei; ei = e[i]; i++) {
                        if (s(val, ei).length > 0) {
                            r[++rl] = ei;
                        }
                    }
                    return r;
                },
                "next": function(e, val) {
                    var r = new Array(), rl = -1, is = query.is;
                    for (var i = 0, ei; ei = e[i]; i++) {
                        var n = _next(ei);
                        if (n && is(n, val)) {
                            r[++rl] = ei;
                        }
                    }
                    return r;
                },
                "prev": function(e, val) {
                    var r = new Array(), rl = -1, is = query.is;
                    for (var i = 0, ei; ei = e[i]; i++) {
                        var n = _prev(ei);
                        if (n && is(n, val)) {
                            r[++rl] = ei;
                        }
                    }
                    return r;
                }
            }
        }
    }();
    var query = jZU.query;
})();