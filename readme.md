Here is an example `README.md` for `ng2-window`:

# ng2-window

`ng2-window` is a powerful Angular window component, supports drag, resize, full screen, minimize, and various comprehensive window functions. It supports creation through declaration and service methods, complete window lifecycle management, and highly customizable styles.

# screenshot

![screenshot](https://github.com/ousc/angular-windowx/blob/main/src/assets/default.png?raw=true)
![screenshot](https://github.com/ousc/angular-windowx/blob/main/src/assets/macos.png?raw=true)
![screenshot](https://github.com/ousc/angular-windowx/blob/main/src/assets/dark.png?raw=true)

## Installation

To install `ng2-window`, simply run:

```bash
npm install ng2-window --save
```

## Usage

Import `ng2-window` module in your Angular app:

```typescript
import { Ng2WindowModule } from 'ng2-window';
```

Then add `Ng2WindowModule` to your app's module imports:

```typescript
@NgModule({
  imports: [
      Ng2WindowModule
  ]
})
export class AppModule { }
```

Once the module is installed, you can use `WindowService` to create window dynamically:

```typescript
import { Ng2WindowService } from 'ng2-window';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    constructor(private windowService: Ng2WindowService) { }

    windowManager = {
        tpl: {
            visible: false,
            instance: null,
        },
    };
    
    openWindow(ref: TemplateRef<any>) {
        this.windowService.create({
            title: 'Window 1',
            icon: '/assets/logo.png',
            width: 800,
            height: 500,
            content: ref,
            offsetX: 200,
            offsetY: 100,
            align: 'leftTop',
            bodyStyle: {
                lineHeight: '1.5',
            },
        }).then((win: Ng2WindowComponent) => {
            this.windowManager.tpl.instance = win;

            win.onClose.subscribe(() => {
                this.windowManager.tpl.visible = false;
                this.windowManager.tpl.instance = null;
            });
        });
    }
}
```
or use `ng-window` component in your Angular template:

```html
<ng-window [title]="'My window'" [icon]="icon" [width]="800" [height]="600" [offsetX]="100" [offsetY]="100" align="leftTop">
    <ng-template #icon>
        <i class="fa fa-app"></i>
    </ng-template>
  <!-- Window content here -->
</ng-window>
```

## Features

`ng2-window` supports the following features:

- Dragging window to move
- Resizing window to fit content
- Toggling full screen mode
- Minimizing window to task bar
- Comprehensive window functions, such as minimize/maximize/close buttons
- Complete window lifecycle management, including opening/closing, focusing, and activation tracking
- Highly customizable styles, with support for customizing window appearance and behavior

## API

### `ax-window` Component

#### Inputs

- `title` (string): Window title
- `resizable` (boolean): Whether the window can be resized (default: false)
- `draggable` (boolean): Whether the window can be dragged (default: false)
- `showHeader` (boolean): Whether to show window header (default: true)
- `showFooter` (boolean): Whether to show window footer (default: true)
- `showMinimizeButton` (boolean): Whether to show minimize button (default: true)
- `showMaximizeButton` (boolean): Whether to show maximize button (default: true)
- `showCloseButton` (boolean): Whether to show close button (default: true)
- `showFullScreenButton` (boolean): Whether to show full screen button (default: true)
- `modal` (boolean): Whether the window is modal (default: false)
- `width` (number|string): Optional window width (default: 'auto')
- `height` (number|string): Optional window height (default: 'auto')
- `left` (number|string): Optional window left position (default: 'auto')
- `top` (number|string): Optional window top position (default: 'auto')
- `isOpen` (boolean): Whether the window is open (default: true)

#### Outputs

- `onOpen`: Emitted when the window is opened
- `onClose`: Emitted when the window is closed
- `onMinimize`: Emitted when the window is minimized
- `onMaximize`: Emitted when the window is maximized
- `onRestore`: Emitted when the window is restored
- `onFullScreen`: Emitted when the window enters or exits full screen mode

## Development

To run the demo application:

1. Clone the repository to your local machine.
2. Install dependencies using `npm install`.
3. Start the demo using `npm run start`.

## Contribution

We welcome community contributions and pull requests. To contribute to `ng2-window`, please fork the repository and open a pull request.
