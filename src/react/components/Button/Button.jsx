import React from "react";
import PropTypes from "prop-types";

export const Button = ({ primary = false, size = "medium", label, onClick, ...props }) => {
  const baseClass = "ds-button";
  const classes = [
    baseClass,
    primary ? `${baseClass}--primary` : `${baseClass}--secondary`,
    size ? `${baseClass}--${size}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type="button" className={classes} onClick={onClick} {...props}>
      {label}
    </button>
  );
};

// Définir propTypes pour faciliter la génération de Web Components
Button.propTypes = {
  primary: PropTypes.bool,
  size: PropTypes.oneOf(["small", "medium", "large"]),
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

export default Button;
