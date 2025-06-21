import { useState, useEffect } from "react";
import { Post } from "@/types/post";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Save, Upload } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface PostEditorProps {
  post: Post | null;
  isEditing: boolean;
  onBack: () => void;
}

const PostEditor = ({ post, isEditing, onBack }: PostEditorProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    image: "",
    category: "",
    author: "",
    date: new Date().toISOString().split('T')[0],
    read_time: 5,
    tags: [] as string[],
  });
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (post && isEditing) {
      console.log('Loading post for editing:', post);
      setFormData({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        image: post.image,
        category: post.category,
        author: post.author,
        date: post.date,
        read_time: post.read_time,
        tags: post.tags || [],
      });
      setTagInput((post.tags || []).join(", "));
    } else {
      // Reset form for new post
      setFormData({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        image: "",
        category: "",
        author: "",
        date: new Date().toISOString().split('T')[0],
        read_time: 5,
        tags: [],
      });
      setTagInput("");
    }
  }, [post, isEditing]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      ...(field === 'title' && { slug: generateSlug(value as string) })
    }));
  };

  const handleTagsChange = (value: string) => {
    setTagInput(value);
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData(prev => ({ ...prev, tags }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // For demo purposes, we'll use a placeholder URL
      // In a real app, you'd upload to Supabase Storage
      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, image: imageUrl }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.title || !formData.excerpt || !formData.content || !formData.category || !formData.author) {
        throw new Error('Please fill in all required fields');
      }

      const postData = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: formData.content,
        image: formData.image,
        category: formData.category,
        author: formData.author,
        date: formData.date,
        read_time: formData.read_time,
        tags: formData.tags,
        updated_at: new Date().toISOString(),
      };

      console.log('Submitting post data:', postData);

      if (isEditing && post) {
        console.log('Updating post with ID:', post.id);
        
        // Update the post using upsert to handle both insert and update cases
        const { data, error } = await supabase
          .from('posts')
          .upsert({
            id: post.id,
            ...postData
          }, {
            onConflict: 'id'
          })
          .select()
          .single();

        console.log('Update result:', { data, error });

        if (error) {
          console.error('Update error:', error);
          throw new Error(error.message || 'Failed to update post');
        }
        
        toast({
          title: "Success",
          description: "Post updated successfully",
        });
      } else {
        console.log('Creating new post');
        
        const newPostData = {
          ...postData,
          views: 0,
          created_at: new Date().toISOString(),
        };

        const { data, error } = await supabase
          .from('posts')
          .insert(newPostData)
          .select()
          .single();

        console.log('Insert result:', { data, error });

        if (error) {
          console.error('Insert error:', error);
          throw new Error(error.message || 'Failed to create post');
        }
        
        toast({
          title: "Success",
          description: "Post created successfully",
        });
      }

      // Invalidate queries to refresh the posts list
      await queryClient.invalidateQueries({ queryKey: ['posts'] });
      
      // Navigate back to posts list
      onBack();
    } catch (error: any) {
      console.error('Error saving post:', error);
      toast({
        title: "Error",
        description: error.message || `Failed to ${isEditing ? 'update' : 'create'} post`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Posts
        </Button>
        <h2 className="text-2xl font-bold">
          {isEditing ? `Edit Post: ${post?.title}` : 'Create New Post'}
        </h2>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter post title"
                  required
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  placeholder="post-slug"
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  placeholder="Technology, Business, etc."
                  required
                />
              </div>

              <div>
                <Label htmlFor="author">Author *</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => handleInputChange('author', e.target.value)}
                  placeholder="Author name"
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="read_time">Reading Time (minutes)</Label>
                <Input
                  id="read_time"
                  type="number"
                  value={formData.read_time}
                  onChange={(e) => handleInputChange('read_time', parseInt(e.target.value) || 5)}
                  min="1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  value={tagInput}
                  onChange={(e) => handleTagsChange(e.target.value)}
                  placeholder="tag1, tag2, tag3"
                />
              </div>

              <div>
                <Label htmlFor="image">Featured Image URL</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => handleInputChange('image', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
                {formData.image && (
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="mt-2 w-full h-32 object-cover rounded"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="excerpt">Excerpt *</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => handleInputChange('excerpt', e.target.value)}
              placeholder="Brief description of the post"
              rows={3}
              required
            />
          </div>

          <div>
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="Write your post content here (HTML supported)"
              rows={15}
              required
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onBack}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Saving...' : (isEditing ? 'Update Post' : 'Create Post')}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default PostEditor;
