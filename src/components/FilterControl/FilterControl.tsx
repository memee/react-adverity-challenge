import React, { ChangeEvent, useState, useMemo } from "react";

import _ from "lodash";

import { makeStyles } from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";

export type Filters = string[];
export type FilterOptions = string[];

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
  button: {
    display: "block",
  },
}));

interface FilterControlProps {
  items: FilterOptions;
  label: string;
  onApply: (x: Filters) => void;
  initial?: Filters;
}

export default function FilterControl({
  items,
  label,
  onApply,
  initial = [],
}: FilterControlProps) {
  const classes = useStyles();
  const [selected, setSelected] = useState(initial);

  const handleChange = (_: ChangeEvent<any>, newValue: any) => {
    console.log(newValue, typeof newValue);
    setSelected(newValue);
  };

  const applyDisabled = useMemo(() => {
    return _.isEqual(selected, initial);
  }, [selected, initial]);

  return (
    <>
      <FormControl className={classes.formControl} fullWidth={true}>
        <Autocomplete
          multiple
          id="size-small-standard-multi"
          size="small"
          options={items}
          onChange={handleChange}
          onInputChange={handleChange}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label={label}
              placeholder={label}
            />
          )}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                variant="default"
                className={classes.chip}
                label={_.truncate(option, { length: 20 })}
                size="small"
                {...getTagProps({ index })}
              />
            ))
          }
        />
      </FormControl>
      <FormControl className={classes.formControl}>
        <Button
          variant="contained"
          color="primary"
          disabled={applyDisabled}
          className={classes.button}
          onClick={() => onApply(selected)}
        >
          Apply
        </Button>
      </FormControl>
    </>
  );
}
