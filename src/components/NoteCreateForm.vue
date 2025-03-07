<template>
  <form @submit.prevent>
    <h4>Создание заметки</h4>
    <input v-model="note.title" type="text" placeholder="Название" />
    <button
      style="align-self: flex-end; margin-top: 15px"
      @click.stop="createNote"
    >
      Создать
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
  data() {
    return {
      note: {
        title: "",
        content: "",
        folder_id: this.folder.id,
      },
    };
  },

  methods: {
    createNote() {
      this.$emit("create", this.note);
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