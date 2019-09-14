export default {
    checkEmpty: object  => {
        if (object.nome === '' || object.label === undefined || object.lat === undefined) {
            return false
        }
        return true;
    },
    checkEmpty2: object  => {
        console.log(object)
        if (object.nome === '' || object.label[0] === undefined || object.partida === [] || object.chegada === []) {
            return false
        }
        return true;
    },
}