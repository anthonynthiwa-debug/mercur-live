import { describe, it, expect, vi } from 'vitest'
import LiveStreamService from '../services/service'

describe('LiveStreamService', () => {
  it('should generate Agora tokens', async () => {
    const service = new LiveStreamService({
        agoraAppId: 'test_id',
        agoraAppCertificate: 'test_cert'
    } as any)

    const tokens = await service.generateAgoraToken('test_channel', 'user1', 'host')

    expect(tokens).toHaveProperty('rtcToken')
    expect(tokens).toHaveProperty('rtmToken')
    expect(tokens.appId).toBe('test_id')
  })
})
