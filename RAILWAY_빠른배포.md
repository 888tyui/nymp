# Railway 빠른 배포 가이드 (5분)

nym 프로젝트를 Railway에 빠르게 배포하는 체크리스트입니다.

## 사전 준비 ✅

- [ ] Railway 계정 (https://railway.app)
- [ ] GitHub 연결 완료
- [ ] OpenAI API 키 준비

---

## 1️⃣ 프로젝트 생성 (30초)

```
Railway → New Project → Empty Project
이름: nym-app
```

---

## 2️⃣ PostgreSQL 추가 (30초)

```
+ New → Database → Add PostgreSQL
```

**DATABASE_URL 복사해두기**

---

## 3️⃣ 백엔드 배포 (2분)

### 서비스 추가
```
+ New → GitHub Repo → 888tyui/nymp
```

### 설정 (Settings 탭)
```
Root Directory: backend
Build Command: npm install && npm run build
Start Command: npm run start
```

### 환경 변수 (Variables 탭)
```
DATABASE_URL = (PostgreSQL 참조로 설정)
OPENAI_API_KEY = sk-your-key-here
PORT = 3001
NODE_ENV = production
FRONTEND_URL = (나중에 설정)
```

### 도메인 생성
```
Settings → Networking → Generate Domain
URL 복사: https://backend-xxx.up.railway.app
```

---

## 4️⃣ 프론트엔드 배포 (2분)

### 서비스 추가
```
+ New → GitHub Repo → 888tyui/nymp (다시 추가)
```

### 설정 (Settings 탭)
```
서비스 이름: frontend
Root Directory: frontend
Build Command: npm install && npm run build
Start Command: npm run start
```

### 환경 변수 (Variables 탭)
```
NEXT_PUBLIC_API_URL = https://backend-xxx.up.railway.app
NEXT_PUBLIC_MONAD_RPC_URL = https://monad-rpc-url
```

### 도메인 생성
```
Settings → Networking → Generate Domain
URL 복사: https://frontend-xxx.up.railway.app
```

---

## 5️⃣ 백엔드 업데이트 (30초)

```
백엔드 서비스 → Variables 탭
FRONTEND_URL = https://frontend-xxx.up.railway.app
저장 → 자동 재배포
```

---

## ✅ 테스트

### 백엔드 확인
```
https://your-backend-url.up.railway.app/health
```

응답: `{"status":"ok","message":"nym API is running"}`

### 프론트엔드 확인
```
https://your-frontend-url.up.railway.app
```

nym 앱이 로드되어야 함!

---

## 🎯 최종 구조

```
nym-app
├── 🗄️ PostgreSQL (Running)
├── ⚙️ backend (Running)
│   └── https://backend-xxx.up.railway.app
└── 🎨 frontend (Running)
    └── https://frontend-xxx.up.railway.app
```

---

## 🚨 자주 발생하는 문제

### 백엔드가 Crashed
→ DATABASE_URL이 Reference로 설정되었는지 확인
→ OPENAI_API_KEY 확인

### CORS 에러
→ 백엔드의 FRONTEND_URL 확인
→ 프론트엔드 URL과 정확히 일치해야 함

### 프론트엔드에서 API 호출 실패
→ NEXT_PUBLIC_API_URL 확인
→ 백엔드 URL과 정확히 일치해야 함

---

## 📝 체크리스트

배포 완료 확인:

- [ ] PostgreSQL: Running ✅
- [ ] Backend: Running ✅
- [ ] Frontend: Running ✅
- [ ] Health check 성공 ✅
- [ ] 프론트엔드 접속 ✅
- [ ] 워크스페이스 생성 ✅
- [ ] AI 채팅 작동 ✅

---

## 🎉 완료!

축하합니다! nym이 Railway에 배포되었습니다.

**더 자세한 내용은 `RAILWAY_배포가이드.md` 참조**

---

## 💰 비용

- 무료 티어: $5/월 크레딧
- 일반적으로 개발용으로 충분
- Usage 탭에서 사용량 확인

---

## 🔄 자동 배포

GitHub에 푸시하면 자동으로 Railway에 배포됩니다:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

Railway가 자동으로 감지하고 배포 시작!

---

**문제 발생 시**: `RAILWAY_배포가이드.md`의 문제 해결 섹션 참조

