<template>
  <div>
    <Database/>
    <Navbar class="is-marginless"/>
    <addHome/>
    <Buttonbox/>
    <Notification/>
    <Article/>
    <Footer/>
  </div>
</template>

<script>
import Navbar from './components/Navbar';
import Article from './components/Article';
import Buttonbox from './components/Buttonbox';
import Notification from './components/Notification';
import addHome from './components/addHome';
import Footer from './components/Footer';
import Database from './components/Database';
import { setTimeout } from 'timers';

export default {
  name: 'app',
  mounted(){
  },
  components:{
    Navbar,
    Notification,
    Buttonbox,
    addHome,
    Article,
    Footer,
    Database
  }
}
</script>

<style>            
.center {
  width: auto;
}
</style>