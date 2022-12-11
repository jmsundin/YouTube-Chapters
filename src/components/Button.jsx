import React from 'react';
import './Button.css';

const Button = (props) => {
  return (
    <button
      type={props.type}
      onClick={props.onClick}
      disabled={props.disabled}
      className="button"
    >
      {props.children}
    </button>
  );
};

export default Button;