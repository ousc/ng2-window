import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    Output,
    signal,
    TemplateRef,
    ViewChild
} from '@angular/core';
import {Ng2WindowService} from "./ng2-window.service";
import {In, when} from "conditio";

interface WindowSize {
    offsetY: number;
    offsetX: number;
    align: 'leftTop' | 'rightTop' | 'leftBottom' | 'rightBottom';
    width: number;
    height: number;
}

@Component({
    selector: 'ng-window',
    templateUrl: 'ng2-window.component.html',
    standalone: false
})
export class Ng2WindowComponent implements AfterViewInit {
    windowId = 'window' + Math.floor(Math.random() * 1000000);
    titleHeight = 0;

    @Input() title: string | TemplateRef<any> = 'Window Name';
    @Input() icon: string | TemplateRef<any> | null = null;
    @Input() align: 'leftTop' | 'rightTop' | 'leftBottom' | 'rightBottom' = 'leftTop';
    @Input() bodyStyle: any = {};
    @Input() zIndex = 0;

    @Input() closeOnNavigation = false; //是否在页面路由变化时关闭窗口
    @Input() closable = true; //是否允许关闭窗口
    @Input() content: TemplateRef<any> | string;
    @Input() width: number = 600;
    @Input() height: number = 400;
    @Input() minWidth: number = 175;
    @Input() minHeight: number = 100;
    @Input() offsetY: number = 200;
    @Input() offsetX: number = 200;
    @Input() loading = signal(true); // is loading
    @Input() theme: 'light' | 'dark' = 'light';
    @Input() maximizable = true;
    @Input() minimizable = true;
    @Input() resizable = true;
    @Input() draggable = true;
    //允许窗口超出屏幕
    @Input() outOfBounds = false;

    get themeSuffix() {
        return this.theme === 'dark' ? '-dark' : '';
    }

    get language() {
        return this.windowService.language;
    }

    @Input() loadingTip: string | TemplateRef<any> = this.getLocaleText('loading');

    getLocaleText(text: 'loading' | 'close' | 'maximize' | 'minimize' | 'windowMode') {
        const dictionary = {
            'zh': {
                loading: '加载中...',
                close: '关闭窗口',
                maximize: '最大化',
                minimize: '最小化',
                windowMode: '窗口化',
            },
            'en': {
                loading: 'Loading...',
                close: 'Close Window',
                maximize: 'Maximize',
                minimize: 'Minimize',
                windowMode: 'Window Mode',
            }
        }
        return dictionary[this.language][text];
    }

    @Input() contentScrollable: boolean = false;

    get windowSize(): WindowSize {
        return {
            offsetX: this.offsetX,
            offsetY: this.offsetY,
            align: this.align,
            width: this.width,
            height: this.height
        }
    }

    position: { [key: string]: string } = {};

    updateOffsetX(offsetX) {
        this.offsetX = offsetX;
        if (this.align.includes('left')) {
            this.position = {
                ...this.position,
                left: offsetX + 'px',
                right: null
            }
        } else {
            this.position = {
                ...this.position,
                left: null,
                right: offsetX + 'px'
            }
        }
    }

    updateOffsetY(offsetY) {
        this.offsetY = offsetY;
        if (this.align.includes('Top')) {
            this.position = {
                ...this.position,
                top: offsetY + 'px',
                bottom: null
            }
        } else {
            this.position = {
                ...this.position,
                top: null,
                bottom: offsetY + 'px'
            }
        }
    }

    dragging = false;
    windowMouseEnterFlag = false;
    windowMouseDownFlag = false;
    windowMouseLeaveFlag = true;

    clickedX: number;
    clickedY: number;

    mouseEvent: MouseEvent;

    mouseEntered: MouseEvent;

    borderWidth = 4;

    cursorStyle = 'default';
    display = 'none';

    border: {
        isLeft?: boolean;
        isRight?: boolean;
        isTop?: boolean;
        isBottom?: boolean;
    } = {
        isLeft: false,
        isRight: false,
        isTop: false,
        isBottom: false
    }

    constructor(private windowService: Ng2WindowService) {
    }

    get left() {
        return (this.align === 'leftTop' || this.align === 'leftBottom' ? this.offsetX : window.innerWidth - this.width - this.offsetX);
    }

    get right() {
        return (this.align === 'rightTop' || this.align === 'rightBottom' ? window.innerWidth - this.offsetX : this.width + this.offsetX);
    }

    get top() {
        return (this.align === 'leftTop' || this.align === 'rightTop' ? this.offsetY : window.innerHeight - this.height - this.offsetY);
    }

    get bottom() {
        return (this.align === 'leftBottom' || this.align === 'rightBottom' ? window.innerHeight - this.offsetY : this.height + this.offsetY);
    }

    @HostListener('document:mousemove', ['$event'])
    onMouseMove(event: MouseEvent) {
        if (!this.draggable || this.maximized) {
            return;
        }
        this.mouseEvent = event;
        if (this.dragging) {
            this.updateOffsetX(
                when(this.align)(
                    In('leftTop', 'leftBottom',
                        () => {
                            if(!this.outOfBounds) {
                                let offsetX = Math.max(event.clientX - this.clickedX, 0);
                                if (offsetX + this.width > window.innerWidth) {
                                    offsetX = window.innerWidth - this.width;
                                }
                                return offsetX;
                            } else {
                                return event.clientX - this.clickedX;
                            }
                        }),
                    In('rightTop', 'rightBottom',
                        () => {
                            if(!this.outOfBounds) {
                                let offsetX = Math.max(window.innerWidth - event.clientX + this.clickedX - this.width, 0);
                                if (offsetX + this.width > window.innerWidth) {
                                    offsetX = window.innerWidth - this.width;
                                }
                                return offsetX;
                            } else {
                                return window.innerWidth - event.clientX + this.clickedX - this.width;
                            }
                        })
                )
            );
            this.updateOffsetY(
                when(this.align)(
                    In('leftTop', 'rightTop', () => {
                        if(!this.outOfBounds){
                            let offsetY = Math.max(event.clientY - this.clickedY, 0);
                            if (offsetY + this.height > window.innerHeight) {
                                offsetY = window.innerHeight - this.height;
                            }
                            return offsetY;
                        } else {
                            return event.clientY - this.clickedY;
                        }
                    }),
                    In('leftBottom', 'rightBottom', () => {
                        if(!this.outOfBounds){
                            let offsetY = Math.max(window.innerHeight - event.clientY + this.clickedY - this.height, 0);
                            if (offsetY + this.height > window.innerHeight) {
                                offsetY = window.innerHeight - this.height;
                            }
                            return offsetY;
                        } else {
                            return window.innerHeight - event.clientY + this.clickedY - this.height;
                        }
                    }),
                )
            );
        }

        if (this.windowMouseDownFlag && this.resizable) {
            this.resizeWindow(event);
        } else {
            this.onMove.emit({...this});
        }

        let x = event.clientX;
        let y = event.clientY;

        let leftBorderX = Math.abs(this.left - x) <= this.borderWidth;
        let rightBorderX = Math.abs(this.left + this.width - x) <= this.borderWidth;
        let rightLeftBorderY = (y > this.top) && (y < (this.top + this.height));


        let topBorderY = Math.abs(this.top - y) <= this.borderWidth;
        let bottomBorderY = Math.abs(this.top + this.height - y) <= this.borderWidth;
        let topBottomBorderX = x > this.left && x < this.left + this.width;

        if (this.resizable) {
            if (leftBorderX && bottomBorderY) {
                this.cursorStyle = 'sw-resize';
                this.border = {
                    isLeft: true,
                    isBottom: true,
                }
                this.contentScrollable = true;
            } else if (rightBorderX && bottomBorderY) {
                this.cursorStyle = 'se-resize';
                this.border = {
                    isRight: true,
                    isBottom: true,
                }
                this.contentScrollable = true;
            } else if (leftBorderX && topBorderY) {
                this.cursorStyle = 'nw-resize';
                this.border = {
                    isLeft: true,
                    isTop: true,
                }
                this.contentScrollable = true;
            } else if (rightBorderX && topBorderY) {
                this.cursorStyle = 'ne-resize';
                this.border = {
                    isRight: true,
                    isTop: true,
                }
                this.contentScrollable = true;
            } else if (leftBorderX && rightLeftBorderY) {
                this.cursorStyle = 'w-resize';
                this.border = {
                    isLeft: true,
                }
                this.contentScrollable = true;
            } else if (rightBorderX && rightLeftBorderY) {
                this.cursorStyle = 'e-resize';
                this.border = {
                    isRight: true,
                }
                this.contentScrollable = true;
            } else if (topBorderY && topBottomBorderX) {
                this.cursorStyle = 'n-resize';
                this.border = {
                    isTop: true,
                }
                this.contentScrollable = true;
            } else if (bottomBorderY && topBottomBorderX) {
                this.cursorStyle = 's-resize';
                this.border = {
                    isBottom: true,
                }
                this.contentScrollable = true;
            } else {
                this.border = {};
                this.cursorStyle = 'auto';
                this.contentScrollable = false;
            }
        }
    }

    resizeWindow(event: MouseEvent) {
        if (!this.draggable) {
            return;
        }
        if (this.dragging) {
            return;
        }
        if (!this.border.isLeft && !this.border.isRight && !this.border.isTop && !this.border.isBottom) {
            return;
        }
        if (this.border.isLeft) {
            if (this.align.toLocaleLowerCase().includes('left')) {
                let r = this.right;
                this.updateOffsetX(event.clientX);
                this.width = r - this.left;
            } else {
                this.width = this.right - event.clientX;
            }
        }
        if (this.border.isRight) {
            if (this.align.toLocaleLowerCase().includes('left')) {
                this.width += event.clientX - this.right;
            } else {
                this.width += event.clientX - this.right;
                this.updateOffsetX(Math.max(window.innerWidth - event.clientX, 0));
            }
        }
        if (this.border.isTop) {
            if (this.align.toLocaleLowerCase().includes('top')) {
                let b = this.bottom;
                this.updateOffsetY(Math.max(event.clientY, 0));
                this.height = b - this.top;
            } else {
                this.height = this.bottom - event.clientY;
            }
        }
        if (this.border.isBottom) {
            if (this.align.toLocaleLowerCase().includes('top')) {
                this.height += event.clientY - this.bottom;
            } else {
                this.height += event.clientY - this.bottom;
                this.updateOffsetY(Math.max(window.innerHeight - event.clientY, 0));
            }
        }

        if (this.height < this.minHeight) {
            this.height = this.minHeight;
        }
        if (this.width < this.minWidth) {
            this.width = this.minWidth;
        }
        if (!this.outOfBounds && this.height + this.offsetY > window.innerHeight) {
            this.updateOffsetY(Math.max(window.innerHeight - this.height, 0));
        }
        if (!this.outOfBounds && this.width + this.offsetX > window.innerWidth) {
            this.updateOffsetX(Math.max(window.innerWidth - this.width, 0));
        }
        if(this.offsetY < 0) {
            this.updateOffsetY(0);
        }
        this.onResize.emit(this.windowSize);
    }

    titleBarMouseDown(event: MouseEvent) {
        if (event.button === 2) {
            return;
        }
        this.dragging = true;
        this.clickedX = event.clientX - this.left;
        this.clickedY = event.clientY - this.top;
    }

    @HostListener('document:mouseup', ['$event']) titleBarMouseUp(event: MouseEvent) {
        this.dragging = false;
        this.windowMouseDownFlag = false;
    }

    windowMouseEnter(event: MouseEvent) {
        if (!this.draggable) {
            return;
        }
        this.mouseEntered = event;
        this.windowMouseEnterFlag = true;
        this.windowMouseLeaveFlag = false;
    }

    windowMouseDown(event: MouseEvent) {
        this.windowService.selectedWindow = this.windowId;
        if (!this.draggable || event.button === 2) {
            return;
        }
        this.windowMouseDownFlag = true;
        this.onSelected.emit(this.windowId);
        if (this.windowMouseDownFlag && this.windowMouseEnterFlag) {
            this.zIndex = this.windowService.maxZIndex++;
        }
    }

    windowMouseLeave(event: MouseEvent) {
        if (!this.draggable) {
            return;
        }
        this.windowMouseLeaveFlag = true;
        this.windowMouseEnterFlag = false;
    }

    @Output('onReady') onReady = new EventEmitter<Ng2WindowComponent>();
    @Output('onClose') onClose = new EventEmitter<string>();
    @Output('onResize') onResize = new EventEmitter<WindowSize>();
    @Output('onMaximize') onMaximize = new EventEmitter<WindowSize>();
    @Output('onMaximizeRestore') onMaximizeRestore = new EventEmitter<WindowSize>();
    @Output('onMinimize') onMinimize = new EventEmitter<WindowSize>();
    @Output('onMinimizeRestore') onMinimizeRestore = new EventEmitter<WindowSize>();
    @Output('onSelected') onSelected = new EventEmitter<string>();
    @Output('onMove') onMove = new EventEmitter<WindowSize>();

    close() {
        if (this.closable) {
            this.height = 0;
            window.onresize = null;
            this.toggleBodyScrollable(true);
            this.display = 'none';
            this.onClose.emit(this.windowId);
        }
    }

    minimized = false;
    maximized = false;

    propertyBeforeMaximize: WindowSize = null;

    minimize() {
        window.onresize = null;
        if (this.minimized) {
            this.minimized = false;
            this.display = 'block';
            this.windowService.dockComponentRef.instance.docks =
                this.windowService.dockComponentRef.instance.docks.filter(win => win != this);
            this.onMinimizeRestore.emit(this.windowSize);
        } else {
            this.toggleBodyScrollable(true);

            this.minimized = true;
            setTimeout(() => {
                this.display = 'none';
            }, 200);
            this.windowService.addMinimizeItem(this);
            this.onMinimize.emit(this.windowSize);
        }
        this.onResize.emit(this.windowSize);
    }

    maximize(): Promise<boolean> {
        return new Promise<boolean>(resolve => {
            if (this.maximized) {
                this.toggleBodyScrollable(true);
                window.onresize = null;
                this.maximized = false;
                const {width, height, offsetX, offsetY} = this.propertyBeforeMaximize;
                this.width = width;
                this.height = height;
                this.updateOffsetX(offsetX);
                this.updateOffsetY(offsetY);
                this.draggable = true;
                this.onResize.emit(this.windowSize);
                this.onMaximizeRestore.emit(this.windowSize);
                resolve(true);
            } else {
                this.toggleBodyScrollable(false);
                this.maximized = true;
                window.onresize = () => {
                    this.width = window.innerWidth;
                    this.height = window.innerHeight;
                    this.updateOffsetX(0);
                    this.updateOffsetY(0);
                };
                setTimeout(() => {
                    this.propertyBeforeMaximize = {...this};
                    this.updateOffsetX(0);
                    this.updateOffsetY(0);
                    this.height = window.innerHeight;
                    this.width = window.innerWidth;
                    this.draggable = false;
                    this.onResize.emit(this.windowSize);
                    this.onMaximize.emit(this.windowSize);
                    resolve(true);
                }, 200);
            }
        })
    }

    //if html window resized, judge if window is out of screen, if so, move it to the screen
    @HostListener('window: resize', ['$event'])
    resizeListener(event: Event) {
        if (this.offsetY + this.height > window.innerHeight) {
            this.updateOffsetY(Math.max(window.innerHeight - this.height, 0));
        }
        if (this.offsetX + this.width > window.innerWidth) {
            this.updateOffsetX(Math.max(window.innerWidth - this.width, 0));
        }
        this.onResize.emit(this.windowSize);
    }

    get selected() {
        return this.windowService.selectedWindow === this.windowId;
    }

    toggleBodyScrollable(scrollable = true) {
        setTimeout(() => {
            if (scrollable) {
                document.body.style.overflow = 'auto';
            } else {
                document.body.style.overflow = 'hidden';
            }
        }, 200);
    }

    @ViewChild('titleBar', {static: false}) set titleBar(titleBar: ElementRef) {
        this.titleHeight = titleBar.nativeElement.offsetHeight;
    }
    async ngAfterViewInit(): Promise<void> {
        if (this.maximized) {
            this.display = 'none';
            this.maximized = false;
            await this.maximize();
            this.display = 'block';
            this.loading.set(false)
        } else {
            this.display = 'block';
            this.loading.set(false);
        }
        this.onReady.emit(this);
        this.updateOffsetX(this.offsetX);
        this.updateOffsetY(this.offsetY);
    }
}
