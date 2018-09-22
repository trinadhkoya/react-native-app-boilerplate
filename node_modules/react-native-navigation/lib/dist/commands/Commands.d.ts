import { CommandsObserver } from '../events/CommandsObserver';
import { NativeCommandsSender } from '../adapters/NativeCommandsSender';
import { UniqueIdProvider } from '../adapters/UniqueIdProvider';
import { Options } from '../interfaces/Options';
import { Layout, LayoutRoot } from '../interfaces/Layout';
export declare class Commands {
    private readonly nativeCommandsSender;
    private readonly layoutTreeParser;
    private readonly layoutTreeCrawler;
    private readonly commandsObserver;
    private readonly uniqueIdProvider;
    constructor(nativeCommandsSender: NativeCommandsSender, layoutTreeParser: any, layoutTreeCrawler: any, commandsObserver: CommandsObserver, uniqueIdProvider: UniqueIdProvider);
    setRoot(simpleApi: LayoutRoot): any;
    setDefaultOptions(options: Options): void;
    mergeOptions(componentId: string, options: Options): void;
    showModal(simpleApi: Layout): any;
    dismissModal(componentId: any, mergeOptions?: Options): any;
    dismissAllModals(mergeOptions?: Options): any;
    push(componentId: string, simpleApi: Layout): any;
    pop(componentId: string, mergeOptions?: Options): any;
    popTo(componentId: string, mergeOptions?: Options): any;
    popToRoot(componentId: string, mergeOptions?: Options): any;
    setStackRoot(componentId: string, simpleApi: Layout): any;
    showOverlay(simpleApi: Layout): any;
    dismissOverlay(componentId: string): any;
    getLaunchArgs(): any;
}
