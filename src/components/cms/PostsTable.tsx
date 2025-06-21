import { useState } from "react";
import { usePosts } from "@/hooks/usePosts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Post } from "@/types/post";
import { Edit, Trash2, Search, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PostsTableProps {
  onEdit: (post: Post) => void;
}

const PostsTable = ({ onEdit }: PostsTableProps) => {
  const { data: posts, isLoading, error, refetch } = usePosts();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  
  const handleDelete = async (postId: number) => {
    if (window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      try {
        setIsDeleting(postId);
        const { error } = await supabase
          .from('posts')
          .delete()
          .eq('id', postId);
        
        if (error) {
          throw new Error(error.message);
        }
        
        toast({
          title: "Success",
          description: "Post deleted successfully",
        });
        
        // Invalidate queries to refresh posts list
        await queryClient.invalidateQueries({ queryKey: ['posts'] });
      } catch (error: any) {
        console.error('Error deleting post:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to delete post",
          variant: "destructive",
        });
      } finally {
        setIsDeleting(null);
      }
    }
  };
  
  const filteredPosts = posts?.filter(post => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      post.title.toLowerCase().includes(term) ||
      post.slug.toLowerCase().includes(term) ||
      post.category.toLowerCase().includes(term) ||
      post.author.toLowerCase().includes(term)
    );
  }) || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2">Loading posts...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Error loading posts: {error.message}
          <Button 
            variant="outline" 
            size="sm" 
            className="ml-4"
            onClick={() => refetch()}
          >
            Try Again
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            type="search"
            placeholder="Search posts..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {filteredPosts.length === 0 ? (
        <div className="text-center py-10 border rounded-md">
          <p className="text-gray-500 dark:text-gray-400">
            {searchTerm ? "No posts match your search criteria." : "No posts found. Create your first post!"}
          </p>
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead className="hidden md:table-cell">Author</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="hidden md:table-cell">Views</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.id}</TableCell>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell className="hidden md:table-cell">{post.category}</TableCell>
                  <TableCell className="hidden md:table-cell">{post.author}</TableCell>
                  <TableCell className="hidden md:table-cell">{post.date}</TableCell>
                  <TableCell className="hidden md:table-cell">{post.views}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(post)}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(post.id)}
                      disabled={isDeleting === post.id}
                    >
                      {isDeleting === post.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 text-red-500" />
                      )}
                      <span className="sr-only">Delete</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default PostsTable;
