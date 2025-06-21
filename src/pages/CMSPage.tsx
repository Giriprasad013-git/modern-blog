import { useState } from "react";
import { usePosts } from "@/hooks/usePosts";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { useTheme } from "@/hooks/useTheme";
import PostsTable from "@/components/cms/PostsTable";
import PostEditor from "@/components/cms/PostEditor";
import CMSStats from "@/components/cms/CMSStats";
import { Post } from "@/types/post";

const CMSPage = () => {
  const { data: posts, isLoading } = usePosts();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("posts");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const handleCreateNew = () => {
    setSelectedPost(null);
    setIsEditing(true);
  };

  const handleEditPost = (post: Post) => {
    setSelectedPost(post);
    setIsEditing(true);
  };

  const handleBackToList = () => {
    setIsEditing(false);
    setSelectedPost(null);
  };

  return (
    <div className={`min-h-screen ${theme === "dark" ? "dark" : ""}`}>
      <SEO title="Content Management System" noindex={true} />
      <Header toggleTheme={toggleTheme} currentTheme={theme} />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Content Management System</h1>
          {!isEditing && activeTab === "posts" && (
            <Button onClick={handleCreateNew}>
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Button>
          )}
        </div>

        {isEditing ? (
          <PostEditor
            post={selectedPost}
            isEditing={!!selectedPost}
            onBack={handleBackToList}
          />
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="stats">Statistics</TabsTrigger>
            </TabsList>

            <TabsContent value="posts">
              <PostsTable onEdit={handleEditPost} />
            </TabsContent>

            <TabsContent value="stats">
              {posts && <CMSStats posts={posts} />}
            </TabsContent>
          </Tabs>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CMSPage;
