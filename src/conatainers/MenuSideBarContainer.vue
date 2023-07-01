<template>
	<MenuSideBar
		:id-btn="idBtn"
		:logout="logout"
		:set-id-btn="setIdBtn"
		:menu-icons="menuIcons" />
</template>

<script setup lang="ts">
import MenuSideBar from "@/components/molecules/MenuSideBar.vue"
import { watchEffect, ref } from "vue"
import { removeItems } from "@/utils/permissions"
import { AuthorizationUser } from "@/utils/enum"
import router from "@/router"

const menuIcons = [
	{
		id: "recycle",
		icon: "recycle",
		path: "/Painel/Coletas",
		label: "Coletas",
		permissions: [
			AuthorizationUser.ADMIN,
			AuthorizationUser.MANAGER,
			AuthorizationUser.COLLABORATOR,
		],
	},
	{
		id: "dash",
		icon: "tablet-dashboard",
		path: "/Painel/Dashboard",
		label: "Dashboard",
		permissions: [AuthorizationUser.ADMIN, AuthorizationUser.MANAGER],
	},
	{
		id: "user",
		icon: "account",
		path: "/Painel/Usuarios",
		label: "Usuários",
		permissions: [AuthorizationUser.ADMIN, AuthorizationUser.MANAGER],
	},
	{
		id: "departments",
		icon: "office-building",
		path: "/Painel/Departamentos",
		label: "Departamentos",
		permissions: [AuthorizationUser.ADMIN],
	},
	{
		id: "config",
		icon: "cog-outline",
		path: "/Painel/Configurações",
		label: "Configurações",
		permissions: [
			AuthorizationUser.ADMIN,
			AuthorizationUser.MANAGER,
			AuthorizationUser.COLLABORATOR,
		],
	},
	{
		id: "sediments",
		icon: "delete-variant",
		path: "/Painel/Residuos",
		label: "Resíduos",
		permissions: [AuthorizationUser.MANAGER],
	},
]

let idBtn = ref("")

const setIdBtn = (id: string) => {
	idBtn.value = id
}

const logout = () => {
	router.push({ path: "/" })
	removeItems()
}

watchEffect(() => {
	idBtn.value = router.currentRoute.value.path
})
</script>
