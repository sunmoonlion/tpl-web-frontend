# tpl-web-frontend

SunmoonAI 的 Next Web 通用模板。它提供 App Router、React Server/Client
边界、next-intl、Tailwind/shadcn UI、同源 API 接入点和可自托管的 standalone
构建；不包含 Info、Knowledge 或 Research 的领域页面和 DTO。

## 本地开发

```bash
# .nvmrc is the canonical reproducible version; Node 20.18–24.x is accepted
# for local development, while Docker/CI remain pinned to Node 20.18.0.
nvm use 20.18.0
corepack enable
corepack pnpm install --frozen-lockfile
corepack pnpm dev
```

首次使用时，从 `.env.example` 生成未提交的 `.env.local`，并按当前隔离环境
配置 `NEXT_PUBLIC_API_URL`。默认值是同源 `/api`。不要把 Casdoor、Redis、服务
token 或其他凭据放进 `NEXT_PUBLIC_*` 或前端仓库。

## 质量门禁

```bash
corepack pnpm typecheck
corepack pnpm lint
corepack pnpm build
```

生产镜像使用 `mybuild/Dockerfile` 的 `output: standalone` 产物，并由 Nginx/
Ingress 或受控 Node server 对外提供服务。发布前必须同时记录模板 commit、依赖
锁、镜像 digest、环境契约和回滚版本；本仓库不会覆盖三个 Web App 的正式流量。

## 架构边界

- `proxy.ts` 只负责 locale negotiation 等请求前路由工作，不是授权边界。
- Server Component 只能通过 server-only DAL/typed DTO 访问服务端数据；浏览器使用
  typed client，不读取 LangGraph、Provider 或服务身份类型。
- BFF、session/cookie、SSE cursor/reconcile、Citation DTO 和缓存归属以 k8s
  v5 ADR-001/004/005/014 为准；未冻结前不在模板中伪造业务成功。
- 迁移到 Info、Knowledge、Research 时必须原地替换现有仓库，保留领域页面并按
  迁移前 tag、候选镜像 digest、隔离部署和回滚证据串行执行。

## 参考

- Next.js App Router 与自托管文档：<https://nextjs.org/docs>
- 本仓库的迁移/架构决策：`k8s/sunmoonai/docs/mooc-manus-v5/`
