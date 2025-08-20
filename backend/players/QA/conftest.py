import pytest
from players.models import Player

@pytest.fixture
def sample_players(db):
    """Cria jogadores de teste com todos os campos obrigatórios."""
    players = [
        Player(
            sofifa_id=158023,
            player_url="https://sofifa.com/player/158023",
            short_name="Messi",
            long_name="Lionel Messi",
            age=33,
            club_name="FC Barcelona",
            league_name="Spain Primera Division",
            nationality="Argentina",
            player_positions="RW, ST, CF",
            overall=93,
            real_face="https://cdn.sofifa.net/players/158/023/21_120.png",
            potential=93,
            value_eur=67500000
        ),
        Player(
            sofifa_id=155862,
            player_url="https://sofifa.com/player/155862",
            short_name="Ramos",
            long_name="Sergio Ramos",
            age=34,
            club_name="Real Madrid",
            league_name="Spain Primera Division",
            nationality="Spain",
            player_positions="CB",
            overall=89,
            real_face="https://cdn.sofifa.net/players/155/862/21_120.png",
            potential=89,
            value_eur=24500000
        ),
        Player(
            sofifa_id=200389,
            player_url="https://sofifa.com/player/200389",
            short_name="Oblak",
            long_name="Jan Oblak",
            age=27,
            club_name="Atlético Madrid",
            league_name="Spain Primera Division",
            nationality="Slovenia",
            player_positions="GK",
            overall=91,
            real_face="https://cdn.sofifa.net/players/200/389/21_120.png",
            potential=93,
            value_eur=75000000
        ),
        Player(
            sofifa_id=200145,
            player_url="https://sofifa.com/player/200145",
            short_name="Casemiro",
            long_name="Carlos Casemiro",
            age=28,
            club_name="Real Madrid",
            league_name="Spain Primera Division",
            nationality="Brazil",
            player_positions="CDM",
            overall=89,
            real_face="https://cdn.sofifa.net/players/200/145/21_120.png",
            potential=89,
            value_eur=59500000
        ),
        Player(
            sofifa_id=204963,
            player_url="https://sofifa.com/player/204963",
            short_name="Carvajal",
            long_name="Daniel Carvajal",
            age=28,
            club_name="Real Madrid",
            league_name="Spain Primera Division",
            nationality="Spain",
            player_positions="RB",
            overall=86,
            real_face="https://cdn.sofifa.net/players/204/963/21_120.png",
            potential=86,
            value_eur=38000000
        ),
    ]
    
    # Cria os jogadores no banco de dados de teste
    created_players = Player.objects.bulk_create(players)
    return created_players
