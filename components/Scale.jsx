import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { Button, Divider } from '@material-ui/core';

export default function Scale({ scale, question, id, handleChange, data }) {

  // Generate buttons for scale
  const RadioButtons = () => {
    let buttons = []

    for (let i = 0; i < scale; i++) {
      buttons.push(
        <FormControlLabel
          value={(i + 1).toString()}
          control={<Radio color="primary" checked={data[id] === (i + 1).toString()} />}
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
        <RadioGroup row aria-label={id} name={id} defaultValue={data[id]} onChange={(e) => handleChange(id, e.target.value)}>
          {RadioButtons().map(button => {
            return button;
          })}
        </RadioGroup>
        <br />
        {data[id] ? (
          <Button variant="outlined" color="primary" onClick={() => handleChange(id, null)}>Clear Answer</Button>
        ) : (<div />)}
      </FormControl>
    </div>
  );
}
