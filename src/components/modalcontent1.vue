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
    name: 'modalButtons',
    mounted(){
        this.modalContent1 = document.getElementById('modal-content1');
        this.modalContent2 = document.getElementById('modal-content2');
        this.modalContent3 = document.getElementById('modal-content3');
    },
    methods: {
        goLeft(){
            this.modalContent1.classList.add('zoomOutRight');
            this.modalContent1.classList.remove('slideInRight', 'slideInLeft');
            setTimeout(()=>{
                this.modalContent1.classList.add('hidden');
                this.modalContent2.classList.remove('hidden', 'slideOutLeft');
                this.modalContent2.classList.add('slideInLeft');
            }, 500);
        },  
        goRight(){
            this.modalContent1.classList.add('zoomOutLeft');
            this.modalContent1.classList.remove('slideInLeft','slideInRight');
            setTimeout(()=>{
                this.modalContent1.classList.add('hidden');
                this.modalContent3.classList.remove('hidden', 'slideOutRight');
                this.modalContent3.classList.add('slideInRight');
            }, 500);
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
