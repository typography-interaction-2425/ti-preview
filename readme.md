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

### Theming

The following CSS variables can be overridden on `ti-preview`:

```css
--code-background: #292c33;

--tab-bar-background: var(--output-background);
--tab-bar-active-highlight: #dcc193;
--tab-bar-active-background: var(--code-background);
--tab-bar-foreground: #acb2be;

--output-background: #22252a;
--output-border: 2px solid var(--code-background);

--editor-font: monospace;
--editor-caret-color: #acb2be;
--editor-selection-background: #343841;

--syntax-text: #acb2be;
--syntax-link: #c678dd;
--syntax-heading: #e06c75;
--syntax-emphasis: #acb2be;
--syntax-strong: #acb2be;
--syntax-keyword: #c678dd;
--syntax-atom: #d19a66;
--syntax-bool: #d19a66;
--syntax-url: #56b6c2;
--syntax-labelName: #61afef;
--syntax-inserted: #98c379;
--syntax-deleted: #e06c75;
--syntax-literal: #acb2be;
--syntax-string: #98c379;
--syntax-number: #e5c07b;
--syntax-variableName: #61afef;
--syntax-typeName: #e5c07b;
--syntax-namespace: #e5c07b;
--syntax-className: #e5c07b;
--syntax-macroName: #e06c75;
--syntax-propertyName: #e06c75;
--syntax-operator: #56b6c2;
--syntax-comment: #7d8799;
--syntax-meta: #7d8799;
--syntax-punctuation: #acb2be;
--syntax-invalid: #ffffff;
```

### Filenames / Syntax highlighting

When using the `<figure><pre/><figcaption/></figure>` structure, the component will use the contents of the figcaption to determine the language to highlight the code in.

When using a `<pre/>` directly, you can either set the filename through the `data-filename` attribute, or omit the filename and control the highlighting through a language class `class="language-css"`.

Currently only HTML and CSS are supported as languages.

## Examples

See the [demo folder](https://github.com/typography-interaction-2425/ti-preview/tree/main/demo) for various examples of how to use this.

## Development

You can use `pnpm build:watch` to create new dist builds whenever something changes, and `pnpm start` to render the demos live.
