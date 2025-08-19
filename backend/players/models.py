from django.db import models

class Player(models.Model):
    sofifa_id = models.BigIntegerField(primary_key=True)
    player_url = models.URLField()
    short_name = models.CharField(max_length=100)
    long_name = models.CharField(max_length=200)
    age = models.IntegerField()
    club_name = models.CharField(max_length=100)
    league_name = models.CharField(max_length=100)
    nationality = models.CharField(max_length=50)
    player_positions = models.CharField(max_length=50)
    overall = models.IntegerField()
    real_face = models.URLField()
    potential = models.IntegerField()
    value_eur = models.FloatField(null=False, blank=True)

    def __str__(self):
        return self.short_name