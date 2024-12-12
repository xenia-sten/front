<template>
  <div>
    <div class="container-fluid">
      <div class="folders" style="padding-left: 1vw">
        <div class="col-md-11">
          <br />
          <h4>Папки</h4>
          <button id="btn-add-folder" @click="showDialogCreateFolder">
            Создать
          </button>
          <!-- eslint-disable -->
          <my-dialog v-model:show="visibleCreateFolder">
            <folder-create-form @create="createFolder" />
          </my-dialog>
          <ul class="" v-if="folders.length > 0">
            <li
              class="folderItem"
              :class="{ active: folder.id == currentFolderId }"
              v-for="folder in folders"
              :key="folder.id"
              @click="setActiveFolder(folder, folder.id)"
            >
              <div class="d-flex flex-column" style="width: 100%">
                <div class="d-flex flex-row justify-content-between">
                  {{ folder.name }}
                  <div class="d-flex">
                    <button
                      class="mdi mdi-plus"
                      title="Добавить заметку"
                      @click.stop="addNote(folder)"
                    ></button>
                    <button
                      class="mdi mdi-pencil"
                      title="Редактировать"
                      @click.stop="editFolder(folder)"
                    ></button>
                    <button
                      class="mdi mdi-delete"
                      title="Удалить"
                      @click.stop="removeFolder(folder)"
                    ></button>
                  </div>
                </div>
                <div v-if="currentFolderId === folder.id">
                  <ul class="" v-if="filteredNotes.length > 0">
                    <li
                      class=""
                      :class="{ active: note.id == currentNoteId }"
                      v-for="note in filteredNotes"
                      :key="note.id"
                      @click="setActiveNote(note, note.id)"
                    >
                      <div class="d-flex flex-row justify-content-between">
                        {{ note.title }}
                        <div class="d-flex">
                          <button
                            class="mdi mdi-delete"
                            title="Удалить"
                            @click.stop="removeNote(note)"
                          ></button>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </li>
          </ul>
          <h5 v-else style="color: red">Список папок пуст</h5>
        </div>
      </div>
      <div class="note">
        <div v-if="currentNote">
          <main id="sample">
            <Editor
              api-key="fzfmewn1dktw5s01kgd9g3ud3wstjz3260x5fupjxzfpmarz"
              :init="{
                plugins: 'lists link image table code help wordcount',
                menubar: false,
                toolbar:
                  'undo redo | styleselect | bold italic | link image | alignleft aligncenter alignright | bullist numlist outdent indent | charmap',
                selector: 'textarea',
                height: 630,
              }"
              v-model="this.currentNote.content"
            />
            <button id="btn-add-folder" @click="sendData">
              Сохранить данные
            </button>
          </main>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import FolderCreateForm from "../FolderCreateForm.vue";
import MyDialog from "../ui/MyDialog.vue";
import Editor from "@tinymce/tinymce-vue";

export default {
  components: { FolderCreateForm, MyDialog, Editor },
  name: "NotesPage",
  data() {
    return {
      folders: [
        {
          id: 1,
          name: "Folder 1",
          parent: null,
        },
        {
          id: 2,
          name: "Folder 2",
          parent: null,
        },
      ],
      notes: [
        {
          id: 1,
          folder_id: 1,
          title: "Заметка1",
          content: "<p><strong>ЧТо-то</strong></p>",
        },
        {
          id: 2,
          folder_id: 2,
          title: "Заметка2",
          content: "что-то там",
        },
      ],
      currentFolder: null,
      currentFolderId: -1,
      visibleCreateFolder: false,
      currentNote: null,
      currentNoteId: -1,
      visibleCreateNote: false,
      content: "",
    };
  },
  methods: {
    setActiveFolder(folder, currentFolderId) {
      this.currentFolder = folder;
      this.currentFolderId = folder ? currentFolderId : -1;
      // this.getCategoriesByJob();
    },
    setActiveNote(note, id) {
      this.currentNote = note;
      this.currentNoteId = note ? id : -1;
    },
    showDialogCreateFolder() {
      this.visibleCreateFolder = true;
    },
    getFoldersByUser() {
      axios
        .get("http://localhost:8080/folders", {
          withCredentials: true, // Включает отправку кук
        })
        .then((response) => {
          this.folders = response.data;
        })
        .catch((error) => {
          if (error.response) {
            // Запрос был сделан, и сервер ответил кодом статуса, который выходит за пределы диапазона 2xx
            console.log("Response error:", error.response.data);
            console.log(error.response);
          } else if (error.request) {
            // Запрос был сформирован, но ответ не был получен
            console.log("Request error:", error.request);
          } else {
            // Произошла ошибка при настройке запроса
            console.log("Error:", error.message);
          }
        });
    },
    editFolder(folder) {
      axios
        .patch("http://localhost:8080/folders", folder)
        .then((response) => {
          this.getFoldersByUser();
          console.log(response.data);
        })
        .catch((error) => {
          if (error.response) {
            // Запрос был сделан, и сервер ответил кодом статуса, который выходит за пределы диапазона 2xx
            console.error("Response error:", error.response.data);
          } else if (error.request) {
            // Запрос был сформирован, но ответ не был получен
            console.error("Request error:", error.request);
          } else {
            // Произошла ошибка при настройке запроса
            console.error("Error:", error.message);
          }
        });
    },
    createFolder(folder) {
      if (folder.name != "" && folder.name.length >= 3) {
        // axios
        //   .post("http://localhost:8080/folders", folder)
        //   .then((response) => {
        //     this.getFoldersByUser();
        //     this.visibleCreateFolder = false;
        //     console.log(response.data);
        //   })
        //   .catch((error) => {
        //     if (error.response) {
        //       // Запрос был сделан, и сервер ответил кодом статуса, который выходит за пределы диапазона 2xx
        //       console.error("Response error:", error.response.data);
        //     } else if (error.request) {
        //       // Запрос был сформирован, но ответ не был получен
        //       console.error("Request error:", error.request);
        //     } else {
        //       // Произошла ошибка при настройке запроса
        //       console.error("Error:", error.message);
        //     }
        //   });
        this.folders.push({
          id: 111,
          name: folder.name,
          parent: folder.parent,
        });
        this.visibleCreateFolder = false;
      } else alert("Название должно быть более 3-х символов");
    },
    removeFolder(folder) {
      axios
        .delete("http://localhost:8080/folders", folder.id)
        .then((response) => {
          this.getFoldersByUser();
          console.log(response.data);
        })
        .catch((error) => {
          if (error.response) {
            // Запрос был сделан, и сервер ответил кодом статуса, который выходит за пределы диапазона 2xx
            console.error("Response error:", error.response.data);
          } else if (error.request) {
            // Запрос был сформирован, но ответ не был получен
            console.error("Request error:", error.request);
          } else {
            // Произошла ошибка при настройке запроса
            console.error("Error:", error.message);
          }
        });
    },

    sendData() {
      console.log(this.currentNote.content);
    },
  },
  mounted() {
    this.getFoldersByUser();
  },
  computed: {
    filteredNotes() {
      console.log("Current Folder ID:", this.currentFolderId);
      return this.notes.filter(
        (note) => note.folder_id === this.currentFolderId
      );
    },
  },
};
</script>

<style scoped>
.cont {
  display: flex; /* Используем Flexbox */
  height: 100vh;
}
.folders {
  position: fixed; /* Фиксируем элемент */
  top: 7.8vh; /* Прилегает к верхней части экрана */
  left: 0; /* Прилегает к левой части экрана */
  width: 24vw; /* Фиксированная ширина панели */
  height: 100vh; /* Высота на всю высоту экрана */
  /* background-color: rgb(209, 232, 240); */
  z-index: 1;
}
.note {
  position: fixed;
  top: 7.8vh;
  margin-left: 17.4vw; /* Сдвигаем основное содержимое вправо, чтобы оно не перекрывалось с боковой панелью */
  height: 100vh; /* Также задаем высоту на всю высоту экрана для основного содержимого */
  width: 80vw;
}
.folderItem {
  /* border: 2px solid #343a40; */
  width: 90%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: static;
  margin-bottom: 5%;
}
#btn-add-folder {
  border: 1px solid #488acc;
  border-radius: 3px;
  box-shadow: 2px 4px 3px rgba(79, 79, 79, 0.204);
  background-color: rgb(153, 212, 231); /* Цвет фона */
  padding: 3px;
  margin-bottom: 10px;
}
.mdi {
  margin-left: 8px;
}
.folderItem.list-group-item.active {
  /* Ваши стили здесь */
  background-color: #00ff66; /* Пример: фон голубого цвета */
  color: white; /* Пример: белый текст */
}

#sample {
  width: 92%;
  height: 100%;
}
/* @media (min-width: 1024px) {
  #sample {
    display: flex;
    flex-direction: column;
    place-items: center;
    width: 100%;
  }
} */
</style>