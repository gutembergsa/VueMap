<template>
    <div class="modal index animated has-text-centered" id="modal">
        <div class="modal-background"></div>
        <modalButtons class="animated" id="modal-content1"/>
        <modalPointForm class="hidden animated" id="modal-content2" @closeEvt="closingContent"/>
        <modalRoutForm class="hidden animated" id="modal-content3" @closeEvt="closingContent"/>
        <button class="modal-close is-large" id="modal-close" aria-label="close"></button>
    </div>
</template>

<script>
import modalButtons from './modalcontent1';
import modalPointForm from './modalcontent2';
import modalRoutForm from './modalcontent3';
import { setTimeout } from 'timers';

export default {
    name: 'Modal',
    components:{
        modalButtons,
        modalPointForm,
        modalRoutForm,
    },
    methods:{
        openModal(){
            document.addEventListener('DOMContentLoaded', () => {
                const btn = document.getElementById('btn');
                const btn2 = document.getElementById('modal-close');
                const modal = document.getElementById('modal');
                if(btn && btn2){
                    btn.addEventListener('click', function(){
                        let aux = document.getElementById(this.dataset.target);
                        modal.classList.remove('fadeOut', 'hidden');
                        if (aux) {
                            aux.classList.remove('fadeOut');
                            aux.classList.add('is-active', 'fadeIn');
                        }
                    })
                    btn2.addEventListener('click', function(){
                        let aux = document.getElementById(btn.dataset.target);
                        aux.classList.add('fadeOut');
                        setTimeout(()=>{
                            if (aux) {
                                aux.classList.remove('is-active', 'fadeIn');
                            }
                        },300);
                    })
                }
            });            
        },
        closingContent(){
            const close = document.getElementById('modal');
            close.classList.add('fadeOut');
            setTimeout(()=>{
                close.classList.add('hidden');   
            },300);
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
