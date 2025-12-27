<script lang="ts">
  import type { ScryfallCardResponse } from '@/lib/Card.js';
  import type { DisplayCard } from '@/lib/DisplayCard.js';
  import type { SearchOptionKey, SearchOptions } from '@/lib/SearchOption.js';
  import { toDisplayCard } from '@/lib/DisplayCard.js';
  import { fetchRandomCardFromAPI } from '@/lib/fetchCards.js';

  const BASE_QUERY_PARTS: string[] = ['type:creature', '(game:paper)', 'lang:ja'];

  let currentCard: DisplayCard | null = null;
  let pastCards: DisplayCard[] = [];
  let manaValue: number | null = null;
  $: isValidMana =
    manaValue === null ||
    (typeof manaValue === 'number' && Number.isInteger(manaValue) && manaValue >= 0);
  let saving = false;
  let errorMessage: string = '';
  let sidebarOpen = false;
  let optionSectionOpen = true;
  let historySectionOpen = true;

  let searchOptions: SearchOptions = {
    excludeMeldCard: { value: true, label: '合体カードを除外する' },
    includeCommon: { value: false, label: 'コモンから検索' },
    includeUncommon: { value: false, label: 'アンコモンから検索' },
    includeRare: { value: false, label: 'レアから検索' },
    includeMythic: { value: false, label: '神話レアから検索' }
  };

  function toggleOption(key: SearchOptionKey) {
    searchOptions[key].value = !searchOptions[key].value;
  }

  const buildQuery = (): string => {
    const queryParts = [...BASE_QUERY_PARTS];

    if (isValidMana) {
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
  };

  async function getCard() {
    if (saving) return;
    saving = true;
    errorMessage = '';

    const query = buildQuery();
    let result: ScryfallCardResponse | null = null;
    try {
      result = await fetchRandomCardFromAPI(query);
    } catch {
      errorMessage = 'カード取得中にエラーが発生しました';
      saving = false;
      return;
    }

    if (!result) {
      errorMessage = 'カードが見つかりませんでした。再度お試しください。';
      saving = false;
      return;
    }

    if (searchOptions.excludeMeldCard.value && !result.mana_cost) {
      errorMessage = '合体カードのため、再度お試しください。';
      saving = false;
      return;
    }

    const displayCard = toDisplayCard(result);
    if (!displayCard) {
      errorMessage = '表面がクリーチャーでないカードのため、再度お試しください。';
      saving = false;
      return;
    }

    if (
      pastCards.some((card) => card.id === displayCard.id) ||
      currentCard?.id === displayCard.id
    ) {
      errorMessage = '同じカードが既に抽選されています。再度お試しください。';
      saving = false;
      return;
    }

    if (currentCard) {
      pastCards = [currentCard, ...pastCards];
    }
    currentCard = displayCard;
    saving = false;
  }

  const reset = () => {
    currentCard = null;
    pastCards = [];
    manaValue = null;
    errorMessage = '';
  };
</script>

<header class="fixed top-0 left-0 w-full py-3 bg-blue-400 z-50">
  <div class="flex items-center justify-between w-full">
    <h1 class="text-base font-bold text-white text-left pl-4 tracking-wide">MomirDraw</h1>
    <div class="flex items-center space-x-2 pr-4">
      <p class="text-sm text-white">Created by</p>
      <a
        href="https://x.com/shade4827"
        target="_blank"
        class="text-sm text-white font-bold hover:underline">@shade4827</a
      >
    </div>
  </div>
</header>

<div class="flex flex-col items-center mt-16 px-2 sm:px-4">
  {#if currentCard}
    <div class="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-4 mb-4 items-center w-full sm:w-auto">
      <strong class="text-2xl font-extrabold text-gray-900">{currentCard.printedName}</strong>
      <a href={currentCard.scryfallUri} target="_blank" rel="noopener noreferrer">
        <button
          class="flex items-center gap-1 px-2 py-1 rounded bg-blue-600 text-white font-bold shadow hover:bg-blue-700 transition"
        >
          詳細を見る
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M18 13v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h6m5-3h-3m3 0v3m0-3L10 14"
            />
          </svg>
        </button>
      </a>
    </div>
    <a href={currentCard.scryfallUri} target="_blank" rel="noopener noreferrer">
      <img
        src={currentCard.imageNormal}
        alt={currentCard.name}
        class="w-96 max-w-xs sm:max-w-md md:max-w-lg h-auto"
      />
    </a>
  {:else}
    <p class="text-lg font-semibold text-gray-500 mt-8">カードを取得してください</p>
  {/if}

  <div class="min-h-12 flex items-center justify-center">
    {#if errorMessage}
      <p class="text-red-500">{errorMessage}</p>
    {/if}
  </div>

  <div class="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-2 w-full sm:w-auto">
    <input
      type="number"
      min="0"
      step="1"
      placeholder="マナ総量を入力..."
      bind:value={manaValue}
      class="w-full sm:w-48 px-4 py-2 rounded border-2 border-blue-300 focus:outline-none focus:border-blue-500 shadow transition"
    />
    <button
      on:click={getCard}
      disabled={saving || !isValidMana}
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

<!-- PC: 右側サイドバー（常時表示） -->
<div
  class="hidden lg:flex fixed top-20 right-0 w-64 h-[calc(100vh-5rem)] bg-white shadow-lg border-l border-gray-200 flex-col z-40"
>
  <div class="p-4 flex flex-col h-full">
    <div class="flex items-center justify-between mb-2">
      <h2 class="text-lg font-bold flex-shrink-0">オプション</h2>
      <button
        class="text-blue-600 text-xl focus:outline-none"
        on:click={() => (optionSectionOpen = !optionSectionOpen)}
        aria-label="オプション折りたたみ"
      >
        {optionSectionOpen ? '−' : '+'}
      </button>
    </div>
    {#if optionSectionOpen}
      <div class="mb-4 flex flex-col gap-1">
        {#each Object.entries(searchOptions) as [key, option] (key)}
          <label class="flex items-center gap-2">
            <input
              type="checkbox"
              checked={option.value}
              on:change={() => toggleOption(key as SearchOptionKey)}
            />
            <span class="text-sm">{option.label}</span>
          </label>
        {/each}
      </div>
    {/if}
    <div class="flex items-center justify-between mb-2">
      <h2 class="text-lg font-bold flex-shrink-0">抽選済み</h2>
      <button
        class="text-blue-600 text-xl focus:outline-none"
        on:click={() => (historySectionOpen = !historySectionOpen)}
        aria-label="抽選済み折りたたみ"
      >
        {historySectionOpen ? '−' : '+'}
      </button>
    </div>
    {#if historySectionOpen}
      <ul class="space-y-4 overflow-y-auto flex-1">
        {#each pastCards as pastCard (pastCard.id)}
          <li>
            <strong class="text-gray-900 truncate block max-w-[13rem]"
              >{pastCard.printedName}</strong
            >
            <a href={pastCard.scryfallUri} target="_blank" rel="noopener noreferrer">
              <img src={pastCard.imageSmall} alt={pastCard.name} class="mx-auto w-28 h-auto" />
            </a>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</div>

<!-- モバイル・タブレット: 右側サイドバー（開閉可能・アイコンのみ/展開時は現状幅） -->
<div class="xl:hidden z-40">
  {#if !sidebarOpen}
    <button
      class="fixed bottom-4 right-4 w-14 h-14 bg-blue-500 text-white flex items-center justify-center rounded-full shadow-lg border-2 border-blue-600"
      on:click={() => (sidebarOpen = true)}
      aria-label="抽選済みカードを開く"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-8 h-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  {:else}
    <div
      class="fixed top-20 right-0 w-80 h-[calc(100vh-5rem)] bg-white shadow-lg border-l border-gray-200 flex flex-col"
    >
      <button
        class="w-12 h-full absolute top-0 left-0 bg-blue-500 text-white flex items-center justify-center border-l border-blue-600 rounded-l-lg shadow-lg"
        on:click={() => (sidebarOpen = false)}
        aria-label="抽選済みカードを閉じる"
        style="z-index:1;"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-8 h-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <div class="p-4 flex flex-col h-full ml-12">
        <div class="flex items-center justify-between mb-2">
          <h2 class="text-lg font-bold flex-shrink-0">オプション</h2>
          <button
            class="text-blue-600 text-xl focus:outline-none"
            on:click={() => (optionSectionOpen = !optionSectionOpen)}
            aria-label="オプション折りたたみ"
          >
            {optionSectionOpen ? '−' : '+'}
          </button>
        </div>
        {#if optionSectionOpen}
          <div class="mb-4 flex flex-col gap-1">
            {#each Object.entries(searchOptions) as [key, option] (key)}
              <label class="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={option.value}
                  on:change={() => toggleOption(key as SearchOptionKey)}
                />
                <span class="text-sm">{option.label}</span>
              </label>
            {/each}
          </div>
        {/if}
        <div class="flex items-center justify-between mb-2">
          <h2 class="text-lg font-bold flex-shrink-0">抽選済み</h2>
          <button
            class="text-blue-600 text-xl focus:outline-none"
            on:click={() => (historySectionOpen = !historySectionOpen)}
            aria-label="抽選済み折りたたみ"
          >
            {historySectionOpen ? '−' : '+'}
          </button>
        </div>
        {#if historySectionOpen}
          <ul class="space-y-4 overflow-y-auto flex-1">
            {#each pastCards as pastCard (pastCard.id)}
              <li>
                <strong class="text-gray-900 truncate block max-w-[13rem]"
                  >{pastCard.printedName}</strong
                >
                <a href={pastCard.scryfallUri} target="_blank" rel="noopener noreferrer">
                  <img src={pastCard.imageSmall} alt={pastCard.name} class="mx-auto w-36 h-auto" />
                </a>
              </li>
            {/each}
          </ul>
        {/if}
      </div>
    </div>
  {/if}
</div>
