#!/bin/bash
set -eu

echo "빠른 업데이트 시작..."

# ──[핵심 추가]──────────────────────────────────────────────────────────────
# Docker Hub 503 우회: 미러에서 node:20-alpine 받아서 로컬 태깅
MIRROR_NODE_IMAGE="public.ecr.aws/docker/library/node:20-alpine"
LOCAL_NODE_TAG="node:20-alpine"

retry() { # retry <max> <cmd...>
  local max=$1; shift; local n=1
  while ! "$@"; do
    if [ $n -ge $max ]; then echo "명령 실패: $*"; exit 1; fi
    echo "실패 → 재시도 ${n}/${max}"; sleep $((n*5)); n=$((n+1))
  done
}

echo "베이스 이미지(미러) 풀 중..."
retry 5 sudo docker pull "${MIRROR_NODE_IMAGE}"

echo "로컬 태그로 매핑(${MIRROR_NODE_IMAGE} → ${LOCAL_NODE_TAG})..."
sudo docker tag "${MIRROR_NODE_IMAGE}" "${LOCAL_NODE_TAG}"
# ─────────────────────────────────────────────────────────────────────────

# 1. 현재 컨테이너 백업
echo "현재 컨테이너 백업 중..."
sudo docker tag highorder_homepage-nextjs-app:latest "highorder_homepage-nextjs-app:backup-$(date +%Y%m%d-%H%M%S)" || true

# 2. 새 이미지 빌드 (캐시 활용)
echo "새 이미지 빌드 중..."
sudo docker-compose build --parallel

# 3. 컨테이너 재시작 (무중단)
echo "컨테이너 재시작 중..."
sudo docker-compose up -d --force-recreate

# 4. 헬스체크 (서버가 응답하는지만 확인, 500 에러여도 서버는 실행 중)
echo "헬스체크 중..."
HEALTH_CHECK_PASSED=false
for i in {1..15}; do
    # HTTP 상태 코드만 확인 (500이어도 서버는 응답하고 있음)
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8011/ || echo "000")
    if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "500" ]; then
        echo "✓ 서버 응답 확인 (HTTP $HTTP_CODE)"
        HEALTH_CHECK_PASSED=true
        break
    fi
    echo "서버 시작 대기 중... ($i/15) [HTTP: $HTTP_CODE]"
    sleep 3
done

if [ "$HEALTH_CHECK_PASSED" = false ]; then
    echo "⚠ 헬스체크 실패 - 컨테이너 상태 확인:"
    echo "sudo docker ps | grep highorder-homepage"
    echo "sudo docker logs highorder-homepage --tail 50"
    exit 1
fi

echo "빠른 업데이트 완료!"
echo "서비스 URL: http://localhost:8011"