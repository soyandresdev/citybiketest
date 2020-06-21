import React from "react";
import PropTypes from "prop-types";

import Menu from "./Types/Menu";
import Bike from "./Types/Bike";

export default function Icons({ type, ...resProps }) {
  return (
    <>
      {{
        Menu: <Menu {...resProps} />,
        Bike: <Bike {...resProps} />,
      }[`${type}`] || <div />}
    </>
  );
}

Icons.propTypes = {
  type: PropTypes.oneOf(["Menu", "Bike"]).isRequired,
};
