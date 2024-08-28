import dedent from "dedent";
import { LitElement, css, html, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";

@customElement("ti-preview")
export class TiPreview extends LitElement {
	static override styles = css`
		:host {
			display: flex;
         border-radius: 4px;
         overflow: hidden;
         min-height: 400px;
         width: 100%;
      }

      .code {
         background-color: #f6f8fa;
         width: 60%;
         overflow: hidden;
         resize: horizontal;
         display: flex;
         flex-direction: column;
      }

      ti-editor {
         flex-grow: 1;
      }

      ti-output {
         flex-grow: 1;
         flex-basis: 0;
      }
	`;

	constructor() {
		super();
		this.updateFiles();
	}

	@property()
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

   private get outputCode() {
      return `
         ${Array.from(this.files.entries())
            .filter(([filename]) => filename.endsWith(".html"))
            .map(([, code]) => code)
            .join("")
         }

         <style>
            ${Array.from(this.files.entries())
               .filter(([filename]) => filename.endsWith(".css"))
               .map(([, code]) => unsafeCSS(code))
               .join("")
            }
         </style>
      `;
   }

	override render() {
		return html`
         <div class="code">
            <ti-tabs
               current="${this.current}"
               files="${this.fileNames.join(",")}"
               @set-current="${this.setCurrent}"
            ></ti-tabs>

            <ti-editor
               file="${this.current}"
               code="${this.current ? this.files.get(this.current) : ""}"
               @code-change="${this.onCodeChange}"
            ></ti-editor>
         </div>

			<ti-output code="${this.outputCode}"></ti-output>
		`;
	}
}
