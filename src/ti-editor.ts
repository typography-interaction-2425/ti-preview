import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("ti-editor")
export class TiEditor extends LitElement {
	static override styles = css`
		:host {
			display: block;
			border: solid 1px gray;
			padding: 16px;
			max-width: 800px;
		}
	`;

	@property()
	name = "World";

	override render() {
		return html`
			<h1>Hello ${this.name}</h1>
		`;
	}
}
