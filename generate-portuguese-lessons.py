#!/usr/bin/env python3
"""
Generate Portuguese verb lessons for German learners.
Creates YAML files following the verb-first template.
"""

import yaml
from pathlib import Path

# Lesson data structure: lesson_number -> {title, description, verbs}
LESSONS = {
    5: {
        "title": "Wünsche und Vorlieben - Wollen, Bleiben, Mögen",
        "description": "Die Verben querer, ficar und gostar mit allen Konjugationen",
        "verbs": {
            "Querer": {
                "meaning": "wollen/möchten",
                "usage": ["Wünsche ausdrücken", "Etwas wollen", "Oft mit Infinitiv"],
                "conjugation": ["quero", "queres", "quer", "queremos", "quereis", "querem"],
                "gerund": "querendo",
                "examples": [
                    ("Eu quero café.", "Ich will Kaffee.", ["café", "Kaffee", "Getränk"]),
                    ("Tu queres ir?", "Willst du gehen?", ["ir", "gehen", "Verb"]),
                    ("Ele quer aprender.", "Er will lernen.", ["aprender", "lernen", "Verb"]),
                    ("Nós queremos ajudar.", "Wir wollen helfen.", ["ajudar", "helfen", "Verb"]),
                    ("Vós quereis comer?", "Wollt ihr essen?", ["comer", "essen", "Verb"]),
                    ("Eles querem paz.", "Sie wollen Frieden.", ["paz", "Frieden", "Substantiv"]),
                ]
            },
            "Ficar": {
                "meaning": "bleiben/werden",
                "usage": ["An einem Ort bleiben", "Werden (Zustand)", "Sich befinden"],
                "conjugation": ["fico", "ficas", "fica", "ficamos", "ficais", "ficam"],
                "gerund": "ficando",
                "examples": [
                    ("Eu fico em casa.", "Ich bleibe zu Hause.", ["em casa", "zu Hause", "Ort"]),
                    ("Tu ficas contente.", "Du wirst froh.", ["contente", "froh", "Adjektiv"]),
                    ("Ela fica aqui.", "Sie bleibt hier.", ["aqui", "hier", "Ort"]),
                    ("Nós ficamos cansados.", "Wir werden müde.", ["cansados", "müde", "Adjektiv"]),
                    ("Vós ficais bem.", "Ihr steht gut.", ["bem", "gut", "Adverb"]),
                    ("Eles ficam nervosos.", "Sie werden nervös.", ["nervosos", "nervös", "Adjektiv"]),
                ]
            },
            "Gostar": {
                "meaning": "mögen/gern haben",
                "usage": ["Vorlieben ausdrücken", "Immer mit 'de'", "Geschmack, Präferenz"],
                "conjugation": ["gosto", "gostas", "gosta", "gostamos", "gostais", "gostam"],
                "gerund": "gostando",
                "examples": [
                    ("Eu gosto de música.", "Ich mag Musik.", ["música", "Musik", "Substantiv"]),
                    ("Tu gostas de ler?", "Magst du lesen?", ["ler", "lesen", "Verb"]),
                    ("Ela gosta de viajar.", "Sie reist gern.", ["viajar", "reisen", "Verb"]),
                    ("Nós gostamos de ti.", "Wir mögen dich.", ["ti", "dich", "Pronomen"]),
                    ("Vós gostais de chocolate.", "Ihr mögt Schokolade.", ["chocolate", "Schokolade", "Essen"]),
                    ("Eles gostam de futebol.", "Sie mögen Fußball.", ["futebol", "Fußball", "Sport"]),
                ]
            },
        }
    },
    # Add more lessons here following the same pattern...
}

def create_lesson_yaml(lesson_num, lesson_data, output_dir):
    """Create a YAML lesson file."""

    lesson = {
        "number": lesson_num,
        "title": lesson_data["title"],
        "description": lesson_data["description"],
        "sections": []
    }

    pronouns = ["eu", "tu", "ele/ela/você", "nós", "vós", "eles/elas"]
    persons = ["1. Person Singular", "2. Person Singular", "3. Person Singular",
               "1. Person Plural", "2. Person Plural", "3. Person Plural"]

    for verb_name, verb_data in lesson_data["verbs"].items():
        section = {
            "title": verb_name,
            "explanation": f"""**{verb_name}** bedeutet **{verb_data['meaning']}** und wird verwendet für:
""" + "\n".join(f"      - {usage}" for usage in verb_data['usage']) + f"""

      **Konjugation Präsens**:
""" + "\n".join(f"      - {pronouns[i]} {verb_data['conjugation'][i]} ({persons[i].lower().replace('. ', ' ')})"
               for i in range(6)) + f"""
      - **Gerúndio**: {verb_data['gerund']} ({verb_data['meaning']}d)
""",
            "examples": []
        }

        # Add conjugation examples
        for i, (q, a, vocab) in enumerate(verb_data["examples"]):
            example = {
                "q": q,
                "a": a,
                "labels": ["Präsens", persons[i]],
                "rel": [
                    [verb_data['conjugation'][i], q.split()[1] if len(q.split()) > 1 else verb_data['conjugation'][i],
                     f"{verb_name.lower()} - {pronouns[i]}"],
                    vocab
                ]
            }
            section["examples"].append(example)

        # Add gerund example
        gerund_q = f"{verb_data['gerund'].capitalize()} assim, consigo."
        gerund_a = f"Indem ich so {verb_data['meaning']}, schaffe ich es."
        section["examples"].append({
            "q": gerund_q,
            "a": gerund_a,
            "labels": ["Gerúndio"],
            "rel": [[verb_data['gerund'], f"{verb_data['meaning']}d", f"{verb_name} - Gerundium"]]
        })

        lesson["sections"].append(section)

    # Write YAML file
    filename = f"{lesson_num:02d}-{lesson_data['title'].split()[0].lower()}.yaml"
    filepath = Path(output_dir) / filename

    with open(filepath, 'w', encoding='utf-8') as f:
        yaml.dump(lesson, f, allow_unicode=True, default_flow_style=False, sort_keys=False)

    print(f"✅ Created: {filepath}")

def main():
    output_dir = Path("public/lessons/deutsch/portugiesisch")
    output_dir.mkdir(parents=True, exist_ok=True)

    for lesson_num, lesson_data in LESSONS.items():
        create_lesson_yaml(lesson_num, lesson_data, output_dir)

    print(f"\n🎉 Generated {len(LESSONS)} lessons!")

if __name__ == "__main__":
    main()
