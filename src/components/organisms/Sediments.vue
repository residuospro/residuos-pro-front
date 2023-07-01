<template>
	<div class="w-full ml-8 mt-2">
		<div class="flex items-center w-full justify-between mb-8">
			<div
				class="flex justify-between items-center w-auto min-w-[23rem] space-x-5">
				<v-autocomplete
					:onUpdate:modelValue="selectSediments"
					v-model="sedimentSelected"
					:items="sediments"
					chips
					label="Buscar Resíduos"></v-autocomplete>

				<button class="mt-7" @click="clearFilter">Limpar pesquisa</button>
			</div>

			<Button
				buttonType="submit"
				@click="openSedimentsModal(Actions.SAVE)"
				class="bg-white">
				<p class="text-v_dark_gray">Cadastrar</p>
			</Button>
		</div>

		<Container type="dataTableContainer">
			<Container type="headersContainer" class="text-white">
				<Typograph type="H3" v-for="(items, index) in headers" :key="index">
					{{ items }}
				</Typograph>

				<Typograph type="H3">Ajustar</Typograph>
			</Container>

			<div class="min-h-[28rem] bg-transparent">
				<div v-for="(items, index) in content" :key="items.id">
					<Container
						type="departmentContent"
						:class="index % 2 == 0 && 'bg-v_white_one'">
						<div class="relative">
							<h1 class="overflow w-[15rem]">{{ items.name }}</h1>
						</div>

						<h1>{{ items.responsible }}</h1>

						<h1>{{ items.ramal }}</h1>

						<div class="relative">
							<h1 class="overflow w-44">{{ items.email }}</h1>
						</div>

						<v-menu transition="slide-y-transition">
							<template v-slot:activator="{ props }">
								<button v-bind="props">
									<mdicon name="pencil-box-outline" class="" />
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
					</Container>

					<hr className=" border-[1px] w-full" />
				</div>
			</div>
		</Container>
	</div>
</template>

<script setup lang="ts">
/* eslint-disable no-undef */
import { useHead } from "@vueuse/head"
import Container from "../atoms/Container.vue"
import Typograph from "../atoms/Typograph.vue"
import Button from "../atoms/Button.vue"
import { PropType, ref, computed } from "vue"
import { Actions } from "@/utils/enum"

const props = defineProps({
	headers: { type: Array as PropType<string[]>, required: true },

	sediments: { type: Array as PropType<string[]>, required: true },

	actions: { type: Array as PropType<string[]>, required: true },

	content: { type: Array as PropType<any[]>, required: true },

	selectSediments: {
		type: Function as PropType<(department: string) => void>,
		required: true,
	},

	showDeleteModal: {
		type: Function as PropType<(id: string) => void>,
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

const autocompleteHeight = computed(() => {
	let height = "3rem"

	if (sedimentSelected.value) height = "3.8rem"

	return height
})

useHead({
	title: "Resíduos Pro - Resíduos",
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

.v-autocomplete--single {
	background: #fff;
	box-shadow: 0 0.3rem 0.62rem rgba(0, 0, 0, 0.4);
	border-radius: 0.375rem;
	height: v-bind(autocompleteHeight);
	color: #606060;
	font-weight: bold;
}
</style>
