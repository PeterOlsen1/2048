<script>
    export let value;
    export let row;
    export let col;
    export let id;

    $: display = value;
</script>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap');

    .box {
        background-color: rgba(255, 169, 138, 0.658);
        width: 75px;
        height: 75px;
        text-align: center;
        align-items: center;
        border-radius: 10px;
        color: white;
        font-family: "Open Sans", sans-serif;
        font-weight: 600;
        display: flex;
        justify-content: center;
        font-size: 18pt;
/*         
        transition: grid-row 0.5s ease, grid-column 0.5s ease, grid-area 0.5s ease;
        transition: transform 0.1s ease-in-out; */
        transition: all 0.1s ease-in-out;
        position: relative;
        left: 0;
        top: 0;
    }
</style>

<div class="box" style="grid-row: {row + 1}; grid-column: {col + 1}" id="{id}">
    <p>{display}</p>
</div>