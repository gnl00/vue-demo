<template>
  <div id="parent">
    <Child msg="This is Msg transfer from Parent.vue for Child.vue" @adder="adder" :num=localNum />

    <h3>Fetch from server</h3>
    <button @click="fetch">click-to-fetch</button>
    <p>
      <mark>{{fetchMsg}}</mark>
    </p>
  </div>
</template>

<script>
import {ref} from "vue";

import Child from "@/views/Child";
import getString from "@/request";

export default {
  name: "Parent",
  components: {
    Child
  },
  setup() {
    let localNum = ref(12)

    const adder = () => {
      console.log(localNum.value++)
    }

    let fetchMsg = ref(null)

    const fetch = () => {
      getString().then(res => {
        fetchMsg.value = res.data
      }).catch(err => {
        console.log(err)
      })
    }

    return {
      fetchMsg,
      localNum,
      adder,
      fetch
    }
  }
}
</script>

<style scoped>

</style>