import axios from 'axios';

// Создайте экземпляр Axios.
const apiClient = axios.create({
  withCredentials: true, // Важный параметр для отправки cookies с запросами, если требуется
});

// Добавьте интерсептор запроса для установки CSRF токена.
apiClient.interceptors.request.use(config => {
  const csrfToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('XSRF-TOKEN='))
    ?.split('=')[1]; // Это берёт значение токена

  console.log('CSRF Token:', csrfToken);
  // if (csrfToken) {
  //   const params = new URLSearchParams(config.params || {});
  //   params.append('_csrf', csrfToken);
  //   config.params = params;
  //   console.log('Параметры запроса:', config.params.toString());
  // }
  if (csrfToken) {
    config.headers['X-XSRF-TOKEN'] = csrfToken;
    console.log('Заголовки запроса:', config.headers);
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default apiClient;