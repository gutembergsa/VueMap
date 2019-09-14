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
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import { clearInterval, setTimeout, clearTimeout } from 'timers';

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
            route: null,
            marker: null,
            selectedPoint: localStorage.selected1 ? JSON.parse(localStorage.selected1) : null,
            selectedRout: localStorage.selected2 ? JSON.parse(localStorage.selected2) : null,
            isLoading: true,
            fullPage: true
        }
    },
    mounted() {
        this.map = L.map('mapid').locate({setView: true, maxZoom: 20});
        this.tileLayer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox.streets',
            accessToken: 'pk.eyJ1IjoiZ3V0ZW1iZXJnc2EiLCJhIjoiY2p3ODlkb296MGtpczQzbG10cXI4dndzeiJ9.o8N3X4TgGza8XchnJ4RsKw'
        }).addTo(this.map);
        document.getElementById('locate1').addEventListener('click', ()=> this.map.locate({setView: true, maxZoom: 15}));
        if (this.selectedPoint) {
            this.createMarker(this.selectedPoint.lat[1]);          
        }
        if (this.selectedRout) {
            this.createRoute(this.selectedRout);          
        }
        else{
            this.isLoading = false;            
        }
    },    
    methods:{
        createRoute(pos){
            let i = 0;
            let aux1 = document.getElementById('locate3');
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
                

                this.route.on('routesfound', event=>{
                    console.log(event);
                    this.isLoading = false;
                })
                this.route.on('routingerror', ev =>{
                    let aux2 = setTimeout(() => {
                        if(i === 15){
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
                
                this.route.on('waypointgeocoded' ,event => {
                    console.log(event)
                }) 
                aux1.addEventListener('click', ()=> this.map.setView(L.latLng(pos.partida[0][0], pos.partida[0][1]), 14));                                    
            }
            else{
                this.flag = true
                this.map.removeLayer(this.route);           
            }
        },
        createMarker(pos){
            if (pos) {
                this.marker = L.marker([pos[0], pos[1]], {title: this.selectedPoint.label})
                                .bindPopup(`<b>${this.selectedPoint.nome}</b>`)
                                .addTo(this.map);
                document.getElementById('locate2').addEventListener('click', ()=> this.map.setView(L.latLng(pos[0], pos[1]), 14));                
            }
            else{
                this.map.removeLayer(this.marker)
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
