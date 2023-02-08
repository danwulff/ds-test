import { html, css, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('ds-button')
export class DSButton extends LitElement {
  static override styles = css`
    button {
      background: black;
      color: white;
    }
  `;

  @property()
  text = "Button";

  override render(): TemplateResult {
    return html`<button>${this.text}</button>`;
  }
}
