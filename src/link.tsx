import * as React from "react-import";
import { h } from "react-import";
import {
    BaseContext,
} from "./context";
import {
    resolve,
    startsWith,
} from "./lib/utils";
import {
    Location,
} from "./location";

const forwardRef = React.forwardRef || ((C: any) => C);
const k = () => {};
function shouldNavigate(event: MouseEvent) {
    return !event.defaultPrevented &&
        event.button === 0 &&
        !(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

function LinkRender(props, ref) {
    // const deepProps = rest(props, ["innerRef"]);
    const { innerRef, ...deepProps } = props;
    return (
        <BaseContext.Consumer>
            {({ baseuri }) => (
                <Location>
                    {({ location, navigate }) => {
                        const { to, href, state, replace, getProps = k, ...anchorProps } = deepProps;
                        // const anchorProps = rest(
                        //     deepProps,
                        //     ["to", "state", "replace", "getProps"],
                        // );
                        const phref = resolve(to || href, baseuri);
                        const isCurrent = location.pathname === phref;
                        const isPartiallyCurrent = startsWith(location.pathname, phref);
                        const onClick = (event: MouseEvent) => {
                            if (anchorProps.onClick) {
                                anchorProps.onClick(event);
                            }
                            if (shouldNavigate(event)) {
                                event.preventDefault();
                                navigate(phref, { state, replace });
                            }
                        };

                        return (
                            <a
                                ref={ref || innerRef}
                                aria-current={isCurrent ? "page" : undefined}
                                {...anchorProps}
                                {...getProps({ isCurrent, isPartiallyCurrent, phref, location })}
                                href={phref}
                                onClick={onClick}
                            />
                        );
                    }}
                </Location>
            )}
        </BaseContext.Consumer>
    );
}

export const Link = forwardRef(LinkRender);
