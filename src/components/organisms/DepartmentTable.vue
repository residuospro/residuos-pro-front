<template>
	<Wrapper type="dataTable">
		<slot name="emptyTable"></slot>
		<table>
			<slot name="header"></slot>

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
			</tbody>
		</table>
	</Wrapper>
</template>

<script setup lang="ts">
/* eslint-disable no-undef */
import Wrapper from "../atoms/Wrapper.vue"
import Button from "../atoms/Button.vue"
import { PropType } from "vue"
import { Actions } from "@/utils/enum"
import useProps from "../../context/useProps"

const { setTableBackground } = useProps()

defineProps({
	itemsPerPage: { type: Number, required: true },

	actions: { type: Array as PropType<string[]>, required: true },

	content: { type: Array as PropType<any[]>, required: true },

	showDeleteModal: {
		type: Function as PropType<(id: string) => void>,
		required: true,
	},

	openDepartmentModal: {
		type: Function as PropType<(action: string, id?: string) => void>,
		required: true,
	},
})
</script>

<style scoped>
table {
	border-collapse: collapse;
	width: 100%;
}

th,
td {
	text-align: start;
	padding: 0 2em;
}

th {
	background-color: #77ab59;
	color: #fff;
	height: 3rem;
}

tbody td {
	line-height: 3;
}
</style>
