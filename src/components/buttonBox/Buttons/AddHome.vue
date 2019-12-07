<template>
    <div class="has-background-light">
        <div id="addHome" class="notification is-dark is-marginless animated" :class="{'is-hidden': !flag, 'fadeIn': flag}">
            <button class="delete" @click="slideClose"></button>
            <div class="section is-size-6">
                <p>Instale este app para uma experiência mais rapida!</p><button class="button space1" @click="showInstallPromotion">Instalar</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name:'addHome',
    data(){
        return{
            deferredPrompt: null,
            not: null,
            flag: false
        }
    },
    mounted(){
        this.beforeInstall();
        window.addEventListener('resize', ()=>{
            if (window.matchMedia('(display-mode: standalone)').matches) {
                console.log('display-mode is standalone');
            }            
            if (window.navigator.standalone === true) {
                console.log('display-mode is standalone');
            }        
        })
    },
    methods:{
        beforeInstall(){
            window.addEventListener('beforeinstallprompt', (e) => {
                e.preventDefault();
                this.deferredPrompt = e;
                this.flag = true;                
            });            
        },
        showInstallPromotion(){
            this.not = document.getElementById('addHome');
            this.deferredPrompt.prompt();
            this.deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    this.not.classList.remove('slideOutLeft');
                    this.not.classList.add('slideOutLeft');
                    setTimeout(() => {
                        this.not.classList.add('is-hidden');
                    }, 1000);
                } else {
                    this.not.classList.remove('slideOutLeft');
                    this.not.classList.add('slideOutLeft');
                    setTimeout(() => {
                        this.not.classList.add('is-hidden');
                    }, 1000);
                }
                this.deferredPrompt = null;
            })
        },
        slideClose(){
            this.not = document.getElementById('addHome');
            this.not.classList.remove('fadeIn');
            this.not.classList.add('slideOutLeft');
            setTimeout(() => {
                this.not.classList.add('is-hidden');
            }, 1000);
        }
    }
}
</script>

<style>
.space1{
    margin-top: 20px;
}
</style>