<template>
<div class="box form1 is-paddingless nav">
    <div class="column has-background-primary nav has-text-right">
        <span class="icon">
            <i class="fas fa-angle-right"></i>
        </span>
    </div>
    <div class="column">
        <form class="article animated" id="menu-atualizar">
            <label class="label has-text-left is-size-6">{{field}}</label>
            <div class="field space1">
                <div class="control has-icons-left has-icons-right">
                    {{value}}
                    <input class="input" v-model="name" type="text" placeholder="Qual o nome do ponto">
                </div>
            </div>
            <br>
            <div class="field">
                <div class="control has-icons-left has-icons-right">
                    <autocomplete :search="search" placeholder="Pesquise um local" id="autocomplete"></autocomplete>
                </div>
            </div>
            <div class="field space2">
                <div class="control has-text-centered">
                    <button type="submit" class="button form1button is-primary" id="save-ponto" @click="update">Atualizar</button>
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
import { EsriProvider } from 'leaflet-geosearch';
import '@trevoreyre/autocomplete-vue/dist/style.css';

export default {
    name: 'modalPointEdit',
    components:{
        Autocomplete,
    },
    mounted() {
        console.log(this.value)
    },
    data(){
        return {
            provider: new EsriProvider(),
            name: '',   
            local: [],
            label: [],
            field: 'Atualize o ponto',
        }
    },
    props:{
        value: Object
    },
    methods:{
        async search(event){
            let aux = await this.provider.search({ query: event ? event : 'campos'}); 
            this.local = aux.map(value => value.bounds);
            this.label = aux.map(value => value.label);
            return this.label;
        },
        update(event){
            event.preventDefault();
            let aux = {
                label: this.label,
                nome: this.name,
                lat: this.local[0],
                long: this.local[1]
            }
            if (!validation.checkEmpty(aux)) {
                Notification.methods.notificate('Preencha todos os campos');
            }
            else{
                Database.methods.updateItem('pontos', [aux]);
                Notification.methods.notificate('Ponto foi atualizado');
                
                this.$emit('closeEvt');
                this.autocomplete.placeholder = 'Pesquise um local';
                this.field = 'Adicione um ponto';
                this.name = '';
            }
        }
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
