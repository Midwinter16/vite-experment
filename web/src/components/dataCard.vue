<template>
  <div class="data-card" :class="[len != typeLen ? 'warning-tips' : '']">
    <div class="data-card-safe" :class="showTips ? 'hideTips' : ''">
      <div class="data-card-safe-name">
        {{ props.name }}
      </div>
      <div
        @click="editItem"
        class="data-card-safe-edit iconfont icon-bianji"
      ></div>
      <div
        @click="deleteItem"
        class="data-card-safe-delete iconfont icon-shanchu"
      ></div>
    </div>
    <div class="data-card-warning" :class="showTips ? 'showTips' : ''">
      <div class="data-card-warning-info">
        {{
          props.len > props.typeLen
            ? `数据量(${props.len})大于类别数(${props.typeLen})`
            : `数据量(${props.len})小于类别数(${props.typeLen})`
        }}
      </div>
    </div>
  </div>
  <span v-show="len != typeLen" class="tips iconfont icon-jingshi"></span>
</template>

<script setup lang="ts">
import { defineProps, onMounted, ref } from 'vue'
import '@/assets/icons/iconfont.css'
import { storeHome } from '@/store/store'
// 初始化仓库
const store_home = storeHome()

type Props = {
  name: string;
  len: number;
  typeLen: number;
  id: number;
};

const props = defineProps<Props>()
// 动画flag
const showTips = ref<boolean>(false)
// 编辑数据
const editItem = () => {
	store_home.$patch({
		chooseId: props.id,
		operate: 'edit',
	})
}
// 删除数据
const deleteItem = () => {
	store_home.$patch({
		chooseId: props.id,
		operate: 'delete',
	})
}

onMounted(() => {
	const tips = document.querySelector('.tips')
	tips?.addEventListener('mouseenter', () => {
		showTips.value = true
		tips.addEventListener('mouseout', () => {
			showTips.value = false
		})
	})
})
</script>

<style lang="less">
.data-card {
  width: 6rem;
  border-radius: 0.3rem;
  border: 2px solid #666;
  margin-right: 0.3rem;
  position: relative;
  box-sizing: border-box;
  margin-bottom: 0.3rem;
  // overflow: hidden;
  &-safe {
    display: flex;
    flex-direction: row;
    position: relative;
    top: 0;
    opacity: 1;
    transition: 0.5s opacity ease;
    &-name {
      font-size: 0.4rem;
      padding: 0 0.2rem;
      flex: 3;
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    &-edit,
    &-delete {
      flex: 1;
      cursor: pointer;
      transition: transform 0.3s ease;
      text-align: center;
      &:hover {
        transform: scale(1.2);
      }
    }
  }
  &-warning {
    opacity: 0;
    position: absolute;
    top: 0;
    width: 100%;
    transition: 0.5s opacity ease;
    z-index: -99;
    &-info {
      text-align: center;
    }
  }
}
.warning-tips {
  border: 2px solid #ffc107;
  font-size: 0.3rem;
}
.tips {
  font-size: 0.7rem;
  color: #ffc107;
  cursor: pointer;
}
.hideTips {
  opacity: 0;
  z-index: -99;
}
.showTips {
  opacity: 1;
  z-index: 99;
}
</style>
