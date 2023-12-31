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
					:disabled="hasPermission([AuthorizationUser.ADMIN])"
					:value="collectionDetails.name"
					:class="setBackgroundInputDetails()"
					@input="(value: string) => collection.name = value" />
			</div>

			<div>
				<p>Email:</p>
				<Input
					input="input"
					:disabled="hasPermission([AuthorizationUser.ADMIN])"
					:value="collectionDetails.email"
					:class="setBackgroundInputDetails()"
					@input="(value: string) => collection.email = value" />
			</div>

			<div>
				<p>Departamento:</p>
				<Input
					input="input"
					:disabled="hasPermission([AuthorizationUser.ADMIN])"
					:value="collectionDetails.department"
					:class="setBackgroundInputDetails()"
					@input="(value: string) => collection.department = value" />
			</div>

			<div>
				<p>Ramal:</p>
				<Input
					input="input"
					:disabled="hasPermission([AuthorizationUser.ADMIN])"
					:value="collectionDetails.ramal"
					:class="setBackgroundInputDetails()"
					@input="(value: string) => collection.ramal = value" />
			</div>

			<div>
				<p>Nº Pedido:</p>
				<Input
					input="input"
					:disabled="hasPermission([AuthorizationUser.ADMIN])"
					:value="collectionDetails.orderNumber"
					:class="setBackgroundInputDetails()"
					@input="(value: string) => collection.orderNumber = value" />
			</div>

			<div>
				<p>Resíduo:</p>
				<Input
					input="input"
					:disabled="hasPermission([AuthorizationUser.ADMIN])"
					:value="collectionDetails.sedimentName"
					:class="setBackgroundInputDetails()"
					@input="(value: string) => collection.sedimentName = value" />
			</div>

			<div>
				<p>Classificação:</p>
				<Input
					input="input"
					:disabled="hasPermission([AuthorizationUser.ADMIN])"
					:value="collectionDetails.classification"
					:class="setBackgroundInputDetails()"
					@input="(value: string) => collection.classification = value" />
			</div>

			<div>
				<p>Risco Associado:</p>
				<Input
					input="input"
					:disabled="hasPermission([AuthorizationUser.ADMIN])"
					:value="collectionDetails.risk"
					:class="setBackgroundInputDetails()"
					@input="(value: string) => collection.risk = value" />
			</div>

			<div>
				<p>Estado:</p>
				<Input
					input="input"
					:disabled="hasPermission([AuthorizationUser.ADMIN])"
					:value="collectionDetails.state"
					:class="setBackgroundInputDetails()"
					@input="(value: string) => collection.state = value" />
			</div>

			<div>
				<p>Acondicionamento:</p>
				<Input
					input="input"
					:disabled="hasPermission([AuthorizationUser.ADMIN])"
					:value="collectionDetails.packaging"
					:class="setBackgroundInputDetails()"
					@input="(value: string) => collection.packaging = value" />
			</div>

			<div>
				<p>Quantidade:</p>
				<Input
					input="input"
					:disabled="hasPermission([AuthorizationUser.ADMIN])"
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

			<div>
				<p>Observação:</p>

				<TextArea
					:value="collectionDetails.observation"
					:disabled="hasPermission([AuthorizationUser.ADMIN])"
					:class="setBackgroundTextArea()"
					text="textArea"
					@text="(value: string) =>
				collection.observation = value"
					maxlength="200" />
			</div>

			<div
				class="flex justify-end space-x-5 mt-5 w-full mb-5"
				v-if="
					hasPermission([
						AuthorizationUser.COLLABORATOR,
						AuthorizationUser.MANAGER,
					]) && collectionDetails.status == Status.WAITING_FOR_APPROVAL
				">
				<Button buttonType="closeButton" @click="() => console.log('oi')">
					Cancelar
				</Button>

				<Button buttonType="confirmButton" class="bg-v_green">
					<p class="text-white">Atualizar</p>
				</Button>
			</div>

			<div
				class="flex justify-end space-x-5 mt-5 w-full mb-5"
				v-if="
					(hasPermission([AuthorizationUser.ADMIN]) &&
						collectionDetails.status == Status.WAITING_FOR_APPROVAL) ||
					(hasPermission([AuthorizationUser.ADMIN]) &&
						collectionDetails.status == Status.WAITING_FOR_COLLECTION)
				">
				<Button buttonType="closeButton" @click="() => console.log('oi')">
					Recusar
				</Button>

				<Button buttonType="confirmButton" class="bg-v_green">
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
import { AuthorizationUser, Status } from "@/utils/enum"
import { hasPermission } from "@/utils/permissions"
import Button from "../atoms/Button.vue"
import { PropType } from "vue"
import { ICollectionData } from "@/utils/interfaces"
import { watch } from "vue"
import { reactive } from "vue"

useHead({ title: "Resíduos Pro - Detalhes da coleta" })

const setBackgroundInputDetails = () => {
	if (!hasPermission([AuthorizationUser.ADMIN])) return "bg-white"

	return ""
}

let collection = reactive<Partial<ICollectionData>>({})

const props = defineProps({
	collectionDetails: {
		type: Object as PropType<Partial<ICollectionData>>,
		required: true,
	},
})

const setTextButton = (status?: string) => {
	if (status == Status.WAITING_FOR_APPROVAL) {
		return "Aceitar"
	} else if (status == Status.WAITING_FOR_COLLECTION) {
		return "Finalizar"
	} else {
		return ""
	}
}

const setBackgroundTextArea = () => {
	if (
		(!hasPermission([AuthorizationUser.ADMIN]) && collection.observation) ||
		(props.collectionDetails.observation &&
			!hasPermission([AuthorizationUser.ADMIN]))
	) {
		return "bg-white !w-[40rem]"
	}

	return "!w-[40rem]"
}

watch(collection, () => {
	console.log("c", collection)
})
</script>
