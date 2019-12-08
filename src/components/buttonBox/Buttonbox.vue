<template>
    <div class="section has-background-light has-text-centered space">
        <addNewDataModal/>
        <addHome/>
        <div class="columns is-mobile">
            <addNewButton/>
            <pointSelectedButton v-bind:flag="this.flag1"/>
            <routeSelectedButton v-bind:flag="this.flag2"/>
        </div>
        <div class="section card animated is-hidden" id="instructions" ref="instructions">
            <label class="label is-size-4 animated">
                {{text}}
            </label>
        </div>

    </div>
</template>

<script>
import addHome from './Buttons/AddHome';
import addNewDataModal from '../modals/AddNewDataModal'
import addNewButton from './Buttons/AddNewButton'
import pointSelectedButton from './Buttons/PointSelectedButton';
import routeSelectedButton from './Buttons/RouteSelectedButton';
import { setTimeout } from 'timers';
import { dbConn } from '../../Database';

export default {
    name: 'Buttonbox',
    components:{
        addHome,
        addNewDataModal,
        addNewButton,
        pointSelectedButton,
        routeSelectedButton
    },
    data(){
        return{
            flag1: null,
            flag2: null,
            text: `Aguardando a geolocalização...`,
        }
    },
    mounted(){
        this.setFlag1()
        this.setFlag2()

    },
    methods:{
        setFlag1(){

            dbConn.getSelectedCard('pontos').then(result => {
                this.flag1 = result
            })
        },
        setFlag2(){
)

            dbConn.getSelectedCard('rotas').then(result => {
                this.flag2 = result
                window.teste.$on('updateInstructions', ()=> this.changeText())
            })
        },
        changeText(){
            if (this.$store.state.instructions !== null) this.text = this.$store.state.instructions
            else this.text = `Aguardando a geolocalização...`                                        
        }
    }
}
</script>

<style scoped>
.space{
    padding-top: 85px;
    padding-bottom: 20px;
}
</style>

<style>
.round{
    border-radius: 100%
}
.hide{
    opacity: 0;
    transition: opacity 2s;
}
.show{
    opacity: 1;
    transition: opacity, 2s;
}
.change1{
    background-color:hsl(171, 100%, 41%);
    transition-duration: 3s;
}
.change1:hover{
    border: solid .6px black;
}
.change2{
    background-color: white;
    transition-duration: 2s;
}
.change3{
    background-color:hsl(204, 86%, 53%);
    transition-duration: 2s;
}
</style>
