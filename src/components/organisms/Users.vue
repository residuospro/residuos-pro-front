<template>
	<div class="w-full ml-8 mt-2">
		<div class="flex items-center w-full justify-between mb-8">
			<div
				class="flex justify-between items-center w-auto min-w-[43rem] space-x-5">
				<v-autocomplete
					v-model="usersSelected"
					:onUpdate:modelValue="selectUser"
					:items="users"
					chips
					density="comfortable"
					label="Buscar Usuário"></v-autocomplete>

				<h1 class="mt-7">ou</h1>

				<v-autocomplete
					v-model="departamentSelected"
					:onUpdate:modelValue="selectUserByDepartment"
					:items="departments"
					chips
					label="Buscar por departamento">
				</v-autocomplete>

				<button class="mt-7" @click="userFilterCleaning">
					Limpar pesquisa
				</button>
			</div>

			<Button
				buttonType="submit"
				class="bg-white"
				@click="openUserModal(Actions.SAVE)">
				<p class="text-v_dark_gray">Cadastrar</p>
			</Button>
		</div>

		<Container type="dataTableContainer">
			<Container type="headersContainer" class="text-white">
				<Typograph type="H3" v-for="(items, index) in headers" :key="index">
					{{ items }}
				</Typograph>

				<Typograph type="H3">Ajustar</Typograph>
			</Container>

			<div class="min-h-[28rem] bg-transparent">
				<div v-for="(items, index) in content" :key="items.id">
					<Container type="userContent" :class="index % 2 == 0 && 'bg-v_gray'">
						<h1>{{ items.name }}</h1>

						<h1>{{ items.username }}</h1>

						<div class="relative">
							<h1 class="overflow w-36">{{ items.email }}</h1>
						</div>

						<div class="relative">
							<h1 class="overflow w-[13rem]">{{ items.department }}</h1>
						</div>

						<h1>{{ items.ramal }}</h1>

						<v-menu transition="slide-y-transition">
							<template v-slot:activator="{ props }">
								<button v-bind="props">
									<mdicon name="pencil-box-outline" class="" />
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
					</Container>

					<hr className=" border-[1px] w-full" />
				</div>
			</div>
		</Container>
	</div>
</template>

<script setup lang="ts">
/* eslint-disable no-undef */
import { useHead } from "@vueuse/head"
import Container from "../atoms/Container.vue"
import Typograph from "../atoms/Typograph.vue"
import Button from "../atoms/Button.vue"
import { PropType, computed, ref } from "vue"
import { IUsers } from "@/utils/interfaces"
import { Actions } from "@/utils/enum"

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
</style>
