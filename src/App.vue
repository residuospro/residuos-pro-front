<template>
	<router-view
		:key="$router.currentRoute.value.path.split('/')[0]"></router-view>
</template>
<script setup lang="ts"></script>

<style>
::-webkit-scrollbar {
	height: 0.5rem;
	width: 0.25rem;
	background-color: #e7e7e7;
}
::-webkit-scrollbar-thumb {
	background-color: #77ab59;
}
</style>
