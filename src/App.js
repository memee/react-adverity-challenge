import React from "react";
import { Container, Grid, Paper, Box, makeStyles } from "@material-ui/core";
// import Link from "@material-ui/core/Link";
import "./App.css";
import FilterPanel from "./components/FilterPanel";
import DataVisualizer from "./components/DataVisualizer";

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  panel: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  visualizer: {
    padding: theme.spacing(2),
    textAlign: "left",
  },
}));

function App() {
  const classes = useStyles();

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Grid container spacing="3">
        <Grid item xs="3">
          <Paper className={classes.panel}>
            <FilterPanel></FilterPanel>
          </Paper>
        </Grid>
        <Grid item xs="9">
          <Paper className={classes.visualizer}>
            <DataVisualizer></DataVisualizer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
