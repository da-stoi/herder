import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { Checkbox, FormGroup } from '@material-ui/core';
import { useEffect, useState } from 'react';

export default function MultipleChoice({ question, options, id, handleChange, data }) {

  const [state, setState] = useState(data[id]?.value);

  // Update form answers state
  const onChange = (option_id, checked) => {
    setState({ ...state, [option_id]: checked });
  }

  useEffect(() => {
    handleChange(id, state);
  }, [state])

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">{question}</FormLabel>
      <FormGroup aria-label={id} name={id} defaultValue="">
        {options.map(option => {
          return (
            <FormControlLabel
              control={<Checkbox color="primary" checked={state ? state[option.value] : false} onChange={e => onChange(option.value, e.target.checked)} />}
              label={option.label}
            />
          );
        })}
      </FormGroup>
    </FormControl>
  );
}
