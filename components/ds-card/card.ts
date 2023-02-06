import { css, html, LitElement, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('ds-card')
export class DSCard extends LitElement {
  static override styles = css`
    .container {
      border: 1px solid black;
      border-radius: 4px;
    }
  `;

  override render(): TemplateResult {
    return html`
      <div class="container">
        <ds-icon></ds-icon>
        <ds-button></ds-button>
      </div>
    `;
  }
}
