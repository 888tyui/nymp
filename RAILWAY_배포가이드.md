# Railway 배포 가이드 (상세 단계별)

## 개요

Railway는 Docker 없이 Git 레포지토리에서 직접 배포할 수 있는 플랫폼입니다. nym 프로젝트는 Railway에 최적화되어 있습니다.

## 사전 준비

### 필요한 것들
1. ✅ Railway 계정 (https://railway.app)
2. ✅ GitHub 레포지토리 (이미 완료: https://github.com/888tyui/nymp)
3. ✅ OpenAI API 키 (https://platform.openai.com/api-keys)
4. ✅ 신용카드 (Railway는 무료 티어 제공, 하지만 카드 등록 필요)

### Railway 무료 티어
- $5 무료 크레딧 (매월)
- 충분히 개발 및 테스트 가능
- 사용량 초과 시 과금

---

## 📋 전체 배포 순서

```
1. Railway 프로젝트 생성
2. PostgreSQL 데이터베이스 추가
3. 백엔드 서비스 배포
4. 프론트엔드 서비스 배포
5. 환경 변수 설정
6. 배포 확인 및 테스트
```

---

## 1단계: Railway 계정 생성 및 프로젝트 생성

### 1.1 Railway 가입
1. https://railway.app 접속
2. "Start a New Project" 클릭
3. GitHub 계정으로 로그인
4. Railway에 GitHub 접근 권한 승인

### 1.2 새 프로젝트 생성
1. Railway 대시보드에서 "New Project" 클릭
2. "Empty Project" 선택
3. 프로젝트 이름 입력: `nym-app` (원하는 이름)

---

## 2단계: PostgreSQL 데이터베이스 추가

### 2.1 데이터베이스 서비스 추가
1. 프로젝트 대시보드에서 **"+ New"** 클릭
2. **"Database"** 선택
3. **"Add PostgreSQL"** 클릭

### 2.2 데이터베이스 정보 확인
1. PostgreSQL 서비스 클릭
2. **"Variables"** 탭 클릭
3. `DATABASE_URL` 값 복사 (나중에 사용)

형식: `postgresql://postgres:password@host:port/railway`

**중요**: 이 URL은 자동으로 생성되며, 백엔드 서비스에서 사용됩니다.

---

## 3단계: 백엔드 서비스 배포

### 3.1 GitHub 레포지토리 연결
1. 프로젝트 대시보드에서 **"+ New"** 클릭
2. **"GitHub Repo"** 선택
3. **"Configure GitHub App"** 클릭 (처음인 경우)
4. `888tyui/nymp` 레포지토리 선택

### 3.2 백엔드 서비스 설정
1. 레포지토리가 추가되면, 서비스를 클릭
2. **"Settings"** 탭으로 이동
3. 다음 설정 입력:

```
Root Directory: backend
Build Command: npm install && npm run build
Start Command: npm run start
```

**상세 설정:**

#### Root Directory
- **설정**: `backend`
- **의미**: 백엔드 폴더에서 빌드 시작

#### Build Command  
- **설정**: `npm install && npm run build`
- **의미**: 의존성 설치 후 TypeScript 컴파일

#### Start Command
- **설정**: `npm run start`
- **의미**: 컴파일된 JavaScript 실행

### 3.3 백엔드 환경 변수 설정

1. **"Variables"** 탭 클릭
2. **"+ New Variable"** 클릭하여 다음 추가:

```env
DATABASE_URL=
(PostgreSQL 서비스에서 자동으로 연결됨 - Reference 사용)

OPENAI_API_KEY=sk-여기에-본인의-OpenAI-키-입력

PORT=3001

NODE_ENV=production

FRONTEND_URL=
(나중에 프론트엔드 URL로 업데이트)
```

**DATABASE_URL 설정 방법:**
1. `DATABASE_URL` 변수 이름 입력
2. 값 입력 필드에서 **"$DATABASE_URL"** 선택 (Reference)
3. PostgreSQL 서비스를 선택하면 자동으로 연결됨

**FRONTEND_URL은 일단 비워두고 프론트엔드 배포 후 업데이트**

### 3.4 백엔드 배포 시작
1. 환경 변수 저장
2. 자동으로 배포가 시작됩니다
3. **"Deployments"** 탭에서 진행 상황 확인
4. 빌드 로그 확인 (에러 발생 시 로그 확인)

### 3.5 백엔드 URL 확인
1. **"Settings"** 탭 클릭
2. **"Networking"** 섹션에서 **"Generate Domain"** 클릭
3. 생성된 URL 복사 (예: `https://backend-production-xxxx.up.railway.app`)

---

## 4단계: 프론트엔드 서비스 배포

### 4.1 프론트엔드 서비스 추가
1. 프로젝트 대시보드로 돌아가기
2. **"+ New"** 클릭
3. **"GitHub Repo"** 선택
4. 동일한 `888tyui/nymp` 레포지토리 선택

**중요**: 같은 레포지토리를 두 번 추가하는 것입니다 (백엔드용, 프론트엔드용)

### 4.2 프론트엔드 서비스 설정
1. 새로 추가된 서비스 클릭
2. **"Settings"** 탭으로 이동
3. 서비스 이름 변경: `frontend` (구분을 위해)
4. 다음 설정 입력:

```
Root Directory: frontend
Build Command: npm install && npm run build
Start Command: npm run start
```

### 4.3 프론트엔드 환경 변수 설정

1. **"Variables"** 탭 클릭
2. 다음 변수 추가:

```env
NEXT_PUBLIC_API_URL=https://백엔드-URL-여기에-입력
(3.5단계에서 복사한 백엔드 URL)

NEXT_PUBLIC_MONAD_RPC_URL=https://monad-mainnet-rpc-url
(Monad 메인넷 RPC URL - 나중에 업데이트 가능)
```

**예시:**
```env
NEXT_PUBLIC_API_URL=https://backend-production-xxxx.up.railway.app

NEXT_PUBLIC_MONAD_RPC_URL=https://monad-rpc-url
```

### 4.4 프론트엔드 배포 시작
1. 환경 변수 저장
2. 자동 배포 시작
3. **"Deployments"** 탭에서 진행 상황 확인

### 4.5 프론트엔드 URL 생성
1. **"Settings"** 탭 클릭
2. **"Networking"** 섹션에서 **"Generate Domain"** 클릭
3. 생성된 URL 복사 (예: `https://frontend-production-xxxx.up.railway.app`)

---

## 5단계: 백엔드 환경 변수 업데이트

### 5.1 FRONTEND_URL 설정
1. 백엔드 서비스로 돌아가기
2. **"Variables"** 탭 클릭
3. `FRONTEND_URL` 변수 찾기
4. 프론트엔드 URL로 업데이트

```env
FRONTEND_URL=https://frontend-production-xxxx.up.railway.app
```

### 5.2 백엔드 재배포
1. 환경 변수 저장
2. **"Deployments"** 탭에서 **"Redeploy"** 클릭
3. CORS 설정이 업데이트됩니다

---

## 6단계: 배포 확인 및 테스트

### 6.1 서비스 상태 확인
프로젝트 대시보드에서 3개 서비스 확인:
- ✅ **PostgreSQL**: Running (초록색)
- ✅ **backend**: Running (초록색)
- ✅ **frontend**: Running (초록색)

### 6.2 백엔드 테스트
브라우저에서 백엔드 URL 접속:
```
https://your-backend-url.up.railway.app/health
```

응답이 나와야 합니다:
```json
{
  "status": "ok",
  "message": "nym API is running"
}
```

### 6.3 프론트엔드 접속
브라우저에서 프론트엔드 URL 접속:
```
https://your-frontend-url.up.railway.app
```

nym 앱이 로드되어야 합니다!

### 6.4 기능 테스트
1. **워크스페이스 생성**: 정상 작동 확인
2. **빌더 에이전트**: AI 채팅 테스트
3. **파일 생성**: 파일 CRUD 테스트
4. **지갑 연결**: MetaMask 연결 테스트
5. **ZIP 내보내기**: 저장 기능 테스트

---

## 7단계: 커스텀 도메인 설정 (선택사항)

### 7.1 도메인 구매
- Namecheap, GoDaddy, Cloudflare 등에서 도메인 구매

### 7.2 프론트엔드에 커스텀 도메인 추가
1. 프론트엔드 서비스 → **"Settings"** 탭
2. **"Networking"** → **"Custom Domain"**
3. 도메인 입력 (예: `nym.yourdomain.com`)
4. DNS 설정 지침 확인

### 7.3 DNS 레코드 추가
도메인 제공업체에서 다음 레코드 추가:

```
Type: CNAME
Name: nym (또는 @)
Value: frontend-production-xxxx.up.railway.app
```

### 7.4 백엔드 FRONTEND_URL 업데이트
커스텀 도메인으로 변경:
```env
FRONTEND_URL=https://nym.yourdomain.com
```

---

## 📊 서비스 구조 요약

```
nym-app (프로젝트)
├── PostgreSQL
│   └── DATABASE_URL 제공
├── backend
│   ├── Root: backend/
│   ├── 환경변수:
│   │   ├── DATABASE_URL (PostgreSQL에서 참조)
│   │   ├── OPENAI_API_KEY
│   │   ├── PORT=3001
│   │   ├── NODE_ENV=production
│   │   └── FRONTEND_URL
│   └── URL: https://backend-xxx.up.railway.app
└── frontend
    ├── Root: frontend/
    ├── 환경변수:
    │   ├── NEXT_PUBLIC_API_URL
    │   └── NEXT_PUBLIC_MONAD_RPC_URL
    └── URL: https://frontend-xxx.up.railway.app
```

---

## 🔍 문제 해결

### 백엔드가 시작되지 않음

**증상**: 배포는 되지만 서비스가 Crashed 상태

**해결방법:**
1. **"Deployments"** 탭 → 최신 배포 클릭 → **"View Logs"**
2. 에러 메시지 확인
3. 일반적인 원인:
   - `DATABASE_URL` 설정 오류
   - `OPENAI_API_KEY` 누락
   - TypeScript 빌드 에러

### 프론트엔드가 백엔드에 연결되지 않음

**증상**: 프론트엔드는 로드되지만 데이터를 불러오지 못함

**해결방법:**
1. 브라우저 개발자 도구 (F12) → Console 확인
2. CORS 에러가 있는지 확인
3. 백엔드의 `FRONTEND_URL` 확인
4. 프론트엔드의 `NEXT_PUBLIC_API_URL` 확인

### Database connection failed

**증상**: 백엔드 로그에 DB 연결 에러

**해결방법:**
1. PostgreSQL 서비스가 Running 상태인지 확인
2. 백엔드의 `DATABASE_URL` 변수 확인
3. Reference로 설정되어 있는지 확인

### Build failed

**증상**: 빌드 중 에러 발생

**해결방법:**
1. 로컬에서 빌드 테스트:
   ```bash
   cd backend  # 또는 frontend
   npm install
   npm run build
   ```
2. 에러 수정 후 GitHub에 푸시
3. Railway가 자동으로 재배포

---

## 💡 유용한 팁

### 1. 로그 모니터링
- Railway 대시보드에서 실시간 로그 확인 가능
- 각 서비스 → **"Deployments"** → **"View Logs"**

### 2. 환경 변수 변경
- 환경 변수 변경 후 자동 재배포
- 즉시 적용됨

### 3. 수동 재배포
- **"Deployments"** 탭 → **"Redeploy"** 버튼
- 코드 변경 없이 재시작 필요할 때 사용

### 4. GitHub 자동 배포
- GitHub에 푸시하면 자동으로 Railway에 배포
- main 브랜치 기준

### 5. 비용 관리
- **"Usage"** 탭에서 사용량 확인
- 무료 티어 초과 시 알림

### 6. Rollback
- **"Deployments"** 탭에서 이전 버전으로 롤백 가능
- 문제 발생 시 빠르게 복구

---

## 📈 배포 후 체크리스트

- [ ] PostgreSQL 서비스 Running
- [ ] 백엔드 서비스 Running
- [ ] 프론트엔드 서비스 Running
- [ ] 백엔드 health check 성공
- [ ] 프론트엔드 접속 가능
- [ ] 워크스페이스 생성 테스트
- [ ] AI 채팅 기능 테스트
- [ ] 파일 생성/편집 테스트
- [ ] 지갑 연결 테스트
- [ ] ZIP 내보내기 테스트

---

## 🎉 배포 완료!

축하합니다! nym이 Railway에 성공적으로 배포되었습니다.

### 다음 단계
1. 팀원들과 URL 공유
2. 프로덕션 사용 시작
3. 사용자 피드백 수집
4. 기능 개선 및 업데이트

### 추가 자료
- Railway 공식 문서: https://docs.railway.app
- Railway 커뮤니티: https://discord.gg/railway

---

**문제가 발생하면?**
- Railway Discord에서 도움 요청
- GitHub 이슈 생성
- Railway 문서 참조

Happy Deploying! 🚀

