export interface ScryfallCardResponse {
  id: string;
  printed_name?: string;
  mana_cost?: string;
  cmc?: number;
  image_uris?: {
    normal?: string;
    small?: string;
  };
  scryfall_uri?: string;
  name?: string;
  card_faces?: Array<{
    name?: string;
    printed_name?: string;
    mana_cost?: string;
    image_uris?: {
      small?: string;
      normal?: string;
    };
    type_line?: string;
  }>;
  type_line?: string;
}
