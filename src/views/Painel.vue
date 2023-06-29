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
import router from "@/router"
import { onMounted } from "vue"
import { setUserId } from "../store/setUserId"
import { setIdCompany } from "@/store/setIdCompany"

import { getPayload } from "../api/signin"

const userIdStore = setUserId()
const idCompanyStore = setIdCompany()

const getUserId = async () => {
	const payload = await getPayload()

	userIdStore.setUserId(payload.data.userId)
	idCompanyStore.setIdCompany(payload.data.company)
}

onMounted(() => {
	getUserId()

	router.push({
		name: "Coletas",
	})
})
</script>
