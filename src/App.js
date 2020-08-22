import React, { useEffect, useState, useMemo } from "react";
import { Container, Grid, Paper, makeStyles } from "@material-ui/core";
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
  const [dataSources, setDataSources] = useState([]);
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    dataSources: [],
    campaigns: [],
  });
  const filteredData = useMemo(() => {
    return Api.getFilteredTimeSeries(data, filters);
  }, [filters, data]);

  useEffect(() => {
    Api.fetchData().then(({ data, dataSources }) => {
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
              <h2>No data!</h2>
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
