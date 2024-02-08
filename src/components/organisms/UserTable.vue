<template>
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
					<td :style="setTableBackground(index)">
						{{ items.name }}
					</td>

					<td
						v-if="items.username == undefined"
						:style="setTableBackground(index)">
						<v-tooltip activator="parent" location="center">
							Aguardando cadastro
						</v-tooltip>

						<VueSpinnerBar color="#36802d" height="2" width="80" />
					</td>

					<td v-else :style="setTableBackground(index)">
						{{ items.username }}
					</td>

					<td :style="setTableBackground(index)">
						{{ items.email }}
					</td>

					<td :style="setTableBackground(index)">
						{{ items.department }}
					</td>

					<td :style="setTableBackground(index)">
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
									<button @click="openUserModal(Actions.UPDATE, items.id)">
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
					Não há registros, crie o seu primeiro usuário!
				</p>
			</tbody>
		</table>
	</Wrapper>
</template>

<script setup lang="ts">
/* eslint-disable no-undef */
import Button from "../atoms/Button.vue"
import { PropType, ref } from "vue"
import { IUsers } from "@/utils/interfaces"
import { Actions } from "@/utils/enum"
import Wrapper from "../atoms/Wrapper.vue"
import useProps from "../../context/useProps"
import { VueSpinnerBar } from "vue3-spinners"

const { setTableBackground } = useProps()

defineProps({
	itemsPerPage: { type: Number, required: true },

	headers: { type: Array as PropType<string[]>, required: true },

	actions: { type: Array as PropType<string[]>, required: true },

	content: { type: Array as PropType<IUsers[]>, required: true },

	showDeleteModal: {
		type: Function as PropType<(id: string | undefined) => void>,
		required: true,
	},

	openUserModal: {
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

.glass-effect {
	background: rgba(255, 255, 255, 0.1);
	box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5);
	backdrop-filter: blur(2px);
	-webkit-backdrop-filter: blur(13.5px);
	border: 1px solid rgba(255, 255, 255, 0.18);
}
</style>
