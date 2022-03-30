import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import Component from './index';

export default {
  title: 'Button',
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = args => <Component {...args} />;

export const Primary = Template.bind({});
Primary.args = { theme: 'primary', size: 'medium', children: 'Button' };

export const Secondary = Template.bind({});
Secondary.args = { ...Primary.args, theme: 'secondary' };

export const Large = Template.bind({});
Large.args = { ...Primary.args, size: 'large' };

export const Small = Template.bind({});
Small.args = { ...Primary.args, size: 'small' };
