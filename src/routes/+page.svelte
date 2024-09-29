<script>
	import Board from "$lib/components/Board.svelte";
    import { move } from "$lib/components/board";
</script>

<style>

    .board-container {
        display: flex;
        justify-content: center;
        padding: 30px;
    }

    .flex-center {
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        background-color: rgb(76, 76, 76);
        height: 100vh;
    }
</style>
<div class="flex-center">
    <div class="board-container">
        <Board></Board>
    </div>
</div>