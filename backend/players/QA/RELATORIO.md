# **Relatório de Teste – Aplicação FIFA21**

## **1. Declaração Técnica**

Todos os testes automatizados foram executados com **pytest + Django + DRF**.
Incluem endpoints de:

* Listagem de jogadores
* Filtragem por campos (`short_name`, `player_positions`, `age_min/age_max`, etc.)
* Seleção do melhor time (`/api/players/best-team/`)
* Top-K jogadores por critérios específicos

**Conclusão técnica:**
O aplicativo **atende aos requisitos funcionais e de automação**, todos os testes passam.

---

## **2. Status dos Testes**

| Teste                                 | Endpoint / Função                           | Resultado |
| ------------------------------------- | ------------------------------------------- | --------- |
| test\_best\_team\_11\_players         | `/api/players/best-team/`                   | ✅ Pass    |
| test\_best\_team\_filter\_nationality | `/api/players/best-team/?nationality=Spain` | ✅ Pass    |
| test\_player\_filter\_short\_name     | `/api/players/filter/?short_name=Messi`     | ✅ Pass    |
| test\_player\_filter\_positions       | `/api/players/filter/?player_positions=CB`  | ✅ Pass    |
| test\_player\_filter\_age\_invalid    | `/api/players/filter/?age_min=xx`           | ✅ Pass    |
| test\_players\_list                   | `/api/players/`                             | ✅ Pass    |
| test\_players\_filter\_age            | `/api/players/?age_min=30&age_max=35`       | ✅ Pass    |

---

## **3. Bugs Identificados**
Nenhum bug crítico foi encontrado.  
**Possíveis pontos de atenção / baixa gravidade:**
1. **Warning `UnorderedObjectListWarning`**:  
   - Gravidade: Baixa  
   - Impacto: Nenhum impacto funcional, apenas alerta do DRF sobre ordenação de QuerySets paginados.  
   - Recomenda-se adicionar `ordering` nos endpoints paginados para evitar inconsistências futuras.

2. **Testes de idade exata**:  
   - Gravidade: Baixa  
   - Impacto: Nenhum no ambiente atual de teste, mas se os dados mudarem, filtros de idade podem gerar erros de assert.  
   - Recomenda-se validar filtros com múltiplos intervalos e dados de teste variados.

---

## **4. Observações Relevantes**

* **Warnings:** `UnorderedObjectListWarning` do DRF Pagination aparece, mas não impacta os testes.
* **Cobertura:** Todos os filtros e endpoints principais foram testados.
* **Fixtures:** `sample_players` garante consistência dos dados.

---

## **5. Conclusão Geral**

O sistema **cumpre integralmente os requisitos do desafio**:

* Todos os testes passaram ✅
* Automação implementada corretamente
* API funcional para listagem, filtros e best-team