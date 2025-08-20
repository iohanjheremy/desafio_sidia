import pytest
from rest_framework.test import APIClient

@pytest.mark.django_db
def test_best_team_11_players(sample_players):
    client = APIClient()
    response = client.get("/api/players/best-team/?league_name=Spain")
    assert response.status_code == 200
    data = response.json()
    results = data if isinstance (data, list) else data.get("results", data)
    # Devolve até 11 jogadores, sem duplicados
    sofifa_ids = [p["sofifa_id"] for p in results]
    assert len(sofifa_ids) == len(set(sofifa_ids))
    assert len(data) <= 11

@pytest.mark.django_db
def test_best_team_filter_nationality(sample_players):
    client = APIClient()
    response = client.get("/api/players/best-team/?nationality=Spain")
    data = response.json()
    results = data if isinstance (data, list) else data.get("results", data)
    for player in results:
        assert player["nationality"] == "Spain"
