# CSRF

Подробная инструкция с примерами кода для реализации защиты от CSRF на сервере, используя модуль `http` в Node.js. Для демонстрации будем использовать библиотеку `uuid` для генерации уникальных CSRF-токенов.

1. Установите библиотеку `uuid`, если она еще не установлена:

```bash
npm install uuid
```

2. Создайте файл `server.js` и добавьте следующий код:

```javascript
const http = require('http');
const { v4: uuidv4 } = require('uuid');

// Создаем пустой объект, который будет хранить CSRF-токены для каждого клиента
const csrfTokens = {};

const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    // Генерируем CSRF-токен для текущего клиента
    const csrfToken = uuidv4();

    // Сохраняем CSRF-токен в объекте csrfTokens
    csrfTokens[req.socket.remoteAddress] = csrfToken;

    // Отправляем токен клиенту в виде куки или в HTML форме
    res.setHeader('Set-Cookie', `csrfToken=${csrfToken}; HttpOnly; SameSite=Strict`);

    // Выводим HTML форму, которая будет отправлять POST-запрос с токеном
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <html>
      <head></head>
      <body>
        <form method="post" action="/submit">
          <input type="hidden" name="csrfToken" value="${csrfToken}">
          <button type="submit">Submit</button>
        </form>
      </body>
      </html>
    `);
  } else if (req.method === 'POST' && req.url === '/submit') {
    // Извлекаем CSRF-токен из запроса
    const cookies = req.headers.cookie.split('; ');
    const csrfCookie = cookies.find(cookie => cookie.startsWith('csrfToken='));
    if (!csrfCookie) {
      // Если токен отсутствует, возвращаем ошибку
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('CSRF Token Missing');
      return;
    }
    const csrfToken = csrfCookie.split('=')[1];

    // Проверяем соответствие токена
    if (csrfTokens[req.socket.remoteAddress] !== csrfToken) {
      // Если токен не совпадает, возвращаем ошибку
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('CSRF Token Invalid');
      return;
    }

    // Если токен совпадает, обрабатываем запрос
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('CSRF Token Valid');
  } else {
    // Все остальные запросы обрабатываются по-умолчанию
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

Этот код создает сервер, который генерирует CSRF-токен для каждого клиента при GET-запросе, сохраняет токен на сервере и отправляет его клиенту. При POST-запросе сервер проверяет, соответствует ли предоставленный токен сохраненному на сервере токену.

Помимо этого, обратите внимание на настройку кук `HttpOnly` и `SameSite`, чтобы повысить безопасность.

3. Запустите сервер:

```bash
node server.js
```

Теперь вы можете открыть браузер и перейти по адресу <http://localhost:3000>. Вы увидите форму, которая будет отправлять POST-запрос с CSRF-токеном на сервер.
