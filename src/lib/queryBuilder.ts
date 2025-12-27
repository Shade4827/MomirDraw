import type { SearchOptions } from './SearchOption.js';

export interface QueryBuilderOptions {
  baseQueryParts: string[];
  manaValue: number | null;
  searchOptions: SearchOptions;
}

export function buildQuery(options: QueryBuilderOptions): string {
  const { baseQueryParts, manaValue, searchOptions } = options;
  const queryParts = [...baseQueryParts];

  if (manaValue !== null && manaValue >= 0) {
    queryParts.push(`cmc=${manaValue}`);
  }

  const rarities = [
    searchOptions.includeCommon.value ? 'rarity:c' : '',
    searchOptions.includeUncommon.value ? 'rarity:u' : '',
    searchOptions.includeRare.value ? 'rarity:r' : '',
    searchOptions.includeMythic.value ? 'rarity:m' : ''
  ].filter(Boolean);

  if (rarities.length > 0) {
    queryParts.push(`(${rarities.join('+OR+')})`);
  }

  return queryParts.join('+');
}
