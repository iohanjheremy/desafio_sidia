from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from .models import Player

class PlayerAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.player1 = Player.objects.create(
            name="Lionel Messi", team="PSG", league="Ligue 1", nationality="Argentina",
            position="RW", overall=93, picture_url="http://example.com/messi.jpg"
        )
        self.player2 = Player.objects.create(
            name="Cristiano Ronaldo", team="Manchester United", league="Premier League",
            nationality="Portugal", position="ST", overall=91, picture_url="http://example.com/ronaldo.jpg"
        )

    def test_list_players(self):
        response = self.client.get('/api/players/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_filter_players_by_name(self):
        response = self.client.get('/api/players/filter/', {'name': 'Lionel'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['name'], 'Lionel Messi')

    def test_top_k_players(self):
        response = self.client.get('/api/players/top-k/', {'k': 1})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['name'], 'Lionel Messi')

    def test_player_detail(self):
        response = self.client.get(f'/api/players/{self.player1.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Lionel Messi')
