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
		icon: "mdi-recycle",
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
		icon: "mdi-tablet-dashboard",
		path: "/Painel/Dashboard",
		label: "Dashboard",
		permissions: [AuthorizationUser.ADMIN, AuthorizationUser.MANAGER],
	},
	{
		id: "user",
		icon: "mdi-account",
		path: "/Painel/Usuarios",
		label: "Usuários",
		permissions: [AuthorizationUser.ADMIN, AuthorizationUser.MANAGER],
	},
	{
		id: "departments",
		icon: "mdi-office-building",
		path: "/Painel/Departamentos",
		label: "Departamentos",
		permissions: [AuthorizationUser.ADMIN],
	},
	{
		id: "sediments",
		icon: "mdi-delete-variant",
		path: "/Painel/Residuos",
		label: "Resíduos",
		permissions: [AuthorizationUser.MANAGER],
	},
	{
		id: "config",
		icon: "mdi-cog-outline",
		path: "/Painel/Configurações",
		label: "Configurações",
		permissions: [
			AuthorizationUser.ADMIN,
			AuthorizationUser.MANAGER,
			AuthorizationUser.COLLABORATOR,
		],
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
