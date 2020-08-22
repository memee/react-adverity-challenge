import _ from "lodash";

const TIME_IDX = 0;
const SOURCE_IDX = 1;
const CAMPAIGN_IDX = 2;
const CLICKS_IDX = 3;
const IMPRESS_IDX = 4;

export function fetchData() {
  return fetch(
    "http://adverity-challenge.s3-website-eu-west-1.amazonaws.com/DAMKBAoDBwoDBAkOBAYFCw.csv"
    // "http://localhost:3000/data.csv"
  )
    .then((response) => response.text())
    .then(parse);
}

export function getFilteredTimeSeries(
  data,
  { dataSources, campaigns } = {
    dataSources: [],
    campaigns: [],
  }
) {
  return _.chain(data)
    .filter(([_, source, campaign]) => {
      return (
        belongsToCategories(dataSources, source) &&
        belongsToCategories(campaigns, campaign)
      );
    })
    .groupBy(TIME_IDX)
    .map((rows, key) => {
      const summedClicks = _.sumBy(rows, CLICKS_IDX);
      const summedImpressions = _.sumBy(rows, IMPRESS_IDX);
      return {
        time: key,
        clicks: summedClicks,
        impressions: summedImpressions,
      };
    })
    .value();
}

/**
 * Checks if `what` is in the list of provided `categories`.
 * In case categories are empty we assume that all cats are taken into
 * consideration
 */
function belongsToCategories(categories, what) {
  if (_.isEmpty(categories)) return true;
  return categories.includes(what);
}

/**
 * It parses csv file and builds a data structure grouped by
 * data source. Each grouping has relevant campaigns assigned to it.
 * @param {*} dataStr - raw string with csv
 */
function parse(dataStr) {
  const csvRows = dataStr.trim().split(/\r?\n/);
  const data = _.chain(csvRows.slice(1, csvRows.length))
    .map((row) => {
      const [time, ds, cmpgs, clicks, impressions] = row.split(",");
      const isoTime = time.split(".").reverse().join("-");
      return [
        isoTime,
        ds,
        cmpgs,
        parseInt(clicks) || 0,
        parseInt(impressions) || 0,
      ];
    })
    .value();

  const dataSources = _.chain(data)
    .groupBy(SOURCE_IDX)
    .map((data, source) => {
      return _.reduce(
        data,
        (acc, curr) => {
          if (!acc.campaigns.includes(curr[CAMPAIGN_IDX])) {
            acc.campaigns.push(curr[CAMPAIGN_IDX]);
          }
          return {
            label: source,
            campaigns: acc.campaigns,
          };
        },
        { campaigns: [] }
      );
    })
    .value();

  return {
    data,
    dataSources,
  };
}
