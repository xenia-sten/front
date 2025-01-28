<template>
  <form @submit.prevent>
    <h4>Редактирование папки</h4>
    <input v-model="folder.name" type="text" placeholder="Название" />
    <button
      style="align-self: flex-end; margin-top: 15px"
      @click="editFolder"
    >
      Сохранить
    </button>
  </form>
</template>

<script>
export default {
  props: {
    folder: {
      type: Object,
      required: true,
    },
  },

  methods: {
    editFolder() {
      this.$emit("edit", this.folder);
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