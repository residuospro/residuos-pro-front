<template>
	<main class="">
		<router-view
			:key="$router.currentRoute.value.path.split('/')[0]"></router-view>
	</main>
</template>
