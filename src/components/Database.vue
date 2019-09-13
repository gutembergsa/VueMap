<template>
    
</template>
<script>
import { debuglog } from 'util';
import { async } from 'q';
import { setTimeout } from 'timers';
export default {
    name:'Database',

    data(){
        return{
            dbRequest: null,
            db: null,
            dbName: 'vuemap'
        }
    },
    methods:{
        addItem(objectStoreName, data = [], value = null){
            this.dbRequest = window.indexedDB.open('vuemap', 2)
            this.dbRequest.onsuccess = async function(event) {
                value = this.result.transaction(objectStoreName, "readwrite").objectStore(objectStoreName);
                value.onsuccess = function(){
                }
                for (let i in data) {
                    value.add(data[i]);                                              
                }
            };
        },
        getAllItens(objectStoreName, value = null, aux = []){
            this.dbRequest = window.indexedDB.open('vuemap', 2)
            this.dbRequest.onsuccess = function(event) {
                let getTransaction = this.result
                                        .transaction(objectStoreName, "readwrite")
                                        .objectStore(objectStoreName)
                                        .getAll();
                getTransaction.onsuccess = async function(event){
                    value = await JSON.stringify(this.result)                    
                };
            };
            setTimeout(()=>{
                return JSON.parse(value);
            }, 1000);
        },
        removeItem(objectStoreName, label, value = null){
            this.dbRequest = window.indexedDB.open('vuemap', 2)
            this.dbRequest.onsuccess = function(event) {
                let getTransaction = this.result
                                        .transaction(objectStoreName, "readwrite")
                                        .objectStore(objectStoreName)
                                        .delete(label);
                getTransaction.onsuccess = function(event){
                };
            };
        },
        clearList(objectStoreName, value = null){
            this.dbRequest = window.indexedDB.open('vuemap', 2)
            this.dbRequest.onsuccess = function(event) {
                let getTransaction = this.result
                                        .transaction(objectStoreName, "readwrite")
                                        .objectStore(objectStoreName)
                                        .clear();
                getTransaction.onsuccess = function(event){
                };
            };
        },
        updateItem(objectStoreName, value){
            this.dbRequest = window.indexedDB.open('vuemap', 2)
            this.dbRequest.onsuccess = function(event) {
                let getTransaction = this.result
                                        .transaction(objectStoreName, "readwrite")
                                        .objectStore(objectStoreName)
                                        .put(value[0]);
                getTransaction.onsuccess = function(event){
                };
            };
        },
        readData(objectStoreName, flag, value = null){
            this.dbRequest = window.indexedDB.open('vuemap', 2)
            this.dbRequest.onsuccess = () => {
                const cursorRequest = this.dbRequest.result
                                                    .transaction(objectStoreName, 'readwrite')
                                                    .objectStore(objectStoreName)
                                                    .openCursor()
                cursorRequest.onsuccess = async e => {
                    const cursor = e.target.result;
                    if (cursor) {
                        if (cursor.value.selected === true) {
                            localStorage.values = JSON.stringify(cursor.value)
                        }
                        cursor.continue();
                    }
                }
            };
        },
        startDb(){
            let request = indexedDB.open(this.dbName, 2);

            request.onerror = function(event) {
                console.log('erro', event)
            };
            request.onupgradeneeded = function(event) {
                let db = event.target.result;
                db.createObjectStore("pontos", { keyPath: "label" });
                db.createObjectStore("rotas", { keyPath: "label" });
            };            
        }
    },
    mounted(){
        this.startDb();
    }
}
</script>