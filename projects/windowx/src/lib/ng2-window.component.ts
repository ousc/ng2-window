import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    OnInit,
    Output,
    TemplateRef,
    ViewChild
} from '@angular/core';
import {Ng2WindowService, WindowConfig} from "./ng2-window.service";
import {In, when} from "when-case";

interface WindowSize {
    offsetY: number;
    offsetX: number;
    align: 'leftTop' | 'rightTop' | 'leftBottom' | 'rightBottom';
    width: number;
    height: number;
}

@Component({
    selector: 'ng-window',
    templateUrl: 'ng2-window.component.html'
})
export class Ng2WindowComponent implements OnInit, AfterViewInit {
    windowId = 'window' + Math.floor(Math.random() * 1000000);

    @Input() width: number = 600;
    @Input() height: number = 400;
    @Input() minWidth: number = 175;
    @Input() minHeight: number = 100;
    @Input() offsetY: number = 200;
    @Input() offsetX: number = 200;
    @Input() loading = true; // is loading
    @Input() theme: 'light' | 'dark' = 'light';

    get themeSuffix() {
        return this.theme === 'dark' ? '-dark' : '';
    }

    @Input() language: 'zh' | 'en' = 'zh';
    loadingTip: string | TemplateRef<any> = this.getLocaleText('loading');

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

    contentScrollable: boolean = false;

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

    @Input() align: 'leftTop' | 'rightTop' | 'leftBottom' | 'rightBottom' = 'leftTop';

    @Input() title: string | TemplateRef<any> = 'Window Name';
    titleHeight = 0;
    @Input() bodyStyle: any = {};
    @Input() zIndex = 0;
    @Input() icon: string | TemplateRef<any> | null = null;
    content: TemplateRef<any> | string;

    @Input() closeOnNavigation = false; //是否在页面路由变化时关闭窗口
    @Input() closable = true; //是否允许关闭窗口

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

    isLeftBorder: boolean;
    isRightBorder: boolean;
    isTopBorder: boolean;
    isBottomBorder: boolean;

    windowChange = new EventEmitter<WindowConfig>();

    constructor(private windowService: Ng2WindowService) {
    }

    async ngOnInit(): Promise<void> {
        if (this.maximized) {
            this.display = 'none';
            this.maximized = false;
            await this.maximize();
            this.display = 'block';
            this.loading = false;
        } else {
            this.display = 'block';
            this.loading = false;
        }
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
                        () => Math.max(event.clientX - this.clickedX, 0)),
                    In('rightTop', 'rightBottom',
                        () => Math.max(window.innerWidth - event.clientX + this.clickedX - this.width, 0))
                )
            );
            this.updateOffsetY(
                when(this.align)(
                    In('leftTop', 'rightTop', () => Math.max(event.clientY - this.clickedY, 0)),
                    In('leftBottom', 'rightBottom', () => Math.max(window.innerHeight - event.clientY + this.clickedY - this.height)),
                )
            );
        }

        if (this.windowMouseDownFlag) {
            this.resizeWindow(event);
        }

        let x = event.clientX;
        let y = event.clientY;

        let leftBorderX = Math.abs(this.left - x) <= this.borderWidth;
        let rightBorderX = Math.abs(this.left + this.width - x) <= this.borderWidth;
        let rightLeftBorderY = (y > this.top) && (y < (this.top + this.height));


        let topBorderY = Math.abs(this.top - y) <= this.borderWidth;
        let bottomBorderY = Math.abs(this.top + this.height - y) <= this.borderWidth;
        let topBottomBorderX = x > this.left && x < this.left + this.width;

        if (leftBorderX && bottomBorderY) {
            this.cursorStyle = 'sw-resize';
            this.isLeftBorder = true;
            this.isBottomBorder = true;
            this.contentScrollable = true;
        } else if (rightBorderX && bottomBorderY) {
            this.cursorStyle = 'se-resize';
            this.isRightBorder = true;
            this.isBottomBorder = true;
            this.contentScrollable = true;
        } else if (leftBorderX && topBorderY) {
            this.cursorStyle = 'nw-resize';
            this.isLeftBorder = true;
            this.isTopBorder = true;
            this.contentScrollable = true;
        } else if (rightBorderX && topBorderY) {
            this.cursorStyle = 'ne-resize';
            this.isTopBorder = true;
            this.isRightBorder = true;
            this.contentScrollable = true;
        } else if (leftBorderX && rightLeftBorderY) {
            this.cursorStyle = 'w-resize';
            this.isLeftBorder = true;
            this.contentScrollable = true;
        } else if (rightBorderX && rightLeftBorderY) {
            this.cursorStyle = 'e-resize';
            this.isRightBorder = true;
            this.contentScrollable = true;
        } else if (topBorderY && topBottomBorderX) {
            this.cursorStyle = 'n-resize';
            this.isTopBorder = true;
            this.contentScrollable = true;
        } else if (bottomBorderY && topBottomBorderX) {
            this.cursorStyle = 's-resize';
            this.isBottomBorder = true;
            this.contentScrollable = true;
        } else {
            this.isLeftBorder = false;
            this.isRightBorder = false;
            this.isTopBorder = false;
            this.isBottomBorder = false;
            this.cursorStyle = 'auto';
            this.contentScrollable = false;
        }
        this.windowChange.emit({...this});
    }

    resizeWindow(event: MouseEvent) {
        if (!this.draggable) {
            return;
        }
        if (this.dragging) {
            return;
        }
        if (!this.isLeftBorder && !this.isRightBorder && !this.isTopBorder && !this.isBottomBorder) {
            return;
        }
        if (this.isLeftBorder) {
            if (this.align.toLocaleLowerCase().includes('left')) {
                let r = this.right;
                this.updateOffsetX(event.clientX);
                this.width = r - this.left;
            } else {
                this.width = this.right - event.clientX;
            }
        }
        if (this.isRightBorder) {
            if (this.align.toLocaleLowerCase().includes('left')) {
                this.width += event.clientX - this.right;
            } else {
                this.width += event.clientX - this.right;
                this.updateOffsetX(Math.max(window.innerWidth - event.clientX, 0));
            }
        }
        if (this.isTopBorder) {
            if (this.align.toLocaleLowerCase().includes('top')) {
                let b = this.bottom;
                this.updateOffsetY(Math.max(event.clientY, 0));
                this.height = b - this.top;
            } else {
                this.height = this.bottom - event.clientY;
            }
        }
        if (this.isBottomBorder) {
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
        this.windowChange.emit({...this});
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

    @Output('onClose') onClose = new EventEmitter<string>();
    @Output('onResize') onResize = new EventEmitter<WindowSize>();

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

    draggable = true;

    minimize() {
        window.onresize = null;
        if (this.minimized) {
            this.minimized = false;
            this.display = 'block';
            this.windowService.dockComponentRef.instance.docks =
                this.windowService.dockComponentRef.instance.docks.filter(win => win != this);
        } else {
            this.toggleBodyScrollable(true);

            this.minimized = true;
            setTimeout(() => {
                this.display = 'none';
            }, 200);
            this.windowService.addMinimizeItem(this);
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
    ngAfterViewInit(): void {
        this.updateOffsetX(this.offsetX);
        this.updateOffsetY(this.offsetY);
    }
}
