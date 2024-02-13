<template>
	<Container
		type="backgroundContainer"
		ref="modalContainer"
		@click="closeModalOutside">
		<Wrapper type="modal">
			<Wrapper type="actionsModal" @click.stop> <slot></slot></Wrapper>
		</Wrapper>
	</Container>
</template>

<script setup lang="ts">
import { PropType } from "vue"
import Container from "../atoms/Container.vue"
import Wrapper from "../atoms/Wrapper.vue"

defineProps({
	closeModalOutside: {
		type: Function as PropType<() => void>,
		required: true,
	},
})
</script>

<style scoped></style>
