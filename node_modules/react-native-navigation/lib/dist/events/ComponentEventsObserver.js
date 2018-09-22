"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
class ComponentEventsObserver {
    constructor(nativeEventsReceiver) {
        this.nativeEventsReceiver = nativeEventsReceiver;
        this.listeners = {};
        this.alreadyRegistered = false;
        this.notifyComponentDidAppear = this.notifyComponentDidAppear.bind(this);
        this.notifyComponentDidDisappear = this.notifyComponentDidDisappear.bind(this);
        this.notifyNavigationButtonPressed = this.notifyNavigationButtonPressed.bind(this);
        this.notifyModalDismissed = this.notifyModalDismissed.bind(this);
        this.notifySearchBarUpdated = this.notifySearchBarUpdated.bind(this);
        this.notifySearchBarCancelPressed = this.notifySearchBarCancelPressed.bind(this);
        this.notifyPreviewCompleted = this.notifyPreviewCompleted.bind(this);
    }
    registerOnceForAllComponentEvents() {
        if (this.alreadyRegistered) {
            return;
        }
        this.alreadyRegistered = true;
        this.nativeEventsReceiver.registerComponentDidAppearListener(this.notifyComponentDidAppear);
        this.nativeEventsReceiver.registerComponentDidDisappearListener(this.notifyComponentDidDisappear);
        this.nativeEventsReceiver.registerNavigationButtonPressedListener(this.notifyNavigationButtonPressed);
        this.nativeEventsReceiver.registerModalDismissedListener(this.notifyModalDismissed);
        this.nativeEventsReceiver.registerSearchBarUpdatedListener(this.notifySearchBarUpdated);
        this.nativeEventsReceiver.registerSearchBarCancelPressedListener(this.notifySearchBarCancelPressed);
        this.nativeEventsReceiver.registerPreviewCompletedListener(this.notifyPreviewCompleted);
    }
    bindComponent(component) {
        const componentId = component.props.componentId;
        if (!_.isString(componentId)) {
            throw new Error(`bindComponent expects a component with a componentId in props`);
        }
        if (_.isNil(this.listeners[componentId])) {
            this.listeners[componentId] = {};
        }
        const key = _.uniqueId();
        this.listeners[componentId][key] = component;
        return { remove: () => _.unset(this.listeners[componentId], key) };
    }
    unmounted(componentId) {
        _.unset(this.listeners, componentId);
    }
    notifyComponentDidAppear(event) {
        this.triggerOnAllListenersByComponentId(event, 'componentDidAppear');
    }
    notifyComponentDidDisappear(event) {
        this.triggerOnAllListenersByComponentId(event, 'componentDidDisappear');
    }
    notifyNavigationButtonPressed(event) {
        const listenersTriggered = this.triggerOnAllListenersByComponentId(event, 'navigationButtonPressed');
        if (listenersTriggered === 0) {
            // tslint:disable-next-line:no-console
            console.warn(`navigationButtonPressed for button '${event.buttonId}' was not handled`);
        }
    }
    notifyModalDismissed(event) {
        this.triggerOnAllListenersByComponentId(event, 'modalDismissed');
    }
    notifySearchBarUpdated(event) {
        this.triggerOnAllListenersByComponentId(event, 'searchBarUpdated');
    }
    notifySearchBarCancelPressed(event) {
        this.triggerOnAllListenersByComponentId(event, 'searchBarCancelPressed');
    }
    notifyPreviewCompleted(event) {
        this.triggerOnAllListenersByComponentId(event, 'previewCompleted');
    }
    triggerOnAllListenersByComponentId(event, method) {
        let listenersTriggered = 0;
        _.forEach(this.listeners[event.componentId], (component) => {
            if (_.isObject(component) && _.isFunction(component[method])) {
                component[method](event);
                listenersTriggered++;
            }
        });
        return listenersTriggered;
    }
}
exports.ComponentEventsObserver = ComponentEventsObserver;
