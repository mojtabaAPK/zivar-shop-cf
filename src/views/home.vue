<template>
	<div class="size-full flex flex-row justify-center items-center">
		<div class="size-full overflow-y-scroll">
			
            <store/>
			
		</div>
	</div>
</template>


<script>

import store from '@/components/store.vue';

export default {
    components:
    {
        store
    }
}

</script>