<template>
	<div class="w-full ml-8 mt-2">
		<div class="flex items-center w-full justify-between mb-8">
			<div
				class="flex justify-between items-center w-auto min-w-[23rem] space-x-5">
				<v-menu
					transition="slide-y-transition"
					:close-on-content-click="false"
					v-model="closeMenu">
					<template v-slot:activator="{ props }">
						<button v-bind="props" class="bg-white flex" @click="cleanFilter">
							<p
								class="text-v_dark_gray underline underline-offset-[14px] decoration-2">
								Filtros
							</p>
							<v-icon
								icon="mdi-filter-outline "
								class="text-v_dark_gray underline underline-offset-[10px]" />
						</button>
					</template>

					<v-list>
						<v-list-item>
							<div class="mb-5 px-1 py-2 space-y-4">
								<Input
									input="inputFilter"
									placeholder="Nº Pedido"
									@keyup="filterSelected.orderNumber = $event.target.value" />

								<v-autocomplete
									clearable
									density="compact"
									class="!shadow-none !mb-5"
									:on-click:clear="() => (departmentSelected = null)"
									:style="handleAutoCompleteStyle(departmentSelected)"
									v-model="filterSelected.sediment"
									:items="departments"
									chips
									label="Resíduo"></v-autocomplete>

								<v-autocomplete
									clearable
									density="compact"
									v-if="hasPermission([AuthorizationUser.ADMIN])"
									class="!shadow-none !mb-5"
									:on-click:clear="() => (departmentSelected = null)"
									:style="handleAutoCompleteStyle(departmentSelected)"
									v-model="filterSelected.department"
									:items="departments"
									chips
									label="Departamento"></v-autocomplete>

								<v-autocomplete
									clearable
									density="compact"
									class="!shadow-none"
									:on-click:clear="() => (statusSelected = null)"
									:style="handleAutoCompleteStyle(statusSelected)"
									v-model="filterSelected.status"
									:items="status"
									chips
									label="Status"></v-autocomplete>
							</div>

							<div
								class="mb-5 text-v_dark_gray bg-gray-100 py-2 text-left rounded-md mx-1">
								<p class="mb-2 opacity-75 ml-4">Selecione uma data</p>

								<input
									v-model="filterSelected.date"
									type="date"
									class="w-[95%] bg-white shadow-none px-4 font-[100] rounded-md outline-[#e1e4ed] input mx-1" />
							</div>

							<Button
								@click="closeMenu = false"
								buttonType="filterButton"
								class="bg-v_light_green text-white mb-2">
								Filtrar
							</Button>
						</v-list-item>
					</v-list>
				</v-menu>
			</div>

			<Button
				buttonType="submit"
				@click="openCollectionsModal(Actions.SAVE)"
				class="bg-white">
				<p class="text-v_dark_gray">Cadastrar</p>
			</Button>
		</div>

		<Wrapper type="dataTable">
			<table>
				<thead>
					<tr>
						<th
							v-for="(items, index) in headers"
							:key="index"
							:class="index == 0 ? 'rounded-tl-md' : ''">
							{{ items }}
						</th>

						<th type="H3" class="rounded-tr-md">Ajustar</th>
					</tr>
				</thead>

				<tbody style="height: auto">
					<tr
						v-for="(items, index) in collections.slice(0, itemsPerPage)"
						:key="items.id"
						class="font-medium">
						<td :style="setTableBackground(index)">
							{{ items.name }}
						</td>

						<td :style="setTableBackground(index)">
							{{ items.classification }}
						</td>

						<td :style="setTableBackground(index)">
							{{ items.risk }}
						</td>

						<td :style="setTableBackground(index)">
							{{ items.state }}
						</td>

						<td :style="setTableBackground(index)">
							{{ items.packaging }}
						</td>

						<td :style="setTableBackground(index)">
							<v-menu transition="slide-y-transition">
								<template v-slot:activator="{ props }">
									<button v-bind="props">
										<v-icon icon="mdi-pencil-box-outline" class="" />
									</button>
								</template>

								<v-list>
									<v-list-item>
										<button
											@click="openCollectionsModal(Actions.UPDATE, items.id)">
											Detalhes
										</button>
									</v-list-item>

									<v-list-item>
										<button @click="showDeleteModal(items.id)">Deletar</button>
									</v-list-item>
								</v-list>
							</v-menu>
						</td>
					</tr>

					<p
						class="text-v_medium_gray absolute top-[12rem] w-full text-center"
						v-if="collections.length == 0">
						Não há registros, crie o seu primeiro resíduo!
					</p>
				</tbody>
			</table>
		</Wrapper>
	</div>
</template>

<script setup lang="ts">
import { useHead } from "@vueuse/head"
import Wrapper from "../atoms/Wrapper.vue"
import Button from "../atoms/Button.vue"
import userProps from "@/context/useProps"
import { Actions, AuthorizationUser } from "@/utils/enum"
import { PropType, ref } from "vue"
import { watch } from "vue"
import { ICollectionFilter, IFilterSelected } from "@/utils/interfaces"
import { hasPermission } from "@/utils/permissions"
import Input from "@/components/atoms/Input.vue"
import { reactive } from "vue"

let filterSelected = reactive<IFilterSelected>({
	orderNumber: "",
	sediment: null,
	department: null,
	status: null,
	date: "",
})

let departmentSelected = ref()
let statusSelected = ref(null)
let closeMenu = ref(false)

watch(closeMenu, () => {
	if (!closeMenu.value) {
		filterSelected = {
			orderNumber: "",
			sediment: null,
			department: null,
			status: null,
			date: "",
		}
	}
})

const { setTableBackground, handleAutoCompleteStyle } = userProps()

const props = defineProps({
	itemsPerPage: { type: Number, required: true },

	collectionFilter: {
		type: Array as PropType<ICollectionFilter[]>,
		required: true,
	},

	headers: { type: Array as PropType<string[]>, required: true },

	handleCollectionsFilter: {
		type: Function as PropType<(filter: string[]) => void>,
		required: true,
	},

	actions: { type: Array as PropType<string[]>, required: true },

	collections: { type: Array as PropType<any[]>, required: true },

	showDeleteModal: {
		type: Function as PropType<(id?: string) => void>,
		required: true,
	},

	openCollectionsModal: {
		type: Function as PropType<(action: string, id?: string) => void>,
		required: true,
	},

	collectionsFilterCleaning: {
		type: Function as unknown as () => () => void,
		required: true,
	},

	departments: { type: Array as PropType<string[]>, required: true },

	status: { type: Array as PropType<string[]>, required: true },
})

const clearFilter = () => {
	departmentSelected.value = null
}

const cleanFilter = () => {
	console.log("oi")
}

useHead({
	title: "Resíduos Pro - Coletas",
})
</script>

<style>
.v-date-picker__title,
.v-picker-title {
	display: none;
}

.v-picker__header {
	height: 3rem !important;
}

.v-date-picker-header__content {
	font-size: 1rem !important;
}
</style>
