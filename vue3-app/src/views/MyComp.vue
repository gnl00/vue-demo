<template>
  <div id="myComp">
    <h1>Show some text for MyComp</h1>
    <hr />
    <div>
      <n-button @click="btnClick">fetchData</n-button>
    </div>
    <div id="show-area">
      <div id="tree-area">
        <n-tree
            :data="treeData"
            :default-expanded-keys="defaultExpandedKeys"
            selectable
            :node-props="nodeProps"
        />
      </div>
      <div id="tab-area">
        <div id="tab-top">
          <n-tabs
              @before-leave="handleBeforeLeave"
              @update:value="handleUpdateVal"
              type="line">
            <n-tab-pane class="tab-table" name="device" tab="设备编码">
              <n-table class="tab-table" :bordered="false" :single-line="false">
                <thead>
                <tr>
                  <th>编码设备名称</th>
                  <th>接入协议</th>
                  <th>设备型号</th>
                  <th>IP 地址</th>
                  <th>端口</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="device in deviceData.value">
                  <td>{{device.deviceName}}</td>
                  <td>{{device.treatyType}}</td>
                  <td>{{device.deviceType}}</td>
                  <td>{{device.ip}}</td>
                  <td>{{device.port}}</td>
                </tr>
                </tbody>
              </n-table>
            </n-tab-pane>

            <n-tab-pane class="tab-table" name="camera" tab="监控点">
              <n-table :bordered="false" :single-line="false">
                <thead>
                <tr>
                  <th>监控点名称</th>
                  <th>所属设备</th>
                  <th>IP 地址</th>
                  <th>端口</th>
                  <th>通道</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(camera, index) in cameraData.value">
                  <td>{{camera.cameraName}}</td>
                  <td>{{camera.deviceName}}</td>
                  <td>{{camera.ip}}</td>
                  <td>{{camera.port}}</td>
                  <td>{{camera.channelNo}}</td>
                </tr>
                </tbody>
              </n-table>
            </n-tab-pane>
          </n-tabs>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, ref } from "vue";
import { NButton, NTree, NTabs, NTabPane, NTable } from 'naive-ui'

import {getBasicCategory, getCamera, getChild, getDevice} from "@/request/work";

export default {
  name: "MyComp",
  components: {
    NButton,
    NTree,
    NTabs,
    NTabPane,
    NTable
  },
  setup() {

    let treeData = reactive([])

    let expandedKeys = ref([])

    let tabIndex = ref('device')

    const btnClick = () => {
      fetchData()
    }

    const fetchData = () => {

      if (treeData.length != 0) {
        return
      }

      getBasicCategory(new Date().getTime()).then(res => {

            if (res.data.length !== 0) {

              for (const basic of res.data) {
                const root = {}
                getChild(basic.catalogIndexCode, new Date().getTime()).then(res => {

                  if (res.data.children.length != 0) {
                    const children = []
                    for (const dataChild of res.data.children) {
                      const child = {
                        label: dataChild.regionName,
                        key: dataChild.regionIndexCode,
                      }
                      children.push(child)
                    }
                    root.label = res.data.regionName
                    root.key = res.data.regionIndexCode
                    root.children = children
                    treeData.push(root)
                  }

                }).then(() => {

                  // 默认展开第一个
                  expandedKeys.value.push(treeData[0].key)

                }).catch(err => {
                  console.log(err)
                })
              }
            }
          }).catch(err => {
            console.log(err)
          })
    }

    let deviceData = reactive({})
    let cameraData = reactive({})

    const nodeProps = ({option}) => {
      return {
        onClick() {
          console.log(option.label, option.key)
          console.log(tabIndex.value)

          const param = {
            pageNum: 1,
            regionIndexCode: option.key,
            catalogIndexCode: 50,
            timestamp: new Date().getTime()
          }

          if (tabIndex.value === 'device') {
            // 获取设备编码
            getDevice(param).then(res => {
              deviceData.value = res.data

            }).catch(err => {
              console.log(err)
            })
          } else {
            // 获取监控点信息
            getCamera(param).then(res => {
              cameraData.value = res.data

            }).catch(err => {
              console.log(err)
            })
          }
        }
      }
    }

    const handleBeforeLeave = (tabName) => {
      console.log('leaving ' + tabName)
      return true
    }

    const handleUpdateVal = (val) => {
      console.log('come in ' + val)

      tabIndex.value = val
    }

    onMounted(() => {
      console.log('onMounted')
      fetchData()
    })

    return {
      treeData,
      defaultExpandedKeys: expandedKeys,
      nodeProps,
      btnClick,
      handleBeforeLeave,
      handleUpdateVal,
      deviceData,
      cameraData
    }
  },
}
</script>

<style scoped>
#myComp li {
  list-style-type: none
}

#show-area {
  margin-top: 10px;
  border: #42b983 solid 2px;
  display: inline-flex;
  width: 100%;
}

#tree-area {
  border: #373837 solid 1px;
  width: 10%;
}

#tab-area {
  border: #cc2d2d solid 1px;
  width: 90%;
  display: flex;
  flex-direction: column;
}

.tab-table {
  padding: 0;
}

#tab-top {
  border: #175ede solid 1px;
  flex: 0 0 auto;
  height: 100%;
}

</style>