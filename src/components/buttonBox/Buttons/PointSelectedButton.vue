<template>
    <div class="column is-paddingless">
        <button @click="showSelectedPoint" class="button round is-large" :class="{'change1': this.flag, 'has-text-light': this.flag}" id="locate2"> 
            <span class="icon">
                <i class="fas fa-map-marker-alt"></i>
            </span>
        </button>
    </div>
</template>

<script>
export default {
    name: 'PointSelectedButton',
    props: {flag: Boolean | Object},
    methods:{
        async showSelectedPoint(){
            window.teste.$emit('showSelectedPoint')
        }
    }
}
</script>

<style>

</style>