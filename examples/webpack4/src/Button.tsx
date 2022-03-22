import React from 'react';
import './Button.css';

export type Props = {
  theme: 'primary' | 'secondary';
  size: 'small' | 'medium' | 'large';
};

export const Button: React.FC<Props> = ({
  theme = 'primary',
  size = 'medium',
  children,
  ...props
}) => {
  return (
    <button
      className={`button button--${theme} button--${size}`}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
};
