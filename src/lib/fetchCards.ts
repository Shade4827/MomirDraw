import type { Card } from '@/lib/Card.js';

const API_URL = 'https://api.scryfall.com';

export async function fetchRandomCardFromAPI(query: string): Promise<Card | null> {
  try {
    const res = await fetch(`${API_URL}/cards/random?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('API response not ok');
    const data: Card = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching card:', error);
    return null;
  }
}
