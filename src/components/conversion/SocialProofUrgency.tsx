import { Users, TrendingUp, Eye, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SocialProofUrgencyProps {
  soldLast24h?: number;
  soldLastWeek?: number;
  viewers?: number;
  isTrending?: boolean;
  className?: string;
}

export default function SocialProofUrgency({
  soldLast24h,
  soldLastWeek,
  viewers,
  isTrending = false,
  className = "",
}: SocialProofUrgencyProps) {
  const indicators = [];

  if (soldLast24h && soldLast24h > 0) {
    indicators.push(
      <Badge key="sold-24h" variant="secondary" className="gap-1.5">
        <Users className="w-3 h-3" />
        {soldLast24h} bought in last 24 hours
      </Badge>
    );
  }

  if (soldLastWeek && soldLastWeek >= 10) {
    indicators.push(
      <Badge key="sold-week" variant="secondary" className="gap-1.5">
        <TrendingUp className="w-3 h-3" />
        Trending this week
      </Badge>
    );
  }

  if (isTrending) {
    indicators.push(
      <Badge key="trending" variant="secondary" className="gap-1.5">
        <TrendingUp className="w-3 h-3" />
        Popular this week
      </Badge>
    );
  }

  if (viewers && viewers > 3) {
    indicators.push(
      <Badge key="viewers" variant="secondary" className="gap-1.5">
        <Eye className="w-3 h-3" />
        {viewers} people viewing
      </Badge>
    );
  }

  if (indicators.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {indicators}
    </div>
  );
}

