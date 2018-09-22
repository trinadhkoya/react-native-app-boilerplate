import { ComponentProvider } from 'react-native';
import { ComponentType } from 'react';
import { Store } from './Store';
import { ComponentEventsObserver } from '../events/ComponentEventsObserver';
export declare class ComponentRegistry {
    private readonly store;
    private readonly componentEventsObserver;
    constructor(store: Store, componentEventsObserver: ComponentEventsObserver);
    registerComponent(componentName: string, getComponentClassFunc: ComponentProvider, ReduxProvider?: any, userStore?: any): ComponentType<any>;
}
