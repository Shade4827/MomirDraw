<script lang="ts">
  import { onMount } from 'svelte';
  import type { Card } from '@/lib/Card.js';
  import { fetchRandomCardFromAPI } from '@/lib/fetchCards.js';

  let card: Card | null = null;

  onMount(async () => {
    card = await fetchRandomCardFromAPI('c:red');
  });
</script>

{#if card !== null}
  <ul>
    <li style="margin-bottom: 1em;">
      <strong>{card.name}</strong><br />
      {#if card.image_uris}
        <img src={card.image_uris.small} alt={card.name} width="240" />
      {/if}
    </li>
  </ul>
{:else}
  <p>カードが見つかりません。</p>
{/if}
