"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
exports.__esModule = true;
var react_import_1 = require("react-import");
var utils_1 = require("./utils");
var customHistory = null;
exports.customHistory = customHistory;
var ROUTERS = [];
var subscribers = [];
exports.subscribers = subscribers;
var beforeEach = null;
var EMPTY = {};
function isPreactElement(node) {
    return node.__preactattr_ != null || typeof Symbol !== "undefined" && node[Symbol["for"]("preactattr")] != null;
}
function setUrl(url, type) {
    if (type === void 0) { type = "push"; }
    if (customHistory && customHistory[type]) {
        customHistory[type](url);
    }
    else if (typeof history !== "undefined" && history[type + "State"]) {
        history[type + "State"](null, null, url);
    }
}
function getCurrentUrl() {
    var url;
    if (customHistory && customHistory.location) {
        url = customHistory.location;
    }
    else if (customHistory && customHistory.getCurrentLocation) {
        url = customHistory.getCurrentLocation();
    }
    else {
        url = typeof location !== "undefined" ? location : EMPTY;
    }
    return "" + (url.pathname || "") + (url.search || "");
}
exports.getCurrentUrl = getCurrentUrl;
function _route(url, replace) {
    if (typeof url !== "string" && url.url) {
        replace = url.replace;
        url = url.url;
    }
    // only push URL into history if we can handle it
    if (canRoute(url)) {
        setUrl(url, replace ? "replace" : "push");
    }
    return routeTo(url);
}
function route(url, replace) {
    if (replace === void 0) { replace = false; }
    return new Promise(function _(resolve) {
        var next = function (newUrl, newReplace) {
            var temp;
            if (newUrl) {
                temp = _route(newUrl, newReplace);
            }
            else {
                temp = _route(url, replace);
            }
            resolve(temp);
            return temp;
        };
        if (beforeEach) {
            beforeEach(url, getCurrentUrl(), next);
        }
        else {
            next();
        }
    });
}
exports.route = route;
/** Check if the given URL can be handled by any router instances. */
function canRoute(url) {
    for (var i = ROUTERS.length; i--;) {
        if (ROUTERS[i].canRoute(url)) {
            return true;
        }
    }
    return false;
}
/** Tell all router instances to handle the given URL.  */
function routeTo(url) {
    var didRoute = false;
    for (var _i = 0, ROUTERS_1 = ROUTERS; _i < ROUTERS_1.length; _i++) {
        var router = ROUTERS_1[_i];
        if (router.routeTo(url) === true) {
            didRoute = true;
        }
    }
    for (var i = subscribers.length; i--;) {
        subscribers[i](url);
    }
    return didRoute;
}
function routeFromLink(node) {
    // only valid elements
    if (!node || !node.getAttribute) {
        return;
    }
    var href = node.getAttribute("href");
    var target = node.getAttribute("target");
    // ignore links with targets and non-path URLs
    if (!href || !href.match(/^\//g) || (target && !target.match(/^_?self$/i))) {
        return;
    }
    // attempt to route, if no match simply cede control to browser
    return route(href);
}
function handleLinkClick(e) {
    if (e.button === 0) {
        routeFromLink(e.currentTarget || e.target || this);
        return prevent(e);
    }
}
function prevent(e) {
    if (e) {
        if (e.stopImmediatePropagation) {
            e.stopImmediatePropagation();
        }
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        e.preventDefault();
    }
    return false;
}
function delegateLinkHandler(e) {
    return __awaiter(this, void 0, void 0, function () {
        var t, temp;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // ignore events the browser takes care of already:
                    if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || e.button !== 0) {
                        return [2 /*return*/];
                    }
                    t = e.target;
                    _a.label = 1;
                case 1:
                    if (!(String(t.nodeName).toUpperCase() === "A" && t.getAttribute("href") && isPreactElement(t))) return [3 /*break*/, 3];
                    if (t.hasAttribute("native")) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, routeFromLink(t)];
                case 2:
                    temp = _a.sent();
                    if (temp) {
                        return [2 /*return*/, prevent(e)];
                    }
                    _a.label = 3;
                case 3:
                    t = t.parentNode;
                    _a.label = 4;
                case 4:
                    if (t) return [3 /*break*/, 1];
                    _a.label = 5;
                case 5: return [2 /*return*/];
            }
        });
    });
}
var eventListenersInitialized = false;
function initEventListeners() {
    if (eventListenersInitialized) {
        return;
    }
    if (typeof addEventListener === "function") {
        if (!customHistory) {
            addEventListener("popstate", function () {
                routeTo(getCurrentUrl());
            });
        }
        addEventListener("click", delegateLinkHandler);
    }
    eventListenersInitialized = true;
}
var Link = function (props) { return (react_import_1.h("a", utils_1.assign({ onClick: handleLinkClick }, props))); };
exports.Link = Link;
function Route(props) {
    var component = props.component, filterProps = __rest(props, ["component"]);
    return react_import_1.h(props.component, filterProps);
}
exports.Route = Route;
var Router = /** @class */ (function (_super) {
    __extends(Router, _super);
    // public static getDerivedStateFromProps?(nextProps: any, previousState: any): null {
    //     const self = previousState.self;
    //     self.updating = true;
    //     return null;
    // }
    function Router(props) {
        var _this = _super.call(this, props) || this;
        if (props.history) {
            exports.customHistory = customHistory = props.history;
        }
        _this.initRoute = true;
        _this.state = {
            url: props.url || getCurrentUrl(),
            self: _this
        };
        initEventListeners();
        if (props.beforeEach) {
            beforeEach = props.beforeEach;
        }
        _this._componentWillMount();
        return _this;
    }
    Router.prototype.shouldComponentUpdate = function (props) {
        if (props.static !== true) {
            return true;
        }
        return props.url !== this.props.url || props.onChange !== this.props.onChange;
    };
    /** Check if the given URL can be matched against any children */
    Router.prototype.canRoute = function (url) {
        return this.handleChildren(react_import_1.Children.toArray(this.props.children), url, false).length > 0;
    };
    /** Re-render children with a new URL to match against. */
    Router.prototype.routeTo = function (url) {
        this._didRoute = false;
        this.state.url = url;
        // if we"re in the middle of an update, don"t synchronously re-route.
        if (this.updating) {
            return this.canRoute(url);
        }
        else {
            this.updating = true;
        }
        if (!this.initRoute) {
            this.forceUpdate();
        }
        this.updating = false;
        return this._didRoute;
    };
    Router.prototype._componentWillMount = function () {
        ROUTERS.push(this);
        this.updating = true;
        if (this.props.beforeEach) {
            this.props.beforeEach(this.state.url, this.state.url, function (newUrl) {
                if (newUrl) {
                    _route(newUrl, false);
                }
            });
        }
    };
    Router.prototype.componentDidMount = function () {
        var _this = this;
        this.initRoute = false;
        if (customHistory) {
            this.unlisten = customHistory.listen(function (location) {
                var url = "" + (location.pathname || "") + (location.search || "");
                _this.routeTo(url);
            });
        }
        this.updating = false;
    };
    Router.prototype.componentWillUnmount = function () {
        if (typeof this.unlisten === "function") {
            this.unlisten();
        }
        ROUTERS.splice(ROUTERS.indexOf(this), 1);
    };
    // public componentWillUpdate(nextProps: any) {
    //     Router.getDerivedStateFromProps(nextProps, this.state);
    //     // this.updating = true;
    // }
    Router.prototype.componentDidUpdate = function () {
        this.updating = false;
    };
    Router.prototype.handleChildren = function (children, url, invoke, parentPath) {
        var newChildren = [];
        var isNoRank = false;
        if (children == null) {
            return newChildren;
        }
        for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
            var vnode = children_1[_i];
            if (this.redirect) {
                break;
            }
            if (utils_1.isRoute(vnode)) {
                newChildren = this.getMatchingChildren(children, url, invoke, isNoRank, parentPath);
                break;
            }
            else {
                isNoRank = true;
                var vnodeChildren = react_import_1.findChildren(vnode);
                if (vnodeChildren && vnodeChildren.length > 0) {
                    if (!invoke) {
                        newChildren = newChildren.concat(this.handleChildren(vnodeChildren, url, invoke));
                    }
                    else {
                        vnode = react_import_1.cloneElement(vnode, {}, this.handleChildren(vnodeChildren, url, invoke));
                    }
                }
                if (vnode && invoke) {
                    newChildren.push(vnode);
                }
            }
        }
        return newChildren;
    };
    Router.prototype.getMatchingChildren = function (children, url, invoke, isNoRank, parentPath) {
        var _this = this;
        if (isNoRank === void 0) { isNoRank = false; }
        var rankArr = [];
        // let isNoRank = false;
        if (!isNoRank) {
            var index = 0;
            for (var _i = 0, children_2 = children; _i < children_2.length; _i++) {
                var vnode = children_2[_i];
                if (utils_1.isRoute(vnode)) {
                    var props = react_import_1.findProps(vnode);
                    if (props) {
                        var newVnode = vnode;
                        var deepChildren = react_import_1.Children.toArray(react_import_1.findChildren(vnode));
                        if (deepChildren && deepChildren.length > 0) {
                            newVnode = react_import_1.cloneElement(vnode, {}, this.handleChildren(deepChildren, url, invoke, props.path));
                        }
                        rankArr.push({ index: index, rank: utils_1.rankChild(newVnode), vnode: newVnode });
                    }
                }
                else {
                    isNoRank = true;
                    break;
                }
                index += 1;
            }
        }
        var rankChildren = [];
        var wildChildren = [];
        var execRoute = function (vnode) {
            var props = react_import_1.findProps(vnode);
            var path = props.path;
            if (parentPath && !path.startsWith(parentPath)) {
                path = parentPath + (parentPath.endsWith("/") || path.startsWith("/")) ? "" + path : "/" + path;
            }
            var deepChildren = react_import_1.Children.toArray(react_import_1.findChildren(vnode));
            var childRoute = null;
            for (var _i = 0, deepChildren_1 = deepChildren; _i < deepChildren_1.length; _i++) {
                var item = deepChildren_1[_i];
                childRoute = utils_1.findChildRoute(item);
                if (childRoute) {
                    break;
                }
            }
            var child = null;
            if (childRoute) {
                var matches = childRoute.matches;
                if (invoke !== false) {
                    var newProps = __assign({}, props, { url: url, matches: matches, history: customHistory });
                    utils_1.assign(newProps, matches);
                    delete newProps.ref;
                    delete newProps.key;
                    child = react_import_1.cloneElement(vnode, newProps);
                }
                else {
                    child = vnode;
                }
            }
            else {
                var matches = utils_1.exec(url, path, props);
                if (matches) {
                    if (invoke !== false) {
                        var newProps = { url: url, matches: matches, history: customHistory };
                        // assign(newProps, matches);
                        delete newProps.ref;
                        delete newProps.key;
                        child = react_import_1.cloneElement(vnode, newProps);
                    }
                    else {
                        child = vnode;
                    }
                    if (matches.wild) {
                        wildChildren.push(child);
                        child = null;
                    }
                }
            }
            if (child) {
                if (props.redirect) {
                    _this.redirect = props.redirect;
                }
                else {
                    rankChildren.push(child);
                }
            }
        };
        if (isNoRank) {
            for (var _a = 0, children_3 = children; _a < children_3.length; _a++) {
                var vnode = children_3[_a];
                if (utils_1.isRoute(vnode)) {
                    execRoute(vnode);
                }
                else if (vnode && invoke) {
                    rankChildren.push(vnode);
                }
            }
        }
        else {
            for (var _b = 0, _c = rankArr.sort(utils_1.pathRankSort); _b < _c.length; _b++) {
                var item = _c[_b];
                if (this.redirect) {
                    break;
                }
                execRoute(item.vnode);
            }
        }
        if (rankChildren.length > 0) {
            return rankChildren;
        }
        else {
            return wildChildren;
        }
        // children.forEach((vnode, index) => {
        //     const props = findProps(vnode);
        //     if (props) {
        //         rankArr.push({ index, rank: rankChild(vnode), vnode });
        //     }
        // });
    };
    Router.prototype.render = function () {
        var url = this.state.url;
        var _a = this.props, children = _a.children, onChange = _a.onChange;
        var childarr = react_import_1.Children.toArray(children);
        var active = this.handleChildren(childarr, url, true);
        if (this.redirect) {
            url = this.state.url = this.redirect;
            this.redirect = null;
            setUrl(url, "push");
            active = this.handleChildren(childarr, url, true);
        }
        var current = active[0] || null;
        this._didRoute = !!current;
        var previous = this.previousUrl;
        if (url !== previous) {
            this.previousUrl = url;
            if (typeof onChange === "function") {
                onChange({
                    router: this,
                    url: url,
                    previous: previous,
                    active: active,
                    current: current
                });
            }
        }
        return current;
    };
    Router.subscribers = subscribers;
    Router.getCurrentUrl = getCurrentUrl;
    Router.route = route;
    Router.Router = Router;
    Router.Route = Route;
    Router.Link = Link;
    return Router;
}(react_import_1.Component));
exports.Router = Router;
// export default Router;
