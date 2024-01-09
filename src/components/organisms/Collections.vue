<template>
	<div class="w-full ml-8 mt-2">
		<div class="flex items-center justify-between w-full mb-8">
			<div
				class="flex justify-between items-center w-auto min-w-[23rem] space-x-5">
				<v-menu
					transition="slide-y-transition"
					:close-on-content-click="false"
					v-model="closeMenu">
					<template v-slot:activator="{ props }">
						<div class="flex space-x-8">
							<button
								v-bind="props"
								class="bg-white flex"
								@click="cleanFilter"
								id="btn">
								<p
									class="text-v_dark_gray underline underline-offset-[14px] decoration-2">
									Filtros
								</p>
								<v-icon
									icon="mdi-filter-outline "
									class="text-v_dark_gray underline underline-offset-[10px]" />
							</button>

							<Button
								buttonType="filterButton"
								@click="callCollectionsByPage"
								v-if="showClearFilterButton"
								class="bg-v_light_green text-white mb-2">
								Limpar filtro
							</Button>
						</div>
					</template>

					<v-list>
						<v-list-item>
							<div class="mb-5 px-1 py-2 space-y-4">
								<Input
									input="inputFilter"
									placeholder="Nº Pedido"
									:isDisabled="disableInputOrderNumber"
									@keyup="filterSelected.orderNumber = $event.target.value" />

								<v-autocomplete
									clearable
									:disabled="disableInput"
									density="compact"
									class="!shadow-none !mb-5"
									:on-click:clear="() => (departmentSelected = null)"
									:style="handleAutoCompleteStyle(departmentSelected)"
									v-model="filterSelected.sedimentName"
									:items="sedimentsName"
									chips
									label="Resíduo"></v-autocomplete>

								<v-autocomplete
									clearable
									density="compact"
									:disabled="disableInput"
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
									:disabled="disableInput"
									class="!shadow-none"
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
									:disabled="disableInput"
									type="date"
									class="w-[95%] bg-white shadow-none px-4 font-[100] rounded-md outline-[#e1e4ed] input mx-1" />
							</div>

							<Button
								@click="
									getCollectionByFilter(filterSelected), (closeMenu = false)
								"
								buttonType="filterButton"
								class="bg-v_light_green text-white mb-2">
								Filtrar
							</Button>
						</v-list-item>
					</v-list>
				</v-menu>
			</div>

			<Button
				v-if="!hasPermission([AuthorizationUser.ADMIN])"
				buttonType="submit"
				@click="openCollectionsModal(Actions.SAVE)"
				class="bg-white">
				<p class="text-v_dark_gray">Criar</p>
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

						<th type="H3" class="rounded-tr-md">Detalhes</th>
					</tr>
				</thead>

				<tbody style="height: auto">
					<tr
						v-for="(items, index) in collections.slice(0, itemsPerPage)"
						:key="items.id"
						class="font-medium">
						<td :style="setTableBackground(index)">
							{{ items.orderNumber }}
						</td>

						<td :style="setTableBackground(index)">
							{{ items.sedimentName }}
						</td>

						<td :style="setTableBackground(index)">
							{{ items.packaging }}
						</td>

						<td :style="setTableBackground(index)">
							{{ items.amount }}{{ items.measure }}
						</td>

						<td :style="setTableBackground(index)">
							{{ items.department }}
						</td>

						<td :style="setTableBackground(index)">
							{{ items.date?.split(",")[0] }}
						</td>

						<td :style="setTableBackground(index)" class="w-[22%]">
							<div
								v-if="validatedStatus(items.status!)"
								class="flex flex-col items-center">
								<p
									:style="{
										color: getColorByStatus(String(items.status)),
										fontWeight: 'bold',
									}">
									{{ items.status }}
								</p>

								<VueSpinnerBar
									:color="setColorSpinnerBar(String(items.status))"
									height="5"
									width="80%"
									class="mb-2" />
							</div>

							<div v-else :style="setStatusStyle(String(items.status))">
								{{ items.status }}
							</div>
						</td>

						<td :style="setTableBackground(index)">
							<button @click="$router.push(`/Painel/Detalhes/${items.id}`)">
								<v-icon icon="mdi-dots-horizontal" />
							</button>
						</td>
					</tr>

					<p
						class="text-v_medium_gray absolute top-[12rem] w-full text-center"
						v-if="collections.length == 0">
						Ops! Não há registros por aqui.
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
import {
	ICollectionData,
	ICollectionFilter,
	IFilterSelected,
} from "@/utils/interfaces"
import { hasPermission } from "@/utils/permissions"
import { VueSpinnerBar } from "vue3-spinners"
import Input from "@/components/atoms/Input.vue"

let filterSelected = ref<IFilterSelected>({
	orderNumber: "",
	sedimentName: null,
	department: null,
	status: null,
	date: "",
})
let disableInputOrderNumber = ref(false)
let disableInput = ref(false)
let departmentSelected = ref()
let statusSelected = ref(null)
let closeMenu = ref(false)

watch(closeMenu, () => {
	if (!closeMenu.value) {
		filterSelected.value = {
			orderNumber: "",
			sedimentName: null,
			department: null,
			status: null,
			date: "",
		}

		disableInputOrderNumber.value = false
		disableInput.value = false
	}
})

watch(filterSelected.value, () => {
	const { orderNumber, sedimentName, department, status, date } =
		filterSelected.value

	console.log("d", date)

	if (orderNumber != "") {
		disableInput.value = true
	} else if (sedimentName || department || status || date != "") {
		disableInputOrderNumber.value = true
	} else {
		disableInputOrderNumber.value = false
		disableInput.value = false
	}
})

const { setTableBackground, handleAutoCompleteStyle } = userProps()

defineProps({
	itemsPerPage: { type: Number, required: true },

	showClearFilterButton: { type: Boolean, required: true },

	collectionFilter: {
		type: Array as PropType<ICollectionFilter[]>,
		required: true,
	},

	headers: { type: Array as PropType<string[]>, required: true },

	handleCollectionsFilter: {
		type: Function as PropType<(filter: string[]) => void>,
		required: true,
	},

	getCollectionByFilter: {
		type: Function as PropType<(collectionFilter: IFilterSelected) => void>,
		required: true,
	},

	actions: { type: Array as PropType<string[]>, required: true },

	collections: {
		type: Array as PropType<Partial<ICollectionData>[]>,
		required: true,
	},

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

	callCollectionsByPage: {
		type: Function as PropType<() => void>,
		required: true,
	},

	departments: { type: Array as PropType<string[]>, required: true },

	sedimentsName: { type: Array as PropType<string[]>, required: true },

	status: { type: Array as PropType<string[]>, required: true },

	setStatusStyle: {
		type: Function as PropType<(status: string) => any>,
		required: true,
	},

	getColorByStatus: {
		type: Function as PropType<(status: string) => any>,
		required: true,
	},

	validatedStatus: {
		type: Function as PropType<(status: string) => any>,
		required: true,
	},

	setColorSpinnerBar: {
		type: Function as PropType<(status: string) => any>,
		required: true,
	},
})

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
