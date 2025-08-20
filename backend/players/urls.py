from django.urls import path
from .views import PlayerListView, PlayerFilterView, TopKPlayersView, PlayerDetailView, PlayerSearchView, TopPlayersByCriteriaView, BestTeamView

urlpatterns = [
    path('players/', PlayerListView.as_view(), name='players-list'),
    path('players/search/', PlayerSearchView.as_view(), name='players-search'),
    path('players/filter/', PlayerFilterView.as_view(), name='players-filter'),
    path('players/top-k/', TopKPlayersView.as_view(), name='players-top-k'),
    path('players/<int:sofifa_id>/', PlayerDetailView.as_view(), name='player-detail'),
    path('players/top-by-criteria/', TopPlayersByCriteriaView.as_view(), name='players-top-k-by-criteria'),
    path('players/best-team/', BestTeamView.as_view(), name='best-team')
]
