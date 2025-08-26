from django.contrib import admin
from django.utils.html import format_html
from .models import Player

@admin.register(Player)
class PlayerAdmin(admin.ModelAdmin):
    list_display = ('short_name', 'overall', 'club_name', 'league_name', 'image_preview')
    search_fields = ('short_name', 'long_name', 'club_name', 'league_name', 'overall')
    list_filter = ('overall', 'club_name', 'league_name', 'nationality')

    def image_preview(self, obj):
        if obj.real_face_local:
            # Usa a URL do ImageField
            return format_html('<img src="{}" width="50" height="50" style="object-fit: cover; border-radius: 50%;" />', obj.real_face_local.url)
        return "-"
    image_preview.short_description = "Foto"
