import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import {
  Trophy,
  Target,
  Zap,
  ArrowRight,
  Star,
  Coins,
  Users,
  TrendingUp,
  Award,
  Clock,
  Gamepad2,
  Brain,
  Calendar
} from 'lucide-react';

export default function Index() {
  const [loading, setLoading] = useState(true);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-background">

      <Link to="/">
        <Card className="hover:shadow-md transition-shadow cursor-pointer border-border/50">
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 text-primary mx-auto mb-2" />
            <h3 className="font-semibold">FIFA 21</h3>
            <p className="text-sm text-muted-foreground">Explore jogadores</p>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
