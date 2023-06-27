import {
    ApplicationRef, ComponentFactoryResolver,
    ComponentRef,
    Injectable,
    Injector,
    TemplateRef, ViewContainerRef,
} from '@angular/core';
import {NavigationStart, Router} from '@angular/router';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {WindowxComponent} from "./windowx.component";

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
    bodyStyle?: any;
    maximized?: boolean;
    icon?: TemplateRef<any> | string | null;
    draggable?: boolean;
    closeOnNavigation?: boolean;
    closable?: boolean;
}

function updateStyles(styles: any, dom: HTMLElement) {
    for (const styleName in styles) {
        dom.style[styleName] = styles[styleName];
    }
}

@Injectable({providedIn: 'root'})
export class WindowxService {
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
    componentFactory = this._cfr.resolveComponentFactory(WindowxComponent);
    instances: ComponentRef<WindowxComponent>[] = [];
    selectedWindow = null;
    minimizeItems = {};

    destroy(windowId: string) {
        const componentRef = this.instances.find(item => item.instance.windowId === windowId);
        if (componentRef) {
            this.detachView(componentRef);
            componentRef.destroy();
            this.instances = this.instances.filter(item => item.instance.windowId !== windowId);
            this.selectedWindow = null;
        }
    }

    addMinimizeItem(windowComponent: WindowxComponent) {
        const minimizeWrapper = document.querySelector('#ousc-window-minimize-wrapper');
        const minimizeItem = document.createElement('div');
        minimizeItem.id = windowComponent.windowId + '-minimize-item';
        minimizeItem.innerHTML = windowComponent.title instanceof TemplateRef ? windowComponent.title.elementRef.nativeElement.innerHTML : windowComponent.title;
        if (windowComponent.closable) {
            const closeIcon = document.createElement('img');
            closeIcon.src = 'https://cdn.leinbo.com/assets/images/close.svg';
            closeIcon.style.width = '20px';
            closeIcon.style.height = '20px';
            closeIcon.style.marginLeft = '5px';
            closeIcon.style.cursor = 'pointer';
            closeIcon.onclick = () => {
                windowComponent.close();
            }
            minimizeItem.appendChild(closeIcon);
        }
        updateStyles({
            cursor: 'pointer',
            flex: '1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(to right, #e6f7ff, #fbfbfb, rgba(232, 232, 232, 0.37))',
            border: '1px solid #ccc',
            borderRadius: '5px',
            padding: '15px 15px',
            margin: '5px',
            fontSize: '12px',
            color: '#333',
            textAlign: 'center',
            userSelect: 'none',
            pointerEvents: 'auto',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        }, minimizeItem);
        minimizeItem.onclick = () => {
            windowComponent.minimize();
            windowComponent.zIndex = this.maxZIndex++;
            document.querySelector('#ousc-window-minimize-wrapper').removeChild(minimizeItem);
            this.selectedWindow = windowComponent.windowId;
        };
        minimizeWrapper.appendChild(minimizeItem);
        this.minimizeItems[windowComponent.windowId] = minimizeItem;
    }

    createWrapper() {
        if (this.instances.length === 0 && document.querySelector('#ousc-window-wrapper') === null) {
            const div = document.createElement('div');
            div.id = 'ousc-window-wrapper';
            updateStyles({
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                zIndex: 999,
                pointerEvents: 'none',
            }, div);
            document.body.appendChild(div);

            const div2 = document.createElement('div');
            div2.id = 'ousc-window-minimize-wrapper';
            updateStyles({
                position: 'fixed',
                right: '160px',
                bottom: '5px',
                width: 'auto',
                height: '40px',
                display: 'inline-flex',
                zIndex: 999,
                pointerEvents: 'none',
            }, div2);
            document.body.appendChild(div2);
        }
    }

    create(options: WindowConfig): Promise<WindowxComponent> {
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
            this._appendToPage(componentRef.location.nativeElement, document.querySelector('#ousc-window-wrapper'));
            this.instances.push(componentRef);
            componentRef.instance.onClose.subscribe(windowId => {
                this.destroy(windowId);
                if (this.minimizeItems[windowId]) {
                    document.getElementById('ousc-window-minimize-wrapper')?.removeChild(this.minimizeItems[windowId]);
                }
                this.minimizeItems[windowId] = null;
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
