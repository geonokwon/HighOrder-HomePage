/**
 * Reviews Page Route
 * Next.js App Router를 위한 후기 페이지 라우트
 */

import { ReviewsPage } from '../../features/reviews/presentation/pages/ReviewsPage';

export default function Reviews() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container mx-auto py-8">
        <ReviewsPage />
      </div>
    </div>
  );
}

export const metadata = {
  title: '후기 & 리뷰 - HighOrder',
  description: '실제 이용 고객들의 솔직한 후기를 확인해보세요',
};
