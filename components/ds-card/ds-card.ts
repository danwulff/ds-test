import { html, css, LitElement, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";

import "@bob/ds-button";

@customElement("ds-card")
export class DSCard extends LitElement {
  static override styles = css`
    div {
      border: 1px solid black;
      border-radius: 8px;
      padding: 8px;
    }
  `;

  override render(): TemplateResult {
    return html`<div><ds-button text="yup"></ds-button></div>`;
  }
}
