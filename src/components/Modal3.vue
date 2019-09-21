<template>
    <div class="modal index section animated has-text-centered" id="modal3">
        <div class="modal-background"></div>
        <div class="box form1 is-paddingless nav">
            <div class="column has-background-info nav has-text-right">
                <span class="icon">
                </span>
            </div>
            <div class="column">
                <form class="article animated" id="menu-atualizar">
                    <label class="label has-text-left is-size-6">{{field}}</label>
                    <div class="field space1">
                        <div class="control has-icons-left has-icons-right">
                            <input class="input" v-model="name" type="text" placeholder="Qual o nome da rota">
                        </div>
                    </div>
                    <br>
                    <div class="field">
                        <div class="control has-icons-left has-icons-right">
                            <autocomplete :search="search1" placeholder="Partida" ></autocomplete>
                        </div>
                    </div>
                    <div class="field">
                        <div class="control has-icons-left has-icons-right">
                            <autocomplete :search="search2" placeholder="Chegada" ></autocomplete>
                        </div>
                    </div>
                    <div class="field space2">
                        <div class="control has-text-centered">
                            <button type="submit" class="button form1button is-info" id="save-rota2" @click="update">Atualizar</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        <button class="modal-close is-large" @click="closeEditModal" id="modal3-close" aria-label="close"></button>
    </div>
</template>

<script>
import { setTimeout } from 'timers';
import Autocomplete from '@trevoreyre/autocomplete-vue';
import Notification from './Notification';
import validation from '../validation.js';
import Database from './Database';
import { BingProvider} from 'leaflet-geosearch';
import '@trevoreyre/autocomplete-vue/dist/style.css';

export default {
    name: 'Modal3',
    components:{
        Autocomplete,
    },
    data(){
        return{
            provider: new BingProvider({ params: { key: 'AghuzeeA1vtDHzQVX7hOoRWJ56ASwXHZ5yQi3AR_M3p1WED9B21cJ8RA5PuIm5Cy'}}),
            name: '',   
            local: [],
            partida: [],
            chegada: [],
            label: ['', ''],
            field: 'Atualize a rota',
            value: null
        }
    },
    methods:{
        openEditModal(){ 
            let aux = document.getElementById('modal3');
            aux.classList.remove('fadeOut');
            aux.classList.add('is-active', 'fadeIn');
        },
        closeEditModal(){
            let close_btn = document.getElementById('modal3');
            close_btn.classList.add('fadeOut');
            setTimeout(()=>{
                if (close_btn) {
                    close_btn.classList.remove('is-active', 'fadeIn');
                }
            },300);
        },
        async search1(event){
            let aux = await this.provider.search({ query: event ? event : 'campos'}); 
            this.local[0] = aux.map(value => value.bounds);
            this.label[0] = aux.map(value => value.label);
            return this.label[0];
        },
        async search2(event){
            let aux = await this.provider.search({ query: event ? event : 'campos'}); 
            this.local[1] = aux.map(value => value.bounds);
            this.label[1] = aux.map(value => value.label);
            return this.label[1];
        },
        update(e){
            e.preventDefault();
            this.value = JSON.parse(localStorage.routValue);
            localStorage.removeItem('routValue');
            if(this.label[0] != '' || this.label[1] != ''){
                Database.methods.removeItem('rotas', [this.value.label[0], this.value.label[1]])
                setTimeout(() => {
                    
                }, 100);
                this.value.label[0] = this.label[0] != '' ? this.label[0] : this.value.label[0]   
                this.value.label[1] = this.label[1] != '' ? this.label[1] : this.value.label[1]  
            }
            let aux = {
                label: this.label.length > 2 ? this.label : this.value.label,
                nome: this.name ? this.name : this.value.nome,
                partida: this.local[0] ? this.local[0] : this.value.partida,
                chegada: this.local[1] ? this.local[1] : this.value.chegada,
                selected: this.value.selected
            }
            if (this.value.selected) {
                localStorage.selected2 = JSON.stringify(aux);
            }
            if (!validation.checkEmpty2(aux)) {
                Notification.methods.notificate('Preencha todos os campos');
            }
            else{
                Database.methods.updateItem('rotas', [aux]);
                Notification.methods.notificate('Rota foi atualizada');                
                this.field = 'Atualize a rota';
                this.name = '';
            }
            this.closingContent();
        },
        closingContent(){
            const close = document.getElementById('modal3');
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
    height: auto;
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
