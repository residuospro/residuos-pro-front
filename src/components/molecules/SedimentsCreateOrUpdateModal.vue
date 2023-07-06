<template>
	<Container type="backgroundContainer">
		<Container type="modalContainer">
			<Container type="actionsModalContainer">
				<Typograph type="H2" class="text-v_medium_gray">
					{{ typeAction }} resíduo
				</Typograph>

				<div class="flex flex-wrap w-full justify-between mt-2 space-y-5">
					<div class="space-x-6">
						<Input
							input="input"
							placeholder="Nome:"
							:class="sediment.name !== '' ? 'bg-white' : ''"
							@input="(value: string) => sediment.name = value" />

						<Input
							input="input"
							type="text"
							placeholder="Acondicionamento:"
							:class="sediment.packaging != '' ? 'bg-white' : ''"
							@input="(value: string) => sediment.packaging = value" />
					</div>

					<v-autocomplete
						clearable
						:active="true"
						:items="classifications"
						v-model="sediment.classification"
						:class="
							sediment.classification == undefined
								? 'bg-v_white_three'
								: '!bg-white'
						"
						style="
							width: 20rem !important;
							height: 3.5rem !important;
							display: block !important;
						"
						chips
						label="Classificação"></v-autocomplete>

					<v-autocomplete
						clearable
						:items="risk"
						v-model="sediment.risk"
						:class="
							sediment.risk == undefined ? 'bg-v_white_three' : '!bg-white'
						"
						style="width: 20rem !important; height: 3.5rem !important"
						chips
						label="Risco"></v-autocomplete>

					<v-autocomplete
						clearable
						:items="states"
						v-model="sediment.state"
						:class="
							sediment.state == undefined ? 'bg-v_white_three' : '!bg-white'
						"
						style="width: 20rem !important; height: 3.5rem !important"
						chips
						label="Estado"></v-autocomplete>
				</div>

				<div class="flex justify-end w-full space-x-5 mt-4">
					<Button buttonType="closeButton" @click="closeSedimentsModal">
						Cancelar
					</Button>

					<Button
						buttonType="confirmButton"
						:class="showButton ? ' bg-v_green' : 'bg-v_dark_gray'"
						:disabled="!showButton"
						@click="createOrUpdateSediments(sediment, typeAction)">
						<p class="text-white">{{ typeAction }}</p>
					</Button>
				</div>
			</Container>
		</Container>
	</Container>
</template>

<script setup lang="ts">
import Container from "../atoms/Container.vue"
import Typograph from "../atoms/Typograph.vue"
import Input from "../atoms/Input.vue"
import Button from "../atoms/Button.vue"
import { reactive, watch } from "vue"
import { PropType } from "vue"
import { Actions } from "@/utils/enum"
import { ISediments } from "@/utils/interfaces"

let sediment: ISediments = reactive({
	name: "",
	classification: undefined,
	risk: undefined,
	state: undefined,
	feature: undefined,
	composition: undefined,
	packaging: "",
})

const props = defineProps({
	typeAction: {
		type: String,
		required: true,
	},
	closeSedimentsModal: {
		type: Function as any as () => (event: MouseEvent) => void,
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

	showButton: {
		type: Boolean,
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

<style>
/* .v-field__clearable,
.mdi-close-circle,
.mdi,
.v-icon,
.v-icon--size-default,
.v-icon--clickable {
	background: #000 !important;
	color: #ccc;
} */
</style>
