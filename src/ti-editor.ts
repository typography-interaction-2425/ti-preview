import { css as cssLang } from "@codemirror/lang-css";
import { html as htmlLang } from "@codemirror/lang-html";
import { EditorState, Extension } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { minimalSetup } from "codemirror";
import { LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { css } from 'lit';

@customElement("ti-editor")
export class TiEditor extends LitElement {
   static override styles = css`
      :host {
         padding: 8px;
         display: block;
         
         & .cm-editor {
            height: 100%;
         }

         & .cm-focused {
            outline: none;
         }
      }
   `;

	view?: EditorView;

	@property()
	file: string | null = null;

	@property()
	code: string = "";

	private getLang() {
		return this.file?.split(".").pop();
	}

	private createState() {
		const extensions: Extension[] = [minimalSetup, EditorView.updateListener.of(() => this.onUpdate())];

		const lang = this.getLang();

		if (lang === "html") {
			extensions.push(htmlLang());
		}

		if (lang === "css") {
			extensions.push(cssLang());
		}

		return EditorState.create({
			doc: this.code,
			extensions,
		});
	}

	private onUpdate() {
		this.dispatchEvent(
			new CustomEvent("code-change", {
				detail: {
					file: this.file,
					code: this.view!.state.doc.toString(),
				},
			})
		);
	}

	override connectedCallback() {
		super.connectedCallback();

		this.view = new EditorView({
			root: this.shadowRoot!,
			parent: this,
		});

		this.view?.setState(this.createState());
	}

	override disconnectedCallback() {
		super.disconnectedCallback();

		this.view?.destroy();
	}

	override render() {
		if (this.code !== this.view!.state.doc.toString()) {
			this.view?.setState(this.createState());
		}

		return this.view?.dom;
	}
}
