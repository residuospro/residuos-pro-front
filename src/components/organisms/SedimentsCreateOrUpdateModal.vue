<template>
	<form @submit.prevent="createOrUpdateSediments(sediment, typeAction)">
		<Typograph type="H2" class="text-v_medium_gray">
			{{ typeAction }} resíduo
		</Typograph>

		<div class="flex flex-wrap w-full justify-between mt-2 space-y-5">
			<v-autocomplete
				:style="handleAutoCompleteStyle(sediment.classification)"
				clearable
				:items="classifications"
				v-model="sediment.classification"
				chips
				label="Classificação:"></v-autocomplete>

			<v-autocomplete
				:style="handleAutoCompleteStyle(sediment.risk)"
				clearable
				:items="risk"
				v-model="sediment.risk"
				chips
				label="Risco:"></v-autocomplete>

			<v-autocomplete
				:style="handleAutoCompleteStyle(sediment.state)"
				clearable
				:items="states"
				v-model="sediment.state"
				chips
				label="Estado:"></v-autocomplete>

			<Input
				input="input"
				placeholder="Nome:"
				:class="sediment.name !== '' ? 'bg-white w-full' : 'w-full'"
				@input="(value: string) => sediment.name = value" />
		</div>
		<slot></slot>
	</form>
</template>

<script setup lang="ts">
import Typograph from "../atoms/Typograph.vue"
import Input from "../atoms/Input.vue"
import { reactive, watch } from "vue"
import { PropType } from "vue"
import { Actions } from "@/utils/enum"
import { ISediments } from "@/utils/interfaces"
import userProps from "@/context/useProps"

let sediment: ISediments = reactive({
	name: "",
	classification: undefined,
	risk: undefined,
	state: undefined,
	idCompany: "",
	idDepartment: "",
	id: "",
})

const { handleAutoCompleteStyle } = userProps()

const props = defineProps({
	typeAction: {
		type: String,
		required: true,
	},

	createOrUpdateSediments: {
		type: Function as PropType<(sediment: ISediments, action: string) => void>,
		required: true,
	},

	validateDataToCreateSediments: {
		type: Function as PropType<(sediment: ISediments) => void>,
		required: true,
	},

	validateDataToUpdateSediments: {
		type: Function as PropType<(sediment: ISediments) => void>,
		required: true,
	},

	classifications: {
		type: Array as PropType<string[]>,
		required: true,
	},

	states: {
		type: Array as PropType<string[]>,
		required: true,
	},

	risk: {
		type: Array as PropType<string[]>,
		required: true,
	},
})

watch(sediment, () => {
	if (props.typeAction == Actions.SAVE) {
		props.validateDataToCreateSediments(sediment)
	} else {
		props.validateDataToUpdateSediments(sediment)
	}
})
</script>

<style scoped>
.v-autocomplete--single {
	box-shadow: 0 0.3rem 0.62rem rgba(0, 0, 0, 0.4);
	border-radius: 0.375rem;
	width: 100%;
	color: #606060;
	font-weight: bold;
}
</style>
