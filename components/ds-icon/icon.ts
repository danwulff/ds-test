import { html, css, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("ds-icon")
export class DSIcon extends LitElement {
  static override styles = css`
    span {
      color: green;
    }
  `;

  @property()
  icon = "some-icon";

  override render(): TemplateResult {
    return html`<span class=${this.icon}>[]</span>`;
  }
}
