<script lang="ts">
  import type { Card } from '@/lib/Card.js';
  import { fetchRandomCardFromAPI } from '@/lib/fetchCards.js';

  const BASE_QUERY: string = ['type:creature', '(game:paper)', 'lang:ja']
    .map(encodeURIComponent)
    .join('+');

  let card: Card | null = null;
  let manaValue: number | null = null;
  let saving = false;
  let errorMessage: string = '';

  const buildQuery = (): string => {
    let query = BASE_QUERY;
    if (manaValue) {
      query += `+${encodeURIComponent(`cmc=${manaValue}`)}`;
    }
    return query;
  };

  async function getCard() {
    if (saving) return;
    saving = true;
    errorMessage = '';
    try {
      const query = buildQuery();
      const result = await fetchRandomCardFromAPI(query);
      if (result) {
        card = result;
      } else {
        errorMessage = 'カードが見つかりません';
      }
    } catch {
      errorMessage = 'カード取得中にエラーが発生しました';
    } finally {
      saving = false;
    }
  }
</script>

{#if errorMessage}
  <p style="color: red;">{errorMessage}</p>
{/if}

{#if card}
  <ul>
    <li style="margin-bottom: 1em;">
      <strong>{card.cmc}</strong>
      <strong>{card.printed_name}</strong><br />
      <a href={card.scryfall_uri} target="_blank" rel="noopener noreferrer">
        {#if card.image_uris}
          <img src={card.image_uris.normal} alt={card.name} />
        {/if}
      </a>
      <a href={card.scryfall_uri} target="_blank" rel="noopener noreferrer">
        <button>詳細を見る</button>
      </a>
    </li>
  </ul>
{:else}
  <p>カードが見つかりません。</p>
{/if}

<input type="number" placeholder="マナ総量を入力..." bind:value={manaValue} />

<button on:click={getCard} disabled={saving}>
  {saving ? '取得中...' : 'カードを取得'}
</button>
