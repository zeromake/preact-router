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
var router_1 = require("./router");
var Match = /** @class */ (function (_super) {
    __extends(Match, _super);
    function Match() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.update = function (url) {
            _this.nextUrl = url;
            _this.setState({});
        };
        return _this;
    }
    Match.prototype.componentDidMount = function () {
        router_1.subscribers.push(this.update);
    };
    Match.prototype.componentWillUnmount = function () {
        var index = router_1.subscribers.indexOf(this.update) >>> 0;
        router_1.subscribers.splice(1);
    };
    Match.prototype.render = function () {
        var props = this.props;
        var url = this.nextUrl || router_1.getCurrentUrl();
        var path = url.replace(/\?.+$/, "");
        this.nextUrl = null;
        return props.render && props.render({
            url: url,
            path: path,
            matches: path === props.path
        });
    };
    Match.Link = null;
    return Match;
}(react_import_1.Component));
exports.Match = Match;
exports.Link = function (_a) {
    var activeClassName = _a.activeClassName, path = _a.path, props = __rest(_a, ["activeClassName", "path"]);
    return (react_import_1.h(Match, { path: path || props.href, render: function (_a) {
            var matches = _a.matches;
            return (react_import_1.h(router_1.Link, __assign({}, props, { "class": [
                    props["class"] || props.className,
                    matches && activeClassName,
                ].filter(Boolean).join(" ") })));
        } }));
};
Match.Link = exports.Link;
exports["default"] = Match;
