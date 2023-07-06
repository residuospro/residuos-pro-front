<template>
	<Container type="paginationContainer">
		<button @click="previous" :disabled="maxPage === 0 ? true : false">
			<v-icon icon="mdi-chevron-left" :size="45" class="text-v_dark_gray" />
		</button>

		<Button
			buttonType="paginationButton"
			class="bg-[#ccc] text-black"
			@click="less"
			:disabled="page < 5 ? true : false">
			<v-icon icon="mdi-dots-horizontal" :size="20" />
		</Button>

		<div id="divBtn" class="flex items-center">
			<Button
				buttonType="paginationButton"
				v-for="(_, index) in items.slice(0, perPage)"
				:id="String(index + start)"
				:style="
					id === Number(index) + start
						? 'background: #77ab59; color: #fff'
						: 'background: #fff; color: #9d9797'
				"
				:key="index"
				:disabled="Number(index) + start > maxPage ? true : false"
				:class="
					Number(index) + start > maxPage ? 'hidden' : 'ml-4 active:scale-90'
				"
				@click="count(Number(index) + start)"
				>{{ index + start }}</Button
			>
		</div>

		<Button
			buttonType="paginationButton"
			class="ml-3 bg-[#ccc] text-black"
			@click="plus"
			:disabled="maxPage === 0 ? true : false">
			<v-icon icon="mdi-dots-horizontal" :size="20" />
		</Button>

		<button @click="next" :disabled="maxPage === 0 ? true : false">
			<v-icon icon="mdi-chevron-right" :size="45" class="text-v_dark_gray" />
		</button>
	</Container>
</template>

<script lang="ts" setup>
import { watchEffect, computed, ref, PropType } from "vue"
import Container from "../atoms/Container.vue"
import Button from "../atoms/Button.vue"

let props = defineProps({
	pageCount: { type: Number, required: true },
	items: { type: Array as PropType<number[]>, required: true },
})

let page = ref(1)
let id = ref(0)
let perPage = ref(4)
let start = ref(1)
const emit = defineEmits(["paginate"])

const count = (value: number) => {
	id.value = value
	page.value = value
	emit("paginate", page.value, "pagination")
}

const next = () => {
	const dviBtn = document.getElementById("divBtn")
	let btn = Number(dviBtn?.lastElementChild?.getAttribute("id"))

	if (page.value < maxPage.value) {
		page.value++
		emit("paginate", page.value, "pagination")
		id = page
	}

	if (page.value > btn) {
		start.value++
	}
}

let maxPage = computed(() => {
	return props.pageCount
})

const previous = () => {
	const dviBtn = document.getElementById("divBtn")
	let btn = Number(dviBtn?.firstElementChild?.getAttribute("id"))

	if (page.value > 1) {
		page.value--
		emit("paginate", page.value, "pagination")
		id = page

		if (page.value < btn) {
			start.value--
		}
	}
}

const plus = () => {
	const dviBtn = document.getElementById("divBtn")
	const firstBtn = String(dviBtn?.firstElementChild?.getAttribute("id"))

	const increment = start.value + 4

	if (increment > maxPage.value) {
		start.value = maxPage.value
		page.value = maxPage.value
		id.value = maxPage.value
	} else if (increment === maxPage.value) {
		page.value = increment
		id.value = increment
	} else {
		start.value += 4
		page.value = Number(firstBtn) + 4
		id = page
	}
}

const less = () => {
	const dviBtn = document.getElementById("divBtn")
	const firstBtn = Number(dviBtn?.firstElementChild?.getAttribute("id"))

	if (page.value >= 5) {
		start.value -= 4
		page.value = Number(firstBtn) - 4
		id = page

		if (start.value <= 0 && page.value <= 0) {
			start.value = 1
			page.value = 1
		}
	}
}

watchEffect(() => {
	id = page
})
</script>
