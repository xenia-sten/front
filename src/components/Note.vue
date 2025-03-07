<template>
  <div>
    <div class="d-flex flex-row justify-content-between">
      <span @click="handleClick">
        <span class="mdi mdi-note-text-outline"></span>
        {{ noteObject.title }}
      </span>
      <my-dialog v-model:show="visibleEditNote">
        <note-edit-form :note=noteObject @edit="editNote" />
      </my-dialog>
      <div class="d-flex">
        <button
          class="mdi mdi-pencil"
          title="Редактировать заметку"
          @click="showDialogEditNote()"
        ></button>
        <div class="d-flex">
          <button
            class="mdi mdi-delete"
            title="Удалить заметку"
            @click.stop="removeNote()"
          ></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NoteEditForm from './NoteEditForm.vue';
import MyDialog from './ui/MyDialog.vue';
import axios from 'axios';

export default {
  name: "Note",
  components:{
    NoteEditForm,
    MyDialog,
  },
  data() {
    return {
      visibleEditNote: false,
    };
  },
  props: {
    noteObject: {
      type: Object,
      default: {},
    },
  },
  methods: {
    handleClick() {
      this.$emit("click"); // Эмиссия события 'click', если необходимо
    },
    showDialogEditNote() {
      this.visibleEditNote = true;
    },
    editNote(note) {
      axios
        .patch(`http://localhost:8080/notes?id=${this.noteObject.id}`, note)
        .then((response) => {
          this.visibleEditNote = false;
          console.log(response.data);
        })
        .catch((error) => {
          if (error.response) {
            console.error("Response error:", error.response.data);
          } else if (error.request) {
            console.error("Request error:", error.request);
          } else {
            console.error("Error:", error.message);
          }
        });
    },
    removeNote() {
      axios
        .delete(`http://localhost:8080/notes?id=${this.noteObject.id}`)
        .then((response) => {
          this.$emit('note-deleted', this.noteObject.id);
        })
        .catch((error) => {
          if (error.response) {
            console.error("Response error:", error.response.data);
          } else if (error.request) {
            console.error("Request error:", error.request);
          } else {
            console.error("Error:", error.message);
          }
        });
    },
  },
};
</script>