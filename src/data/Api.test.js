import _ from "lodash";
import { getFilteredTimeSeries, fetchData } from "./Api";
import { rawData, csv } from "./__fixtures__/data";

test("populates data sources", (done) => {
  const fetchTextMock = Promise.resolve(csv);
  const fetchMock = Promise.resolve({
    text: () => fetchTextMock,
  });
  jest.spyOn(global, "fetch").mockImplementation(() => fetchMock);

  const expected = [
    {
      "Facebook Ads": ["Like Ads", "Offer Campaigns - Conversions"],
    },
    {
      "Google Adwords": ["B2B - Leads", "New General Campaign - AUS - Mobile"],
    },
    {
      Mailchimp: [
        "NY Offer 2019 | Extension Buyers | Switch To Lifetime (ABD) #2",
        "NY Offer 2019 | Extension Buyers | Switch To Lifetime (MSK) #2",
        "New Years Offer 2019 | Open Cart #5",
        "New Years Offer 2019 | Open Cart #5 - RH Buyers",
      ],
    },
  ];

  fetchData().then(({ dataSources }) => {
    expect(dataSources).toEqual(expected);
    done();
  });

  expect(global.fetch).toHaveBeenCalledWith(
    "http://adverity-challenge.s3-website-eu-west-1.amazonaws.com/DAMKBAoDBwoDBAkOBAYFCw.csv"
  );
});

test("populates data with coerced numbers", (done) => {
  const fetchTextMock = Promise.resolve(csv);
  const fetchMock = Promise.resolve({
    text: () => fetchTextMock,
  });
  jest.spyOn(global, "fetch").mockImplementation(() => fetchMock);

  fetchData().then(({ data }) => {
    expect(
      _.every(data, (row) => _.isFinite(row[3]) && _.isFinite(row[4]))
    ).toBe(true);
    done();
  });
});

test("gets filtered data", () => {
  const series = getFilteredTimeSeries(rawData, {
    dataSources: ["Facebook Ads", "Google Adwords"],
    campaigns: [
      "B2B - Leads",
      "New Years Offer 2019 | Open Cart #5",
      "New General Campaign - AUS - Mobile",
    ],
  });

  expect(series).toEqual([
    { time: "01.01.2019", clicks: 14, impressions: 725 },
    { time: "02.01.2019", clicks: 18, impressions: 829 },
  ]);
});

test("gets unfiltered data when no filters applied", () => {});
