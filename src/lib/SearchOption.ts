export type SearchOptionKey =
  | 'excludeMeldCard'
  | 'includeCommon'
  | 'includeUncommon'
  | 'includeRare'
  | 'includeMythic';

interface SearchOption {
  value: boolean;
  label: string;
}

export type SearchOptions = Record<SearchOptionKey, SearchOption>;
