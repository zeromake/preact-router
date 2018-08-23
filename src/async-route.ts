import { h, Component, Children } from "react-import";

function loadComponent(props: any, next: (component: Component<any, any>) => void) {
    if (props.component && props.component !== AsyncRoute) {
        next(props.component);
        return;
    }
    const componentData = props.getComponent(props, ({component}) => {
        // Named param for making callback future proof
        if (component) {
            next(component);
        }
    });

    // In case returned value was a promise
    if (componentData && componentData.then) {
        // IIFE to check if a later ending promise was creating a race condition
        // Check test case for more info
        const url = props.url;
        componentData.then((component) => {
            if (url === props.url) {
                next(component);
            }
        });
    }
}

export default class AsyncRoute extends Component<any, any> {
    public state: any;
    public props: any;
    public static getDerivedStateFromProps(nextProps: any, previousState: any) {
        const self: AsyncRoute = previousState.self;
        if (self.props.url && self.props.url !== nextProps.url) {
            self.setState({
                componentData: null,
            }, () => {
                self.loadComponent();
            });
        }
    }
    // public setState(state: any, callback: () => void);
    constructor() {
        super();
        this.state = {
            componentData: null,
            self: this,
        };
    }
    private loadComponent() {
        loadComponent(this.props, (component: Component<any, any>) => {
            this.setState({componentData: component});
        });
    }
    public componentDidMount() {
        this.loadComponent();
    }
    public componentWillReceiveProps(nextProps) {
        AsyncRoute.getDerivedStateFromProps(nextProps, this.state);
    }
    public render() {
        if (this.state.componentData) {
            // const props = this.props;
            // const filterProps = rest(props, ["component", "getComponent", "loading"]);
            const { component, getComponent, loading, ...filterProps } = this.props;
            return h(this.state.componentData, filterProps);
        } else if (this.props.loading) {
            const loadingComponent = this.props.loading();
            return loadingComponent;
        } else {
            return null;
        }
    }
}
