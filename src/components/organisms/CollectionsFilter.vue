<template>
	<div class="flex justify-between items-center min-w-[23rem]">
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
						@click="getCollectionByFilter(filterSelected), (closeMenu = false)"
						buttonType="filterButton"
						class="bg-v_light_green text-white mb-2">
						Filtrar
					</Button>
				</v-list-item>
			</v-list>
		</v-menu>
	</div>
</template>

<script setup lang="ts">
import { AuthorizationUser } from "@/utils/enum"
import { hasPermission } from "@/utils/permissions"
import Button from "@/components/atoms/Button.vue"
import Input from "@/components/atoms/Input.vue"
import { PropType, ref, watch } from "vue"
import { IFilterSelected } from "@/utils/interfaces"
import userProps from "@/context/useProps"

const { handleAutoCompleteStyle } = userProps()

let departmentSelected = ref()
let statusSelected = ref(null)
let closeMenu = ref(false)
let disableInputOrderNumber = ref(false)
let disableInput = ref(false)
let filterSelected = ref<IFilterSelected>({
	orderNumber: "",
	sedimentName: null,
	department: null,
	status: null,
	date: "",
})

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

const disableFilterInputs = () => {
	disableInputOrderNumber.value = false
	disableInput.value = false
}

defineProps({
	getCollectionByFilter: {
		type: Function as PropType<(collectionFilter: IFilterSelected) => void>,
		required: true,
	},

	callCollectionsByPage: {
		type: Function as PropType<() => void>,
		required: true,
	},

	status: { type: Array as PropType<string[]>, required: true },

	departmentNames: { type: Array as PropType<string[]>, required: true },

	sedimentsName: { type: Array as PropType<string[]>, required: true },

	page: { type: Number, required: true },

	showClearFilterButton: { type: Boolean, required: true },
})
</script>
