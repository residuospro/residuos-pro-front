<template>
	<Container type="backgroundContainer">
		<Container type="modalContainer">
			<Container type="notificationContainer">
				<TypographVue type="H1">{{ title }}</TypographVue>

				<TypographVue type="H3" class="text-v_medium_gray">
					{{ subTitle }}
				</TypographVue>

				<Button
					button-type="submit"
					class="bg-v_green text-white mt-5"
					@click="$emit('closeModal', false)">
					Fechar
				</Button>
			</Container>
		</Container>
	</Container>
</template>

<script setup lang="ts">
import Container from "../atoms/Container.vue"
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
