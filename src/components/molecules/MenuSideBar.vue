<template>
	<Container type="menuContainer">
		<Container type="menuIconContainer">
			<div v-for="menu in menuIcons" :key="menu.id" class="mt-2">
				<button
					@click="setIdBtn(menu.path)"
					:class="menu.path == idBtn && 'text-v_dark_green'"
					v-if="hasPermission(menu.permissions)">
					<RouterLink :to="menu.path">
						<mdicon :name="menu.icon" />
						<v-tooltip activator="parent" location="start">{{
							menu.label
						}}</v-tooltip>
					</RouterLink>
				</button>
			</div>
		</Container>
		<Container type="menuIconContainer">
			<button @click="logout" class="btnColor">
				<mdicon name="logout-variant" />
				<v-tooltip activator="parent" location="start">Sair</v-tooltip>
			</button>
		</Container>
	</Container>
</template>

<script lang="ts" setup>
/* eslint-disable no-undef */
import { PropType } from "vue"
import Container from "../atoms/Container.vue"
import { hasPermission } from "@/utils/permissions"

defineProps({
	setIdBtn: {
		type: Function as PropType<(password: string) => void>,
		required: true,
	},
	idBtn: { type: String, required: true },

	logout: {
		type: Function as unknown as () => (event: MouseEvent) => void,
		required: true,
	},

	menuIcons: {
		type: Array as PropType<any[]>,
		required: true,
	},
})
</script>

<style scoped>
.btnColor:active {
	color: #234d20;
	transform: scale(0.9);
}
</style>
