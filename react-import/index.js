const { createElement : h, Component, PureComponent, cloneElement, Children, forwardRef, createContext } = require("react");

function findProps(vnode) {
    return vnode && vnode.props;
}

function findChildren(vnode) {
    return vnode && vnode.props && vnode.props.children;
}

function findNodeType(vnode) {
    return vnode && vnode.type;
}

function PolyfillLifecycle(com) {

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
    PolyfillLifecycle,
};
