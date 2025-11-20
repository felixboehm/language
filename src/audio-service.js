/**
 * Audio Service for text-to-speech functionality with iOS lock screen support
 * Uses Web Speech API for generating speech and audio elements for playback
 */

export class AudioService {
    constructor() {
        this.audioQueue = [];
        this.currentAudioIndex = 0;
        this.isPlaying = false;
        this.isPaused = false;
        this.currentAudio = null;
        this.audioSpeed = 1.0;
        this.readTranslations = true;
        this.onPlayStateChange = null;
        this.onCurrentItemChange = null;
        
        // Check for browser support
        this.speechSynthesis = window.speechSynthesis;
        this.supportsAudio = typeof Audio !== 'undefined';
    }

    /**
     * Generate audio queue for all items to be read
     * Since Web Speech API doesn't support blob export, we'll just prepare the queue
     */
    async generateAudioQueue(items) {
        this.audioQueue = items.map(item => ({
            ...item
        }));
    }

    /**
     * Convert text to audio blob using Web Speech API
     * Note: This is a placeholder - Web Speech API doesn't provide direct audio blob export
     * For iOS lock screen support, consider using a TTS service that returns audio files
     */
    async textToAudioBlob(text, lang = 'en-US') {
        // This method is kept for future enhancement with a proper TTS service
        return null;
    }

    /**
     * Set audio playback speed
     */
    setSpeed(speed) {
        this.audioSpeed = speed;
        if (this.currentAudio) {
            this.currentAudio.playbackRate = speed;
        }
    }

    /**
     * Set whether to read translations
     */
    setReadTranslations(enabled) {
        this.readTranslations = enabled;
    }

    /**
     * Start playing from the beginning or resume from pause
     */
    play() {
        if (this.isPaused) {
            this.resume();
            return;
        }

        if (this.audioQueue.length === 0) {
            console.warn('No audio queue available');
            return;
        }

        this.isPlaying = true;
        this.isPaused = false;
        this.currentAudioIndex = 0;
        this.playCurrentItem();
        this.notifyPlayStateChange();
    }

    /**
     * Play from a specific index
     */
    playFrom(index) {
        if (index < 0 || index >= this.audioQueue.length) {
            console.warn('Invalid audio index:', index);
            return;
        }

        this.stop();
        this.currentAudioIndex = index;
        this.isPlaying = true;
        this.isPaused = false;
        this.playCurrentItem();
        this.notifyPlayStateChange();
    }

    /**
     * Pause playback
     */
    pause() {
        if (!this.isPlaying) return;

        this.isPaused = true;
        this.isPlaying = false;

        if (this.currentAudio) {
            this.speechSynthesis.cancel();
        }

        this.notifyPlayStateChange();
    }

    /**
     * Resume playback from pause
     */
    resume() {
        if (!this.isPaused) return;

        this.isPaused = false;
        this.isPlaying = true;
        this.playCurrentItem();
        this.notifyPlayStateChange();
    }

    /**
     * Stop playback completely
     */
    stop() {
        this.isPlaying = false;
        this.isPaused = false;

        if (this.currentAudio) {
            this.speechSynthesis.cancel();
            this.currentAudio = null;
        }

        this.notifyPlayStateChange();
    }

    /**
     * Play the current item in the queue
     */
    playCurrentItem() {
        if (!this.isPlaying || this.currentAudioIndex >= this.audioQueue.length) {
            this.stop();
            return;
        }

        const item = this.audioQueue[this.currentAudioIndex];
        this.notifyCurrentItemChange(item);

        // Scroll to the current item
        if (item.elementId) {
            this.scrollToElement(item.elementId);
        }

        // Use Web Speech API for speech synthesis
        const utterance = new SpeechSynthesisUtterance(item.text);
        utterance.lang = item.lang || 'en-US';
        utterance.rate = this.audioSpeed;

        utterance.onend = () => {
            if (this.isPlaying) {
                this.currentAudioIndex++;
                setTimeout(() => this.playCurrentItem(), 300); // Small pause between items
            }
        };

        utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event);
            if (this.isPlaying) {
                this.currentAudioIndex++;
                this.playCurrentItem();
            }
        };

        this.currentAudio = utterance;
        this.speechSynthesis.speak(utterance);
    }

    /**
     * Scroll to element with smooth behavior
     */
    scrollToElement(elementId) {
        const element = document.querySelector(`[data-audio-id="${elementId}"]`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    /**
     * Notify listeners of play state change
     */
    notifyPlayStateChange() {
        if (this.onPlayStateChange) {
            this.onPlayStateChange(this.isPlaying, this.isPaused);
        }
    }

    /**
     * Notify listeners of current item change
     */
    notifyCurrentItemChange(item) {
        if (this.onCurrentItemChange) {
            this.onCurrentItemChange(item);
        }
    }

    /**
     * Clean up resources
     */
    destroy() {
        this.stop();
        this.audioQueue = [];
    }
}
