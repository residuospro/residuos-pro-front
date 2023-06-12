<template>
	<Container type="backgroundContainer">
		<Container type="modalContainer">
			<Container type="deleteModalContainer">
				<Typograph type="H2" class="text-v_medium_gray">
					Confirmar exclusão
				</Typograph>

				<Typograph type="Paragraph">Tem certeza que deseja excluir ?</Typograph>

				<div class="flex items-center space-x-5 mt-3">
					<Button buttonType="closeButton" @click="closeDeleteModal">
						Não
					</Button>

					<Button
						buttonType="confirmButton"
						class="text-white"
						@click="deleteFunction">
						Sim
					</Button>
				</div>
			</Container>
		</Container>
	</Container>
</template>

<script setup lang="ts">
import Container from "../atoms/Container.vue"
import Typograph from "../atoms/Typograph.vue"
import Button from "../atoms/Button.vue"

defineProps({
	closeDeleteModal: {
		type: Function as any as () => (event: MouseEvent) => void,
		required: true,
	},

	deleteFunction: {
		type: Function as any as () => (event: MouseEvent) => void,
		required: true,
	},
})
</script>
