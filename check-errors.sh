#!/bin/bash

# 에러 확인 스크립트
# 사용법: ./check-errors.sh

echo "=== Docker 컨테이너 상태 확인 ==="
sudo docker ps | grep highorder-homepage

echo ""
echo "=== 최근 100줄 로그 확인 ==="
sudo docker logs --tail 100 highorder-homepage

echo ""
echo "=== 에러만 필터링 ==="
sudo docker logs highorder-homepage 2>&1 | grep -i -E "(error|ERROR|Error|===)" | tail -20

echo ""
echo "=== 500 에러 트리거 테스트 ==="
sudo docker exec highorder-homepage curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" http://localhost:3000/

echo ""
echo "=== 실시간 로그 모니터링 시작 (Ctrl+C로 종료) ==="
echo "다른 터미널에서 다음 명령어로 테스트하세요:"
echo "  sudo docker exec highorder-homepage curl -v http://localhost:3000/"
echo ""
sudo docker logs -f highorder-homepage








