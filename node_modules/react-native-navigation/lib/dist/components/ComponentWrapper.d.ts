import * as React from 'react';
export declare class ComponentWrapper {
    static wrap(componentName: string, OriginalComponentClass: React.ComponentType<any>, store: any, componentEventsObserver: any, ReduxProvider?: any, reduxStore?: any): React.ComponentType<any>;
    static wrapWithRedux(WrappedComponent: any, ReduxProvider: any, reduxStore: any): React.ComponentType<any>;
}
