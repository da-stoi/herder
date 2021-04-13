import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";

export default function Dropdown({ label, id, handleChange, options, data }) {
  
  return (
    <FormControl fullWidth variant="outlined">
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <Select
        labelId={id}
        id={id}
        value={data[id]}
        onChange={e => handleChange(id, e.target.value)}
        labelWidth={label.length * 8}
      >
        <MenuItem value="">
          <em>Select</em>
        </MenuItem>
        {options.map(option => {
          return (<MenuItem value={option.value} key={option.label}>{option.label}</MenuItem>)
        })}
      </Select>
    </FormControl>
  );
}