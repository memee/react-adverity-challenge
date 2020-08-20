import React, { useState as useStateMock } from "react";

import { createShallow } from "@material-ui/core/test-utils";
import Button from "@material-ui/core/Button";
import FilterControl from "./FilterControl";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useState: jest.fn(),
}));

describe("FilterControl", () => {
  let filters;
  const shallow = createShallow();
  const onApply = jest.fn();
  const setFilters = (f) => (filters = f);
  useStateMock.mockImplementation((_) => [filters, setFilters]);

  it("should set initial prop filters", () => {
    const initial = ["x", "y", "z"];
    const wrapper = shallow(
      <FilterControl onApply={onApply} items={[]} initial={initial} />
    );

    expect(useStateMock).toBeCalledWith(initial);
  });

  it("should set empty filters when no initial provided", () => {
    const wrapper = shallow(<FilterControl onApply={onApply} items={[]} />);

    expect(useStateMock).toBeCalledWith([]);
  });

  it("should pass filters to onApply", () => {
    const expected = ["a", "b", "c"];
    setFilters(expected);
    const wrapper = shallow(<FilterControl onApply={onApply} items={[]} />);

    wrapper.find(Button).simulate("click");

    expect(onApply).toBeCalledTimes(1);
    expect(onApply).toBeCalledWith(expected);
  });
});
