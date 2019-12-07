<template>
    <nav class="panel p" id="alvo">
        <div class="container" id="lista">
            <p class="panel-heading nobotborder">
                Pontos que você marcou...
            </p>
            <ul v-if="this.flag">
                <li v-for="value in this.values" :key="`${value.label}`">
                    <a class="panel-block puttopborder" :class="{'change1': value.selected, 'is-active': value.selected, 'change2': !value.selected}">
                        <article class="media extend ">
                            <figure class="media-left createat">
                                <span class="panel-icon" :class="{'has-text-light': value.selected}">
                                    <i class="fas fa-map-marker-alt icon is-medium" aria-hidden="true"></i>
                                </span>
                            </figure>
                            <div class="media-content">
                                <div class="columns is-mobile">
                                    <div class="column createat2" @click="select(value)">
                                        <div class="content" id="name">
                                            <b>{{value.nome}}</b>
                                        </div>
                                        <div class="content" id="latlong">
                                                {{value.label}}
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
                    Você não tem ponto salvos
                </p>
            </div>
            <div class="panel-tabs" @click="reset()">
                <button id="resetlista1" class="button is-outlined is-fullwidth is-hidden-desktop is-small" :class="{'change1': !flag2, 'resetbutton': flag2}">
                    <p v-if="!flag2" class="has-text-white">Clique para inicar o reset da lista</p>                
                    <p v-else class="has-text-white">Resetando em {{time}} seg, clique para cancelar</p>                
                </button>
                <button id="resetlista1" class="button is-outlined is-fullwidth is-hidden-touch" :class="{'change1': !flag2, 'resetbutton': flag2}">
                    <p v-if="!flag2" class="has-text-white">Clique para inicar o reset da lista</p>                
                    <p v-else class="has-text-white">Resetando em {{time}} seg, clique para cancelar</p>                
                </button>
            </div>
        </div>
        <EditPointCardsModal/>
    </nav>
</template>

<script>
import Notification from '../commons/Notification';
import EditPointCardsModal from '../modals/EditPointCardsModal';
import {dbConn} from '../../Database';

import { setTimeout } from 'timers';
export default {
    name: 'Listapontos',
    components:{
        EditPointCardsModal
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
        window.teste.$on('updatePointList', () => this.list())
    },
    methods:{
        select(value){;
            dbConn.getSelectedCard('pontos').then(result => {
                if (result) {
                    result.selected = false;            
                    dbConn.updateData(result, 'pontos')                    
                }
                this.$store.commit('selectPointCard', [this.returnById('locate2'), value])
                this.list();              
            })
        },
        list(){
            dbConn.getAllData('pontos').then(result => {
                if (result.length > 0) {
                    this.flag = true
                    this.values = result                    
                }
                else this.flag = false
            })
        },
        remove(value){
            this.$store.dispatch('removeCard', [this.returnById('locate2'), value])
            Notification.methods.notificate('Ponto deletado');
            this.list();
        },
        edit(value){
            if(!localStorage.tutorial1){
                Notification.methods.notificate(`
                    Dica:
                    Para atualizar um ponto basta preencher o campo da informação a ser mudada e clicar em salvar,
                    sem necessidade de preencher todos os campos
                `, 30000)
                localStorage.tutorial1 = true;
            }
            this.$store.dispatch('openEditModal', [this.returnById('modal2'), value]) 
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
                        this.$store.dispatch('clearList', [this.returnById('locate2'), true]) 
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
.createat{
    margin-top: 22.13px;
}
.createat2{
    margin-top: 11.6px;
}
.createat3{
    margin-left: auto;
}

.nobotborder{
    border-bottom: none;
}
.puttopborder{
    border-top: 1px solid #dbdbdb;
}
.norightpad{
    margin-right: 100%;
}
.extend{
    width: 100%;
}
.change1{
    background-color:hsl(171, 100%, 41%);
    transition-duration: 3s;
}
.change1:hover{
    background-color:hsl(171, 100%, 41%);
}
.resetbutton{
    background-color: hsl(348, 100%, 61%);
    transition-duration: 2s;
    color: aliceblue;
}
</style>
