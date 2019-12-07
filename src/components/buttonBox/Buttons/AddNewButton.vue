<template>
    <div class="column is-paddingless">
        <button class="button is-large" @click="openAddingModal">
            <div id="btn" data-target="modal">
                <span class="icon">
                    <i class="fas fa-plus"></i>
                </span>
            </div>
        </button>
    </div>
</template>

<script>
export default {
    methods:{
        openAddingModal(){
            this.$store.dispatch('openAddNewModal', this.returnById('modal'))
        }        
    }
}
</script>

<style>

</style>