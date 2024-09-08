import type { PropertyValueMap } from "lit";
import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";

@customElement("ti-output")
export class TiOutput extends LitElement {
	static override styles = css`
		:host {
			display: block;
			border: var(--output-border);
			border-left: 0;
			position: relative;
         background: var(--output-background);
		}

		iframe {
			margin: 0;
			inline-size: 100%;
			block-size: 100%;
			display: block;
			border: 0;
		}

		p {
			position: absolute;
			margin: 0;
			inset-inline-start: 4px;
			inset-block-end: 4px;
			font-family: monospace;
			font-variant-numeric: tabular-nums;
         font-size: 12px;
         background-color: #ffffffaa;
         backdrop-filter: blur(5px);
         padding: 3px 5px;

			&.hidden {
				animation: fade-out 200ms forwards;
			}
		}

		@keyframes fade-out {
			from {
				opacity: 1;
			}
			to {
				opacity: 0;
			}
		}
	`;

	@property()
	code: string = "";

	private iframe = document.createElement("iframe");
	private ro = new ResizeObserver((entries) => this.onResize(entries));

	@state()
	protected inlineSize = 0;

	@state()
	protected blockSize = 0;

	@state()
	protected dimensionsVisible = false;

	private dimensionsTimeout: number | undefined;

	private onResize(entries: ResizeObserverEntry[]) {
		const { blockSize, inlineSize } = entries[0].contentBoxSize[0];

		this.inlineSize = Math.round(inlineSize);
		this.blockSize = Math.round(blockSize);

		this.dimensionsVisible = true;

		clearTimeout(this.dimensionsTimeout);
		this.dimensionsTimeout = setTimeout(() => (this.dimensionsVisible = false), 2000);
	}

	constructor() {
		super();
		this.ro.observe(this);
	}

	private get sanitized() {
		return this.code.replaceAll(/<link.*>/gm, "");
	}

	override update(changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>) {
		if (this.code !== changedProperties.get("code")) {
			this.iframe.srcdoc = this.sanitized;
		}

		super.update(changedProperties);
	}

	override render() {
		return html`
			${this.iframe}
			<p class="${classMap({ hidden: !this.dimensionsVisible })}">${this.inlineSize}px &times; ${this.blockSize}px</p>
		`;
	}
}
