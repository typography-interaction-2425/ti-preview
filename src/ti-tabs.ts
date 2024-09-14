import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";

@customElement("ti-tabs")
export class TiTabs extends LitElement {
	static override styles = css`
		:host {
			background: var(--tab-bar-background);
			display: block;
		}

		nav {
			display: flex;

			&:has(a:only-child) { display: none }
		}

		a {
			color: var(--tab-bar-foreground);
			font-family: var(--tab-bar-font-family);
			font-size: var(--tab-bar-font-size);
			margin: 0;
			padding: var(--tab-bar-padding);
			position: sticky;
			text-decoration: none;
			top: 0;

			&:hover, &.active {
				background: var(--tab-bar-active-background);
			}

			&.active::after {
				content: "";
				position: absolute;
				inset-block: 0;
				inset-inline: 0;
				inline-size: 100%;
				block-size: 2px;
				background: var(--tab-bar-active-highlight);
			}
		}
	`;

	@property()
	current: string | null = null;

	@property()
	files: string = "";

	private get fileNames() {
		return this.files.split(",");
	}

	private handleClick(event: Event) {
		if (event.target === event.currentTarget) return;

		if (event.target instanceof HTMLAnchorElement) {
			const file = event.target.getAttribute("aria-controls");

			if (file) {
				this.dispatchEvent(new CustomEvent("set-current", { detail: { file } }));
				event.preventDefault();
			}
		}
	}

	override connectedCallback() {
		super.connectedCallback();
	}

	override render() {
		return html`
			<nav role="tablist" @click="${this.handleClick}">
				${this.fileNames.map(
					(file) => html`
						<a class="${classMap({ active: file === this.current })}" href="#tab" aria-controls="${file}" role="tab">
							${file}
						</a>
					`
				)}
			</nav>
		`;
	}
}
