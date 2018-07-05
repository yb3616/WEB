<template>
    <v-adapter>
        <h1>Admin</h1><br>
        <h3>{{ $store.state.user }}</h3><br>
        <h3>{{ $store.state.adapter }}</h3><br>
    </v-adapter>
</template>

<script>
import adapter from '@/components/Adapter.vue';
export default {
    components: {
        'v-adapter': adapter,
    }
}
</script>
