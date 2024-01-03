<template>
	<Container type="backgroundContainer">
		<Wrapper type="modal">
			<Wrapper type="notification">
				<TypographVue type="H1" class="text-v_blue">
					Recusar pedido
				</TypographVue>

				<TypographVue type="H3" class="text-v_medium_gray mb-2">
					Por favor, justifique a recusa do pedido de coleta
				</TypographVue>

				<form class="w-full" @submit.prevent="refuseRequest(reason)">
					<TextArea
						text="textArea"
						:class="reason != '' ? 'bg-white !w-full' : '!w-full'"
						@text="(value: string) => reason = value"
						maxlength="150" />

					<div class="flex items-center space-x-5 mt-3 justify-center">
						<Button
							buttonType="confirmButton"
							:class="
								reason != ''
									? ' bg-v_green text-white'
									: 'bg-v_dark_gray text-white'
							"
							:disabled="reason == ''"
							type="submit">
							Recusar
						</Button>

						<Button buttonType="closeButton" @click="closeModalRefuse">
							Fechar
						</Button>
					</div>
				</form>
			</Wrapper>
		</Wrapper>
	</Container>
</template>

<script setup lang="ts">
import Container from "../atoms/Container.vue"
import Wrapper from "../atoms/Wrapper.vue"
import Button from "../atoms/Button.vue"
import TypographVue from "../atoms/Typograph.vue"
import TextArea from "../atoms/TextArea.vue"
import { ref } from "vue"
import { PropType } from "vue"

let reason = ref("")

defineProps({
	closeModalRefuse: {
		type: Function as any as () => (event: MouseEvent) => void,
		required: true,
	},

	refuseRequest: {
		type: Function as PropType<(reason: string) => void>,
		required: true,
	},
})
</script>
