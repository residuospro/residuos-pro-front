<template>
	<Wrapper type="dataTable">
		<table>
			<slot></slot>

			<tbody style="height: auto">
				<tr
					v-for="(items, index) in collections"
					:key="items.id"
					class="font-medium">
					<td :style="setTableBackground(index)">
						{{ items.orderNumber }}
					</td>

					<td :style="setTableBackground(index)">
						<div
							v-if="validatedStatus(items.status!)"
							class="flex flex-col items-center">
							<Vue3Lottie
								v-if="items.status == Status.WENT_OUT_FOR_COLLECTION"
								:animationData="collect"
								:height="50"
								:width="50"
								class="-mb-4" />

							<Vue3Lottie
								v-if="items.status == Status.AWAITING_COLLECTION"
								:animationData="awating_collection"
								:height="100"
								:width="150"
								class="-mb-10 -mt-6" />

							<VueSpinnerBar
								v-if="items.status == Status.WAITING_FOR_APPROVAL"
								:color="setColorSpinnerBar(String(items.status))"
								height="5"
								width="40%"
								class="mt-3" />

							<p
								:style="{
									color: getColorByStatus(String(items.status)),
									fontWeight: 'bold',
								}">
								{{ items.status }}
							</p>
						</div>

						<div v-else class="flex flex-col items-center">
							<div :style="setStatusStyle(String(items.status))">
								{{ items.status }}
							</div>
						</div>
					</td>

					<td :style="setTableBackground(index)">
						{{ items.sedimentName }}
					</td>

					<td :style="setTableBackground(index)">
						{{ items.packaging }}
					</td>

					<td :style="setTableBackground(index)">
						{{ items.amount }}{{ items.measure }}
					</td>

					<td :style="setTableBackground(index)">
						{{ items.department }}
					</td>

					<td :style="setTableBackground(index)">
						{{ items.date?.split(",")[0] }}
					</td>

					<td :style="setTableBackground(index)">
						<button @click="$router.push(`/Painel/Detalhes/${items.id}`)">
							<v-icon icon="mdi-dots-horizontal" />
						</button>
					</td>
				</tr>
			</tbody>
		</table>
	</Wrapper>
</template>

<script setup lang="ts">
import Wrapper from "../atoms/Wrapper.vue"
import Button from "../atoms/Button.vue"
import userProps from "@/context/useProps"
import { Status } from "@/utils/enum"
import { PropType } from "vue"
import { ICollectionData, ICollectionFilter } from "@/utils/interfaces"
import { VueSpinnerBar } from "vue3-spinners"
import { Vue3Lottie } from "vue3-lottie"
import collect from "../../assets/collect.json"
import awating_collection from "../../assets/ac.json"

const { setTableBackground } = userProps()

defineProps({
	itemsPerPage: { type: Number, required: true },

	collectionFilter: {
		type: Array as PropType<ICollectionFilter[]>,
		required: true,
	},

	actions: { type: Array as PropType<string[]>, required: true },

	collections: {
		type: Array as PropType<Partial<ICollectionData>[]>,
		required: true,
	},

	showDeleteModal: {
		type: Function as PropType<(id?: string) => void>,
		required: true,
	},

	setStatusStyle: {
		type: Function as PropType<(status: string) => any>,
		required: true,
	},

	getColorByStatus: {
		type: Function as PropType<(status: string) => any>,
		required: true,
	},

	validatedStatus: {
		type: Function as PropType<(status: string) => any>,
		required: true,
	},

	setColorSpinnerBar: {
		type: Function as PropType<(status: string) => any>,
		required: true,
	},
})
</script>

<style scoped>
.v-date-picker__title,
.v-picker-title {
	display: none;
}

.v-picker__header {
	height: 3rem !important;
}

.v-date-picker-header__content {
	font-size: 1rem !important;
}

table {
	border-collapse: collapse;
	width: 100%;
}

th,
td {
	text-align: center;
	padding: 0 0.5rem;
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
