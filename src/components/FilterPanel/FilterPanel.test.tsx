import React, { useState as useStateMock } from "react";
import { shallow, ShallowWrapper } from "enzyme";

import { CompoundFilters } from "../../api/Api";
import FilterPanel from "./FilterPanel";
import { Filters } from "../FilterControl/FilterControl";

jest.mock("react", () => ({
  ...(jest.requireActual("react") as any),
  useState: jest.fn(),
}));

describe("FilterPanel", () => {
  let mockState: Filters;
  const setMockState = (s: Filters) => (mockState = s);
  const dummyOnApply: (f: CompoundFilters) => void = (f) => {};
  (useStateMock as jest.Mock<any>).mockImplementation((_) => [
    mockState,
    setMockState,
  ]);

  const dataSources = Object.freeze([
    { label: "Facebook", campaigns: ["a", "b", "c"] },
    { label: "Google", campaigns: ["d", "e", "f"] },
    { label: "MailChimp", campaigns: ["g", "h", "i"] },
  ]);
  const getCampaignsControl = (wrapper: ShallowWrapper) =>
    wrapper.findWhere((n) => n.prop("label") === "Campaigns");

  it("should populate campaign choices based on selected sources", () => {
    const expected = ["a", "b", "c", "g", "h", "i"];

    setMockState(["Facebook", "MailChimp"]);

    const wrapper = shallow(
      <FilterPanel dataSources={dataSources} onFiltersApply={dummyOnApply} />
    );
    const campaignsControl = getCampaignsControl(wrapper);

    expect(campaignsControl).toHaveProp("items", expected);
  });

  it("should populate all campaigns when no sources selected", () => {
    const expected = ["a", "b", "c", "d", "e", "f", "g", "h", "i"];

    setMockState([]);

    const wrapper = shallow(
      <FilterPanel dataSources={dataSources} onFiltersApply={dummyOnApply} />
    );
    const campaignsControl = getCampaignsControl(wrapper);

    expect(campaignsControl).toHaveProp("items", expected);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
