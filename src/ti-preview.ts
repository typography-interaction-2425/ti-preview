import dedent from "dedent";
import { LitElement, css, html, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";

@customElement("ti-preview")
export class TiPreview extends LitElement {
	static override styles = css`
		:host {
			--code-background: #292c33;

			--tab-bar-background: var(--output-background);
			--tab-bar-active-highlight: #dcc193;
			--tab-bar-active-background: var(--code-background);
			--tab-bar-foreground: #acb2be;

			--output-background: #22252a;
			--output-border: 2px solid var(--code-background);

			--editor-font-family: monospace;
			--editor-font-size: inherit;
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
		}

		.container {
			display: flex;
			border-radius: 4px;
			overflow: hidden;
			width: 100%;
			position: relative;
		}

		.code {
			background: var(--code-background);
			overflow: hidden;
			display: flex;
			flex-direction: column;
			height: 100%;
			width: 100%;

			&.has-output {
				width: 60%;
				min-height: 200px;
				resize: both;
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

	constructor() {
		super();
		this.updateFiles();
	}

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

	@property()
	"theme" = "dark";

	@property({ type: Boolean })
	dedent = false;

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

				return [figcaption.innerText, this.dedent ? dedent(pre.innerText) : pre.innerText];
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

			return [filename, this.dedent ? dedent(pre.innerText) : pre.innerText];
		});
	}

	private updateFiles() {
		const snippets = this.codeSnippets();
		this.files = new Map(snippets);
		this.current = snippets[0][0];
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
         ${Array.from(this.files.entries())
						.filter(([filename]) => filename.endsWith(".html"))
						.map(([, code]) => code)
						.join("")}

         <style>
            html { color-scheme: ${this.theme}; }

            ${Array.from(this.files.entries())
							.filter(([filename]) => filename.endsWith(".css"))
							.map(([, code]) => unsafeCSS(code))
							.join("")}
         </style>
      `;
	}

	override render() {
		if (this.theme !== "light" && this.theme !== "dark") {
			throw new Error(`Theme has to be one of light, dark. Given: ${this.theme}`);
		}

		return html`
			<div class="container">
				<div class="code ${this.theme} ${this["hide-output"] ? "" : "has-output"}">
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
				</div>

				${this["hide-output"]
					? ""
					: html`
							<ti-output code="${this.outputCode}"></ti-output>
					  `}
			</div>
		`;
	}
}
