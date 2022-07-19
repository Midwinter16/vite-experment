<template>
  <div class="card">
    <div class="card-info hidden-info">
      <div class="card-info-title">{{ title }}</div>
      <div class="card-info-date">{{ date }}</div>
    </div>
    <div class="card-type iconfont" :class="imgType"></div>
  </div>
</template>

<script setup lang="ts">
import "@/assets/icons/iconfont.css";
import { defineProps } from "vue";
type Props = {
  title: string;
  date: string;
  imgType: string;
};
withDefaults(defineProps<Props>(), {
  title: "默认标题",
});
</script>

<style lang="less">
.card {
  background-color: white;
  border-radius: 0.2rem;
  overflow: hidden;
  display: flex;
  padding: 0.2rem;
  &-info {
    flex: 5;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    &-title {
      font-size: 0.7rem;
    }
    &-date {
      font-size: 0.2rem;
    }
  }
  &-type {
    width: 100%;
    flex: 3;
    font-size: 1.5rem;
    text-align: center;
    line-height: 2rem;
  }
}
</style>
