<template>
  <div>
    <div>
      <div class="d-flex flex-row justify-content-between">
        <span @click="onTitleClick">{{ folderObj.name }}</span>
        <div class="d-flex">
          <button
            v-if="isParent"
            class="mdi mdi-folder-plus"
            title="Добавить подпапку"
            @click="onSubfolderAdd">
          </button>
          <button
            class="mdi mdi-plus"
            title="Добавить заметку"
          ></button>
          <button
            class="mdi mdi-pencil"
            title="Редактировать"
          ></button>
          <button
            class="mdi mdi-delete"
            title="Удалить"
          ></button>
        </div>
      </div>
    </div>
    <div v-if="isOpen && content.isLoaded">
      <ul>
        <li v-for="folder in content.folderContent.subfolders" :key="folder.id">
          <Folder :isParent="false" :folderObj="folder"></Folder>
        </li>
      </ul>
      <ul>
        <p v-for="note in content.folderContent.notes" :key="note.id" >
          <Note :noteObject="note" @click="handleNoteClick(note)"></Note>
        </p>
      </ul>
    </div>
  </div>
</template>

<script>
import Note from "./Note.vue";
import axios from "axios";

export default {
  name: "Folder",
  components: {
    Note,
  },
  data() {
    return {
      isOpen: false,
      content: {
        isLoaded: false,
        folderContent: {
          subfolders: [],
          notes: [],
        },
      },
    };
  },
  props: {
    folderObj: {
      type: Object,
      default: {},
    },
    isParent: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onTitleClick() {
      this.isOpen = !this.isOpen;
      if (!this.content.isLoaded) {
        this.loadContent();
      }
    },
    async loadContent() {
      if(this.isParent){
        const folderRes = await axios.get(`http://localhost:8080/folders/${this.folderObj.id}`);
        this.content.folderContent.subfolders = folderRes.data;
      }
      const notesRes = await axios.get(`http://localhost:8080/folders/${this.folderObj.id}/notes`);
      this.content.folderContent.notes = notesRes.data;
      this.content.isLoaded = true;      
    },
    onSubfolderAdd() {
      if (!this.content.isLoaded) {
        return;
      }
      this.content.folderContent.subfolders.push({
        title: "новая подпапка",
      });
    },
    handleNoteClick(note) {
      this.$emit('note-clicked', note); // Эмиссия события с заметкой
    }
  },
};
</script>

<style scoped>
</style>