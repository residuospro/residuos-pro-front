<template>
	<router-view :key="$router.currentRoute.value.path.split('/')[0]">
	</router-view>
</template>

<script setup lang="ts">
import { isAuthenticated } from "./utils/permissions"
import {
	setBearerAuthorization,
	useAuthClient,
	useClient,
} from "./clients/AxiosClient"
import { onMounted } from "vue"

const token = isAuthenticated()

if (token.length > 0) {
	setBearerAuthorization(useClient(), token)
	setBearerAuthorization(useAuthClient(), token)
}
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

.v-autocomplete--single {
	background: #fff;
	box-shadow: 0 0.3rem 0.62rem rgba(0, 0, 0, 0.4);
	border-radius: 0.375rem;
	color: #606060;
	font-weight: bold;
}
</style>
