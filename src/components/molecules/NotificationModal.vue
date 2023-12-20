<template>
	<Container type="backgroundContainer">
		<Wrapper type="modal">
			<Wrapper type="notification">
				<TypographVue type="H1" class="text-v_blue">{{ title }}</TypographVue>

				<TypographVue type="H3" class="text-v_medium_gray">
					{{ subTitle }}
				</TypographVue>

				<Button
					button-type="submit"
					class="bg-v_green text-white mt-5"
					@click="$emit('closeModal', false)">
					Fechar
				</Button>
			</Wrapper>
		</Wrapper>
	</Container>
</template>

<script setup lang="ts">
import Container from "../atoms/Container.vue"
import Wrapper from "../atoms/Wrapper.vue"
import Button from "../atoms/Button.vue"
import TypographVue from "../atoms/Typograph.vue"

defineProps({
	title: {
		type: String,
		required: true,
	},
	subTitle: {
		type: String,
		required: true,
	},
})
</script>
