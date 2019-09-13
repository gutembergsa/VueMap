import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'

new Vue({
  render: function(h) { return h(App) },
}).$mount('#app')
