import pytest
from rest_framework.test import APIClient

@pytest.mark.django_db
def test_players_list(sample_players):
    client = APIClient()
    response = client.get("/api/players/")
    assert response.status_code == 200
    data = response.json()
    results = data if isinstance(data, list) else data.get("results", data)
    
    # Apenas garante que todos os jogadores da fixture estão na resposta
    sofifa_ids_fixture = {p.sofifa_id for p in sample_players}
    sofifa_ids_response = {p["sofifa_id"] for p in results}
    assert sofifa_ids_fixture.issubset(sofifa_ids_response)


@pytest.mark.django_db
def test_players_filter_age(sample_players):
    client = APIClient()
    response = client.get("/api/players/?age_min=27&age_max=35")
    data = response.json()
    results = data if isinstance (data, list) else data.get("results", data)
    
    # Verifica que todos os jogadores retornados estão no intervalo de idade
    for player in results:
        age = player.get("age")
        assert age is not None, f"Jogador {player.get('short_name')} não possui idade"
        assert 27 <= age <= 35, f"Jogador {player.get('short_name')} fora do intervalo: {age}"

    # Opcional: garante que pelo menos um jogador do intervalo foi retornado
    assert len(results) > 0, "Nenhum jogador encontrado no intervalo de idade 27-35"