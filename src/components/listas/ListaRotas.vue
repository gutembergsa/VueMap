<template>
    <nav class="panel p" id="alvo"> 
        <div class="container" id="lista">
            <p class="panel-heading nobotborder">
                Rotas que você marcou...
            </p>
            <ul v-if="this.flag">
                <li v-for="value in this.values" :key="`${value.label[0]}, ${value.label[1]}`">
                    <a class="panel-block puttopborder" :class="{'is-active': value.selected, 'change3': value.selected, 'change2': !value.selected}">
                        <article class="media extend ">
                            <div class="media-content">
                                <div class="columns is-mobile">
                                    <div class="column createat2" @click="select(value)">
                                        <div class="content createat4" id="name">
                                            <b>{{value.nome}}</b>
                                        </div>
                                        <div class="columns is-mobile">
                                            <div class="column is-paddingless">
                                                <span class="panel-icon icone"  :class="{'has-text-light': value.selected}">
                                                    <i class="fas fa-3x fa-route"></i>
                                                </span>
                                            </div>
                                            <div class="column is-three-quarters">
                                                <div class="content" id="latlong">
                                                        {{value.label[0]}}
                                                </div>
                                                <div class="content" id="latlong">
                                                        {{value.label[1]}}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="column is-narrow createat3">
                                        <button class="button is-outlined" @click="edit(value)">
                                            <span class="icon">
                                                <i class="fas fa-cog"></i>
                                            </span>
                                        </button>
                                        <br>
                                        <button class="button is-outlined" @click="remove(value)">
                                            <span class="icon">
                                                <i class="fas fa-times"></i>
                                            </span>                            
                                        </button>
                                        <br/>
                                    </div>
                                </div>
                            </div>
                        </article>
                    </a>                
                </li>
            </ul>         
            <div v-else>
                <p class="panel-heading extend">
                    Você não tem rotas salvas
                </p>
            </div>
            <div class="panel-tabs" @click="reset()">
                <button id="resetlista2" class="button is-outlined is-fullwidth is-hidden-desktop is-small" :class="{'change3': !flag2, 'resetbutton': flag2}">
                    <p v-if="!flag2" class="has-text-white">Clique para inicar o reset da lista</p>                
                    <p v-else class="has-text-white">Resetando em {{time}} seg, clique para cancelar</p>                
                </button>
                <button id="resetlista2" class="button is-outlined is-fullwidth is-hidden-touch" :class="{'change3': !flag2, 'resetbutton': flag2}">
                    <p v-if="!flag2" class="has-text-white">Clique para inicar o reset da lista</p>                
                    <p v-else class="has-text-white">Resetando em {{time}} seg, clique para cancelar</p>                
                </button>
            </div>
        </div>
        <EditRouteCardsModal/>
    </nav>
</template>

<script>
import Notification from '../commons/Notification';
import EditRouteCardsModal from '../modals/EditRouteCardsModal';
import { setTimeout } from 'timers';
import {dbConn} from '../../Database';

export default {
    name: 'ListaRotas',
    components:{
        EditRouteCardsModal
    },
    data(){
        return{
            values: [],
            flag: false,
            flag2: false,
            time: 5
        }
    },
    mounted(){
        this.list();
        window.teste.$on('updateRouteList', () => this.list())
    },
    methods:{
        select(value){

            dbConn.getSelectedCard('rotas').then(result => {
                if (result) {
                    result.selected = false;            
                    dbConn.updateData(result, 'rotas')                    
                }
                this.$store.commit('selectRouteCard', [this.returnById('locate3'), this.returnById('instructions'), value])
                this.list()            
            })            
        },

        list(){
            dbConn.getAllData('rotas').then(result => {
                if (result.length > 0) {
                    this.flag = true
                    this.values =  result
                }
                else this.flag = false
            })
        },
        remove(value){
            this.$store.dispatch('removeCard', [this.returnById('locate3'), value])
            Notification.methods.notificate('Rota deletada')
            this.list()           
        },
        edit(value){
            if(!localStorage.tutorial2){
                Notification.methods.notificate(`
                    Dica:
                    Para atualizar um ponto basta preencher o campo da informação a ser mudada e clicar em salvar,
                    sem necessidade de preencher todos os campos
                `, 30000)
                localStorage.tutorial2 = true;
            }
            this.$store.dispatch('openEditModal', [this.returnById('modal3'), value]) 
        },
        reset(){
            if (this.flag2) {
                this.flag2 = false;
                this.time = 5;
                clearInterval(count)                
            }
            this.flag2 = !this.flag2;
            
            let count = setInterval(() => {
                this.time--;
                if (this.time < 1) {
                    if (this.flag2) {
                        this.$store.dispatch('clearList', [this.returnById('locate3'), false]) 
                        Notification.methods.notificate('Lista Resetada');
                        this.list();                        
                    }
                    this.flag2 = false;
                    this.time = 5;
                    clearInterval(count)
                }                
            }, 1000);
        }
    }
}
</script>

<style scoped>
.p{
    display: block;
    z-index: 1;
}

.createat2{
    margin-top: 11.6px;
}
.createat3{
    margin-top: 5%;
}
.createat4{
    margin-left: 25%;
    font-size: 1.5em
}
.nobotborder{
    border-bottom: none;
}
.puttopborder{
    border-top: 1px solid #dbdbdb;
}
.icone{
    margin-left: 25%;
}
.extend{
    width: 100%;
}
.change3{
    background-color:hsl(204, 86%, 53%);
    transition-duration: 2s;
}
.change3:hover{
    background-color:hsl(204, 86%, 53%);
}
.resetbutton{
    background-color: hsl(348, 100%, 61%);
    transition-duration: 2s;
    color: aliceblue;
}
</style>
