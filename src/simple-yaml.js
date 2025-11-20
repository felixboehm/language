// Simple YAML parser for our specific schema
export const simpleYamlParse = (text) => {
    const lines = text.split('\n');
    let result = {};
    let currentSection = null;
    let currentExample = null;
    let inExplanation = false;
    let explanationText = '';
    let indent = 0;
    
    // Check if this is an index file (simpler structure)
    const isIndexFile = text.includes('languages:') || text.includes('topics:') || text.includes('lessons:');
    
    if (isIndexFile) {
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmed = line.trim();
            
            if (!trimmed || trimmed.startsWith('#')) continue;
            
            if (line.startsWith('languages:')) {
                result.languages = [];
            } else if (line.startsWith('topics:')) {
                result.topics = [];
            } else if (line.startsWith('lessons:')) {
                result.lessons = [];
            } else if (line.match(/^\s*- /)) {
                const value = trimmed.substring(2).trim();
                if (result.languages !== undefined) {
                    result.languages.push(value);
                } else if (result.topics !== undefined) {
                    result.topics.push(value);
                } else if (result.lessons !== undefined) {
                    result.lessons.push(value);
                }
            }
        }
        return result;
    }
    
    // Original lesson file parsing
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();
        
        if (!trimmed || trimmed.startsWith('#')) continue;
        
        // Top level fields
        if (line.startsWith('number:')) {
            result.number = parseInt(trimmed.split(':')[1].trim());
        } else if (line.startsWith('title:')) {
            result.title = trimmed.substring(6).trim().replace(/^["']|["']$/g, '');
        } else if (line.startsWith('description:')) {
            result.description = trimmed.substring(12).trim().replace(/^["']|["']$/g, '');
        } else if (line.startsWith('sections:')) {
            result.sections = [];
        } else if (line.match(/^\s*- title:/)) {
            currentSection = { title: trimmed.substring(8).trim().replace(/^["']|["']$/g, ''), examples: [] };
            result.sections.push(currentSection);
            inExplanation = false;
        } else if (line.match(/^\s*explanation:/)) {
            inExplanation = true;
            explanationText = '';
            if (trimmed.includes('|')) {
                // Multi-line
            } else {
                currentSection.explanation = trimmed.substring(12).trim().replace(/^["']|["']$/g, '');
                inExplanation = false;
            }
        } else if (inExplanation && line.match(/^\s{6,}/)) {
            explanationText += line.substring(6) + '\n';
        } else if (line.match(/^\s*examples:/)) {
            inExplanation = false;
            if (explanationText) {
                currentSection.explanation = explanationText.trim();
                explanationText = '';
            }
        } else if (line.match(/^\s+- q:/)) {
            currentExample = {
                q: trimmed.substring(4).trim().replace(/^["']|["']$/g, ''),
                rel: []
            };
            currentSection.examples.push(currentExample);
        } else if (line.match(/^\s+a:/)) {
            if (currentExample) {
                currentExample.a = trimmed.substring(3).trim().replace(/^["']|["']$/g, '');
            }
        } else if (line.match(/^\s+labels:/)) {
            const labelsStr = trimmed.substring(7).trim();
            currentExample.labels = JSON.parse(labelsStr);
        } else if (line.match(/^\s+rel:/)) {
            // Start of rel array
        } else if (line.match(/^\s+- \[/)) {
            // Rel item
            const relStr = trimmed.substring(2);
            try {
                currentExample.rel.push(JSON.parse(relStr));
            } catch (e) {
                console.warn('Could not parse rel item:', relStr);
            }
        }
    }
    
    return result;
};
