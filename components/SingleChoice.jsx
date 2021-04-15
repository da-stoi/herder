import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { Button } from '@material-ui/core';
import { useState } from 'react';

export default function SingleChoice({ question, options, id, handleChange, data }) {

  const [isBasicInfo] = useState(typeof data[id] !== "object");

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">{question}</FormLabel>
      <RadioGroup aria-label={id} name={id} defaultValue={isBasicInfo ? data[id] : data[id].value} onChange={e => handleChange(id, e.target.value)}>
        {options.map(option => {
          return (
            <FormControlLabel
              value={option.value}
              checked={isBasicInfo ? data[id] === option.value : data[id].value === option.value}
              control={<Radio color="primary" />}
              label={option.label}
              labelPlacement="right"
            />
          );
        })}
      </RadioGroup>
      {(isBasicInfo ? data[id] : data[id].value) ? (
        <Button variant="outlined" color="primary" onClick={() => handleChange(id, null)}>Clear Answer</Button>
      ) : (<div />)}
    </FormControl>
  );
}
