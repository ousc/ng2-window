import {
    ApplicationRef,
    ComponentFactoryResolver,
    ComponentRef,
    Injectable,
    Injector,
    TemplateRef,
} from '@angular/core';
import {NavigationStart, Router} from '@angular/router';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Ng2WindowComponent} from "./ng2-window.component";
import {DockComponent} from "./components/dock/dock.component";

export interface WindowConfig {
    title?: TemplateRef<any> | string;
    content: TemplateRef<any> | string;
    width?: number;
    height?: number;
    minWidth?: number;
    minHeight?: number;
    align?: 'leftTop' | 'rightTop' | 'leftBottom' | 'rightBottom';
    offsetY?: number;
    offsetX?: number;
    zIndex?: number;
    titleStyle?: any;
    language?: 'zh' | 'en';
    bodyStyle?: any;
    maximized?: boolean;
    icon?: TemplateRef<any> | string | null;
    draggable?: boolean;
    closeOnNavigation?: boolean;
    closable?: boolean;
}

@Injectable({providedIn: 'root'})
export class Ng2WindowService {
    private unsubscribe$ = new Subject<void>();

    constructor(private _appRef: ApplicationRef,
                private _injector: Injector,
                private _cfr: ComponentFactoryResolver,
                private router: Router) {
        router.events.pipe(takeUntil(this.unsubscribe$)).subscribe((evt) => {
            if (evt instanceof NavigationStart) {
                this.instances.forEach(item => {
                    if (item.instance.closeOnNavigation) {
                        item.instance.close();
                    }
                });
            }
        });
    }

    maxZIndex: number = 0;
    componentFactory = this._cfr.resolveComponentFactory(Ng2WindowComponent);
    instances: ComponentRef<Ng2WindowComponent>[] = [];
    selectedWindow = null;
    dockComponentRef: ComponentRef<DockComponent> = null;

    destroy(windowId: string) {
        const componentRef = this.instances.find(item => item.instance.windowId === windowId);
        if (componentRef) {
            this.detachView(componentRef);
            componentRef.destroy();
            this.instances = this.instances.filter(item => item.instance.windowId !== windowId);
            this.selectedWindow = null;
        }
        if(this.instances.length === 0) {
            this.destroyDock();
            this.destroyWrapper();
        }
    }

    addMinimizeItem(windowComponent: Ng2WindowComponent) {
        this.dockComponentRef.instance.docks.push(windowComponent);
    }

    createDock() {
        if (!this.dockComponentRef) {
            this.dockComponentRef = this._cfr.resolveComponentFactory(DockComponent).create(this._injector);
            this._appRef.attachView(this.dockComponentRef.hostView);
            document.body.appendChild(this.dockComponentRef.location.nativeElement);
        }
    }

    destroyDock() {
        if (this.dockComponentRef) {
            this._appRef.detachView(this.dockComponentRef.hostView);
            this.dockComponentRef.destroy();
            this.dockComponentRef = null;
        }
    }

    createWrapper() {
        if(!document.querySelector('#ng-window-wrapper')) {
            const wrapper = document.createElement('div');
            wrapper.id = 'ng-window-wrapper';
            document.body.appendChild(wrapper);
        }
    }

    destroyWrapper() {
        const wrapper = document.querySelector('#ng-window-wrapper');
        if(wrapper) {
            document.body.removeChild(wrapper);
        }
    }

    create(options: WindowConfig): Promise<Ng2WindowComponent> {
        this.createDock();
        this.createWrapper();
        return new Promise(resolve => {
            const componentRef = this.componentFactory.create(this._injector);
            //if the options.left > window.innerWidth, then set left = window.innerWidth - options.width
            if (options.offsetX + options.width > window.innerWidth) {
                options.offsetX = window.innerWidth - options.width - 10;
            }
            //if the options.top > window.innerHeight, then set top = window.innerHeight - options.height
            if (options.offsetY + options.height > window.innerHeight) {
                options.offsetY = window.innerHeight - options.height - 30;
            }

            for (const i in options) {
                componentRef.instance[i] = options[i];
            }

            if (componentRef.instance.zIndex <= this.maxZIndex) {
                componentRef.instance.zIndex = this.maxZIndex = componentRef.instance.zIndex++;
            }
            this.selectedWindow = componentRef.instance.windowId;
            componentRef.changeDetectorRef.detectChanges();
            this._appRef.attachView(componentRef.hostView);
            this._appendToPage(componentRef.location.nativeElement, document.querySelector('#ng-window-wrapper'));
            this.instances.push(componentRef);
            componentRef.instance.onClose.subscribe(windowId => {
                this.dockComponentRef.instance.docks = this.dockComponentRef.instance.docks.filter(win => win !== componentRef.instance);
                this.destroy(windowId);
                if (this.selectedWindow === windowId) {
                    this.selectedWindow = null;
                }
            });
            resolve(componentRef.instance);
        });
    }

    detachView(componentRef: ComponentRef<any>) {
        this._appRef.detachView(componentRef.hostView);
    }

    private _appendToPage(innerElement: HTMLElement, outerElement?: HTMLElement) {
        if (outerElement) {
            outerElement.appendChild(innerElement);
            return;
        }
        document.body.appendChild(innerElement);
    }
}
