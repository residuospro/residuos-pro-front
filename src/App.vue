<template>
	<router-view
		:key="$router.currentRoute.value.path.split('/')[0]"></router-view>
</template>

<script setup lang="ts">
import { setCompany } from "@/store/setCompany"
import { getPayload } from "@/api/signin"
import { isAuthenticated } from "./utils/permissions"
import { setBearerAuthorization, useClient } from "./clients/AxiosClient"
const store = setCompany()

const token = isAuthenticated()

if (token.length > 0) {
	setBearerAuthorization(useClient(), token)
}

const setIdCompany = async () => {
	const payload = await getPayload()

	if (payload?.status == 200) {
		store.setCompany(payload.data.company)
	}
}

setIdCompany()
</script>

<style>
::-webkit-scrollbar {
	height: 0.5rem;
	width: 0.25rem;
	background-color: #e7e7e7;
}

::-webkit-scrollbar-thumb {
	background-color: #77ab59;
}
</style>
