<template>
  <div>
    <div class="d-flex flex-row justify-content-between">
      <span @click="handleClick">
        {{ noteObject.title }}
      </span>
      <div class="d-flex">
        <button class="mdi mdi-pencil" title="Редактировать"></button>
        <div class="d-flex">
          <button class="mdi mdi-delete" title="Удалить"></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Note",
  data() {
    return {};
  },
  props: {
    noteObject: {
      type: Object,
      default: {},
    },
  },
  methods:{
    handleClick() {
      this.$emit('click'); // Эмиссия события 'click', если необходимо
    },
  },
};
</script>