import React, { useEffect, useState, useMemo } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import _ from "lodash";

import "./App.css";
import FilterPanel from "./components/FilterPanel";
import DataVisualizer from "./components/DataVisualizer";
import * as Api from "./api/Api";

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

export default function App() {
  const classes = useStyles();
  const [dataSources, setDataSources] = useState([] as Api.DataSources);
  const [data, setData] = useState([] as Api.RawData[]);
  const [filters, setFilters] = useState({
    dataSources: [],
    campaigns: [],
  } as Api.CompoundFilters);
  const [isLoading, setIsLoading] = useState(false);
  const filteredData = useMemo(() => {
    return Api.getFilteredTimeSeries(data, filters);
  }, [filters, data]);

  useEffect(() => {
    setIsLoading(true);
    Api.fetchData().then(({ data, dataSources }: Api.State) => {
      setIsLoading(false);
      setData(data);
      setDataSources(dataSources);
    });
  }, [setData, setDataSources]);

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <Paper className={classes.panel}>
            <FilterPanel
              dataSources={dataSources}
              onFiltersApply={setFilters}
            ></FilterPanel>
          </Paper>
        </Grid>
        <Grid item xs={9}>
          <Paper className={classes.visualizer}>
            {_.isEmpty(data) ? (
              isLoading ? (
                <Grid container justify="center">
                  <CircularProgress color="secondary" />
                </Grid>
              ) : (
                <h2>No data!</h2>
              )
            ) : (
              <DataVisualizer
                data={filteredData}
                filters={filters}
              ></DataVisualizer>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
