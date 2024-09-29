<script>
	import Box from "$lib/components/Box.svelte";
</script>

<style>
    .board {
        background-color: rgba(200, 200, 200, 0.2);
        border-radius: 10px;
        padding: 20px;
        gap: 10px;
        width: 245px;
        height: 245px;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-template-rows: 1fr 1fr 1fr;
    }

    .board-container {
        width: 100vw;
        height: 100vw;
        background-color: rgb(76, 76, 76);
        display: flex;
        justify-content: center;
        padding: 30px;
    }
</style>
<div class="board-container">
    <div class="board">
        <Box text=1></Box>
        <!-- <Box text=2></Box>
        <Box text=3></Box>
        <Box text=4></Box>
        <Box text=5></Box>
        <Box text=6></Box>
        <Box text=7></Box>
        <Box text=8></Box>
        <Box text=9></Box> -->
    </div>
</div>