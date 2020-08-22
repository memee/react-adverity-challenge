import React, { useCallback, useMemo, useState } from "react";
import _ from "lodash";
import FilterControl from "../FilterControl";
import SectionHeading from "../SectionHeading";

export default function FilterPanel({ dataSources, onFiltersApply }) {
  const [sourceFilters, setSourceFilters] = useState([]);
  const [campaignFilters, setCampaignFilters] = useState([]);
  const sources = useMemo(() => _.map(dataSources, (s) => s.label), [
    dataSources,
  ]);
  // available campaigns - depends on selected data sources
  const campaigns = useMemo(
    () =>
      _.chain(dataSources)
        .filter((src) => {
          // no sources chosen -> show all campaigns
          return !_.isEmpty(sourceFilters)
            ? sourceFilters.includes(src.label)
            : true;
        })
        .reduce((res, src) => {
          return [...res, ..._.get(src, "campaigns", [])];
        }, [])
        .value(),
    [sourceFilters, dataSources]
  );

  const onApplySources = useCallback(
    (filters) => {
      setSourceFilters(filters);
      onFiltersApply({
        dataSources: filters,
        campaigns: campaignFilters,
      });
    },
    [campaignFilters, setSourceFilters, onFiltersApply]
  );

  const onApplyCampaigns = useCallback(
    (filters) => {
      setCampaignFilters(filters);
      onFiltersApply({
        dataSources: sourceFilters,
        campaigns: filters,
      });
    },
    [sourceFilters, setCampaignFilters, onFiltersApply]
  );

  return (
    <>
      <SectionHeading component="h2">Filter dimension values</SectionHeading>
      <FilterControl
        items={sources}
        label="Data sources"
        initial={sourceFilters}
        onApply={onApplySources}
      />
      <FilterControl
        items={campaigns}
        label="Campaigns"
        initial={campaignFilters}
        onApply={onApplyCampaigns}
      />
    </>
  );
}
