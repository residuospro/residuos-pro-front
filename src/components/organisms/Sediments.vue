<template>
	<div class="w-full ml-8 mt-2">
		<div class="flex items-center w-full justify-between mb-8">
			<div
				class="flex justify-between items-center w-auto min-w-[23rem] space-x-5">
				<v-autocomplete
					clearable
					:style="handleAutoCompleteStyle(sedimentSelected)"
					:on-click:clear="clearFilter"
					:onUpdate:modelValue="selectSediments"
					:active="true"
					v-model="sedimentSelected"
					:items="sediments"
					chips
					label="Buscar Resíduos"></v-autocomplete>
			</div>

			<Button
				buttonType="submit"
				@click="openSedimentsModal(Actions.SAVE)"
				class="bg-white">
				<p class="text-v_dark_gray">Cadastrar</p>
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

						<th type="H3" class="rounded-tr-md">Ajustar</th>
					</tr>
				</thead>

				<tbody style="height: auto">
					<tr
						v-for="(items, index) in content.slice(0, itemsPerPage)"
						:key="items.id"
						class="font-medium">
						<td :style="setTableBackground(index)">
							{{ items.name }}
						</td>

						<td :style="setTableBackground(index)">
							{{ items.classification }}
						</td>

						<td :style="setTableBackground(index)">
							{{ items.risk }}
						</td>

						<td :style="setTableBackground(index)">
							{{ items.state }}
						</td>

						<td :style="setTableBackground(index)">
							{{ items.packaging }}
						</td>

						<td :style="setTableBackground(index)">
							<v-menu transition="slide-y-transition">
								<template v-slot:activator="{ props }">
									<button v-bind="props">
										<v-icon icon="mdi-pencil-box-outline" class="" />
									</button>
								</template>

								<v-list>
									<v-list-item>
										<button
											@click="openSedimentsModal(Actions.UPDATE, items.id)">
											Atualizar
										</button>
									</v-list-item>

									<v-list-item>
										<button @click="showDeleteModal(items.id)">Deletar</button>
									</v-list-item>
								</v-list>
							</v-menu>
						</td>
					</tr>

					<p
						class="text-v_medium_gray absolute top-[12rem] w-full text-center"
						v-if="content.length == 0">
						Não há registros, crie o seu primeiro resíduo!
					</p>
				</tbody>
			</table>
		</Wrapper>
	</div>
</template>

<script setup lang="ts">
/* eslint-disable no-undef */
import { useHead } from "@vueuse/head"
import Wrapper from "../atoms/Wrapper.vue"
import Button from "../atoms/Button.vue"
import { PropType, ref } from "vue"
import { Actions } from "@/utils/enum"
import userProps from "@/context/useProps"
import { ISediments } from "@/utils/interfaces"

const { handleAutoCompleteStyle, setTableBackground } = userProps()

const props = defineProps({
	itemsPerPage: { type: Number, required: true },

	headers: { type: Array as PropType<string[]>, required: true },

	sediments: { type: Array as PropType<string[]>, required: true },

	actions: { type: Array as PropType<string[]>, required: true },

	content: { type: Array as PropType<ISediments[]>, required: true },

	selectSediments: {
		type: Function as PropType<(sediment: string) => void>,
		required: true,
	},

	showDeleteModal: {
		type: Function as PropType<(id?: string) => void>,
		required: true,
	},

	openSedimentsModal: {
		type: Function as PropType<(action: string, id?: string) => void>,
		required: true,
	},

	sedimentsFilterCleaning: {
		type: Function as unknown as () => () => void,
		required: true,
	},
})

let sedimentSelected = ref()

const clearFilter = () => {
	props.sedimentsFilterCleaning()
	sedimentSelected.value = null
}

useHead({
	title: "Resíduos Pro - Resíduos",
})
</script>
