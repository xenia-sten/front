<template>
  <div>
    <div>
      <my-dialog v-model:show="visibleCreateSubFolder">
        <folder-create-form :parentId="folderObj.id" @create="onSubfolderAdd" />
      </my-dialog>
      <my-dialog v-model:show="visibleEditFolder">
        <folder-edit-form :folder="folderObj" @edit="editFolder" />
      </my-dialog>
      <my-dialog v-model:show="visibleCreateNote">
        <note-create-form :folder="folderObj" @create="createNote" />
      </my-dialog>
      <div class="d-flex flex-row justify-content-between folderItem">
        <span
          @click="onTitleClick"
          class="folderTitle folder-name"
          :class="{
            underlined: isOpen,
          }"
          >{{ folderObj.name }}</span
        >
        <div class="d-flex">
          <button
            v-if="isParent"
            class="mdi mdi-folder-plus"
            title="Добавить подпапку"
            @click="showDialogCreateSubFolder()"
          ></button>
          <button
            class="mdi mdi-plus"
            title="Добавить заметку"
            @click="showDialogCreateNote()"
          ></button>
          <button
            class="mdi mdi-pencil"
            title="Редактировать папку"
            @click="showDialogEditFolder()"
          ></button>
          <button
            class="mdi mdi-delete"
            title="Удалить папку"
            @click="removeFolder()"
          ></button>
        </div>
      </div>
    </div>
    <div v-if="isOpen && content.isLoaded">
      <ul>
        <li v-for="folder in content.folderContent.subfolders" :key="folder.id">
          <Folder
            :isParent="false"
            :folderObj="folder"
            @note-clicked="$emit('note-clicked', $event)"
            @folder-removed="onFolderRemoved"
          ></Folder>
        </li>
      </ul>
      <ul>
        <div v-for="note in content.folderContent.notes" :key="note.id">
          <Note
            :noteObject="note"
            @click="handleNoteClick(note)"
            @note-deleted="handleNoteDeletion"
          ></Note>
        </div>
      </ul>
    </div>
  </div>
</template>

<script>
import Note from "./Note.vue";
import axios from "axios";
import MyDialog from "./ui/MyDialog.vue";
import FolderEditForm from "./FolderEditForm.vue";
import NoteCreateForm from "./NoteCreateForm.vue";
import FolderCreateForm from "./FolderCreateForm.vue";

export default {
  name: "Folder",
  components: {
    Note,
    MyDialog,
    FolderEditForm,
    NoteCreateForm,
    FolderCreateForm,
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
      visibleCreateSubFolder: false,
      visibleEditFolder: false,
      visibleCreateNote: false,
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
      if (this.isParent) {
        const folderRes = await axios.get(
          `http://localhost:8080/folders/${this.folderObj.id}`
        );
        this.content.folderContent.subfolders = folderRes.data;
      }
      const notesRes = await axios.get(
        `http://localhost:8080/folders/${this.folderObj.id}/notes`
      );
      this.content.folderContent.notes = notesRes.data;
      this.content.isLoaded = true;
    },
    editFolder(folder) {
      axios
        .patch(`http://localhost:8080/folders?id=${folder.id}`, folder)
        .then((response) => {
          this.visibleEditFolder = false;
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
    createNote(note) {
      axios
        .post("http://localhost:8080/notes", note)
        .then((response) => {
          this.visibleCreateNote = false;
          this.loadContent();
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
    removeFolder() {
      axios
        .delete(`http://localhost:8080/folders?id=${this.folderObj.id}`)
        .then((response) => {
          this.$emit("folder-removed", this.folderObj.id);
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
    onFolderRemoved(folderId) {
      this.content.folderContent.subfolders =
        this.content.folderContent.subfolders.filter(
          (folder) => folder.id !== folderId
        );
    },
    onSubfolderAdd(folder) {
      axios
        .post("http://localhost:8080/folders", folder)
        .then((response) => {
          this.loadContent();
          this.visibleCreateSubFolder = false;
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
      this.visibleCreateSubFolder = false;
    },
    handleNoteClick(note) {
      this.$emit("note-clicked", note);
    },
    showDialogCreateSubFolder() {
      this.visibleCreateSubFolder = true;
    },
    showDialogCreateNote() {
      this.visibleCreateNote = true;
    },
    showDialogEditFolder() {
      this.visibleEditFolder = true;
    },
    handleNoteDeletion(noteId) {
      console.log("Удаляется заметка с id:", noteId);
      this.$emit("note-deleted", noteId);
      this.content.folderContent.notes =
        this.content.folderContent.notes.filter((n) => n.id !== noteId);
    },
  },
};
</script>

<style scoped>
.folderItem {
}
.folder-name {
  cursor: pointer;
}
.underlined {
  text-decoration: underline;
}
ul {
  list-style-type: none;
  padding-left: 1rem;
}
</style>