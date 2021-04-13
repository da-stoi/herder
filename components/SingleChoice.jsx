import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

export default function SingleChoice({ question, options, id, handleChange, data }) {

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">{question}</FormLabel>
      <RadioGroup aria-label={id} name={id} defaultValue={data[id]} onChange={e => handleChange(id, e.target.value)}>
        {options.map(option => {
          return (
            <FormControlLabel
              value={option.value}
              control={<Radio color="primary" />}
              label={option.label}
              labelPlacement="right"
            />
          );
        })}
      </RadioGroup>
    </FormControl>
  );
}
