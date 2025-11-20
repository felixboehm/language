// Create Vue app
import { createApp } from 'vue';
import { simpleYamlParse } from './simple-yaml.js';
import { AudioService } from './audio-service.js';

createApp({
    data() {
        return {
            // Content and selection
            availableContent: {},
            selectedLearning: null,
            selectedTeaching: null,
            loadedLessons: [],
            currentLesson: null,
            
            // Settings
            settings: {
                showTranslation: true,
                darkMode: false,
                audioSpeed: 1.0,
                readTranslations: true
            },
            
            // View states
            currentView: 'selection', // 'selection', 'overview', 'detail', 'settings'
            
            // Loading state
            isLoadingContent: true,
            
            // Audio state
            audioService: null,
            isPlaying: false,
            currentReadingId: null,
        };
    },
    
    computed: {
        learningLanguages() {
            return Object.keys(this.availableContent);
        },
        
        teachingTopics() {
            if (!this.selectedLearning) return [];
            return Object.keys(this.availableContent[this.selectedLearning] || {});
        },
        
        canLoadLessons() {
            return this.selectedLearning && this.selectedTeaching;
        },
        
        overviewTitle() {
            return `${this.formatLangName(this.selectedTeaching)} - ${this.formatLangName(this.selectedLearning)} Interface`;
        }
    },
    
    methods: {
        async loadAvailableContent() {
            try {
                this.isLoadingContent = true;
                
                // Only load lessons/index.yaml to get available learning languages
                const mainIndexResponse = await fetch('lessons/index.yaml');
                const mainIndexText = await mainIndexResponse.text();
                const mainIndex = simpleYamlParse(mainIndexText);
                
                // Initialize with empty objects for each language
                const content = {};
                for (const lang of mainIndex.languages) {
                    content[lang] = {};
                }
                
                this.availableContent = content;
                this.isLoadingContent = false;
            } catch (error) {
                console.error('Error loading available content:', error);
                this.isLoadingContent = false;
            }
        },
        
        async loadTopicsForLanguage(lang) {
            try {
                // Load lessons/{lang}/index.yaml to get available topics
                const langIndexResponse = await fetch(`lessons/${lang}/index.yaml`);
                const langIndexText = await langIndexResponse.text();
                const langIndex = simpleYamlParse(langIndexText);
                
                // Initialize topics with empty arrays
                for (const topic of langIndex.topics) {
                    this.availableContent[lang][topic] = [];
                }
            } catch (error) {
                console.error(`Error loading topics for ${lang}:`, error);
            }
        },
        
        async loadLessonsForTopic(lang, topic) {
            try {
                // Load lessons/{lang}/{topic}/index.yaml to get lesson files
                const topicIndexResponse = await fetch(`lessons/${lang}/${topic}/index.yaml`);
                const topicIndexText = await topicIndexResponse.text();
                const topicIndex = simpleYamlParse(topicIndexText);
                
                this.availableContent[lang][topic] = topicIndex.lessons;
            } catch (error) {
                console.error(`Error loading lessons for ${lang}/${topic}:`, error);
            }
        },
        
        formatLangName(name) {
            if (!name) return '';
            const names = {
                'deutsch': 'Deutsch',
                'english': 'English',
                'portugiesisch': 'Portugiesisch',
                'englisch': 'Englisch',
                'portugese': 'Portuguese'
            };
            return names[name] || name.charAt(0).toUpperCase() + name.slice(1);
        },
        
        async selectLearning(lang) {
            this.selectedLearning = lang;
            this.selectedTeaching = null;
            
            // Load topics for selected language if not already loaded
            if (Object.keys(this.availableContent[lang]).length === 0) {
                await this.loadTopicsForLanguage(lang);
            }
        },
        
        async selectTeaching(topic) {
            this.selectedTeaching = topic;
            
            // Load lessons for selected topic if not already loaded
            if (this.availableContent[this.selectedLearning][topic].length === 0) {
                await this.loadLessonsForTopic(this.selectedLearning, topic);
            }
        },
        
        async loadSelectedLessons() {
            if (!this.canLoadLessons) return;
            
            const lessonFiles = this.availableContent[this.selectedLearning][this.selectedTeaching];
            this.loadedLessons = [];
            
            // Load each YAML file
            for (const file of lessonFiles) {
                try {
                    const path = `lessons/${this.selectedLearning}/${this.selectedTeaching}/${file}.yaml`;
                    const response = await fetch(path);
                    const yamlText = await response.text();
                    const lessonData = simpleYamlParse(yamlText);
                    this.loadedLessons.push(lessonData);
                } catch (error) {
                    console.error(`Error loading ${file}:`, error);
                }
            }
            
            // Sort by lesson number
            this.loadedLessons.sort((a, b) => a.number - b.number);
            
            this.currentView = 'overview';
        },
        
        openLesson(lessonNumber) {
            this.currentLesson = this.loadedLessons.find(l => l.number === lessonNumber);
            if (this.currentLesson) {
                this.currentView = 'detail';
                this.initializeAudioForLesson();
            }
        },
        
        async initializeAudioForLesson() {
            if (!this.currentLesson) return;
            
            // Clean up previous audio service
            if (this.audioService) {
                this.audioService.destroy();
            }
            
            // Create new audio service
            this.audioService = new AudioService();
            this.audioService.setSpeed(this.settings.audioSpeed);
            this.audioService.setReadTranslations(this.settings.readTranslations);
            
            // Set up callbacks
            this.audioService.onPlayStateChange = (isPlaying, isPaused) => {
                this.isPlaying = isPlaying;
            };
            
            this.audioService.onCurrentItemChange = (item) => {
                this.currentReadingId = item.elementId;
            };
            
            // Build audio queue
            const audioItems = this.buildAudioQueue();
            await this.audioService.generateAudioQueue(audioItems);
        },
        
        buildAudioQueue() {
            const items = [];
            
            // Add lesson title
            items.push({
                text: this.currentLesson.title,
                elementId: 'lesson-title',
                lang: this.getLanguageCode(this.selectedTeaching)
            });
            
            // Add sections and examples
            this.currentLesson.sections.forEach((section, sectionIdx) => {
                // Add section title
                items.push({
                    text: section.title,
                    elementId: `section-${sectionIdx}`,
                    lang: this.getLanguageCode(this.selectedTeaching)
                });
                
                // Add examples
                section.examples.forEach((example, exampleIdx) => {
                    const elementId = `example-${sectionIdx}-${exampleIdx}`;
                    
                    // Add the question
                    items.push({
                        text: example.q,
                        elementId: elementId,
                        lang: this.getLanguageCode(this.selectedTeaching)
                    });
                    
                    // Add the translation if setting is enabled
                    if (this.settings.readTranslations && this.settings.showTranslation) {
                        items.push({
                            text: example.a,
                            elementId: elementId,
                            lang: this.getLanguageCode(this.selectedLearning)
                        });
                    }
                });
            });
            
            return items;
        },
        
        getLanguageCode(language) {
            const langMap = {
                'deutsch': 'de-DE',
                'english': 'en-US',
                'englisch': 'en-US',
                'portugiesisch': 'pt-PT',
                'portugese': 'pt-PT'
            };
            return langMap[language] || 'en-US';
        },
        
        toggleAudioPlayback() {
            if (!this.audioService) {
                this.initializeAudioForLesson();
                return;
            }
            
            if (this.isPlaying) {
                this.audioService.pause();
            } else {
                this.audioService.play();
            }
        },
        
        handleExampleClick(sectionIdx, exampleIdx) {
            const elementId = `example-${sectionIdx}-${exampleIdx}`;
            
            if (!this.audioService) {
                return;
            }
            
            // Find the index in the audio queue for this example
            const queueIndex = this.audioService.audioQueue.findIndex(
                item => item.elementId === elementId
            );
            
            if (queueIndex === -1) return;
            
            if (this.isPlaying) {
                // If playing, start from this example
                this.audioService.playFrom(queueIndex);
            } else {
                // If not playing, read just this example
                this.audioService.playFrom(queueIndex);
                
                // Stop after reading this example (and its translation if enabled)
                const itemsToRead = this.settings.readTranslations && this.settings.showTranslation ? 2 : 1;
                setTimeout(() => {
                    const currentIdx = this.audioService.currentAudioIndex;
                    if (currentIdx >= queueIndex + itemsToRead) {
                        this.audioService.stop();
                    }
                }, 100);
            }
        },
        
        backToOverview() {
            // Clean up audio service
            if (this.audioService) {
                this.audioService.destroy();
                this.audioService = null;
            }
            this.isPlaying = false;
            this.currentReadingId = null;
            
            this.currentLesson = null;
            this.currentView = 'overview';
        },
        
        backToSelection() {
            this.loadedLessons = [];
            this.currentLesson = null;
            this.currentView = 'selection';
        },
        
        openSettings() {
            this.currentView = 'settings';
        },
        
        closeSettings() {
            if (this.currentLesson) {
                this.currentView = 'detail';
            } else if (this.loadedLessons.length > 0) {
                this.currentView = 'overview';
            } else {
                this.currentView = 'selection';
            }
        },
        
        toggleTranslation() {
            this.settings.showTranslation = !this.settings.showTranslation;
            this.saveSettings();
            // Rebuild audio queue if lesson is open
            if (this.currentLesson && this.audioService) {
                this.initializeAudioForLesson();
            }
        },
        
        toggleDarkMode() {
            this.saveSettings();
            this.applyDarkMode();
        },
        
        saveSettings() {
            localStorage.setItem('appSettings', JSON.stringify(this.settings));
            // Update audio service if it exists
            if (this.audioService) {
                this.audioService.setSpeed(this.settings.audioSpeed);
                this.audioService.setReadTranslations(this.settings.readTranslations);
            }
        },
        
        loadSettings() {
            const saved = localStorage.getItem('appSettings');
            if (saved) {
                const parsedSettings = JSON.parse(saved);
                // Merge with defaults to ensure new settings are present
                this.settings = {
                    showTranslation: true,
                    darkMode: false,
                    audioSpeed: 1.0,
                    readTranslations: true,
                    ...parsedSettings
                };
            }
        },
        
        applyDarkMode() {
            if (this.settings.darkMode) {
                document.body.classList.add('dark');
            } else {
                document.body.classList.remove('dark');
            }
        },
        
        marked(text) {
            return text
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/\n-\s/g, '\n• ')
                .replace(/\n/g, '<br>');
        }
    },
    
    mounted() {
        this.loadSettings();
        this.applyDarkMode();
        this.loadAvailableContent();
    }
}).mount('#app');
