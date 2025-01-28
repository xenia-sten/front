<template>
  <form @submit.prevent>
    <h4>Редактирование заметки</h4>
    <input v-model="note.title" type="text" placeholder="Название" />
    <button
      style="align-self: flex-end; margin-top: 15px"
      @click="editNote"
    >
      Сохранить
    </button>
  </form>
</template>

<script>
export default {
  props: {
    note: {
      type: Object,
      required: true,
    },
  },

  methods: {
    editNote() {
      console.log(this.note);
      this.$emit("edit", this.note);
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