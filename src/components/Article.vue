<template>
    <section class="section has-background-light no-padding2 ">
        <div class="container">
            <div class="columns is-multiline is-mobile">
                <div class="column is-one-third is-paddingless">
                    <button class="button is-fullwidth" id="mapa">Mapa</button>
                </div>
                <div class="column is-one-third is-paddingless">
                    <button class="button is-fullwidth" id="pontos">Pontos salvos</button>
                </div>
                <div class="column is-one-third is-paddingless">
                    <button class="button is-fullwidth" id="rotas">Rotas salvas</button>
                </div>
                <div v-if="flag==0" class="column no-padding">
                    <transition name="fade">
                        <Mapa/>
                    </transition>
                </div>
                <div v-else-if="flag==1" class="column no-padding">
                    <transition name="fade">
                        <Listapontos/>
                    </transition>
                </div>
                <div v-else-if="flag==2" class="column no-padding">
                    <transition name="fade">
                        <ListaRotas/>
                    </transition>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import Mapa from './Map'
import Listapontos from './Listapontos'
import ListaRotas from './ListaRotas'

export default {
    name: 'Article',
    components:{
        Mapa,
        Listapontos,
        ListaRotas
    },
    mounted(){
        this.viewToggle();
    },
    data(){
        return{
            flag: 0
        }
    },
    methods:{
        viewToggle(){
            const mapbtn = document.getElementById('mapa');
            const pntbtn = document.getElementById('pontos');
            const rtbtn = document.getElementById('rotas');
            mapbtn.addEventListener('click', ()=>{
                this.flag = 0;
            });
            pntbtn.addEventListener('click', ()=>{
                this.flag = 1;
            });
            rtbtn.addEventListener('click', ()=>{
                this.flag = 2;
            });
        }
    }
}
</script>

<style>
.no-padding{
    padding: .1%;
}
.no-padding2{
    padding: 4%;
    padding-bottom: 50px;
}
.fade-enter-active{
  transition: opacity 4.5s;
}
.fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active em versões anteriores a 2.1.8 */ {
  opacity: 0;
}
</style>
