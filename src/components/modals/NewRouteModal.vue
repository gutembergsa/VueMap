<template>
<div class="box form1 is-paddingless nav">
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
import validation from '../../validation.js'
import Notification from '../commons/Notification'
import { dbConn } from '../../Database'


export default {
    name: 'NewRouteModal',
    components:{
        Autocomplete
    },
    data(){
        return{
            txt1: 'Adicione o ponto de partida',
            txt2: 'Criar rota',
            name: '',   
            flag: true, 
        }
    },

    methods:{
        async search(event){
            return new Promise(resolve => resolve(this.$data.mapProvider.search({ query: event ? event : ''})))//.then(result=> result)            
        },
        save(event){
            event.preventDefault()
            let aux = {
                nome: this.name,
                label: [this.$store.state.dataToEditRoute[0].label, this.$store.state.dataToEditRoute[1].label],
                partida: this.$store.state.dataToEditRoute[0].bounds,
                chegada: this.$store.state.dataToEditRoute[1].bounds,
                selected: false
            }
            
            if (!validation.checkEmpty2(aux)) {
                Notification.methods.notificate('Preencha todos os campos')
            }
            else{
                Notification.methods.notificate('Rota foi salva')   
                dbConn.addData(aux, 'rotas')
                this.name = ''
                this.$emit('closeEvt')
                window.teste.$emit('updateRouteList')
            }
        },
        resetMenu(){
            this.flag = true
            this.name = ''
            this.txt1 = "Adicione o ponto de partida"
        },
        goBackLeft(){
            this.$store.commit('moveModalBackToOrigin', [this.returnById('modal-content1'), this.returnById('modal-content3')])
        },
        getResultValue1(result) {
            this.$store.commit('getRouteUpdateData1', result)
            return result.label                
        },
        getResultValue2(result) {
            this.$store.commit('getRouteUpdateData2', result)
            return result.label                
        },        
    }
}
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
