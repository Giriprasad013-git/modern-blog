
import { Badge } from '@/components/ui/badge';
import { Clock, Zap } from 'lucide-react';

interface ContentFreshnessProps {
  createdAt: string;
  updatedAt?: string;
  className?: string;
}

const ContentFreshness = ({ createdAt, updatedAt, className = "" }: ContentFreshnessProps) => {
  const now = new Date();
  const created = new Date(createdAt);
  const updated = updatedAt ? new Date(updatedAt) : null;
  
  const daysSinceCreated = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
  const daysSinceUpdated = updated ? Math.floor((now.getTime() - updated.getTime()) / (1000 * 60 * 60 * 24)) : null;
  
  // Show "New" badge for posts created in the last 3 days
  const isNew = daysSinceCreated <= 3;
  
  // Show "Updated" badge for posts updated in the last 7 days (but not new)
  const isRecentlyUpdated = !isNew && daysSinceUpdated !== null && daysSinceUpdated <= 7;

  if (isNew) {
    return (
      <Badge 
        variant="default" 
        className={`bg-green-500 hover:bg-green-600 text-white ${className}`}
      >
        <Zap className="h-3 w-3 mr-1" />
        New
      </Badge>
    );
  }

  if (isRecentlyUpdated) {
    return (
      <Badge 
        variant="outline" 
        className={`border-orange-500 text-orange-600 dark:text-orange-400 ${className}`}
      >
        <Clock className="h-3 w-3 mr-1" />
        Updated
      </Badge>
    );
  }

  return null;
};

export default ContentFreshness;
