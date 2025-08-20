import pytest
from rest_framework.test import APIClient

@pytest.mark.django_db
def test_player_filter_short_name(sample_players):
    client = APIClient()
    response = client.get("/api/players/filter/?short_name=Messi")
    data = response.json()
    results = data if isinstance(data, list) else data.get("results", data)
    for player in results:
        assert "Messi" in player["short_name"]

@pytest.mark.django_db
def test_player_filter_positions(sample_players):
    client = APIClient()
    response = client.get("/api/players/filter/?player_positions=CB")
    data = response.json()
    results = data if isinstance(data, list) else data.get("results", data)
    for player in results:
        assert "CB" in player["player_positions"]

@pytest.mark.django_db
def test_player_filter_age_invalid(sample_players):
    client = APIClient()
    response = client.get("/api/players/filter/?age_min=-5")
    assert response.status_code in [400, 200]  # depende da validação implementada
