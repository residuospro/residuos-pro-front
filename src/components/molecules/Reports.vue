<template>
	<div
		class="flex justify-between items-center w-auto min-w-[23rem] space-x-5 mb-8">
		<v-menu
			transition="slide-y-transition"
			:close-on-content-click="false"
			v-model="closeMenu">
			<template v-slot:activator="{ props }">
				<div class="flex space-x-8">
					<button
						v-bind="props"
						class="bg-white flex"
						@click="disableFilterInputs"
						id="btn">
						<p
							class="text-v_dark_gray underline underline-offset-[14px] decoration-2">
							Relatórios
						</p>
						<v-icon
							icon="mdi-chart-arc"
							class="text-v_dark_gray underline underline-offset-[11px]" />
					</button>
				</div>
			</template>

			<v-list>
				<v-list-item>
					<div class="mb-5 px-1 py-2 space-y-4">
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
						<p class="mb-2 opacity-75 ml-4">Data inicial</p>

						<input
							v-model="filterSelected.initialDate"
							:disabled="disableInput"
							type="date"
							class="w-[95%] bg-white shadow-none px-4 font-[100] rounded-md outline-[#e1e4ed] input mx-1" />
					</div>

					<div
						class="mb-5 text-v_dark_gray bg-gray-100 py-2 text-left rounded-md mx-1">
						<p class="mb-2 opacity-75 ml-4">Data final</p>

						<input
							v-model="filterSelected.finalDate"
							:disabled="disableInput"
							type="date"
							class="w-[95%] bg-white shadow-none px-4 font-[100] rounded-md outline-[#e1e4ed] input mx-1" />
					</div>

					<Button
						@click="closeMenu = false"
						buttonType="filterButton"
						class="bg-v_light_green text-white mb-2">
						Gerar relatório
					</Button>
				</v-list-item>
			</v-list>
		</v-menu>
	</div>
</template>

<script setup lang="ts">
import { IReports } from "@/utils/interfaces"
import { PropType, ref, watch } from "vue"
import userProps from "@/context/useProps"
import { hasPermission } from "@/utils/permissions"
import { Status, AuthorizationUser } from "@/utils/enum"
import Button from "../atoms/Button.vue"
import Input from "@/components/atoms/Input.vue"

let closeMenu = ref(false)
let disableInputOrderNumber = ref(false)
let disableInput = ref(false)
let departmentSelected = ref()
let statusSelected = ref(null)
let filterSelected = ref<IReports>({
	sedimentName: null,
	department: null,
	status: null,
	initialDate: "",
	finalDate: "",
})
let status = ref<string[]>([Status.FINISHED, Status.REFUSED])

watch(closeMenu, () => {
	if (!closeMenu.value) {
		filterSelected.value.department = null
		filterSelected.value.sedimentName = null
		filterSelected.value.status = null
		filterSelected.value.initialDate = ""
		filterSelected.value.finalDate = ""
	}
})

const { handleAutoCompleteStyle } = userProps()

const disableFilterInputs = () => {
	disableInputOrderNumber.value = false
	disableInput.value = false
}

defineProps({
	departmentNames: { type: Array as PropType<string[]>, required: true },

	sedimentsName: { type: Array as PropType<string[]>, required: true },
})
</script>
