import React from 'react';
import styles from'./Button.module.css';

export type Props = {
  theme: 'primary' | 'secondary';
  size: 'small' | 'medium' | 'large';
};

const Button: React.FC<Props> = ({
  theme = 'primary',
  size = 'medium',
  children,
  ...props
}) => {
  return (
    <button
      className={`${styles.base} ${styles[theme]} ${styles[size]}`}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
