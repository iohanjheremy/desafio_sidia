import os
import shutil
from django.core.management.base import BaseCommand
from django.conf import settings

OLD_DIRS = ["player_images"]  # pastas antigas

class Command(BaseCommand):
    help = "Remove imagens antigas duplicadas"

    def handle(self, *args, **kwargs):
        for dir_name in OLD_DIRS:
            dir_path = os.path.join(settings.MEDIA_ROOT, dir_name)
            if os.path.exists(dir_path):
                shutil.rmtree(dir_path)
                self.stdout.write(self.style.SUCCESS(f"Removida a pasta: {dir_path}"))
            else:
                self.stdout.write(f"Pasta não encontrada: {dir_path}")
