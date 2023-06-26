Here is an example `README.md` for `angular-windowx`:

# Angular-Windowx

`angular-windowx` is a powerful Angular window component, supports drag, resize, full screen, minimize, and various comprehensive window functions. It supports creation through declaration and service methods, complete window lifecycle management, and highly customizable styles.

## Installation

To install `angular-windowx`, simply run:

```bash
npm install angular-windowx --save
```

## Usage

Import `angular-windowx` module in your Angular app:

```typescript
import { AngularWindowxModule } from 'angular-windowx';
```

Then add `AngularWindowxModule` to your app's module imports:

```typescript
@NgModule({
  imports: [
    AngularWindowxModule
  ]
})
export class AppModule { }
```

Once the module is installed, you can use `ax-window` component in your Angular template:

```html
<ax-window title="My window" [resizable]="true" [draggable]="true">
  <!-- Window content here -->
</ax-window>
```

## Features

`angular-windowx` supports the following features:

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

We welcome community contributions and pull requests. To contribute to `angular-windowx`, please fork the repository and open a pull request.
