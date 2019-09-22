<template>
<div class="box form1 is-paddingless nav">
    <Database/>
    <div class="column has-background-info nav has-text-left">
        <span class="icon" id="backleft" @click="[goBackLeft(), resetMenu()]">
            <i class="fas fa-angle-left"></i>
        </span>
    </div>
    <div class="column" id="article">
        <div class="article animated" id="menu-rota">
            <div class="field">
                <label class="label has-text-left is-size-6">Escolha um nome para a rota</label>
                <div class="control has-icons-left has-icons-right">
                    <input class="input" v-model="name" type="text" placeholder="Qual o nome da rota">
                </div>
            </div>
            <br>
            <div class="field">
                <label class="label has-text-left is-size-6">Defina o ponto de partida</label>
                <div class="control has-icons-left has-icons-right">
                    <autocomplete :search="search1" default-value="" :get-result-value="getResultValue1" placeholder="Partida"></autocomplete>
                </div>
            </div>
            <div class="field">
                <label class="label has-text-left is-size-6">Defina o ponto de chegada</label>
                <div class="control has-icons-left has-icons-right">
                    <autocomplete :search="search2" default-value="" :get-result-value="getResultValue2" placeholder="Chegada"></autocomplete>
                </div>
            </div>
            <div class="field space2">
                <div class="control has-text-centered">
                    <button type="submit" class="button form1button is-info" id="save-rota" @click="save">Atualizar</button>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import Autocomplete from '@trevoreyre/autocomplete-vue'
import '@trevoreyre/autocomplete-vue/dist/style.css'
import validation from '../validation.js';
import { BingProvider} from 'leaflet-geosearch';
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
            provider: new BingProvider({ params: { key: 'AghuzeeA1vtDHzQVX7hOoRWJ56ASwXHZ5yQi3AR_M3p1WED9B21cJ8RA5PuIm5Cy'}}),
            name: '',   
            partida:[],
            chegada: [],
            flag: true, 
            label: [],
            aux: []
        }
    },
    mounted(){
        this.article = document.getElementById('article');
        this.modalContent1 = document.getElementById('modal-content1');
        this.modalContent3 = document.getElementById('modal-content3');
    },
    methods:{
        async search1(event){
            let aux = await this.provider.search({ query: event ? event : ''}); 
            this.label[0] = aux.map(value => value.label);
            this.partida = aux.map(value => value.bounds);
            return this.label[0];                
        },
        async search2(event){
            let aux = await this.provider.search({ query: event ? event : ''}); 
            this.label[1] = aux.map(value => value.label);
            this.chegada = aux.map(value => value.bounds);
            return this.label[1];                
        },
        save(event){
            event.preventDefault();
            let aux = {
                nome: this.name,
                label: this.aux,
                partida: this.partida[0],
                chegada: this.chegada[0],
                selected: false
            };
            if (!validation.checkEmpty2(aux)) {
                Notification.methods.notificate('Preencha todos os campos');
            }
            else{
                Notification.methods.notificate('Rota foi salva');          
                Database.methods.addItem('rotas', [aux]);
                this.$emit('closeEvt');
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
        },
        getResultValue1(result) {
            console.log(result)
            this.aux[0] = null
            this.aux[0] = result;
            return result;
        },
        getResultValue2(result) {
            console.log(result)
            this.aux[1] = null
            this.aux[1] = result;
            return result;
        },
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
    height: 420px;
}   
.space1{
    margin-top: 35px;
}
.space2{
    margin-top: 20px;
}

.form1button{
    width: 170px;
    height: 40px;
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
#article{
    height: 500px;
}
</style>
