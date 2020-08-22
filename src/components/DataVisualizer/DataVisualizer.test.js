import React from "react";
import { shallow } from "enzyme";
import { rawData } from "../../api/__fixtures__/data";
import DataVisualizer from "./DataVisualizer";

it("prepares data for rendering", () => {
  const wrapper = shallow(<DataVisualizer data={rawData} filters={[]} />);
  const Line = wrapper.find("Line");

  // expect(Line.props()).toEqual({});
});
