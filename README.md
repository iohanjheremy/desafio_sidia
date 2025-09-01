# Fifa21 App

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
git clone https://github.com/iohanjheremy/desafio_sidia.git
cd 
````

---

### 3. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto, exemplo:

```env
# Banco de dados
POSTGRES_DB=fifa21
POSTGRES_USER=fifauser
POSTGRES_PASSWORD=fifapass
POSTGRES_HOST=db
POSTGRES_PORT=5432

# Backend
DJANGO_SECRET_KEY=sua_chave_secreta_aqui
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=*

# Frontend
VITE_API_URL=http://localhost:8000/api
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
python manage.py createsuperuser  # criar usuário admin
python manage.py import_players /app/data/players_21.csv  # importar jogadores
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
* Para jogadores famosos (Messi, CR7, Mbappé), as imagens foram armazenadas localmente em `/public/player_images`.

---

## 📄 Licença

Este projeto é open-source sob a licença MIT.

```

---

👉 Quer que eu adicione também **uma seção sobre como popular o banco de imagens locais (Messi, CR7, Mbappé, etc.)** para não depender do Sofifa em produção?
```
