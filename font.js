let txt = "עטלף אבק נס דרך מזגן שהתפוצץ כי חם";
const border = 100
const spaceSize = 5
const lineHeight = 12
const kerning = 1


let lines = []

function setup() {
    initP5(false)
    initPaper(true)
    noLoop()

    targetLines = max(round(4 * height / width), 4)
    
    initGui()
    rerun()
}

function rerun() {
    createMolecules()
    createLetters()
    drawText()
}

function keyPressed() {
    if (key == 'Enter') STROKE = !STROKE
    if (key == 'Backspace') {
        txt = txt.slice(0, -1)
    }
    if (key == ' ') txt += key
    const char = getRightKey(key)
    if (char) txt += char
    drawText()
}

function drawText() {
    paper.project.activeLayer.children.forEach(c => {
        if (c.fillColor) c.remove()
    })
    chars = []
    allMolecules = []
    words = txt.split(' ').filter(w => w.length > 0).map(makeWord)
    allText = new Group()
    const wordsPerLine = ceil(words.length / targetLines)
    let x = 0
    let y = 0
    words.forEach((word, i) => {
        word.position = p(x, y)
        allText.addChild(word)
        x = (word.bounds.width + spaceSize) * (params.language == 'ENGLISH' ? 1 : -1)
        if ((i + 1) % wordsPerLine == 0) {
            y += lineHeight
            x = 0
        }
    })
    makeDisplayed(allText)
}


function makeDisplayed(textGroup) {
    let scaler = min((width - border * 2) / allText.bounds.width, (height - border * 2) / allText.bounds.height)
    scaler = min(scaler, 10)
    print(scaler)
    textGroup.scale(scaler, scaler)
    textGroup.fillColor = 'black'
    if (params.rounded) {
        textGroup.strokeColor = 'black'
        textGroup.strokeWidth = .1 * scaler
    }
    if (params.stroke) {
        textGroup.fillColor = 'white'
        textGroup.strokeColor = 'black'
        textGroup.strokeWidth = .1 * scaler
    }
    textGroup.position = p(width / 2, height / 2)
}

let words = []
function makeWord(word) {
    const wordGroup = new Group()
    let x = 0
    for (let i = 0; i < word.length; i++) {
        const letter = word[i]
        const char = makeChar(letter, x)
        wordGroup.addChild(char)
        x += (char.bounds.width + kerning) * (params.language == 'ENGLISH' ? 1 : -1)
    }
    const pivotX = wordGroup.bounds[params.language == 'ENGLISH' ? 'left' : 'right']
    const pivotY = wordGroup.children.reduce((a, b) => {
        if (a.pivot.y < b.pivot.y) return a
        return b
    }, wordGroup.children[0]).pivot.y
    wordGroup.pivot = p(pivotX, pivotY)
    wordGroup.children.forEach(editChar)
    return wordGroup
}

let chars = []
let allMolecules = []
function makeChar(letter, x) {
    const char = letters[letter].clone()
    char.position = p(x - (params.language == 'ENGLISH' ? 0 : char.bounds.width), 0)
    char.children.forEach(m => {
        m.data.id = allMolecules.length
        allMolecules.push(m)
    })
    char.data.id = chars.length
    chars.push(char)
    return char
}

function editChar(char) {
    char.children.forEach(m => {
        let customRotation = rotationFolder.rotation
        if (rotationFolder.randomize > noise(m.data.id)) {
            customRotation *= noise(m.data.id * 5) * 2 - 1
        }
        if (rotationFolder.repeat > 1) {
            for (let i = 1; i < rotationFolder.repeat; i++) {
                const clone = m.clone()
                clone.position = m.position
                clone.rotate(i * customRotation)
                char.addChild(clone)
            }
        } else m.rotate(customRotation)
    })
    char.children.forEach(m => {
        const name = m.data.name
        const scl = scaleFolder[name] * (1 + scaleFolder.randomize * (noise(m.data.id * 10) * 2 - 1))
        m.scale(scl, scl)
    })
}


// ---------------------------------------------
// ----------------- GUI -----------------------
// ---------------------------------------------

const params = {
    rounded: false,
    stroke: false,
    language: 'HEBREW'
}
const scaleFolder = {
    randomize: 0,
    D: 1,
    E: 1,
    J: 1,
    I: 1,
    V: 1,
    K: 1
}
const rotationFolder = {
    randomize: 0,
    rotation: 0,
    repeat: 1
}

function initGui() {
    const gui = new dat.GUI();

    gui.add(params, 'stroke').onChange(drawText)
    gui.add(params, 'rounded').onChange(rerun)
    gui.add(params, 'language', ['HEBREW', 'ENGLISH']).onChange(newLanguage => {
        if (newLanguage == 'HEBREW') 
            txt = "עטלף אבק נס דרך מזגן שהתפוצץ כי חם"
        else txt = 'the quick brown fox jumps over the lazy dog'
        rerun()
    })

    const scaleFolderGui = gui.addFolder('Scale')
    scaleFolderGui.add(scaleFolder, 'randomize', 0, 1, 0.01).onChange(drawText)
    scaleFolderGui.add(scaleFolder, 'D', 0.1, 2, 0.1).onChange(drawText)
    scaleFolderGui.add(scaleFolder, 'E', 0.1, 2, 0.1).onChange(drawText)
    scaleFolderGui.add(scaleFolder, 'J', 0.1, 2, 0.1).onChange(drawText)
    scaleFolderGui.add(scaleFolder, 'I', 0.1, 2, 0.1).onChange(drawText)
    scaleFolderGui.add(scaleFolder, 'V', 0.1, 2, 0.1).onChange(drawText)
    scaleFolderGui.add(scaleFolder, 'K', 0.1, 2, 0.1).onChange(drawText)

    const rotationFolderGui = gui.addFolder('Rotation')
    rotationFolderGui.add(rotationFolder, 'rotation', -180, 180, 1).onChange(drawText)
    rotationFolderGui.add(rotationFolder, 'repeat', 1, 10, 1).onChange(drawText)
    rotationFolderGui.add(rotationFolder, 'randomize', 0, 1, 0.01).onChange(drawText)
}


// ---------------------------------------------
// ----------------- Molecules -----------------
// ---------------------------------------------

let molecules = {}
function createMolecules() {
    const largeRadius = new paper.Size(params.rounded ? 1 : 0);
    const smallRadius = new paper.Size(params.rounded ? .5 : 0);

    const DRect = new paper.Rectangle(p(0, 0), p(2, 2));
    const D = new Path.Rectangle(DRect, largeRadius);
    const ERect = new paper.Rectangle(p(0, 0), p(10, 2));
    const ERect2 = new paper.Rectangle(p(0, 0), p(2, 10));
    const E = new Path.Rectangle(ERect, largeRadius);
    const E2 = new Path.Rectangle(ERect2, largeRadius);
    E2.data = { name: 'E' }
    const JRect = new paper.Rectangle(p(0, 0), p(1, 2));
    const JRect2 = new paper.Rectangle(p(0, 0), p(2, 1));
    const J = new Path.Rectangle(JRect, smallRadius);
    const J2 = new Path.Rectangle(JRect2, smallRadius);
    J2.data = { name: 'J' }

    const IRect = new paper.Rectangle(p(0, 0), p(1, 4));
    const IRect2 = new paper.Rectangle(p(0, 0), p(4, 1));
    const I = new Path.Rectangle(IRect, smallRadius);
    const I2 = new Path.Rectangle(IRect2, smallRadius);
    I2.data = { name: 'I' }

    const V = new Path([p(0, 0), p(1, 0), p(5, 4), p(4, 4)])
    V.closed = true
    const K = new Path([p(0, 0), p(2, -2), p(3, -2), p(1, 0)])
    K.closed = true

    molecules = { D, E, J, I, V, K }
    Object.keys(molecules).forEach(m => {
        molecules[m].data = { name: m }
    })

    molecules.E2 = E2
    molecules.J2 = J2
    molecules.I2 = I2
}


symbolData = {
    '?': [
        ['E', 0, 0],
        ['K', 7, 4],
        ['J', 7, 4],
        ['D', 6.5, 8],
    ],
    '!': [
        ['I', 0, 0],
        ['J', 0, 4],
        ['D', -.5, 8],
    ],
    '.': [
        ['D', 0, 0],
    ],
    ':': [
        ['D', 0, 0],
        ['D', 0, 4],
    ],
    ',': [
        ['K', -1, 6],
    ],
    ';': [
        ['D', 0, 0],
        ['K', -1, 6],
    ],
}

let letters = {}
function createLetters() {
    letters = {}
    const allData = { ...hebrewData, ...symbolData, ...englishData }
    Object.keys(allData).forEach(letter => {
        let letterGroup = new Group();
        for (const [name, x, y, flipped] of allData[letter]) {
            let molecule = molecules[name].clone();
            molecule.translate(x, y);
            if (flipped) molecule.scale(-1, 1);
            // molecule.pivot = params.language == 'ENGLISH' ? molecule.bounds.topLeft : molecule.bounds.topRight
            letterGroup.addChild(molecule);
            letterGroup.pivot = p(0, 0);
        }
        letters[letter] = letterGroup;
    })

    if (params.language == 'HEBREW') {
        letters['ל'].pivot = p(0, 4)
        letters['.'].pivot = p(0, -4)
    }
}