import { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

import "@danwulff/ds-button";

const meta: Meta = {
  title: "Button",
  component: "ds-button",
};
export default meta;

type Story = StoryObj;

export const Primary: Story = {
  render: () => html`<ds-button></ds-button>`,
};
