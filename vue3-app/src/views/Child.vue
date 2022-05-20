<template>
  <div id="child">
    <h3>{{msg}}</h3>
    <button @click="childAdd">childAdd</button>
    <p>{{num}}</p>
  </div>
</template>

<script>
export default {
  name: "Child",
  props: ['msg', 'num'],
  emits: ['adder'],
  setup(props, context) {

    const childAdd = () => {
      context.emit('adder')
    }

    return {
      childAdd
    }
  }
}
</script>

<style scoped>

</style>