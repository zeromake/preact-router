# zreact-router

[![Travis Build Status](https://travis-ci.org/zeromake/zreact-router.svg?branch=master)](https://travis-ci.org/zeromake/zreact-router)
[![Coverage Status](https://coveralls.io/repos/github/zeromake/zreact-router/badge.svg?branch=master)](https://coveralls.io/github/zeromake/zreact-router?branch=master)


a simple router support react, preact, zreact.

copy from [preact-router](https://github.com/developit/preact-router)

## add support

1. animate support([preact-animate](https://github.com/zeromake/preact-animate))

``` jsx
import Animate from "preact-animate";
import { Route, DRouter } from "zreact-router";
function RootRouter() {
    return <DRouter>
        <Link href="/">Home</Link><br/>
        <Link href="/test">Test</Link><br/>
        <Animate
            component="div"
            componentProps={{className: "main"}}
            >
            <Route
                key="1"
                component={() => <div className="animated">Home</div>}
                path="/"
                transitionName={{ enter: "fadeInLeft", leave: "fadeOutLeft" }}
            ></Route>
            <Route
                key="1"
                component={() => <div className="animated">Test</div>}
                path="/test"
                transitionName={{ enter: "fadeInRight", leave: "fadeOutRight" }}
            ></Route>
        </Animate>
    </DRouter>;
}
```

`Router` children not support other tag

``` jsx
import { Router, Link } from "zreact-router";
function RootRouter() {
    const Home = () => <h1>Home</h1>;
    const Test = () => <h1>Test</h1>
    return <div>
        <Link href="/">Home</Link><br/>
        <Link href="/test">Test</Link><br/>
        <Router>
            <Home
                key="1"
                path="/"
            />
            <Test
                key="1"
                path="/test"
            ></Route>
        </Router>
    </div>;
}
```
2. hash router support

``` jsx

import { Router, Link, LocationProvider, createHashSource, createHistory } from "zreact-router";

const source = createHashSource();
const history = createHistory(source, {mode: "hash"});

function RootRouter() {
    const Home = () => <h1>Home</h1>;
    const Test = () => <h1>Test</h1>
    return <LocationProvider history={history}>
        <div>
            <Link href="/">Home</Link><br/>
            <Link href="/test">Test</Link><br/>
            <Router>
                <Home
                    key="1"
                    path="/"
                />
                <Test
                    key="1"
                    path="/test"
                ></Route>
            </Router>
        </div>
    </LocationProvider>;
}
```
3. delete global `navigate` export
``` js
import { globalHistory, createHashSource, createHistory } from "zreact-router";

// global `navigate`
const { navigate } = globalHistory;

// other global `navigate`
const hashHistory = createHistory(createHashSource());
const { navigate } = hashHistory
```

4. `Link` support `href` replace
``` jsx
import { Link } from "zreact-router";

const HomeLink = <Link href="/">Home</Link>;
// href be equal to
const HomeLink = <Link to="/">Home</Link>;
```

5. `Route` path params not assign `props` set on `props.params`
``` jsx
import { Router, Link } from "zreact-router";
function RootRouter() {
    const Home = () => <h1>Home</h1>;
    const Test = (props) => <h1>{"Test: " + JSON.stringify(props.params)}</h1>
    return <div>
        <Link href="/">Home</Link><br/>
        <Link href="/test/hhhh">Test</Link><br/>
        <Router>
            <Home
                key="1"
                path="/"
            />
            <Test
                key="1"
                path="/test/:id"
            ></Route>
        </Router>
    </div>;
}
```

6. add `location.searchParams`

``` jsx
import { Router, Link } from "zreact-router";
function RootRouter() {
    const Home = () => <h1>Home</h1>;
    const Test = (props) => <h1>{"Test: " + props.location.searchParams.get("test")}</h1>
    return <div>
        <Link href="/">Home</Link><br/>
        <Link href="/test?test=gggg">Test</Link><br/>
        <Router>
            <Home
                key="1"
                path="/"
            />
            <Test
                key="1"
                path="/test"
            ></Route>
        </Router>
    </div>;
}
```

