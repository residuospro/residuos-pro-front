<template>
	<div class="glass-effect rounded-lg mb-5">
		<div
			class="w-full rounded-t-lg bg-v_light_green px-2 py-1 flex justify-between items-center">
			<h1 class="text-white">Gráfico anual</h1>
		</div>
		<div style="position: relative; height: 90%; width: 100%; padding: 0.5rem">
			<canvas id="myChart"></canvas>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import Chart, { ChartConfiguration, ChartItem } from "chart.js/auto"
import { PropType } from "vue"
import { MonthTotals } from "@/utils/interfaces"

const props = defineProps({
	months: {
		type: Array as PropType<string[]>,
		required: true,
	},

	annualSediments: {
		type: Object as PropType<MonthTotals>,
		required: true,
	},
})

const createChart = () => {
	const ctx = document.getElementById("myChart")

	if (ctx) {
		const chartConfig: ChartConfiguration = {
			type: "line",
			data: {
				labels: props.months,
				datasets: [
					{
						label: "Sólido",
						data: props.annualSediments.solid,
						backgroundColor: ["rgba(255, 206, 86, 0.2)"],
						borderColor: ["rgba(255, 159, 64, 1)"],
						borderWidth: 1,
					},
					{
						label: "Liquido",
						data: props.annualSediments.liquid,
						backgroundColor: ["rgba(54, 162, 235, 0.2)"],
						borderColor: ["rgba(54, 162, 235, 1)"],
						borderWidth: 1,
					},
					{
						label: "Gasoso",
						data: props.annualSediments.gaseous,
						backgroundColor: ["rgba(74, 217, 137, 0.1)"],
						borderColor: ["#77ab59"],
						borderWidth: 1,
					},
				],
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,

				plugins: {
					legend: {
						labels: {
							color: "#9D9797",
						},
					},
				},
				scales: {
					y: {
						ticks: { color: "#9D9797" },
					},
					x: {
						ticks: { color: "#9D9797" },
					},
				},
			},
		}

		new Chart(ctx as ChartItem, chartConfig)
	}
}

onMounted(() => {
	setTimeout(() => {
		createChart()
	}, 1000)
})
</script>

<style scoped>
#myChart {
	width: 100% !important;
}
</style>
