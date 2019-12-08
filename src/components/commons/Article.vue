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
import Listapontos from '../listas/Listapontos'
import ListaRotas from '../listas/ListaRotas'

export default {
    name: 'Article',
    components:{
        Mapa,
        Listapontos,
        ListaRotas
    },
    mounted(){
        this.returnById('mapa').addEventListener('click', ()=> this.flag = 0)
        this.returnById('pontos').addEventListener('click', ()=>this.flag = 1)
        this.returnById('rotas').addEventListener('click', ()=> this.flag = 2)
    },
    data(){
        return{
            flag: 0
        }
    },
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
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
