<template>
	<Container type="itemsPerPageContainer">
		<Typograph type="H2">Itens por página</Typograph>
		<ItemsPerPage v-model="perPage" @click="getPerPage">
			<option v-for="(item, index) in items" :value="item" :key="index">
				{{ item }}
			</option>
		</ItemsPerPage>
	</Container>
</template>
<script setup lang="ts">
import Typograph from "../atoms/Typograph.vue"
import Container from "../atoms/Container.vue"
import { ref } from "vue"

const items: any[] = [10, 25, 50, 75, 100]
const perPage = ref(10)
const emit = defineEmits(["getPerPage", "commissions"])

const getPerPage = () => {
	emit("getPerPage", perPage.value, "itemsPerPage")
}
</script>
