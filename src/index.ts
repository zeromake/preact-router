import {
    ServerLocation,
    Location,
} from "./location";

import {
    Redirect,
    isRedirect,
    redirectTo,
} from "./redirect";

import {
    Router,
} from "./router";

import {
    navigate,
    createHistory,
    createMemorySource,
} from "./lib/history";

import { Link } from "./link";
import { LocationProvider } from "./location-provider";
import { Match } from "./match";

export {
    Link,
    Location,
    LocationProvider,
    Match,
    Redirect,
    Router,
    ServerLocation,
    createHistory,
    createMemorySource,
    isRedirect,
    navigate,
    redirectTo,
};
