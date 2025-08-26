from rest_framework import serializers
from players.models import Player
class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = '__all__'

    real_face_local = serializers.SerializerMethodField()

    def get_real_face_local(self, obj):
        if obj.real_face_local:
            return f'/api/players/image/{obj.sofifa_id}/'  # usa endpoint para servir arquivo
        return '/placeholder.svg'