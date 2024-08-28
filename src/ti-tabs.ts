import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";

@customElement("ti-tabs")
export class TiTabs extends LitElement {
   static override styles = css`
      :host {
         background-color: #e8eaed;
         display: block;
      }

      nav {
         display: flex;
      }

      a {
         padding: 8px 12px;
         font-family: system-ui, sans-serif;
         text-decoration: none;
         font-size: 12px;
         color: black;
         margin: 0;
         position: relative;

         &:hover, &.active {
            background-color: #f6f8fa;
         }

         &.active::after {
            content: "";
            position: absolute;
            inset-block: 0;
            inset-inline: 0;
            inline-size: 100%;
            block-size: 2px;
            background-color: #ea8872;
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
