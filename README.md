# Widget Manager

Please check out the playground:
[Playground](https://main--friendly-sunburst-260760.netlify.app/)
![Site](src/lib/assets/site.png?raw=true "Site")
To get more insight about creating new widgets, schema validation and process
Or see some basic code implementation in the playground's github repository [WIP]

This is a TypeScript library for managing the lifecycle of widgets including:
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
npm install @tedwin007/widgets --save
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
    id: 'widget-123',
    version: '1.0.0',
    config: {
        theme: 'light',
        layout: 'fixed'
    },
    data: {
        title: 'My Widget',
        content: 'This is my widget content'
    },
    widgetProps: {
        title: 'My Partial Widget'
    },
};
const myWidget = widgetManager.fromJson(widgetJson); 
```

### Validating and Rendering a Widget

```typescript
this.widgetManger
    .fromJson(this.rawWidget, WidgetSchema.Existing)
    .attachRender(this, (element) => element.innerHTML = `<h1>Widget Content</h1>`)
    .render()
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



