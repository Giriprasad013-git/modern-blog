
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Post } from "@/types/post";
import { Eye, Calendar, Book, Tag } from "lucide-react";

interface CMSStatsProps {
  posts: Post[];
}

const CMSStats = ({ posts }: CMSStatsProps) => {
  const totalPosts = posts.length;
  const totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0);
  const categories = [...new Set(posts.map(post => post.category))];
  const allTags = posts.flatMap(post => post.tags || []);
  const uniqueTags = [...new Set(allTags)];

  const recentPosts = posts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const popularPosts = posts
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <Book className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Total Posts</p>
              <p className="text-2xl font-bold">{totalPosts}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <Eye className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Total Views</p>
              <p className="text-2xl font-bold">{totalViews.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Categories</p>
              <p className="text-2xl font-bold">{categories.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <Tag className="w-8 h-8 text-orange-500" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Tags</p>
              <p className="text-2xl font-bold">{uniqueTags.length}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Posts */}
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">Recent Posts</h3>
          <div className="space-y-4">
            {recentPosts.map((post) => (
              <div key={post.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium truncate">{post.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {new Date(post.date).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant="outline">{post.category}</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Popular Posts */}
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">Popular Posts</h3>
          <div className="space-y-4">
            {popularPosts.map((post) => (
              <div key={post.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium truncate">{post.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {post.views || 0} views
                  </p>
                </div>
                <Badge variant="outline">{post.category}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CMSStats;
