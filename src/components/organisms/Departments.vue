<template>
	<div class="w-full ml-8 mt-2">
		<div class="flex items-center w-full justify-between mb-8">
			<div class="flex justify-between items-center w-[23rem] space-x-5">
				<v-autocomplete
					:items="items"
					density="comfortable"
					label="Buscar Departamento"></v-autocomplete>

				<button class="mt-4">Limpar pesquisa</button>
			</div>

			<Button type="submit">
				<p class="text-v_medium_gray">Cadastrar</p>
			</Button>
		</div>

		<Container type="dataTableContainer">
			<Container type="headersContainer">
				<Typograph type="H2" v-for="(items, index) in headers" :key="index">{{
					items
				}}</Typograph>
				<Typograph type="H2">Ajustar</Typograph>
			</Container>

			<div class="min-h-[28rem] bg-transparent">
				<div v-for="items in content" :key="items.id">
					<Container type="tableContents">
						<h1>{{ items.name }}</h1>

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
								<v-list-item v-for="(item, i) in titles" :key="i">
									<button>
										{{ item }}
									</button>
								</v-list-item>
							</v-list>
						</v-menu>
					</Container>

					<hr className=" border-[1px] w-full" />
				</div>
			</div>
		</Container>

		<Pagination :pageCount="10" :items="[0, 1, 2, 4, 5]" />
	</div>
</template>

<script setup lang="ts">
import { useHead } from "@vueuse/head"
import Container from "../atoms/Container.vue"
import Typograph from "../atoms/Typograph.vue"
import Button from "../atoms/Button.vue"
import Pagination from "../molecules/Pagination.vue"
import ItemsPerPage from "../molecules/ItemsPerPage.vue"
const headers = ["Departamento", "Responsável", "Ramal", "Email"]
const items = ["foo", "bar", "fizz", "buzz"]

const titles = ["Atualizar", "Deletar"]

const content = [
	{
		id: 1,
		name: "Aumoxarifado",
		responsible: "Douglas",
		ramal: 2329,
		email: "douglas_fernando2023_legal@gmail.com",
	},
	{
		id: 1,
		name: "Aumoxarifado",
		responsible: "Douglas",
		ramal: 2329,
		email: "douglas_fernando2023_legal@gmail.com",
	},
	{
		id: 1,
		name: "Aumoxarifado",
		responsible: "Douglas",
		ramal: 2329,
		email: "douglas_fernando2023_legal@gmail.com",
	},
	{
		id: 1,
		name: "Aumoxarifado",
		responsible: "Douglas",
		ramal: 2329,
		email: "douglas_fernando2023_legal@gmail.com",
	},
	{
		id: 1,
		name: "Aumoxarifado",
		responsible: "Douglas",
		ramal: 2329,
		email: "douglas_fernando2023_legal@gmail.com",
	},
	{
		id: 1,
		name: "Aumoxarifado",
		responsible: "Douglas",
		ramal: 2329,
		email: "douglas_fernando2023_legal@gmail.com",
	},
	{
		id: 1,
		name: "Aumoxarifado",
		responsible: "Douglas",
		ramal: 2329,
		email: "douglas_fernando2023_legal@gmail.com",
	},
	{
		id: 1,
		name: "Aumoxarifado",
		responsible: "Douglas",
		ramal: 2329,
		email: "douglas_fernando2023_legal@gmail.com",
	},
	{
		id: 1,
		name: "Aumoxarifado",
		responsible: "Douglas",
		ramal: 2329,
		email: "douglas_fernando2023_legal@gmail.com",
	},
]

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

.v-autocomplete--single {
	background: #fff;
	box-shadow: 0 0.3rem 0.62rem rgba(0, 0, 0, 0.4);
	border-radius: 0.375rem;
	height: 3rem;
	color: #9d9797;
	font-weight: bold;
}
</style>
