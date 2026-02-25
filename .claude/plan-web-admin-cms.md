# Implementation Plan: Web-based CMS Admin for Documentation Site

## Summary

현재 Fumadocs 기반 문서 사이트에 **웹 어드민 기능**을 추가하여, 개발자들이 배포된 웹사이트에서 직접 글을 작성하고 GitHub에 커밋/배포할 수 있게 함.

**핵심 플로우**:
1. 개발자가 `https://docs.eureka.codes/admin`에 GitHub OAuth로 로그인
2. MDX 에디터에서 새 문서/블로그 작성
3. "Publish" 버튼 클릭 → GitHub API로 `content/` 폴더에 커밋
4. GitHub Actions가 자동으로 사이트 재빌드/배포

---

## Tech Stack

| Category | Technology | Version |
|----------|------------|---------|
| Framework | Next.js | 15.5.2 |
| React | React | 19.1.1 |
| Documentation | Fumadocs | 15.7.7 |
| Auth | Auth.js (NextAuth v5) | beta |
| GitHub API | Octokit | @octokit/rest |
| Editor | Monaco Editor 또는 CodeMirror | latest |
| Styling | Tailwind CSS | 4.1.12 |
| Validation | Zod | (기존 사용 중) |

---

## Knowledge Sources

| Source | Key Findings |
|--------|--------------|
| `src/lib/source.ts` | Fumadocs loader로 `/docs`, `/blog` 콘텐츠 로드 |
| `source.config.ts` | Extended Zod schema (frontmatter, meta.json) |
| `src/app/api/search` | 유일한 기존 API route, static export용 |
| `next.config.mjs` | Production에서 `output: 'export'` (정적 빌드) |
| Auth.js docs | GitHub OAuth + JWT session pattern |
| Octokit docs | `repos.createOrUpdateFileContents()` API |

---

## Architecture Decision

### Static vs Dynamic 분리

**문제**: 현재 프로젝트는 `output: 'export'`로 정적 빌드됨. Admin 기능은 동적 라우트 필요.

**해결책**: **두 가지 배포 모드** 지원

```
┌─────────────────────────────────────────────────────────────┐
│  Production Build (Static Export)                           │
│  - /docs, /blog → Static HTML (AWS S3)                      │
│  - Admin routes 제외                                        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Admin Server (Dynamic)                                      │
│  - Vercel / Separate Node.js server                         │
│  - /admin/* → Server-side rendering                         │
│  - /api/* → API routes                                      │
└─────────────────────────────────────────────────────────────┘
```

**구현 방식**:
- `next.config.mjs`에서 환경변수로 모드 전환
- `ADMIN_MODE=true`일 때 dynamic export 비활성화
- Admin은 Vercel Free tier로 별도 배포 가능

---

## Workflow Diagram

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Developer  │     │  Admin Site  │     │   GitHub     │
│              │     │  (Vercel)    │     │   Repo       │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                    │
       │  1. Login (OAuth)  │                    │
       │───────────────────>│                    │
       │                    │  2. Get Token      │
       │                    │<───────────────────│
       │                    │                    │
       │  3. Write Content  │                    │
       │───────────────────>│                    │
       │                    │                    │
       │  4. Publish        │                    │
       │───────────────────>│  5. Commit via API │
       │                    │───────────────────>│
       │                    │                    │
       │                    │                    │ 6. GitHub Actions
       │                    │                    │    triggers build
       │                    │                    │
       │                    │  7. Deploy to S3   │
       │                    │<───────────────────│
       │                    │                    │
```

---

## Boundaries

### ✅ Do

1. **GitHub OAuth 인증** - Auth.js v5 사용
2. **MDX 에디터** - 실시간 프리뷰 지원
3. **GitHub API 커밋** - Octokit으로 직접 커밋
4. **권한 관리** - GitHub org/team 멤버십 체크
5. **문서/블로그 관리** - CRUD 기능
6. **Frontmatter 편집** - 기존 스키마 준수
7. **이미지 업로드** - GitHub repo에 저장

### ⚠️ Ask First

1. Admin 배포 환경 (Vercel vs 별도 서버)?
2. 이미지 저장소 (GitHub repo vs S3)?
3. Draft/Published 상태 관리 방식?
4. 다국어 지원 필요 여부?

### 🚫 Don't

1. Fumadocs 코어 구조 변경하지 않음
2. 정적 빌드 로직 수정하지 않음
3. 기존 `/docs`, `/blog` 라우트 변경하지 않음
4. Database 추가하지 않음 (GitHub이 저장소)

---

## Files to Create/Modify

### New Files

| File | Purpose |
|------|---------|
| `auth.ts` | Auth.js 설정 (GitHub OAuth) |
| `middleware.ts` | Admin 라우트 보호 |
| `src/app/admin/layout.tsx` | Admin 레이아웃 |
| `src/app/admin/page.tsx` | Admin 대시보드 |
| `src/app/admin/posts/page.tsx` | 문서/블로그 목록 |
| `src/app/admin/posts/new/page.tsx` | 새 글 작성 |
| `src/app/admin/posts/[id]/edit/page.tsx` | 글 수정 |
| `src/app/api/auth/[...nextauth]/route.ts` | Auth API handlers |
| `src/app/api/admin/posts/route.ts` | Posts CRUD API |
| `src/app/api/admin/posts/[path]/route.ts` | Single post API |
| `src/app/api/admin/upload/route.ts` | Image upload API |
| `src/lib/github.ts` | Octokit 유틸리티 |
| `src/lib/admin/validation.ts` | Zod schemas for admin |
| `src/components/admin/editor.tsx` | MDX 에디터 컴포넌트 |
| `src/components/admin/preview.tsx` | MDX 프리뷰 컴포넌트 |
| `src/components/admin/sidebar.tsx` | Admin 사이드바 |
| `src/components/admin/post-list.tsx` | 포스트 목록 |
| `src/components/admin/frontmatter-form.tsx` | Frontmatter 편집 폼 |
| `src/types/admin.ts` | Admin 타입 정의 |

### Modified Files

| File | Changes |
|------|---------|
| `next.config.mjs` | ADMIN_MODE 환경변수 처리 |
| `package.json` | 새 의존성 추가, admin 스크립트 |
| `tsconfig.json` | @/admin path alias (optional) |

---

## Implementation Checklist

### Phase 1: Authentication Setup
- [ ] `yarn add next-auth@beta @octokit/rest`
- [ ] Create `auth.ts` with GitHub provider
- [ ] Create `/api/auth/[...nextauth]/route.ts`
- [ ] Create `middleware.ts` for admin protection
- [ ] Add environment variables to `.env.local`
- [ ] Test GitHub OAuth login flow

### Phase 2: Admin Layout & Dashboard
- [ ] Create `/admin/layout.tsx` with sidebar
- [ ] Create `/admin/page.tsx` dashboard
- [ ] Add admin navigation components
- [ ] Style with Tailwind (separate from Fumadocs UI)

### Phase 3: Content Listing
- [ ] Create `src/lib/github.ts` with Octokit utils
- [ ] Create `/api/admin/posts/route.ts` (list files)
- [ ] Create `/admin/posts/page.tsx` (list view)
- [ ] Add filtering by type (docs/blog)
- [ ] Add search functionality

### Phase 4: Content Editor
- [ ] Install editor package (Monaco or CodeMirror)
- [ ] Create `/admin/posts/new/page.tsx`
- [ ] Create MDX editor component
- [ ] Create frontmatter form component
- [ ] Add real-time MDX preview
- [ ] Implement file path validation

### Phase 5: GitHub Integration
- [ ] Create `/api/admin/posts/route.ts` POST (create)
- [ ] Create `/api/admin/posts/[path]/route.ts` (read/update/delete)
- [ ] Implement commit with proper message format
- [ ] Add error handling for API limits
- [ ] Test commit workflow

### Phase 6: Image Upload
- [ ] Create `/api/admin/upload/route.ts`
- [ ] Implement image upload to `/public/images/` via GitHub API
- [ ] Add drag-and-drop support in editor
- [ ] Generate proper image paths

### Phase 7: Polish & Deploy
- [ ] Add loading states and error handling
- [ ] Add toast notifications
- [ ] Configure Vercel deployment
- [ ] Update `next.config.mjs` for admin mode
- [ ] Add deploy scripts

---

## Environment Variables

```env
# .env.local
AUTH_SECRET=generated-secret-key
AUTH_GITHUB_ID=your-github-oauth-app-id
AUTH_GITHUB_SECRET=your-github-oauth-app-secret

# Repository configuration
GITHUB_OWNER=lemoncloud-io
GITHUB_REPO=codes-docs
GITHUB_BRANCH=develop

# Admin mode (for separate deployment)
ADMIN_MODE=true
```

---

## Dependencies to Add

```json
{
  "dependencies": {
    "next-auth": "beta",
    "@octokit/rest": "^21.0.0",
    "@monaco-editor/react": "^4.6.0"
  }
}
```

---

## Verification Commands

```bash
# Development
yarn dev                    # Start with admin enabled

# Type check
yarn tsc --noEmit

# Build test (admin mode)
ADMIN_MODE=true yarn build

# Build test (static mode - existing)
yarn build
```

---

## Review Focus

- [ ] Auth token이 클라이언트에 노출되지 않는지 확인
- [ ] GitHub API rate limit 처리
- [ ] MDX frontmatter 스키마 준수
- [ ] 파일 경로 validation (보안)
- [ ] 커밋 메시지 형식 일관성
- [ ] 에러 상태 처리 UX

---

## Key Decisions

| Decision | Options | Selected | Rationale |
|----------|---------|----------|-----------|
| Auth | Auth.js, Clerk, Custom | Auth.js | GitHub OAuth 네이티브 지원 |
| Editor | Monaco, CodeMirror, Textarea | Monaco | VSCode 사용자 친숙, MDX 지원 |
| Storage | GitHub, S3, DB | GitHub | DB 불필요, Git history 활용 |
| Deploy (Admin) | Vercel, Self-hosted | Vercel | Free tier, 간편한 배포 |
| Static/Dynamic | Separate, Hybrid | Separate | 정적 사이트 성능 유지 |

---

## Estimated Scope

| Phase | Complexity | Priority |
|-------|------------|----------|
| Phase 1: Auth | Medium | P0 |
| Phase 2: Layout | Low | P0 |
| Phase 3: Listing | Medium | P0 |
| Phase 4: Editor | High | P0 |
| Phase 5: GitHub | Medium | P0 |
| Phase 6: Images | Medium | P1 |
| Phase 7: Polish | Low | P1 |

---

## Security Considerations

1. **OAuth Scope**: `repo` scope 필요 (private repo 접근 시)
2. **Token Storage**: JWT session에 저장, httpOnly cookie
3. **Path Validation**: `content/` 외부 접근 차단
4. **Rate Limiting**: GitHub API 5000 req/hour (authenticated)
5. **Org Membership**: 특정 org 멤버만 접근 허용 (optional)
