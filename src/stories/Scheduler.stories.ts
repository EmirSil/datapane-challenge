import type { Meta, StoryObj } from '@storybook/vue3';

import Scheduler from '../pages/Events/components/Scheduler.vue';

import '../style.css';

const meta: Meta<typeof Scheduler> = {
  component: Scheduler,
};

export default meta;
type Story = StoryObj<typeof Scheduler>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/vue/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  render: () => ({
    components: { Scheduler },
    template: '<Scheduler />',
  }),
};
