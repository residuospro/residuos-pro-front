<template>
	<Container type="backgroundContainer">
		<Wrapper type="modal">
			<Wrapper type="deleteModal">
				<Typograph type="H2" class="text-v_medium_gray">
					{{ title }}
				</Typograph>

				<Typograph type="Paragraph">{{ subTitle }}</Typograph>

				<div class="flex items-center space-x-5 mt-3">
					<Button
						buttonType="confirmButton"
						class="text-white bg-v_green"
						@click="confirmAction">
						Sim
					</Button>

					<Button buttonType="closeButton" @click="closeDeleteModal">
						Não
					</Button>
				</div>
			</Wrapper>
		</Wrapper>
	</Container>
</template>

<script setup lang="ts">
import Container from "../atoms/Container.vue"
import Wrapper from "../atoms/Wrapper.vue"
import Typograph from "../atoms/Typograph.vue"
import Button from "../atoms/Button.vue"

defineProps({
	closeDeleteModal: {
		type: Function as any as () => (event: MouseEvent) => void,
		required: true,
	},

	confirmAction: {
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
