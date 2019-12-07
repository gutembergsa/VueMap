<template>
  <div>
    <Navbar class="is-marginless"/>
    <Body/>
    <Footer/>
  </div>
</template>

<script>
import Navbar from './components/AppRoot/Navbar';
import Body from './components/AppRoot/Body';
import Footer from './components/AppRoot/Footer';

export default {
  name: 'App',
  components:{
    Navbar,
    Body,
    Footer,
  }
}
</script>

<style>            
.center {
  width: auto;
}
</style>