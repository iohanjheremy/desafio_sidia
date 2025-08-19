import csv
from django.core.management.base import BaseCommand
from players.models import Player

class Command(BaseCommand):
    help = "Importa os jogadores do CSV para a tabela Player"
    
    def add_arguments(self, parser):
        parser.add_argument("csv_file", type=str, help="Caminho do arquivo CSV")
        
    def handle(self, *args, **kwargs):
        csv_file = kwargs["csv_file"]
        
        with open(csv_file, newline='', encoding="utf-8") as f:
            reader = csv.DictReader(f)
            
            for row in reader:
                Player.objects.create(
                    sofifa_id = row["sofifa_id"],
                    player_url = row["player_url"],
                    short_name = row["short_name"],
                    long_name = row["long_name"],
                    age = row["age"],
                    club_name = row["club_name"],
                    league_name = row["league_name"],
                    nationality = row["nationality"],
                    player_positions = row["player_positions"],
                    overall = row["overall"],
                    real_face = row["real_face"],
                    potential = row["potential"],
                    value_eur = row["value_eur"]
                )
        self.stdout.write(self.style.SUCCESS("Importação concluída!"))