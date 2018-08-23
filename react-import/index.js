const { createElement : h, Component, PureComponent, cloneElement, Children, forwardRef, createContext } = require("react");

function findProps(vnode) {
    return vnode && vnode.props;
}

function findChildren(vnode) {
    return vnode.props && vnode.props.children;
}

function findNodeType(vnode) {
    return vnode.type;
}

module.exports = {
    h,
    Component,
    PureComponent,
    cloneElement,
    createContext,
    Children,
    findProps,
    findChildren,
    findNodeType,
    forwardRef,
};
