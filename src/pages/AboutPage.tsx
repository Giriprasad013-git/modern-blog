
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTheme } from "@/hooks/useTheme";

const AboutPage = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`min-h-screen ${theme === "dark" ? "dark" : ""}`}>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Header toggleTheme={toggleTheme} currentTheme={theme} />
      
      <main id="main-content" className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 md:p-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">About Fast and Facts</h1>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg mb-6">
              Welcome to Fast and Facts, your trusted source for timely and accurate information on a wide range of topics.
            </p>
            
            <h2>Our Mission</h2>
            <p>
              At Fast and Facts, we believe that quality information should be accessible to everyone. Our mission is to provide readers with well-researched, factual content that helps them make informed decisions and stay updated on topics that matter.
            </p>
            
            <h2>Our Team</h2>
            <p>
              Our team consists of experienced writers, researchers, and subject matter experts who are passionate about delivering high-quality content. Each article goes through a rigorous fact-checking process before publication to ensure accuracy and reliability.
            </p>
            
            <h2>Our Approach</h2>
            <p>
              We focus on creating content that is:
            </p>
            <ul>
              <li><strong>Accurate:</strong> We verify all information through reputable sources</li>
              <li><strong>Up-to-date:</strong> We regularly review and update our content</li>
              <li><strong>Accessible:</strong> We explain complex topics in clear, understandable language</li>
              <li><strong>Practical:</strong> We provide actionable insights and advice</li>
            </ul>
            
            <h2>Contact Us</h2>
            <p>
              Have questions, feedback, or suggestions? We'd love to hear from you! Visit our <a href="/contact">Contact page</a> to get in touch with our team.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutPage;
