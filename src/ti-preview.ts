import dedent from "dedent";
import { LitElement, css, html, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";

@customElement("ti-preview")
export class TiPreview extends LitElement {
	static override styles = css`
		:host {
			display: flex;
			border-radius: 4px;
			overflow: hidden;
			width: 100%;
			position: relative;
		}

		.code {
			background-color: #f6f8fa;
			overflow: hidden;
			display: flex;
			flex-direction: column;
			height: 100%;
			resize: both;
         width: 100%;

         &.has-output {
           width: 60%;
           min-height: 200px;
         }
		}

		ti-editor {
			flex-grow: 1;
		}

		ti-output {
			flex-grow: 1;
			flex-basis: 0;
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

				return [figcaption.innerText, dedent(pre.innerText)];
			}

			const pre = el as HTMLPreElement;
			let filename = pre.dataset.filename;

			if (!filename) {
				let ext;

				for (const className of pre.classList) {
					if (className.startsWith("language-")) {
						ext = className.split("language-")[1]!;
						break;
					}
				}

				filename = `example-${index + 1}.${ext}`;
			}

			return [filename, dedent(pre.innerText)];
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
            ${Array.from(this.files.entries())
							.filter(([filename]) => filename.endsWith(".css"))
							.map(([, code]) => unsafeCSS(code))
							.join("")}
         </style>
      `;
	}

	override render() {
		return html`
			<div class="code ${classMap({ "has-output": this["hide-output"] === false })}">
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
					?readonly="${this.readonly}"
					@code-change="${this.onCodeChange}"
				></ti-editor>
			</div>

			${this["hide-output"]
				? ""
				: html`
						<ti-output code="${this.outputCode}"></ti-output>
				  `}
		`;
	}
}
