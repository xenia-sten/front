<template>
  <form @submit.prevent>
    <h4>Создание папки</h4>
    <input v-model="folder.name" type="text" placeholder="Название" />
    <button
      style="align-self: flex-end; margin-top: 15px"
      @click="createFolder"
    >
      Создать
    </button>
  </form>
</template>

<script>
export default {
  data() {
    return {
      folder: {
        name: "",
      },
    };
  },

  methods: {
    createFolder() {
      this.$emit("create", this.folder);
      this.folder = {
        name: "",
        parent: null,
      };
    },
  },
};
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
}
</style>