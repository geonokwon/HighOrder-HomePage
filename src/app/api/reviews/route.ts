/**
 * Reviews API Route
 * 후기 CRUD API
 */

import { NextRequest, NextResponse } from 'next/server';
import { DatabaseManager } from '../../../features/reviews/infrastructure/database/DatabaseManager';
import { SqliteReviewRepository } from '../../../features/reviews/infrastructure/repositories/SqliteReviewRepository';
import { LocalImageRepository } from '../../../features/reviews/infrastructure/repositories/LocalImageRepository';
import { CreateReviewUseCase } from '../../../features/reviews/application/usecases/CreateReview';
import { GetReviewsUseCase } from '../../../features/reviews/application/usecases/GetReviews';

// 의존성 주입 설정
const imageRepository = new LocalImageRepository();
const reviewRepository = new SqliteReviewRepository(imageRepository);
const createReviewUseCase = new CreateReviewUseCase(reviewRepository);
const getReviewsUseCase = new GetReviewsUseCase(reviewRepository);

// 데이터베이스 초기화
async function initializeDatabase() {
  const db = DatabaseManager.getInstance();
  if (!db.isConnected()) {
    await db.initialize();
  }
}

// GET: 모든 후기 조회
export async function GET() {
  try {
    await initializeDatabase();
    const reviews = await getReviewsUseCase.getAllReviews();
    const stats = await getReviewsUseCase.getReviewStats();
    
    return NextResponse.json({
      success: true,
      data: { reviews, stats }
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// POST: 새 후기 생성
export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    
    const formData = await request.formData();
    
    const password = formData.get('password');
    if (!password || typeof password !== 'string') {
      console.log('Password validation failed');
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    const reviewData = {
      userName: formData.get('userName') as string,
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      category: formData.get('category') as string,
      password: password,
      images: formData.getAll('images') as File[]
    };

    const result = await createReviewUseCase.execute(reviewData);
    
    if (result.success && result.review) {
      return NextResponse.json({
        success: true,
        data: result.review
      });
    } else {
      return NextResponse.json(
        { error: 'Validation failed', errors: result.errors },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Create review error:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}
