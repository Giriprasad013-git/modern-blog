
import { Facebook, Twitter, Linkedin } from "lucide-react";

interface ShareButtonsProps {
  url: string;
  title: string;
  className?: string;
}

const ShareButtons = ({ url, title, className = "" }: ShareButtonsProps) => {
  const baseUrl = window.location.origin;
  const fullUrl = `${baseUrl}${url}`;
  const encodedUrl = encodeURIComponent(fullUrl);
  const encodedTitle = encodeURIComponent(title);
  
  return (
    <div className={`flex space-x-2 ${className}`}>
      <a 
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Facebook"
        className="rounded-full p-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors"
      >
        <Facebook className="h-4 w-4" />
      </a>
      
      <a 
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Twitter"
        className="rounded-full p-2 bg-sky-500 text-white hover:bg-sky-600 transition-colors"
      >
        <Twitter className="h-4 w-4" />
      </a>
      
      <a 
        href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        className="rounded-full p-2 bg-blue-800 text-white hover:bg-blue-900 transition-colors"
      >
        <Linkedin className="h-4 w-4" />
      </a>
    </div>
  );
};

export default ShareButtons;
