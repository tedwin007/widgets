# @tedwin007/widgets

A TypeScript library for managing the full lifecycle of UI widgets — creation, schema validation, rendering, and serialization — with a small, chainable API.

**[Live playground →](https://main--friendly-sunburst-260760.netlify.app/)**

![Playground](https://github.com/tedwin007/widgets/raw/staging/src/lib/assets/site.png?raw=true)

---

## Why

Frontends that render dynamic, server-driven UI (dashboards, no-code tools, embedded widgets) tend to grow the same tangle: JSON comes in from somewhere, it needs to be validated, instantiated into a runtime object, wired to a DOM node, and later serialized back out. Each team reinvents this plumbing, usually inconsistently.

`@tedwin007/widgets` is a small, opinionated core for that lifecycle. It gives you a `WidgetManager`, a `Widget` runtime object, and a chainable API that keeps validation, rendering, and serialization in one place.

## Features

- Instantiate widgets from JSON with schema validation
- Serialize widget instances back to JSON
- Attach render methods for DOM output
- Bring-your-own schema support
- Built-in error handling and logging

## Install

```bash
npm install @tedwin007/widgets
# or
yarn add @tedwin007/widgets
```

## Usage

```ts
import { WidgetManager, Widget, WidgetSchema } from '@tedwin007/widgets';

const widgetManager = new WidgetManager();

const widgetJson = {
  id: 'widget-123',
  version: '1.0.0',
  config: { theme: 'light', layout: 'fixed' },
  data: { title: 'My Widget', content: 'This is my widget content' },
  widgetProps: { title: 'My Partial Widget' },
};
```

### Validate and render

```ts
widgetManager
  .fromJson(widgetJson, WidgetSchema.Existing)
  .attachRender(this, (element) => {
    element.innerHTML = `<h1>Widget Content</h1>`;
  })
  .render();
```

### Serialize back to JSON

```ts
const serialized = widgetManager.toJson(myWidget);
```

## API

### `WidgetManager`

| Method | Signature |
| --- | --- |
| `fromJson` | `(widget: BaseWidget, schema: WidgetSchema, customSchema?: object) => FromJsonResponse` |
| `toJson` | `(widget: Widget) => ToJsonResult` |

### `Widget`

| Method | Signature |
| --- | --- |
| `setData` | `(data: T) => void` |
| `toJson` | `() => ToJsonResult` |
| `render` | `() => void` |

See inline JSDoc in the source for details.

## Development

```bash
git clone https://github.com/tedwin007/widgets.git
cd widgets
npm install
npm run build
npm test
```

Built with Nx, Vite, and Jest. Linting via ESLint + Prettier.

## Publishing

```bash
npm publish --access public
```

Before publishing, the pipeline automatically:

1. Lints and auto-fixes code style
2. Runs the full test suite
3. Bumps the package version
4. Builds and packs the library

## License

MIT
