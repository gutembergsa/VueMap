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
                    <autocomplete :search="search" default-value="" :get-result-value="getResultValue1" placeholder="Partida"></autocomplete>
                </div>
            </div>
            <div class="field">
                <label class="label has-text-left is-size-6">Defina o ponto de chegada</label>
                <div class="control has-icons-left has-icons-right">
                    <autocomplete :search="search" default-value="" :get-result-value="getResultValue2" placeholder="Chegada"></autocomplete>
                </div>
            </div>
            <div class="field space2">
                <div class="control has-text-centered">
                    <button type="submit" class="button form1button is-info" id="save-rota" @click="save">Salvar rota</button>
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
            flag2: true, 
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
            return new Promise(resolve => resolve(this.provider.search({ query: event ? event : 'campos'}))).then(result=> result);            
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
            this.label[0] = result.label;
            this.partida = result.bounds;
            return result.label;                
        },
        getResultValue2(result) {
            this.label[1] = result.label;
            this.chegada = result.bounds;
            return result.label;                
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
