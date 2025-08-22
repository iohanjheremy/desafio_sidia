import csv
from django.core.management.base import BaseCommand
from players.models import Player

class Command(BaseCommand):
    help = "Importa jogadores do CSV e popula tabela com sofifa_id (int) + demais campos"

    def add_arguments(self, parser):
        parser.add_argument("csv_file", type=str, help="Caminho do arquivo CSV de jogadores")

    def handle(self, *args, **kwargs):
        csv_file = kwargs["csv_file"]

        with open(csv_file, newline="", encoding="utf-8") as f:
            reader = csv.DictReader(f)

            for row in reader:
                try:
                    sofifa_id = int(row["sofifa_id"])  # força int
                except ValueError:
                    self.stdout.write(self.style.ERROR(f"ID inválido: {row['sofifa_id']}"))
                    continue

                Player.objects.update_or_create(
                    sofifa_id=sofifa_id,
                    defaults={
                        "player_url": row.get("player_url"),
                        "short_name": row.get("short_name"),
                        "long_name": row.get("long_name"),
                        "age": row.get("age"),
                        "club_name": row.get("club_name"),
                        "league_name": row.get("league_name"),
                        "nationality": row.get("nationality"),
                        "player_positions": row.get("player_positions"),
                        "overall": row.get("overall"),
                        "potential": row.get("potential"),
                        "value_eur": row.get("value_eur"),
                        "real_face_local": f"https://cdn.sofifa.net/players/{str(sofifa_id).zfill(6)}/25_120.png",
                    },
                )

        self.stdout.write(self.style.SUCCESS("✅ Importação concluída com sucesso!"))
