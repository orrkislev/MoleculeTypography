const hebrewKeys = [
    'ש', 'ז', 'ג', 'צ', 'ק', 'י', 'פ', 'ר', 'א', 'ו', 'ה', 'נ', 'ת', 'כ', 'ל', 'ע', 'ס', 'ד', 'ך', 'ב', 'מ', 'ם', 'ן', 'ף', 'ץ'
]
const englishKeys = [
    'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm'
]
const eng2Heb = {
    'e': 'ק',
    'r': 'ר',
    't': 'א',
    'y': 'ט',
    'u': 'ו',
    'i': 'ן',
    'o': 'ם',
    'p': 'פ',
    'a': 'ש',
    's': 'ד',
    'd': 'ג',
    'f': 'כ',
    'g': 'ע',
    'h': 'י',
    'j': 'ח',
    'k': 'ל',
    'l': 'ך',
    ':': 'ף',
    'z': 'ז',
    'x': 'ס',
    'c': 'ב',
    'v': 'ה',
    'b': 'נ',
    'n': 'מ',
    'm': 'צ',
    '<': 'ת',
    '>': 'ץ',
}

const heb2Eng = {
    'ש': 'a',
    'ז': 'b',
    'ג': 'c',
    'צ': 'd',
    'ק': 'e',
    'י': 'f',
    'פ': 'g',
    'ר': 'h',
    'א': 'i',
    'ו': 'j',
    'ה': 'k',
    'נ': 'l',
    'ת': 'm',
    'כ': 'n',
    'ל': 'o',
    'ע': 'p',
    'ס': 'q',
    'ד': 'r',
    'ך': 's',
    'ב': 't',
    'מ': 'u',
    'ם': 'v',
    'ן': 'w',
    'ף': 'x',
    'ץ': 'y',
    '/':'q',
    'ף':';',
    '׳':'w',
}

const symbols = [
    '?','!',',','.',':',';'
]

function getRightKey(key) {
    if (params.language == 'HEBREW') {
        if (hebrewKeys.includes(key)) return key
        const keyLower = key.toLowerCase()
        if (keyLower in eng2Heb) return eng2Heb[keyLower]
    } else {
        if (englishKeys.includes(key)) return key
        if (key in heb2Eng) return heb2Eng[key]
    }
    if (symbols.includes(key)) return key
    return null
}