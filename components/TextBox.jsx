import { FormControl, InputLabel, OutlinedInput } from "@material-ui/core";
import { useEffect, useState } from "react";

export default function TextBox({ placeholder, id, handleChange, data, textarea }) {

  const [value, updateValue] = useState(data[id]);

  console.log(data)

  const onChange = (input) => {

    // 220 character limit for text area
    if (textarea && input.length > 230) {
      return;
    }

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
        multiline={textarea}
        rows={2}
        rowsMax={3}
      />
    </FormControl>
  );
}