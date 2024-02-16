import React from "react";

export function useStateCallback(initialState: any) {

    const [state, setState] = React.useState(initialState);
    const cbRef = React.useRef<any>(null);

    const updateState = React.useCallback((newState: any, cb: any) => {
        cbRef.current = cb;
        setState((prev: any) => {
            return typeof newState === 'function' ? newState(prev) : newState;
        });
    }, []);

    React.useEffect(() => {
        if (cbRef?.current) {
            cbRef.current(state);
            cbRef.current = null;
        }
    }, [state]);

    return [state, updateState];
};