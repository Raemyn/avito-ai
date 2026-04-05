# 🚀 Запуск проекта

Проект находится в папке `avito-ai`.

---

## 📦 Установка

```bash
cd avito-ai
npm install
```

Установка зависимостей сервера:

```bash
cd server
npm install
```

Установка зависимостей Ai olama:

```bash
ollama pull llma3.2
```

---
## ▶️ Запуск

Откройте **3 терминала**.

---

### 1. Frontend (корень проекта)

```bash
cd avito-ai
npm run dev
```

---

### 2. Backend (server)

```bash
cd avito-ai/server
npm start
```

---

### 3. AI (Ollama)

```bash
cd avito-ai
ollama serve
```

---

## 🌐 После запуска

* Frontend: http://localhost:5173
* Backend: http://localhost:3000

