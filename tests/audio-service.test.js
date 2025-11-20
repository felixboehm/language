import { describe, it, expect, beforeEach, vi } from 'vitest'
import { AudioService } from '../src/audio-service.js'

describe('AudioService', () => {
  let audioService

  beforeEach(() => {
    audioService = new AudioService()
    
    // Mock SpeechSynthesisUtterance
    global.SpeechSynthesisUtterance = vi.fn(() => ({
      lang: '',
      rate: 1.0,
      onend: null,
      onerror: null
    }))
    
    // Mock speechSynthesis
    global.speechSynthesis = {
      speak: vi.fn(),
      cancel: vi.fn()
    }
  })

  describe('Initialization', () => {
    it('should initialize with default values', () => {
      expect(audioService.audioQueue).toEqual([])
      expect(audioService.currentAudioIndex).toBe(0)
      expect(audioService.isPlaying).toBe(false)
      expect(audioService.isPaused).toBe(false)
      expect(audioService.audioSpeed).toBe(1.0)
      expect(audioService.readTranslations).toBe(true)
    })
  })

  describe('Settings', () => {
    it('should update audio speed', () => {
      audioService.setSpeed(0.8)
      expect(audioService.audioSpeed).toBe(0.8)
    })

    it('should update read translations setting', () => {
      audioService.setReadTranslations(false)
      expect(audioService.readTranslations).toBe(false)
    })
  })

  describe('Audio Queue', () => {
    it('should generate audio queue from items', async () => {
      const items = [
        { text: 'Hello', lang: 'en-US', elementId: 'example-1' },
        { text: 'World', lang: 'en-US', elementId: 'example-2' }
      ]

      await audioService.generateAudioQueue(items)
      
      expect(audioService.audioQueue).toHaveLength(2)
      expect(audioService.audioQueue[0].text).toBe('Hello')
      expect(audioService.audioQueue[1].text).toBe('World')
    })
  })

  describe('Playback Control', () => {
    beforeEach(async () => {
      const items = [
        { text: 'Hello', lang: 'en-US', elementId: 'example-1' },
        { text: 'World', lang: 'en-US', elementId: 'example-2' }
      ]
      await audioService.generateAudioQueue(items)
    })

    it('should start playing', () => {
      audioService.play()
      expect(audioService.isPlaying).toBe(true)
      expect(audioService.isPaused).toBe(false)
    })

    it('should pause playback', () => {
      audioService.play()
      audioService.pause()
      expect(audioService.isPlaying).toBe(false)
      expect(audioService.isPaused).toBe(true)
    })

    it('should resume playback after pause', () => {
      audioService.play()
      audioService.pause()
      audioService.resume()
      expect(audioService.isPlaying).toBe(true)
      expect(audioService.isPaused).toBe(false)
    })

    it('should stop playback', () => {
      audioService.play()
      audioService.stop()
      expect(audioService.isPlaying).toBe(false)
      expect(audioService.isPaused).toBe(false)
    })

    it('should play from specific index', () => {
      audioService.playFrom(1)
      expect(audioService.currentAudioIndex).toBe(1)
      expect(audioService.isPlaying).toBe(true)
    })
  })

  describe('Callbacks', () => {
    it('should notify play state changes', () => {
      const callback = vi.fn()
      audioService.onPlayStateChange = callback

      audioService.notifyPlayStateChange()
      expect(callback).toHaveBeenCalledWith(false, false)

      audioService.isPlaying = true
      audioService.notifyPlayStateChange()
      expect(callback).toHaveBeenCalledWith(true, false)
    })

    it('should notify current item changes', () => {
      const callback = vi.fn()
      audioService.onCurrentItemChange = callback

      const item = { text: 'Test', elementId: 'test-1' }
      audioService.notifyCurrentItemChange(item)
      expect(callback).toHaveBeenCalledWith(item)
    })
  })

  describe('Cleanup', () => {
    it('should clean up resources on destroy', async () => {
      const items = [
        { text: 'Hello', lang: 'en-US', elementId: 'example-1' }
      ]
      await audioService.generateAudioQueue(items)
      
      audioService.play()
      audioService.destroy()
      
      expect(audioService.isPlaying).toBe(false)
      expect(audioService.audioQueue).toEqual([])
    })
  })
})
