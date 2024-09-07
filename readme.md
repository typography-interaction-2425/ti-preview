# TI Editor

## Installation

- Install the Web Component `npm install @parsons/ti-preview`

- Either import / bundle it in your JS:

```js
import "@parsons/ti-preview";
```

- Or use the pre-bundled static file directly in your HTML:

```html
<script src="./node_modules/@parsons/ti-preview/dist/bundled/index.js" type="module" />
```

## Usage

Wrap code snippets in a figure inside of ti-preview:

```html
<ti-preview>
	<figure>
		<pre>body { background-color: red; }</pre>
		<figcaption>style.css</figcaption>
	</figure>
</ti-preview>
```

### Properties

| Attribute     | Description                          | Default |
| ------------- | ------------------------------------ | ------- |
| `readonly`    | Prevent the code from being changed  | `false` |
| `hide-tabs`   | Don't render the file selection tabs | `false` |
| `hide-output` | Don't render the output preview      | `false` |

### Filenames / Syntax highlighting

When using the `<figure><pre/><figcaption/></figure>` structure, the component will use the contents of the figcaption to determine the language to highlight the code in.

When using a `<pre/>` directly, you can either set the filename through the `data-filename` attribute, or omit the filename and control the highlighting through a language class `class="language-css"`.

Currently only HTML and CSS are supported as languages.

## Examples

See the [demo folder](https://github.com/typography-interaction-2425/ti-preview/tree/main/demo) for various examples of how to use this.

## Development

You can use `pnpm build:watch` to create new dist builds whenever something changes, and `pnpm start` to render the demos live.
