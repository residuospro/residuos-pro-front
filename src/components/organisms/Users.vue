<template>
	<div class="w-full ml-8 mt-2">
		<div class="flex items-center w-full justify-between mb-8">
			<div
				class="flex justify-between items-center space-x-5"
				:style="
					hasPermission([AuthorizationUser.ADMIN])
						? 'width: 43rem'
						: 'width: 25rem'
				">
				<v-autocomplete
					v-model="usersSelected"
					clearable
					:on-click:clear="userFilterCleaning"
					:onUpdate:modelValue="selectUser"
					:items="users"
					chips
					density="comfortable"
					label="Buscar Usuário"></v-autocomplete>

				<h1 class="mt-7" v-if="hasPermission([AuthorizationUser.ADMIN])">ou</h1>

				<v-autocomplete
					v-if="hasPermission([AuthorizationUser.ADMIN])"
					clearable
					:on-click:clear="userFilterCleaning"
					v-model="departamentSelected"
					:onUpdate:modelValue="selectUserByDepartment"
					:items="departments"
					chips
					label="Buscar por departamento">
				</v-autocomplete>
			</div>

			<Button
				buttonType="submit"
				class="bg-white"
				@click="openUserModal(Actions.SAVE)">
				<p class="text-v_dark_gray">Cadastrar</p>
			</Button>
		</div>

		<div class="glass-effect rounded-md min-h-[30rem]">
			<table>
				<thead>
					<tr>
						<th v-for="(items, index) in headers" :key="index">
							{{ items }}
						</th>

						<th type="H3">Ajustar</th>
					</tr>
				</thead>

				<tbody style="height: auto">
					<tr
						v-for="(items, index) in content"
						:key="items.id"
						class="font-medium">
						<td :class="setTableBackground(index)">
							{{ items.name }}
						</td>

						<td
							v-if="items.username == undefined"
							:class="setTableBackground(index)">
							---
						</td>

						<td v-else :class="setTableBackground(index)">
							{{ items.username }}
						</td>

						<td :class="setTableBackground(index)">
							{{ items.email }}
						</td>

						<td :class="setTableBackground(index)">
							{{ items.department }}
						</td>

						<td :class="setTableBackground(index)">
							{{ items.ramal }}
						</td>

						<td :class="setTableBackground(index)">
							<v-menu transition="slide-y-transition">
								<template v-slot:activator="{ props }">
									<button v-bind="props">
										<v-icon icon="mdi-pencil-box-outline" class="" />
									</button>
								</template>

								<v-list>
									<v-list-item>
										<button @click="openUserModal(Actions.UPDATE, items.id)">
											Atualizar
										</button>
									</v-list-item>

									<v-list-item>
										<button @click="showDeleteModal(items.id)">Deletar</button>
									</v-list-item>
								</v-list>
							</v-menu>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script setup lang="ts">
/* eslint-disable no-undef */
import { useHead } from "@vueuse/head"
import Button from "../atoms/Button.vue"
import { PropType, computed, ref, onMounted } from "vue"
import { IUsers } from "@/utils/interfaces"
import { Actions } from "@/utils/enum"
import { hasPermission } from "@/utils/permissions"
import { AuthorizationUser } from "@/utils/enum"

let usersSelected = ref()
let departamentSelected = ref()

let props = defineProps({
	headers: { type: Array as PropType<string[]>, required: true },

	users: { type: Array as PropType<string[]>, required: true },

	departments: { type: Array as PropType<any[]>, required: true },

	actions: { type: Array as PropType<string[]>, required: true },

	content: { type: Array as PropType<IUsers[]>, required: true },

	selectUserByDepartment: {
		type: Function as PropType<(department: string) => void>,
		required: true,
	},

	selectUser: {
		type: Function as PropType<(user: string) => void>,
		required: true,
	},

	setTableBackground: {
		type: Function as PropType<(index: number) => string>,
		required: true,
	},

	showDeleteModal: {
		type: Function as PropType<(id: string | undefined) => void>,
		required: true,
	},
	openUserModal: {
		type: Function as PropType<(action: string, id?: string) => void>,
		required: true,
	},

	userFilterCleaning: {
		type: Function as unknown as () => () => void,
		required: true,
	},
})

const autocompleteHeight = computed(() => {
	let height = "3rem"

	if (departamentSelected.value || usersSelected.value) height = "3.8rem"

	return height
})

const selectUserByDepartment = (department: string) => {
	props.selectUserByDepartment(department)
	usersSelected.value = null
}

const selectUser = (username: string) => {
	props.selectUser(username)
	departamentSelected.value = null
}

const userFilterCleaning = () => {
	props.userFilterCleaning()
	usersSelected.value = null
	departamentSelected.value = null
}

useHead({
	title: "Resíduos Pro - Usuários",
})
</script>

<style>
table {
	border-collapse: collapse;
	border-top-right-radius: 8rem;
	width: 100%;
}

th,
td {
	text-align: left;
	padding: 0 2rem;
}

th {
	background-color: #77ab59;
	color: #fff;
	height: 3rem;
}

tbody td {
	line-height: 3;
}

tr:first-child {
	border-bottom-left-radius: 1.5rem;
}

.overflow {
	overflow: hidden;
	-ms-text-overflow: ellipsis;
	text-overflow: ellipsis;
	white-space: nowrap;
	padding: 0.3rem;
}

.overflow:hover {
	position: absolute;
	background: #fff;
	height: 2rem;
	margin-top: -1rem;
	box-shadow: 0 0.3rem 0.62rem rgba(0, 0, 0, 0.4);
	border-radius: 0.25rem;
	color: #000;
	width: auto;
	z-index: 10;
}

.v-autocomplete--single {
	background: #fff;
	box-shadow: 0 0.3rem 0.62rem rgba(0, 0, 0, 0.4);
	border-radius: 0.375rem;
	height: v-bind(autocompleteHeight);
	color: #606060;
	font-weight: bold;
}

.glass-effect {
	background: rgba(255, 255, 255, 0.1);
	box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5);
	backdrop-filter: blur(2px);
	-webkit-backdrop-filter: blur(13.5px);
	border: 1px solid rgba(255, 255, 255, 0.18);
}
</style>
