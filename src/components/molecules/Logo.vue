<template>
	<Wrapper type="logo">
		<img
			src="@/assets/logo.png"
			:width="400"
			class="-mt-24 ml-[10rem] sm:-ml-20" />

		<div
			class="absolute top-[32.5rem] text-center ml-[10rem] sm:-ml-20 text-white">
			<Typograph type="title" class="">RESÍDUOS PRO</Typograph>

			<Typograph type="Paragraph" class="-mt-3">
				A maneira inteligente de gerenciar coletas
			</Typograph>
		</div>
	</Wrapper>
</template>

<script setup lang="ts">
import Wrapper from "@/components/atoms/Wrapper.vue"
import Typograph from "@/components/atoms/Typograph.vue"
</script>
