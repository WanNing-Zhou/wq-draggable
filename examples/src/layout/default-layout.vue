<template>

    <div class="default-layout">
      <div class="box" style="height: 600px; background: black;">
        <GridDropContent v-model="data" :column="24" :gap="4" :row="10">
          <template #preview-item="{data}">
            <div style="width: 100%; height: 100%; background: #646cff">
             <template v-if="data.id == 2222">
               <GridDropContent v-model="data2" :column="6" :gap="4" :row="6">
                  <template #preview-item="{data : item}">
                    <div style="width: 100%; height: 100%; background: #646cff">
                      {{item.w}} - {{item.h}}
                    </div>
                  </template>
               </GridDropContent>
             </template>
              <template v-else>
                {{data}}
              </template>
            </div>
          </template>
        </GridDropContent>
        <hr>
        <div class="box" style="height: 600px; background: black;">
        <GridDropContent v-model="data3" :column="24" :gap="4" :row="10">
          <template #preview-item="{data}">
            <div style="width: 100%; height: 100%; background: #646cff">
                {{data}}
            </div>
          </template>
        </GridDropContent>
        </div>
      </div>

    </div>

</template>

<script setup lang="ts">
  import  GridDropContent  from '../../../packages/vue/src/components/DropContent.vue';
  import {reactive, ref, watch, watchEffect} from "vue";
  const data = ref([
    {
      id: 1111,
      key: 'demo-component',
      title: '组件标题',
      group: 'dropDrap',
      w: 4,
      h: 4,
      x: 1,
      y: 1,
    },
    {
      id: 2222,

      key: 'demo-component',
      title: '组件标题',
      w: 5,
      h: 5,
      x: 5,
      y: 5,
    },
  ]);

  const data2 = ref([
    {
      id: 123,
      key: 'demo-component',
      title: '组件标题',
      w: 3,
      h: 3,
      x: 1,
      y: 1,
    }
  ])

  const data3 = ref([])

  const size = reactive({
    width: 0,
    height: 0
  })
  watchEffect(
      () => {
        console.log(size.width, size.height)
      }
  )
</script>

<style lang="scss" scoped>
.default-layout{
  //width: 100%;
  //height: 100%;
  background-color: black;
  //display: flex;
  //justify-content: center;
  //align-items: center;
}
</style>