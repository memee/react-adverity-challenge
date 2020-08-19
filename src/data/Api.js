import _ from "lodash";

const TIME_IDX = 0;
const SOURCE_IDX = 1;
const CAMPAIGN_IDX = 2;
const CLICKS_IDX = 3;
const IMPRESS_IDX = 4;

export function fetchData() {
  return fetch(
    "http://adverity-challenge.s3-website-eu-west-1.amazonaws.com/DAMKBAoDBwoDBAkOBAYFCw.csv"
  )
    .then((response) => response.text())
    .then(parse);
}

export function getFilteredTimeSeries(data, { dataSources, campaigns }) {
  return _.chain(data)
    .filter(([_, source, campaign]) => {
      return dataSources.includes(source) && campaigns.includes(campaign);
    })
    .groupBy(TIME_IDX)
    .map((rows, key) => {
      const summedClicks = _.sumBy(rows, CLICKS_IDX);
      const summedImpressions = _.sumBy(rows, IMPRESS_IDX);
      return [key, summedClicks, summedImpressions];
    })
    .value();
}

function parse(dataStr) {
  const csvRows = dataStr.trim().split(/\r?\n/);
  const data = _.map(csvRows.slice(1, csvRows.length), (row) => row.split(","));

  const dataSources = _.chain(data)
    .groupBy(SOURCE_IDX)
    .map((data, source) => {
      return _.reduce(
        data,
        (acc, curr) => {
          return { [source]: _.uniq([...acc[source], curr[CAMPAIGN_IDX]]) };
        },
        { [source]: [] }
      );
    })
    .value();

  return {
    data,
    dataSources,
  };
}
