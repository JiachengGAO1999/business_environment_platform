import type { AgentClient } from './types'
import { MockAgentClient } from './MockAgentClient'
import { HttpAgentClient } from './HttpAgentClient'

let cachedClient: AgentClient | null = null

export function createAgentClient(): AgentClient {
  if (cachedClient) return cachedClient

  const mode = import.meta.env.VITE_AGENT_MODE ?? 'mock'

  if (mode === 'http') {
    const baseUrl = import.meta.env.VITE_AGENT_API_URL ?? ''
    cachedClient = new HttpAgentClient(baseUrl)
  } else {
    cachedClient = new MockAgentClient()
  }

  return cachedClient
}

export function resetAgentClient(): void {
  cachedClient = null
}
