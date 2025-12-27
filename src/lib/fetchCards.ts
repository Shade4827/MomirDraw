import type { ScryfallCardResponse } from '@/lib/Card.js';

const API_URL = 'https://api.scryfall.com';

export async function fetchRandomCardFromAPI(query: string): Promise<ScryfallCardResponse | null> {
  try {
    const res = await fetch(`${API_URL}/cards/random?q=${encodeURI(query)}`);
    if (!res.ok) throw new Error('API response not ok');
    return await res.json();
  } catch (error) {
    console.error('Error fetching card:', error);
    return null;
  }
}
