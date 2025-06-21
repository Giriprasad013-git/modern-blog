
import { useState } from "react";
import { X, Gift, TrendingUp, Bell, CheckCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useUserPreferences } from "@/hooks/useUserPreferences";

interface NewsletterPopupProps {
  onClose: () => void;
}

const NewsletterPopup = ({ onClose }: NewsletterPopupProps) => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedFrequency, setSelectedFrequency] = useState("weekly");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { updateSubscriptionStatus, trackEvent } = useUserPreferences();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Update subscription status in database
      await updateSubscriptionStatus(email.trim(), 'newsletter');
      
      // Track subscription event
      await trackEvent('newsletter_subscription', { 
        email: email.trim(), 
        frequency: selectedFrequency,
        timestamp: new Date().toISOString()
      });
      
      setIsSubmitted(true);
      
      toast({
        title: "Successfully subscribed!",
        description: `You'll receive ${selectedFrequency} updates at ${email}`,
      });
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: "Subscription failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNotNow = async () => {
    await trackEvent('newsletter_dismissed', {
      reason: 'not_now',
      timestamp: new Date().toISOString()
    });
    
    localStorage.setItem("newsletter_dismissed", Date.now().toString());
    toast({
      title: "No problem!",
      description: "You can subscribe anytime from our footer.",
    });
    onClose();
  };

  const handleCloseAfterSubscription = () => {
    toast({
      title: "Welcome aboard!",
      description: "Thanks for joining our community.",
    });
    onClose();
  };

  const handleClose = async () => {
    await trackEvent('newsletter_popup_closed', {
      timestamp: new Date().toISOString()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full relative overflow-hidden transform animate-scale-in">
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 z-10 transition-colors duration-200 hover:rotate-90 transform"
          aria-label="Close newsletter popup"
        >
          <X className="h-5 w-5" />
        </button>
        
        {/* Enhanced gradient header */}
        <div className="bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 h-20 w-full absolute top-0 left-0">
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
        </div>
        
        <div className="pt-12 p-6">
          {!isSubmitted ? (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg border-4 border-white dark:border-slate-600">
                  <Mail className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="text-2xl font-bold mb-2 dark:text-white bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Join 10,000+ Readers
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  Get the latest insights, trends, and exclusive content delivered directly to your inbox.
                </p>
              </div>

              {/* Enhanced benefits */}
              <div className="space-y-3 mb-6 bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Weekly industry insights & trends</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <Gift className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Exclusive subscriber-only content</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <Bell className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Breaking news & early access</span>
                </div>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="relative">
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 dark:border-slate-600 focus:border-blue-500 transition-colors duration-200"
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  {/* Enhanced frequency selection */}
                  <div>
                    <label className="block text-sm font-semibold mb-3 dark:text-white text-gray-800">
                      How often would you like updates?
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedFrequency("weekly")}
                        disabled={isSubmitting}
                        className={`p-3 text-sm rounded-lg border-2 transition-all duration-200 font-medium ${
                          selectedFrequency === "weekly" 
                            ? "bg-blue-500 text-white border-blue-500 shadow-md transform scale-105" 
                            : "bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-400"
                        }`}
                      >
                        📅 Weekly
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedFrequency("daily")}
                        disabled={isSubmitting}
                        className={`p-3 text-sm rounded-lg border-2 transition-all duration-200 font-medium ${
                          selectedFrequency === "daily" 
                            ? "bg-blue-500 text-white border-blue-500 shadow-md transform scale-105" 
                            : "bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-400"
                        }`}
                      >
                        📨 Daily
                      </button>
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Subscribing...</span>
                      </div>
                    ) : (
                      "Subscribe Now"
                    )}
                  </Button>
                  
                  <button
                    type="button"
                    onClick={handleNotNow}
                    disabled={isSubmitting}
                    className="w-full text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200 py-2"
                  >
                    Maybe later
                  </button>
                  
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center leading-relaxed">
                    🔒 We respect your privacy. Unsubscribe anytime with one click.
                    <br />
                    No spam, ever. Only valuable content.
                  </p>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-500 animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold mb-3 dark:text-white">🎉 Welcome to the Community!</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                You're all set! Check your email for a confirmation link and your welcome gift.
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                  📬 Your first {selectedFrequency === "daily" ? "daily digest" : "weekly newsletter"} arrives {selectedFrequency === "daily" ? "tomorrow" : "next week"}
                </p>
              </div>
              <Button
                onClick={handleCloseAfterSubscription}
                className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-8 py-3 transition-all duration-200 transform hover:scale-105"
              >
                Continue Reading
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsletterPopup;
