import type { CaseFilters, CaseRecord } from "./types";

export function filterCaseRecords(
  records: CaseRecord[],
  filters: CaseFilters,
): CaseRecord[] {
  return records.filter((record) => {
    if (filters.caseCategory && filters.caseCategory !== "all") {
      if (record.caseCategory !== filters.caseCategory) return false;
    }
    if (filters.situationTag && filters.situationTag !== "all") {
      if (!record.situationTags.includes(filters.situationTag)) return false;
    }
    if (filters.region && filters.region !== "all") {
      if (record.region !== filters.region) return false;
    }
    return true;
  });
}
