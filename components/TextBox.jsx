import { FormControl, InputLabel, OutlinedInput } from "@material-ui/core";
import { useEffect, useState } from "react";

export default function TextBox({ placeholder, id, handleChange, value, textarea }) {

  const onChange = (e) => {
    e.preventDefault();
    
    handleChange(id, e.target.value);
  }

  return (
    <FormControl fullWidth variant="outlined">
      <InputLabel htmlFor={id}>{placeholder}</InputLabel>
      <OutlinedInput
        id={id}
        value={value}
        onChange={e => onChange(e)}
        labelWidth={placeholder.length * 8}
        multiline={textarea}
        rows={2}
        rowsMax={3}
      />
    </FormControl>
  );
}