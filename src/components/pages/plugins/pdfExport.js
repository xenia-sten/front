import { PageBreak } from 'ckeditor5';
import html2pdf from 'html2pdf.js';

export async function ExportPDF(editor) {
  // Получаем содержимое редактора
  var content = editor.getContent();

  // Создаем экземпляр jsPDF
  const container = document.createElement('html');
  container.innerHTML += content;

  // Создание элемента <style>
  const style = document.createElement('style');
  style.textContent = `
    p {
        page-break-inside: avoid;
    }
`;
  // Добавление стилей в контейнер
  container.appendChild(style);

  // Загрузка изображений и преобразование в Base64
  let images = container.getElementsByTagName('img');
  for (let img of images) {
    if (img.src) {
      const base64 = await toBase64(img.src);
      img.src = base64;
    }
  }

  console.log(container);
  // Добавляем содержимое в PDF

  // Убираем лишние отступы
  container.style.margin = '0'; // Устанавливаем отступы в 0
  container.style.padding = '0';

  const options = {
    margin: [0.5, 0.5, 0.5, 0.5],
    filename: 'doc.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: 'avoid' },

  };

  const worker = html2pdf();
  worker
    .set(options)
    .from(container)
    .save();
}

// Функция для преобразования изображения в Base64
function toBase64(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(xhr.response);
    };
    xhr.onerror = () => reject('Error loading image');
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  });
}