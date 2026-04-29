#!/bin/bash
#
# 이 스크립트를 한 번만 실행하면 git post-push 훅이 설치됩니다.
# 실행 방법: ./setup-hooks.sh

REPO_ROOT=$(git rev-parse --show-toplevel 2>/dev/null)

if [ -z "$REPO_ROOT" ]; then
  echo "❌ git 저장소가 아닙니다."
  exit 1
fi

HOOK_SRC="$REPO_ROOT/.github/hooks/post-push"
HOOK_DST="$REPO_ROOT/.git/hooks/post-push"

# 실행 권한 부여
chmod +x "$HOOK_SRC"

# .git/hooks/post-push → .github/hooks/post-push 심볼릭 링크 생성
# 심볼릭 링크를 사용하므로 .github/hooks/post-push 수정 시 자동 반영됨
ln -sf "$HOOK_SRC" "$HOOK_DST"

echo "✅ post-push 훅 설치 완료"
echo "   $HOOK_DST → $HOOK_SRC"
echo ""
echo "이제 main을 제외한 브랜치에 push하면 Claude가 자동으로 코드리뷰를 진행합니다."
