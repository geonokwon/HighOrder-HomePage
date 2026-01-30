#!/bin/bash

# 빠른 업데이트 스크립트 (프로덕션 모드 유지)
echo "빠른 업데이트 시작..."

# 1. 현재 컨테이너 백업
echo "현재 컨테이너 백업 중..."
sudo docker tag highorder_homepage-nextjs-app:latest highorder_homepage-nextjs-app:backup-$(date +%Y%m%d-%H%M%S)

# 2. 새 이미지 빌드 (캐시 활용)
echo "새 이미지 빌드 중..."
sudo docker-compose build --parallel

# 3. 컨테이너 재시작 (무중단)
echo "컨테이너 재시작 중..."
sudo docker-compose up -d --force-recreate

# 4. 헬스체크
echo "헬스체크 중..."
for i in {1..10}; do
    if curl -f http://localhost:8011/ > /dev/null 2>&1; then
        echo "업데이트 완료!"
        break
    fi
    echo "헬스체크 대기 중... ($i/10)"
    sleep 2
done

echo "빠른 업데이트 완료!"
echo "서비스 URL: http://localhost:8011"
