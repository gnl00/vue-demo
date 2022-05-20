<template>
  <div id="nav" class="nav-wrapper h-16 fixed top-0 z-50 border-2 border-blue-700" @click="cleanUp">
    <div class="nav-content">
      <div class="nav-item nav-logo rounded-md">logo</div>

      <div class="nav-item invisible">invisible place holder</div>

      <router-link to="/" class="nav-item nav-menu rounded-md">
        <span>Home</span>
      </router-link>

      <div class="nav-item nav-menu rounded-md">Category</div>

      <div class="nav-item nav-menu rounded-md space-x-2">
        <div class="">Shopping Cart</div>
        <div class="bg-red-500 border-2 border-red-500 rounded-xl">99+</div>
      </div>

      <router-link to="/profile" class="nav-item nav-menu rounded-md">
        <span>Profile</span>
      </router-link>

      <div class="nav-right ">
        <slot name="navRight">
          <div class="signBtn w-full h-full border-4 border-green-600 rounded-3xl ring-4 ring-transparent ring-offset-1 flex justify-center items-center" @mouseover="over" @mouseleave="leave">{{signBtnText}}</div>
        </slot>
      </div>
    </div>

    <div class="border-2 border-red-500 z-50 w-60 h-20 float-right mr-2 bg-navItem flex justify-center items-center" v-if="signChoose">
      SignUp or SignIn ?
    </div>

  </div>
</template>

<script setup>
import {ref} from 'vue'

const signBtnTextDefault = 'Sign Up'
let signBtnText = ref(signBtnTextDefault)

let signChoose = ref(false)

const over = () => {
  signBtnText.value = '🔽'
  signChoose.value = true
  // console.log('mouse hover')
}

const leave = () => {
  // console.log('mouse leave')

  setTimeout(() => {
    signChoose.value = false
    signBtnText.value = signBtnTextDefault
  }, 1500)

}

const cleanUp = () => {
  signChoose.value = false
  signBtnText.value = signBtnTextDefault
}

</script>

<style scoped lang="less">
@import '../../assets/css/components/navbar/index.css';

</style>