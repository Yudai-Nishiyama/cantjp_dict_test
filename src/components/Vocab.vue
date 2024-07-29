<template>
  <div>
    <h2>{{ word }}</h2>
    <p>{{ meaning }}</p>
    <button @click="playAudio">読み上げ</button>
  </div>
</template>

<script>
export default {
  props: ['word', 'meaning'],
  methods: {
    playAudio() {
      this.$emit('play-audio', this.word);
    }
  }
};
</script>
