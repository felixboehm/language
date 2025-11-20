// Available learning languages and topics
const availableContent = {
    'deutsch': {
        'portugiesisch': ['01-basic-verbs', '02-modal-verbs', '03-daily-activities'],
        'englisch': ['01-greetings']
    }
};

// Create Vue app
const { createApp } = Vue;

createApp({
    data() {
        return {
            // Content and selection
            availableContent: availableContent,
            selectedLearning: null,
            selectedTeaching: null,
            loadedLessons: [],
            currentLesson: null,
            
            // Settings
            settings: {
                showTranslation: true,
                darkMode: false
            },
            
            // View states
            currentView: 'selection', // 'selection', 'overview', 'detail', 'settings'
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
        formatLangName(name) {
            const names = {
                'deutsch': 'Deutsch',
                'english': 'English',
                'portugiesisch': 'Portugiesisch',
                'englisch': 'Englisch',
                'portugese': 'Portuguese'
            };
            return names[name] || name.charAt(0).toUpperCase() + name.slice(1);
        },
        
        selectLearning(lang) {
            this.selectedLearning = lang;
            this.selectedTeaching = null;
        },
        
        selectTeaching(topic) {
            this.selectedTeaching = topic;
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
            }
        },
        
        backToOverview() {
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
        },
        
        toggleDarkMode() {
            this.settings.darkMode = !this.settings.darkMode;
            this.saveSettings();
            this.applyDarkMode();
        },
        
        loadSettings() {
            const saved = localStorage.getItem('appSettings');
            if (saved) {
                this.settings = JSON.parse(saved);
            }
        },
        
        saveSettings() {
            localStorage.setItem('appSettings', JSON.stringify(this.settings));
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
    }
}).mount('#app');
