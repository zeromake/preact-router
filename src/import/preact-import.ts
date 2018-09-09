import { h, Component, cloneElement } from "preact";

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
    return vnode.children.length > 0 ? vnode.children : null;
}

function isArray(obj: any): boolean {
    if (Array.isArray) {
        return Array.isArray(obj);
    }
    return toString.call(obj) === "[object Array]";
}

function findNodeType(obj: IVNode): Component<any, any>|string {
    return obj.nodeName;
}

declare type childType = IVNode|string|number|boolean|null|undefined|void;
declare type Child = childType[] | childType;
declare type ChildCallback = (item?: childType, index?: number, arr?: childType[]) => childType[];

const arrayMap = Array.prototype.map;
const arrayForEach = Array.prototype.forEach;
const arraySlice = Array.prototype.slice;

const Children = {
    map(children: Child, callback: ChildCallback, ctx?: any): childType[] {
        if (children == null) {
            return null;
        }
        if (!isArray(children)) {
            children = [children as childType];
        }
        if (ctx && ctx !== children) {
            callback = callback.bind(ctx);
        }
        return arrayMap.call(children, callback);
    },
    forEach(children: Child, callback: ChildCallback, ctx?: any) {
        if (children == null) {
            return null;
        }
        if (!isArray(children)) {
            children = [children as childType];
        }
        if (ctx && ctx !== children) {
            callback = callback.bind(ctx);
        }
        return arrayForEach.call(children, callback);
    },
    count(children: Child): number {
        if (children == null) {
            return 0;
        }
        if (!isArray(children)) {
            return 1;
        }
        return (children as childType[]).length;
    },
    only(children: Child): childType {
        if (children != null && !isArray(children)) {
            return children as childType;
        } else if (isArray(children) && (children as childType[]).length === 1) {
            return children[0];
        }
        throw new TypeError("Children.only() expects only one child.");
    },
    toArray(children: Child): childType[] {
        if (children == null) {
            return [];
        } else if (!isArray(children)) {
            return [children as childType];
        }
        return arraySlice.call(children);
    },
};
// const forwardRef = (c: any) => c;
const PureComponent = Component;

function forwardRef(component) {
    return function forward({ref, ...props}) {
        return component(props, ref);
    };
}

function createEventEmitter(value: any, context: any) {
    let handlers: any[] = [];
    return {
        on(handler: any) {
            handlers.push(handler);
        },
        off(handler: any) {
            handlers = handlers.filter((han: any) => han !== handler);
        },
        get() {
            return value;
        },
        set(newValue: any, changedBits: any) {
            value = newValue;
            handlers.forEach((handler: any) => handler(value, changedBits));
        },
        context,
    };
}

function objectIs(x: any, y: any) {
    if (x === y) {
        return x !== 0 || 1 / x === 1 / y;
    } else {
        return x !== x && y !== y;
    }
}

function createContext(defaultValue: any, calculateChangedBits?: (a: any, b: any) => number, name?: string) {
    const context = {};
    class Provider extends Component<any, any> {
        public static displayName: string = name ? name + ".Provider" : "Context.Provider";
        public static getDerivedStateFromProps(nextProps: any, previousState: any): null {
            const self: Provider = previousState.self;
            const oldValue = self.props.value;
            const newValue = nextProps.value;
            let changedBits: number;
            if (objectIs(oldValue, newValue)) {
                changedBits = 0;
            } else {
                changedBits = typeof calculateChangedBits === "function"
                    ? calculateChangedBits(oldValue, newValue) : 1073741823;
                changedBits |= 0;
                if (changedBits) {
                    self.emitter.set(nextProps.value, changedBits);
                }
            }
            return null;
        }

        public emitter = createEventEmitter(this.props.value, context);

        constructor(p: any, c: any) {
            super(p, c);
            this.state = {self: this};
        }
        public componentWillReceiveProps(nextProps: any, nextContext: any) {
            const state = Provider.getDerivedStateFromProps(nextProps, this.state);
            if (state != null) {
                this.setState(state);
            }
        }
        public getChildContext() {
            const provider = this.emitter;
            return { provider };
        }

        public render() {
            return this.props.children && this.props.children[0];
        }
    }
    class Consumer extends Component<any, any> {
        public static displayName: string = name ? name + ".Consumer" : "Context.Consumer";
        public emitter: any;
        public observedBits: number = 0;
        constructor(p: any, c: any) {
            super(p, c);
            this.updateContext = this.updateContext.bind(this);
            if (c && c.provider != null) {
                if (c.provider.context === context) {
                    this.emitter = c.provider;
                }
            }
            this.state = {
                value: this.getValue(),
            };
        }

        public componentDidMount() {
            const c = this.context;
            if (c && c.provider != null) {
                if (c.provider.context === context) {
                    this.emitter = c.provider;
                }
            }
            if (this.emitter) {
                this.emitter.on(this.updateContext);
            }
            const { observedBits } = this.props;
            this.observedBits =
                observedBits === undefined
                || observedBits === null
                ? 1073741823 // Subscribe to all changes by default
                : observedBits;
        }

        public updateContext(val: any, changedBits: number) {
            const observedBits: number = this.observedBits | 0;
            if ((observedBits & changedBits) !== 0) {
                this.setState({ value: val });
            }
        }
        public componentWillUnmount() {
            if (this.emitter) {
                this.emitter.off(this.updateContext);
            }
        }
        public getValue() {
            if (this.emitter) {
                return this.emitter.get();
            } else {
                return defaultValue;
            }
        }
        public render() {
            return this.props.children && this.props.children[0](this.state.value);
        }
    }
    return {Provider, Consumer, default: defaultValue};
}

function PolyfillLifecycle(component: any): void {
    if (component.getDerivedStateFromProps) {
        component.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps: any) {
            const state = component.getDerivedStateFromProps(nextProps, this.state);
            if (state != null) {
                this.setState(state);
            }
        };
    }
}

export {
    h,
    Component,
    PureComponent,
    cloneElement,
    Children,
    findProps,
    findChildren,
    findNodeType,
    forwardRef,
    createContext,
    PolyfillLifecycle,
};
