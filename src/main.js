import Vue from 'vue'
import App from './App.vue'
import store from './store'
import './registerServiceWorker'
import { BingProvider} from 'leaflet-geosearch';


Vue.mixin({
  data(){
    return{
      mapProvider: new BingProvider({ params: { key: 'AghuzeeA1vtDHzQVX7hOoRWJ56ASwXHZ5yQi3AR_M3p1WED9B21cJ8RA5PuIm5Cy'}})
    }
  },  
  methods:{
    returnById(id){
      return document.getElementById(id)
    }
  }
})

window.teste = new Vue({
  store,
  render: function(h) { return h(App) },
}).$mount('#app')
