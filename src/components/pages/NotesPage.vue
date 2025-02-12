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
                  {{ folder.name }}
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
                <div v-if="currentFolderId === folder.id">
                  <ul class="">
                    <li
                      class=""
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
                language: 'ru',
                plugins:
                  'preview importcss searchreplace autolink directionality code visualblocks visualchars image link media table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons ',
                menubar: false,
                toolbar:
                  'undo redo | save | blocks fontfamily fontsize | bold italic underline strikethrough | align numlist bullist | link image | table media | lineheight outdent indent| forecolor backcolor removeformat | charmap emoticons | code  preview | print | pagebreak anchor | ltr rtl | ExportPdf',
                // save_onsavecallback: sendData(),
                selector: 'textarea',
                height: 630,
                setup: function (editor) {
                  editor.ui.registry.addButton('ExportPdf', {
                    text: 'ExportPdf',
                    icon: 'export-pdf',
                    onAction: function () {
                      myExport(editor);
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
                height: this.size,
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
import { ExportPDF } from "./plugins/pdfExport.js";

export default {
  components: {
    FolderCreateForm,
    MyDialog,
    Editor,
    FolderEditForm,
    NoteCreateForm,
    NoteEditForm,
  },
  name: "NotesPage",
  data() {
    return {
      size: 685,
      folders: [],
      notes: [],
      currentFolder: null,
      currentEditFolder: null,
      currentEditNote: null,
      currentFolderId: -1,
      visibleCreateFolder: false,
      currentNote: null,
      currentNoteId: -1,
      visibleCreateNote: false,
      visibleCreateNote: false,
      visibleEditFolder: false,
      visibleEditNote: false,
      noteContent: "",
    };
  },
  methods: {
    myExport(editor) {
      ExportPDF(editor);
    },
    setActiveFolder(folder, currentFolderId) {
      this.currentFolder = folder;
      this.currentFolderId = folder ? currentFolderId : -1;
      this.getNotesByFolder();
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

    getFoldersByUser() {
      axios
        .get("http://localhost:8080/folders", {
          withCredentials: true,
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

    getNotesByFolder() {
      axios
        .get(`http://localhost:8080/folders/${this.currentFolderId}/notes`)
        .then((response) => {
          this.notes = response.data;
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
        // console.log(typeof markdownContent);

        // Возврат к исходному HTML
        return markdownContent;
      } catch (error) {
        console.error("Ошибка при распаковке и конвертации заметки:", error);
      }
    },

    async updateNoteContent() {
      if (this.currentNote.content !== "") {
        this.noteContent = await this.unpackAndConvert(this.currentNote);
      } else this.noteContent = "";
    },
  },
  mounted() {
    this.getFoldersByUser();
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
  background-color: #00ff66; /* Пример: фон голубого цвета */
  color: white; /* Пример: белый текст */
}

#sample {
  width: 92%;
  height: 100%;
}
</style>