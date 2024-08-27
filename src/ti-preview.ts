import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

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

	@property()
	current?: string;

	files: Map<string, string> = new Map();

	codeElements() {
		return Array.from(this.querySelectorAll("figure:has(pre):has(figcaption)"));
	}

	codeSnippets(): [string, string][] {
		return this.codeElements().map((el) => {
			const figcaption = el.querySelector("figcaption")!;
			const pre = el.querySelector("pre")!;

			return [figcaption.innerText, pre.innerText];
		});
	}

	updateFiles() {
		const snippets = this.codeSnippets();
		this.files = new Map(snippets);
		this.current = snippets[0][0];
	}

	override connectedCallback() {
		super.connectedCallback();
		this.updateFiles();
	}

	override render() {
		return html`
			<p>${this.current}</p>
		`;
	}
}
