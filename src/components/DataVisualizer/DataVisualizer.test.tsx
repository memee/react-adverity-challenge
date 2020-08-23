import React from "react";
import { shallow } from "enzyme";
import { Data, CompoundFilters } from "../../api/Api";
import DataVisualizer from "./DataVisualizer";

it("prepares data for rendering", () => {
  const data: Data = [
    { time: "sunday", clicks: 100, impressions: 200 },
    { time: "monday", clicks: 10, impressions: 20 },
  ];

  const filters: CompoundFilters = {
    dataSources: [],
    campaigns: [],
  };

  const wrapper = shallow(<DataVisualizer data={data} filters={filters} />);
  const Line = wrapper.find("Line");

  const [set1, set2] = (Line.props() as any).data.datasets;

  expect(set1.data).toEqual([
    { x: "sunday", y: 100 },
    { x: "monday", y: 10 },
  ]);
  expect(set2.data).toEqual([
    { x: "sunday", y: 200 },
    { x: "monday", y: 20 },
  ]);
});
