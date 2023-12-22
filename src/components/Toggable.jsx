/**
 * This component is used to toggle(show/hide) any other component(react element(s))/childs
 * There will be a button which is used to toggle the children passed to this component
 * using the button available.
 */

import { forwardRef, useImperativeHandle } from "react";
import { useState } from "react";
import PropTypes from "prop-types";

const Toggable = forwardRef((props, refs) => {
  const { children, buttonLabel } = props;
  const [isChildVisible, setIsChildVisible] = useState(false);
  const okButtonStyle = { display: isChildVisible ? "none" : "" };
  const cancelButtonStyle = { display: isChildVisible ? "" : "none" };

  useImperativeHandle(refs, () => {
    return {
      toggleVisibility,
    };
  });
  const toggleVisibility = () => {
    setIsChildVisible(!isChildVisible);
  };

  return (
    <div>
      <div style={okButtonStyle}>
        <button onClick={toggleVisibility}>{buttonLabel}</button>
      </div>
      <div style={cancelButtonStyle}>
        {children}
        <br />
        <button onClick={toggleVisibility}>Cancel</button>
      </div>
    </div>
  );
});

Toggable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
};

Toggable.displayName = "Toggable";

export default Toggable;
