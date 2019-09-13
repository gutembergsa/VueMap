export default {
    checkEmpty: object  => {
        if (object.nome === '' || object.label === undefined || object.lat === undefined) {
            return false
        }
        return true;
    },
    checkEmpty2: object  => {
        if (object.nome === '' || object.label[0] === undefined || object.partida === undefined || object.chegada === undefined) {
            return false
        }
        return true;
    },
}