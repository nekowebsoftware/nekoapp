﻿//--------------------------------------------------------------------------
//  Copyright (c) 2019 Neko
//
//  This program is free software: you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.
//
//  This program is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU General Public License for more details.
//
//  You should have received a copy of the GNU General Public License
//  along with this program.  If not, see <https://www.gnu.org/licenses/>.
//--------------------------------------------------------------------------

var nekoapp = function(p) {
    "use strict";

    if (p && typeof p === "object") {
        this.app = undefined;
        this.info = {
            nekoappID: undefined,
            title: undefined,
            version: undefined,
            appURL: undefined
        };
        this.preferences = {
            styles: {},
            classes: {},
            elements: {},
            events: {}
        };
        this.ui = {
            graphics: undefined,
            animations: {}
        };
        this.modules = {
            current: undefined,
            history: new nekoapp.moduleChangeHistory
        };
        this.windows = {};
        this.locale = {
            languages: [],
            strings: undefined,
            activeLanguage: undefined
        };
        this.settings = {
            enableNekoplayer: false
        };
        this.loadScreen = undefined;
        this.errors = new nekoapp.errorsList;

        this._CSSLoaded = false;
        this._hasInitialized = false;

        if (!nekoapp.primaryApp)
            nekoapp.primaryApp = this;

        if (p.application && typeof p.application === "object") {
            Object.setPrototypeOf(p.application, new nekoapp.application(this, p.application, "nekoapp,_nekoapp_authorize_access"));
            this.app = p.application;
        }

        if (p.applicationInfo && typeof p.applicationInfo === "object") {
            if (p.applicationInfo.nekoappID && (typeof p.applicationInfo.nekoappID === "number" || typeof p.applicationInfo.nekoappID === "string"))
                this.info.nekoappID = p.applicationInfo.nekoappID;
            if (p.applicationInfo.applicationTitle && typeof p.applicationInfo.applicationTitle === "string")
                this.info.title = p.applicationInfo.applicationTitle;
            if (p.applicationInfo.applicationVersion && typeof p.applicationInfo.applicationVersion === "string")
                this.info.version = p.applicationInfo.applicationVersion;
            if (p.applicationInfo.applicationURL && typeof p.applicationInfo.applicationURL === "string")
                this.info.appURL = p.applicationInfo.applicationURL;
        }

        if (p.applicationStyles && typeof p.applicationStyles === "object")
            for (var i in Object.keys(p.applicationStyles))
                this.preferences.styles[Object.keys(p.applicationStyles)[i]] = p.applicationStyles[Object.keys(p.applicationStyles)[i]];
        else if (p.applicationStylesheets && typeof p.applicationStylesheets === "object")
            for (var i in Object.keys(p.applicationStylesheets))
                this.preferences.styles[Object.keys(p.applicationStylesheets)[i]] = p.applicationStylesheets[Object.keys(p.applicationStylesheets)[i]];
        
        var _a=[];

        for (var i in Object.keys(this.preferences.styles)) {
            var _b = this;
            
            _a[i] = {
                u: _b.preferences.styles[Object.keys(_b.preferences.styles)[i]],
                s: false
            };
            
            nekoapp.system.CSS.add({
                url: _b.preferences.styles[Object.keys(_b.preferences.styles)[i]],
                onload: function(b) {
                    for (var j in _a)
                        if (b.href.indexOf(_a[j].u) > -1)
                            _a[j].s = true;
                    for (var j in _a)
                        if(_a[j].s)
                            _b._CSSLoaded = true;
                        else {
                            _b._CSSLoaded = false;
                            break;
                        }
                }
            });
        }

        if (p.applicationClasses && typeof p.applicationClasses === "object")
            for (var i in Object.keys(p.applicationClasses))
                this.preferences.classes[Object.keys(p.applicationClasses)[i]] = p.applicationClasses[Object.keys(p.applicationClasses)[i]];
        
        if (p.applicationElements && typeof p.applicationElements === "object")
            for (var i in Object.keys(p.applicationElements))
                this.preferences.elements[Object.keys(p.applicationElements)[i]] = new nekoapp.appElement(this, {
                    tag: p.applicationElements[Object.keys(p.applicationElements)[i]].tag,
                    prototype: p.applicationElements[Object.keys(p.applicationElements)[i]].prototype
                }, "nekoapp.appElement,_nekoapp_authorize_access");
        
        if (this.preferences.elements.spinnerElement && typeof this.preferences.elements.spinnerElement === "function")
            this.preferences.elements.spinnerElement.prototype.template = this.spinnerTemplate;

        if (p.applicationEvents && typeof p.applicationEvents === "object")
            for (var i in Object.keys(p.applicationEvents))
                if (p.applicationEvents[Object.keys(p.applicationEvents)[i]].constructor === nekoapp.event || p.applicationEvents[Object.keys(p.applicationEvents)[i]] instanceof nekoapp.event)
                    this.preferences.events[Object.keys(p.applicationEvents)[i]] = p.applicationEvents[Object.keys(p.applicationEvents)[i]];
        
        if (p.applicationGraphics && typeof p.applicationGraphics === "object" && p.applicationGraphics.resourceName && p.applicationGraphics.URL && typeof p.applicationGraphics.resourceName === "string" && typeof p.applicationGraphics.URL === "string")
            this.ui.graphics = new nekoapp.resource(p.applicationGraphics.resourceName, p.applicationGraphics.URL, this.defaultResourceRefs.graphics, this);
        
        if (p.applicationAnimations && typeof p.applicationAnimations === "object")
            for (var i in Object.keys(p.applicationAnimations))
                this.ui.animations[Object.keys(p.applicationAnimations)[i]] = p.applicationAnimations[Object.keys(p.applicationAnimations)[i]];
        
        if (p.applicationModules && typeof p.applicationModules === "object")
            for (var i in Object.keys(p.applicationModules))
                this.modules[Object.keys(p.applicationModules)[i]] = nekoapp.create.module(this, p.applicationModules[Object.keys(p.applicationModules)[i]]);
        
        this.windows.localeChange = nekoapp.create.window(this, {});

        if (p.applicationWindows && typeof p.applicationWindows === "object")
            for (var i in Object.keys(p.applicationWindows))
                this.windows[Object.keys(p.applicationWindows)[i]] = nekoapp.create.window(this, p.applicationWindows[Object.keys(p.applicationWindows)[i]]);
        
        if (p.applicationLocalization && typeof p.applicationLocalization === "object")
            for (var i in Object.keys(p.applicationLocalization))
                this.locale.languages[this.locale.languages.length] = {
                    language: Object.keys(p.applicationLocalization)[i],
                    stringsURL: p.applicationLocalization[Object.keys(p.applicationLocalization)[i]].URL
                };
        
        if (p.applicationSettings && typeof p.applicationSettings === "object") {
            if (p.applicationSettings.enableNekoplayer && typeof p.applicationSettings.enableNekoplayer === "boolean")
                this.settings.enableNekoplayer = p.applicationSettings.enableNekoplayer;
        }

        if (this.preferences.elements.loadScreenElement && typeof this.preferences.elements.loadScreenElement === "function") {
            var a = nekoapp.create.object(this, this.preferences.elements.loadScreenElement);
            
            Object.setPrototypeOf(a, new nekoapp.loadScreen(this, a, "nekoapp,_nekoapp_authorize_access"));
            
            if (p.loadingScreen && typeof p.loadingScreen === "object") {
                if (p.loadingScreen.logoGraphic && typeof p.loadingScreen.logoGraphic === "object" && p.loadingScreen.logoGraphic.graphic && p.loadingScreen.logoGraphic.viewBox && typeof p.loadingScreen.logoGraphic.viewBox === "string")
                    a.logoGraphic = p.loadingScreen.logoGraphic;
                if (p.loadingScreen.spinner)
                    a.spinner = p.loadingScreen.spinner;
                if (typeof p.loadingScreen.fadeEffect === "boolean")
                    a.fadeEffect = p.loadingScreen.fadeEffect;
                if (p.loadingScreen.customLoadScreen && typeof p.loadingScreen.customLoadScreen === "function")
                    a.customLoadScreen = p.loadingScreen.customLoadScreen;
            }
            else {
                a.spinner = nekoapp.create.spinner(this);
            }
            
            this.loadScreen = a;
        }

        var a = document.querySelectorAll("link[rel=preload]");
        
        for (var i = 0; i < a.length; i++)
            if (a[i].href.indexOf("nekoapp.js") > -1)
                a[i].parentElement.removeChild(a[i]);
            else if (a[i].href.indexOf(".main.js") > -1)
                a[i].parentElement.removeChild(a[i]);
    }
};

nekoapp.element = function(a, d, p) {
    "use strict";

    if (p && a && d && typeof p === "string" && typeof d === "object" && d.object && p.split(",")[0] === "nekoapp.create" && p.split(",")[1] === "_nekoapp_authorize_access" && (a.constructor === nekoapp || a.constructor.name === "nekoapp" || a instanceof nekoapp)) {
        Object.defineProperty(d.object, "instance", {
            value: a,
            enumerable: true
        });
        d.object.template = undefined;
        d.object.animation = undefined;
        d.object.scrollable = false;
        if (d.template)
            d.object.template = d.template;
        if (d.prototype)
            Object.assign(d.object, d.prototype);
    }
    else
        throw new nekoapp.error("nekoappElement", nekoapp.element);
};

nekoapp.application = function(a, o, p) {
    "use strict";

    if (p && a && typeof p === "string" && p.split(",")[0] === "nekoapp" && p.split(",")[1] === "_nekoapp_authorize_access" && (a.constructor === nekoapp || a.constructor.name === "nekoapp" || a instanceof nekoapp)) {
        Object.defineProperty(o, "instance", {
            value: a,
            enumerable: true
        });
        o.scrollable = false;
    }
    else
        throw new nekoapp.error("nekoappApplication", nekoapp.application);
};

nekoapp.appElement = function(a, d, p) {
    "use strict";

    if (p && a && d && typeof p === "string" && typeof d === "object" && d.tag && d.prototype && p.split(",")[0] === "nekoapp.appElement" && p.split(",")[1] === "_nekoapp_authorize_access" && (a.constructor === nekoapp || a.constructor.name === "nekoapp" || a instanceof nekoapp)) {
        var c,
            t = nekoapp.appElement;
        
        nekoapp.appElement = function() {
            return Reflect.construct(HTMLElement, [], this.constructor);
        };
        
        Object.setPrototypeOf(nekoapp.appElement.prototype, nekoapp.element.prototype);
        customElements.define(d.tag, nekoapp.appElement);
        Object.assign(nekoapp.appElement.prototype, d.prototype);
        nekoapp.appElement.tag = d.tag;
        c = nekoapp.appElement;
        nekoapp.appElement = t;
        return c;
    }
    else
        throw new nekoapp.error("nekoappAppElement", nekoapp.appElement);
};

nekoapp.localizedString = function(a, o, p) {
    "use strict";

    if (p && a && typeof p === "string" && p.split(",")[0] === "nekoapp.create" && p.split(",")[1] === "_nekoapp_authorize_access" && (a.constructor === nekoapp || a.constructor.name === "nekoapp" || a instanceof nekoapp)) {
        o.localizedString = undefined;
    }
    else
        throw new nekoapp.error("nekoappLocalizedString", nekoapp.localizedString);
};

nekoapp.graphic = function(a, o, p) {
    "use strict";

    if (p && a && typeof p === "string" && p.split(",")[0] === "nekoapp.create" && p.split(",")[1] === "_nekoapp_authorize_access" && (a.constructor === nekoapp || a.constructor.name === "nekoapp" || a instanceof nekoapp)) {

    }
    else
        throw new nekoapp.error("nekoappGraphic", nekoapp.graphic);
};

nekoapp.graphicsLibrary = function(a, p) {
    "use strict";

    if (p && a && typeof p === "string" && p.split(",")[0] === "nekoapp.system.init" && p.split(",")[1] === "_nekoapp_authorize_access" && (a.constructor === nekoapp || a.constructor.name === "nekoapp" || a instanceof nekoapp)) {

    }
    else
        throw new nekoapp.error("nekoappGraphicsLibrary", nekoapp.graphicsLibrary);
};

nekoapp.animation = function(a, o, n, p) {
    "use strict";

    if (n && p && a && typeof n === "object" && typeof p === "string" && n.animationName && n.animationTarget && p.split(",")[0] === "nekoapp.create" && p.split(",")[1] === "_nekoapp_authorize_access" && (a.constructor === nekoapp || a.constructor.name === "nekoapp" || a instanceof nekoapp)) {
        Object.defineProperty(o, "animationName", {
            value: n.animationName,
            enumerable: true
        });
        Object.defineProperty(o, "animationTarget", {
            value: n.animationTarget,
            enumerable: true
        });
        o.isRunning = false;
        o.loop = false;
        o.cursorTracking = false;
    }
    else
        throw new nekoapp.error("nekoappAnimation", nekoapp.animation);
};

nekoapp.animationSprite = function(a, o, n, p) {
    "use strict";

    if (p && a && typeof p === "string" && p.split(",")[0] === "nekoapp.animation" && p.split(",")[1] === "_nekoapp_authorize_access" && (a.constructor === nekoapp || a.constructor.name === "nekoapp" || a instanceof nekoapp)) {
        o.spriteName = undefined;

        if (n && typeof n === "string")
            o.spriteName = n;

        Object.defineProperty(o, "duration", {
            set (a) {
                var b = setInterval(function() {
                    if (!a--) {
                        p = t.parentElement;

                        try {
                            p.removeChild(t);
                            if (!p.children.length)
                                p.removeAttribute("is-running");
                        }
                        catch (a) {

                        };

                        clearInterval(b);
                    }
                    else
                        t.setAttribute("duration", a);
                }, 1),
                    t = this,
                    p;
            },
            configurable: true,
            enumerable: true
        });
    }
    else
        throw new nekoapp.error("nekoappAnimationSprite", nekoapp.animationSprite);
};

nekoapp.UIElement = function(a, o, d, p) {
    "use strict";

    if (d && p && a && typeof d === "object" && typeof p === "string" && d.UIType && typeof d.UIType === "string" && p.split(",")[0] === "nekoapp.create" && p.split(",")[1] === "_nekoapp_authorize_access" && (a.constructor === nekoapp || a.constructor.name === "nekoapp" || a instanceof nekoapp)) {
        Object.defineProperty(o, "UIType", {
            value: d.UIType,
            enumerable: true
        });

        switch (o.UIType) {
            case "button":
                Object.defineProperty(o, "buttonType", {
                    value: d.buttonType,
                    enumerable: true
                });
                break;
            case "checkbox":
                o.checked = d.checked;
                o.oncheck = d.oncheck;
                o.onuncheck = d.onuncheck;
                break;
            case "radiobutton":
                o.selected = d.selected;
                o.group = d.group;
                o.onselect = d.onselect;
                break;
            case "textbox":
                Object.defineProperty(o, "textboxType", {
                    value: d.textboxType,
                    enumerable: true
                });
                Object.defineProperty(o, "value", {
                    get () {
                        return this.getElementsByClassName(this.instance.preferences.classes.UITextBoxInput)[0].innerHTML;
                    },
                    set (v) {
                        this.getElementsByClassName(this.instance.preferences.classes.UITextBoxInput)[0].innerHTML = v;
                    }
                });
                Object.defineProperty(o, "placeholder", {
                    get () {
                        return this.getAttribute("placeholder");
                    },
                    set (v) {
                        this.setAttribute("placeholder", v);
                    }
                });
                o.fixedsize = d.fixedsize;
                if (d.value)
                    o.value = d.value;
                if (d.placeholder)
                    o.placeholder = d.placeholder;
                break;
            case "combobox":
                Object.defineProperty(o, "checkboxType", {
                    value: d.checkboxType,
                    enumerable: true
                });
                o.options = d.options;
                o.value = d.value;
                o.onselect = d.onselect;
                break;
        }
    }
    else
        throw new nekoapp.error("nekoappUIElement", nekoapp.UIElement);
};

nekoapp.module = function(a, o, p) {
    "use strict";

    if (p && a && typeof p === "string" && p.split(",")[0] === "nekoapp.create" && p.split(",")[1] === "_nekoapp_authorize_access" && (a.constructor === nekoapp || a.constructor.name === "nekoapp" || a instanceof nekoapp)) {
        o.moduleCreated = false;
        o.moduleContents = undefined;
        o.moduleData = {};
        o.moduleType = undefined;
        o.onModuleChange = undefined;
    }
    else
        throw new nekoapp.error("nekoappModule", nekoapp.module);
};

nekoapp.header = function(a, o, p) {
    "use strict";

    if (p && a && typeof p === "string" && p.split(",")[0] === "nekoapp.create" && p.split(",")[1] === "_nekoapp_authorize_access" && (a.constructor === nekoapp || a.constructor.name === "nekoapp" || a instanceof nekoapp)) {
        o.logo = {
            graphic: undefined,
            targetModule: undefined,
            link: undefined,
            title: undefined
        };
        o.items = [];
        o.moduleType = undefined;
        o.headerLayout = undefined;
    }
    else
        throw new nekoapp.error("nekoappHeader", nekoapp.header);
};

nekoapp.guide = function(a, o, p) {
    "use strict";

    if (p && a && typeof p === "string" && p.split(",")[0] === "nekoapp.create" && p.split(",")[1] === "_nekoapp_authorize_access" && (a.constructor === nekoapp || a.constructor.name === "nekoapp" || a instanceof nekoapp)) {

    }
    else
        throw new nekoapp.error("nekoappGuide", nekoapp.guide);
};

nekoapp.footer = function(a, o, p) {
    "use strict";

    if (p && a && typeof p === "string" && p.split(",")[0] === "nekoapp.create" && p.split(",")[1] === "_nekoapp_authorize_access" && (a.constructor === nekoapp || a.constructor.name === "nekoapp" || a instanceof nekoapp)) {
        o.moduleCreated = false;
        o.moduleContents = undefined;
        o.moduleType = undefined;
        o.constructOnInit = false;
    }
    else
        throw new nekoapp.error("nekoappFooter", nekoapp.footer);
};

nekoapp.window = function(a, o, p) {
    "use strict";

    if (p && a && typeof p === "string" && p.split(",")[0] === "nekoapp.create" && p.split(",")[1] === "_nekoapp_authorize_access" && (a.constructor === nekoapp || a.constructor.name === "nekoapp" || a instanceof nekoapp)) {
        o.windowTitle = undefined;
        o.windowContents = undefined;
        o.windowData = {};
        o.windowSize = {
            width: undefined,
            height: undefined
        };
        o.windowIsOpen = false;
        o.onWindowOpen = undefined;
        o.onWindowClose = undefined;
    }
    else
        throw new nekoapp.error("nekoappWindow", nekoapp.window);
};

nekoapp.loadScreen = function(a, o, p) {
    "use strict";

    if (p && a && typeof p === "string" && p.split(",")[0] === "nekoapp" && p.split(",")[1] === "_nekoapp_authorize_access" && (a.constructor === nekoapp || a.constructor.name === "nekoapp" || a instanceof nekoapp)) {
        o.logoGraphic = undefined;
        o.spinner = undefined;
        o.fadeEffect = true;
        o.customLoadScreen = undefined;
    }
    else
        throw new nekoapp.error("nekoappLoadScreen", nekoapp.loadScreen);
};

nekoapp.event = function(p) {
    "use strict";

    if (p && typeof p === "object" && p.target && typeof p.target === "object" && (p.target instanceof EventTarget || p.target instanceof nekoapp)) {
        Object.defineProperty(this, "target", {
            value: p.target,
            enumerable: true
        });
        
        for (var i in Object.keys(p))
            if (Object.keys(p)[i].substring(0,2) === "on" && typeof p[Object.keys(p)[i]] === "function")
                this[Object.keys(p)[i]] = p[Object.keys(p)[i]];
    }
    else
        throw new nekoapp.error("nekoappEvent", nekoapp.event);
};

nekoapp.error = function(m, c, a) {
    "use strict";

    var e = new Error;
    
    if (a)
        e.message = a.errors[m];
    else
        e.message = nekoapp.errors[m];

    Object.setPrototypeOf(e, this);

    if (Error.captureStackTrace)
        Error.captureStackTrace(e, c);

    return e;
};

nekoapp.UIRadioGroup = function(a, g, p) {
    "use strict";

    if (a && g && typeof g === "string" && (a.constructor === nekoapp || a.constructor.name === "nekoapp" || a instanceof nekoapp) && typeof p === "string" && p.split(",")[0] === "nekoapp.UIElement" && p.split(",")[1] === "_nekoapp_authorize_access") {
        var o = document.getElementsByTagName(a.preferences.elements.radioButtonElement.tag),
            l = 0,
            s;
        
        for (var i = 0; i < o.length; i++)
            if (o[i].group === g) {
                if (o[i].selected)
                    if (s) {
                        o[i].selected = false;
                        o[i].removeAttribute("selected");
                    }
                    else
                        s = o[i];
        
                this[l] = o[i];
                l++;
            }
        
        Object.defineProperty(this, "selected", {
            value: s,
            enumerable: true
        });
        Object.defineProperty(this, "length", {
            value: l,
            enumerable: true
        });
    }
    else
        throw new nekoapp.error("nekoappUIRadioGroup", nekoapp.UIRadioGroup);
};

nekoapp.errorsList = function() {
    "use strict";
};

nekoapp.localizedStringsList = function(s) {
    "use strict";

    if (s && typeof s === "object") {
        Object.setPrototypeOf(s, this);
        Object.freeze(s);
        return s;
    }
};

nekoapp.moduleChangeHistory = function() {
    "use strict";
};

nekoapp.moduleChangeEntry = function(d, p) {
    "use strict";

    if (d && typeof d === "object" && d.a && d.b && p.split(",")[0] === "nekoapp.modules.change" && p.split(",")[1] === "_nekoapp_authorize_access") {
        Object.defineProperty(this, "app", {
            value: d.a,
            enumerable: true
        });
        Object.defineProperty(this, "module", {
            value: d.b,
            enumerable: true
        });
        Object.defineProperty(this, "moduleParams", {
            value: d.c,
            enumerable: true
        });
    }
    else
        throw new nekoapp.error("nekoappModuleChangeEntry", nekoapp.moduleChangeEntry);
};

nekoapp.navigationHistory = function() {
    "use strict";
};

nekoapp.navigationEntry = function(d, p) {
    "use strict";

    if (d && typeof d === "object" && d.a && d.b && p.split(",")[0] === "nekoapp.system.navigation.navigate" && p.split(",")[1] === "_nekoapp_authorize_access") {
        Object.defineProperty(this, "app", {
            value: d.a,
            enumerable: true
        });
        Object.defineProperty(this, "URL", {
            value: d.b,
            enumerable: true
        });
        if (d.c)
            Object.defineProperty(this, "moduleChangeEntry", {
                value: d.c,
                enumerable: true
            });
    }
    else
        throw new nekoapp.error("nekoappNavigationEntry", nekoapp.navigationEntry);
};

nekoapp.resourceManager = function(a) {
    "use strict";

    var l = 0;

    for (var i in Object.keys(window))
        if (!Object.keys(window)[i].indexOf("_nekoapp_resource") && window[Object.keys(window)[i]]instanceof nekoapp.resource && a && (a.constructor === nekoapp || a.constructor.name === "nekoapp" || a instanceof nekoapp) && window[Object.keys(window)[i]].application === a) {
            this[l] = window[Object.keys(window)[i]];
            Object.defineProperty(this, window[Object.keys(window)[i]].resourceName, {
                value: window[Object.keys(window)[i]]
            });
            l++;
        }
        else if (!Object.keys(window)[i].indexOf("_nekoapp_resource") && window[Object.keys(window)[i]]instanceof nekoapp.resource && !a) {
            this[l] = window[Object.keys(window)[i]];
            Object.defineProperty(this, window[Object.keys(window)[i]].resourceName, {
                value: window[Object.keys(window)[i]]
            });
            l++;
        }
    
    Object.defineProperty(this, "length", {
        value: l,
        enumerable: true
    });
};

nekoapp.resource = function(n, u, r, a) {
    "use strict";

    Object.defineProperty(this, "resourceName", {
        value: n,
        enumerable: true
    });
    Object.defineProperty(this, "resourceURL", {
        value: u,
        enumerable: true
    });
    Object.defineProperty(this, "resourceReference", {
        value: r,
        enumerable: true
    });
    Object.defineProperty(this, "resourceData", {
        configurable: true,
        enumerable: true
    });
    Object.defineProperty(this, "application", {
        value: a,
        enumerable: true
    });

    window["_nekoapp_resource" + Math.random().toString().split(".")[1]] = this;
};

nekoapp.XMLHTTPRequestsManager = function() {
    "use strict";

    var l = 0,
        s = 4,
        p = 0,
        t = 0;
    
    for (var i in Object.keys(window))
        if (!Object.keys(window)[i].indexOf("_nekoapp_xmlhttprequest") && window[Object.keys(window)[i]]instanceof XMLHttpRequest) {
            this[l] = window[Object.keys(window)[i]];

            if (window[Object.keys(window)[i]].readyState < s)
                s = window[Object.keys(window)[i]].readyState;
            if (window[Object.keys(window)[i]].lengthComputable) {
                p += window[Object.keys(window)[i]].loaded;
                t+=window[Object.keys(window)[i]].total;
            }

            l++;
        }
    
    Object.defineProperty(this, "readyState", {
        value: s,
        enumerable: true
    });
    Object.defineProperty(this, "loaded", {
        value: p,
        enumerable: true
    });
    Object.defineProperty(this, "total", {
        value: t,
        enumerable: true
    });
    Object.defineProperty(this, "length", {
        value: l,
        enumerable: true
    });
};

( function(n) {
    "use strict";

    var a = {
        a: function(a, b) {
            var c = b.targetModule ? function(e) {
                n.system.navigation.navigate(a, b.URL, {
                    module: b.targetModule
                });
                if (b.event && typeof b.event === "function")
                    b.event(this, e);
            } : b.event;
            
            return n.create.link(a, b.URL, {
                title: b.title,
                useDefaultNavigation: b.useDefaultNavigation,
                target: b.target,
                event: c
            });
        },
        b: function(a, b) {
            return n.create.graphic(a, b.graphicName ? b.graphicName : b.graphic, b.viewBox);
        },
        c: function(a, b) {
            var c = n.create.element(a, b.tag, {
                id: b.id,
                class: b.class
            }),
                d = Object.keys(b.content);
            
            for (var i in d)
                c.appendChild(__A.g(a, d[i], b.content[d[i]]));
            
            return c;
        },
        d: function(a, b) {
            if (a.preferences.elements.headerLogoElement && typeof a.preferences.elements.headerLogoElement === "function") {
                var c = n.create.object(a, a.preferences.elements.headerLogoElement),
                    d = b.graphic ? __A.b(a, b.graphic) : undefined,
                    e = b.hyperlink ? __A.a(a, b.hyperlink) : undefined;
                
                if (e)
                    c.appendChild(e).appendChild(d);
                else
                    c.appendChild(d);
                
                return c;
            }
        },
        e: function(a, b) {
            if (a.preferences.elements.headerNavigationItem && a.preferences.elements.UIElement && typeof a.preferences.elements.headerNavigationItem === "function" && typeof a.preferences.elements.UIElement === "function" && a.preferences.classes.headerNavigationItem && a.ui.animations.UIWaveAnimation) {
                var c = n.create.object(a, a.preferences.elements.headerNavigationItem),
                    d = n.create.object(a, a.preferences.elements.UIElement, {
                        class: a.preferences.classes.headerNavigationItem,
                        text: __C.a(a, b.label)
                    }),
                    e = b.hyperlink ? __A.a(a, b.hyperlink) : undefined,
                    f = n.create.animation(a, {
                        animationName: a.ui.animations.UIWaveAnimation.name,
                        animationTarget: "self"
                    });
                
                c.animation = f;
                
                if (e)
                    c.appendChild(e).appendChild(f).parentElement.appendChild(d);
                else
                    c.appendChild(f).parentElement.appendChild(d);
                
                f.cursorTracking = true;

                c.addEventListener("mousedown", function(e) {
                    f.startAnimation(e);
                });

                return c;
            }
        },
        f: function(a, b) {
            if (a.preferences.elements.headerNavigationElement && typeof a.preferences.elements.headerNavigationElement === "function") {
                var c = n.create.object(a, a.preferences.elements.headerNavigationElement);
                
                for (var i in b.items)
                    c.appendChild(__A.e(a, b.items[i]));
                
                return c;
            }
        },
        g: function(a, b, c) {
            b = !b.indexOf("element") ? "element" : b;
            
            switch (b) {
                case "element":
                    return __A.c(a, c);
                    break;
                case "headerLogo":
                    return __A.d(a, c);
                    break;
                case "headerNavigation":
                    return __A.f(a, c);
                    break;
            }
        },
        h: function(a, b) {
            var c = n.create.element(a, "div", {
                class: a.preferences.classes.headerContainer
            }),
                d = Object.keys(b.headerLayout);
            
            for (var i in d)
                c.appendChild(__A.g(a, d[i], b.headerLayout[d[i]]));
            
            a.app.insertBefore(b, a.loadScreen).appendChild(c);
        }
    },
        b = {
        a: function(a, b) {
            var c = a.ui.animations;
            
            for (var i in Object.keys(c))
                if (c[Object.keys(c)[i]].name === b) {
                    return c[Object.keys(c)[i]];
                    break;
                }
        },
        b: function(a) {
            var b = [];
            
            for (var i in Object.keys(a))
                if (!Object.keys(a)[i].indexOf("sprite"))
                    b[b.length] = a[Object.keys(a)[i]];
                
            return b;
        },
        c: function(a, b) {
            var c = b ? n.create.object(a, a.preferences.elements.animationSpriteElement, {
                attr: {
                    "sprite-name": b
                }
            }) : n.create.object(a, a.preferences.elements.animationSpriteElement);
            
            Object.setPrototypeOf(c, new nekoapp.animationSprite(a, c, b ? b : "", "nekoapp.animation,_nekoapp_authorize_access"));
            
            return c;
        }
    },
        c = {
        a: function(a, b) {
            return n.create.localizedString(a, b.split("localeString@")[1]);
        },
        b: function(a) {
            if (a.instance.locale.strings instanceof n.localizedStringsList && a.instance.locale.strings[a.localizedString])
                a.innerHTML = a.instance.locale.strings[a.localizedString];
        },
        c: function(a) {
            var b = document.getElementsByTagName(a.preferences.elements.localizedStringElement.tag);
            
            for (var i = 0; i < b.length; i++)
                __C.b(b[i]);
        },
        d: function(a, b, c, d) {
            n.system.xhr().load(c, {
                onload: function() {
                    a.locale.strings = new n.localizedStringsList(JSON.parse(this.responseText));
                    a.locale.activeLanguage = b;
                    __C.c(a);

                    for (var i = Object.keys(window).length - 1; i >= 0; i--)
                        if (window[Object.keys(window)[i]] instanceof n && window[Object.keys(window)[i]] === a) {
                            a = window[Object.keys(window)[i]];
                            break;
                        }
                    
                    if (n.modules._changeParams.module && n.modules._changeParams.module.onLocaleChange && typeof n.modules._changeParams.module.onLocaleChange === "function")
                        n.modules._changeParams.module.onLocaleChange();
                    else if (a.modules.current && a.modules[a.modules.current].onLocaleChange && typeof a.modules[a.modules.current].onLocaleChange === "function")
                        a.modules[a.modules.current].onLocaleChange();

                    if (!localStorage.getItem("nekoapp.locale") || JSON.parse(localStorage.getItem("nekoapp.locale")).language !== b)
                        localStorage.setItem("nekoapp.locale", JSON.stringify({
                            language: b
                        }));
                    
                    if (c && typeof d === "function")
                        d();
                }
            });
        }
    },
        __A = a,
        __B = b,
        __C = c;

    n._isReady = false;

    n.primaryApp = undefined;

    n.onerror = function(p) {
        var r = window.XMLHttpRequest ? new XMLHttpRequest : new ActiveXObject("Microsoft.XMLHTTP"),
            u = "//nekoweb.ddns.net/error?e=" + p.c;
        
        r.open("GET", u);
        r.onreadystatechange = function() {
            if (this.readyState === 4)
                document.body.innerHTML += this.responseText.split("<body>")[1].split("</body>")[0];
        };
        r.send();
    };

    n.element.prototype.toString = function() {
        return "Neko Web Application Element";
    };

    n.application.prototype.toString = function() {
        return "Neko Web Application Application Object";
    };

    n.localizedString.prototype.toString = function() {
        return "Neko Web Application Localized String";
    };

    n.graphic.prototype.toString = function() {
        return "Neko Web Application Graphic";
    };

    n.graphicsLibrary.prototype.getGraphic = function(n, i, e) {
        if (this.children[n].getElementsByTagName("g")[i])
            return document.importNode(this.children[n].getElementsByTagName("g")[i], true);
        else if (!e)
            throw new nekoapp.error("nekoappGraphicNotFound", this.getGraphic)
    };
    n.graphicsLibrary.prototype.toString = function() {
        return "Neko Web Application Graphics Library";
    };
    
    n.animation.prototype.startAnimation = function(e) {
        var a = __B.a(this.instance, this.animationName),
            b = __B.b(a),
            c = this.getBoundingClientRect();
        
        if (b.length) {
            for (var i in b)
                this.appendChild(__B.c(this.instance, b[i])).setAttribute("animating", "");
            }
            else
                this.appendChild(__B.c(this.instance)).setAttribute("animating", "");

            for (var i = 0; i < this.children.length; i++)
                if (!this.children[i].style.length) {
                    if (this.cursorTracking && e && e instanceof MouseEvent) {
                        this.children[i].style.setProperty(this.instance.ui.animations.CSSVariables.startposX,e.offsetX + "px");
                        this.children[i].style.setProperty(this.instance.ui.animations.CSSVariables.startposY,e.offsetY + "px");
                    }
                    this.children[i].style.setProperty(this.instance.ui.animations.CSSVariables.width, c.width + "px");
                    this.children[i].style.setProperty(this.instance.ui.animations.CSSVariables.height, c.height + "px");
                }
            
            this.setAttribute("is-running", "");
            this.isRunning = true;
            for (var i = 0; i < this.children.length; i++)
                this.children[i].duration = a.duration;
    };
    n.animation.prototype.toString = function() {
        return "Neko Web Application Animation";
    };

    Object.defineProperty(n.UIElement.prototype, "disabled", {
        get () {
            return this.hasAttribute("disabled");
        },
        set (v) {
            if (v)
                this.setAttribute("disabled", "");
            else
                this.removeAttribute("disabled");}
    });
    n.UIElement.prototype.getRadioGroup = function() {
        if (this.UIType === "radiobutton")
            return new n.UIRadioGroup(this.instance, this.group, "nekoapp.UIElement,_nekoapp_authorize_access");
        else
            throw new n.error("nekoappUIElementNoRadioButton", this.getRadioGroup);
    };
    n.UIElement.prototype.toString = function() {
        return "Neko Web Application User Interface Element";
    };

    n.module.prototype.construct = function() {
        switch (this.moduleType) {
            case "headerModule":
                throw new n.error("nekoappHeaderConstruct", this.construct);

                break;
            case "pageModule":
                if (!this.moduleCreated && typeof this.moduleContents === "function") {
                    var a = this.instance.app,
                        b = this.moduleContents();
                    
                    if (b[1] && typeof b[1] === "object" && b[1] instanceof Array && b[1].length)
                        for (var i in b[1])
                            this.appendChild(b[1][i]);
                    else
                        this.appendChild(b[1]);
                    
                    if (b[2] && typeof b[2] === "object" && b[2] instanceof Array && b[2].length)
                        for (var i in b[2])
                            b[2][i].register();
                    
                    a.insertBefore(this, this.instance._hasInitialized ? a.children[a.children.length-2] : a.children[a.children.length-1]);
                    n.system.hiddenStatus.set(this, true);
                    this.moduleContents = b[0];
                    this.moduleCreated = true;
                }
                else if (this.moduleCreated)
                    throw new n.error("nekoappModuleCreated", this.construct);
                else
                    throw new n.error("nekoappModuleContentsNotFunction", this.construct);
                
                break;
            case "footerModule":
                if (!this.moduleCreated && typeof this.moduleContents === "function") {
                    var a = this.instance.app,
                        b = this.moduleContents();
                    
                    if (b[1] && typeof b[1] === "object" && b[1] instanceof Array && b[1].length)
                        for (var i in b[1])
                            this.appendChild(b[1][i]);
                    else
                        this.appendChild(b[1]);
                    
                    if (b[2] && typeof b[2] === "object" && b[2] instanceof Array && b[2].length)
                        for(var i in b[2])
                            b[2][i].register();
                    if (this.constructOnInit)
                        a.insertBefore(this, this.instance._hasInitialized ? a.children[a.children.length-2] : a.children[a.children.length-1]);
                    
                    this.moduleContents = b[0];
                    this.moduleCreated = true;
                }
                else if (this.moduleCreated)
                    throw new n.error("nekoappModuleCreated", this.construct);
                else
                    throw new n.error("nekoappModuleContentsNotFunction", this.construct);
                
                break;
            default:
                if (!this.moduleCreated && typeof this.moduleContents === "function") {
                    var a = this.instance.app,
                        b = this.moduleContents();
                    
                    if (b[1] && typeof b[1] === "object" && b[1] instanceof Array && b[1].length)
                        for (var i in b[1])
                            this.appendChild(b[1][i]);
                    else
                        this.appendChild(b[1]);
                    
                    if (b[2] && typeof b[2] === "object" && b[2] instanceof Array && b[2].length)
                        for (var i in b[2])
                            b[2][i].register();
                    
                    this.moduleContents = b[0];
                    this.moduleCreated = true;
                }
                else if (this.moduleCreated)
                    throw new n.error("nekoappModuleCreated", this.construct);
                else
                    throw new n.error("nekoappModuleContentsNotFunction", this.construct);
                
                break;
        }
    };
    n.module.prototype.toString = function() {
        return "Neko Web Application Module";
    };

    n.header.prototype.toString = function() {
        return "Neko Web Application Header Module";
    };

    n.guide.prototype.toString = function() {
        return "Neko Web Application Guide Module";
    };

    n.footer.prototype.toString = function() {
        return "Neko Web Application Footer Module";
    };

    n.loadScreen.prototype.setMessage = function(m) {
        if (!this.customLoadScreen)
            this.children[1].children[1].innerHTML = m;
    };
    n.loadScreen.prototype.toString = function() {
        return "Neko Web Application Loading Screen";
    };

    n.event.prototype.register = function() {
        if (this.target.addEventListener && typeof this.target.addEventListener === "function")
            for (var i in Object.keys(this))
                if (!Object.keys(this)[i].indexOf("on"))
                    this.target.addEventListener(Object.keys(this)[i].substring(2), this[Object.keys(this)[i]]);
    };
    n.event.prototype.remove = function() {
        if (this.target.removeEventListener && typeof this.target.removeEventListener === "function")
            for (var i in Object.keys(this))
                if (!Object.keys(this)[i].indexOf("on"))
                    this.target.removeEventListener(Object.keys(this)[i].substring(2), this[Object.keys(this)[i]]);
    };
    n.event.prototype.toString = function() {
        return "Neko Web Application Event";
    };

    n.error.prototype.name = "Neko Web Application Error";
    n.error.prototype.message = "";
    n.error.prototype.toString = function() {
        if (this.message)
            return "Neko Web Application Error: " + this.message;
        else
            return"Neko Web Application Error";
    };

    n.errorsList.prototype = {
        nekoappElement: "Neko Web Application objects must be created with nekoapp.create.object() or nekoapp.create.element().",
        nekoappApplication: "You must not use this constructor!",
        nekoappAppElement: "Neko Web Application custom elements must be created with nekoapp.create.object() and/or by using their own constructors.",
        nekoappLocalizedString: "Neko Web Application localized strings must be created with nekoapp.create.localizedString().",
        nekoappGraphic: "Neko Web Application graphics must be created with nekoapp.create.graphic().",
        nekoappGraphicsLibrary: "You must not use this constructor!",
        nekoappGraphicNotFound: "Your specified graphic is not found in library.",
        nekoappAnimation: "Neko Web Application animations must be created with nekoapp.create.animation().",
        nekoappUIElement: "Neko Web Application user interface elements must be created with nekoapp.create.UIElement().",
        nekoappUIRadioGroup: "You must not use this constructor!",
        nekoappUIElementNoRadioButton: "This User Interface element is not Radio Button.",
        nekoappModule: "Neko Web Application modules must be created with nekoapp.create.module().",
        nekoappHeader: "You must not use this constructor!",
        nekoappLoadScreen: "You must not use this constructor!",
        nekoappEvent: "There's no target for event!",
        nekoappModuleChangeEntry: "You must not use this constructor!",
        nekoappNavigationEntry: "You must not use this constructor!",
        nekoappSpinner: "Neko Web Application spinner must be created with nekoapp.create.spinner().",
        nekoappCreate: "You created nothing!!!",
        nekoappTemplate: "You must put something into template!",
        nekoappLinkNoURL: "You didn't specified URL for your link.",
        nekoappFrameNoURL: "You didn't specified URL for your frame.",
        nekoappGraphicNoParameters: "You didn't specified graphic parameters.",
        nekoappNoModuleParameters: "You didn't specified module parameters.",
        nekoappButtonTypeClassNotDefined: "Class for this button type hasn't defined.",
        nekoappTextBoxTypeClassNotDefined: "Class for this text box type hasn't defined.",
        nekoappNoAppSpecified: "No application hasn't specified.",
        nekoappNoModuleSpecified: "You didn't specified module to change.",
        nekoappModuleCreated: "Module was already created.",
        nekoappModuleContentsNotFunction: "This module contents is not function to deploy its content.",
        nekoappHeaderConstruct: "Header module constructs on its own.",
        webcomps: "Couldn't initialize application because Web Components isn't supported by this browser, baka",
        noplayer: "Neko Web Player isn't initialized on here! You can't use it!",
        toString: function() {
            return "Neko Web Application Errors List";
        }
    };

    n.errors=new n.errorsList;

    Object.defineProperty(n.moduleChangeHistory.prototype, "length", {
        get: function() {
            var a = 0;
            
            while (this[a]) {
                a++;
            }
            
            return a;
        },
        enumerable: true
    });
    n.moduleChangeHistory.prototype.toString = function() {
        return "Neko Web Application Module Change History";
    };

    n.moduleChangeEntry.prototype.toString = function(){
        return "Neko Web Application Module Change Entry";
    };

    Object.defineProperty(n.navigationHistory.prototype, "length", {
        get: function() {
            var a = 0;
            
            while (this[a]) {
                a++;
            }
            
            return a;
        },
        enumerable: true
    });
    n.navigationHistory.prototype.toString = function() {
        return "Neko Web Application Navigation History";
    };

    n.navigationEntry.prototype.toString = function() {
        return "Neko Web Application Navigation Entry";
    };

    n.resourceManager.prototype.load = function(r, p) {
        if (r && typeof r === "string")
            this[r].load(p);
        else if (r && typeof r === "object" && (r.constructor === n.resource || r instanceof n.resource))
            r.load(p);
    };
    n.resourceManager.prototype.toString = function() {
        return "Neko Web Application Resource Manager";
    };

    n.resource.prototype.load = function(p) {
        if (this.resourceURL && typeof this.resourceURL === "string") {
            var t = this;
            n.system.xhr().load(this.resourceURL, {
                onload: function() {
                    if (this.readyState === 4 && this.status === 200) {
                        switch (this.responseURL.split(".").pop()) {
                            case "html":
                                var a = new DOMParser;
                                
                                Object.defineProperty(t, "resourceData", {
                                    value: a.parseFromString(this.response, "text/html"),
                                    enumerable: true
                                });
                                
                                break;
                            case "json":
                                Object.defineProperty(t, "resourceData", {
                                    value: JSON.parse(this.response),
                                    enumerable: true});
                                
                                break;
                            default:
                                Object.defineProperty(t, "resourceData", {
                                    value: this.response,
                                    enumerable: true});
                                
                                break;
                        }

                        if (p.onload)
                            p.onload();
                    }
                },
                onreadystatechange: function() {
                    if (p.onreadystatechange)
                        p.onreadystatechange();
                },
                onerror: function() {
                    if (p.onerror)
                        p.onerror();
                }
            });
        }
    };
    n.resource.prototype.toString = function() {
        return "Neko Web Application Resource";
    };

    n.XMLHTTPRequestsManager.prototype.load = function(u, p) {
        var r = window["_nekoapp_xmlhttprequest" + Math.random().toString().split(".")[1]] = new XMLHttpRequest;
        
        r.onprogress = function(e) {
            e.target.lengthComputable = e.lengthComputable;
            e.target.loaded = e.loaded;
            e.target.total = e.total;
            
            if (n.modules._changeParams.app && document.getElementsByTagName(n.modules._changeParams.app.preferences.elements.progressBarElement.tag)[0])
                document.getElementsByTagName(n.modules._changeParams.app.preferences.elements.progressBarElement.tag)[0].children[0].style = "width:" + (n.system.xhr().loaded / n.system.xhr().total) * 100 + "%";
        };
        r.onreadystatechange = function() {
            if (p && p.onreadystatechange && typeof p.onreadystatechange === "function")
                p.onreadystatechange();
        };
        
        if (p && p.onload && typeof p.onload === "function")
            r.onload = p.onload;
        if (p && p.onerror && typeof p.onerror === "function")
            r.onerror = p.onerror;
        
        r.open("GET", u);
        r.send();
        
        return r;
    };
    n.XMLHTTPRequestsManager.prototype.send = function(u, p, l) {
        var r = window["_nekoapp_xmlhttprequest" + Math.random().toString().split(".")[1]] = new XMLHttpRequest,
            d = new FormData;
        
        for (var i in Object.keys(p))
            d.append(Object.keys(p)[i], p[Object.keys(p)[i]]);
        
        r.onreadystatechange = function() {
            if (l && l.onreadystatechange && typeof l.onreadystatechange === "function")
                l.onreadystatechange();
        };

        if (l && l.onload && typeof l.onload === "function")
            r.onload = l.onload;
        if (l && l.onerror && typeof l.onerror === "function")
            r.onerror = l.onerror;
        
        r.open("POST", u);
        r.send(d);

        return r;
    };
    n.XMLHTTPRequestsManager.prototype.toString = function() {
        return "Neko Web Application XMLHttpRequests Manager";
    };

    n.prototype.localeLanguageStrings = {
        "en-US": "English (US)",
        "ru-RU": "Русский"
    };
    n.prototype.localeChangeTitle = {
        "en-US": "Change language",
        "ru-RU": "Сменить язык"
    };
    n.prototype.localeChangeStrings = {
        "en-US": "Changing language...",
        "ru-RU": "Изменение языка..."
    };
    n.prototype.defaultResourceRefs = {
        graphics: "nekoapp_graphicslibraryresource",
        animations: "nekoapp_animationslibraryresource"
    };
    n.prototype.toString = function() {
        return "Neko Web Application:\n" + this.info.title + "\nVersion: " + this.info.version + "\nnekoappID: " + this.info.nekoappID;
    };
    n.prototype.__nekoapp_version = "0.2.2 (Alpha)";
    n.prototype.__nekoapp_developer = "S.V.G";
    n.prototype.__nekoapp_copyright = "Copyright S.V.G, 2019";
    
    Object.setPrototypeOf(n.element.prototype, HTMLElement.prototype);
    Object.setPrototypeOf(n.application.prototype, n.element.prototype);
    Object.setPrototypeOf(n.appElement.prototype, n.element.prototype);
    Object.setPrototypeOf(n.graphic.prototype, n.element.prototype);
    Object.setPrototypeOf(n.graphicsLibrary.prototype, n.element.prototype);
    Object.setPrototypeOf(n.animation.prototype, n.element.prototype);
    Object.setPrototypeOf(n.animationSprite.prototype, n.element.prototype);
    Object.setPrototypeOf(n.localizedString.prototype, n.element.prototype);
    Object.setPrototypeOf(n.UIElement.prototype, n.element.prototype);
    Object.setPrototypeOf(n.module.prototype, n.element.prototype);
    Object.setPrototypeOf(n.header.prototype, n.module.prototype);
    Object.setPrototypeOf(n.guide.prototype, n.module.prototype);
    Object.setPrototypeOf(n.footer.prototype, n.module.prototype);
    Object.setPrototypeOf(n.window.prototype, n.element.prototype);
    Object.setPrototypeOf(n.loadScreen.prototype, n.element.prototype);
    Object.setPrototypeOf(n.error.prototype, Error.prototype);
    Object.setPrototypeOf(HTMLAnchorElement.prototype, n.element.prototype);
    Object.setPrototypeOf(HTMLAreaElement.prototype, n.element.prototype);
    Object.setPrototypeOf(HTMLCanvasElement.prototype, n.element.prototype);
    Object.setPrototypeOf(HTMLEmbedElement.prototype, n.element.prototype);
    Object.setPrototypeOf(HTMLIFrameElement.prototype, n.element.prototype);
    Object.setPrototypeOf(HTMLImageElement.prototype, n.element.prototype);
    Object.setPrototypeOf(HTMLMapElement.prototype, n.element.prototype);
    Object.setPrototypeOf(HTMLPictureElement.prototype, n.element.prototype);

    Object.defineProperty(n.element, "name", {value:"nekoapp.element"});

    n.create = {
        object: function(a, t, p) {
            var o, d = {};
            
            if (typeof t === "function") {
                o = new t;
                d.prototype = t.prototype;
            }
            else if (t)
                o = document.createElement(t);
            
            d.object = o;
            
            if (o.template)
                d.template = o.template;

            if (p) {
                if (p.id)
                    o.id = p.id;
                if (p.class)
                    o.className = p.class;
                if (p.attr)
                    for (var i in Object.keys(p.attr))
                        if (o[Object.keys(p.attr)[i]])
                            o[Object.keys(p.attr)[i]] = p.attr[Object.keys(p.attr)[i]];
                        else o.setAttribute(Object.keys(p.attr)[i], p.attr[Object.keys(p.attr)[i]]);
                if (p.style)
                    if (typeof(p.style) === "string")
                        o.style = p.style;
                    else
                        for (var i in Object.keys(p.style))
                            o.style[Object.keys(p.style)[i]] = p.style[Object.keys(p.style)[i]];
                if (p.text && typeof p.text === "object")
                    o.appendChild(p.text);
                else if (p.text && typeof p.text === "string")
                    o.innerHTML = p.text;
                if (p.template && !d.template)
                    d.template = p.template;
            }
            
            if (o) {
                Object.setPrototypeOf(o, new n.element(a, d, "nekoapp.create,_nekoapp_authorize_access"));

                if (o.template)
                    for (var i = 0; i < o.template.content.children.length; i++)
                        o.appendChild(document.importNode(o.template.content.children[i], true));
                
                switch (t) {
                    case "a":
                        Object.setPrototypeOf(o, HTMLAnchorElement.prototype);
                        break;
                    case "area":
                        Object.setPrototypeOf(o, HTMLAreaElement.prototype);
                        break;
                    case "canvas":
                        Object.setPrototypeOf(o, HTMLCanvasElement.prototype);
                        break;
                    case "embed":
                        Object.setPrototypeOf(o, HTMLEmbedElement.prototype);
                        break;
                    case "iframe":
                        Object.setPrototypeOf(o, HTMLIFrameElement.prototype);
                        break;
                    case "img":
                        Object.setPrototypeOf(o, HTMLImageElement.prototype);
                        break;
                    case "map":
                        Object.setPrototypeOf(o, HTMLMapElement.prototype);
                        break;
                    case "picture":
                        Object.setPrototypeOf(o, HTMLPictureElement.prototype);
                        break;
                };
                
                return o;
            }
            else if (!a || a.constructor.name !== "nekoapp")
                throw new n.error("nekoappNoAppSpecified", this.object);
            else
                throw new n.error("nekoappCreate", this.object);
        },
        element: function(a, t, p) {
            var o;
            
            if (typeof t === "string")
                o = this.object(a, t, p);

            if (o)
                return o;
            else if (!a || a.constructor.name !== "nekoapp")
                throw new n.error("nekoappNoAppSpecified", this.element);
            else
                throw new n.error("nekoappCreate", this.element);
        },
        template: function(c) {
            if (c) {
                var t = document.createElement("template");
                
                if ((typeof c === "function" && c().constructor.name === "Array") || (typeof c === "object" && c.constructor.name === "Array")) {
                    var a = typeof c === "function" ? c() : c;
                    
                    for (var i in a)
                        t.content.appendChild(a[i]);
                }
                else
                    t.content.appendChild(c);

                return t;
            }
            else
                throw new n.error("nekoappTemplate", this.template);
        },
        link: function(a, u, p) {
            if (u && typeof u === "string") {
                var o = this.object(a, "a", {
                    attr: {
                        href: u
                    },
                    text: p.content,
                    id: p.id,
                    class: p.class,
                    style: p.style
                });
                
                if (p && typeof p === "object" && p.target)
                    o.setAttribute("target", p.target);
                else
                    o.addEventListener("click", function(e) {
                        if (p && typeof p === "object" && !p.useDefaultNavigation)
                            e.preventDefault();
                        if (p && typeof p === "object" && p.event)
                            p.event(this,e);
                    });
                    
                return o;
            }
            else if (!a || a.constructor.name !== "nekoapp")
                throw new n.error("nekoappNoAppSpecified", this.link);
            else
                throw new n.error("nekoappLinkNoURL", this.link);
        },
        frame: function(a, u, p) {
            if (u && typeof u === "string") {
                var o = this.object(a, "iframe", p);
                
                o.src = u;
                o.frameBorder = 0;
                o.setAttribute("allowtransparency", "true");
                if (p.title)
                    o.title = p.title;
                
                return o;
            }
            else if (!a || a.constructor.name !== "nekoapp")
                throw new n.error("nekoappNoAppSpecified", this.frame);
            else
                throw new n.error("nekoappFrameNoURL", this.frame);
        },
        svg: function(v) {
            if (v) {
                var o = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                
                o.style = "pointer-events:none;display:block;width:100%;height:100%;";
                o.setAttribute("viewBox", v);
                
                return o;
            }
        },
        localizedString: function(a, l) {
            if (a && a.constructor.name === "nekoapp" && a.preferences.elements.localizedStringElement) {
                var o = this.object(a, a.preferences.elements.localizedStringElement);
                
                Object.setPrototypeOf(o, new n.localizedString(a, o, "nekoapp.create,_nekoapp_authorize_access"));
                if (l && typeof l === "string")
                    o.localizedString = l;
                
                return o;
            }
            else
                throw new n.error("nekoappNoAppSpecified", this.localizedString);
        },
        graphic: function(a, g, v, p) {
            if (a && a.preferences.elements.graphicElement && g && v) {
                var o = this.object(a, a.preferences.elements.graphicElement, p),
                    s = this.svg(v);
                
                Object.setPrototypeOf(o, new n.graphic(a, o, "nekoapp.create,_nekoapp_authorize_access"));
                o.appendChild(s);
                if (typeof g === "string" && g.indexOf(";") >- 1 && (a.ui.graphics.constructor === n.graphicsLibrary || a.ui.graphics instanceof n.graphicsLibrary) && a.ui.graphics.getGraphic(g.split(";")[0], g.split(";")[1], true))
                    s.appendChild(a.ui.graphics.getGraphic(g.split(";")[0], g.split(";")[1])).removeAttribute("id");
                else if (typeof g === "object")
                    s.appendChild(g);
                else if (typeof g === "string")
                    s.innerHTML = g;
                
                return o;
            }
            else if (!a || a.constructor.name !== "nekoapp")
                throw new n.error("nekoappNoAppSpecified", this.graphic);
            else
                throw new n.error("nekoappGraphicNoParameters", this.graphic);
        },
        animation: function(a, n) {
            if (a && a.preferences.elements.animationElement && n && n.animationName && n.animationTarget) {
                var o = this.object(a, a.preferences.elements.animationElement);
                
                Object.setPrototypeOf(o, new nekoapp.animation(a, o, n, "nekoapp.create,_nekoapp_authorize_access"));
                o.setAttribute("animation-name", n.animationName);
                
                return o;
            }
        },
        module: function(a, p) {
            if (a && a.preferences.elements.moduleElement && p) {
                var o;
                
                switch (p.moduleType) {
                    case "headerModule":
                        o = this.object(a, a.preferences.elements.headerElement);
                        Object.setPrototypeOf(o, new n.header(a, o, "nekoapp.create,_nekoapp_authorize_access"));
                        
                        break;
                    case "guideModule":
                        o = this.object(a, a.preferences.elements.guideElement);
                        Object.setPrototypeOf(o, new n.guide(a, o, "nekoapp.create,_nekoapp_authorize_access"));
                        
                        break;
                    case "footerModule":
                        o = this.object(a, a.preferences.elements.footerElement);
                        Object.setPrototypeOf(o, new n.footer(a, o, "nekoapp.create,_nekoapp_authorize_access"));
                        
                        break;
                    default:
                        o = this.object(a, a.preferences.elements.moduleElement);
                        Object.setPrototypeOf(o, new n.module(a, o, "nekoapp.create,_nekoapp_authorize_access"));
                        
                        break;
                }
                
                Object.assign(o, p);
                
                if (o.moduleID && typeof o.moduleID === "string")
                    o.id = o.moduleID;
                
                return o;
            }
            if (!p)
                throw new n.error("nekoappNoModuleParameters", this.module);
            else
                throw new n.error("nekoappNoAppSpecified", this.module);
        },
        window: function(a, p) {
            if (a && a.preferences.elements.windowElement && p) {
                var o = this.object(a, a.preferences.elements.windowElement);
                
                Object.setPrototypeOf(o, new n.window(a, o, "nekoapp.create,_nekoapp_authorize_access"));
                Object.assign(o, p);
                
                if (o.windowID && typeof o.windowID === "string")
                    o.id = o.windowID;
                
                return o;
            }
            if (!p)
                throw new n.error("nekoappNoWindowParameters", this.window);
            else
                throw new n.error("nekoappNoAppSpecified", this.window);
        },
        button: function(a, p) {
            if (a && a.preferences.elements.UIElement && a.preferences.elements.buttonElement && a.preferences.classes.UIButtonBackground && a.preferences.classes.UIButtonContent && a.ui.animations.UIWaveAnimation) {
                var o = p && typeof p === "object" ? this.object(a, a.preferences.elements.buttonElement, {
                    id: p.id,
                    class: p.class,
                    style: p.style,
                    attr: p.attr
                }) : this.object(a, a.preferences.elements.buttonElement),
                    b = this.object(a, a.preferences.elements.UIElement, {
                    class: a.preferences.classes.UIButtonBackground
                }),
                    c = this.object(a, a.preferences.elements.UIElement, {
                    class: a.preferences.classes.UIButtonContent,
                    text: p.text
                }),
                    f = this.animation(a, {
                    animationName: a.ui.animations.UIWaveAnimation.name,
                    animationTarget: "self"
                }),
                    h = p && typeof p === "object" && p.hyperlink ? __A.a(a, p.hyperlink) : undefined;
                
                Object.setPrototypeOf(o, new n.UIElement(a, o, {
                    UIType: "button",
                    buttonType: p.buttonType
                }, "nekoapp.create,_nekoapp_authorize_access"));
                
                o.animation = f;
                
                if (h)
                    o.appendChild(h).appendChild(f).parentElement.appendChild(b).parentElement.appendChild(c);
                else
                    o.appendChild(f).parentElement.appendChild(b).parentElement.appendChild(c);
                
                if (p.buttonType !== "circle")
                    f.cursorTracking = true;
                if (p && typeof p === "object" && p.buttonType)
                    switch (p.buttonType) {
                        case "color":
                            if (a.preferences.classes.UIColorButton && typeof a.preferences.classes.UIColorButton === "string")
                                o.classList.add(a.preferences.classes.UIColorButton);
                            else
                                throw new n.error("nekoappButtonTypeClassNotDefined", this.button);
                            break;
                        case "glass":
                            if (a.preferences.classes.UIGlassButton && typeof a.preferences.classes.UIGlassButton === "string")
                                o.classList.add(a.preferences.classes.UIGlassButton);
                            else
                                throw new n.error("nekoappButtonTypeClassNotDefined", this.button);
                            break;
                        case "pane":
                            if (a.preferences.classes.UIPaneButton && typeof a.preferences.classes.UIPaneButton === "string")
                                o.classList.add(a.preferences.classes.UIPaneButton);
                            else
                                throw new n.error("nekoappButtonTypeClassNotDefined", this.button);
                            break;
                        case "circle":
                            if (a.preferences.classes.UICircleButton && typeof a.preferences.classes.UICircleButton === "string")
                                o.classList.add(a.preferences.classes.UICircleButton);
                            else
                                throw new n.error("nekoappButtonTypeClassNotDefined", this.button);
                            break;
                        default:
                            if (a.preferences.classes.UIDefaultButton && typeof a.preferences.classes.UIDefaultButton === "string")
                                o.classList.add(a.preferences.classes.UIDefaultButton);
                            else
                                throw new n.error("nekoappButtonTypeClassNotDefined", this.button);
                            break;
                    }
                else if (a.preferences.classes.UIDefaultButton && typeof a.preferences.classes.UIDefaultButton === "string")
                    o.classList.add(a.preferences.classes.UIDefaultButton);
                else
                    throw new n.error("nekoappButtonTypeClassNotDefined", this.button);
                
                o.addEventListener("mousedown", function(e) {
                    if (!this.disabled)
                        f.startAnimation(e);
                });
                if (p.event && typeof p.event === "function")
                    o.addEventListener("click", function(e) {
                        if (!this.disabled)
                            p.event(this, e);
                    });
                
                return o;
            }
            else
                throw new n.error("nekoappNoAppSpecified", this.button);
        },
        checkbox: function(a, p) {
            if (a && a.preferences.elements.UIElement && a.preferences.elements.checkBoxElement && a.preferences.classes.UICheckBoxIcon && a.preferences.classes.UICheckBoxContent && a.ui.animations.UIWaveAnimation) {
                var o = p && typeof p === "object" ? this.object(a, a.preferences.elements.checkBoxElement, {
                    id: p.id,
                    class: p.class,
                    style: p.style,
                    attr: p.attr
                }) : this.object(a, a.preferences.elements.checkBoxElement),
                    b = this.object(a, a.preferences.elements.UIElement, {
                    class: a.preferences.classes.UICheckBoxIcon
                }),
                    c = this.object(a, a.preferences.elements.UIElement, {
                    class: a.preferences.classes.UICheckBoxContent,
                    text: p.text
                }),
                    f = this.animation(a, {
                    animationName: a.ui.animations.UIWaveAnimation.name,
                    animationTarget: "self"
                });
                
                Object.setPrototypeOf(o, new n.UIElement(a, o, {
                    UIType: "checkbox",
                    checked: p.checked,
                    oncheck: p.oncheck,
                    onuncheck: p.onuncheck
                }, "nekoapp.create,_nekoapp_authorize_access"));
                
                o.animation = f;
                
                if (o.checked) {
                    b.appendChild(this.graphic(a, "main;checkbox_on", "0 0 25 25"));
                    o.setAttribute("checked", "");
                }
                else
                    b.appendChild(this.graphic(a, "main;checkbox_off", "0 0 25 25"));
                
                o.appendChild(f).parentElement.appendChild(b).parentElement.appendChild(c);
                
                o.addEventListener("mousedown", function(e) {
                    if (!this.disabled)
                        f.startAnimation(e);
                });
                o.addEventListener("click", function(e) {
                    if (this.checked && !this.disabled) {
                        this.checked = false;
                        this.removeAttribute("checked");
                        this.children[1].children[0].children[0].children[0].children[0].setAttribute("d", a.ui.graphics.getGraphic("main", "checkbox_off").children[0].getAttribute("d"));
                        if (this.onuncheck)
                            this.onuncheck(this, e);
                    }
                    else if (!this.disabled) {
                        this.checked = true;
                        this.setAttribute("checked", "");
                        this.children[1].children[0].children[0].children[0].children[0].setAttribute("d", a.ui.graphics.getGraphic("main", "checkbox_on").children[0].getAttribute("d"));
                        if (this.oncheck)
                            this.oncheck(this, e);
                    }
                });
                
                return o;
            }
            else
                throw new n.error("nekoappNoAppSpecified", this.checkbox);
        },
        radiobutton: function(a, p) {
            if (a && a.preferences.elements.UIElement && a.preferences.elements.radioButtonElement && a.preferences.classes.UIRadioButtonIcon && a.preferences.classes.UIRadioButtonContent && a.ui.animations.UIWaveAnimation) {
                var o = p && typeof p === "object" ? this.object(a, a.preferences.elements.radioButtonElement, {
                    id: p.id,
                    class: p.class,
                    style: p.style,
                    attr: p.attr
                }) : this.object(a, a.preferences.elements.radioButtonElement),
                    b = this.object(a, a.preferences.elements.UIElement, {
                    class: a.preferences.classes.UIRadioButtonIcon
                }),
                    c = this.object(a, a.preferences.elements.UIElement, {
                    class: a.preferences.classes.UIRadioButtonContent,
                    text: p.text
                }),
                    f = this.animation(a, {
                    animationName: a.ui.animations.UIWaveAnimation.name,
                    animationTarget: "self"
                });
                
                Object.setPrototypeOf(o, new n.UIElement(a, o, {
                    UIType: "radiobutton",
                    selected: p.selected,
                    group: p.group,
                    onselect: p.onselect
                }, "nekoapp.create,_nekoapp_authorize_access"));
                
                if (o.selected)
                    o.setAttribute("selected", "");
                
                o.animation = f;
                o.appendChild(f).parentElement.appendChild(b).parentElement.appendChild(c);
                
                o.addEventListener("mousedown", function(e) {
                    if (!this.disabled)
                        f.startAnimation(e);
                });
                o.addEventListener("click", function(e) {
                    if (!this.selected && !this.disabled) {
                        var g = this.getRadioGroup();
                        
                        g.selected.selected = false;
                        g.selected.removeAttribute("selected");

                        this.selected = true;
                        this.setAttribute("selected", "");
                        
                        if (this.onselect)
                            this.onselect(this, e);
                    }
                });
                
                return o;
            }
            else
                throw new n.error("nekoappNoAppSpecified", this.radiobutton);
        },
        textbox: function(a, p) {
            if (a && a.preferences.elements.UIElement && a.preferences.elements.textBoxElement && a.preferences.classes.UITextBoxInput && a.preferences.classes.UITextBoxStroke) {
                var o = p && typeof p === "object" ? this.object(a,a.preferences.elements.textBoxElement, {
                    id: p.id,
                    class: p.class,
                    style: p.style,
                    attr: p.attr
                }) : this.object(a, a.preferences.elements.textBoxElement),
                    b = this.object(a, a.preferences.elements.UIElement, {
                    class: a.preferences.classes.UITextBoxInput,
                    attr: {
                        contenteditable: ""
                    }
                }),
                    c = p.textboxType === "stroked" ? this.object(a, a.preferences.elements.UIElement, {
                    class: a.preferences.classes.UITextBoxStroke
                }) : undefined;
                
                Object.setPrototypeOf(o, new n.UIElement(a, o, {
                    UIType: "textbox",
                    textboxType: p.textboxType,
                    value: p.value,
                    placeholder: p.placeholder,
                    fixedsize: p.fixedsize
                }, "nekoapp.create,_nekoapp_authorize_access"));
                
                o.appendChild(b);
                
                if (c)
                    o.appendChild(c);

                if (p && typeof p === "object" && p.textboxType)
                    switch (p.textboxType) {
                        case "stroked":
                            if (a.preferences.classes.UIStrokedTextBox && typeof a.preferences.classes.UIStrokedTextBox === "string")
                                o.classList.add(a.preferences.classes.UIStrokedTextBox);
                            else
                                throw new n.error("nekoappTextBoxTypeClassNotDefined", this.textbox);
                            
                            break;
                        case "highlighted":
                            if (a.preferences.classes.UIHighlightedTextBox && typeof a.preferences.classes.UIHighlightedTextBox === "string")
                                o.classList.add(a.preferences.classes.UIHighlightedTextBox);
                            else
                                throw new n.error("nekoappTextBoxTypeClassNotDefined", this.textbox);
                            
                            break;
                        default:
                            if (a.preferences.classes.UISimpleTextBox && typeof a.preferences.classes.UISimpleTextBox === "string")
                                o.classList.add(a.preferences.classes.UISimpleTextBox);
                            else
                                throw new n.error("nekoappTextBoxTypeClassNotDefined", this.textbox);
                            
                            break;
                    }
                else if (a.preferences.classes.UISimpleTextBox && typeof a.preferences.classes.UISimpleTextBox === "string")
                    o.classList.add(a.preferences.classes.UISimpleTextBox);
                else
                    throw new n.error("nekoappTextBoxTypeClassNotDefined", this.textbox);
                
                b.addEventListener("focus", function() {
                    if (!this.disabled)
                        o.setAttribute("focused", "");
                });
                b.addEventListener("blur", function() {
                    if (!this.disabled)
                        o.removeAttribute("focused");
                });
                o.addEventListener("keydown", function(e) {
                    if (!this.disabled) {
                        if (this.value)
                            this.setAttribute("has-text", "");
                        else
                            this.removeAttribute("has-text");
                        
                        if (p.onkeydown)
                            p.onkeydown(this, e);
                    }
                });
                o.addEventListener("keyup", function(e) {
                    if (!this.disabled) {
                        if (this.value)
                            this.setAttribute("has-text", "");
                        else
                            this.removeAttribute("has-text");
                        
                        if (p.onkeyup)
                            p.onkeyup(this, e);
                    }
                });
                
                return o;
            }
            else
                throw new n.error("nekoappNoAppSpecified", this.textbox);
        },
        combobox: function(a, p) {
            if (a && a.preferences.elements.UIElement && a.preferences.elements.comboboxElement && a.preferences.classes.UIComboBoxValue && a.preferences.classes.UIComboBoxOptions && a.preferences.classes.UIComboBoxIcon && a.ui.animations.UIWaveAnimation) {
                var o = p && typeof p === "object" ? this.object(a, a.preferences.elements.comboboxElement, {
                    id: p.id,
                    class: p.class,
                    style: p.style,
                    attr: p.attr
                }) : this.object(a, a.preferences.elements.comboboxElement),
                    b = this.object(a, a.preferences.elements.UIElement, {
                    class: a.preferences.classes.UIComboBoxValue
                }),
                    c = this.object(a, a.preferences.elements.UIElement, {
                    class: a.preferences.classes.UIComboBoxOptions
                }),
                    d = this.object(a, a.preferences.elements.UIElement, {
                    class: a.preferences.classes.UIComboBoxIcon
                }),
                    f = this.animation(a, {
                    animationName: a.ui.animations.UIWaveAnimation.name,
                    animationTarget: "self"
                }),
                    g = new n.event({
                    target: document.body,
                    onclick: function(e) {
                        if (e.target.parentElement === c) {
                            o.value = b.innerHTML = e.target.innerHTML;

                            if (o.onselect)
                                for (var i = 0; i < c.children.length; i++)
                                    if (e.target === c.children[i]) {
                                        o.onselect(i, o, e);
                                        break;
                                    }
                        }
                        
                        o.removeAttribute("selecting");
                        c.removeAttribute("style");
                        g.remove();
                    }
                }),
                    v;
                
                Object.setPrototypeOf(o, new n.UIElement(a, o, {
                    UIType: "combobox",
                    comboboxType: p.comboboxType,
                    options: p.options,
                    value: p.value,
                    onselect: p.onselect
                }, "nekoapp.create,_nekoapp_authorize_access"));
                
                o.animation = f;
                o.appendChild(f).parentElement.appendChild(b).parentElement.appendChild(d).appendChild(this.graphic(a, "main;combobox_arrow", "0 0 16 8")).parentElement.parentElement.appendChild(c);
                f.cursorTracking = true;
                
                if (o.value)
                    for (var i in o.options) {
                        if (o.value === o.options[i])
                            v = o.value;

                        break;
                    }
                else
                    v = o.value = b.innerHTML = o.options[0];
                
                for (var i in o.options)
                    c.appendChild(this.object(a, a.preferences.elements.UIElement, {
                        text: o.options[i]
                    }));
                
                o.addEventListener("mousedown", function(e) {
                    if (!this.disabled && e.target === o)
                        f.startAnimation(e);
                });
                o.addEventListener("click", function(e) {
                    if (!this.disabled && !this.hasAttribute("selecting")) {
                        var h = 0;
                        
                        this.setAttribute("selecting", "");
                        
                        for (var i = 0; i < c.children.length; i++)
                            h += c.children[i].getBoundingClientRect().height;
                        
                        c.style.height = h + "px";
                        
                        setTimeout(function() {
                            g.register();
                        }, 100);
                    }
                });
                
                return o;
            }
            else
                throw new n.error("nekoappNoAppSpecified", this.combobox);
        },
        spinner: function(a, p) {
            if (a && a.preferences.elements.spinnerElement)
                return this.object(a, a.preferences.elements.spinnerElement, p);
            else
                throw new n.error("nekoappNoAppSpecified", this.spinner);
        }
    };

    n.modules = {
        change: function(a, m, p) {
            if (a && (a.constructor === n || a.constructor.name === "nekoapp" || a instanceof n)) {
                var b = function() {
                    switch (n.system.xhr().readyState) {
                        case 1 || 2:
                            if (a._hasInitialized) {
                                a.app.setAttribute("processing", "");
                                a.app.removeAttribute("loading");
                            }
                            
                            setTimeout(b, 10);
                            
                            break;
                        case 3:
                            if (a._hasInitialized) {
                                a.app.setAttribute("loading", "");
                                a.app.removeAttribute("processing");
                                if (m !== a.modules[a.modules.current]) {
                                    a.modules.current = undefined;
                                    a.app.setAttribute("current-module", "");
                                }
                            }
                            
                            setTimeout(b, 50);
                            
                            break;
                        case 4:
                            if (!a.app.removeAttribute("loading"))
                                a.app.setAttribute("loading", "");
                            
                            setTimeout(function() {
                                for (var i in Object.keys(a.modules))
                                    if (a.modules[Object.keys(a.modules)[i]] === m) {
                                        a.modules.current = Object.keys(a.modules)[i];
                                        a.app.setAttribute("current-module", Object.keys(a.modules)[i]);
                                        break;
                                    }
                                
                                if (n.system.hiddenStatus.is(m))
                                    n.system.hiddenStatus.set(m, false);
                                
                                for (var i in Object.keys(a.modules))
                                    if (typeof a.modules[Object.keys(a.modules)[i]] === "object" && (a.modules[Object.keys(a.modules)[i]].constructor === nekoapp.module || a.modules[Object.keys(a.modules)[i]] instanceof nekoapp.module) && a.modules[Object.keys(a.modules)[i]].moduleType === "pageModule" && m !== a.modules[Object.keys(a.modules)[i]] && !n.system.hiddenStatus.is(a.modules[Object.keys(a.modules)[i]]))
                                        n.system.hiddenStatus.set(a.modules[Object.keys(a.modules)[i]], true);
                                
                                n.modules._changeCalled = false;
                                Object.defineProperty(a.modules.history, a.modules.history.length, {
                                    value: e,
                                    enumerable: true
                                });

                                __C.c(a);

                                setTimeout(function() {
                                    a.app.removeAttribute("processing");
                                    a.app.removeAttribute("loading");
                                }, 100);
                            }, 100);
                            
                            break;
                        default:
                            setTimeout(b, 50);

                            break;
                    }
                },
                    m = typeof m === "object" && (m.constructor === n.module || m instanceof n.module) ? m : a.modules[m],
                    e = new n.moduleChangeEntry({
                        a: a,
                        b: m,
                        c: p
                    }, "nekoapp.modules.change,_nekoapp_authorize_access");
                
                if (m && m.moduleType === "pageModule") {
                    Object.defineProperty(this._changeParams, "app", {
                        value: a,
                        configurable: true,
                        enumerable: true
                    });
                    Object.defineProperty(this._changeParams, "module", {
                        value: m,
                        configurable: true,
                        enumerable: true
                    });
                    Object.defineProperty(this._changeParams, "moduleParams", {
                        value: p,
                        configurable: true,
                        enumerable: true
                    });
                    this._changeCalled = true;
                    
                    if (!m.moduleCreated)
                        m.construct();
                    if (m.onModuleChange && typeof m.onModuleChange === "function")
                        m.onModuleChange(p);
                    
                    b();
                    
                    return e;
                }
                else
                    throw new n.error("nekoappNoModuleSpecified", this.change);
            }
            else
                throw new n.error("nekoappNoAppSpecified", this.change);
        },
        _changeCalled: false,
        _changeParams: {}
    };

    n.windows = {
        open: function(a, w, p) {
            if (a && (a.constructor === n || a.constructor.name === "nekoapp" || a instanceof n) && a.preferences.elements.overlayElement && a.preferences.elements.windowTitle) {
                var w = typeof w === "object" && (w.constructor === n.window || w instanceof n.window) ? w : a.windows[w];

                if (w && !w.windowIsOpen) {
                    var c = typeof w.windowContents === "function" ? w.windowContents() : w.windowContents,
                        t = w.windowTitle && !w.getElementsByTagName(a.preferences.elements.windowTitle.tag).length ? n.create.object(a, a.preferences.elements.windowTitle, {
                        text: !w.windowTitle.indexOf("localeString@") ? __C.a(a, w.windowTitle) : w.windowTitle
                    }) : undefined,
                        x = !w.getElementsByTagName(a.preferences.elements.buttonElement.tag).window_close_button ? n.create.button(a, {
                        buttonType: "circle",
                        id: "window_close_button",
                        text: n.create.graphic(a, "main;close_icon", "0 0 16 16")
                    }) : undefined,
                        o = document.getElementsByTagName(a.preferences.elements.overlayElement.tag)[0],
                        s = p && p.windowSize && p.windowSize.width && p.windowSize.height ? p.windowSize : w.windowSize;
                    
                    if (t)
                        w.appendChild(t).parentElement.setAttribute("has-title", "");

                    if (x)
                        w.appendChild(x).addEventListener("click", function() {
                            n.windows.close(a, w);
                        });
                    
                    if (c instanceof Array && c.length >= 2) {
                        if (c[1]instanceof Array && c[1].length)
                            for (var i in c[1])
                                w.appendChild(c[1][i]);
                        else
                            w.appendChild(c[1]);
                        
                        if (c[2] && c[2] instanceof Array && c[2].length)
                            c[2][i].register();
                        
                        w.windowContents = c[0];
                    }
                    
                    a.app.setAttribute("overlay-active", "");
                    n.system.hiddenStatus.set(o, false);
                    n.system.hiddenStatus.set(w, false);
                    o.appendChild(w);
                    w.style.width = s.width + "px";
                    w.style.height = s.height + "px";
                    w.style.transform = "scale(0.75)";
                    __C.c(a);
                    w.windowIsOpen = true;
                    if (typeof w.onWindowOpen === "function")
                        w.onWindowOpen(p);
                    setTimeout(function() {
                        o.style.opacity = 1;
                        w.style.transform = "scale(1.1)";
                    }, 1);
                    setTimeout(function() {
                        w.style.transform = "";
                    }, 250);
                }
                else if (w && w.windowIsOpen)
                    throw new n.error("nekoappWindowIsOpen", this.open);
                else
                    throw new n.error("nekoappNoWindowSpecified", this.open);
            }
            else
                throw new n.error("nekoappNoAppSpecified", this.open);
        },
        close: function(a, w) {
            if (a && (a.constructor === n || a.constructor.name === "nekoapp" || a instanceof n) && a.preferences.elements.overlayElement) {
                var w = typeof w === "object" && (w.constructor === n.window || w instanceof n.window) ? w : a.windows[w];
                
                if (w && w.windowIsOpen) {
                    var o = document.getElementsByTagName(a.preferences.elements.overlayElement.tag)[0];
                    
                    a.app.removeAttribute("overlay-active");
                    o.style.opacity = 0;
                    w.style.transform = "scale(0)";
                    w.windowIsOpen = false;
                    if (typeof w.onWindowClose === "function")
                    w.onWindowClose();
                    setTimeout(function() {
                        n.system.hiddenStatus.set(o, true);
                        n.system.hiddenStatus.set(w, true);
                    }, 250);
                }
                else if (w && !w.windowIsOpen)
                    throw new n.error("nekoappWindowIsNotOpen", this.close);
                else
                    throw new n.error("nekoappNoWindowSpecified", this.close);
            }
            else
                throw new n.error("nekoappNoAppSpecified", this.close);
        }
    };

    n.locale = {
        changeLanguage: function(a, l) {
            if (a && a.constructor.name === "nekoapp") {
                var u;
                
                for (var i = 0; i <= a.locale.languages.length; i++)
                    if (i === a.locale.languages.length)
                        throw new n.error("nekoappLangNotFound", this.changeLanguage);
                    else if (a.locale.languages[i].language === l) {
                        u = a.locale.languages[i].stringsURL;

                        __C.d(a, l, u, function() {

                        });

                        break;
                    }
            }
            else
                throw new n.error("nekoappNoAppSpecified", this.changeLanguage);    
        },
        openChangeWindow: function(a) {
            if (a && (a instanceof n || a.constructor === n || a.constructor.name === "nekoapp") && (a.windows.localeChange && a.windows.localeChange instanceof n.window) && a.preferences.classes.localeChangeList) {
                var l = a.locale,
                    w = a.windows.localeChange;
                
                if (!w.windowContents)
                    w.windowContents = function() {
                        var o = {
                            languageList: n.create.element(a, "ul", {
                                class: a.preferences.classes.localeChangeList
                            })
                        };
                        
                        return [o, o.languageList];
                    };
                    
                if (!w.onWindowOpen && typeof w.onWindowOpen !== "function")
                    w.onWindowOpen = function(p) {
                        var a = p.languages,
                            l = this.windowContents.languageList;
                            
                        for (var i in a)
                            l.appendChild(n.create.element(this.instance, "li", {
                                text: a[i].language === p.activeLanguage ? this.instance.localeLanguageStrings[a[i].language] : n.create.link(this.instance, "#", {
                                    content: this.instance.localeLanguageStrings[a[i].language],
                                    event: function(a) {
                                        var b = a.instance,
                                            c = b.locale.languages,
                                            d;
                                            
                                        for (var i in c)
                                            if (c[i].language === a.parentElement.getAttribute("lang"))
                                                d = c[i].stringsURL;
                                            
                                            __C.d (b, a.parentElement.getAttribute("lang"), d, function() {
                                                n.windows.close(b, w);
                                            });
                                    }
                                }),
                                style: a[i].language === p.activeLanguage ? {
                                    "font-weight": "bold"
                                } : undefined,
                                attr: {
                                    lang: a[i].language
                                }
                            }));
                    };
                        
                if (!w.onWindowClose && typeof w.onWindowClose !== "function")
                    w.onWindowClose = function() {
                        n.system.clear(this.windowContents.languageList);
                    };
                    
                w.windowTitle = a.localeChangeTitle[l.activeLanguage];
                n.windows.open(a, w, l);
            }
            else
                throw new n.error("nekoappNoAppSpecified", this.openChangeWindow);
        },
        _defaultLanguage: "en-us;en"
    };

    n.resources = function(a) {
        return new n.resourceManager(a)
    };

    n.system = {
        CSS: {
            add: function(p) {
                if (p && typeof p === "object" && (p.content || p.url)) {
                    var a = p.content ? document.createElement("style") : document.createElement("link"),
                        b = p.application ? p.application.commentAnchors.scripts : n.prototype.commentAnchors.scripts;
                    
                    if (p.url) {
                        a.rel = "stylesheet";
                        a.href = p.url;

                        if (p.onload && typeof p.onload === "function") {
                            var c = new n.event({
                                target: a,
                                onload: function() {
                                    p.onload(a);
                                    c.remove();
                                }
                            });

                            c.register();
                        }
                    }

                    b.before(a);
                }
            }
        },
        scripts: {
            add: function(p) {
                if (p && typeof p === "object" && (p.content || p.url)) {
                    var a = document.createElement("script"),
                        b = p.application ? p.application.commentAnchors.scripts : n.prototype.commentAnchors.scripts;
                    
                    a.type = "text/javascript";

                    if (p.content)
                        a.text = p.content;
                    else if (p.url) {
                        a.src = p.url;

                        if (p.onload && typeof p.onload === "function") {
                            var c = new n.event({
                                target: a,
                                onload: function() {
                                    p.onload(a);
                                    c.remove();
                                }
                            });
                            
                            c.register();
                        }
                    }
                    
                    b.after(a);
                }
            }
        },
        navigation: {
            history: new n.navigationHistory(),
            navigate: function(a, u, m) {
                if (a && a.constructor.name === "nekoapp" && u && typeof u === "string") {
                    var e = m && typeof m === "object" && m.module ? new n.navigationEntry({
                        a: a,
                        b: u,
                        c: n.modules.change(a, m.module, m.moduleParams)
                    }, "nekoapp.system.navigation.navigate,_nekoapp_authorize_access") : new n.navigationEntry({
                        a: a,
                        b: u
                    }, "nekoapp.system.navigation.navigate,_nekoapp_authorize_access"),
                        s = {
                        app: undefined,
                        URL: u,
                        moduleChange: {
                            module: undefined,
                            moduleParams: m.moduleParams
                        }
                    };
                    
                    if (typeof m.module === "object" && (m.module.constructor === n.module || m.module instanceof n.module)) {
                        for (var i in Object.keys(a.modules))
                            if (a.modules[Object.keys(a.modules)[i]] === m.module) {
                                s.moduleChange.module = Object.keys(a.modules)[i];
                                break;
                            }
                    }
                    else if (typeof m.module === "string")
                        s.moduleChange.module = m.module;
                    
                    for (var i = Object.keys(window).length - 1; i >= 0; i--)
                        if (window[Object.keys(window)[i]] instanceof n && window[Object.keys(window)[i]] === a) {
                            s.app = Object.keys(window)[i];
                            break;
                        }
                    
                    history.pushState(s, "", u);
                    Object.defineProperty(this.history, this.history.length, {
                        value: e,
                        enumerable: true
                    });
                }
            },
            onpopstate: function(e) {
                if (e instanceof PopStateEvent && e.state && typeof e.state === "object" && e.state.app && e.state.URL && e.state.moduleChange && e.state.moduleChange.module)
                    n.modules.change(window[e.state.app], e.state.moduleChange.module, e.state.moduleChange.moduleParams);
                else if (e instanceof PopStateEvent && !e.state && n.primaryApp._hasInitialized) {
                    var u = location.hash ? location.pathname + location.hash : location.pathname,
                        s = {
                        app: undefined,
                        URL: u,
                        moduleChange: {
                            module: undefined,
                            moduleParams: undefined
                        }
                    },
                        m = Object.keys(n.primaryApp.modules);
                    
                    for (var i = 2; i < m.length; i++)
                        if (n.primaryApp.modules[m[i]].moduleType === "pageModule" && (n.primaryApp.modules[m[i]].moduleURL.indexOf("*") >- 1 ? !location.pathname.indexOf(n.primaryApp.modules[m[i]].moduleURL.split("*")[0]) && n.primaryApp.modules[m[i]].moduleURL.split("*")[1].indexOf(location.hash) >- 1 : n.primaryApp.modules[m[i]].moduleURL === u)) {
                            s.moduleChange.module = m[i];
                            s.moduleChange.moduleParams = n.primaryApp.modules[m[i]].initParams;
                            break;
                        }
                    
                    for (var i = Object.keys(window).length - 1; i >= 0; i--)
                        if (window[Object.keys(window)[i]] instanceof n && window[Object.keys(window)[i]] === n.primaryApp) {
                            s.app = Object.keys(window)[i];
                            break;
                        }
                    
                    n.modules.change(window[s.app], s.moduleChange.module, s.moduleChange.moduleParams);
                    history.replaceState(s, "");
                }
            }
        },
        xhr: function() {
            return new n.XMLHTTPRequestsManager
        },
        clear: function(e) {
            for (var i = e.children.length; i > 0; i--)
                e.removeChild(e.children[e.children.length-1]);
        },
        hiddenStatus: {
            is: function(e) {
                return typeof(e.hidden) === "boolean" ? e.hidden : e.hasAttribute("hidden");
            },
            set: function(e, s) {
                if (typeof(e.hidden) === "boolean")
                    e.hidden = s;
                else if (s)
                    e.setAttribute("hidden", "");
                else
                    e.removeAttribute("hidden");
            },
            toggle: function(e) {
                if (typeof(e.hidden) === "boolean")
                    e.hidden = e.hidden ? false : true;
                else if (e.hasAttribute("hidden"))
                    e.removeAttribute("hidden");
                else
                    e.setAttribute("hidden", "");
            }
        },
        darkMode: {
            is: function() {
                return localStorage.getItem("nekoapp.darkMode") && JSON.parse(localStorage.getItem("nekoapp.darkMode")).enabled && document.documentElement.hasAttribute("dark") ? true : false;
            },
            set: function(s) {
                if (s) {
                    localStorage.setItem("nekoapp.darkMode", JSON.stringify({
                        enabled: true
                    }));
                    document.documentElement.setAttribute("dark", "");
                }
                else {
                    localStorage.setItem("nekoapp.darkMode", JSON.stringify({
                        enabled: false
                    }));
                    document.documentElement.removeAttribute("dark");
                }
            },
            toggle: function() {
                if (!this.is())
                    this.set(true);
                else
                    this.set(false);
            }
        },
        init: function(a) {
            if (a && (a.constructor === n || a.constructor.name === "nekoapp" || a instanceof n)) {
                var A = function() {
                    if (a._CSSLoaded)
                        B();
                    else
                        setTimeout(A, 50);
                },
                    B = function() {
                    if (a.preferences.elements.overlayElement)
                        a.app.after(n.create.object(a, a.preferences.elements.overlayElement, {
                            attr: {
                                hidden: ""
                            }
                        }));

                        C();
                },
                    C = function() {
                    var b = a.app,
                        c = a.loadScreen;
                    
                    if (b && c) {
                        if (c.customLoadScreen)
                            c.appendChild(c.customLoadScreen());
                        else {
                            var _a = n.create.object(a, "div", {
                                class: "loading_status"
                            }),
                                _b = c.spinner ? c.spinner : n.create.spinner(a),
                                _c = n.create.object(a, "div", {
                                class: "loading_message"
                            });
                            
                            if (c.logoGraphic && typeof c.logoGraphic === "object" && c.logoGraphic.graphic && c.logoGraphic.viewBox && typeof c.logoGraphic.viewBox === "string")
                                c.appendChild(n.create.graphic(a, c.logoGraphic.graphic, c.logoGraphic.viewBox));
                            else
                                c.appendChild(n.create.graphic(a, a.defaultLogoGraphic.graphic, a.defaultLogoGraphic.viewBox));
                            
                            if (typeof _b === "object")
                                _a.appendChild(_b);
                            else if (typeof _b === "string")
                                _a.innerHTML = _b;
                            
                            c.appendChild(_a).appendChild(_c);
                        }
                        
                        b.appendChild(c).parentElement.setAttribute("initialization", "");

                        D();
                    }
                },
                    D = function() {
                    for (var i in Object.keys(a.preferences.events))
                        a.preferences.events[Object.keys(a.preferences.events)[i]].register();
                    
                    E();
                },
                    E = function() {
                    n.resources().load(a.ui.graphics, {
                        onload: function() {
                            var b = a.ui.graphics.resourceData.getElementsByTagName(a.preferences.elements.graphicsSetElement.tag),
                                c = n.create.object(a, a.preferences.elements.graphicsLibraryElement.tag);
                            
                            for (var i = b.length - 1; i >= 0; i--)
                                c.insertBefore(b[i], c.children[0]);
                            
                            Object.setPrototypeOf(c, new n.graphicsLibrary(a, "nekoapp.system.init,_nekoapp_authorize_access"));
                            a.ui.graphics = c;
                            
                            F();
                        }
                    })
                },
                    F = function() {
                    var b = {
                        a: [],
                        b: undefined,
                        c: undefined,
                        d: undefined
                    },
                        d = Object.keys(a.modules),
                        e,
                        f = false;
                    
                    for (var i = 2; i < d.length; i++)
                        switch (a.modules[d[i]].moduleType) {
                            case "pageModule":
                                if (typeof a.modules[d[i]] === "object" && (a.modules[d[i]].constructor === n.module || a.modules[d[i]] instanceof n.module) && typeof a.modules[d[i]].moduleURL === "string")
                                    b.a[b.a.length] = a.modules[d[i]];

                                if (a.modules[d[i]].primaryModule && !e)
                                    e = a.modules[d[i]];
                                
                                break;
                            case "headerModule":
                                if (typeof a.modules[d[i]] === "object" && (a.modules[d[i]].constructor === n.header || a.modules[d[i]] instanceof n.header) && a.modules[d[i]].headerLayout && typeof a.modules[d[i]].headerLayout === "object" && a.preferences.elements.headerElement && typeof a.preferences.elements.headerElement === "function" && a.preferences.classes.headerContainer && typeof a.preferences.classes.headerContainer === "string" && !b.b)
                                    b.b = a.modules[d[i]];
                                
                                break;
                            case "guideModule":

                                break;
                            case "footerModule":
                                if (typeof a.modules[d[i]] === "object" && (a.modules[d[i]].constructor === n.footer || a.modules[d[i]]instanceof n.footer) && a.modules[d[i]].constructOnInit && !b.d)
                                    b.d = a.modules[d[i]];

                                    break;
                        }
                        
                    __A.h(a, b.b);
                    
                    for (var i in b.a)
                        if (b.a[i].moduleURL.indexOf("*") > -1 ? b.a[i].moduleURL.split("*")[0] === location.pathname && b.a[i].moduleURL.split("*")[1] === location.hash.split("?")[0] : b.a[i].moduleURL === location.pathname + location.hash.split("?")[0]) {
                            n.modules.change(a, b.a[i], b.a[i].initParams);
                            f = true;
                        }
                    
                    if (!f && e && (e.constructor === n.module || e instanceof n.module))
                        n.modules.change(a, e, e.initParams);
                    
                    if  (b.d)
                        b.d.construct();
                    
                    G();
                },
                    G = function() {
                    var b,
                        c,
                        d = a.locale.languages,
                        e = location.hash.indexOf("locale=") > -1 ? location.hash.split("locale=")[1].split("&")[0] : location.search.indexOf("locale=") > -1 ? location.search.split("locale=")[1].split("&")[0] : undefined;
                    
                    if (e) {
                        for (var i in d)
                            if (d[i].language.toLowerCase().indexOf(e.toLowerCase()) > -1 || e.toLowerCase().indexOf(d[i].language.toLowerCase()) > -1) {
                                b = e;
                                break;
                            }
                    }
                    else if (localStorage.getItem("nekoapp.locale") && JSON.parse(localStorage.getItem("nekoapp.locale")).language)
                        b = JSON.parse(localStorage.getItem("nekoapp.locale")).language;
                    else
                        for (var i in d)
                            if (navigator.language.toLowerCase().indexOf(d[i].language.toLowerCase()) > -1 || d[i].language.toLowerCase().indexOf(navigator.language.toLowerCase()) > -1)
                                b = d[i].language;
                            else if (n.locale._defaultLanguage.indexOf(d[i].language.toLowerCase()) > -1 || d[i].language.toLowerCase().indexOf(n.locale._defaultLanguage) > -1)
                                b = d[i].language;
                        
                    if (!b)
                        b = d[0].language;
                        
                    for (var i in d)
                        if (b.toLowerCase().indexOf(d[i].language.toLowerCase()) > -1 || d[i].language.toLowerCase().indexOf(b.toLowerCase()) > -1) {
                            c = d[i].stringsURL;
                            break;
                        }
                    
                    __C.d(a, b, c, function() {
                        H();
                    });
                },
                    H = function() {
                    for (var i in Object.keys(a.preferences.events))
                        if (a.preferences.events[Object.keys(a.preferences.events)[i]].target === a && a.preferences.events[Object.keys(a.preferences.events)[i]].oninit && typeof a.preferences.events[Object.keys(a.preferences.events)[i]].oninit === "function") {
                            a.preferences.events[Object.keys(a.preferences.events)[i]].oninit();
                            break;
                        }
                    
                    setTimeout(I, 500);
                },
                    I = function() {
                    if (n.system.xhr().readyState !== 4 || document.readyState !== "complete")
                        setTimeout(I, 100);
                    else {
                        var b = a.app,
                            c = a.loadScreen;
                        
                        Object.defineProperty(n.system.navigation.history, n.system.navigation.history.length, {
                            value: new n.navigationEntry({
                                a: a,
                                b: location.hash ? location.pathname + location.hash : location.pathname + location.search,
                                c: a.modules.history[0]
                            }, "nekoapp.system.navigation.navigate,_nekoapp_authorize_access"),
                            enumerable: true
                        });
                        
                        if (a.preferences.elements.progressBarElement && typeof a.preferences.elements.progressBarElement === "function" && a.preferences.classes.progressBarInner)
                            b.insertBefore(n.create.object(a, a.preferences.elements.progressBarElement, {
                                text: n.create.element(a, "div", {
                                    class: a.preferences.classes.progressBarInner
                                })
                            }), c);
                            
                        if (c.fadeEffect) {
                            b.setAttribute("initialization-finished", "");
                            setTimeout(function() {
                                n.system.hiddenStatus.set(c, true);
                                n.system.clear(c);
                                b.removeAttribute("initialization");
                                b.removeAttribute("initialization-finished");
                            }, 1000);
                        }
                        else {
                            n.system.hiddenStatus.set(c, true);
                            n.system.clear(c);
                            b.removeAttribute("initialization");
                        }
                        
                        a._hasInitialized = true;
                    }
                };
                
                A();
            }
        }
    };

    n.prototype.defaultLogoGraphic = {
        graphic: "<path d='M94.35 19.98c-44.62 0-71.67 27.5-71.67 70.52c0 43.53 28.66 70.23 71.67 70.23c43.24 0 71.64-26.69 71.64-70.01C165.99 47.07 137.59 19.98 94.35 19.98z M64.16 113.03c-10.99 0.03-22.01-10.65-22.04-22.14c-0.04-11.38 11.03-22.46 21.96-22.5c10.94-0.03 22.07 11.32 22.1 22.37C86.21 101.8 75.15 112.99 64.16 113.03z M124.86 112.66c-10.99 0-22.1-11.15-22.1-22.19c-0.01-11.05 11.08-22.44 22.01-22.45c10.94-0.01 22.04 11.04 22.05 22.42C146.83 101.94 135.85 112.65 124.86 112.66z M88.98 136.26c2.72 4.22 8.89 3.94 11.61 0' fill='none' stroke-width='3'></path><path d='M47.29 90.6c0.03 9.63 8.72 18.58 17.38 18.55c8.66-0.03 17.38-9.4 17.36-18.66s-8.8-18.77-17.42-18.74C55.98 71.78 47.26 81.06 47.29 90.6M141.64 90.17c0.01 9.63-8.65 18.61-17.31 18.62c-8.66 0.01-17.42-9.34-17.42-18.59s8.74-18.8 17.36-18.8C132.88 71.38 141.63 80.63 141.64 90.17M184.91 92.56c0.15 1.01 3.49 23.32-9.42 47.67l-0.91-21.87c0 0-3.19 20.53-9.43 37.1c0 0-0.98-7.9-3.8-24.6l-3.3 13.42c0 0 0.21-57.3-21.98-84.27c0 0-2.08 5.86-6.4 7.28l-7.26-14.97c0 0-3.28 12.94-11.86 18.11l-3.89-9.22c0 0-4.16 14.96-12.32 21.08c-8.16-6.13-12.32-21.09-12.32-21.09l-3.88 9.22C69.56 65.25 66.28 52.3 66.28 52.3l-7.26 14.97c-4.31-1.42-6.4-7.28-6.4-7.28c-22.2 26.95-22.03 84.26-22.03 84.26l-3.3-13.43c-2.82 16.71-3.81 24.61-3.81 24.61c-6.23-16.59-9.42-37.11-9.42-37.11l-0.91 21.87c-12.9-24.36-9.55-46.66-9.4-47.68l-4.43 12.36C2.1 65.25 16.72 38.18 16.72 38.18c-2.36-16.99 5.96-38.46 5.96-38.46c27.56 7.22 34.48 22.02 34.48 22.02s10.73-7.79 37.18-6.98c26.54 0 37.22 7 37.22 7s6.92-14.8 34.49-22c0 0 8.32 21.47 5.94 38.46c0 0 14.61 27.07 17.35 66.7L184.91 92.56z'></path>",
        viewBox: "0 0 190 165"
    };
    n.prototype.spinnerTemplate = n.create.template(function() {
        var e = {
            a: document.createElement("div"),
            b: document.createElement("div")
        },
            s = ["top","top_right","right","bottom_right","bottom","bottom_left","left","top_left"];
        
        for (var i in s) {
            var p = document.createElement("div");
            p.className = "spinner_slice " + s[i];
            e.b.appendChild(p);
        }
        
        e.a.className = "spinner_container";
        e.b.className = "spinner_rotator";
        
        return [e.a.appendChild(e.b).parentElement];
    });
    n.prototype.commentAnchors = {
        styles: document.createComment(" Application styles goes here "),
        scripts: document.createComment(" Application scripts goes here ")
    };

    document.querySelector("head").appendChild(n.prototype.commentAnchors.styles);
    document.querySelector("head").appendChild(n.prototype.commentAnchors.scripts);

    if(localStorage.getItem("nekoapp.darkMode") && JSON.parse(localStorage.getItem("nekoapp.darkMode")).enabled)
        document.documentElement.setAttribute("dark", "");

    addEventListener("popstate", n.system.navigation.onpopstate);
} )(nekoapp);