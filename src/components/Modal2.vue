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
                            <autocomplete :search="search" placeholder="Pesquise um local" id="autocomplete2"></autocomplete>
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
import Notification from './Notification';
import validation from '../validation.js';
import Database from './Database';
import { EsriProvider } from 'leaflet-geosearch';
import '@trevoreyre/autocomplete-vue/dist/style.css';

export default {
    name: 'Modal2',
    components:{
        Autocomplete,
    },
    data(){
        return{
            provider: new EsriProvider(),
            name: '',   
            local: [],
            label: [],
            field: 'Atualize o ponto',
            value: null
        }
    },
    methods:{
        openEditModal(){ 
            let aux = document.getElementById('modal2');
            aux.classList.remove('fadeOut');
            aux.classList.add('is-active', 'fadeIn');
        },
        closeEditModal(){
            let close_btn = document.getElementById('modal2');
            close_btn.classList.add('fadeOut');
            setTimeout(()=>{
                if (close_btn) {
                    close_btn.classList.remove('is-active', 'fadeIn');
                }
            },300);
        },
        async search(event){
            let aux = await this.provider.search({ query: event ? event : 'campos'}); 
            this.local = aux.map(value => value.bounds);
            this.label = aux.map(value => value.label);
            return this.label;
        },
        update(e){
            e.preventDefault()
            this.value = JSON.parse(localStorage.pointValue);
            localStorage.removeItem('pointValue');
            if(this.label.length){
                Database.methods.removeItem('pontos', [this.value.label[0]])
            }
            let aux = {
                label: this.label.length ? this.label : this.value.label,
                nome: this.name ? this.name : this.value.nome,
                lat: this.local[0] ? this.local[0] : this.value.lat,
                selected: this.value.selected
            }
            if (this.value.selected) {
                localStorage.selected1 = JSON.stringify(aux);
            }
            if (!validation.checkEmpty(aux)) {
                Notification.methods.notificate('Preencha todos os campos');
            }
            else{
                Database.methods.updateItem('pontos', [aux]);
                Notification.methods.notificate('Ponto foi atualizado');                
                this.field = 'Atualize o ponto';
                this.name = '';
            }
            this.closingContent();
        },
        closingContent(){
            const close = document.getElementById('modal2');
            close.classList.add('fadeOut');
            setTimeout(()=>{
                close.classList.add('hidden');   
            },300);
        }
    }
}
</script>

<style scoped>
.index{
    z-index: 2;    
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
