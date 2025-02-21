<template>
  <div>
    <div class="container-fluid">
      <div class="folders" style="padding-left: 2vw">
        <div class="col-md-11">
          <br />
          <h4>Папки</h4>
          <button id="btn-add-folder" @click="showDialogCreateFolder">
            Создать папку
          </button>
          <!-- eslint-disable -->
          <my-dialog v-model:show="visibleCreateFolder">
            <folder-create-form @create="createFolder" />
          </my-dialog>
          <ul v-if="folders.length > 0">
            <li v-for="folder in folders" :key="folder.id">
              <Folder :isParent="true" :folderObj="folder" @note-clicked="openEditor"></Folder>
            </li>
          </ul>

          <!-- <ul class="" v-if="folders.length > 0" style="padding-left: 0rem">
            <li
              class="folderItem"
              :class="{ active: folder.id == currentFolderId }"
              v-for="folder in parentFolders"
              :key="folder.id"
              @click.stop="setActiveFolder(folder, folder.id)"
            >
              <my-dialog v-model:show="visibleEditFolder">
                <folder-edit-form
                  :folder="currentEditFolder"
                  @edit="editFolder"
                />
              </my-dialog>
              <my-dialog v-model:show="visibleCreateNote">
                <note-create-form
                  :folder="currentEditFolder"
                  @create="createNote"
                />
              </my-dialog>
              <div class="d-flex flex-column" style="width: 100%">
                <div class="d-flex flex-row justify-content-between">
                  <span
                    :class="{ underlined: folder.id == currentFolderId }"
                    class="folder-name"
                  >
                    {{ folder.name }}
                  </span>
                  <div class="d-flex">
                    <button
                      class="mdi mdi-plus"
                      title="Добавить заметку"
                      @click="showDialogCreateNote(folder)"
                    ></button>
                    <button
                      class="mdi mdi-pencil"
                      title="Редактировать"
                      @click="showDialogEditFolder(folder)"
                    ></button>
                    <button
                      class="mdi mdi-delete"
                      title="Удалить"
                      @click.stop="removeFolder(folder)"
                    ></button>
                  </div>
                </div>
                <div
                  v-if="currentFolderId === folder.id"
                  class="d-flex flex-column"
                >
                  <ul
                    class=""
                    v-if="folders.length > 0"
                    style="padding-left: 1rem"
                  >
                    <li
                      class="subFolderItem flex-column d-flex"
                      :class="{ active: folder.id == currentSubFolderId }"
                      v-for="folder in subFolders"
                      :key="folder.id"
                      @click.stop="setActiveSubFolder(folder, folder.id)"
                    >
                      <div
                        class="d-flex flex-row justify-content-between"
                        v-if="folder.parentId === currentFolder.id"
                        style="width: 100%"
                      >
                        <span
                          :class="{
                            underlined: folder.id == currentSubFolderId,
                          }"
                          class="folder-name"
                        >
                          {{ folder.name }}
                        </span>
                        <div class="d-flex">
                          <button
                            class="mdi mdi-plus"
                            title="Добавить заметку"
                            @click="showDialogCreateNote(folder)"
                          ></button>
                          <button
                            class="mdi mdi-pencil"
                            title="Редактировать"
                            @click="showDialogEditFolder(folder)"
                          ></button>
                          <button
                            class="mdi mdi-delete"
                            title="Удалить"
                            @click.stop="removeFolder(folder)"
                          ></button>
                        </div>
                      </div>
                      <div v-if="currentSubFolderId === folder.id">
                        <ul
                          class=""
                          v-if="subNotes.length > 0"
                          style="padding-left: 0rem"
                        >
                          <li
                            class="noteItem"
                            :class="{ active: note.id == currentNoteId }"
                            v-for="note in subNotes"
                            :key="note.id"
                            @click="setActiveNote(note, note.id)"
                          >
                            <my-dialog v-model:show="visibleEditNote">
                              <note-edit-form
                                :note="currentEditNote"
                                @edit="editNote"
                              />
                            </my-dialog>
                            <div
                              class="d-flex flex-row justify-content-between"
                            >
                              {{ note.title }}
                              <div class="d-flex">
                                <button
                                  class="mdi mdi-pencil"
                                  title="Редактировать"
                                  @click="showDialogEditNote(note)"
                                ></button>
                                <div class="d-flex">
                                  <button
                                    class="mdi mdi-delete"
                                    title="Удалить"
                                    @click.stop="removeNote(note)"
                                  ></button>
                                </div>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </li>
                  </ul>
                </div>
                <div v-if="currentFolderId === folder.id">
                  <ul class="" v-if="notes.length > 0">
                    <li
                      class="noteItem"
                      :class="{ active: note.id == currentNoteId }"
                      v-for="note in notes"
                      :key="note.id"
                      @click="setActiveNote(note, note.id)"
                    >
                      <my-dialog v-model:show="visibleEditNote">
                        <note-edit-form
                          :note="currentEditNote"
                          @edit="editNote"
                        />
                      </my-dialog>
                      <div class="d-flex flex-row justify-content-between">
                        {{ note.title }}
                        <div class="d-flex">
                          <button
                            class="mdi mdi-pencil"
                            title="Редактировать"
                            @click="showDialogEditNote(note)"
                          ></button>
                          <div class="d-flex">
                            <button
                              class="mdi mdi-delete"
                              title="Удалить"
                              @click.stop="removeNote(note)"
                            ></button>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </li>
          </ul> -->
          <p v-else style="color: red">Список папок пуст</p>
        </div>
      </div>

      <my-dialog v-model:show="visibleImageEditor">
        <image-editor @create="addImage" />
      </my-dialog>
      <div class="note">
        <div v-if="editingNote">
          <main id="sample">
            <Editor
              api-key="fzfmewn1dktw5s01kgd9g3ud3wstjz3260x5fupjxzfpmarz"
              :init="{
                language: 'ru',
                plugins:
                  'preview importcss searchreplace autolink directionality code visualblocks visualchars image link media table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons searchreplace autosave',
                menubar: false,
                toolbar:
                  'undo redo | save | blocks fontfamily fontsize | bold italic underline strikethrough | align numlist bullist | link image | table media | lineheight outdent indent| forecolor backcolor removeformat | charmap emoticons | code  preview | print searchreplace | pagebreak anchor | ltr rtl | ImageEditor',
                selector: 'textarea',
                height: 630,
                setup: function (editor) {
                  editor.ui.registry.addButton('ImageEditor', {
                    icon: 'browse',
                    tooltip: 'Рисовалка',
                    onAction: function () {
                      showImageEditor();
                      currEditor = editor;
                    },
                  });
                  editor.ui.registry.addButton('save', {
                    icon: 'save',
                    tooltip: 'Сохранить заметку',
                    onAction: function () {
                      sendData();
                    },
                  });
                },
                // autoresize_overflow_padding: 50,
                height: this.sizeHieght,
              }"
              v-model="this.noteContent"
            />
          </main>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { marked } from "marked";
import JSZip from "jszip";
import FolderCreateForm from "../FolderCreateForm.vue";
import NoteCreateForm from "../NoteCreateForm.vue";
import MyDialog from "../ui/MyDialog.vue";
import Editor from "@tinymce/tinymce-vue";
import FolderEditForm from "../FolderEditForm.vue";
import NoteEditForm from "../NoteEditForm.vue";
import ImageEditor from "../ImageEditor.vue";
import { ExportPDF } from "./plugins/pdfExport.js";
import Folder from "../Folder.vue";

export default {
  components: {
    Folder,
    FolderCreateForm,
    MyDialog,
    Editor,
    FolderEditForm,
    NoteCreateForm,
    NoteEditForm,
    ImageEditor,
  },
  name: "NotesPage",
  data() {
    return {
      sizeWidth: "",
      sizeHieght: "",
      folders: [],
      selectedNote: null,
      editingNote: false,
      notes: [],
      subNotes: [],
      currentFolder: null,
      currentSubFolder: null,
      currentEditFolder: null,
      currentEditNote: null,
      currentFolderId: -1,
      currentSubFolderId: -1,
      visibleCreateFolder: false,
      currentNote: null,
      currentNoteId: -1,
      visibleCreateNote: false,
      visibleCreateNote: false,
      visibleEditFolder: false,
      visibleEditNote: false,
      visibleImageEditor: false,
      currEditor: "",
      noteContent: "",
    };
  },
  methods: {
    myExport(editor) {
      ExportPDF(editor);
    },
    openEditor(note) {
      this.selectedNote = note;
      this.editingNote = true;
      this.updateNoteContent();
    },
    setActiveFolder(folder, currentFolderId) {
      this.currentFolder = folder;
      this.currentFolderId = folder ? currentFolderId : -1;
      this.getNotesByFolder(currentFolderId);
    },
    setActiveSubFolder(folder, currentSubFolderId) {
      this.currentSubFolder = folder;
      this.currentSubFolderId = folder ? currentSubFolderId : -1;
      this.getNotesByFolder(currentSubFolderId);
    },
    setActiveNote(note, id) {
      this.currentNote = note;
      this.currentNoteId = note ? id : -1;
      this.updateNoteContent();
    },
    showDialogCreateFolder() {
      this.visibleCreateFolder = true;
    },
    showDialogCreateNote(folder) {
      this.currentEditFolder = folder;
      this.visibleCreateNote = true;
    },
    showDialogEditFolder(folder) {
      this.currentEditFolder = folder;
      this.visibleEditFolder = true;
    },
    showDialogEditNote(note) {
      this.currentEditNote = note;
      this.visibleEditNote = true;
    },
    showImageEditor() {
      this.visibleImageEditor = true;
    },

    getFoldersByUser() {
      axios
        .get("http://localhost:8080/folders/parentFolders", {
          withCredentials: true,
        })
        .then((response) => {
          this.folders = response.data.sort((a, b) =>
            a.name.localeCompare(b.name, { sensitivity: "base" })
          );
        })
        .catch((error) => {
          if (error.response) {
            console.log("Response error:", error.response.data);
            console.log(error.response);
          } else if (error.request) {
            console.log("Request error:", error.request);
          } else {
            console.log("Error:", error.message);
          }
        });
    },
    editFolder(folder) {
      axios
        .patch(`http://localhost:8080/folders?id=${folder.id}`, folder)
        .then((response) => {
          this.getFoldersByUser();
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
    createFolder(folder) {
      if (folder.name != "" && folder.name.length >= 3) {
        axios
          .post("http://localhost:8080/folders", folder)
          .then((response) => {
            this.getFoldersByUser();
            this.visibleCreateFolder = false;
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
        this.visibleCreateFolder = false;
      }
    },
    removeFolder(folder) {
      axios
        .delete(`http://localhost:8080/folders?id=${folder.id}`)
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

    getNotesByFolder(id) {
      axios
        .get(`http://localhost:8080/folders/${id}/notes`)
        .then((response) => {
          if (id === this.currentFolderId) {
            this.notes = response.data;
          } else {
            this.subNotes = response.data;
          }
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
          this.getNotesByFolder();
          this.visibleCreateNote = false;
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
    editNote(note) {
      axios
        .patch(`http://localhost:8080/notes?id=${note.id}`, note)
        .then((response) => {
          this.getNotesByFolder();
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
    removeNote(note) {
      axios
        .delete(`http://localhost:8080/notes?id=${note.id}`)
        .then((response) => {
          this.getNotesByFolder();
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
    async sendData() {
      const encode = await this.convertAndZip(this.noteContent);
      const data = {
        id: this.currentNote.id,
        title: this.currentNote.title,
        content: encode,
        folder_id: this.currentNote.folder_id,
      };
      await axios
        .patch(`http://localhost:8080/notes?id=${data.id}`, data)
        .then((response) => {
          this.getNotesByFolder();
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

    async convertAndZip(noteHTML) {
      try {
        // 1. Конвертировать HTML в Markdown
        const markdownContent = marked(noteHTML);
        // 2. Конвертировать Markdown в Base64
        const base64Content = btoa(
          unescape(encodeURIComponent(markdownContent))
        );
        // 3. Упаковать в архив
        const zip = new JSZip();
        zip.file("note.md", base64Content); // можно использовать .md как расширение файла
        const zipContent = await zip.generateAsync({ type: "base64" });
        // 4. Поместить результат в поле content объекта
        // console.log("Заметка успешно упакована в архив:", this.zipContent);
        return zipContent;
      } catch (error) {
        console.error("Ошибка при обработке заметки:", error);
      }
    },
    async unpackAndConvert(noteObject) {
      try {
        // 1. Декодировать Base64 из content в бинарный формат
        const binaryContent = atob(noteObject.content);
        // 2. Распаковать ZIP
        const zip = new JSZip();
        const zipObject = await zip.loadAsync(binaryContent);
        // 3. Получить файл note.md из ZIP
        const markdownBase64 = await zipObject.file("note.md").async("string");
        // 4. Декодировать Base64 в Markdown
        const markdownContent = String(
          decodeURIComponent(escape(atob(markdownBase64)))
        );
        // Возврат к исходному HTML
        return markdownContent;
      } catch (error) {
        console.error("Ошибка при распаковке и конвертации заметки:", error);
      }
    },
    //Распаковка и конвертирование содержимого заметки
    async updateNoteContent() {
      if (this.selectedNote.content !== "") {
        this.noteContent = await this.unpackAndConvert(this.selectedNote);
      } else this.noteContent = "";
    },
    addImage(dataURL) {
      this.visibleImageEditor = false;
      // this.currEditor.insertContent(`<img src=http://localhost:8080/notes/${this.currentNote.id}/image/9ea03f56-a0bd-46dc-8561-30c6e8f3d79f>`);
      axios
        .post(`http://localhost:8080/notes/${this.currentNote.id}/image`, {
          img: `${dataURL}`,
        })
        .then((response) => {
          this.editNote(this.currentNote); // ??
          this.visibleImageEditor = false;
          console.log(response.data);
          this.currEditor.insertContent(
            `<img src=http://localhost:8080/notes/${this.currentNote.id}/image/${response.data}>`
          );
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
    showWarning(event) {
      const message =
        "Вы действительно хотите покинуть эту страницу? Ваши изменения могут не сохраниться.";
      event.returnValue = message; // Для некоторых браузеров
      return message; // Для других браузеров
    },
  },
  // computed: {
  //   parentFolders() {
  //     return this.folders.filter((folder) => folder.parentId == null);
  //   },
  //   subFolders() {
  //     return this.folders.filter((folder) => folder.parentId !== null);
  //   },
  // },
  mounted() {
    this.getFoldersByUser();
    this.sizeWidth = window.innerWidth - (25 * window.innerWidth) / 100;
    this.sizeHieght = window.innerHeight - 60;
    window.addEventListener("beforeunload", this.showWarning);
  },
  beforeDestroy() {
    window.removeEventListener("beforeunload", this.showWarning);
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
  /* width: 90%; */
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: static;
  margin: 5px;
}
.subFolderItem {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: static;
  margin: 5px;
  width: 98%;
}
.folder-name {
  cursor: pointer;
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
/* .folderItem.active {
  background-color: #00ff66;
  color: white;
} */
.underlined {
  text-decoration: underline;
}
.noteItem {
  list-style-type: none;
}
#sample {
  width: 92%;
  height: 100%;
}
</style>