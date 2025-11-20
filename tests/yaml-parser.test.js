import { describe, it, expect } from 'vitest'
import { simpleYamlParse } from '../src/simple-yaml.js'

describe('Simple YAML Parser', () => {
  it('should parse a simple index file with languages', () => {
    const yaml = `languages:
  - english
  - german
  - spanish`
    
    const result = simpleYamlParse(yaml)
    expect(result.languages).toEqual(['english', 'german', 'spanish'])
  })

  it('should parse a simple index file with topics', () => {
    const yaml = `topics:
  - grammar
  - vocabulary
  - phrases`
    
    const result = simpleYamlParse(yaml)
    expect(result.topics).toEqual(['grammar', 'vocabulary', 'phrases'])
  })

  it('should parse lesson number and title', () => {
    const yaml = `number: 1
title: "First Lesson"
sections:`
    
    const result = simpleYamlParse(yaml)
    expect(result.number).toBe(1)
    expect(result.title).toBe('First Lesson')
  })
})
