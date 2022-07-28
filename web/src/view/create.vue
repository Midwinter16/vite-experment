<template>
  <div class="create">
    <div class="create-main">
      <!-- 图表主体 -->
      <cCharts v-if="isShow" :data="chartsData"></cCharts>
      <div style="flex: 1" v-else></div>
      <!-- 图表设置 -->
      <div class="create-main-setting">
        <el-form
          :model="chartsData"
          :label-position="labelPosition"
          label-width="3.5rem"
        >
          <!-- 标题 -->
          <el-form-item label="图表标题">
            <el-input v-model.trim="chartsData.title"></el-input>
          </el-form-item>
          <!-- 数据图类型 -->
          <el-form-item label="图表类型">
            <el-select-v2
              v-model="chartsData.chartType"
              :options="options"
              placeholder="Please select"
            ></el-select-v2>
          </el-form-item>
          <!-- x轴标签 -->
          <el-form-item label="x轴标签">
            <el-input
              v-model.trim="chartsData.xlabel"
              placeholder="标签之间使用空格 / 逗号分开"
            ></el-input>
          </el-form-item>
          <!-- y轴标签？ -->

          <!-- 边界模式 -->
          <el-form-item v-if="isLine" label="x轴边界间隙">
            <el-radio-group v-model="chartsData.boundaryGap" class="ml-4">
              <el-radio :label="true">有边界</el-radio>
              <el-radio :label="false">无边界</el-radio>
            </el-radio-group>
          </el-form-item>

          <!-- 平滑曲线 -->
          <el-form-item v-if="isLine" label="平滑曲线">
            <el-radio-group v-model="chartsData.smooth" class="ml-4">
              <el-radio :label="true">开启平滑</el-radio>
              <el-radio :label="false">关闭平滑</el-radio>
            </el-radio-group>
          </el-form-item>

          <!-- 数据圆点 -->
          <el-form-item v-if="isLine" label="标签圆点">
            <el-radio-group v-model="chartsData.circle" class="ml-4">
              <el-radio :label="true">开启</el-radio>
              <el-radio :label="false">关闭</el-radio>
            </el-radio-group>
          </el-form-item>

          <!-- 筛选 -->
          <el-form-item label="筛选框">
            <el-checkbox-group v-model="chartsData.filters">
              <el-checkbox label="类别筛选" border name="type" />
            </el-checkbox-group>
          </el-form-item>

          <!-- 信息提示框 -->
          <el-form-item label="额外信息">
            <el-checkbox-group v-model="chartsData.tooltips">
              <el-checkbox label="y轴辅助线" border name="type" />
              <el-checkbox label="x轴辅助线" border name="type" />
              <el-checkbox label="平均值" border name="type" />
              <el-checkbox label="双极值" border name="type" />
            </el-checkbox-group>
          </el-form-item>

          <!-- 数据 -->
          <el-form-item class="data-list" label="数据集">
            <div class="data-list-add">
              <div
                @click="addData"
                class="data-list-add-icon iconfont icon-jia"
              ></div>
            </div>
            <dataCard
              v-for="item in chartsData.series"
              :key="item._id"
              :name="item.name"
              :id="item._id"
              :len="item.data.split(',').length"
              :typeLen="chartsData.xlabel.split(',').length"
            ></dataCard>
          </el-form-item>
        </el-form>

        <el-dialog v-model="dialogFormVisible" title="输入数据">
          <el-form
            :rules="tempRules"
            :model="tempData"
            label-position="top"
            label-width="150"
            ref="tempRuleFormRef"
          >
            <el-form-item label="数据类型" prop="name">
              <el-input v-model.trim="tempData.name"></el-input>
            </el-form-item>
            <el-form-item label="数据" prop="data">
              <el-input v-model.trim="tempData.data"></el-input>
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="cancelCreate">取消</el-button>
              <el-button type="primary" @click="createData(tempRuleFormRef)"
                >确认</el-button
              >
            </span>
          </template>
        </el-dialog>
      </div>
      <!-- 按钮区 -->
      <div class="create-main-btn">
        <el-button class="btn-save" type="success">保存图表</el-button>
        <el-button class="btn-standby" type="warning">备用按钮</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import cCharts from './chart.vue'
import { ref, reactive, nextTick, watch, watchEffect, onMounted } from 'vue'
import { debounce } from '@/public/pts'
import dataCard from '@/components/dataCard.vue'
import '@/assets/icons/iconfont.css'
import type { FormRules, FormInstance } from 'element-plus'
import { storeHome } from '@/store/store'

// 控制图表假更新（通过移除组件实现更新）
const isShow = ref<boolean>(true)
// 判断图表类型
const isBar = ref<boolean>(true)
const isLine = ref<boolean>(true)
// 控制form表单标题位置
const labelPosition =
  document.documentElement.clientWidth < 992 ? ref<string>('top') : ref<string>('right')
// 对话框
const dialogFormVisible = ref<boolean>(false)

// 数据类型
type seriesItem = {
  _id: number;
  name: string;
  data: string;
};
// 图表数据类型
type chart = {
  title: string;
  chartType: string;
  xlabel: string;
  series: seriesItem[];
  tooltips: string[];
  filters: string[];
  boundaryGap: boolean;
  smooth: boolean;
  circle: boolean;
};
// 数据模型
const chartsData: chart = reactive({
	title: ref<string>('默认标题'),
	chartType: ref<string>('line'),
	xlabel: ref<string>('衬衫,羊毛衫,雪纺衫,裤子,高跟鞋,袜子'),
	series: reactive([
		{
			_id: Date.parse(Date()),
			name: '销量',
			data: '5, 20, 36, 10, 10, 20',
		},
	]),
	tooltips: ref<string[]>(['y轴辅助线', 'x轴辅助线', '平均值', '双极值']),
	filters: ref<string[]>(['类别筛选']),
	boundaryGap: ref<boolean>(true),
	smooth: ref<boolean>(false),
	circle: ref<boolean>(false),
})

// 暂存数据模型
type temp = {
  name: string;
  data: string;
};
const tempData: temp = reactive({
	name: ref<string>(''),
	data: ref<string>(''),
})

// 暂存数据模型验证规则
const tempRuleFormRef = ref<FormInstance>()
const tempRules = reactive<FormRules>({
	name: [{ required: true, message: '数据类型是必填项', trigger: 'blur' }],
	data: [{ required: true, message: '数据是必填项', trigger: 'blur' }],
})

// 初始化仓库
const store_home = storeHome()
// 监听仓库
store_home.$subscribe((mutation, state) => {
	// 如果是editId改变了，说明是子组件触发的编辑或者是删除
	if (state.chooseId) {
		if (state.operate == 'edit') {
			let chooseItem = chartsData.series.filter((ele: any) => {
				return ele._id == state.chooseId
			})[0]
			tempData.name = chooseItem.name
			tempData.data = chooseItem.data
			dialogFormVisible.value = true
		} else if (state.operate == 'delete') {
			chartsData.series = chartsData.series.filter((ele: any) => {
				return ele._id != state.chooseId
			})
			store_home.$reset()
		}
	}
})

// 多选选项
const options = [
	{ value: 'bar', label: '柱状图' },
	{ value: 'line', label: '折线图' },
]

// 预览
const preview = () => {
	isShow.value = false
	nextTick(() => {
		isShow.value = true
	})
}

// 增加数据显示对话框
const addData = () => {
	dialogFormVisible.value = true
}
// 取消操作，重置pinia状态，重置tempData
const cancelCreate = () => {
	dialogFormVisible.value = false
	tempData.name = ''
	tempData.data = ''
	store_home.$reset()
}
// 将数据调整格式后转移到chartsData，并且增加一个数据集组件
const createData = async (formEl: FormInstance | undefined) => {
	// 验证暂存表单
	if (!formEl) return
	await formEl.validate((valid, fields) => {
		if (valid) {
			dialogFormVisible.value = false
			// 判断是否是编辑状态
			if (store_home.operate == 'edit') {
				chartsData.series = chartsData.series.map((ele: any) => {
					if (store_home.chooseId == ele._id) {
						return {
							_id: ele._id,
							name: tempData.name,
							data: tempData.data,
						}
					} else {
						return ele
					}
				})
				// 重置仓库状态
				store_home.$reset()
			} else {
				chartsData.series.push({
					_id: Date.parse(Date().toString()),
					name: tempData.name,
					data: tempData.data,
				})
			}
			tempData.name = ''
			tempData.data = ''
		} else {
			console.log('error submit!', fields)
		}
	})
}

// 监听chartsData变化节流更新预览图
watch(chartsData, debounce(preview, 1000) as any)
// 监听图表类型改变对应选项是否出现
// watchEffect((oninvalidate) => {
watchEffect(() => {
	isBar.value = false
	isLine.value = false
	switch (chartsData.chartType) {
	case 'bar':
		isBar.value = true
		break
	case 'line':
		isLine.value = true
		break
	}
})

onMounted(() => {
	window.addEventListener('resize', () => {
		if (document.documentElement.clientWidth < 992) {
			labelPosition.value = 'top'
		} else {
			labelPosition.value = 'right'
		}
	})
})
</script>

<style lang="less" scoped>
.create {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 0.7rem 0.3rem 0.7rem 0;
  position: relative;
  &-main {
    overflow-y: auto;
    background-color: #fff;
    border-radius: 0.2rem;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding-bottom: 1rem;
    &-setting {
      flex: 1;
      box-sizing: border-box;
      background-color: #fff;
      padding: 0.5rem;
    }
    &::-webkit-scrollbar {
      display: none;
    }
    &-btn {
      width: 80%;
      display: flex;
      justify-content: center;
      position: absolute;
      bottom: 1rem;
      left: 50%;
      transform: translateX(-50%);
    }
  }
}
.data-list {
  &-add {
    border-radius: 0.3rem;
    width: 6rem;
    border: 2px dashed #666;
    font-size: 0.4rem;
    box-sizing: border-box;
    text-align: center;
    margin-right: 0.3rem;
    cursor: pointer;
    margin-bottom: 0.3rem;
    transition: 0.3s broder ease;
    &:hover {
      border: 2px solid #409eff;
    }
    &-icon {
      transition: 0.3s transform ease, 0.1s color ease;
      &:hover {
        transform: scale(1.2);
        color: #409eff;
      }
    }
  }
}
</style>
