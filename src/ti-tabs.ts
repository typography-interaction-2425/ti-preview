import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";

@customElement("ti-tabs")
export class TiTabs extends LitElement {
	static override styles = css`
		:host {
			-webkit-backdrop-filter: var(--tab-bar-filter);
			backdrop-filter: var(--tab-bar-filter);
			background: var(--tab-bar-background);
			display: block;
			margin: var(--tab-bar-margin);
			position: sticky;
			top: 0;
			z-index: 1;
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
			position: relative;
			text-decoration: none;

			&:hover, &.active {
				background: var(--tab-bar-active-background);
			}

			&.active {
				color: var(--tab-bar-active-foreground);
				font-weight: var(--tab-bar-active-weight);
			}

			&.active::after {
				background: var(--tab-bar-active-highlight);
				border-radius: var(--tab-bar-active-border-radius);
				content: "";
				inset: var(--tab-bar-active-inset);
				position: absolute;
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
