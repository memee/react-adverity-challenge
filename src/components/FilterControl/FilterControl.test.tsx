import Button from "@material-ui/core/Button";
import { createShallow } from "@material-ui/core/test-utils";
import React, { useState as useStateMock } from "react";
import FilterControl, { Filters } from "./FilterControl";

jest.mock("react", () => ({
  ...(jest.requireActual("react") as any),
  useState: jest.fn(),
}));

describe("FilterControl", () => {
  let filters: Filters;
  const shallow = createShallow();
  const onApply = jest.fn();
  const setFilters = (f: Filters) => (filters = f);
  (useStateMock as jest.Mock<any>).mockImplementation((_: any) => [
    filters,
    setFilters,
  ]);

  it("should set initial prop filters", () => {
    const initial = ["x", "y", "z"];
    const wrapper = shallow(
      <FilterControl onApply={onApply} items={[]} initial={initial} label="x" />
    );

    expect(useStateMock).toBeCalledWith(initial);
  });

  it("should set empty filters when no initial provided", () => {
    const wrapper = shallow(
      <FilterControl onApply={onApply} items={[]} label="x" />
    );

    expect(useStateMock).toBeCalledWith([]);
  });

  it("should pass filters to onApply", () => {
    const expected = ["a", "b", "c"];
    setFilters(expected);
    const wrapper = shallow(
      <FilterControl onApply={onApply} items={[]} label="x" />
    );

    wrapper.find(Button).simulate("click");

    expect(onApply).toBeCalledTimes(1);
    expect(onApply).toBeCalledWith(expected);
  });
});
