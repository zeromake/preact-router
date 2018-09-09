import { createElement as h, Component, PureComponent, cloneElement, Children, forwardRef, createContext } from "react";
// import { findDOMNode } from "react-dom";

interface IVNode {
    type: Component<any, any>|string;
    props: {[name: string]: any};
    children: IVNode[];
}

function findProps(vnode: IVNode) {
    return vnode && vnode.props;
}

function findChildren(vnode) {
    return vnode.props && vnode.props.children;
}

function findNodeType(vnode) {
    return vnode.type;
}
function PolyfillLifecycle(component: any): void {
}

export {
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
