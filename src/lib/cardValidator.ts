import type { ScryfallCardResponse } from './Card.js';
import type { DisplayCard } from './DisplayCard.js';
import type { SearchOptions } from './SearchOption.js';

export interface CardValidationResult {
  isValid: boolean;
  error: string | null;
}

export function validateCardResponse(result: ScryfallCardResponse | null): CardValidationResult {
  if (!result) {
    return {
      isValid: false,
      error: 'カードが見つかりませんでした。再度お試しください。'
    };
  }

  return { isValid: true, error: null };
}

export function validateMeldCard(
  result: ScryfallCardResponse,
  searchOptions: SearchOptions
): CardValidationResult {
  if (searchOptions.excludeMeldCard.value && !result.mana_cost) {
    return {
      isValid: false,
      error: '合体カードのため、再度お試しください。'
    };
  }

  return { isValid: true, error: null };
}

export function validateCreature(displayCard: DisplayCard | null): CardValidationResult {
  if (!displayCard) {
    return {
      isValid: false,
      error: '表面がクリーチャーでないカードのため、再度お試しください。'
    };
  }

  return { isValid: true, error: null };
}

export function validateDuplicate(
  displayCard: DisplayCard,
  currentCard: DisplayCard | null,
  pastCards: DisplayCard[]
): CardValidationResult {
  if (pastCards.some((card) => card.id === displayCard.id) || currentCard?.id === displayCard.id) {
    return {
      isValid: false,
      error: '同じカードが既に抽選されています。再度お試しください。'
    };
  }

  return { isValid: true, error: null };
}
