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
			<div>
				<p class="mt-3">Nome:</p>
				<Input
					input="input"
					:disabled="disabledInput()"
					:value="collectionDetails.name"
					:class="setBackgroundInputDetails()"
					@input="(value: string) => collection.name = value" />
			</div>

			<div>
				<p>Email:</p>
				<Input
					input="input"
					:disabled="disabledInput()"
					:value="collectionDetails.email"
					:class="setBackgroundInputDetails()"
					@input="(value: string) => collection.email = value" />
			</div>

			<div>
				<p>Departamento:</p>
				<Input
					input="input"
					:disabled="disabledInput()"
					:value="collectionDetails.department"
					:class="setBackgroundInputDetails()"
					@input="(value: string) => collection.department = value" />
			</div>

			<div>
				<p>Ramal:</p>
				<Input
					input="input"
					:disabled="disabledInput()"
					:value="collectionDetails.ramal"
					:class="setBackgroundInputDetails()"
					@input="(value: string) => collection.ramal = value" />
			</div>

			<div>
				<p>Nº Pedido:</p>
				<Input
					input="input"
					:disabled="disabledInput()"
					:value="collectionDetails.orderNumber"
					:class="setBackgroundInputDetails()"
					@input="(value: string) => collection.orderNumber = value" />
			</div>

			<div>
				<p>Resíduo:</p>
				<Input
					input="input"
					:disabled="disabledInput()"
					:value="collectionDetails.sedimentName"
					:class="setBackgroundInputDetails()"
					@input="(value: string) => collection.sedimentName = value" />
			</div>

			<div>
				<p>Classificação:</p>
				<Input
					input="input"
					:disabled="disabledInput()"
					:value="collectionDetails.classification"
					:class="setBackgroundInputDetails()"
					@input="(value: string) => collection.classification = value" />
			</div>

			<div>
				<p>Risco Associado:</p>
				<Input
					input="input"
					:disabled="disabledInput()"
					:value="collectionDetails.risk"
					:class="setBackgroundInputDetails()"
					@input="(value: string) => collection.risk = value" />
			</div>

			<div>
				<p>Estado:</p>
				<Input
					input="input"
					:disabled="disabledInput()"
					:value="collectionDetails.state"
					:class="setBackgroundInputDetails()"
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
					:value="`${collectionDetails.amount}${collectionDetails.measure}`"
					:class="setBackgroundInputDetails()"
					@input="(value: number) => collection.amount = value" />
			</div>

			<div>
				<p>Status:</p>
				<Input
					input="input"
					:disabled="true"
					:value="collectionDetails.status"
					:class="setBackgroundInputDetails()"
					@input="(value: string) => collection.status = value" />
			</div>

			<div class="">
				<p>Data/Hora:</p>
				<Input
					input="input"
					:disabled="true"
					:value="collectionDetails.date?.replace(',', ' -')"
					:class="setBackgroundInputDetails()"
					@input="(value: string) => collection.status = value" />
			</div>

			<div class="w-full">
				<p>Observação:</p>

				<TextArea
					:value="collectionDetails.observation"
					:disabled="disabledInput()"
					:class="setBackgroundTextArea(collection.observation)"
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
				class="flex justify-end space-x-5 mt-5 w-full mb-5"
				v-if="showButtonsForManager()">
				<Button buttonType="closeButton" @click="() => console.log('oi')">
					Cancelar
				</Button>

				<Button buttonType="confirmButton" class="bg-v_green">
					<p class="text-white">Atualizar</p>
				</Button>
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
import { PropType } from "vue"
import { ICollectionData } from "@/utils/interfaces"
import { watch } from "vue"
import { reactive } from "vue"

useHead({ title: "Resíduos Pro - Detalhes da coleta" })

let collection = reactive<Partial<ICollectionData>>({})

console.log(collection.reason)

defineProps({
	collectionDetails: {
		type: Object as PropType<Partial<ICollectionData>>,
		required: true,
	},

	openModalRefuse: {
		type: Function as PropType<() => void>,
		required: true,
	},

	disabledInput: {
		type: Function as PropType<() => boolean>,
		required: true,
	},

	setBackgroundTextArea: {
		type: Function as PropType<(observation?: string) => string>,
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

	showButtonsForManager: {
		type: Function as PropType<() => boolean>,
		required: true,
	},

	updateCollectionStatus: {
		type: Function as PropType<() => void>,
		required: true,
	},
})

watch(collection, () => {
	console.log("c", collection)
})
</script>
