# Documentação da API REST de Jogadores do FIFA 21

## Visão Geral
Esta API REST oferece acesso abrangente aos dados de jogadores do FIFA 21 com recursos avançados de filtragem, ranking e formação de times.

## URL Base
```

http://localhost:8000/api/

````

## Endpoints

### 1. Listar Todos os Jogadores (com Paginação)
**GET** `/api/players/`
- **Descrição**: Lista todos os jogadores com suporte a paginação
- **Parâmetros**:
  - `page` (opcional): Número da página (padrão: 1)
  - `page_size` (opcional): Itens por página (padrão: 20, máx: 100)
- **Exemplo**: `/api/players/?page=2&page_size=50`

### 2. Obter Detalhes do Jogador
**GET** `/api/players/{sofifa_id}/`
- **Descrição**: Obtém informações detalhadas sobre um jogador específico, incluindo foto
- **Exemplo**: `/api/players/158023/`

### 3. Filtrar Jogadores
**GET** `/api/players/filter/`
- **Descrição**: Filtra jogadores por múltiplos critérios
- **Parâmetros**:
  - `short_name`: Filtrar por nome curto (correspondência parcial)
  - `long_name`: Filtrar por nome completo (correspondência parcial)
  - `club_name`: Filtrar por nome do clube
  - `league_name`: Filtrar por nome da liga
  - `nationality`: Filtrar por nacionalidade
  - `player_positions`: Filtrar por posição (ex: "ST", "CM", "GK")
  - `age_min`: Idade mínima
  - `age_max`: Idade máxima
  - `overall_min`: Nota geral mínima
  - `overall_max`: Nota geral máxima
- **Exemplo**: `/api/players/filter/?nationality=Brazil&player_positions=ST&overall_min=85`

### 4. Buscar Jogadores por Nome
**GET** `/api/players/search/`
- **Descrição**: Busca jogadores por nome (busca em nomes curtos e longos)
- **Parâmetros**:
  - `q`: Termo de busca
- **Exemplo**: `/api/players/search/?q=Messi`

### 5. Top K Jogadores
**GET** `/api/players/top-k/`
- **Descrição**: Obtém os Top K jogadores por nota geral com filtragem opcional
- **Parâmetros**:
  - `k`: Número de jogadores (padrão: 10)
  - `player_positions`: Filtrar por posição
  - `nationality`: Filtrar por nacionalidade
  - `league_name`: Filtrar por liga
  - `club_name`: Filtrar por clube
- **Exemplo**: `/api/players/top-k/?k=5&nationality=Argentina`

### 6. Top Jogadores por Critério
**GET** `/api/players/top-by-criteria/`
- **Descrição**: Obtém os Top K jogadores filtrados por um critério específico
- **Parâmetros**:
  - `k`: Número de jogadores (padrão: 10)
  - `criteria`: Tipo de critério ('position', 'nationality', 'league', 'club')
  - `value`: Valor do critério
- **Exemplos**:
  - `/api/players/top-by-criteria/?k=10&criteria=position&value=ST`
  - `/api/players/top-by-criteria/?k=5&criteria=league&value=Premier League`

### 7. Melhor Formação de Time
**GET** `/api/players/best-team/`
- **Descrição**: Obtém a melhor formação de time possível
- **Parâmetros**:
  - `formation`: Formação do time (padrão: '4-3-3')
  - `league_name`: Filtrar por liga (opcional)
  - `nationality`: Filtrar por nacionalidade (opcional)
- **Exemplo**: `/api/players/best-team/?league_name=La Liga`

## Formato da Resposta

Todos os endpoints retornam respostas em formato JSON com a seguinte estrutura:

### Objeto Jogador
```json
{
  "sofifa_id": 158023,
  "player_url": "[https://sofifa.com/player/158023](https://sofifa.com/player/158023)",
  "short_name": "L. Messi",
  "long_name": "Lionel Andrés Messi Cuccittini",
  "age": 34,
  "club_name": "Paris Saint-Germain",
  "league_name": "Ligue 1",
  "nationality": "Argentina",
  "player_positions": "RW, ST, CF",
  "overall": 93,
  "real_face": "[https://cdn.sofifa.net/players/158/023/21_120.png](https://cdn.sofifa.net/players/158/023/21_120.png)",
  "potential": 93,
  "value_eur": 95500000.0
}
````

### Resposta Paginada

```json
{
  "count": 18945,
  "next": "http://localhost:8000/api/players/?page=2",
  "previous": null,
  "results": [...]
}
```

## Tratamento de Erros

  - **404 Not Found**: Quando um ID de jogador não existe
  - **400 Bad Request**: Quando parâmetros inválidos são fornecidos
  - **500 Internal Server Error**: Para problemas do lado do servidor

## Exemplos de Uso

### Obter os 5 Melhores Jogadores Brasileiros

```
GET /api/players/top-k/?k=5&nationality=Brazil
```

### Obter o Melhor Time da Premier League

```
GET /api/players/best-team/?league_name=Premier League
```

### Buscar por Jogadores Chamados "Cristiano"

```
GET /api/players/search/?q=Cristiano
```

### Filtrar Jovens Talentos (Idade 18-22, Nota Geral 75+)

```
GET /api/players/filter/?age_min=18&age_max=22&overall_min=75
```

```
```