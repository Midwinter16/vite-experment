<template>
  <div id="charts" class="charts-adapt">
    <div id="charts-main"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { onMounted, defineProps } from 'vue'

type Props = {
  data: any;
};

const props = defineProps<Props>()

const initSeries = (data: []) => {
	let temp = JSON.parse(JSON.stringify(data))
	console.log(temp)
	// 限制最大长度为x轴标签个数
	let xlabel = props.data.xlabel.split(',')
	let maxlen = xlabel.length
	// 开启类别筛选
	let isFilter = temp.filters.includes('类别筛选')
	let filter = isFilter
		? temp.series.map((ele: any) => {
			return ele.name
		})
		: []
	let tooltip = {
		trigger: temp.tooltips.includes('y轴辅助线') ? 'axis' : 'none',
		axisPointer: {
			type: 'cross',
		},
	}
	if (!temp.tooltips.includes('x轴辅助线'))
		Reflect.deleteProperty(tooltip, 'axisPointer')
	return {
		title: {
			text: '预览图',
			x: 'center',
			y: 'bottom',
			textStyle: {
				fontSize: 16,
			},
		},
		tooltip,
		xAxis: {
			data: xlabel,
			boundaryGap: temp.boundaryGap,
		},
		yAxis: {},
		series: temp.series.map((ele: any) => {
			return {
				data: ele.data.split(',').splice(0, maxlen),
				name: ele.name,
				type: temp.chartType,
				smooth: temp.smooth ? 0.6 : 0,
				showSymbol: temp.circle ? true : false,
				markPoint: temp.tooltips.includes('双极值')
					? {
						data: [
							{ type: 'max', name: 'Max' },
							{ type: 'min', name: 'Min' },
						],
					}
					: {},
				markLine: temp.tooltips.includes('平均值')
					? {
						data: [{ type: 'average', name: 'Avg' }],
					}
					: {},
			}
		}),
		legend: {
			data: filter,
		},
	}
}

const initCharts = (options: any) => {
	const mycharts = echarts.init(
    document.querySelector('#charts-main') as HTMLDivElement
	)
	console.log(options)
	mycharts.setOption(options)
}
onMounted(() => {
	const options = initSeries(props.data) // 传过来的数据先处理
	initCharts(options)
})
</script>

<style lang="less" scoped>
#charts {
  height: 50%;
  background-color: #fff;
  &-main {
    width: 100%;
    height: 100%;
  }
}
.charts-adapt {
  width: 50%;
  float: right;
  position: sticky;
  top: 0rem;
  z-index: 999;
}
</style>
