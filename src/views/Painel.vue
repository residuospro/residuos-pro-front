<template>
	<Container type="painelContainer">
		<MenuSideBarContainer />
		<div class="rounded-br-[50rem] bg-white w-[95%] ml-4 px-5 py-5 h-full">
			<router-view :key="$router.currentRoute.value.path"></router-view>
		</div>
	</Container>

	<Notification />
</template>

<script setup lang="ts">
import Container from "@/components/atoms/Container.vue"
import Notification from "@/components/molecules/Notification.vue"
import MenuSideBarContainer from "@/conatainers/MenuSideBarContainer.vue"
import router from "@/router"
import { onMounted } from "vue"
import { userStore } from "../store/userStore"
import { companyStore } from "@/store/companyStore"
import { departmentStore } from "@/store/departmentStore"
import { getPayload } from "../api/signin"

const userIdStore = userStore()
const idCompanyStore = companyStore()
const idDepartmentStore = departmentStore()

const getUserInfo = async () => {
	const payload = await getPayload()

	userIdStore.setUserId(payload.data.userId)
	idCompanyStore.setIdCompany(payload.data.idCompany)

	if (payload.data.idDepartment) {
		const config = {
			name: payload.data.department,
			ramal: payload.data.ramal,
			id: payload.data.idDepartment,
			responsible: payload.data.name,
			email: payload.data.email,
			idCompany: payload.data.idCompany,
		}

		idDepartmentStore.setDepartment(config)
	}
}

onMounted(async () => {
	await getUserInfo()

	router.push({
		name: "Coletas",
	})
})
</script>
