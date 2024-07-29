<template>
  <div>
    <input v-model="query" @keyup.enter="search" placeholder="検索...">
  </div>
</template>

<script>
export default {
  data() {
    return {
      query: ''
    };
  },
  methods: {
    search() {
      this.$emit('search', this.query);
    }
  }
};
</script>
