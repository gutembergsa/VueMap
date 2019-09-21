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
            <button class="button round" id="locate1">
                <span class="icon">
                    <i class="fas fa-crosshairs"></i>
                </span>
            </button>
        </div>     
    </div>
</template>

<script>
import L from 'leaflet';
import Database from './Database';
import Notification from './Notification';
import Routing from 'leaflet-routing-machine';
import Geo from 'leaflet-geometryutil';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import { clearInterval, setTimeout, clearTimeout } from 'timers';
import { reject } from 'q';

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
            routeFound: null,
            routeInstructions: [],
            locationPos: [],
            marker: null,
            locate: null,
            selectedPoint: localStorage.selected1 ? JSON.parse(localStorage.selected1) : null,
            selectedRout: localStorage.selected2 ? JSON.parse(localStorage.selected2) : null,
            isLoading: true,
            fullPage: true
        }
    },
    mounted() {
        this.map = L.map('mapid').setView(([-23.2194511,-45.7856752]), 6);
        navigator.geolocation.watchPosition(position => {
            alert(position.coords.latitude + ' ' + position.coords.longitude);
            this.locateMaker(position)
            this.locationPos = [position.coords.latitude, position.coords.longitude]
            document.getElementById('locate1').addEventListener('click', ()=> this.map.setView(L.latLng(position.coords.latitude, position.coords.longitude), 14));                                
            if (this.routeFound.length) {
                this.isPointOnLine(this.locationPos, this.routeFound[0])
                    .then(result => localStorage.instructions = result)
                    .catch(result => console.log('erro',result))                
            }
        });
        this.initInstructions();

        this.tileLayer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox.streets',
            accessToken: 'pk.eyJ1IjoiZ3V0ZW1iZXJnc2EiLCJhIjoiY2p3ODlkb296MGtpczQzbG10cXI4dndzeiJ9.o8N3X4TgGza8XchnJ4RsKw'
        }).addTo(this.map);
        if (this.selectedPoint) this.createMarker(this.selectedPoint);          
        
        if (this.selectedRout) this.createRoute(this.selectedRout);          
        else this.isLoading = false;            
    },    
    methods:{
        initInstructions(){
            let instructions = document.getElementById('instructions');
            if (!localStorage.selected2) {
                instructions.classList.remove('show');
                instructions.classList.add('hide');
                setTimeout(() => {
                    instructions.classList.add('is-hidden');
                }, 100);
            } else {                
                instructions.classList.remove('hide');
                setTimeout(() => {
                    instructions.classList.remove('is-hidden');
                    instructions.classList.add('show');
                }, 100);
            }
        },
        createRoute(pos){
            let i = 0;
            let aux1 = document.getElementById('locate3');
            aux1.addEventListener('click', ()=> this.map.setView(L.latLng(pos.partida[0][0], pos.chegada[0][1]), 13));                                
            if(pos){
                this.route = L.Routing.control({
                    waypoints: [
                        L.latLng(pos.partida[0][0], pos.partida[0][1]),
                        L.latLng(pos.chegada[0][0], pos.chegada[0][1])
                    ],
                    addWaypoints: false,
                    draggableWaypoints:false,
                    routeWhileDragging: false,
                    show: false,
                    language: 'pt-BR'
                });
                this.route.addTo(this.map);
                

                this.route.on('routesfound', event =>{
                    let aux = 0
                    this.map.locate()                
                    this.routeFound = event.routes;
                    event.routes[0].instructions.map(v =>{
                        this.routeInstructions.push({
                            index: v.index
                        })
                    })
                    this.isLoading = false;
                    this.isPointOnLine(this.locationPos, this.routeFound[0])
                        .then(result => localStorage.instructions = result)
                        .catch(result => console.log('erro',result))
                });

                this.route.on('routingerror', ev =>{
                    let aux2 = setTimeout(() => {
                        if(i === 5){
                            let aux3 = JSON.parse(localStorage.selected2)
                            aux3.selected = false;
                            localStorage.removeItem('selected2');
                            Notification.methods.notificate(`Ops parece que não é possivel
                                                             processar a rota que você deseja :C 
                                                             estarei desmarcando a rota  para que
                                                             não se repita o inconvênio,
                                                             recomendo atualizar o app e tentar
                                                             novamente se o problema persistir
                                                             recomendo deletar o ponto`, 10000)
                            this.initInstructions();
                            this.isLoading = false;
                            this.selectedRout = null
                            aux1.classList.remove('change3', 'has-text-light');
                            aux1.classList.add('change2');
                            Database.methods.updateItem('rotas', [aux3])
                            clearTimeout(aux2);
                        }
                        else{
                            i++;
                            this.route.addTo(this.map);                    
                        }
                    }, 1000);
                }, {passive: true});
                
            }
            else{
                this.flag = true
                this.map.removeLayer(this.route);           
            }
        },
        locateMaker(pos){
            this.map.locate()                
            if (pos) {
                if (this.locate) {
                    this.map.removeLayer(this.locate)                
                }
                this.locate = L.marker(L.latLng(pos.coords.latitude, pos.coords.longitude), {title: 'Localização'})
                .bindPopup(`<b>Sua localização</b>`)
                .addTo(this.map);
            }
        },
        createMarker(pos){
            if (pos) {
                document.getElementById('locate2').addEventListener('click', ()=> this.map.setView(L.latLng(pos.lat[0][0], pos.lat[0][1]), 14));                                
                this.marker = L.marker([pos.lat[0][0], pos.lat[0][1]], {title: 'Ponto'})
                .bindPopup(`<b>${pos.nome}</b>`)
                .addTo(this.map);
            }
            else{
                if (this.marker) {
                    this.map.removeLayer(this.marker)                
                }
            }
        },
        isPointOnLine(position, rota) {
            if (this.routeFound) {
                return new Promise((resolve, reject) => {
                    let flag = false;
                    let stop = false;
                    for (var i = 0; i < rota.coordinates.length; i++) {
                        if (!flag) {
                            if((rota.coordinates.length - i) === 1) {
                                let aux = Geo.belongsSegment(
                                    L.latLng(position[0], position[1]),
                                    L.latLng(rota.coordinates[i - 1].lat, rota.coordinates[i - 1].lng),
                                    L.latLng(rota.coordinates[i].lat, rota.coordinates[i].lng), 7);                                
                                if (aux === true){
                                    rota.instructions.forEach((v, j, a) =>{
                                        if (i === v.index) {
                                            flag = true;
                                            resolve(v.text);
                                            return;
                                        }
                                    });
                                    for (let index = i; index < rota.coordinates.length; index++) {
                                        if(stop) break
                                        rota.instructions.forEach((v, j, a)=>{
                                            if (v.index === index) {
                                                stop = true;
                                                resolve(v.text);
                                                return;
                                            }
                                        });                                        
                                    }
                                }
                            }
                            else{
                                let aux = Geo.belongsSegment(
                                    L.latLng(position[0], position[1]),
                                    L.latLng(rota.coordinates[i].lat, rota.coordinates[i].lng),
                                    L.latLng(rota.coordinates[i + 1].lat, rota.coordinates[i + 1].lng), 14);    
                                if (aux === true){
                                    rota.instructions.forEach((v, j, a) =>{
                                        if (i === v.index) {
                                            flag = true;
                                            resolve(v.text);
                                            return;
                                        }
                                    });
                                    for (let index = i; index < rota.coordinates.length; index++) {
                                        if(stop) break
                                        rota.instructions.forEach((v, j, a)=>{
                                            if (v.index === index) {
                                                stop = true;
                                                resolve(v.text);
                                                return;
                                            }
                                        });                                        
                                    }
                                }
                            }   
                        }
                    }
                    resolve(rota.instructions[0].text);
                });                
            }
        }              
    }
}
</script>

<style scoped>
.mapid {
    height: 300px;
    margin-top: .2%;
    z-index: 1;
    display: flex;
}

.map-wrapper {
    width: 100%;
    height: 300px;
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
