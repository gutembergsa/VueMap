<template>
    <nav class="panel p" id="alvo">
        <div class="container" id="lista">
            <p class="panel-heading nobotborder">
                Rotas que você marcou...
            </p>
            <ul v-if="this.flag">
                <li v-for="value in this.values" v-bind:value="value">
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
                                                        {{value.label[0][0]}}
                                                </div>
                                                <div class="content" id="latlong">
                                                        {{value.label[1][0]}}
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
        <Modal3/>
    </nav>
</template>

<script>
import Notification from './Notification';
import Database from './Database';
import Modal3 from './Modal3';
import { setTimeout } from 'timers';
export default {
    name: 'ListaRotas',
    components:{
        Modal3
    },
    data(){
        return{
            values: [],
            clicks: [],
            flag: false,
            flag2: false,
            time: 5
        }
    },
    mounted(){
        this.list();
        document.getElementById('save-rota').addEventListener('click', ()=>{
            this.list();
        })
        document.getElementById('save-rota2').addEventListener('click', ()=>{
            this.list();
        })
    },
    props:{
        value: Object
    },
    methods:{
        select(value){
            let aux = document.getElementById('locate3');
            let instructions = document.getElementById('instructions');
            this.reselect()
            if (value.selected) {
                aux.classList.add('change2');
                aux.classList.remove('change3', 'has-text-light');
                value.selected = false;
                localStorage.removeItem('selected2'); 
                localStorage.removeItem('instructions'); 
                instructions.classList.add('hide');
                setTimeout(() => {
                    instructions.classList.remove('show');
                    instructions.classList.add('is-hidden');
                }, 100);
            } else {
                aux.classList.add('change3', 'has-text-light');
                aux.classList.remove('change2');
                value.selected = true;   
                localStorage.selected2 = JSON.stringify(value); 
            }
            Database.methods.updateItem('rotas', [value]);
            this.list();
        },
        reselect(){
            if (localStorage.selected2) {
                let aux = JSON.parse(localStorage.selected2);
                if (aux || aux.selected === false) {
                    aux.selected = false;
                    Database.methods.updateItem('rotas', [aux]);                
                }                
            }
        },
        list(value = []){
            let db = window.indexedDB.open('vuemap', 2);
            db.onsuccess = function(event) {
                let getTransaction = this.result
                                        .transaction('rotas', "readwrite")
                                        .objectStore('rotas')
                                        .getAll();
                getTransaction.onsuccess = async function(event){
                    value = await JSON.stringify(this.result)

                };
            };
            setTimeout(()=>{
                if(JSON.parse(value).length){
                    this.flag = true
                    this.values = JSON.parse(value)
                }else{
                    this.flag = false
                }
            }, 500)
        },
        remove(value){
            let aux = document.getElementById('locate3');
            if (value.selected === true) {
                aux.classList.add('change2');
                aux.classList.remove('change3', 'has-text-light');
                localStorage.removeItem('selected2'); 
                localStorage.removeItem('instructions'); 
            }
            Database.methods.removeItem('rotas', value.label);
            Notification.methods.notificate('Rota deletada');
            this.list();
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
            localStorage.routValue = JSON.stringify(value); 
            Modal3.methods.openEditModal();
            this.list()
        },
        reset(){
            let aux = document.getElementById('locate3');

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
                        aux.classList.add('change2');
                        aux.classList.remove('change3', 'has-text-light');
                        localStorage.removeItem('selected2'); 
                        localStorage.removeItem('instructions'); 
                        Database.methods.clearList('rotas')
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
