let txt = "עטלף אבק נס דרך מזגן שהתפוצץ כי חם";
const border = 100
const spaceSize = 5
const lineHeight = 12
const kerning = 1


let lines = []

function setup() {
    // initP5(false)
    const canvas = createCanvas(windowWidth, windowHeight)
    canvas.elt.style.display = 'none'
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
        const name = m.data.name
        m.pivot = m.bounds[params.anchor]

        const scl = scaleFolder[name] + 1
        m.scale(scl, scl)

        if (rotationFolder.repeat > 1) {
            for (let i = 1; i < rotationFolder.repeat; i++) {
                const clone = m.clone()
                clone.position = m.position
                clone.rotate(i * rotationFolder[name] / rotationFolder.repeat)
                char.addChild(clone)
            }
        } else m.rotate(rotationFolder[name])
    })
}


// ---------------------------------------------
// ----------------- GUI -----------------------
// ---------------------------------------------

let params = {}, scaleFolder = {}, rotationFolder = {}
function initGuiData() {
    params.rounded = false
    params.stroke = false
    params.language = 'HEBREW'
    params.anchor = 'topLeft'

    scaleFolder.D = 0
    scaleFolder.E = 0
    scaleFolder.J = 0
    scaleFolder.I = 0
    scaleFolder.V = 0
    scaleFolder.K = 0

    rotationFolder.repeat = 1
    rotationFolder.D = 0
    rotationFolder.E = 0
    rotationFolder.J = 0
    rotationFolder.I = 0
    rotationFolder.V = 0
    rotationFolder.K = 0
}

function initGui() {
    initGuiData()
    const gui = new dat.GUI();

    gui.add(params, 'stroke').onChange(drawText)
    gui.add(params, 'rounded').onChange(rerun)
    gui.add(params, 'language', ['HEBREW', 'ENGLISH']).onChange(newLanguage => {
        if (newLanguage == 'HEBREW')
            txt = "עטלף אבק נס דרך מזגן שהתפוצץ כי חם"
        else txt = 'the quick brown fox jumps over the lazy dog'
        rerun()
    })
    gui.add(params, 'anchor', ['topLeft', 'topRight', 'bottomLeft', 'bottomRight', 'center']).onChange(drawText)

    const scaleFolderGui = gui.addFolder('Scale')
    scaleFolderGui.add(scaleFolder, 'D', -1, 1, 0.1).onChange(drawText)
    scaleFolderGui.add(scaleFolder, 'E', -1, 1, 0.1).onChange(drawText)
    scaleFolderGui.add(scaleFolder, 'I', -1, 1, 0.1).onChange(drawText)
    scaleFolderGui.add(scaleFolder, 'J', -1, 1, 0.1).onChange(drawText)
    scaleFolderGui.add(scaleFolder, 'K', -1, 1, 0.1).onChange(drawText)
    scaleFolderGui.add(scaleFolder, 'V', -1, 1, 0.1).onChange(drawText)

    const rotationFolderGui = gui.addFolder('Rotation')
    rotationFolderGui.add(rotationFolder, 'repeat', 1, 10, 1).onChange(drawText)
    rotationFolderGui.add(rotationFolder, 'D', -180, 180, 1).onChange(drawText)
    rotationFolderGui.add(rotationFolder, 'E', -180, 180, 1).onChange(drawText)
    rotationFolderGui.add(rotationFolder, 'I', -180, 180, 1).onChange(drawText)
    rotationFolderGui.add(rotationFolder, 'J', -180, 180, 1).onChange(drawText)
    rotationFolderGui.add(rotationFolder, 'K', -180, 180, 1).onChange(drawText)
    rotationFolderGui.add(rotationFolder, 'V', -180, 180, 1).onChange(drawText)

    // add reset button
    gui.add({
        reset: () => {
            gui.destroy()
            initGui()
            rerun()
        }
    }, 'reset').name('Reset')
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