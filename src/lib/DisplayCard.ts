export interface DisplayCard {
  id: string;
  name: string;
  printedName: string;
  cmc: number;
  imageNormal: string;
  imageSmall: string;
  scryfallUri: string;
}

import type { ScryfallCardResponse } from './Card.js';

export function toDisplayCard(card: ScryfallCardResponse): DisplayCard | null {
  if (!card) return null;

  // 両面カードの場合
  if (card.card_faces && card.card_faces.length > 0) {
    const face = card.card_faces[0];
    if (face.type_line && !face.type_line.includes('Creature')) return null;

    if (face.printed_name && face.image_uris && face.image_uris.normal && face.image_uris.small) {
      return {
        id: card.id,
        name: face.name ?? card.name ?? '',
        printedName: face.printed_name,
        cmc: card.cmc ?? 0,
        imageNormal: face.image_uris.normal,
        imageSmall: face.image_uris.small,
        scryfallUri: card.scryfall_uri ?? ''
      };
    }
  }
  // 片面カードの場合
  if (card.printed_name && card.image_uris && card.image_uris.normal && card.image_uris.small) {
    return {
      id: card.id,
      name: card.name ?? '',
      printedName: card.printed_name,
      cmc: card.cmc ?? 0,
      imageNormal: card.image_uris.normal,
      imageSmall: card.image_uris.small,
      scryfallUri: card.scryfall_uri ?? ''
    };
  }
  // 表示できない場合
  return null;
}
