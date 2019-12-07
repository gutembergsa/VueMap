<template>
    <div class="map-wrapper">
        <div id="mapid"  class="mapid content"></div>   
        <div class="vld-parent load-wrapper">
            <loading :active.sync="isLoading" 
            :can-cancel="true" 
            :is-full-page="true"
            :color="'#FFDD57'"></loading>
        </div>
        <div class="button-wrapper">
            <button class="button round" id="locate1" @click="locateButton">
                <span class="icon">
                    <i class="fas fa-crosshairs"></i>
                </span>
            </button>
        </div>     
    </div>
</template>

<script>
import L from 'leaflet';
import Notification from '../commons/Notification';
import Routing from 'leaflet-routing-machine';
import Geo from 'leaflet-geometryutil';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import { clearInterval, setTimeout, clearTimeout } from 'timers';
import { reject } from 'q';
import {dbConn} from '../../Database';


export default {
    name:'maps',
    components:{
        Loading
    },
    data(){
        return {
            map: null,
            tileLayer: null,
            flag: true,
            flag2: false,
            route: null,
            routeFound: [],
            routeInstructionsIsSet: true,
            locationPos: null,
            marker: null,
            locate: null,
            isLoading: true,
            counter: 0
        }
    },
    mounted() {
        this.map = L.map('mapid').setView(([-23.2194511,-45.7856752]), 6);
        
        this.map.locate({watch: true});
        
        this.map.on('locationfound', position => {
            this.locationPos = [position.latitude, position.longitude]
            if (this.routeInstructionsIsSet) {
                this.locateMaker(position)
                this.isPointOnLine([position.latitude, position.longitude], this.routeFound)
                .then(instructions => this.initInstructions(instructions))
                .then(()=>{
                    this.routeInstructionsIsSet = false
                    setTimeout(() => this.routeInstructionsIsSet = true, 10000);
                })
                .catch(result => console.log('erro',result));                                             
            }
        })            
        
        dbConn.getSelectedCard('pontos').then(result => {
            if (result !== null || result.selected) this.createMarker(result);              
            dbConn.getSelectedCard('rotas').then(result => {
                if (result || result.selected) this.createRoute(result);          
                else this.isLoading = false;                               
            })
        })

        this.tileLayer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox.streets',
            accessToken: 'pk.eyJ1IjoiZ3V0ZW1iZXJnc2EiLCJhIjoiY2p3ODlkb296MGtpczQzbG10cXI4dndzeiJ9.o8N3X4TgGza8XchnJ4RsKw'
        }).addTo(this.map);        
    },    
    methods:{
        locateButton(){
            if (this.locationPos !== null) this.map.setView(L.latLng(this.locationPos[0], this.locationPos[1]), 14)
        },
        initInstructions(result){
            this.map.removeLayer(this.route)
            this.$store.commit('setInstructions', result)
            this.$store.commit('initInstructions', this.returnById('instructions'))
            this.isLoading = false
        },
        locateMaker(pos){
            this.map.locate()                
            if (!pos || pos === null) return
            else if (this.locate) this.map.removeLayer(this.locate)                
            this.locate = L.marker(L.latLng(pos.latitude, pos.longitude), {title: 'Localização'})
            .bindPopup(`<b>Sua localização</b>`)
            .addTo(this.map)
        },
        createMarker(pos){
            if (!pos || pos === null) return
            else if (this.marker) return this.map.removeLayer(this.marker)                
            window.teste.$on('showSelectedPoint', ()=>this.map.setView(L.latLng(pos.lat), 14))
            this.marker = L.marker(L.latLng(pos.lat), {title: 'Ponto'})
            .bindPopup(`<b>${pos.nome}</b>`)
            .addTo(this.map)

        },
        createRoute(pos){
            if (!pos){
                this.flag = true
                this.map.removeLayer(this.route)
                return           
            }
            this.route = L.Routing.control({
                waypoints: [L.latLng(pos.partida[0], pos.partida[1]), L.latLng(pos.chegada[0], pos.chegada[1])],
                addWaypoints: false,
                pointMarkerStyle:{radius: 5,color: '#444',fillColor: 'white',opacity: 1,fillOpacity: 0.7},
                draggableWaypoints:false,
                routeWhileDragging: false,
                show: false,
                language: 'pt-BR',
                totalDistanceRoundingSensitivity: 2,
                showAlternatives: false,
                waypointMode: 'snap'
            });
            this.map.removeLayer(this.route)
            this.route.addTo(this.map)

            this.route.on('routingerror', () =>{
                Notification.methods.notificate(`Erro ao criar rota, atualize`, 10000)
                this.isLoading = false              
                this.$store.dispatch('detachSelectedRoute', this.returnById('locate3'))
            }, {passive: true})
            
            this.route.on('routesfound', event =>{            
                console.log('routesfound')
                this.routeFound = event.routes
                this.$store.commit('setInstructions', event.routes[0].instructions[0].text)
                this.initInstructions(event.routes[0].instructions[0].text)
                this.isLoading = false              
            }, {passive: true});                
        },
        isPointOnLine(position, rota) {
            this.keepSearching = true
            return new Promise((resolve, reject) => {
                Promise.resolve(this.checkProximityV2(rota, resolve, position, 4))
                .then(()=> {
                    if (this.keepSearching === true) this.checkProximityV2(rota, resolve, position, 9)
                })
                .then(()=> {
                    if (this.keepSearching === true) this.checkProximityV2(rota, resolve, position, 11)
                })
                .then(()=>{
                    if (this.keepSearching === true && rota[0] !== undefined)resolve(rota[0].instructions[0].text)
                })
            })                
        },
        belongsSegment(position, rota, proximity){
            this.counter++
            if (this.counter > rota.coordinates.length) this.counter = 0
            const latA = L.latLng((rota.coordinates.length - this.counter <= 1) ?
            (rota.coordinates[this.counter - 1], rota.coordinates[this.counter - 1]) :
            (rota.coordinates[this.counter], rota.coordinates[this.counter]))
            const latB = L.latLng((rota.coordinates.length - this.counter <= 1) ?
            (rota.coordinates[this.counter], rota.coordinates[this.counter]) :
            (rota.coordinates[this.counter + 1], rota.coordinates[this.counter + 1]))
            //console.log('L.latLngA', latA, 'L.latLngB', latB, this.counter)
            if (latA && latB) return Geo.belongsSegment(L.latLng(position[0], position[1]), latA, latB, proximity) 
        },
        async checkProximityV2(rota, resolve, position, proximity){
            const smallInstructions = rota.sort((a,b) => a.instructions.length-b.instructions.length)[0]
            if(!smallInstructions) return
            for (let coordinates of smallInstructions.coordinates){
                if (!this.belongsSegment(position, smallInstructions, proximity)) continue 
                await Promise.resolve(()=>{
                    smallInstructions.instructions.forEach((v, i, a) => {
                        if (v.index === this.counter) {
                            this.keepSearching = false
                            return resolve(smallInstructions.instructions[i].text)
                        }
                    })
                })
                .then(()=>{
                    if (this.keepSearching === false) return 
                    let aux = []
                    smallInstructions.coordinates.forEach((n, i, f) => {
                        if (this.keepSearching === false) return 
                        Promise.resolve(()=> {
                            smallInstructions.instructions.forEach((v, j, a)=>{
                                if (v.index === i && i !== 0 && smallInstructions.instructions[i] !== undefined) {
                                    aux.push(smallInstructions.instructions[i].text)
                                }
                            })                                        
                        })
                        .then(()=>{
                            if (aux.length > 0) {
                                this.keepSearching = false
                                return resolve(aux[aux.length])                                                                              
                            }
                        })
                    })
                })                
            }
        }            
    }
}
</script>

<style scoped>
.mapid {
    height: 350px;
    margin-top: .2%;
    z-index: 1;
    display: flex;
}

.map-wrapper {
    width: 100%;
    height: 350px;
    position: relative;
}
.leaflet-control-container .leaflet-routing-container-hide {
    display: none;
}
.load-wrapper{
    width: 100%;
    position: absolute;
    z-index: 2;
}
.button-wrapper {
    margin-left: 85%;
    position: absolute;
    bottom: 50px;
    border-radius: 100%;
    width: 100%;
    z-index: 1;
}
.round{
    border-radius: 100%
}
</style>
