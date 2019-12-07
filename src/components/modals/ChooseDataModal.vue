<template>
<div class="modal-content form">
    <div class="box is-paddingless">
        <div class="field">
            <button class="button upbtn is-fullwidth is-large is-primary is-outlined" id="ptnadd" @click="goLeft">
                <span class="container">Adicionar um <br>novo ponto</span>
                <span class="icon">
                    <i class="fas fa-map-pin"></i>
                </span>
            </button>
            <button class="button botbtn is-fullwidth is-large is-info is-outlined" id="routadd" @click="goRight">
                <span class="container">Adicionar uma <br>nova rota</span>
                <span class="icon">
                    <i class="fas fa-map-marked-alt"></i>
                </span>
            </button>
        </div>
    </div>
</div>
</template>

<script>

export default {
    name: 'ChooseDataModal',
    methods: {
        goLeft(){
            this.$store.commit('moveModal', [this.returnById('modal-content1'), this.returnById('modal-content2')])
        },  
        goRight(){
            this.$store.commit('moveModal', [this.returnById('modal-content1'), this.returnById('modal-content3')]);
        }   
    }
}
</script>

<style scoped>
.upbtn{
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
    height: 100px;
}
.botbtn{
    border-top-left-radius: 0px;
    border-top-right-radius: 0px;
    height: 100px;
}
.form{
    width: 250px;
    z-index: 2;
}

</style>
