export declare class Store {
    private componentsByName;
    private propsById;
    setPropsForId(componentId: string, props: any): void;
    getPropsForId(componentId: string): any;
    setOriginalComponentClassForName(componentName: string, ComponentClass: any): void;
    getOriginalComponentClassForName(componentName: string): any;
    cleanId(id: string): void;
}
