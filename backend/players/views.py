from django.shortcuts import render
from rest_framework import generics, status
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
            queryset = queryset.filter(age__gte=age_min)
        if age_max:
            queryset = queryset.filter(age__lte=age_max)
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
        for position, count in positions.items():
            players = queryset.filter(
                player_positions__icontains=position
            ).order_by('-overall')[:count]
            team.extend(players)
        
        serializer = PlayerSerializer(team, many=True)
        return Response(serializer.data)
