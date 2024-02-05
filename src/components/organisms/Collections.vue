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
								v-if="page == 1"
								v-bind="props"
								class="bg-white flex"
								@click="disableFilterInputs"
								id="btn">
								<p
									class="text-v_dark_gray underline underline-offset-[14px] decoration-2">
									Filtros
								</p>
								<v-icon
									icon="mdi-filter-outline "
									class="text-v_dark_gray underline underline-offset-[11px]" />
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
									:style="handleAutoCompleteStyle(departmentSelected)"
									v-model="filterSelected.department"
									:items="departmentNames"
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
						v-for="(items, index) in collections"
						:key="items.id"
						class="font-medium">
						<td :style="setTableBackground(index)">
							{{ items.orderNumber }}
						</td>

						<td :style="setTableBackground(index)">
							<div
								v-if="validatedStatus(items.status!)"
								class="flex flex-col items-center">
								<Vue3Lottie
									v-if="items.status == Status.WENT_OUT_FOR_COLLECTION"
									:animationData="collect"
									:height="50"
									:width="50"
									class="-mb-4" />

								<Vue3Lottie
									v-if="items.status == Status.AWAITING_COLLECTION"
									:animationData="awating_collection"
									:height="100"
									:width="150"
									class="-mb-10 -mt-6" />

								<VueSpinnerBar
									v-if="items.status == Status.WAITING_FOR_APPROVAL"
									:color="setColorSpinnerBar(String(items.status))"
									height="5"
									width="40%"
									class="mt-3" />

								<p
									:style="{
										color: getColorByStatus(String(items.status)),
										fontWeight: 'bold',
									}">
									{{ items.status }}
								</p>
							</div>

							<div v-else class="flex flex-col items-center">
								<div :style="setStatusStyle(String(items.status))">
									{{ items.status }}
								</div>
							</div>
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
import { Actions, AuthorizationUser, Status } from "@/utils/enum"
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
import { Vue3Lottie } from "vue3-lottie"
import collect from "../../assets/collect.json"
import awating_collection from "../../assets/ac.json"

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
		filterSelected.value.department = null
		filterSelected.value.sedimentName = null
		filterSelected.value.status = null
		filterSelected.value.date = ""
		filterSelected.value.orderNumber = ""
	}
})

watch(filterSelected.value, () => {
	const { orderNumber, sedimentName, department, status, date } =
		filterSelected.value

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

	page: { type: Number, required: true },

	showClearFilterButton: { type: Boolean, required: true },

	collectionFilter: {
		type: Array as PropType<ICollectionFilter[]>,
		required: true,
	},

	headers: { type: Array as PropType<string[]>, required: true },

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

	callCollectionsByPage: {
		type: Function as PropType<() => void>,
		required: true,
	},

	departmentNames: { type: Array as PropType<string[]>, required: true },

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

const disableFilterInputs = () => {
	disableInputOrderNumber.value = false
	disableInput.value = false
}

useHead({
	title: "Resíduos Pro - Coletas",
})
</script>

<style scoped>
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

table {
	border-collapse: collapse;
	width: 100%;
}

th,
td {
	text-align: center;
	padding: 0 0.5rem;
}

th {
	background-color: #77ab59;
	color: #fff;
	height: 3rem;
}

tbody td {
	line-height: 3;
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

.glass-effect {
	background: rgba(255, 255, 255, 0.1);
	box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5);
	backdrop-filter: blur(2px);
	-webkit-backdrop-filter: blur(13.5px);
	border: 1px solid rgba(255, 255, 255, 0.18);
}
</style>
