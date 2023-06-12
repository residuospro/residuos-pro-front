<template>
	<Container type="backgroundContainer">
		<Container type="modalContainer">
			<Container type="departmentModalContainer">
				<Typograph type="H2" class="text-v_medium_gray">
					{{ typeAction }} departamento
				</Typograph>

				<div class="flex flex-wrap w-full justify-between h-36 mt-2">
					<Input input="input" placeholder="Departamento:" v-model="name" />
					<Input
						input="input"
						placeholder="Responsável:"
						v-model="responsible" />
					<Input input="input" placeholder="Ramal:" v-model="ramal" />
					<Input input="input" placeholder="Email:" v-model="email" />
				</div>

				<div class="flex justify-end w-full space-x-5 mt-2">
					<Button buttonType="closeButton" @click="closeDepartmentModal">
						Cancelar
					</Button>

					<Button
						buttonType="confirmButton"
						@click="
							createOrUpdateDepartment(
								{ name, responsible, ramal, email },
								typeAction
							)
						">
						<p class="text-white">{{ typeAction }}</p>
					</Button>
				</div>
			</Container>
		</Container>
	</Container>
</template>

<script setup lang="ts">
import Container from "../atoms/Container.vue"
import Typograph from "../atoms/Typograph.vue"
import Input from "../atoms/Input.vue"
import Button from "../atoms/Button.vue"
import { ref } from "vue"
import { PropType } from "vue"
import { IDepartment } from "@/utils/interfaces"

let name = ref("")
let responsible = ref("")
let ramal = ref(0)
let email = ref("")

const print = () => {
	console.log("dee", name.value)
}

defineProps({
	typeAction: {
		type: String,
		required: true,
	},
	closeDepartmentModal: {
		type: Function as any as () => (event: MouseEvent) => void,
		required: true,
	},
	createOrUpdateDepartment: {
		type: Function as PropType<
			(department: IDepartment, action: string) => void
		>,
		required: true,
	},
})
</script>
