<template>
    <div class="section has-background-light has-text-centered space">
        <Modal/>
        <div class="columns is-mobile">
            <div class="column is-paddingless">
                <button class="button is-large">
                    <div id="btn" data-target="modal">
                        <span class="icon">
                            <i class="fas fa-plus"></i>
                        </span>
                    </div>
                </button>
            </div>
            <div class="column is-paddingless">
                <button class="button round is-large" :class="{'change1': this.flag1, 'has-text-light': this.flag1}" id="locate2"> 
                    <span class="icon">
                        <i class="fas fa-map-marker-alt"></i>
                    </span>
                </button>
            </div>
            <div class="column is-paddingless">
                <button class="button round is-large" :class="{'change3': this.flag2, 'has-text-light': this.flag2}" id="locate3"> 
                    <span class="icon">
                        <i class="fas fa-route"></i>
                    </span>
                </button>
            </div>
        </div>
        <div class="section card container">
            <label class="label is-size-4">
                Siga oeste em Avenida Presidente Castelo Branco
            </label>
        </div>

    </div>
</template>

<script>
import Modal from './Modal'
import { setTimeout } from 'timers';

export default {
    name: 'Buttonbox',
    components:{
        Modal
    },
    data(){
        return{
            flag1: null,
            flag2: null
        }
    },
    mounted(){
        Modal.methods.openModal()
        this.setFlag1();
        this.setFlag2();
    },
    methods:{
        setFlag1(){
            if (localStorage.selected1) {
                let aux = JSON.parse(localStorage.selected1);
                this.flag1 = aux.selected;                
            }
        },
        setFlag2(){
            if (localStorage.selected2) {
                let aux = JSON.parse(localStorage.selected2);
                this.flag2 = aux.selected;                
            }
        }
    }
}
</script>

<style scoped>
.round{
    border-radius: 100%
}
.space{
    padding-top: 85px;
    padding-bottom: 20px;
}
</style>

<style>
.change1{
    background-color:hsl(171, 100%, 41%);
    transition-duration: 3s;
}
.change1:hover{
    border: solid .6px black;
}
.change2{
    background-color: white;
    transition-duration: 2s;
}
.change3{
    background-color:hsl(204, 86%, 53%);
    transition-duration: 2s;
}
</style>
