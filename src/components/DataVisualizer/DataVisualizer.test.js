import React from "react";
import { shallow } from "enzyme";
import { rawData } from "../../data/__fixtures__/data";
import DataVisualizer from "./DataVisualizer";

it("prepares data for rendering", () => {
  const wrapper = shallow(<DataVisualizer data={rawData} />);
  const Line = wrapper.find("Line");

  // expect(Line.props()).toEqual({});
});
