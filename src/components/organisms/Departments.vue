<template>
	<div class="w-full ml-8 mt-2">
		<div class="flex items-center w-full justify-between mb-8">
			<div class="w-auto min-w-[23rem] space-x-5">
				<v-autocomplete
					clearable
					:active="true"
					:on-click:clear="clearFilter"
					:style="handleAutoCompleteStyle(departmentSelected)"
					:onUpdate:modelValue="filterDepartment"
					v-model="departmentSelected"
					:items="departments"
					chips
					label="Buscar Departamento"></v-autocomplete>
			</div>

			<Button
				buttonType="submit"
				@click="openDepartmentModal(Actions.SAVE)"
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
						v-for="(items, index) in content"
						:key="items.id"
						class="font-medium">
						<td :style="setTableBackground(index)" class="w-[50%]">
							{{ items.name }}
						</td>

						<td :style="setTableBackground(index)" class="w-[80%]">
							{{ items.ramal }}
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
											@click="openDepartmentModal(Actions.UPDATE, items.id)">
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
						Não há registros, crie o seu primeiro departamento!
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
import useProps from "../../context/useProps"

const { setTableBackground, handleAutoCompleteStyle } = useProps()

const props = defineProps({
	itemsPerPage: { type: Number, required: true },

	headers: { type: Array as PropType<string[]>, required: true },

	departments: { type: Array as PropType<string[]>, required: true },

	actions: { type: Array as PropType<string[]>, required: true },

	content: { type: Array as PropType<any[]>, required: true },

	filterDepartment: {
		type: Function as PropType<(department: string) => void>,
		required: true,
	},

	showDeleteModal: {
		type: Function as PropType<(id: string) => void>,
		required: true,
	},

	openDepartmentModal: {
		type: Function as PropType<(action: string, id?: string) => void>,
		required: true,
	},

	departmentFilterCleaning: {
		type: Function as unknown as () => () => void,
		required: true,
	},
})

let departmentSelected = ref()

const clearFilter = () => {
	props.departmentFilterCleaning()
	departmentSelected.value = null
}

useHead({
	title: "Resíduos Pro - Departamentos",
})
</script>

<style scoped>
.overflow {
	overflow: hidden;
	-ms-text-overflow: ellipsis;
	text-overflow: ellipsis;
	white-space: nowrap;
	padding: 0.3rem;
}

.overflow:hover {
	position: absolute;
	background: #fff;
	height: 2rem;
	margin-top: -1rem;
	box-shadow: 0 0.3rem 0.62rem rgba(0, 0, 0, 0.4);
	border-radius: 0.25rem;
	color: #000;
	width: auto;
	z-index: 10;
}
</style>
