<template>
	<Container type="backgroundContainer">
		<Wrapper type="modal">
			<Wrapper type="actionsModal">
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
							:class="
								collection.packaging !== '' ? 'bg-white w-full' : 'w-full'
							"
							@input="(value: string) => collection.packaging = value" />

						<TextArea
							text="textArea"
							@text="(value: string) => collection.observation = value"
							:class="collection.observation !== '' ? 'bg-white' : ''"
							placeholder="Observação:"
							maxlength="200" />
					</div>
					<div class="flex justify-end w-full space-x-5 mt-5">
						<Button
							type="submit"
							buttonType="confirmButton"
							:class="showButton ? ' bg-v_green' : 'bg-v_dark_gray'"
							:disabled="!showButton">
							<p class="text-white">Criar</p>
						</Button>

						<Button buttonType="closeButton" @click="closeCollectionModal">
							Cancelar
						</Button>
					</div>
				</form>
			</Wrapper>
		</Wrapper>
	</Container>
</template>

<script setup lang="ts">
import Container from "../atoms/Container.vue"
import Wrapper from "../atoms/Wrapper.vue"
import Typograph from "../atoms/Typograph.vue"
import Input from "../atoms/Input.vue"
import Button from "../atoms/Button.vue"
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
	showButton: {
		type: Boolean,
		required: true,
	},

	closeCollectionModal: {
		type: Function as PropType<(event: Event) => void>,
		required: true,
	},

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
