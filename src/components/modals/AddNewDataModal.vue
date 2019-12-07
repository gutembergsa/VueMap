<template>
    <div class="modal index animated has-text-centered" id="modal">
        <div class="modal-background"></div>
        <ChooseDataModal class="animated" id="modal-content1"/>
        <NewPointModal class="hidden animated" id="modal-content2" @closeEvt="closingContent"/>
        <NewRouteModal class="hidden animated" id="modal-content3" @closeEvt="closingContent"/>
        <button class="modal-close is-large"  id="modal-close" aria-label="close" @click="closingContent"></button>
    </div>
</template>

<script>
import ChooseDataModal from './ChooseDataModal'
import NewPointModal from './NewPointModal'
import NewRouteModal from './NewRouteModal'
import { setTimeout } from 'timers'

export default {
    name: 'AddNewDataModal',
    components:{
        ChooseDataModal,
        NewPointModal,
        NewRouteModal,
    },
    methods:{
        closingContent(){
            this.$store.dispatch('closeAddNewModal', this.returnById('modal'))
        }
    }
}
</script>

<style scoped>
.index{
    z-index: 2;    
}
#modal-close{
    margin-top: 50px    
}
.hidden{
    display: none;
}
</style>
