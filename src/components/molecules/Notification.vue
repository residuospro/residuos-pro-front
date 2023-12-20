<template>
	<notifications position="bottom right" duration="-3000">
		<template #body="props">
			<div
				class="flex flex-col justify-center bg-white rounded-lg mx-3 my-3 px-2 py-2 shadow-[0_0.3rem_0.62rem_rgba(0,0,0,0.4)]">
				<Vue3Lottie :animationData="order" :height="150" :width="150" />

				<div class="text-center text-v_medium_gray mb-2">
					<p class="font-bold">
						{{ props.item.title }}
					</p>

					<div v-html="props.item.text" />
				</div>

				<Button
					buttonType="confirmButton"
					class="bg-v_green"
					@click="closeNotification(props)">
					<p class="text-white">Fechar</p>
				</Button>
			</div>
		</template>
	</notifications>
</template>

<script lang="ts" setup>
import order from "@/assets/order.json"
import Button from "@/components/atoms/Button.vue"
import { Vue3Lottie } from "vue3-lottie"
import { audioStore } from "@/store/audioStore"
import router from "@/router"

const audio = audioStore()

const closeNotification = (props: any) => {
	const pathname = window.location.pathname

	if (pathname != "/Painel/Coletas") router.push("/Painel/Coletas")

	audio.pauseAudio()

	props.close()
}
</script>
