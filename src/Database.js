"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Operations;
(function (Operations) {
    Operations[Operations["get"] = 0] = "get";
    Operations[Operations["getAll"] = 1] = "getAll";
    Operations[Operations["getSelected"] = 2] = "getSelected";
    Operations[Operations["add"] = 3] = "add";
    Operations[Operations["update"] = 4] = "update";
    Operations[Operations["delete"] = 5] = "delete";
    Operations[Operations["deleteAll"] = 6] = "deleteAll";
})(Operations || (Operations = {}));
function makeTransaction(operation, db, objectStoreName, data) {
    switch (operation) {
        case Operations.get:
            return new Promise(resolve => {
                db.transaction([objectStoreName])
                    .objectStore(objectStoreName)
                    .get(data)
                    .onsuccess = result => {
                    console.log(result);
                    resolve(result.target.result);
                };
            });
        case Operations.getAll:
            return new Promise(resolve => {
                db.transaction([objectStoreName])
                    .objectStore(objectStoreName)
                    .getAll()
                    .onsuccess = result => {
                    resolve(result.target.result);
                };
            });
        case Operations.getSelected:
            return new Promise(resolve => {
                db.transaction([objectStoreName])
                    .objectStore(objectStoreName)
                    .openCursor()
                    .onsuccess = (event) => {
                    //debugger;
                    const cursor = event.target.result;
                    if (cursor) {
                        if (cursor.value.selected)
                            resolve(cursor.value);
                        cursor.continue();
                    }
                    else
                        resolve(false);
                };
            });
        case Operations.add:
            db.transaction([objectStoreName], "readwrite")
                .objectStore(objectStoreName)
                .add(data)
                .onsuccess = result => console.log('success added', result);
            break;
        case Operations.update:
            db.transaction([objectStoreName], "readwrite")
                .objectStore(objectStoreName)
                .put(data)
                .onsuccess = result => console.log('success updated', result);
            break;
        case Operations.delete:
            db.transaction([objectStoreName], "readwrite")
                .objectStore(objectStoreName)
                .delete(data)
                .onsuccess = result => console.log('success delete', result);
            break;
        case Operations.deleteAll:
            db.transaction([objectStoreName], "readwrite")
                .objectStore(objectStoreName)
                .clear()
                .onsuccess = result => console.log('success clear', result.target.readyState);
            break;
        default:
            break;
    }
}
class Database {
    constructor() {
        this.dbRequest = window.indexedDB;
    }
    requestConnection() {
        return new Promise((resolve, reject) => {
            const request = this.dbRequest.open('vuemap', 2);
            request.onerror = (err) => reject(`error on connection: ${err.target.error.message}`);
            request.onsuccess = (ev) => resolve(ev.target.result);
            request.onupgradeneeded = (ev) => {
                ev.target.result.createObjectStore('pontos', { keyPath: "label" });
                ev.target.result.createObjectStore('rotas', { keyPath: "label" });
                ev.target.result.onerror = (err) => reject(`error on upgrade: ${err.target.error.message}`);
                resolve(ev.target.result);
            };
        });
    }
    async addData(data, objectStoreName) {
        return this.requestConnection().then(db => makeTransaction(Operations.add, db, objectStoreName, data));
    }
    async deleteData(data, objectStoreName) {
        return this.requestConnection().then(db => makeTransaction(Operations.delete, db, objectStoreName, data));
    }
    async deleteAllData(objectStoreName) {
        return this.requestConnection().then(db => makeTransaction(Operations.deleteAll, db, objectStoreName));
    }
    async updateData(data, objectStoreName) {
        return this.requestConnection().then(db => makeTransaction(Operations.update, db, objectStoreName, data));
    }
    async getData(data, objectStoreName) {
        return new Promise(resolve => {
            this.requestConnection().then(db => {
                makeTransaction(Operations.get, db, objectStoreName, data).then(result => resolve(result));
            });
        });
    }
    async getSelectedCard(objectStoreName) {
        return new Promise(resolve => {
            this.requestConnection().then(db => {
                makeTransaction(Operations.getSelected, db, objectStoreName).then(result => resolve(result));
            });
        });
    }
    async getAllData(objectStoreName) {
        return new Promise(resolve => {
            this.requestConnection().then(db => {
                makeTransaction(Operations.getAll, db, objectStoreName).then(result => resolve(result));
            });
        });
    }
}
exports.dbConn = new Database();
// dbConn.addData({minhaChave:1, num:"444-44-4444"})
//dbConn.getData("Wa, Ghana", "pontos").then(a => console.log(a))
// dbConn.updateData({minhaChave:1, num:"3"})
// dbConn.getData(1).then(a => console.log(a))
// dbConn.deleteData(1)
