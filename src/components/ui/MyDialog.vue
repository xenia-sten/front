<template>
  <div class="dialog" v-if="show">
    <div class="dialog__content">
      <button v-if="canClose" class="close-btn" @click="hideDialog">✖️</button>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "my-dialog",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    canClose: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    hideDialog() {
      if (this.canClose) {
        this.$emit("update:show", false);
      }
    },
  },
};
</script>

<style scoped>
.dialog {
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  display: flex;
  z-index: 9999;
}

.dialog__content {
  margin: auto;
  background: white;
  border-radius: 8px;
  min-height: 50px;
  min-width: 300px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 16px;
  cursor: pointer;
}
</style>