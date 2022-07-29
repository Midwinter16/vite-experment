<template>
  <div id="home">
    <div id="home-list" class="list">
      <div class="list-data">
        <div @click="createNew" class="list-data-add">
          <div class="list-data-add-icon iconfont icon-jia"></div>
        </div>
        <!-- <card class="list-data-item" title="测试标题" date="测试日期" imgType="icon-icon-line-graph"></card> -->
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import '@/assets/icons/iconfont.css'
import 'animate.css'
// import card from '@/components/card.vue'
import {useRouter} from 'vue-router'

const router = useRouter()

const createNew = () => {
  router.push('/home/create')
}

// const jumphome = () => {
//   router.go(-1)
// }
</script>

<style lang="less" scoped>
li {
  list-style: none;
}
#home {
  width: 100%;
  height: 100%;
  display: flex;
  .list {
    flex-shrink: 0;
    width: 8rem;
    height: 100%;
    padding: 0.7rem;
    box-sizing: border-box;
    &-data {
      &-item,
      &-add {
        border-radius: 0.2rem;
        margin-bottom: 0.4rem;
      }
      &-add {
        border-radius: 0.2rem;
        padding: 0.2rem;
        background-color: white;
        border: 3px dashed #000;
        text-align: center;
        line-height: 2rem;
        cursor: pointer;
        transition: border 0.3s ease;
        &:hover {
          border: 3px solid #8e54e9;
        }
        &-icon {
          transition: transform 0.3s ease, color 0.3s ease;
        }
        &-icon:hover {
          transform: scale(1.4);
          color: #8e54e9;
        }
      }
    }
  }
}
</style>
