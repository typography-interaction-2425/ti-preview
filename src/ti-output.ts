import { LitElement, css } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("ti-output")
export class TiOutput extends LitElement {
	static override styles = css`
		:host {
			display: block;
			padding: 8px;
			border: 2px solid #f6f8fa;
			border-left: 0;
		}

		iframe {
			margin: 0;
			inline-size: 100%;
			block-size: 100%;
			display: block;
			border: 0;
		}
	`;

	@property()
	code: string = "";

	iframe = document.createElement("iframe");

	constructor() {
		super();
	}

	private get sanitized() {
		return this.code.replaceAll(/<link.*>/gm, "");
	}

	override render() {
		this.iframe.srcdoc = this.sanitized;
		return this.iframe;
	}
}
