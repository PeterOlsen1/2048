<script>
    export let text = "hello";
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
        
    }
</style>

<div class="box">
    <p>{text}</p>
</div>