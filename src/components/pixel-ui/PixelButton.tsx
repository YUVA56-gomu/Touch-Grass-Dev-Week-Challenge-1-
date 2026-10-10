import React from 'react';
import { PixelButtonProps } from '../../types';
import './PixelButton.css';

export const PixelButton: React.FC<PixelButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  isFullWidth = false,
  className = '',
  disabled,
  onClick,
  ...props
}) => {
  const classNames = [
    'pixel-btn',
    `pixel-btn--${variant}`,
    `pixel-btn--${size}`,
    isFullWidth ? 'pixel-btn--full' : '',
    disabled ? 'pixel-btn--disabled' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={classNames}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      <span className="pixel-btn__inner">
        {icon && <span className="pixel-btn__icon" aria-hidden="true">{icon}</span>}
        <span className="pixel-btn__text">{children}</span>
      </span>
    </button>
  );
};
