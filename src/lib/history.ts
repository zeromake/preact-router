////////////////////////////////////////////////////////////////////////////////
// createHistory(source) - wraps a history source
const getLocation = (source) => {
    return {
        ...source.location,
        get searchParams() {
            if (!("searchParams" in source.location)) {
                return new URLSearchParams(source.location.search.substr(1));
            }
            return source.location.searchParams;
        },
        state: source.history.state,
        key: (source.history.state && source.history.state.key) || "initial",
    };
};

const createHistory = (source, options?) => {
    let listeners = [];
    let location = getLocation(source);
    let transitioning = false;
    let resolveTransition = () => {};

    return {
        get location() {
            return location;
        },
        get transitioning() {
            return transitioning;
        },
        _onTransitionComplete() {
            transitioning = false;
            resolveTransition();
        },
        listen(listener) {
            listeners.push(listener);

            const popstateListener = () => {
                location = getLocation(source);
                listener();
            };

            source.addEventListener("popstate", popstateListener);

            return () => {
                source.removeEventListener("popstate", popstateListener);
                listeners = listeners.filter((fn) => fn !== listener);
            };
        },
        navigate(to, { state = {}, replace = false } = {}) {
            state = { ...state, key: Date.now() + "" };
            // try...catch iOS Safari limits to 100 pushState calls
            try {
                if (transitioning || replace) {
                    source.history.replaceState(state, null, to);
                } else {
                    source.history.pushState(state, null, to);
                }
            } catch (e) {
                source.location[replace ? "replace" : "assign"](to);
            }

            location = getLocation(source);
            transitioning = true;
            const transition = new Promise((res) => (resolveTransition = res));
            listeners.forEach((fn) => fn());
            return transition;
        },
    };
};

////////////////////////////////////////////////////////////////////////////////
// Stores history entries in memory for testing or other platforms like Native
const createMemorySource = (initialPathname = "/") => {
    let index = 0;
    const stack = [{ pathname: initialPathname, search: "" }];
    const states = [];

    return {
        get location() {
            return stack[index];
        },
        addEventListener(name, fn) {},
        removeEventListener(name, fn) {},
        history: {
            get entries() {
                return stack;
            },
            get index() {
                return index;
            },
            get state() {
                return states[index];
            },
            pushState(state, _, uri) {
                const [pathname, search = ""] = uri.split("?");
                index++;
                stack.push({ pathname, search });
                states.push(state);
            },
            replaceState(state, _, uri) {
                const [pathname, search = ""] = uri.split("?");
                stack[index] = { pathname, search };
                states[index] = state;
            },
        },
    };
};

////////////////////////////////////////////////////////////////////////////////
// global history - uses window.history as the source if available, otherwise a
// memory history
const  canUseDOM = !!(
    typeof window !== "undefined" &&
    window.document &&
    window.document.createElement
);
const getSource = () => {
    return canUseDOM ? window : createMemorySource();
};

const globalHistory = createHistory(getSource());
const { navigate } = globalHistory;

////////////////////////////////////////////////////////////////////////////////
export { globalHistory, navigate, createHistory, createMemorySource };
