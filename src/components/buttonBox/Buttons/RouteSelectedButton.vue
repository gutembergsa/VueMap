<template>
    <div class="column is-paddingless">
        <button class="button round is-large" :class="{'change3': flag, 'has-text-light': flag}" id="locate3"> 
            <span class="icon">
                <i class="fas fa-route"></i>
            </span>
        </button>
    </div>  
</template>

<script>
export default {
    name: 'RouteSelectedButton',
    props: {flag: Boolean | Object},
}
</script>

<style>

</style>