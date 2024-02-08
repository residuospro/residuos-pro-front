<template>
	<thead>
		<tr>
			<th
				v-for="(items, index) in headers"
				:key="index"
				:class="index == 0 ? 'rounded-tl-md' : ''">
				{{ items }}
			</th>

			<th type="H3" class="rounded-tr-md">{{ action }}</th>
		</tr>
	</thead>
</template>

<script setup lang="ts">
import { PropType } from "vue"

defineProps({
	headers: { type: Array as PropType<string[]>, required: true },

	action: { type: String, required: true },
})
</script>

<style scoped>
th {
	background-color: #77ab59;
	color: #fff;
	height: 3rem;
	text-align: start;
	padding: 0 2em;
}
</style>
