# TI Editor

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

## Development

You can use `pnpm build:watch` to create new dist builds whenever something changes, and `pnpm start` to render the demos live.
