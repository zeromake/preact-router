"use strict";
exports.__esModule = true;
// import { Route } from "./router";
var react_import_1 = require("react-import");
var EMPTY = {};
function assign(obj, props) {
    for (var i in props) {
        obj[i] = props[i];
    }
    return obj;
}
exports.assign = assign;
function exec(url, route, opts) {
    var reg = /(?:\?([^#]*))?(#.*)?$/;
    var c = url.match(reg);
    var matches = {};
    var ret;
    if (c && c[1]) {
        var p = c[1].split("&");
        for (var _i = 0, p_1 = p; _i < p_1.length; _i++) {
            var item = p_1[_i];
            var r = item.split("=");
            matches[decodeURIComponent(r[0])] = decodeURIComponent(r.slice(1).join("="));
        }
    }
    url = segmentize(url.replace(reg, ""));
    route = segmentize(route || "");
    var max = Math.max(url.length, route.length);
    for (var i = 0; i < max; i++) {
        if (route[i] && route[i].charAt(0) === ":") {
            var param = route[i].replace(/(^\:|[+*?]+$)/g, "");
            var flags = (route[i].match(/[+*?]+$/) || EMPTY)[0] || "";
            var plus = ~flags.indexOf("+");
            var star = ~flags.indexOf("*");
            var val = url[i] || "";
            if (!val && !star && (flags.indexOf("?") < 0 || plus)) {
                ret = false;
                break;
            }
            matches[param] = decodeURIComponent(val);
            if (plus || star) {
                matches[param] = url.slice(i).map(decodeURIComponent).join("/");
                break;
            }
        }
        else if (route[i] === "*") {
            return { wild: true };
        }
        else if (route[i] !== url[i]) {
            ret = false;
            break;
        }
    }
    if (opts["default"] !== true && ret === false) {
        return false;
    }
    return matches;
}
exports.exec = exec;
function pathRankSort(a, b) {
    return ((a.rank < b.rank) ? 1 :
        (a.rank > b.rank) ? -1 :
            (a.index - b.index));
}
exports.pathRankSort = pathRankSort;
// filter out VNodes without attributes (which are unrankeable), and add `index`/`rank` properties to be used in sorting.
function prepareVNodeForRanking(vnode, index, callbak) {
    // vnode.index = index;
    // vnode.rank = rankChild(vnode);
    callbak(vnode, index, rank);
    return vnode.attributes || vnode.props;
}
exports.prepareVNodeForRanking = prepareVNodeForRanking;
function segmentize(url) {
    return url.replace(/(^\/+|\/+$)/g, "").split("/");
}
exports.segmentize = segmentize;
function rankSegment(segment) {
    return segment.charAt(0) === ":" ? (1 + "*+?".indexOf(segment.charAt(segment.length - 1))) || 4 : 5;
}
exports.rankSegment = rankSegment;
function rank(path) {
    return segmentize(path).map(rankSegment).join("");
}
exports.rank = rank;
function rankChild(vnode) {
    var props = react_import_1.findProps(vnode);
    return props["default"] ? 0 : rank(props.path);
}
exports.rankChild = rankChild;
// export function isRoute(vnode) {
//     if (vnode) {
//         return vnode.type === Route || vnode.nodeName === Route;
//     }
//     return false;
// }
function isRoute(vnode) {
    if (vnode) {
        var props = react_import_1.findProps(vnode);
        return !!(props && props.path && typeof props.path === "string");
    }
    return false;
}
exports.isRoute = isRoute;
function findChildRoute(vnode) {
    while (vnode && !isRoute(vnode)) {
        var deep = react_import_1.Children.toArray(react_import_1.findChildren(vnode));
        if (deep && deep.length > 0) {
            vnode = deep[0];
        }
        else {
            return null;
        }
    }
    return vnode;
}
exports.findChildRoute = findChildRoute;
