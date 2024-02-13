import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router"
import Login from "@/containers/LoginContainer.vue"
import Painel from "../views/Painel.vue"
import Collections from "@/containers/ColletionsContainer.vue"
import Users from "@/containers/UsersContainer.vue"
import Departments from "@/containers/DepartmentsContainer.vue"
import Dashboard from "@/containers/DashboardContainer.vue"
import Settings from "@/components/organisms/Settings.vue"
import Sediments from "@/containers/SedimentsContainer.vue"
import { AuthorizationUser } from "@/utils/enum"
import { setBearerAuthorization, useClient } from "@/clients/AxiosClient"
import { hasPermission, isAuthenticated } from "@/utils/permissions"
import Details from "@/containers/DetailsContainer.vue"

const routes: Array<RouteRecordRaw> = [
	{
		path: "/",
		name: "Login",
		component: Login,
	},
	{
		path: "/Painel",
		name: "Painel",
		component: Painel,
		meta: {
			protected: true,
			permissions: [
				AuthorizationUser.ADMIN,
				AuthorizationUser.MANAGER,
				AuthorizationUser.COLLABORATOR,
			],
		},
		children: [
			{
				path: "Coletas",
				name: "Coletas",
				component: Collections,
				beforeEnter: (to, from) => {
					if (from.path == "/") return ""
				},
				meta: {
					protected: true,
					permissions: [
						AuthorizationUser.ADMIN,
						AuthorizationUser.MANAGER,
						AuthorizationUser.COLLABORATOR,
					],
				},
			},
			{
				path: "Configurações",
				name: "Configurações",
				component: Settings,
				meta: {
					protected: true,
					permissions: [
						AuthorizationUser.ADMIN,
						AuthorizationUser.MANAGER,
						AuthorizationUser.COLLABORATOR,
					],
				},
			},
			{
				path: "Departamentos",
				name: "Departamentos",
				component: Departments,
				beforeEnter: (to, from) => {
					if (from.path == "/") return ""
				},
				meta: {
					protected: true,
					permissions: [AuthorizationUser.ADMIN],
				},
			},
			{
				path: "Usuarios",
				name: "Usuarios",
				component: Users,
				beforeEnter: (to, from) => {
					if (from.path == "/") return ""
				},
				meta: {
					protected: true,
					permissions: [AuthorizationUser.ADMIN, AuthorizationUser.MANAGER],
				},
			},
			{
				path: "Dashboard",
				name: "Dashboard",
				component: Dashboard,
				meta: {
					protected: true,
					permissions: [AuthorizationUser.ADMIN, AuthorizationUser.MANAGER],
				},
			},
			{
				path: "Residuos",
				name: "Residuos",
				component: Sediments,
				beforeEnter: (to, from) => {
					if (from.path == "/") return ""
				},
				meta: {
					protected: true,
					permissions: [AuthorizationUser.MANAGER],
				},
			},
			{
				path: "Detalhes/:id",
				name: "Detalhes",
				component: Details,
				beforeEnter: (to, from) => {
					if (from.path == "/") return ""
				},
				meta: {
					protected: true,
					permissions: [
						AuthorizationUser.ADMIN,
						AuthorizationUser.MANAGER,
						AuthorizationUser.COLLABORATOR,
					],
				},
			},
		],
	},
]

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
})

router.beforeEach(async (to, from, next) => {
	const token = isAuthenticated()
	if (token.length > 0) {
		setBearerAuthorization(useClient(), token)
		if (to.path == "/") {
			router.push("/Painel")
		}
	}
	const permissions = to.meta.permissions as string[]

	if (to.meta.protected) {
		if (!hasPermission(permissions)) {
			return next({ name: "Login" })
		}
	}
	return next()
})

export default router
