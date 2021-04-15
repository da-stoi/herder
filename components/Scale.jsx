import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { Button, Divider } from '@material-ui/core';
import { useEffect, useState } from 'react';

export default function Scale({ scale, question, id, handleChange, data, hasPriority }) {

  // Generate buttons for scale
  const RadioButtons = () => {
    let buttons = []

    for (let i = 0; i < scale; i++) {
      buttons.push(
        <FormControlLabel
          value={(i + 1).toString()}
          control={<Radio color="primary" checked={data[id]?.value === (i + 1).toString()} />}
          label={i === 0 ? `👎 ${i + 1}` : scale % 2 && i + 1 === (scale + 1) / 2 ? "🤷‍♂️" : i + 1 === scale ? `${i + 1} 👍` : (i + 1).toString()}
          labelPlacement="bottom"
        />
      )
    }

    return buttons;
  }

  return (
    <div>
      <Divider />
      <br />
      <FormControl component="fieldset">
        <br />
        <FormLabel component="legend">{question}</FormLabel>
        <RadioGroup row aria-label={id} name={id} defaultValue={data[id]?.value} onChange={(e) => handleChange(id, e.target.value, data[id].priority)}>
          {RadioButtons().map(button => {
            return button;
          })}
        </RadioGroup>
        {data[id] && hasPriority ? (
          <div>
            <br />
            <FormLabel component="legend">How important is this question to you?</FormLabel>
            <br />
            <RadioGroup row aria-label={id} name={id} defaultValue={data[id].priority} onChange={(e) => handleChange(id, data[id].value, e.target.value)}>
              <FormControlLabel
                value={"1"}
                control={<Radio color="primary" checked={data[id].priority === "1"} />}
                label={"Not Very"}
                labelPlacement="bottom"
              />
              <FormControlLabel
                value={"2"}
                control={<Radio color="primary" checked={data[id].priority === "2"} />}
                label={"Kind Of"}
                labelPlacement="bottom"
              />
              <FormControlLabel
                value={"3"}
                control={<Radio color="primary" checked={data[id].priority === "3"} />}
                label={"Very"}
                labelPlacement="bottom"
              />
            </RadioGroup>
          </div>
        ) : (<div />)}
        <br />
        {data[id]?.value ? (
          <Button variant="outlined" color="primary" onClick={() => handleChange(id, null, data[id].priority)}>Clear Answer</Button>
        ) : (<div />)}
      </FormControl>
    </div>
  );
}
