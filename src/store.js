import Vue from 'vue'
import Vuex from 'vuex'
import { race } from 'q'
import {dbConn} from './Database'


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    tabletSize: false,
    mobileSize: false,
    selectedPoint: null,
    valuePointToEdit: null,
    dataToEditPoint: null,
    selectedRoute: null,
    valueRouteToEdit: null,
    dataToEditRoute: [],
    instructions: null,
    routelist:[],
    showRouteList: false,
    pointlist:[],
    showPointList: false,
  },
  mutations:{
    setInstructions: (state, instructions)=> {
      state.instructions = instructions
      window.teste.$emit('updateInstructions')
    },
    initInstructions: (state, instructions)=> {
      //AJUSTAR INSTRUÇÕES AO RECARREGADR A PAGINA E REVISAR ESTE ELEMENTO EM RUNTIME 04/12/2019
      if (state.instructions !== null) {
        Promise.resolve(instructions.classList.remove('hide')).then(()=>{
          instructions.classList.remove('is-hidden')
          instructions.classList.add('show')
        })                  
      }
      // if (state.instructions !== null) {
      //   instructions.classList.remove('show')
      //   Promise.resolve(instructions.classList.add('hide')).then(()=>instructions.classList.add('is-hidden'))        
      // } else {                
      //   Promise.resolve(instructions.classList.remove('hide')).then(()=>{
      //     instructions.classList.remove('is-hidden')
      //     instructions.classList.add('show')
      //   })        
      // }
    },
    //open/close modal principal
    openAddNewModal: (state, el) => {
      el.classList.remove('fadeOut', 'hidden')
      el.classList.add('is-active', 'fadeIn')        
    }, 
    closeAddNewModal: (state, el) => {
      el.classList.add('fadeOut')
      setTimeout(()=> el.classList.remove('is-active', 'fadeIn'), 300)        
    },
    moveModal: (state , [el1, el2]) => {
      el1.classList.add( el2.id === 'modal-content2' ? 'zoomOutRight' : 'zoomOutLeft')
      el1.classList.remove('slideInRight', 'slideInLeft')
      setTimeout(()=>{
        el1.classList.add('hidden')
        el2.classList.remove('hidden', el2.id === 'modal-content2' ? 'slideOutLeft' : 'slideOutRight' )
        el2.classList.add( el2.id === 'modal-content2' ? 'slideInLeft' : 'slideInRight')
      }, 500)      
    },
    moveModalBackToOrigin: (state, [el1, el2])=>{
      el2.classList.add(el2.id === 'modal-content2' ? 'slideOutLeft' : 'slideOutRight')
      setTimeout(()=>{
        el2.classList.add('hidden')
        el1.classList.add(el2.id === 'modal-content2' ? 'slideInRight' : 'slideInLeft' )
        el1.classList.remove(el2.id === 'modal-content2' ? 'zoomOutRight' : 'zoomOutLeft','hidden')
      }, 500)
    },
    //funçoes para selecionar/remover cartoes     
    selectPointCard: (state, [el, value]) => {
      //desmarca o ponto ja selecionado             
      if (state.selectedPoint){
        state.selectedPoint.selected = false
        dbConn.updateData(state.selectedPoint, 'pontos')
      }
      
      if (value.selected) {
          el.classList.add('change2')
          el.classList.remove('change1', 'has-text-light')
          value.selected = false
          state.valuePointToEdit = state.selectedPoint = null
        }
      else {
          el.classList.add('change1', 'has-text-light')
          el.classList.remove('change2')
          value.selected = true   
          state.selectedPoint = value
      }
      dbConn.updateData(value, 'pontos')
    },
    selectRouteCard: (state, [el, instructions, value]) => {
      //desmarca o ponto ja selecionado             
      state.instructions = 'Aguardando a geolocalização...'
      window.teste.$emit('updateInstructions')
      if (state.selectedRoute){
        state.selectedRoute.selected = false
        dbConn.updateData(state.selectedRoute, 'rotas')
      }
      
      if (value.selected) {
        el.classList.add('change2')
        el.classList.remove('change3', 'has-text-light')
        value.selected = false
        state.valueRouteToEdit = state.selectedRoute = state.instructions = null          
        Promise.resolve(instructions.classList.add('hide')).then(()=> {
          instructions.classList.remove('show');
          instructions.classList.add('is-hidden');
        })
      }
      else {
        el.classList.add('change3', 'has-text-light')
        el.classList.remove('change2')
        value.selected = true   
        state.selectedRoute = value
        //state.instructions = null
      }
      dbConn.updateData(value, 'rotas')
    },
    detachSelectedRoute: (state, el)=>{
      if(state.selectedRoute !== null) state.selectedRoute.selected = false
      el.classList.remove('change3', 'has-text-light')
      el.classList.add('change2')
      dbConn.updateData('rotas', state.selectedRoute)      
    },     
    removeCard: (state, [el, value]) => {
      if (value.selected === true) {
        el.classList.remove('change3', 'has-text-light')
        el.classList.add(typeof value.label === 'string' ? 'change2' : 'change3')
        if (typeof value.label === 'string') state.selectedPoint = null
        else state.selectedRoute = null
      }
      dbConn.deleteData(value.label, typeof value.label === 'string' ? 'pontos': 'rotas')
    },
    clearList:(state , [el ,value]) => {
      if (value.selected === true) {
        el.classList.add(value === true ? 'change2' : 'change3')
        el.classList.remove(value === true ? 'change2' : 'change1', 'has-text-light')
        if (value === true) state.selectedPoint = null
        else state.selectedRoute = null
      }
      dbConn.deleteAllData(value === true ? 'pontos': 'rotas')
    },
    //funçoes para editar cartoes     
    openEditModal: (state, [el, data]) => {
      el.classList.remove('fadeOut')
      el.classList.add('is-active', 'fadeIn')
      if (typeof data.label === 'string') state.valuePointToEdit = data    
      else state.valueRouteToEdit = data
    }, 
    closeEditModal: (state, el) => {
      Promise.resolve(el.classList.add('fadeOut')).then(()=>el.classList.remove('is-active', 'fadeIn'))
    },
    updateSelectedPointCard: (state, name) => {
      if(state.dataToEditPoint && state.dataToEditPoint.label.length){
        if (state.valuePointToEdit) {
          dbConn.deleteData(state.valuePointToEdit.label, 'pontos')          
        }
      }
      let aux = {
          label: state.dataToEditPoint ? state.dataToEditPoint.label : state.valuePointToEdit.label,
          nome: name ? name : state.valuePointToEdit.nome,
          lat: state.dataToEditPoint ? state.dataToEditPoint.bounds[0] : state.valuePointToEdit.lat,
          selected:  state.valuePointToEdit.selected
      }
      if (state.valuePointToEdit.selected) {
        state.valuePointToEdit = state.selectedPoint = aux
      }
      dbConn.updateData(aux, 'pontos')
      window.teste.$emit('updatePointList')
    },
    updateSelectedRouteCard: (state, name) => {
      dbConn.deleteData(state.valueRouteToEdit.label, 'rotas')          
      dbConn.getAllData('rotas').then(() => {
        if(state.dataToEditRoute[0] !== null || state.dataToEditRoute[1] !== null){
          state.valueRouteToEdit.label[0] = (state.dataToEditRoute[0] !== undefined ? state.dataToEditRoute[0].label : state.valueRouteToEdit.label[0])  
          state.valueRouteToEdit.label[1] = (state.dataToEditRoute[1] !== undefined ? state.dataToEditRoute[1].label : state.valueRouteToEdit.label[1])        
        }
        let aux = {
            label: state.valueRouteToEdit.label,
            nome: name ? name : state.valueRouteToEdit.nome,
            partida: state.dataToEditRoute[0] ? state.dataToEditRoute[0].bounds : state.valueRouteToEdit.partida,
            chegada: state.dataToEditRoute[1] ? state.dataToEditRoute[1].bounds : state.valueRouteToEdit.chegada,
            selected: state.valueRouteToEdit.selected
        }
        if (state.valueRouteToEdit.selected) {
         state.selectedRoute = aux
        }
        state.valueRouteToEdit = null
        dbConn.addData(aux, 'rotas')
        window.teste.$emit('updateRouteList')
      })
    },
    getPointUpdateData: (state, data)=> state.dataToEditPoint = data,
    getRouteUpdateData1: (state, data)=> state.dataToEditRoute[0] = data,
    getRouteUpdateData2: (state, data)=> state.dataToEditRoute[1] = data,

    fadeFooter: (state, [aux, el, op1, op2])=> {
      if (aux[op1].classList.contains('fadeIn')) {
        aux[op1].classList.remove('fadeIn')
        Promise.resolve(aux[op1].classList.add('fadeOut')).then(()=>{
          aux[op1].classList.add('is-hidden')
          aux[el].classList.remove('is-hidden', 'fadeOut')
          aux[el].classList.add('fadeIn')
        })
      }
      if (aux[op2].classList.contains('fadeIn')) {
        Promise.resolve(aux[op2].classList.add('fadeOut')).then(()=>{
          aux[op2].classList.add('is-hidden')
          aux[el].classList.remove('is-hidden', 'fadeOut')
          aux[el].classList.add('fadeIn')
        })
      }
    },
    triggerResponsividade: (state, width) =>{
      //tablet
      if (width <= 768) state.tabletSize = true
      else state.tabletSize = false 
      //mobile      
      if (width <= 425) state.mobileSize = true
      else state.mobileSize = false
    },
    changeSideMenuState: (state, menuState) => state.sideMenuState = menuState,
  },
  actions:{
    
    openAddNewModal: ({commit}, el) => commit('openAddNewModal', el),
    closeAddNewModal: ({commit}, el) => commit('closeAddNewModal', el),

    openEditModal: ({commit}, [el, value]) => commit('openEditModal', [el, value]),
    updateSelectedPointCard: ({commit}, name)=> commit('updateSelectedPointCard', name),
    updateSelectedRouteCard: ({commit}, name)=> commit('updateSelectedRouteCard', name),
    closeEditModal: ({commit}, el) => commit('closeEditModal', el),    

    selectPointCard: ({commit}, [el, instructions, value]) => commit('selectPointCard', [el, instructions, value]),
    selectRouteCard: ({commit}, [el, value]) => commit('selectPointCard', [el, value]),
    detachSelectedRoute: ({commit}, el) => commit('detachSelectedRoute', el),
    removeCard: ({commit}, [el, value]) => commit('removeCard', [el, value]),
    clearList: ({commit}, [el, value]) => commit('clearList', [el, value]),

    triggerResponsividade: ({commit}) => commit('triggerResponsividade', window.screen.width),
    changeSideMenuState: ({commit}, menuState) => commit('changeSideMenuState', menuState),

  },
  getters:{
    returnTabletSize: state => state.tabletSize,
    returnMobileSize: state => state.mobileSize,
  }
})

