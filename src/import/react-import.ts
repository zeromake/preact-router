import { createElement as h, Component, cloneElement, Children } from "react";
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

export {
    h,
    Component,
    cloneElement,
    Children,
    findProps,
    findChildren,
};
