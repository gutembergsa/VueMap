<template>
<div class="box form1 is-paddingless nav">
    <Database/>
    <div class="column has-background-info nav has-text-left">
        <span class="icon" id="backleft" @click="[goBackLeft(), resetMenu()]">
            <i class="fas fa-angle-left"></i>
        </span>
    </div>
    <div class="column" id="article">
        <form class="article animated" id="menu-rota">
            <label id class="label has-text-left is-size-6" v-if="flag">Escolha o nome da rota</label>
            <label id class="label has-text-left is-size-6" v-else>Adicione o ponto de chegada</label>
            <br>
            <div class="field" v-if="flag">
                <div class="control has-icons-left has-icons-right">
                    <input class="input" v-model="name" type="text">
                </div>
            </div>
            <div class="field">
                <label class="label has-text-left is-size-6" v-if="flag">Pesquise um ponto de partida</label>
                <div class="control has-icons-left has-icons-right" v-if="flag">
                    <autocomplete :search="search" id="autocomplete2" default-value="" auto-complete auto-select=false></autocomplete>
                </div>
                <div class="control has-icons-left has-icons-right" v-else>
                    <autocomplete :search="search" default-value="" id="autocomplete2"></autocomplete>
                </div>
            </div>
            <div class="field  is-fullwidth">
                <div class="control has-text-centered" id="save-rota">
                    <button class="button form1button is-small is-info" v-if="flag" @click="pass">{{txt1}}</button>
                    <button class="button space3 form1button is-info" v-else @click="save">{{txt2}}</button>
                </div>
            </div>
        </form>
    </div>
</div>
</template>

<script>
import Autocomplete from '@trevoreyre/autocomplete-vue'
import '@trevoreyre/autocomplete-vue/dist/style.css'
import validation from '../validation.js';
import { EsriProvider } from 'leaflet-geosearch';
import Notification from './Notification';
import Database from './Database';

export default {
    name: 'modalRoutForm',
    components:{
        Database,
        Autocomplete
    },
    data(){
        return{
            txt1: 'Adicione o ponto de partida',
            txt2: 'Criar rota',
            provider: new EsriProvider(),
            name: '',   
            partida:[],
            chegada: [],
            flag: true, 
            label: [],
        }
    },
    mounted(){
        this.article = document.getElementById('article');
        this.modalContent1 = document.getElementById('modal-content1');
        this.modalContent3 = document.getElementById('modal-content3');
    },
    methods:{
        async search(event){
            let aux = await this.provider.search({ query: event ? event : ''}); 
            if (this.flag) {
                this.label[0] = aux.map(value => value.label);
                this.partida = aux.map(value => value.bounds);
                return this.label[0];                
            }
            else{
                this.label[1] = aux.map(value => value.label);
                this.chegada = aux.map(value => value.bounds);
                return this.label[1];                
            }                
        },
        pass(event){
            event.preventDefault();
            console.log(this.partida);
            if (this.name === '' || this.partida.length < 1) {
                Notification.methods.notificate('Preencha todos os campos');
                
            } else {
                this.article.classList.remove('fadeIn');
                this.article.classList.add('fadeOut', 'hidden');
                this.flag = false;
                this.article.txt1 = "Adicione o ponto de chegada"
                this.article.classList.remove('fadeOut', 'hidden');
                this.article.classList.add('fadeIn');                  
            } 
         },
        save(event){
            event.preventDefault();
            let aux = {
                nome: this.name,
                label: this.label,
                partida: this.partida,
                chegada: this.chegada,
                selected: false
            };
            if (!validation.checkEmpty2(aux)) {
                Notification.methods.notificate('Preencha todos os campos');
            }
            else{
                Notification.methods.notificate('Rota foi salva');          
                Database.methods.addItem('rotas', [aux]);
                this.$emit('closeEvt');
                this.flag = true;
                this.name = '';
            }
        },
        resetMenu(){
            this.flag = true;
            this.name = '';
            this.txt1 = "Adicione o ponto de partida";
        },
        goBackLeft(){
            this.modalContent3.classList.add('slideOutRight');
            setTimeout(()=>{
                this.modalContent3.classList.add('hidden');
                this.modalContent1.classList.add('slideInLeft');
                this.modalContent1.classList.remove('zoomOutLeft','hidden');
            }, 500);
        }
    }
};
</script>

<style scoped>
.nav{
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
}
.form1{
    width: 270px;
    height: 320px;
}   
.space1{
    margin-top: 35px;
}
.space2{
    margin-top: 20px;
}
.space3{
    margin-top: 38px;
}
.form1button{
    width: 170px;
    height: 40px;
}
.hidden{
    display: none;
}
</style>
