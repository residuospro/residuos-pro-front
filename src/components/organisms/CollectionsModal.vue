<template>
	<form @submit.prevent="createCollectionOrder(collection)">
		<Typograph type="H2" class="text-v_medium_gray">
			Criar pedido de coleta
		</Typograph>

		<div class="flex flex-wrap w-full justify-between mt-2 space-y-5">
			<v-autocomplete
				:style="handleAutoCompleteStyle(collection.sediments)"
				:onUpdate:modelValue="selectSedimentId"
				class="w-full"
				clearable
				:items="sedimentsName"
				v-model="collection.sediments"
				chips
				label="Resíduos:"></v-autocomplete>

			<Input
				input="input"
				type="number"
				placeholder="Quantidade:"
				:class="collection.amount !== 0 ? 'bg-white w-full' : 'w-full'"
				@input="(value: number) => collection.amount = value" />

			<Input
				input="input"
				placeholder="Acondicionamento:"
				:class="collection.packaging !== '' ? 'bg-white w-full' : 'w-full'"
				@input="(value: string) => collection.packaging = value" />

			<TextArea
				text="textArea"
				@text="(value: string) => collection.observation = value"
				:class="collection.observation !== '' ? 'bg-white' : ''"
				placeholder="Observação:"
				maxlength="200" />
		</div>
		<slot></slot>
	</form>
</template>

<script setup lang="ts">
import Typograph from "../atoms/Typograph.vue"
import Input from "../atoms/Input.vue"
import { PropType, reactive } from "vue"
import userProps from "@/context/useProps"
import TextArea from "../atoms/TextArea.vue"
import { watch } from "vue"
import { ICollectionData, ICollectionForm } from "@/utils/interfaces"

const { handleAutoCompleteStyle } = userProps()

const collection: ICollectionForm = reactive({
	sediments: undefined,
	packaging: "",
	amount: 0,
	observation: "",
})

const props = defineProps({
	sedimentsName: {
		type: Array as PropType<string[]>,
		required: true,
	},

	measure: {
		type: Array as PropType<string[]>,
		required: true,
	},

	validateDataToCreateCollection: {
		type: Function as PropType<(collection: ICollectionForm) => void>,
		required: true,
	},

	createCollectionOrder: {
		type: Function as PropType<(collection: Partial<ICollectionData>) => void>,
		required: true,
	},

	selectSedimentId: {
		type: Function as PropType<(sediment: any) => void>,
		required: true,
	},
})

watch(collection, () => {
	props.validateDataToCreateCollection(collection)
})
</script>
