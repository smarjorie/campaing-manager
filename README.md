# Google Ads MCP — Arquitetura Modular v2

## Estrutura

```
google-ads-mcp-v2/
├── core/
│   ├── types.ts       # Interfaces compartilhadas (Module, AppConfig, MCPSource...)
│   ├── config.ts      # Lê config.json + client_secret.json + env vars
│   └── registry.ts    # Registra e executa módulos
├── modules/
│   ├── google-auth/   # OAuth2 com Google
│   ├── mcp-installer/ # Instala o pacote MCP (pipx, PyPI, local)
│   ├── mcp-server/    # Gerencia o processos MCP
│   ├── accounts/      # Lista contas Google Ads
│   └── campaigns/     # CRUD de campanhas
├── bootstrap.ts       # Registra todos os módulos
└── app/
    └── api/[module]/[action]/route.ts  # Rota dinâmica — serve todos os módulos
```

## Como usar (API)

Cada módulo expõe ações acessíveis via:
```
GET  /api/{moduleId}/{actionId}?param=value
POST /api/{moduleId}/{actionId}    body: { param: value }
```

### Exemplos:

```bash
# Status da autenticação
GET /api/google-auth/status

# Listar contas
GET /api/accounts/list

# Listar campanhas
GET /api/campaigns/list?customerId=1234567890

# Toggle campanha
POST /api/campaigns/toggle
{ "customerId": "123", "campaignId": "456", "status": "PAUSED" }

# Criar campanha
POST /api/campaigns/create
{ "customerId": "123", "name": "Marca", "dailyBudget": 50, ... }

# Status do servidor MCP
GET /api/mcp-server/status

# Iniciar servidor MCP
POST /api/mcp-server/start

# Gerar config para Claude Code / Cursor
GET /api/mcp-server/generateConfig

# Verificar se MCP está instalado
GET /api/mcp-installer/check

# Instalar MCP
POST /api/mcp-installer/install
```

## Configuração

### Arquivos locais (nunca commitados):

**`config.json`** — suas credenciais fixas:
```json
{
  "developerToken": "seu-token-aqui",
  "loginCustomerId": "1234567890"
}
```

**`client_secret.json`** — OAuth credentials do Google Cloud (lido automaticamente).

### Customizar a fonte do MCP (swap)

Padrão (GitHub oficial):
```json
{
  "mcpSource": {
    "type": "github",
    "value": "git+https://github.com/googleads/google-ads-mcp.git",
    "entryPoint": "google-ads-mcp"
  }
}
```

Fork próprio:
```json
{
  "mcpSource": {
    "type": "github",
    "value": "git+https://github.com/sua-agencia/google-ads-mcp.git",
    "version": "v1.2.0"
  }
}
```

PyPI:
```json
{
  "mcpSource": {
    "type": "pypi",
    "value": "google-ads-mcp",
    "version": "1.0.0"
  }
}
```

Instalação local (desenvolvimento):
```json
{
  "mcpSource": {
    "type": "local",
    "value": "/caminho/para/google-ads-mcp"
  }
}
```

## Adicionar um novo módulo

```typescript
// modules/meu-modulo/index.ts
import type { Module } from '../../core/types'

export const MeuModulo: Module = {
  id: 'meu-modulo',
  name: 'Meu Módulo',
  description: 'Faz algo útil',
  version: '1.0.0',
  actions: {
    minhaAcao: {
      description: 'Faz algo',
      params: {
        param1: { type: 'string', required: true }
      },
      handler: async (params, ctx) => {
        // ctx.config tem todas as credenciais
        return { ok: true, data: { resultado: 'ok' } }
      }
    }
  }
}
```

Registrar em `bootstrap.ts`:
```typescript
import { MeuModulo } from './modules/meu-modulo'
registerModule(MeuModulo)
```

Pronto — disponível em `/api/meu-modulo/minha-acao`.

## Rodar

```bash
npm install
npm run dev
# Acesse: http://localhost:3000
```
