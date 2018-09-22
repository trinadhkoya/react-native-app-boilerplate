"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
const ComponentWrapper_1 = require("./ComponentWrapper");
class ComponentRegistry {
    constructor(store, componentEventsObserver) {
        this.store = store;
        this.componentEventsObserver = componentEventsObserver;
    }
    registerComponent(componentName, getComponentClassFunc, ReduxProvider, userStore) {
        const OriginalComponentClass = getComponentClassFunc();
        const NavigationComponent = ComponentWrapper_1.ComponentWrapper.wrap(componentName, OriginalComponentClass, this.store, this.componentEventsObserver, ReduxProvider, userStore);
        this.store.setOriginalComponentClassForName(componentName, OriginalComponentClass);
        react_native_1.AppRegistry.registerComponent(componentName, () => NavigationComponent);
        return NavigationComponent;
    }
}
exports.ComponentRegistry = ComponentRegistry;
