
# Widget Manager

this is a TypeScript library for managing the lifecycle of widgets including:
- Creation
- Validation
- Serialization
- Rendering

## Features

- Create widget instances from JSON with validation.
- Serialize widget instances to JSON.
- Attach render methods to widget instances for UI rendering.
- Support for custom schemas during widget creation.
- Built-in error handling and logging.

## Installation

```sh
npm install widgets --save
```

Or if you are using `yarn`:

```sh
yarn add @tedwin007/widgets
```

## Usage

Import `WidgetManager` and `Widget` into your project:

```typescript
import {WidgetManager, Widget} from '@tedwin007/widgets';
```

### Instantiate & validate a widget

```typescript
const widgetManager = new WidgetManager();
const widgetJson = {
    id: 'test-id',
    version: 'v1',
    config: {
        widgetProps: {
            name: {
                type: 'string'
            }
        }
    }
};
const myWidget = widgetManager.fromJson(widgetJson); 
```

### Validating and Rendering a Widget

```typescript
widgetManager
    .fromJson(widgetJson)
    .attachRender(document.getElementById('widget-container'), context)
    .render();
```

### Serializing a Widget to JSON

```typescript
const widgetToJson = widgetManager.toJson(myWidget);
console.log(widgetToJson);
```

## API

### WidgetManager

- ```fromJson(widget: BaseWidget, schema: WidgetSchema, customSchema?: object): FromJsonResponse```
- `toJson(widget: Widget): ToJsonResult`

### `Widget`

- `setData(data: T): void`
- `toJson(): ToJsonResult`
- `render(): void`

For detailed API usage, please refer to the inline documentation within the code.

## Development

- Clone the repository.
- Install dependencies using `npm install`.
- Build the project using `npm run build`.

## Publish
```shell
npm publish --access public
```
#### This will automatically do the following before publishing the package to npm repository:
- lint & fix code-style
- run tests 
- bump version 
- build & pack
