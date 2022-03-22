import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Button } from './Button';

export default {
  title: 'Button',
  component: Button,
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = args => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = { theme: 'primary', size: 'medium', children: 'Button' };

export const Secondary = Template.bind({});
Secondary.args = { ...Primary.args, theme: 'secondary' };

export const Large = Template.bind({});
Large.args = { ...Primary.args, size: 'large' };

export const Small = Template.bind({});
Small.args = { ...Primary.args, size: 'small' };
