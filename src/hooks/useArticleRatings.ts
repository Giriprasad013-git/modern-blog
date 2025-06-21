
import { useState, useEffect } from 'react';

export interface ArticleRating {
  slug: string;
  rating: number; // 1-5 stars
  helpful: boolean | null;
  timestamp: number;
}

export const useArticleRatings = () => {
  const [ratings, setRatings] = useState<ArticleRating[]>([]);

  useEffect(() => {
    const savedRatings = localStorage.getItem('articleRatings');
    if (savedRatings) {
      try {
        setRatings(JSON.parse(savedRatings));
      } catch (error) {
        console.error('Error parsing article ratings:', error);
      }
    }
  }, []);

  const saveRatings = (newRatings: ArticleRating[]) => {
    setRatings(newRatings);
    localStorage.setItem('articleRatings', JSON.stringify(newRatings));
  };

  const rateArticle = (slug: string, rating: number) => {
    const existingIndex = ratings.findIndex(r => r.slug === slug);
    const newRating: ArticleRating = {
      slug,
      rating,
      helpful: null,
      timestamp: Date.now(),
    };

    if (existingIndex >= 0) {
      const newRatings = [...ratings];
      newRatings[existingIndex] = { ...newRatings[existingIndex], rating };
      saveRatings(newRatings);
    } else {
      saveRatings([...ratings, newRating]);
    }
  };

  const markHelpful = (slug: string, helpful: boolean) => {
    const existingIndex = ratings.findIndex(r => r.slug === slug);
    
    if (existingIndex >= 0) {
      const newRatings = [...ratings];
      newRatings[existingIndex] = { ...newRatings[existingIndex], helpful };
      saveRatings(newRatings);
    } else {
      const newRating: ArticleRating = {
        slug,
        rating: 0,
        helpful,
        timestamp: Date.now(),
      };
      saveRatings([...ratings, newRating]);
    }
  };

  const getArticleRating = (slug: string) => {
    return ratings.find(r => r.slug === slug);
  };

  const getAverageRating = (slug: string) => {
    // In a real app, this would come from the server
    // For now, we'll simulate it with localStorage data
    return Math.floor(Math.random() * 2) + 4; // 4-5 stars
  };

  return {
    ratings,
    rateArticle,
    markHelpful,
    getArticleRating,
    getAverageRating,
  };
};
