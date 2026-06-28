from difflib import SequenceMatcher

def calculate_similarity(name1, name2):
    return SequenceMatcher(
        None,
        name1.lower(),
        name2.lower()
    ).ratio()