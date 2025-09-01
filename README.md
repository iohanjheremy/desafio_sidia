# FifaPlayers App

Plataforma para listagem e gerenciamento de jogadores, construída com **Django (backend)** e **React (frontend)**, rodando em containers **Docker**.  

## 🛠️ Tecnologias
- Docker & Docker Compose
- Django + DRF (Backend)
- React + Vite + TypeScript (Frontend)
- PostgreSQL (Banco de dados)
- TailwindCSS (Estilização)

---

## 🚀 Como rodar o projeto em outro PC

### 1. Pré-requisitos
- [Docker](https://docs.docker.com/get-docker/) instalado  
- [Docker Compose](https://docs.docker.com/compose/) instalado  
- Git instalado

---

### 2. Clonar o repositório
```bash
git clone https://github.com/iohanjheremy/fifa21_app.git
cd fifa21_app
````

---

### 3. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto, exemplo:

```env
POSTGRES_USER=admin
POSTGRES_PASSWORD=admin123
POSTGRES_DB=fifa21
DJANGO_SECRET_KEY=your_secret_key_here
DJANGO_DEBUG=True


DB_NAME=fifa21
DB_USER=admin
DB_PASSWORD=admin123
DB_HOST=db
DB_PORT=5432

VITE_BACKEND_PUBLIC_URL=http://localhost:8000
```

---

### 4. Subir os containers

```bash
docker-compose up --build
```

Isso vai iniciar:

* **Backend** em: `http://localhost:8000`
* **Frontend** em: `http://localhost:5173`
* **Banco de dados (Postgres)** em: `localhost:5432`

---

### 5. Inicializar o banco de dados

Abra o container do backend:

```bash
docker-compose exec backend bash
```

Dentro do container, rode:

```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py import_players /app/data/players_21.csv

mkdir -p media

python manage.py download_all_images
```

---

### 6. Acessar o projeto

* **Frontend:** [http://localhost:5173](http://localhost:5173)
* **Backend API (Swagger/DRF):** [http://localhost:8000/api](http://localhost:8000/api)

---

## 🧰 Comandos úteis

### Entrar no container backend

```bash
docker-compose exec backend bash
```

### Executar testes

```bash
docker-compose exec backend pytest
```

### Derrubar containers

```bash
docker-compose down
```

---

## 📌 Observações

* Algumas imagens de jogadores podem não existir na API do Sofifa.
* Para jogadores famosos (Messi, CR7, Mbappé), as imagens foram armazenadas localmente em `/media/players_images`.

---

## 📄 Licença

Este projeto é open-source sob a licença MIT.

