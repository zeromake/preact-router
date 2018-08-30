import { h, Component, PureComponent, createContext, cloneElement, Children, forwardRef } from "zreact";

interface IVNode {
    nodeName: Component<any, any>|string;
    attributes: {[name: string]: any};
    props: {[name: string]: any};
    children: IVNode[];
    key: string;
}

function findProps(vnode: IVNode) {
    return vnode && vnode.attributes || {};
}

function findChildren(vnode) {
    return vnode.children;
}

function findNodeType(vnode) {
    return vnode.nodeName;
}

export {
    h,
    Component,
    PureComponent,
    cloneElement,
    Children,
    findProps,
    findChildren,
    createContext,
    findNodeType,
    forwardRef,
};
