import type { Meta, StoryObj } from '@storybook/vue3';
import { setup } from '@storybook/vue3';
import List from '../pages/Events/components/List.vue';
import Scheduler from '../pages/Events/components/Scheduler.vue';

import '../style.css';

import { createPinia } from 'pinia';

const pinia = createPinia();

setup((app: App) => {
  app.use(pinia);
});

const meta: Meta<typeof List> = {
  component: List,
};

export default meta;
type Story = StoryObj<typeof List>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/vue/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  render: () => ({
    components: { List, Scheduler },
    template: '<Scheduler /> <List />',
  }),
};
