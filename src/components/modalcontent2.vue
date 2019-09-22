<template>
<div class="box form1 is-paddingless nav">
    <div class="column has-background-primary nav has-text-right">
        <span class="icon" id="backright" @click="goBackRight">
            <i class="fas fa-angle-right"></i>
        </span>
    </div>
    <div class="column">
        <form class="article animated" id="menu-ponto">
            <label class="label has-text-left is-size-6">{{field}}</label>
            <div class="field ">
                <div class="control has-icons-left has-icons-right">
                    <input class="input" v-model="name" type="text">
                </div>
            </div>
            <br>
            <div class="field">
                <div class="control has-icons-left has-icons-right">
                    <label class="label has-text-left is-size-6">Pesquise um endereço</label>
                    <autocomplete :search="search" :get-result-value="getResultValue" id="autocomplete"></autocomplete>
                </div>
            </div>
            <div class="field ">
                <div class="control has-text-centered">
                    <button type="submit" class="button form1button is-primary" id="save-ponto" @click="save">Salvar</button>
                </div>
            </div>
        </form>
    </div>
</div>
</template>

<script>
// import
import Autocomplete from '@trevoreyre/autocomplete-vue';

import Notification from './Notification';
import validation from '../validation.js';
import Database from './Database';
import { BingProvider} from 'leaflet-geosearch';
import '@trevoreyre/autocomplete-vue/dist/style.css';

export default {
    name: 'modalPointForm',
    components:{
        Autocomplete,
        Database,
    },
    mounted() {
        this.modalContent1 = document.getElementById('modal-content1');
        this.modalContent2 = document.getElementById('modal-content2');
        this.autocomplete = document.getElementById('autocomplete');
    },
    data(){
        return {
            provider: new BingProvider({ params: { key: 'AghuzeeA1vtDHzQVX7hOoRWJ56ASwXHZ5yQi3AR_M3p1WED9B21cJ8RA5PuIm5Cy'}}),
            name: '',   
            local: [],
            label: [],
            field: 'Escolha o nome do ponto',
            aux: null
        }
    },
    methods:{
        async search(event){
            let aux = await this.provider.search({ query: event ? event : 'campos'}); 
            this.local = aux.map(value => value.bounds);
            this.label = aux.map(value => value.label);
            console.log(this.label)
            return this.label;
        },
        save(event){
            event.preventDefault();

            let aux = {
                label: this.aux,
                nome: this.name,
                lat: this.local[0],
                selected: false
            }
            if (!validation.checkEmpty(aux)) {
                Notification.methods.notificate('Preencha todos os campos');
            }
            else{
                Database.methods.addItem('pontos', [aux]);
                Notification.methods.notificate('Ponto foi salvo');
                
                this.$emit('closeEvt');
                this.field = 'Adicione um ponto';
                this.name = '';
            }
        },
        resetMenu(){
            this.name = '';
            this.txt1 = "Adicione o ponto de partida";
        },
        goBackRight(){
            this.modalContent2.classList.add('slideOutLeft');
            setTimeout(()=>{
                this.modalContent2.classList.add('hidden');
                this.modalContent1.classList.add('slideInRight');
                this.modalContent1.classList.remove('zoomOutRight','hidden');
            }, 500);
            this.name = '';
        },
        getResultValue(result) {
            console.log(result)
            this.aux = null
            this.aux = result;
            return result;
        },
    }
};
</script>

<style scoped>
.nav{
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    z-index: 2;
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
    margin-top: 70px;
}
.form1button{
    width: 170px;
    height: 40px;
}
.hidden{
    display: none;
}
</style>
