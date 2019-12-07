<template>
  <div>
    <Notification/>
    <Buttonbox/>
    <Article/>
  </div>
</template>

<script>
import Notification from '../commons/Notification';
import Buttonbox from '../buttonBox/Buttonbox';
import Article from '../commons/Article';


export default {
  name: 'Body',
  components:{
    Notification,
    Buttonbox,
    Article,
  }
}
</script>

<style>

</style>