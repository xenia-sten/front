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
        parent_id: this.parentId,
      },
    };
  },
  props: {
    parentId:{
      type: String,
      default: null,
    }
  },
  methods: {
    createFolder() {
      this.$emit("create", this.folder);
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