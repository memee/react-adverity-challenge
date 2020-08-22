import React, { useState as useStateMock } from "react";
import { shallow } from "enzyme";

import FilterPanel from "./FilterPanel";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useState: jest.fn(),
}));

describe("FilterPanel", () => {
  let mockState;
  const setMockState = (s) => (mockState = s);
  useStateMock.mockImplementation((_) => [mockState, setMockState]);

  const dataSources = Object.freeze([
    { label: "Facebook", campaigns: ["a", "b", "c"] },
    { label: "Google", campaigns: ["d", "e", "f"] },
    { label: "MailChimp", campaigns: ["g", "h", "i"] },
  ]);
  const getCampaignsControl = (wrapper) =>
    wrapper.findWhere((n) => n.prop("label") === "Campaigns");

  it("should populate campaign choices based on selected sources", () => {
    const expected = ["a", "b", "c", "g", "h", "i"];

    setMockState(["Facebook", "MailChimp"]);

    const wrapper = shallow(<FilterPanel dataSources={dataSources} />);
    const campaignsControl = getCampaignsControl(wrapper);

    expect(campaignsControl).toHaveProp("items", expected);
  });

  it("should populate all campaigns when no sources selected", () => {
    const expected = ["a", "b", "c", "d", "e", "f", "g", "h", "i"];

    setMockState([]);

    const wrapper = shallow(<FilterPanel dataSources={dataSources} />);
    const campaignsControl = getCampaignsControl(wrapper);

    expect(campaignsControl).toHaveProp("items", expected);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
