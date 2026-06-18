/**
 * Bootstrap — register all modules here.
 *
 * To add a new module:
 *   1. Create modules/your-module/index.ts implementing Module interface
 *   2. Import and register it here
 *   3. Done — it's available at /api/[module]/[action]
 *
 * To swap a module (e.g. different auth strategy):
 *   1. Create your custom module implementing Module with same id
 *   2. Replace the import below
 *   3. No other changes needed
 */

import { registerModule } from './core/registry'
import { GoogleAuthModule }   from './modules/google-auth'
import { MCPInstallerModule } from './modules/mcp-installer'
import { MCPServerModule }    from './modules/mcp-server'
import { AccountsModule }     from './modules/accounts'
import { CampaignsModule }    from './modules/campaigns'

let bootstrapped = false

export function bootstrap() {
  if (bootstrapped) return
  bootstrapped = true

  registerModule(GoogleAuthModule)
  registerModule(MCPInstallerModule)
  registerModule(MCPServerModule)
  registerModule(AccountsModule)
  registerModule(CampaignsModule)
}

// Re-export everything needed by API routes
export { runAction, listModules, getModule } from './core/registry'
export { getConfig }                          from './core/config'
export type { ModuleContext }                 from './core/types'
