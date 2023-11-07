<template>
	<Container type="itemsPerPageContainer">
		<Typograph type="H3" class="text-black">Exibir mais</Typograph>

		<Select type="itemsPerPage" v-model="perPage" @click="getPerPage">
			<option v-for="(item, index) in items" :value="item" :key="index">
				{{ item }}
			</option>
		</Select>
	</Container>
</template>
<script setup lang="ts">
import Typograph from "../atoms/Typograph.vue"
import Container from "../atoms/Container.vue"
import Select from "../atoms/Select.vue"
import { ref } from "vue"

const items: any[] = [10, 25, 50, 75, 100]
const perPage = ref(10)
const emit = defineEmits(["setItemsPerPage"])

const getPerPage = () => {
	emit("setItemsPerPage", perPage.value)
}
</script>
