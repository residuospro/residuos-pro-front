<template>
	<Container type="painelContainer">
		<MenuSideBarContainer />
		<div class="rounded-br-[50rem] bg-white w-[95%] ml-4 px-5 py-5 h-full">
			<NotificationModal
				:title="title"
				:subTitle="subTitle"
				@closeModal="showNotificationModal = false"
				v-if="showNotificationModal" />

			<router-view :key="$router.currentRoute.value.path"></router-view>
		</div>
	</Container>

	<Notification />
</template>

<script setup lang="ts">
import Container from "@/components/atoms/Container.vue"
import Notification from "@/components/molecules/Notification.vue"
import NotificationModal from "@/components/molecules/NotificationModal.vue"
import MenuSideBarContainer from "@/containers/MenuSideBarContainer.vue"
import router from "@/router"
import { onMounted, ref } from "vue"
import { getPayload } from "../api/signin"
import { hasPermission } from "@/utils/permissions"
import { AuthorizationUser } from "@/utils/enum"
import { stores } from "@/store"

const { user_store, company_store, department_store } = stores()

let title = ref("Bem vindo")
let subTitle = ref(
	"A partir de agora você pode utilizar todas as funcionalidades"
)

let showNotificationModal = ref(false)

const getUserInfo = async () => {
	const payload = await getPayload()

	user_store.setUserId(payload.data.userId)

	user_store.setUser({
		name: payload.data.name,
		email: payload.data.email,
		ramal: payload.data.ramal,
		userId: payload.data.userId,
		department: payload.data.department,
	})

	company_store.setIdCompany(payload.data.idCompany)

	if (payload.data.idDepartment) {
		const config = {
			name: payload.data.department,
			ramal: payload.data.ramal,
			id: payload.data.idDepartment,
			idCompany: payload.data.idCompany,
		}

		department_store.setDepartment(config)
	}
}

onMounted(async () => {
	await getUserInfo()

	if (hasPermission([AuthorizationUser.ADMIN]))
		showNotificationModal.value = true

	router.push({
		name: "Coletas",
	})
})
</script>
