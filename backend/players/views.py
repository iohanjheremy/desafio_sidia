import os
import urllib.request
from django.core.files import File
from django.http import HttpResponse
from django.views import View
from django.shortcuts import render
from rest_framework import generics, status
from django.conf import settings
from django.http import FileResponse
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q
from .models import Player
from .serializers import PlayerSerializer
from .pagination import StandardResultsSetPagination

# List all players (with pagination)
class PlayerListView(generics.ListAPIView):
    serializer_class = PlayerSerializer
    queryset = Player.objects.all()
    pagination_class = StandardResultsSetPagination

# Filter players by various criteria
class PlayerFilterView(generics.ListAPIView):
    serializer_class = PlayerSerializer
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        queryset = Player.objects.all()
        
        # Get all filter parameters
        short_name = self.request.query_params.get('short_name')
        long_name = self.request.query_params.get('long_name')
        club_name = self.request.query_params.get('club_name')
        league_name = self.request.query_params.get('league_name')
        nationality = self.request.query_params.get('nationality')
        player_positions = self.request.query_params.get('player_positions')
        age_min = self.request.query_params.get('age_min')
        age_max = self.request.query_params.get('age_max')
        overall_min = self.request.query_params.get('overall_min')
        overall_max = self.request.query_params.get('overall_max')
        
        # Apply filters
        if short_name:
            queryset = queryset.filter(short_name__icontains=short_name)
        if long_name:
            queryset = queryset.filter(long_name__icontains=long_name)
        if club_name:
            queryset = queryset.filter(club_name__icontains=club_name)
        if league_name:
            queryset = queryset.filter(league_name__icontains=league_name)
        if nationality:
            queryset = queryset.filter(nationality__icontains=nationality)
        if player_positions:
            queryset = queryset.filter(player_positions__icontains=player_positions)
            
        if age_min:
            try:
                age_min = int(age_min)
                queryset = queryset.filter(age__gte=age_min)
            except ValueError:
                pass
            
        if age_max:
            try:
                age_max = int(age_max)
                queryset = queryset.filter(age__lte=age_max)
            except ValueError:
                pass
            
        if overall_min:
            queryset = queryset.filter(overall__gte=overall_min)
        if overall_max:
            queryset = queryset.filter(overall__lte=overall_max)
            
        return queryset

# Top-K players with advanced filtering
class TopKPlayersView(generics.ListAPIView):
    serializer_class = PlayerSerializer
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        k = int(self.request.query_params.get('k', 10))
        player_positions = self.request.query_params.get('player_positions')
        nationality = self.request.query_params.get('nationality')
        league_name = self.request.query_params.get('league_name')
        club_name = self.request.query_params.get('club_name')

        queryset = Player.objects.all()

        if player_positions:
            queryset = queryset.filter(player_positions__icontains=player_positions)
        if nationality:
            queryset = queryset.filter(nationality__icontains=nationality)
        if league_name:
            queryset = queryset.filter(league_name__icontains=league_name)
        if club_name:
            queryset = queryset.filter(club_name__icontains=club_name)

        return queryset.order_by('-overall')[:k]

# Player details by ID
class PlayerDetailView(generics.RetrieveAPIView):
    serializer_class = PlayerSerializer
    queryset = Player.objects.all()
    lookup_field = 'sofifa_id'

# Search players by name
class PlayerSearchView(generics.ListAPIView):
    serializer_class = PlayerSerializer
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        query = self.request.query_params.get('q', '')
        if query:
            return Player.objects.filter(
                Q(short_name__icontains=query) | 
                Q(long_name__icontains=query)
            )
        return Player.objects.all()

# Top players by specific criteria
class TopPlayersByCriteriaView(generics.ListAPIView):
    serializer_class = PlayerSerializer
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        k = int(self.request.query_params.get('k', 10))
        criteria = self.request.query_params.get('criteria', 'overall')
        value = self.request.query_params.get('value')
        
        queryset = Player.objects.all()
        
        if criteria == 'position' and value:
            queryset = queryset.filter(player_positions__icontains=value)
        elif criteria == 'nationality' and value:
            queryset = queryset.filter(nationality__icontains=value)
        elif criteria == 'league' and value:
            queryset = queryset.filter(league_name__icontains=value)
        elif criteria == 'club' and value:
            queryset = queryset.filter(club_name__icontains=value)
            
        return queryset.order_by('-overall')[:k]

# Best team formation
class BestTeamView(APIView):
    def get(self, request):
        formation = request.query_params.get('formation', '4-3-3')
        league_name = request.query_params.get('league_name')
        nationality = request.query_params.get('nationality')
        
        queryset = Player.objects.all()
        
        if league_name:
            queryset = queryset.filter(league_name__icontains=league_name)
        if nationality:
            queryset = queryset.filter(nationality__icontains=nationality)
        
        # Define positions for 4-3-3 formation
        positions = {
            'GK': 1,
            'RB': 1,
            'CB': 2,
            'LB': 1,
            'CDM': 1,
            'CM': 2,
            'LW': 1,
            'ST': 1,
            'RW': 1
        }
        
        team = []
        used_players = set()
        
        for position, count in positions.items():
            players = queryset.filter(
                player_positions__icontains=position
            ).order_by('-overall')
            chosen = 0
            for player in players:
                if player.sofifa_id not in used_players:
                    team.append({"player": player, "position": position})
                    used_players.add(player.sofifa_id)
                    chosen += 1
                if chosen >= count:
                    break
        
        if len(team) < 11:
            remaining = queryset.exclude(sofifa_id__in=used_players).order_by('-overall')
            for player in remaining:
                for pos, cnt in positions.items():
                    current_count = len([t for t in team if t["position"] == pos])
                    if current_count < cnt:
                        team.append({"player": player, "position": pos})
                        used_players.add(player.sofifa_id)
                        break
                if len(team) >= 11:
                    break
        
                
        # Serializa jogadores + posição escolhida
        result = []
        for item in team:
            player = item.get("player")
            
            if isinstance(player, Player):
                player_data = PlayerSerializer(player).data
                player_data["chosen_position"] = item.get("position", "")
                result.append(player_data)


        return Response(result)


class SofifaImageProxy(View):
    def get(self, request, sofifa_id: int):
        """
        Proxy para imagens do Sofifa.
        URL: /api/players/image/<sofifa_id>/
        """
        # Converte o ID para string e cria o path da imagem
        sofifa_id_str = str(sofifa_id).zfill(6)  # garante 6 dígitos
        year = sofifa_id_str[:3]
        rest = sofifa_id_str[3:]
        image_url = f"https://cdn.sofifa.net/players/{year}/{rest}/25_120.png"

        try:
            response = urllib.requests.get(image_url, timeout=5)
            response.raise_for_status()
        except urllib.requests.RequestException:
            return HttpResponse(status=404)

        content_type = response.headers.get('Content-Type', 'image/png')
        return HttpResponse(response.content, content_type=content_type)