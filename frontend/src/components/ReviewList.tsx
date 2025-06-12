import React from 'react';
import { Review } from '../types';
import ReviewCard from './ReviewCard';

interface ReviewListProps {
  reviews: Review[];
  productId: string; // Used for a heading or context, if needed
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews, productId }) => {
  return (
    <div className="mt-12">
      <h2 className="text-3xl font-semibold text-sky-400 mb-6 border-b-2 border-slate-700 pb-2">
        Customer Reviews ({reviews.length})
      </h2>
      {reviews.length === 0 ? (
        <p className="text-slate-400">No reviews yet for this product.</p>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <ReviewCard key={review.reviewId} review={review} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewList;
