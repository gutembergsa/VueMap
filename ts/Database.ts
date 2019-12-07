enum Operations { get, getAll, getSelected, add, update, delete, deleteAll}

function makeTransaction(operation: Operations, db: IDBDatabase, objectStoreName: string, data?: any): Promise<any>{
    
    switch (operation) {

        case Operations.get:
            return new Promise(resolve =>{
                db.transaction([objectStoreName])
                .objectStore(objectStoreName)
                .get(data)
                .onsuccess = result => {
                    console.log(result)
                    resolve((result as any).target.result)
                }            
            })                       

        case Operations.getAll:
            return new Promise(resolve =>{
                db.transaction([objectStoreName])
                .objectStore(objectStoreName)
                .getAll()
                .onsuccess = result => {
                    resolve((result as any).target.result)
                } 
            })                       

        case Operations.getSelected:
            return new Promise(resolve =>{
                db.transaction([objectStoreName])
                .objectStore(objectStoreName)
                .openCursor()
                .onsuccess = (event: any) => {
                    //debugger;
                    const cursor: IDBCursorWithValue = event.target.result;
                    if (cursor) {
                        if (cursor.value.selected) resolve(cursor.value)
                        cursor.continue();
                    }
                    else resolve(false)
                }             
            })             

        case Operations.add:
            db.transaction([objectStoreName], "readwrite")
            .objectStore(objectStoreName)
            .add(data)
            .onsuccess = result => console.log('success added',result) 
            break;

        case Operations.update:
            db.transaction([objectStoreName], "readwrite")
            .objectStore(objectStoreName)
            .put(data)
            .onsuccess = result => console.log('success updated',result)            
            break;
                
        case Operations.delete:
            db.transaction([objectStoreName], "readwrite")
            .objectStore(objectStoreName)
            .delete(data)
            .onsuccess = result => console.log('success delete', result)
            break;
        
        case Operations.deleteAll:
            db.transaction([objectStoreName], "readwrite")
            .objectStore(objectStoreName)
            .clear()
            .onsuccess = result => console.log('success clear', (result as any).target.readyState)
            break;
                
        default:
            break;
    }
}

class Database {


    dbRequest: IDBFactory = window.indexedDB
    dbInstance: IDBDatabase
    
    requestConnection(): Promise<IDBDatabase>{
        return new Promise((resolve, reject) => {
            const request = this.dbRequest.open('vuemap', 2);
            request.onerror = (err: any) => reject(`error on connection: ${err.target.error.message}`);
            request.onsuccess = (ev: any) => resolve(ev.target.result);
            request.onupgradeneeded = (ev: any) => {
                ev.target.result.createObjectStore('pontos', { keyPath: "label" })
                ev.target.result.createObjectStore('rotas', { keyPath: "label" })
                ev.target.result.onerror = (err: any) => reject(`error on upgrade: ${err.target.error.message}`);
                resolve(ev.target.result);
            }
        })
    }
    async addData(data: Object, objectStoreName: string): Promise<any>{
        return this.requestConnection().then(db => makeTransaction(Operations.add, db, objectStoreName, data))
    }
    async deleteData(data: any, objectStoreName: string): Promise<any>{
        return this.requestConnection().then(db => makeTransaction(Operations.delete, db, objectStoreName, data))
    }
    async deleteAllData(objectStoreName: string): Promise<any>{
        return this.requestConnection().then(db => makeTransaction(Operations.deleteAll, db, objectStoreName))
    }
    async updateData(data: any, objectStoreName: string): Promise<any>{        
        return this.requestConnection().then(db => makeTransaction(Operations.update, db, objectStoreName, data))
    }
    async getData(data: any, objectStoreName: string): Promise<Event>{
        return new Promise(resolve => {
            this.requestConnection().then(db => {
                makeTransaction(Operations.get, db, objectStoreName, data).then(result => resolve(result))
            })    
        }) 
    }
    async getSelectedCard(objectStoreName: string): Promise<Event>{
        return new Promise(resolve => {
            this.requestConnection().then(db => {
                makeTransaction(Operations.getSelected, db, objectStoreName).then(result =>resolve(result))
            })    
        }) 
    }
    async getAllData(objectStoreName: string): Promise<Event>{
        return new Promise(resolve => {
            this.requestConnection().then(db => {
                makeTransaction(Operations.getAll, db, objectStoreName).then(result => resolve(result))
            })    
        }) 
    }

}

export const dbConn = new Database()

// dbConn.addData({minhaChave:1, num:"444-44-4444"})

//dbConn.getData("Wa, Ghana", "pontos").then(a => console.log(a))

// dbConn.updateData({minhaChave:1, num:"3"})

// dbConn.getData(1).then(a => console.log(a))

// dbConn.deleteData(1)

