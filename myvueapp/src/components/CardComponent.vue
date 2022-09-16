
<template>
    <div class="card">
        <div class="card-header">
            <h1> {{title}}</h1>
            <!-- <h1> {{title[0]}}</h1> -->
        </div>
        <div class="loremipsum">
            <p>{{ description }}</p>
        </div>
    </div>
    &nbsp;
</template>

<script>
export default {
    props: [
    "title",
    "description"
  ]
}
</script>

<style lang="css">
    @import "../styles/CardComponent.css";
</style>