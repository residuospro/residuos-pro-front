<template>
	<Wrapper type="dataTable">
		<table>
			<slot></slot>

			<tbody style="height: auto">
				<tr
					v-for="(items, index) in content"
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
						<v-menu transition="slide-y-transition">
							<template v-slot:activator="{ props }">
								<button v-bind="props">
									<v-icon icon="mdi-pencil-box-outline" class="" />
								</button>
							</template>

							<v-list>
								<v-list-item>
									<button @click="openSedimentsModal(Actions.UPDATE, items.id)">
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
import userProps from "@/context/useProps"
import { ISediments } from "@/utils/interfaces"

const { setTableBackground } = userProps()

defineProps({
	actions: { type: Array as PropType<string[]>, required: true },

	content: { type: Array as PropType<ISediments[]>, required: true },

	showDeleteModal: {
		type: Function as PropType<(id?: string) => void>,
		required: true,
	},

	openSedimentsModal: {
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

.glass-effect {
	background: rgba(255, 255, 255, 0.1);
	box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5);
	backdrop-filter: blur(2px);
	-webkit-backdrop-filter: blur(13.5px);
	border: 1px solid rgba(255, 255, 255, 0.18);
}
</style>
