import React, { useState } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

// CSS Modules, react-datepicker-cssmodules.css
// import 'react-datepicker/dist/react-datepicker-cssmodules.css';

const Example = ({selected, onSelect, onChange}) => {
  return (
    <DatePicker selected={selected} onSelect={onSelect} onChange={onChange} />
  );
};

export default Example