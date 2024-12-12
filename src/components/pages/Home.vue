<template>
  <div class="container">
    <header class="jumbotron">
      <h3>Home page</h3>
      <br />
      <h5>Доступна всем</h5>
    </header>
    <div>
      <h2>Создание заметки</h2>
      <button @click="convertAndZip">Конвертировать и упаковать заметку</button>
      <div>
        <h3>Результат:</h3>
        <pre>{{ noteObject.content }}</pre>
      </div>
      <button @click="unpackAndConvert">
        Распаковать и восстановить заметку
      </button>
      <div>
        <h3>Результат:</h3>
        <pre>{{ noteHTML }}</pre>
      </div>
    </div>
  </div>
</template>

<script>
import { marked } from "marked";
import JSZip from "jszip";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Home",
  data() {
    return {
      noteHTML: "<h1>My Note</h1>",
      noteObject: {
        content: "",
      },
    };
  },
  methods: {
    async convertAndZip() {
      try {
        // 1. Конвертировать HTML в Markdown
        const markdownContent = marked(this.noteHTML);

        // 2. Конвертировать Markdown в Base64
        const base64Content = btoa(
          unescape(encodeURIComponent(markdownContent))
        );

        // 3. Упаковать в архив
        const zip = new JSZip();
        zip.file("note.md", base64Content); // вы можете использовать .md как расширение файла

        const zipContent = await zip.generateAsync({ type: "base64" });

        // 4. Поместить результат в поле content объекта
        this.noteObject.content = zipContent;

        console.log(
          "Заметка успешно упакована в архив:",
          this.noteObject.content
        );
      } catch (error) {
        console.error("Ошибка при обработке заметки:", error);
      }
    },
    async unpackAndConvert() {
      try {
        // 1. Декодировать Base64 из content в бинарный формат
        const binaryContent = atob(this.noteObject.content);

        // 2. Распаковать ZIP
        const zip = new JSZip();
        const zipObject = await zip.loadAsync(binaryContent);

        // 3. Получить файл note.md из ZIP
        const markdownBase64 = await zipObject.file("note.md").async("string");

        // 4. Декодировать Base64 в Markdown
        const markdownContent = decodeURIComponent(
          escape(atob(markdownBase64))
        );

        // 5. Конвертировать Markdown в HTML
        const htmlContent = marked(markdownContent);

        // Возврат к исходному HTML
        this.noteHTML = htmlContent;

        console.log(
          "Заметка успешно распакована и восстановлена:",
          this.noteHTML
        );
      } catch (error) {
        console.error("Ошибка при распаковке и конвертации заметки:", error);
      }
    },
  },
};
</script>

<style>
</style>