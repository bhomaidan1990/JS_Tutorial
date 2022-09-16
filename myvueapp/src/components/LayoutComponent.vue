<template>
    <div>
        <p class="header">Header</p>
            <slot>No Component Added!</slot>
        <p class="footer">Footer</p>
        <slot name="afterFooter"></slot>
    </div>
</template>

<script>
export default {
    
}
</script>

<style>
    @import "../styles/LayoutComponent.css";
</style>