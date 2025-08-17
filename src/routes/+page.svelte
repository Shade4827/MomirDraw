<script lang="ts">
  import type { Card } from '@/lib/Card.js';
  import { fetchRandomCardFromAPI } from '@/lib/fetchCards.js';

  const BASE_QUERY: string = ['type:creature', '(game:paper)', 'lang:ja']
    .map(encodeURIComponent)
    .join('+');

  let currentCard: Card | null = null;
  let pastCards: Card[] = [];
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

    const query = buildQuery();
    let result: Card | null = null;
    try {
      result = await fetchRandomCardFromAPI(query);
    } catch {
      errorMessage = 'カード取得中にエラーが発生しました';
      saving = false;
      return;
    }

    if (!result) {
      errorMessage = 'カードが見つかりません';
      saving = false;
      return;
    }

    if (currentCard) {
      pastCards = [...pastCards, currentCard];
    }
    currentCard = result;
    saving = false;
  }

  const reset = () => {
    currentCard = null;
    pastCards = [];
    manaValue = null;
  };
</script>

<div class="flex flex-col items-center">
  {#if currentCard}
    <div class="flex gap-4 mt-4">
      <strong>{currentCard.cmc}</strong>
      <strong>{currentCard.printed_name}</strong>
    </div>
    {#if currentCard.image_uris}
      <a href={currentCard.scryfall_uri} target="_blank" rel="noopener noreferrer">
        <img src={currentCard.image_uris.normal} alt={currentCard.name} />
      </a>
    {/if}
    <a href={currentCard.scryfall_uri} target="_blank" rel="noopener noreferrer">
      <button>詳細を見る</button>
    </a>
  {:else}
    <p>カードが見つかりません。</p>
  {/if}

  
  <input
    type="number"
    placeholder="マナ総量を入力..."
    bind:value={manaValue}
    class="px-4 py-2 rounded border-2 border-blue-300 focus:outline-none focus:border-blue-500 shadow transition"
  />

  <div class="h-6 flex items-center justify-center">
    {#if errorMessage}
      <p class="text-red-500">{errorMessage}</p>
    {/if}
  </div>

  <div class="flex gap-4 mt-2">
  <button
    on:click={getCard}
    disabled={saving}
    class="px-4 py-2 rounded bg-blue-600 text-white font-bold shadow hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
  >
    {saving ? '取得中...' : 'カードを取得'}
  </button>
  <button
    on:click={reset}
    class="px-4 py-2 rounded bg-gray-600 text-white font-bold shadow hover:bg-gray-700 transition"
  >
    リセット
  </button>
</div>
</div>

<h2>過去のカード</h2>
<ul>
  {#each pastCards as pastCard (pastCard.id)}
    <li>
      <strong>{pastCard.cmc}</strong>
      <strong>{pastCard.printed_name}</strong><br />
      <a href={pastCard.scryfall_uri} target="_blank" rel="noopener noreferrer">
        {#if pastCard.image_uris}
          <img src={pastCard.image_uris.small} alt={pastCard.name} />
        {/if}
      </a>
    </li>
  {/each}
</ul>
