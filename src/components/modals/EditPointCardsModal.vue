<template>
    <div class="modal index animated has-text-centered" id="modal2">
        <div class="modal-background"></div>
        <div class="box form1 is-paddingless nav">
            <div class="column has-background-primary nav has-text-right">
                <span class="icon">
                </span>
            </div>
            <div class="column">
                <form class="article animated" id="menu-atualizar">
                    <label class="label has-text-left is-size-6">{{field}}</label>
                    <div class="field space1">
                        <div class="control has-icons-left has-icons-right">
                            <input class="input" v-model="name" type="text" placeholder="Qual o nome do ponto">
                        </div>
                    </div>
                    <br>
                    <div class="field">
                        <div class="control has-icons-left has-icons-right">
                            <autocomplete default-value="" :search="search" :get-result-value="getSearchResultValue"  placeholder="Pesquise um local" id="autocomplete2"></autocomplete>
                        </div>
                    </div>
                    <div class="field space2">
                        <div class="control has-text-centered">
                            <button type="submit" class="button form1button is-primary" id="save-ponto2" @click="update">Atualizar</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        <button class="modal-close is-large" @click="closeEditModal" id="modal2-close" aria-label="close"></button>
    </div>
</template>

<script>
import { setTimeout } from 'timers';
import Autocomplete from '@trevoreyre/autocomplete-vue';
import Notification from '../commons/Notification';
import validation from '../../validation.js';
import {dbConn} from '../../Database';
import '@trevoreyre/autocomplete-vue/dist/style.css';

export default {
    name: 'EditPointCardsModal',
    components:{
        Autocomplete,
    },
    data(){
        return{
            name: '',   
            field: 'Atualize o ponto',
        }
    },
    methods:{
        closeEditModal(){
            this.$store.dispatch('closeEditModal', this.returnById('modal2')) 
        },
        async search(event){
            return new Promise(resolve => resolve(this.$data.mapProvider.search({ query: event ? event : ''}))).then(result=> result);            
        },
        update(e){
            e.preventDefault()
            this.$store.dispatch('updateSelectedPointCard', this.name) 
            Notification.methods.notificate('Ponto foi atualizado');                
            this.name = '';
            this.$store.dispatch('closeEditModal', this.returnById('modal2'))
        },
        getSearchResultValue(result) {
            this.$store.commit('getPointUpdateData', result)
            return result.label;
        },
   }
}
</script>

<style scoped>
.index{
    z-index: 3;    
}
#modal-close{
    margin-top: 50px    
}
.hidden{
    display: none;
}

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
</style>
