<template>
<div class="box form1 is-paddingless nav" ref="newPointModal">
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
                    <autocomplete default-value="" :search="search" :get-result-value="getResultValue" id="autocomplete"></autocomplete>
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
import Autocomplete from '@trevoreyre/autocomplete-vue'

import Notification from '../commons/Notification'
import validation from '../../validation.js'
import '@trevoreyre/autocomplete-vue/dist/style.css'
import { dbConn } from '../../Database'

export default {
    name: 'NewPointModal',
    components:{
        Autocomplete,
    },
    data(){
        return {
            name: '',   
            field: 'Escolha o nome do ponto',
        }
    },
    methods:{
        async search(event){
            return new Promise(resolve => resolve(this.$data.mapProvider.search({ query: event ? event : ''})))//.then(result=> result)            
        },
        save(event){
            event.preventDefault()
            let aux = {
                label: this.$store.state.dataToEditPoint.label,
                nome: this.name,
                lat: this.$store.state.dataToEditPoint.bounds[1],
                selected: false
            }
            if (!validation.checkEmpty(aux)) {
                Notification.methods.notificate('Preencha todos os campos')
            }
            else{
                dbConn.addData(aux, 'pontos')
                Notification.methods.notificate('Ponto foi salvo')
                this.name = ''
                this.$emit('closeEvt')
                window.teste.$emit('updatePointList')
            }
        },
        goBackRight(){
            this.$store.commit('moveModalBackToOrigin', [this.returnById('modal-content1'), this.returnById('modal-content2')])
        },
        getResultValue(result) {
            this.$store.commit('getPointUpdateData', result)
            return result.label
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
