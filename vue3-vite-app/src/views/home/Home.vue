<script setup>
</script>

<template>
  <div id="home" class="font-mono text-lg font-semibold mt-14">
    <div class="content">

      <div class="section-block space-y-5 p-4 h-60">
        <span class="section-block-item block rounded-xl h-14">1</span>
        <span class="section-block-item block rounded-xl h-14 opacity-75">2</span>
        <span class="section-block-item block rounded-xl h-14 opacity-50">3</span>
      </div>

      <div class="section-inline-block space-x-4 p-5 h-20">
        <div class="inline-block-item inline-block rounded-xl w-20  align-middle shadow-md">1</div>
        <div class="inline-block-item inline-block rounded-xl w-20  align-middle shadow-lg">2</div>
        <div class="inline-block-item inline-block rounded-xl w-20  align-middle shadow-2xl">3</div>
      </div>

      <div class="section-grid p-2 bg-pink-200">
        <div class="grid grid-cols-3 gap-8">
          <div class="grid-item rounded-xl h-20 flex justify-center items-center bg-pink-500 hover:bg-pink-800">1</div>
          <div class="grid-item rounded-xl h-20 flex justify-center items-center bg-pink-500 hover:bg-pink-800">2</div>
          <div class="grid-item rounded-xl h-20 flex justify-center items-center bg-pink-500 hover:bg-pink-800">3</div>
          <div class="grid-item rounded-xl h-20 flex justify-center items-center bg-pink-500 hover:bg-pink-800">4</div>
          <div class="grid-item rounded-xl h-20 flex justify-center items-center bg-pink-500 hover:bg-pink-800">5</div>
          <div class="grid-item rounded-xl h-20 flex justify-center items-center bg-pink-500 hover:bg-pink-800">6</div>
          <div class="grid-item rounded-xl h-20 flex justify-center items-center bg-pink-500 hover:bg-pink-800">7</div>
          <div class="grid-item rounded-xl h-20 flex justify-center items-center bg-pink-500 hover:bg-pink-800">8</div>
          <div class="grid-item rounded-xl h-20 flex justify-center items-center bg-pink-500 hover:bg-pink-800">9</div>
        </div>
      </div>

      <div class="section-table p-2">
        <div class="table w-full h-52">
          <div class="table-row-group">
            <div class="table-row">
              <div class="table-cell bg-red-300">A cell with more content</div>
              <div class="table-cell bg-red-400">Cell 2</div>
              <div class="table-cell bg-red-300">Cell 3</div>
            </div>
            <div class="table-row">
              <div class="table-cell bg-red-400">Cell 4</div>
              <div class="table-cell bg-red-300">A cell with more content</div>
              <div class="table-cell bg-red-400">Cell 6</div>
            </div>
          </div>
        </div>
      </div>

      <div class="section-float">
        <div class="section-float-r bg-green-300 h-80 overflow-auto">
          <img class="float-right w-48 h-52" src="src/assets/img/lm-green.png">
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam venenatis et lorem sit amet vehicula. Etiam vel nibh nec nisi euismod mollis ultrices condimentum velit. Proin velit libero, interdum ac rhoncus sit amet, pellentesque ac turpis. Quisque ac luctus turpis, vel efficitur ante. Cras convallis risus vel vehicula dapibus. Donec eget neque fringilla, faucibus mi quis, porttitor magna. Cras pellentesque leo est, et luctus neque rutrum eu. Aliquam consequat velit sed sem posuere, vitae sollicitudin mi consequat. Mauris eget ipsum sed dui rutrum fringilla. Donec varius vehicula magna sit amet auctor. Ut congue vehicula lectus in blandit. Vivamus suscipit eleifend turpis, nec sodales sem vulputate a. Curabitur pulvinar libero viverra, efficitur odio eu, finibus justo. Etiam eu vehicula felis.</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam venenatis et lorem sit amet vehicula. Etiam vel nibh nec nisi euismod mollis ultrices condimentum velit. Proin velit libero, interdum ac rhoncus sit amet, pellentesque ac turpis. Quisque ac luctus turpis, vel efficitur ante. Cras convallis risus vel vehicula dapibus. Donec eget neque fringilla, faucibus mi quis, porttitor magna. Cras pellentesque leo est, et luctus neque rutrum eu. Aliquam consequat velit sed sem posuere, vitae sollicitudin mi consequat. Mauris eget ipsum sed dui rutrum fringilla. Donec varius vehicula magna sit amet auctor. Ut congue vehicula lectus in blandit. Vivamus suscipit eleifend turpis, nec sodales sem vulputate a. Curabitur pulvinar libero viverra, efficitur odio eu, finibus justo. Etiam eu vehicula felis.</p>
        </div>

        <div class="section-float-l bg-indigo-300 h-80 overflow-auto">
          <img class="float-left w-48 h-52" src="src/assets/img/lm-indigo.png">
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam venenatis et lorem sit amet vehicula. Etiam vel nibh nec nisi euismod mollis ultrices condimentum velit. Proin velit libero, interdum ac rhoncus sit amet, pellentesque ac turpis. Quisque ac luctus turpis, vel efficitur ante. Cras convallis risus vel vehicula dapibus. Donec eget neque fringilla, faucibus mi quis, porttitor magna. Cras pellentesque leo est, et luctus neque rutrum eu. Aliquam consequat velit sed sem posuere, vitae sollicitudin mi consequat. Mauris eget ipsum sed dui rutrum fringilla. Donec varius vehicula magna sit amet auctor. Ut congue vehicula lectus in blandit. Vivamus suscipit eleifend turpis, nec sodales sem vulputate a. Curabitur pulvinar libero viverra, efficitur odio eu, finibus justo. Etiam eu vehicula felis.</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam venenatis et lorem sit amet vehicula. Etiam vel nibh nec nisi euismod mollis ultrices condimentum velit. Proin velit libero, interdum ac rhoncus sit amet, pellentesque ac turpis. Quisque ac luctus turpis, vel efficitur ante. Cras convallis risus vel vehicula dapibus. Donec eget neque fringilla, faucibus mi quis, porttitor magna. Cras pellentesque leo est, et luctus neque rutrum eu. Aliquam consequat velit sed sem posuere, vitae sollicitudin mi consequat. Mauris eget ipsum sed dui rutrum fringilla. Donec varius vehicula magna sit amet auctor. Ut congue vehicula lectus in blandit. Vivamus suscipit eleifend turpis, nec sodales sem vulputate a. Curabitur pulvinar libero viverra, efficitur odio eu, finibus justo. Etiam eu vehicula felis.</p>
        </div>
      </div>

      <div class="section-fixed">
        <div class="bg-fixed h-32" style="background-image: url(src/assets/img/lm-green.png)">something here</div>
      </div>

      <div class="section-over-fl h-52 overflow-auto bg-red-300">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eleifend rutrum auctor. Phasellus convallis sagittis augue ut ornare. Vestibulum et gravida lectus, sed ultrices sapien. Nullam aliquet elit dui, vitae hendrerit lectus volutpat eget
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eleifend rutrum auctor. Phasellus convallis sagittis augue ut ornare. Vestibulum et gravida lectus, sed ultrices sapien. Nullam aliquet elit dui, vitae hendrerit lectus volutpat eget
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eleifend rutrum auctor. Phasellus convallis sagittis augue ut ornare. Vestibulum et gravida lectus, sed ultrices sapien. Nullam aliquet elit dui, vitae hendrerit lectus volutpat eget
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eleifend rutrum auctor. Phasellus convallis sagittis augue ut ornare. Vestibulum et gravida lectus, sed ultrices sapien. Nullam aliquet elit dui, vitae hendrerit lectus volutpat eget
        Lorem ipsum do        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eleifend rutrum auctor. Phasellus convallis sagittis augue ut ornare. Vestibulum et gravida lectus, sed ultrices sapien. Nullam aliquet elit dui, vitae hendrerit lectus volutpat eget
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eleifend rutrum auctor. Phasellus convallis sagittis augue ut ornare. Vestibulum et gravida lectus, sed ultrices sapien. Nullam aliquet elit dui, vitae hendrerit lectus volutpat eget
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eleifend rutrum auctor. Phasellus convallis sagittis augue ut ornare. Vestibulum et gravida lectus, sed ultrices sapien. Nullam aliquet elit dui, vitae hendrerit lectus volutpat eget
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eleifend rutrum auctor. Phasellus convallis sagittis augue ut ornare. Vestibulum et gravida lectus, sed ultrices sapien. Nullam aliquet elit dui, vitae hendrerit lectus volutpat eget
        Lorem ipLorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eleifend rutrum auctor. Phasellus convallis sagittis augue ut ornare. Vestibulum et gravida lectus, sed ultrices sapien. Nullam aliquet elit dui, vitae hendrerit lectus volutpat eget
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eleifend rutrum auctor. Phasellus convallis sagittis augue ut ornare. Vestibulum et gravida lectus, sed ultrices sapien. Nullam aliquet elit dui, vitae hendrerit lectus volutpat eget
        Lorem ipsum do        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eleifend rutrum auctor. Phasellus convallis sagittis augue ut ornare. Vestibulum et gravida lectus, sed ultrices sapien. Nullam aliquet elit dui, vitae hendrerit lectus volutpat eget
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eleifend rutrum auctor. Phasellus convallis sagittis augue ut ornare. Vestibulum et gravida lectus, sed ultrices sapien. Nullam aliquet elit dui, vitae hendrerit lectus volutpat eget
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eleifend rutrum auctor. Phasellus convallis sagittis augue ut ornare. Vestibulum et gravida lectus, sed ultrices sapien. Nullam aliquet elit dui, vitae hendrerit lectus volutpat eget
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eleifend rutrum auctor. Phasellus convallis sagittis augue ut ornare. Vestibulum et gravida lectus, sed ultrices sapien. Nullam aliquet elit dui, vitae hendrerit lectus volutpat eget
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eleifend rutrum auctor. Phasellus convallis sagittis augue ut ornare. Vestibulum et gravida lectus, sed ultrices sapien. Nullam aliquet elit dui, vitae hendrerit lectus volutpat eget
      </div>

      <div class="section-invisible">
        <div class="flex justify-center space-x-10 bg-indigo-200 h-32 p-2">
          <div class="invisible-item bg-indigo-500 w-28 rounded flex justify-center items-center">1</div>
          <div class="invisible-item invisible">2</div>
          <div class="invisible-item bg-indigo-500 w-28 rounded flex justify-center items-center">3</div>
        </div>
      </div>

      <div class="section-zindex bg-pink-100 h-46 p-2">
        <div class="z-40 bg-pink-200">5</div>
        <div class="z-30 bg-pink-300">4</div>
        <div class="z-20 bg-pink-400">3</div>
        <div class="z-10 bg-pink-500">2</div>
        <div class="z-0 bg-pink-600">1</div>
      </div>

      <div class="section-col-span bg-purple-200 h-60 p-2">
        <div class="grid grid-cols-3 gap-4">
          <div class="h-16 bg-purple-500 rounded-lg flex justify-center items-center">1</div>
          <div class="bg-purple-500 rounded-lg flex justify-center items-center">2</div>
          <div class="bg-purple-500 rounded-lg flex justify-center items-center">3</div>
          <div class="col-span-2 h-16 bg-purple-500 rounded-lg flex justify-center items-center">4</div>
          <div class="bg-purple-500 rounded-lg flex justify-center items-center">5</div>
          <div class="h-16 bg-purple-500 rounded-lg col-span-3 flex justify-center items-center">6</div>
        </div>
      </div>

      <div class="section-col-start bg-blue-200 h-60 p-2">
        <div class="grid grid-cols-6 gap-4">
          <div class="col-start-2 col-span-4 h-16 bg-blue-500 flex justify-center items-center rounded-lg">1</div>
          <div class="col-start-1 col-end-3 h-16 bg-blue-500 flex justify-center items-center rounded-lg">2</div>
          <div class="col-end-7 col-span-2 h-16 bg-blue-500 flex justify-center items-center rounded-lg">3</div>
          <div class="col-start-1 col-end-7 h-16 bg-blue-500 flex justify-center items-center rounded-lg">4</div>
        </div>
      </div>

      <div class="section-grid-row h-68 p-2 bg-yellow-200">
        <div class="h-64 grid grid-rows-3 grid-flow-col gap-4">
          <div class="bg-yellow-500 rounded-xl flex justify-center items-center">1</div>
          <div class="bg-yellow-500 rounded-xl flex justify-center items-center">2</div>
          <div class="bg-yellow-500 rounded-xl flex justify-center items-center">3</div>
          <div class="bg-yellow-500 rounded-xl flex justify-center items-center">4</div>
          <div class="bg-yellow-500 rounded-xl flex justify-center items-center">5</div>
          <div class="bg-yellow-500 rounded-xl flex justify-center items-center">6</div>
          <div class="bg-yellow-500 rounded-xl flex justify-center items-center">7</div>
          <div class="bg-yellow-500 rounded-xl flex justify-center items-center">8</div>
          <div class="bg-yellow-500 rounded-xl flex justify-center items-center">9</div>
        </div>
      </div>

      <div class="section-row-span h-46 bg-pink-200 p-2">
        <div class="grid grid-rows-3 grid-flow-col gap-4">
          <div class="row-span-3 bg-pink-500 rounded-xl flex justify-center items-center">1</div>
          <div class="col-span-2 bg-pink-500 rounded-xl flex justify-center items-center">2</div>
          <div class="row-span-2 col-span-2 bg-pink-500 rounded-xl flex justify-center items-center">3</div>
        </div>
      </div>

      <div class="section-row-start h-46 bg-green-200 p-2">
        <div class="grid grid-rows-3 grid-flow-col gap-4">
          <div class="row-start-2 row-span-2 h-16 bg-green-500 rounded-xl flex justify-center items-center">1</div>
          <div class="row-end-3 row-span-2 h-16 bg-green-500 rounded-xl flex justify-center items-center">2</div>
          <div class="row-start-1 row-end-4 h-16 bg-green-500 rounded-xl flex justify-center items-center">3</div>
        </div>
      </div>

    </div>

  </div>
</template>

<style scoped lang="less">
@import '../../assets/css/views/home/index.css';

#home {
  border: rgba(227, 78, 78, 0.89) solid 2px;
}

.content {
  background: #FE7E6D;
}

.section-grid {
  color: white;
}

.section-table {
  color: white;
  background-color: #ffeff0;
}

</style>