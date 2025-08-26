import os
from django.core.management.base import BaseCommand
from django.conf import settings
from players.models import Player

class Command(BaseCommand):
    help = "Normaliza os caminhos de real_face_local dos jogadores"

    MEDIA_SUBDIR = "players_images"  # pasta dentro de MEDIA_ROOT

    def handle(self, *args, **kwargs):
        players = Player.objects.all()
        count = 0

        os.makedirs(os.path.join(settings.MEDIA_ROOT, self.MEDIA_SUBDIR), exist_ok=True)

        for player in players:
            if not player.real_face_local:
                continue

            # Obtem o nome do arquivo
            filename = os.path.basename(player.real_face_local.name)
            relative_path = os.path.join(self.MEDIA_SUBDIR, filename)

            # Caminho absoluto do arquivo
            abs_path = os.path.join(settings.MEDIA_ROOT, relative_path)

            # Se o arquivo ainda não estiver na pasta correta, tenta mover ou copiar
            if not os.path.exists(abs_path):
                old_abs = player.real_face_local.path  # caminho absoluto original
                if os.path.exists(old_abs):
                    os.rename(old_abs, abs_path)
                else:
                    self.stdout.write(f"Arquivo não encontrado para {player.short_name}: {player.real_face_local}")
                    continue

            # Atualiza o campo no banco
            player.real_face_local.name = relative_path
            player.save()
            count += 1

        self.stdout.write(self.style.SUCCESS(f"Normalizados {count} jogadores"))
