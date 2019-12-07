<template>
<section class="hero is-warning is-small">
  <div class="hero-body has-text-centered ">
    <div class="container is-centered ">
      <h1 class="title">
        VueMAP <i class="fas fa-map-marked-alt"></i>
      </h1>
    </div>
  </div>
</section>
</template>

<script>
import { setTimeout } from 'timers';

export default {
  name: 'Navbar',
  data(){
    return{
      flag: false
    }
  }
}
</script>

<style scoped>
.nav{
  z-index: 2;
}
.menu{
  position: absolute;
  width: 100%;
  padding-right: 150px;
  z-index: 2;
}
.center{
  margin-top: 15px;
  margin-left: auto;
  margin-right: auto; 
  font-family: Calibri;
}
.hidden{
  display: none;
}
</style>

