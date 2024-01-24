<template>
	<div
		class="flex flex-col items-start justify-between space-y-8 w-full ml-8 mt-2">
		<button @click="$router.back()">
			<v-icon
				icon="mdi-keyboard-backspace"
				size="40"
				class="text-v_dark_gray underline underline-offset-[10px]" />
		</button>

		<div
			class="flex flex-wrap justify-between w-[80%] text-v_medium_gray space-y-3">
			<div class="mt-3">
				<p>Nº Pedido:</p>
				<Input
					input="input"
					:disabled="true"
					:value="collectionDetails.orderNumber"
					@input="(value: string) => collection.orderNumber = value" />
			</div>

			<div>
				<p>Data:</p>
				<Input
					input="input"
					:disabled="true"
					:value="collectionDetails.date?.split(',')[0]"
					@input="(value: string) => collection.status = value" />
			</div>

			<div>
				<p>Hora:</p>
				<Input
					input="input"
					:disabled="true"
					:value="collectionDetails.date?.split(',')[1]"
					@input="(value: string) => collection.status = value" />
			</div>

			<div>
				<p>Status:</p>
				<Input
					input="input"
					:disabled="true"
					:value="collectionDetails.status"
					@input="(value: string) => collection.status = value" />
			</div>

			<div>
				<p>Nome:</p>
				<Input
					input="input"
					:disabled="true"
					:value="collectionDetails.name"
					@input="(value: string) => collection.name = value" />
			</div>

			<div>
				<p>Email:</p>
				<Input
					input="input"
					:disabled="true"
					:value="collectionDetails.email"
					@input="(value: string) => collection.email = value" />
			</div>

			<div>
				<p>Departamento:</p>
				<Input
					input="input"
					:disabled="true"
					:value="collectionDetails.department"
					@input="(value: string) => collection.department = value" />
			</div>

			<div>
				<p>Ramal:</p>
				<Input
					input="input"
					:disabled="true"
					:value="collectionDetails.ramal"
					@input="(value: string) => collection.ramal = value" />
			</div>

			<div class="w-[18rem]">
				<p>Resíduo:</p>

				<v-autocomplete
					v-if="showButtonsAndInputForManager()"
					:style="{ height: '3rem' }"
					:onUpdate:modelValue="selectSediment"
					clearable
					:disabled="disabledInput()"
					:items="sedimentsName"
					v-model="collection.sedimentName"
					chips></v-autocomplete>

				<Input
					v-else
					input="input"
					:disabled="disabledInput()"
					:value="collectionDetails.sedimentName"
					:class="setBackgroundInputDetails()"
					@input="(value: string) =>
				collection.sedimentName = value" />
			</div>

			<div>
				<p>Classificação:</p>
				<Input
					input="input"
					:disabled="true"
					:class="setBackgroundInputDetails()"
					:value="collectionDetails.classification"
					@input="(value: string) => collection.classification = value" />
			</div>

			<div>
				<p>Risco Associado:</p>
				<Input
					input="input"
					:disabled="true"
					:class="setBackgroundInputDetails()"
					:value="collectionDetails.risk"
					@input="(value: string) => collection.risk = value" />
			</div>

			<div>
				<p>Estado:</p>
				<Input
					input="input"
					:disabled="true"
					:class="setBackgroundInputDetails()"
					:value="collectionDetails.state"
					@input="(value: string) => collection.state = value" />
			</div>

			<div>
				<p>Acondicionamento:</p>
				<Input
					input="input"
					:disabled="disabledInput()"
					:value="collectionDetails.packaging"
					:class="setBackgroundInputDetails()"
					@input="(value: string) => collection.packaging = value" />
			</div>

			<div>
				<p>Quantidade:</p>
				<Input
					input="input"
					:disabled="disabledInput()"
					type="number"
					:value="collectionDetails.amount"
					:class="setBackgroundInputDetails()"
					@input="(value: number) => collection.amount = value" />
			</div>

			<div class="w-[18rem]">
				<p>Unidade medida:</p>

				<v-autocomplete
					v-if="showButtonsAndInputForManager()"
					:onUpdate:modelValue="selectMeasure"
					:style="{ height: '3rem' }"
					clearable
					:items="measure"
					v-model="collection.measure"
					chips></v-autocomplete>

				<Input
					v-else
					input="input"
					:disabled="disabledInput()"
					:value="collectionDetails.measure"
					:class="setBackgroundInputDetails()"
					@input="(value: number) => collection.amount = value" />
			</div>

			<div class="w-full" v-if="showTextArea()">
				<p>Observação</p>

				<TextArea
					:value="collectionDetails.observation"
					:disabled="disabledInput()"
					:class="setBackgroundTextArea()"
					text="textArea"
					@text="(value: string) =>
				collection.observation = value"
					maxlength="200" />
			</div>

			<div class="w-[64%]" v-if="collectionDetails.reason">
				<p>Recusado por:</p>

				<div
					class="text-[1rem] font-[700] rounded-md shadow-[0_0.3rem_0.62rem_rgba(0,0,0,0.4)] bg-gray-100 w-full h-[6rem] px-4 py-4 border-red-500 border-solid border-2">
					<p class="">{{ collectionDetails.reason }}</p>
				</div>
			</div>

			<div
				class="flex justify-between w-full mt-5 mb-5"
				v-if="showButtonsAndInputForManager()">
				<Button buttonType="closeButton" @click="pdfDownload">
					Baixar pedido
				</Button>

				<div class="flex justify-end space-x-5">
					<Button buttonType="closeButton" @click="openDeleteModal">
						Cancelar
					</Button>

					<Button
						buttonType="confirmButton"
						:disabled="validateDataToUpdateCollection()"
						:class="
							!validateDataToUpdateCollection()
								? ' bg-v_green'
								: 'bg-v_dark_gray'
						"
						@click="openConfirmationModal(collection)">
						<p class="text-white">Atualizar</p>
					</Button>
				</div>
			</div>

			<div
				class="flex justify-end space-x-5 mt-5 w-full mb-5"
				v-if="showButtonsForAdm()">
				<Button buttonType="closeButton" @click="openModalRefuse">
					Recusar
				</Button>

				<Button
					buttonType="confirmButton"
					class="bg-v_green"
					@click="updateCollectionStatus">
					<p class="text-white">
						{{ setTextButton(collectionDetails.status) }}
					</p>
				</Button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useHead } from "@vueuse/head"
import Input from "@/components/atoms/Input.vue"
import TextArea from "../atoms/TextArea.vue"
import Button from "../atoms/Button.vue"
import { PropType, ref, watch, watchEffect } from "vue"
import { ICollectionData } from "@/utils/interfaces"

import userProps from "@/context/useProps"
import { Status } from "@/utils/enum"

const { handleAutoCompleteStyle } = userProps()

useHead({ title: "Resíduos Pro - Detalhes da coleta" })

let collection = ref<Partial<ICollectionData>>({})

const props = defineProps({
	sedimentsName: { type: Array as PropType<string[]>, required: true },

	collectionDetails: {
		type: Object as PropType<Partial<ICollectionData>>,
		required: true,
	},

	validateDataToUpdateCollection: {
		type: Function as PropType<() => boolean>,
		required: true,
	},

	showTextArea: {
		type: Function as PropType<() => boolean>,
		required: true,
	},

	measure: {
		type: Array as PropType<string[]>,
		required: true,
	},

	selectSediment: {
		type: Function as PropType<(sedimentName: string) => void>,
		required: true,
	},

	selectMeasure: {
		type: Function as PropType<(measure: string) => void>,
		required: true,
	},

	openModalRefuse: {
		type: Function as PropType<() => void>,
		required: true,
	},

	openDeleteModal: {
		type: Function as PropType<() => void>,
		required: true,
	},

	pdfDownload: {
		type: Function as PropType<() => void>,
		required: true,
	},

	openConfirmationModal: {
		type: Function as PropType<(collection: Partial<ICollectionData>) => void>,
		required: true,
	},

	disabledInput: {
		type: Function as PropType<() => boolean>,
		required: true,
	},

	setBackgroundTextArea: {
		type: Function as PropType<() => string>,
		required: true,
	},

	setBackgroundInputDetails: {
		type: Function as PropType<() => string>,
		required: true,
	},

	setTextButton: {
		type: Function as PropType<(status?: string) => string>,
		required: true,
	},

	showButtonsForAdm: {
		type: Function as PropType<() => boolean>,
		required: true,
	},

	showButtonsAndInputForManager: {
		type: Function as PropType<() => boolean>,
		required: true,
	},

	updateCollectionStatus: {
		type: Function as PropType<() => void>,
		required: true,
	},
})

watchEffect(() => {
	collection.value = props.collectionDetails
})
</script>
