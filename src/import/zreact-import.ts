import { h, Component, cloneElement, Children } from "zreact";

interface IVNode {
    nodeName: Component<any, any>|string;
    attributes: {[name: string]: any};
    children: IVNode[];
    key: string;
}

function findProps(vnode: IVNode) {
    return vnode && vnode.attributes;
}

function findChildren(vnode) {
    return vnode.children;
}

export {
    h,
    Component,
    cloneElement,
    Children,
    findProps,
    findChildren,
};
