<template>
	<Container type="backgroundContainer">
		<Container type="modalContainer">
			<Container type="deleteModalContainer">
				<Typograph type="H2" class="text-v_medium_gray">
					{{ title }}
				</Typograph>

				<Typograph type="Paragraph">{{ subTitle }}</Typograph>

				<div class="flex items-center space-x-5 mt-3">
					<Button
						buttonType="confirmButton"
						class="text-white bg-v_green"
						@click="deleteFunction">
						Sim
					</Button>

					<Button buttonType="closeButton" @click="closeDeleteModal">
						Não
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

	title: {
		type: String,
		requerid: true,
	},

	subTitle: {
		type: String,
		required: true,
	},
})
</script>
