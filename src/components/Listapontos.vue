<template>
    <nav class="panel p" id="alvo">
        <div class="container" id="lista">
            <p class="panel-heading nobotborder">
                Pontos que você marcou...
            </p>
            <ul v-if="this.flag">
                <li v-for="value in this.values">
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
        <Modal2/>
    </nav>
</template>

<script>
import Notification from './Notification';
import Database from './Database';
import Modal2 from './Modal2';

import { setTimeout } from 'timers';
export default {
    name: 'Listapontos',
    components:{
        Modal2
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
        document.getElementById('save-ponto').addEventListener('click', ()=>{
            this.list();
        })
        document.getElementById('save-ponto2').addEventListener('click', ()=>{
            this.list();
        })
    },
    props:{
        value: Object
    },
    methods:{
        select(value){
            let aux = document.getElementById('locate2');
            this.reselect()
            if (value.selected) {
                aux.classList.add('change2');
                aux.classList.remove('change1', 'has-text-light');
                value.selected = false;
                localStorage.removeItem('selected1'); 
            } else {
                aux.classList.add('change1', 'has-text-light');
                aux.classList.remove('change2');
                value.selected = true;   
                localStorage.selected1 = JSON.stringify(value); 
            }
            Database.methods.updateItem('pontos', [value]);
            this.list();
        },
        reselect(){
            if (localStorage.selected1) {
                let aux = JSON.parse(localStorage.selected1);
                if (aux || aux.selected === false) {
                    aux.selected = false;
                    Database.methods.updateItem('pontos', [aux]);                
                }                
            }
        },
        list(value = []){
            let db = window.indexedDB.open('vuemap', 2);
            db.onsuccess = function(event) {
                let getTransaction = this.result
                                        .transaction('pontos', "readwrite")
                                        .objectStore('pontos')
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
            let aux = document.getElementById('locate2');
            if (value.selected === true) {
                aux.classList.remove('has-text-light');
                aux.classList.add('change2');
                localStorage.removeItem('selected1'); 
            }
            Database.methods.removeItem('pontos', value.label);
            Notification.methods.notificate('Ponto deletado');
            this.list();
        },
        edit(value){
            console.log(value)
            if(!localStorage.tutorial1){
                Notification.methods.notificate(`
                    Dica:
                    Para atualizar um ponto basta preencher o campo da informação a ser mudada e clicar em salvar,
                    sem necessidade de preencher todos os campos
                `, 30000)
                localStorage.tutorial1 = true;
            }
            localStorage.pointValue = JSON.stringify(value);
            Modal2.methods.openEditModal();
        },
        reset(){
            let aux = document.getElementById('locate2');

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
                        aux.classList.remove('change1', 'has-text-light');
                        localStorage.removeItem('selected1'); 
                        Database.methods.clearList('pontos')
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
