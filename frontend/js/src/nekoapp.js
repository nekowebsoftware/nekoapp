//--------------------------------------------------------------------------
//  Copyright (c) 2018 Neko
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

var nekoapp = function() {
    "use strict";
    
    this.app = undefined;
    this.info = {
        nekoappId: undefined,
        title: undefined,
        version: undefined,
        url: undefined
    };
    this.preferences = {
        modules: [],
        windows: [],
        styles: {},
        classes: {},
        elements: {},
        prototypes: {},
        templates: {},
        events: {}
    };
    this.locale = {
        languages: [],
        strings: {},
        active: undefined
    };
    this.modules = {
        current: undefined,
        history: []
    };
    this.windows = {};
    this.ui = {
        graphics: undefined,
        animations: undefined
    };
    this.loadScreen = {
        logoGraphic: undefined,
        spinnerGraphic: undefined,
        fadeEffect: true,
        customLoadScreen: undefined
    };
    
    this._hasInitialized=false;
};

nekoapp.prototype.moduleElement = {
    moduleCreated: false,
    moduleContents: undefined,
    moduleData: {},
    moduleType: undefined,
    onModuleChange: null,
    construct: function() {
        "use strict";
        
        var a = this.instance.app,
            b = this.moduleContents();
            
        if (b[1].length)
            for(var i = 0; i < b[1].length; i++)
                a.insertBefore(this, a.children[a.children.length-1]).appendChild(b[1][i]);
        else
            a.insertBefore(this, a.children[a.children.length-1]).appendChild(b[1]);
        
        if (b[2].length)
            for(i = 0; i < b[2].length; i++)
                b[2][i].target.addEventListener(b[2][i].event, b[2][i].function);
            
        this.moduleContents=b[0];
        this.moduleCreated=true;
    }
};

nekoapp.prototype.stringElement = {
    localeString: undefined
};

nekoapp.prototype.graphicsLibraryElement = {
    get: function(g) {
        "use strict";
        
        var a = g.split("-")[0],
            b = g.split("-")[1];
        
        return this.children[a].getElementsByTagName("g")[b];
    }
};

nekoapp.prototype.animationElement = {
    animationName: undefined,
    animationRunning: false,
    animationProcess: undefined,
    animationStart: function() {
        "use strict";
        
        var a = this.children[0],
            b = a.instance.ui.animations[a.animationName],
            c = [],
            d = 0,
            e = Object.keys(b.animationFrames),
            f = 0;
        
        if (a.animationRunning)
            a.animationStop();
        
        nekoapp.system.clear(a);
        a.animationRunning=true;
        
        if (b.animationSprites && typeof(b.animationSprites) === "number")
            for (var i = 0; i < b.animationSprites; i++) {
                c[c.length] = nekoapp.create.object(a.instance.preferences.elements.animationSpriteElement);
                if (b.animationSpriteNames && b.animationSpriteNames[i])
                    c[i].className = b.animationSpriteNames[i];
                a.appendChild(c[i]);
            }
        else if (b.animationTargets)
            for (var i = 0; i < b.animationTargets.length; i++) {
                if (b.animationTargets[i] === "self")
                    c[c.length] = this;
                else if (b.animationTargets[i].indexOf("child") > -1)
                    c[c.length] = this.children[parseInt(b.animationTargets[i].split("child")[1]) + 1];
                else
                    c[c.length] = document.querySelector(b.animationTargets[i]);
            }
            
        a.animationProcess = setInterval(function() {
            if (d === 1)
                a.className = a.instance.preferences.classes.animating;
            if (d < parseInt(e[f+1]))
                nekoapp.system.animateFrame(a, c, d, f);
            else
                f++;
            
            if (d > b.animationDuration)
                a.animationStop();
            d++;
        }, 1);
    },
    animationStop: function() {
        "use strict";
        
        clearInterval(this.animationProcess);
        this.animationRunning = false;
        this.removeAttribute("class");
    }
};

nekoapp.prototype.spinnerTemplate = document.createElement("template");

(function() {
    "use strict";
    
    var e = {
        a: document.createElement("div"),
        b: document.createElement("div")
    },
        s = ["top", "top_right", "right", "bottom_right", "bottom", "bottom_left", "left", "top_left"];
        
    for (var i in s) {
        var p = document.createElement("div");
        
        p.className = "spinner_slice " + s[i];
        e.b.appendChild(p);
    }
    
    e.a.className = "spinner_container";
    e.b.className = "spinner_rotator";
    
    nekoapp.prototype.spinnerTemplate.content.appendChild(e.a).appendChild(e.b);
})();

nekoapp.prototype.spinnerElement = {
    template: nekoapp.prototype.spinnerTemplate
};

nekoapp.prototype.errors = {
    webcomps: "Couldn't initialize application because Web Components isn't supported by this browser, baka",
    noplayer: "Neko Web Player isn't initialized on here! You can't use it!"
};

nekoapp.prototype.defaultResourcesRefs = {
    graphics: "nekoapp_graphicslibraryresource",
    animations: "nekoapp_animationslibraryresource"
};

nekoapp.prototype.__nekoapp_version="0.1.2 (Alpha)";
nekoapp.prototype.__nekoapp_developer="S.V.G";
nekoapp.prototype.__nekoapp_copyright="Copyright S.V.G, 2018-2019";

Object.freeze(nekoapp.prototype);

nekoapp.create = {
    object: function(t, p) {
        "use strict";
        
        var o;
        
        if (typeof(t) === "function")
            o = new t;
        else if (t)
            o = document.createElement(t);
        
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
            if (p.text)
                o.innerHTML = p.text;
        }
        
        if (o.template) {
            var a = document.importNode(o.template.content,true);
            
            o.appendChild(a);
        }
        
        if (o)
            return o;
    },
    element: function(t, p) {
        "use strict";
        
        var o;
        
        if (typeof(t) === "string")
            o = this.object(t,p);
        if (o)
            return o;
    },
    string: function(a, l) {
        "use strict";
        
        if (a && a.preferences.elements.stringElement) {
            var o = this.object(a.preferences.elements.stringElement);
            
            o.localeString=l;
            
            return o;
        }
    },
    link: function(u, x, f, l, t) {
        "use strict";
        
        var o = this.object("a", {
            attr: {
                href: u
            },
            text: x
        });
        
        o.addEventListener("click", function(e) {
            if (!l)
                e.preventDefault();
            if (f)
                f();
            }
        );
        
        if (t && l)
            o.target = t;
        if (u)
            return o;
    },
    frame: function(u, p) {
        "use strict";
        
        var o = this.object("iframe", p);
        
        if (u)
            o.src = u;

        o.frameBorder = 0;
        o.setAttribute("allowtransparency", "true");
        
        return o;
    },
    svg: function(v) {
        "use strict";
        
        var o = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        
        o.style = "pointer-events:none;display:block;width:100%;height:100%;";
        o.setAttribute("viewBox", v);
        
        return o;
    },
    graphic: function(a, g, v, p) {
        "use strict";
        
        if (a && a.preferences.elements.graphicElement) {
            var o = this.object(a.preferences.elements.graphicElement, p),
                s = this.svg(v);
            
            o.setAttribute("preserved-graphic", g);
            o.appendChild(s);
            
            return o;
        }
    },
    animation: function(a, n, t) {
        "use strict";
        
        if (a && a.preferences.elements.animationElement) {
            var o = this.object(a.preferences.elements.animationElement);
            o.animationName = n;
            t.insertBefore(o, t.children[0]);
            t.addEventListener("mousedown", o.animationStart);
        }
    },
    button: function(a, t, f, c, p) {
        "use strict";
        
        if (a && a.preferences.elements.UIButtonElement) {
            var o = this.object(a.preferences.elements.UIButtonElement, p);
            
            switch (t) {
                case "default":
                    var d = this.object(a.preferences.elements.UIButtonInner);

                    if (c.length)
                        for (var i = 0; i < c.length; i++)
                            d.appendChild(c[i]);
                        else
                            d.appendChild(c);
                        
                    o.classList.add(a.preferences.classes.UIDefaultButton);
                    o.appendChild(d);
                    break;
                case "circle":
                    o.classList.add(a.preferences.classes.UICircleButton);
                    o.appendChild(c);
                    this.animation(a, "UICircleButtonAnimation", o);
                    break;
            }
            
            o.addEventListener("click", f);
            
            return o;
        }
    },
    spinner: function(a, p) {
        "use strict";
        
        if(a.preferences.elements.spinnerElement)
            return this.object(a.preferences.elements.spinnerElement,p);
    },
    template: function(t) {
        "use strict";
        
        var o = this.object("template");
        
        if (typeof(t) === "function")
            o.content.appendChild(t());
        if (typeof(t) === "function")
            return o;
    },
    module: function(a, m) {
        "use strict";
        
        if (a && a.preferences.elements.moduleElement) {
            var b = {};
            
            if (typeof(m) === "string") {
                var d = a.preferences.modules;
                
                for (var i in d)
                    if (d[i].moduleName === m) {
                        b = Object.assign({}, d[i]);
                        break;
                    }
            }
            else if (typeof(m) === "object")
                b = Object.assign({}, m);
                
                var c = nekoapp.create.object(a.preferences.elements.moduleElement, {
                    id: b.moduleID
                });
                
                delete(b.moduleName);
                delete(b.moduleID);
                delete(b.moduleURL);
                delete(b.construct);
                Object.assign(c, b);
                return c;
        }
    }
};

nekoapp.locale = {
    addLanguage: function(a, l, u) {
        "use strict";
        
        var b = {
            langName: l,
            stringsURL: u
        },
            c = a.locale.languages;
        
        c[c.length] = b;
    },
    updateLocale: function(a) {
        "use strict";
        
        var b = a.app.getElementsByTagName(a.preferences.elements.stringElement.prototype.tag);
        
        for (var i in b)
            b[i].innerHTML = a.locale.strings[b[i].localeString];
    }
};

nekoapp.modules = {
    add: function(a, m) {
        "use strict";
        
        var b = a.preferences.modules;
        
        if (m && m.moduleName && m.moduleID && m.moduleURL && m.moduleContents && m.moduleType)
            b[b.length] = m;
    },
    addHistoryEntry: function(a, m, p) {
        "use strict";
        
        var h = a.modules.history;
        
        h[h.length] = {
            moduleName: m,
            moduleParams: p
        };
    },
    setInitParams: function(a, m, p) {
        "use strict";
        
        if (!a._hasInitialized) {
            var b = a.preferences.modules;
            for (var i in b)
                if (b[i].moduleName === m) {
                    b[i].initParams = p;
                    break;
                }
        }
    },
    change: function(a, m, p) {
        "use strict";
        
        if (a && m) {
            var n, t;
            
            if (typeof(m) === "object") {
                t = a.modules[m.moduleName];
                n = m.moduleName;
            }
            else {
                t = a.modules[m];
                n = m;
            }
            
            if (t.moduleType === "pageModule") {
                var r = nekoapp.system.xhr.requests;
                
                if (a._hasInitialized)
                    this.changeCalled = true;

                this.changeParams.app = a;
                this.changeParams.moduleName = n;
                this.changeParams.moduleParams = p;
                this.changeParams.requestsCount = r.length;
                
                if (!t.moduleCreated)
                    t.construct();
                
                if (t.onModuleChange && typeof(t.onModuleChange) === "function")
                    t.onModuleChange(p);
                
                if (!this.changeCalled || this.changeParams.requestsCount===r.length)
                    this.changeApply();
            }
        }
    },
    changeCalled: false,
    changeParams: {
        app: undefined,
        moduleName: undefined,
        moduleParams: undefined,
        requestsCount: undefined
    },
    changeApply: function() {
        "use strict";
        
        var p = this.changeParams,
            d = p.app.preferences.modules,
            m = p.app.modules,
            i = p.app.app;
        
        this.changeCalled = false;

        this.addHistoryEntry(p.app, p.moduleName, p.moduleParams);
        
        m.current = p.moduleName;
        i.setAttribute("current-module", p.moduleName);
        if (nekoapp.system.hiddenStatus.is(m[p.moduleName]))
            nekoapp.system.hiddenStatus.set(m[p.moduleName], false);
        for (var i in d)
            if (d[i].moduleName !== p.moduleName && !nekoapp.system.hiddenStatus.is(m[d[i].moduleName]))
                nekoapp.system.hiddenStatus.set(m[d[i].moduleName], true);
        for (var i in Object.keys(p))
            p[Object.keys(p)[i]] = undefined;
    },
    stateChanged: function(s) {
        "use strict";
        
        if (this.changeCalled) {
            var p = this.changeParams,
                c = p.app.preferences.classes,
                m = p.app.modules,
                i = p.app.app;
            
            if (s === 2)
                i.classList.add(c.processing);
            else if (s === 3) {
                i.classList.remove(c.processing);
                i.classList.add(c.loading);
                if (m.current !== p.moduleName) {
                    m.current = "";
                    i.setAttribute("current-module","");
                }
            }
            else if (s === 4) {
                i.classList.remove(c.loading);
                this.changeApply();
            }
            else if (s === 0)
                this.changeApply();
        }
    }
};

nekoapp.system = {
    CSS: {
        add: function(u) {
            "use strict";
            
            var a = document.querySelectorAll("link[rel=stylesheet]"),
                b = document.querySelector("head"),
                c = document.querySelector("script"),
                d = nekoapp.create.element("link", {
                    attr: {
                        rel: "stylesheet",
                        href: u,
                        type: "text/css"
                    }
                });
            
            if (a.length)
                a[a.length-1].insertAdjacentElement("afterend", d);
            else
                b.insertBefore(d, c);
            
            return d;
        }
    },
    scripts: {
        add: function(u) {
            "use strict";
            
            var a = document.querySelector("head"),
                b = document.querySelector("script"),
                c = nekoapp.create.element("script", {
                    attr: {
                        href: u,
                        type: "text/javascript"
                    }
                });
            
            a.insertBefore(c, b);
            
            return c;
        }
    },
    navigate: function(u, a) {
        "use strict";
        
        var b = {};
        
        if (a)
            b = {
                modulesHistory: a.modules.history
            };
            
        history.pushState(b, "", u);
    },
    regElement: function(t, p) {
        "use strict";
        
        var a;
        
        if (document.registerElement) {
            a = document.registerElement(t);
            
            Object.assign(a.prototype, p);
        }
        else if (customElements && Reflect) {
            var HTMLNekoAppElement = function() {
                return Reflect.construct(HTMLElement, [], HTMLNekoAppElement);
            };
            
            Object.setPrototypeOf(HTMLNekoAppElement.prototype, HTMLElement.prototype);
            Object.setPrototypeOf(HTMLNekoAppElement, HTMLElement);
            
            customElements.define(t, HTMLNekoAppElement);
            
            a = HTMLNekoAppElement;
            Object.assign(a.prototype, p);
        }
        
        return a;
    },
    clear: function(e) {
        "use strict";
        
        for (var i = e.children.length; i > 0; i--)
            e.removeChild(e.children[e.children.length-1]);
    },
    hiddenStatus: {
        is: function(e) {
            "use strict";
            
            if (typeof(e.hidden) === "boolean")
                return e.hidden;
            else
                return e.hasAttribute("hidden");
        },
        set: function(e, s) {
            "use strict";
            
            if (typeof(e.hidden) === "boolean")
                e.hidden = s;
            else if (s)
                e.setAttribute("hidden", "");
            else
                e.removeAttribute("hidden");
        },
        toggle: function(e) {
            "use strict";
            
            if (typeof(e.hidden) === "boolean")
                e.hidden = e.hidden ? false : true;
            else if (e.hasAttribute("hidden"))
                e.removeAttribute("hidden");
            else
                e.setAttribute("hidden", "");
            }
    },
    renderGraphic: function(a, o) {
        "use strict";
        
        var b = o.getAttribute("preserved-graphic"),
            c = a.ui.graphics.get(b),
            d = document.importNode(c,true);
            
        o.children[0].appendChild(d).removeAttribute("id");
        o.removeAttribute("preserved-graphic");
    },
    renderGraphics: function(a) {
        "use strict";
        
        var b = a.app.getElementsByTagName(a.preferences.elements.graphicElement.prototype.tag);
        
        for (var i = 0; i < b.length; i++)
            if (b[i].getAttribute("preserved-graphic"))
                this.renderGraphic(a, b[i]);
    },
    animateFrame: function(a, t, f, p) {
        "use strict";
        
        var b = a.instance.ui.animations[a.animationName].animationFrames,
            c = Object.keys(b),
            d = Object.keys(b[c[p]]);
            
        for (var i in d) {
            var e = Object.keys(b[c[p]][d[i]]);
            for (var j in e) {
                if (b[c[p+1]][d[i]][e[j]] !== undefined)
                    switch (e[j]) {
                        case "top" || "bottom":
                            var g = a.getBoundingClientRect().height,
                                h;
                        
                            if (parseFloat(b[c[p]][d[i]][e[j]]) < parseFloat(b[c[p + 1]][d[i]][e[j]])) {
                                if (typeof(b[c[p + 1]][d[i]][e[j]]) === "string" && b[c[p + 1]][d[i]][e[j]].indexOf("%") > -1)
                                    h = g * parseFloat(b[c[p + 1]][d[i]][e[j]]) / 100;
                                else
                                    h = parseFloat(b[c[p + 1]][d[i]][e[j]]);
                            
                                t[i].style.setProperty(e[j], (f * h / parseInt(c[p + 1])) + "px");
                            }
                            else {
                                if (typeof(b[c[p]][d[i]][e[j]]) === "string" && b[c[p]][d[i]][e[j]].indexOf("%") > -1)
                                    h = g * parseFloat(b[c[p]][d[i]][e[j]]) / 100;
                                else
                                    h = parseFloat(b[c[p]][d[i]][e[j]]);
                            
                                t[i].style.setProperty(e[j], (h - (f * h / parseInt(c[p + 1]))) + "px");
                            }

                            break;
                        case "left" || "right":
                            var g = a.getBoundingClientRect().width,
                                h;
                        
                            if (parseFloat(b[c[p]][d[i]][e[j]]) < parseFloat(b[c[p + 1]][d[i]][e[j]])) {
                                if (typeof(b[c[p + 1]][d[i]][e[j]]) === "string" && b[c[p + 1]][d[i]][e[j]].indexOf("%") > -1)
                                    h = g * parseFloat(b[c[p + 1]][d[i]][e[j]]) / 100;
                                else
                                    h = parseFloat(b[c[p + 1]][d[i]][e[j]]);
                            
                                t[i].style.setProperty(e[j], (f * h / parseInt(c[p + 1])) + "px");
                            }
                            else {
                                if (typeof(b[c[p]][d[i]][e[j]]) ==="string" && b[c[p]][d[i]][e[j]].indexOf("%") > -1)
                                    h = g * parseFloat(b[c[p]][d[i]][e[j]]) / 100;
                                else
                                    h = parseFloat(b[c[p]][d[i]][e[j]]);
                            
                                t[i].style.setProperty(e[j], (h - (f * h / parseInt(c[p + 1]))) + "px");
                            }
                        
                            break;
                        case "width":
                            var g = a.getBoundingClientRect().width,
                                h;
                        
                            if (parseFloat(b[c[p]][d[i]][e[j]]) < parseFloat(b[c[p + 1]][d[i]][e[j]])) {
                                if (typeof(b[c[p + 1]][d[i]][e[j]]) === "string" && b[c[p + 1]][d[i]][e[j]].indexOf("%") > -1)
                                    h = g * parseFloat(b[c[p+1]][d[i]][e[j]]) / 100;
                                else
                                    h = parseFloat(b[c[p + 1]][d[i]][e[j]]);
                            
                                t[i].style.setProperty(e[j], (f * h / parseInt(c[p + 1])) + "px");
                            }
                            else {
                                if (typeof(b[c[p]][d[i]][e[j]]) === "string" && b[c[p]][d[i]][e[j]].indexOf("%") > -1)
                                    h = g * parseFloat(b[c[p]][d[i]][e[j]]) / 100;
                                else
                                    h = parseFloat(b[c[p]][d[i]][e[j]]);
                            
                                t[i].style.setProperty(e[j], (h - (f * h / parseInt(c[p + 1]))) + "px");
                            }
                        
                            break;
                        case "height":
                            var g = a.getBoundingClientRect().height,
                                h;
                        
                            if (parseFloat(b[c[p]][d[i]][e[j]]) < parseFloat(b[c[p + 1]][d[i]][e[j]])) {
                                if (typeof(b[c[p + 1]][d[i]][e[j]]) === "string" && b[c[p + 1]][d[i]][e[j]].indexOf("%") > -1)
                                    h = g * parseFloat(b[c[p + 1]][d[i]][e[j]]) / 100;
                                else
                                    h = parseFloat(b[c[p + 1]][d[i]][e[j]]);
                            
                                t[i].style.setProperty(e[j], (f * h / parseInt(c[p + 1])) + "px");
                            }
                            else {
                                if (typeof(b[c[p]][d[i]][e[j]]) === "string" && b[c[p]][d[i]][e[j]].indexOf("%") > -1)
                                    h = g * parseFloat(b[c[p]][d[i]][e[j]]) / 100;
                                else
                                    h = parseFloat(b[c[p]][d[i]][e[j]]);
                                
                                t[i].style.setProperty(e[j], (h - (f * h / parseInt(c[p + 1]))) + "px");
                            }
                        
                            break;
                        case "opacity":
                            var h;
                        
                            if (parseFloat(b[c[p]][d[i]][e[j]]) < parseFloat(b[c[p + 1]][d[i]][e[j]])) {
                                if (typeof(b[c[p + 1]][d[i]][e[j]]) === "string" && b[c[p + 1]][d[i]][e[j]].indexOf("%") > -1)
                                    h = parseFloat(b[c[p + 1]][d[i]][e[j]]) / 100;
                                else
                                    h = parseFloat(b[c[p + 1]][d[i]][e[j]]);
                            
                                t[i].style.setProperty(e[j], f * h / parseInt(c[p + 1]));
                            }
                            else {
                                if (typeof(b[c[p]][d[i]][e[j]]) === "string" && b[c[p]][d[i]][e[j]].indexOf("%") > -1)
                                    h = parseFloat(b[c[p]][d[i]][e[j]]) / 100;
                                else
                                    h = parseFloat(b[c[p]][d[i]][e[j]]);
                            
                                t[i].style.setProperty(e[j], h - (f * h / parseInt(c[p + 1])));
                            }
                        
                            break;
                    }
            }
        }
    }
};

nekoapp.system.xhr = XMLHttpRequest;
nekoapp.system.xhr.requests = [];
nekoapp.system.xhr.readyState = 0;
nekoapp.system.xhr.load = function(u) {
    "use strict";
    
    var r = this.requests[this.requests.length] = new this;
    
    r.onreadystatechange = this.onReadyStateChange;
    r.open("GET", u);
    r.send();
    return r;
};
nekoapp.system.xhr.onReadyStateChange = function() {
    "use strict";
    
    var m = 4,
        r = nekoapp.system.xhr;
    
    for (var i in r.requests)
        if (r.requests[i].readyState < m)
            m = r.requests[i].readyState;
    r.readyState = m;
    nekoapp.modules.stateChanged(r.readyState);
};

nekoapp.system.imagePreload = function(u) {
    "use strict";
    
    var a = this.imagePreload.images,
        i = a[a.length] = new Image;
        i.src = u;
};
nekoapp.system.imagePreload.images = [];

nekoapp.resources = {
    data: [],
    add: function(a, n, s, r, t) {
        "use strict";
        
        var b = {},
            c = this.data,
            d = s.split(".")[s.split(".").length-1];
        
        if (n)
            b.resourceName = n;
        else
            b = undefined;
        
        if (s && b)
            b.resourceSource = s;
        else
            b = undefined;
        
        if (r && b)
            b.resourceReference = r;
        else
            b = undefined;
        
        if (b) {
            b.application = a;
            b.mimeType = this.types[d];
            b.status = "";
        }
        
        if (t && b)
            b.dataContainer = t;
        
        if (b)
            c[c.length] = b;
    },
    load: function(a, r) {
        "use strict";
        
        var b;
        
        if (typeof(r) === "object")
            b = r.resourceSource;
        else if (typeof(r) === "string") {
            var c = this.getAppResources(a);
            
            for (var i in c)
                if (c[i].resourceName === r) {
                    b = c[i].resourceSource;
                    break;
                }
        }
        
        if (b) {
            var c = nekoapp.system.xhr.load(b),
                d = this;
            
            c.onreadystatechange = function() {
                d.updateStatus(r, this.readyState);
            };
            c.onerror = function() {
                r.status = "ERROR";
            };
            c.onload = function() {
                if (this.readyState === 4 && this.status === 200) {
                    switch (r.mimeType) {
                        case "text/html":
                            var e = new DOMParser;
                            var f = e.parseFromString(this.responseText, "text/html");
                            
                            if (r.resourceReference === a.defaultResourcesRefs.graphics && a.preferences.elements.graphicsLibraryElement && a.preferences.elements.graphicsSetElement) {
                                var g;
                                
                                a.ui.graphics = nekoapp.create.object(a.preferences.elements.graphicsLibraryElement);

                                g = f.getElementsByTagName(a.preferences.elements.graphicsSetElement.prototype.tag);
                                for (var i = g.length - 1; i >= 0; i--)
                                    a.ui.graphics.insertBefore(g[i],a.ui.graphics.children[0]);
                            }
                            else
                                r.dataContainer = f;
                            
                            break;
                        case "application/json":
                            if (r.resourceReference === a.defaultResourcesRefs.animations)
                                a.ui.animations = JSON.parse(this.responseText);
                            else
                                r.dataContainer = JSON.parse(this.responseText);
                            
                            break;
                    }
                }
            };
        }
    },
    getAppResources: function(a) {
        "use strict";
        
        var b = [],
            c = this.data;
        
        for (var i in c)
            if (c[i].application === a)
                b[b.length] = c[i];
        
        return b;
    },
    updateStatus: function(r, s) {
        "use strict";
        
        switch (s) {
            case 2:
                r.status = "RECEIVING";
                break;
            case 3:
                r.status = "LOADING";
                break;
            case 4:
                r.status = "LOADED";
                break;
        }
    },
    types: {
        "html": "text/html",
        "json": "application/json",
        "xml": "application/xml"
    }
};

nekoapp.utils = {
    player: function() {
        "use strict";
        
        if (window.nekoplayer)
            return new nekoplayer;
        else
            this.error = nekoapp.prototype.errors.noplayer;
    }
};

nekoapp.init = function(a) {
    "use strict";
    
    var A = function() {
        var b = {
            a: false,
            b: [false, false, false],
            c: function() {
                for (var i = 0; i < b.b.length; i++)
                    if (!b.b[i]) {
                        b.a = false;
                        break;
                    }
                    else
                        b.a=true;
            },
            d: function() {
                if (b.a) {
                    clearInterval(b.e);
                    B();
                }
            },
            e: undefined
        },
            c = {
            a: nekoapp.system.CSS,
            b: a.preferences.styles
        };

        if (c.b.default) {
            var _a = c.a.add(c.b.default);
            
            _a.addEventListener("load", function() {
                b.b[0] = true;
                b.c();
            });
        }
        
        if (c.b.colors) {
            var _b = c.a.add(c.b.colors);
            
            _b.addEventListener("load", function() {
                b.b[1] = true;
                b.c();
            });
        }
        
        if (c.b.ui) {
            var _c = c.a.add(c.b.ui);
            
            _c.addEventListener("load", function() {
                b.b[2] = true;
                b.c();
            });
        }
        
        b.e = setInterval(b.d,10);
    },
        B = function() {
        var b = a.preferences.elements,
            c = Object.keys(b);
        
        for (var i = 0; i <= c.length; i++)
            if (i === c.length)
                C();
            else {
                var d = {
                    tag: b[c[i]],
                    instance: a
                };
            
                if (a.preferences.prototypes[c[i]])
                    Object.assign(d, a.preferences.prototypes[c[i]]);
                if (a[c[i]])
                    Object.assign(d, a[c[i]]);
                
                b[c[i]] = nekoapp.system.regElement(b[c[i]], d);
            }
        },
        C = function() {
        var b = a.app;
        
        if (b) {
            var c = a.loadScreen.customLoadScreen,
                d = nekoapp.create.object(a.preferences.elements.loadScreenElement),
                e = a.preferences.classes;
            
            if (typeof(c) === "function")
                d.appendChild(c());
            b.appendChild(d);
            b.classList.add(e.initialization);
            K=d;
        }
        D();
    },
        D = function() {
        var b = a.preferences.modules;
        
        for (var i = 0; i <= b.length; i++)
            if (i === b.length)
                E();
            else
                a.modules[b[i].moduleName] = nekoapp.create.module(a, b[i]);
    },
        E = function() {
        F();
    },
        F = function() {
        G();
    },
        G = function() {
        var b = {
            a: false,
            b: function() {
                if (b.a) {
                    clearInterval(b.d);
                    H();
                }
                else
                    b.c();
            },
            c: function() {
                for (var i in c)
                    if (c[i].status !== "LOADED") {
                        b.a = false;
                        break;
                    }
                    else
                        b.a=true;
            },
            d: undefined
        },
            c = nekoapp.resources.getAppResources(a);
        
        for (var i in c)
            nekoapp.resources.load(a, c[i]);
        
        b.d = setInterval(b.b, 10);
    },
        H = function() {
        var b = {
            a: a.preferences.modules,
            b: [],
            c: function() {
                for (var i in b.a)
                    if (b.a[i].moduleURL)
                        b.b[b.b.length] = {
                            moduleName: b.a[i].moduleName,
                            moduleURL: b.a[i].moduleURL,
                            initParams: b.a[i].initParams
                        }
            }
        },
            c = {
                a: location.pathname,
                b: function(a) {
                    if (a.indexOf("*") > -1)
                        if (c.a.indexOf(a.split("*")[0]) === 0)
                            return true;
                        else if (c.a.indexOf(a) === 0)
                            return true;
                }
        };
                
        b.c();
        
        for (var i in b.b)
            if (c.b(b.b[i].moduleURL)) {
                nekoapp.modules.change(a, b.b[i].moduleName, b.b[i].initParams);
                break;
            }

        I();
    },
        I = function() {
        var b = document.querySelectorAll("link[rel=preload]");
        
        for (var i = 0; i < b.length; i++)
            if (b[i].href.indexOf("nekoapp.js") > -1)
                b[i].parentElement.removeChild(b[i]);
            else if (b[i].title === "main-app-script")
                b[i].parentElement.removeChild(b[i]);
        
        if (document.readyState === "complete")
            J();
        else
            addEventListener("load",J);
    },
        J = function() {
        var b = a.app,
            c = a.loadScreen,
            d = K,
            e = a.preferences.classes,
            f = nekoapp.system.hiddenStatus;
        
        if (b) {
            if (c.fadeEffect) {
                b.classList.add(e.initializationFinished);
                setTimeout(function() {
                    f.set(d,true);
                    b.classList.remove(e.initialization);
                    b.classList.remove(e.initializationFinished);
                }, 1000);
            }
            else {
                f.set(d, true);
                b.classList.remove(e.initialization);
            }
        }
        
        a._hasInitialized = true;
    },
        K;
    
    A();
};