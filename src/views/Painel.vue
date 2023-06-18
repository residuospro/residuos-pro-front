<template>
	<Container type="painelContainer">
		<MenuSideBarContainer />
		<div
			class="rounded-br-[50rem] bg-v_white_two w-[89%] ml-4 px-5 py-5 h-full">
			<router-view :key="$router.currentRoute.value.path"></router-view>
		</div>
	</Container>
</template>

<script setup lang="ts">
import Container from "@/components/atoms/Container.vue"
import MenuSideBarContainer from "@/conatainers/MenuSideBarContainer.vue"
import { getPayload } from "@/api/signin"
import { setCompany } from "@/store/setCompany"
import router from "@/router"
import { onMounted } from "vue"

const store = setCompany()

const setIdCompany = async () => {
	const payload = await getPayload()

	if (payload?.status == 200) {
		store.setCompany(payload.data.company)
	}
}

onMounted(() => {
	setIdCompany()

	router.push({
		name: "Coletas",
	})
})
</script>
