import React, { useCallback, useMemo, useState } from "react";
import _ from "lodash";
import FilterControl from "../FilterControl";
import { Filters, FilterOptions } from "../FilterControl/FilterControl";
import SectionHeading from "../SectionHeading";

import { DataSources, CompoundFilters } from "../../api/Api";

interface FilterPanelProps {
  dataSources: DataSources;
  onFiltersApply: (x: CompoundFilters) => void;
}

export default function FilterPanel({
  dataSources,
  onFiltersApply,
}: FilterPanelProps) {
  const [sourceFilters, setSourceFilters] = useState([] as Filters);
  const [campaignFilters, setCampaignFilters] = useState([] as Filters);
  const sources = useMemo(() => _.map(dataSources, (s) => s.label), [
    dataSources,
  ]);
  // available campaigns - depends on selected data sources
  const campaigns: FilterOptions = useMemo(
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
        }, [] as FilterOptions)
        .value(),
    [sourceFilters, dataSources]
  );

  const onApplySources = useCallback(
    (filters: Filters) => {
      setSourceFilters(filters);
      onFiltersApply({
        dataSources: filters,
        campaigns: campaignFilters,
      });
    },
    [campaignFilters, setSourceFilters, onFiltersApply]
  );

  const onApplyCampaigns = useCallback(
    (filters: Filters) => {
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
