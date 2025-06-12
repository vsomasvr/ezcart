import React from 'react';
import { Review } from '../types';

interface ReviewCardProps {
  review: Review;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  const totalStars = 5;
  return (
    <div className="flex items-center" aria-label={`Rating: ${rating} out of 5 stars`}>
      {[...Array(totalStars)].map((_, index) => {
        const starClass = index < rating ? 'fas fa-star text-yellow-400' : 'far fa-star text-yellow-400';
        return <i key={index} className={`${starClass} mr-1`}></i>;
      })}
    </div>
  );
};

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const reviewDate = new Date(review.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="bg-slate-700 p-6 rounded-lg shadow-lg border border-slate-600">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-3">
        <h4 className="text-xl font-semibold text-emerald-300 mb-1 sm:mb-0">{review.title}</h4>
        <StarRating rating={review.rating} />
      </div>
      <p className="text-slate-300 mb-4 leading-relaxed">{review.comment}</p>
      <div className="text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <span>By: <strong className="text-slate-400">{review.userId}</strong></span>
        <span>{reviewDate}</span>
      </div>
    </div>
  );
};

export default ReviewCard;
