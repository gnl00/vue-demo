<template>

  <NavBar>
    <template v-slot:navRight>
      <div class="avatar bg-gray-100 w-full h-full text-black rounded-lg flex justify-center items-center" @mouseover="hover" @mouseleave="leave">
        <span>avatar place</span>
      </div>

      <div class="border-2 border-blue-500 z-10 h-48 w-60 float-right mr-2 bg-pink-300" v-if="profileMenu">
        about and setting
      </div>
    </template>
  </NavBar>

  <div id="profile" class="profile border-3 border-black min-h-screen bg-yellow-200 flex justify-center items-center">

    <div>
      <h1>this is profile page.</h1>
    </div>
  </div>
</template>

<script setup>
import {ref} from "vue";

import NavBar from '@/components/navBar/NavBar.vue'

let profileMenu = ref(false)

const hover = () => {
  profileMenu.value = true
}

const leave = () => {
  profileMenu.value = false
}

</script>

<style scoped lang="less">
@import '../../assets/css/views/profile/index.css';

</style>