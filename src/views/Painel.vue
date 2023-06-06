<template>
	<Container container="painelContainer">
		<MenuSideBarContainer />
		<div class="rounded-br-[50rem] bg-v_white_two w-[90%] ml-4 px-5 py-5">
			<router-view :key="$router.currentRoute.value.path"></router-view>
		</div>
	</Container>
</template>

<script setup lang="ts">
import Container from "@/components/atoms/Container.vue"
import MenuSideBarContainer from "@/conatainers/MenuSideBarContainer.vue"
import { useHead } from "@vueuse/head"
import router from "@/router"
import { onMounted, watchEffect } from "vue"
import { ref } from "vue"
import { AuthorizationUser } from "@/utils/enum"
import { getPermission } from "@/utils/permissions"

let currentRoute = ref("")

watchEffect(() => {
	currentRoute.value = router.currentRoute.value.path.split("/")[2]
})

useHead({
	title: `Resíduos Pro - ${currentRoute.value}`,
})

onMounted(() => {
	router.push({
		name: "Coletas",
	})
})
</script>
