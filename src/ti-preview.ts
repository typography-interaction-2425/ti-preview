import dedent from "dedent";
import { LitElement, css, html, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";

@customElement("ti-preview")
export class TiPreview extends LitElement {
	static override styles = css`
		:host {
			--container-border-radius: 4px;

			--tab-bar-active-background: var(--editor-background);
			--tab-bar-active-border-radius: initial;
			--tab-bar-active-foreground: var(--tab-bar-foreground);
			--tab-bar-active-highlight: #dcc193;
			--tab-bar-active-inset: calc(100% - 2px) 0 0;
			--tab-bar-active-weight: normal;
			--tab-bar-background: var(--output-background);
			--tab-bar-filter: none;
			--tab-bar-font-family: system-ui, sans-serif;
			--tab-bar-font-size: 12px;
			--tab-bar-foreground: #acb2be;
			--tab-bar-margin: initial;
			--tab-bar-padding: 8px 12px;

			--output-background: #22252a;
			--output-border: 2px solid var(--editor-background);

			--editor-background: #292c33;
			--editor-caret-color: #acb2be;
			--editor-font-family: monospace;
			--editor-font-size: inherit;
			--editor-line-height: 1.2;
			--editor-padding: 8px;
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
			--syntax-whitespace: transparent;
		}

		.container {
			all: initial;
			display: flex;
			border-radius: var(--container-border-radius);
			overflow: hidden;
			width: 100%;
			position: relative;
			height: 100%;

			/* Type rendering. */
			-moz-osx-font-smoothing: grayscale;
			-webkit-font-smoothing: antialiased;
			-webkit-text-size-adjust: none;
			font-kerning: normal;
			font-smooth: always;
			text-rendering: optimizeLegibility;
		}

		.code {
			background: var(--editor-background);
			display: flex;
			flex-direction: column;
			height: 100%;
			overflow: scroll;
			scrollbar-width: none;
			width: 100%;

			&::-webkit-scrollbar {
				display: none;
			}

			.resize-handle {
				display: none;
			}

			&.has-output {
				width: 60%;
				min-height: 200px;
				position: relative;

				.resize-handle {
					cursor: ew-resize;
					position: absolute;
					bottom: 0;
					right: 0;
					width: 4px;
					height: 100%;
					background-color: red;
					z-index: 2;
					display: block;
				}
			}

			&.light {
				color-scheme: light;
			}

			&.dark {
				color-scheme: dark;
			}
		}

		ti-editor {
			flex-grow: 1;
		}

		ti-output {
			flex-grow: 1;
			flex-basis: 0;
			min-width: 180px;
		}
	`;

	@property()
	current: string | null = null;

	@state()
	files: Map<string, string> = new Map();

	@property({ type: Boolean })
	readonly = false;

	@property({ type: Boolean })
	"hide-output" = false;

	@property({ type: Boolean })
	"hide-tabs" = false;

	@property({ type: Boolean })
	dedent = false;

	@property()
	base: string | null = null;

	@property()
	"theme" = "dark";

	@state()
	width: number | null = null;
	dragging = false;

	override connectedCallback() {
		super.connectedCallback();
		this.updateFiles();
	}

	private get fileNames() {
		return Array.from(this.files.keys());
	}

	private codeElements() {
		return Array.from(this.querySelectorAll("& > pre, & > figure:has(pre):has(figcaption)"));
	}

	private codeSnippets(): [string, string][] {
		return this.codeElements().map((el, index) => {
			if (el.tagName === "FIGURE") {
				const figcaption = el.querySelector("figcaption")!;
				const pre = el.querySelector("pre")!;

				return [figcaption.innerText, this.dedent ? dedent(pre.innerText) : pre.innerText.trim()];
			}

			const pre = el as HTMLPreElement;
			let filename = pre.dataset.filename;

			if (!filename) {
				let ext;

				// Some markdown renderers will nest a <code> inside the <pre> for code blocks
				const classEl = pre.querySelector("code") ?? pre;

				for (const className of classEl.classList) {
					if (className.startsWith("language-")) {
						ext = className.split("language-")[1]!;
						break;
					}
				}

				filename = `example-${index + 1}.${ext}`;
			}

			return [filename, this.dedent ? dedent(pre.innerText) : pre.innerText.trim()];
		});
	}

	private updateFiles() {
		const snippets = this.codeSnippets();
		this.files = new Map(snippets);
		this.current ??= snippets[0][0];
	}

	private setCurrent(event: CustomEvent) {
		this.current = event.detail.file as string;
	}

	private onCodeChange(event: CustomEvent) {
		const { file, code } = event.detail as { file: string; code: string };

		if (this.files.get(file) !== code) {
			this.files.set(file, code);
			this.requestUpdate();
		}
	}

	private get outputCode() {
		return `
         <!doctype html>
         <html>
            <head>
               <style>
                  ${Array.from(this.files.entries())
										.filter(([filename]) => filename.endsWith(".css"))
										.map(([, code]) => unsafeCSS(code))
										.join("")}
               </style>
            </head>
            <body>
               ${Array.from(this.files.entries())
									.filter(([filename]) => filename.endsWith(".html"))
									.map(([, code]) => code)
									.join("")}
            </body>
         </html>
		`;
	}

	private onResizePointerDown() {
		this.dragging = true;
		this.addEventListener("pointerup", this.onResizePointerUp);
		this.addEventListener("pointermove", this.onResizePointerMove);
	}

	private onResizePointerUp() {
		this.dragging = false;
		this.removeEventListener("pointerup", this.onResizePointerUp);
		this.removeEventListener("pointermove", this.onResizePointerMove);
	}

	private onResizePointerMove(e: any) {
		if (!this.dragging) return;

		if (this.width !== null) {
			this.width = this.width + e.movementX;
		} else {
			this.width = e.clientX;
		}
	}

	private resetWidth() {}

	override render() {
		if (this.theme !== "light" && this.theme !== "dark") {
			throw new Error(`Theme has to be one of light, dark. Given: ${this.theme}`);
		}

		return html`
			<div class="container">
				<div
					class="code ${this.theme} ${this["hide-output"] ? "" : "has-output"}"
					style="${this.width ? `width: ${this.width}px` : ""}"
				>
					${this["hide-tabs"]
						? ""
						: html`
								<ti-tabs
									current="${this.current}"
									files="${this.fileNames.join(",")}"
									@set-current="${this.setCurrent}"
								></ti-tabs>
						  `}

					<ti-editor
						file="${this.current}"
						code="${this.current ? this.files.get(this.current) : ""}"
						theme="${this.theme}"
						?readonly="${this.readonly}"
						@code-change="${this.onCodeChange}"
					></ti-editor>

					<div class="resize-handle" @pointerdown="${this.onResizePointerDown}" @dblclick="${this.resetWidth}"></div>
				</div>

				${this["hide-output"]
					? ""
					: html`
							<ti-output base="${this.base}" code="${this.outputCode}"></ti-output>
					  `}
			</div>
		`;
	}
}
