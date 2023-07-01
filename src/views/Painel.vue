<template>
	<Container type="painelContainer">
		<MenuSideBarContainer />
		<div class="rounded-br-[50rem] bg-white w-[89%] ml-4 px-5 py-5 h-full">
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
import { setDepartment } from "@/store/setDepartment"

import { getPayload } from "../api/signin"

const userIdStore = setUserId()
const idCompanyStore = setIdCompany()
const idDepartmentStore = setDepartment()

const getUserInfo = async () => {
	const payload = await getPayload()
	console.log(payload)

	userIdStore.setUserId(payload.data.userId)
	idCompanyStore.setIdCompany(payload.data.company)

	if (payload.data.idDepartment) {
		const config = {
			name: payload.data.department,
			ramal: payload.data.ramal,
			id: payload.data.idDepartment,
		}

		idDepartmentStore.setIdDepartment(config)
	}
}

onMounted(() => {
	getUserInfo()

	router.push({
		name: "Coletas",
	})
})
</script>
