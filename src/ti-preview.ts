import { LitElement, css, html } from "lit";
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

			return [figcaption.innerText, pre.innerText];
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

	override connectedCallback() {
		super.connectedCallback();
		this.updateFiles();
	}

	override render() {
		return html`
			<ti-files
				current="${this.current}"
				files="${this.fileNames.join(",")}"
				@set-current="${this.setCurrent}"
			></ti-files>
         <ti-editor></ti-editor>
			<slot></slot>
		`;
	}
}
