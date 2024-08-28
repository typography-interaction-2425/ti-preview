import dedent from "dedent";
import { LitElement, css, html, unsafeCSS } from "lit";
import { customElement, state } from "lit/decorators.js";

@customElement("ti-preview")
export class TiPreview extends LitElement {
	static override styles = css`
		:host {
			display: block;
			border: solid 1px gray;
			padding: 16px;
			max-width: 800px;
		}
	`;

	constructor() {
		super();
		this.updateFiles();
	}

	@state()
	current: string | null = null;

	@state()
	files: Map<string, string> = new Map();

	private get fileNames() {
		return Array.from(this.files.keys());
	}

	private codeElements() {
		return Array.from(this.querySelectorAll("figure:has(pre):has(figcaption)"));
	}

	private codeSnippets(): [string, string][] {
		return this.codeElements().map((el) => {
			const figcaption = el.querySelector("figcaption")!;
			const pre = el.querySelector("pre")!;

			return [figcaption.innerText, dedent(pre.innerText)];
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

	override render() {
		return html`
			<ti-files
				current="${this.current}"
				files="${this.fileNames.join(",")}"
				@set-current="${this.setCurrent}"
			></ti-files>

			<div id="split">
				<ti-editor
					file="${this.current}"
					code="${this.current ? this.files.get(this.current) : ""}"
					@code-change="${this.onCodeChange}"
				></ti-editor>
				<ti-output>
					<style>
						${Array.from(this.files.entries())
							.filter(([filename]) => filename.endsWith(".css"))
							.map(([, code]) => unsafeCSS(code))}
					</style>

					${Array.from(this.files.entries())
						.filter(([filename]) => filename.endsWith(".html"))
						.map(([, code]) => document.createRange().createContextualFragment(code))}
				</ti-output>
			</div>
		`;
	}
}
