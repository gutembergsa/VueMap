<template>
    <div class="notification hidden is-warning index animated" id="close-notification">
        <button class="delete" @click="close"></button>
        <p id="content"></p>
    </div>  
</template>

<script>
import { setTimeout } from 'timers';

export default {
    name: 'Notification',
    methods:{
        notificate(content, num = 3000){
            let notification = document.getElementById('close-notification');
            notification.classList.remove('hidden' ,'slideOutLeft');
            notification.classList.add('slideInLeft');
            document.getElementById('content').innerHTML = content;
            setTimeout(() => notification.classList.add('slideOutLeft'), num);
        },
        close(){
            document.getElementById('close-notification').classList.add('slideOutLeft');
        }
    }
}
</script>

<style scoped>
.index{
    position: absolute;
    z-index: 4;
}
.hidden{
    display: none;
}
</style>