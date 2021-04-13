import { FormControl, InputLabel, OutlinedInput } from "@material-ui/core";
import { useEffect, useState } from "react";

export default function TextBox({ placeholder, id, handleChange, data }) {

  const [value, updateValue] = useState(data[id]);

  const onChange = (input) => {
    updateValue(input);
  }

  useEffect(() => {
    handleChange(id, value);
  }, [value])

  return (
    <FormControl fullWidth variant="outlined">
      <InputLabel htmlFor={id}>{placeholder}</InputLabel>
      <OutlinedInput
        id={id}
        value={value}
        onChange={e => onChange(e.target.value)}
        labelWidth={placeholder.length * 8}
      />
    </FormControl>
  );
}