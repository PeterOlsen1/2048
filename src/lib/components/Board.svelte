<script>
    import { onMount } from "svelte";
    import Box from "./Box.svelte";
    import { state, setupEventListeners } from "./board";

    onMount(setupEventListeners);
</script>

<style>
    .board {
        background-color: rgba(200, 200, 200, 0.2);
        border-radius: 10px;
        padding: 20px;
        gap: 10px;
        width: 330px;
        height: 330px;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        grid-template-rows: 1fr 1fr 1fr 1fr;
    }
</style>

<div class="board">
    {#each state as row}
        {#each row as box}
            {#if box}
                <Box value={box.value} row={box.row} col={box.col} id='box-{box.id}' />
            {/if}
        {/each}
    {/each}
</div>  