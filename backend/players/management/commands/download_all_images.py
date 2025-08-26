import os
import requests
from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from players.models import Player
from django.conf import settings
from concurrent.futures import ThreadPoolExecutor, as_completed

class Command(BaseCommand):
    help = "Baixa imagens remotas e atualiza real_face_local no ImageField com paralelismo"

    def handle(self, *args, **kwargs):
        players = Player.objects.all()
        count_updated = 0
        count_skipped = 0

        def process_player(player):
            result = {"id": player.sofifa_id, "status": "skipped"}
            if not player.real_face:
                sofifa_id_str = str(player.sofifa_id).zfill(6)
                year = sofifa_id_str[:3]
                rest = sofifa_id_str[3:]
                player.real_face = f"https://cdn.sofifa.net/players/{year}/{rest}/21_120.png"
                player.save()

            try:
                resp = requests.get(player.real_face, timeout=10)
                if resp.status_code == 200:
                    filename = f"{player.sofifa_id}.png"
                    player.real_face_local.save(filename, ContentFile(resp.content), save=True)
                    result["status"] = "updated"
                else:
                    result["status"] = f"HTTP {resp.status_code}"
            except Exception as e:
                result["status"] = f"error: {e}"
            return result

        with ThreadPoolExecutor(max_workers=10) as executor:
            futures = {executor.submit(process_player, player): player for player in players}
            for future in as_completed(futures):
                result = future.result()
                sofifa_id = result["id"]
                status = result["status"]
                if status == "updated":
                    count_updated += 1
                    self.stdout.write(f"[{sofifa_id}] Imagem atualizada.")
                else:
                    count_skipped += 1
                    self.stdout.write(f"[{sofifa_id}] Pulado ({status}).")

        self.stdout.write(self.style.SUCCESS(
            f"Concluído: {count_updated} imagens atualizadas, {count_skipped} jogadores pulados."
        ))
