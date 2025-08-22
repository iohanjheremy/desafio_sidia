# players/management/commands/download_player_images.py

import os
import urllib.request
from django.core.management.base import BaseCommand
from django.conf import settings
from players.models import Player

class Command(BaseCommand):
    help = "Download all player images from real_face URLs and save to real_face_local"

    def handle(self, *args, **kwargs):
        players = Player.objects.all()
        total = players.count()
        self.stdout.write(f"Starting download for {total} players...")

        for i, player in enumerate(players, start=1):
            try:
                if player.real_face_local and os.path.exists(player.real_face_local.path):
                    self.stdout.write(f"[{i}/{total}] {player.short_name}: Already downloaded")
                    continue

                filename = f"{player.sofifa_id}.png"
                path = os.path.join(settings.MEDIA_ROOT, "players", filename)
                os.makedirs(os.path.dirname(path), exist_ok=True)

                urllib.request.urlretrieve(player.real_face, path)
                player.real_face_local.name = f"players/{filename}"
                player.save()
                self.stdout.write(f"[{i}/{total}] {player.short_name}: Downloaded successfully")

            except Exception as e:
                self.stderr.write(f"[{i}/{total}] {player.short_name}: Failed to download ({e})")
        
        self.stdout.write(self.style.SUCCESS("All downloads finished!"))
