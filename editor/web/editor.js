var instruments = [
  {
    name: "Bass Guitar",
    game: "base",
    file: "./bass.ogg"
  },
  {
    name: "Bass Drum",
    game: "basedrum",
    file: "./bd.ogg"
  },
  {
    name: "Bell",
    game: "bell",
    file: "./bell.ogg"
  },
  {
    name: "Flute",
    game: "flute",
    file: "./flute.ogg"
  },
  {
    name: "Guitar",
    game: "guitar",
    file: "./guitar.ogg"
  },
  {
    name: "Hat",
    game: "hat",
    file: "./hat.ogg"
  },
  {
    name: "Snare",
    game: "snare",
    file: "./snare.ogg"
  },
]

var speeds = [0.5, 0.529732, 0.561231, 0.594604, 0.629961, 0.667420, 0.707107, 0.749154, 0.793701, 0.840896, 0.890899, 0.943874, 1, 1.059463, 1.122462, 1.189207, 1.259921, 1.334840, 1.414214, 1.498307, 1.587401, 1.681793, 1.781797, 1.887749, 2]
//var tick = [tick, [1, 0 -> 24]]

var selectedInstrument = 0
var ticksize = 16
var beatsize = 4
var barsize = 4
var scroll = 0
var songlength = 1200

var song = []

var playerhead = 0
var playing = false

function preload() {
  instruments.forEach((instrument, i) => {
    instrument.audio = loadSound(instrument.file)
    instrument.audio.playMode("sustain")
  })
}

function setup() {
  colorMode(HSB, 1)
  cnv = createCanvas(windowWidth, windowHeight);
  cnv.mousePressed(click)
  frameRate(20)
  for (var i = 0; i < songlength; i++) {
    var vertical = []
    for (var x = 0; x < 25; x++) {
      var inst = []
      for (var in = 0; in < instruments.length; in++) {
        inst.push(-1)
      }
      vertical.push(inst)
    }
    song.push(vertical)
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  if (playing) {

    for (var i = 0; i < song[playerhead].length; i++) {
      if (song[playerhead][i] != -1) {
        instruments[song[playerhead][i]].audio.rate(speeds[i])
        instruments[song[playerhead][i]].audio.play()
      }
    }

    playerhead += 1
  }

  if (clickevent == "scroll") {
    setScroll(mouseX)
  }

  background(0, 0, 0);

  var st = []

  textSize(24)
  textAlign(CENTER, CENTER);
  noStroke()
  instruments.forEach((instrument, i) => {
    fill(0, 0, 1)
    if (i == selectedInstrument) {
      fill(i / instruments.length, 0.5, 1)
      rect(0, 0, 128, 64);
      fill(0, 0, 0)
    }
    text(instrument.name, 0, 0, 128, 64)
    st = stacktrans(st, 0, 64)
  })

  st = stackrev(st)

  translate(138, 0)

  areaheight = height / 26
  areawidth = width - 138

  noStroke()
  for (var i = 0; i < 25; i++) {
    if (isdarkkey(i)) {
      fill(0, 0, 1, 0.1)
    }else {
      fill(0, 0, 1, 0.2)
    }
    rect(0, 0, areawidth, areaheight)
    st = stacktrans(st, 0, areaheight)
  }

  var offset = scroll / songlength

  rect((offset * areawidth) - (offset * 64), 0, 64, areaheight)

  st = stackrev(st)

  textAlign(LEFT, TOP)
  fill(0, 0, 1, 0.5)
  var y = areaheight * 25
  for (var i = 0; i < songlength + 1; i++) {
    var x = i * ticksize - scroll * ticksize
    if (x > -1 && x < areawidth) {
      for (var r = 0; r < 25; r++) {
        if (song[i] != undefined) {
          if (song[i][r] != -1) {
            fill(song[i][r]/ instruments.length, 0.5, 1)
            rect(x, areaheight * (24 - r), ticksize, areaheight)
          }
        }
      }
    }
  }
  for (var i = 0; i < songlength + 1; i++) {
    strokeWeight(2)
    var x = i * ticksize - scroll * ticksize
    if (x > 0 && x < areawidth) {
      if (i == playerhead) {
        fill(0, 0, 1, 0.2)
        noStroke()
        rect(x, 0, ticksize, y)
        fill(0, 0, 1, 0.5)
      }
      stroke(0, 0, 1, 0.05)
      if (i % beatsize == 0) {
        stroke(0, 0, 1, 0.1)
      }
      if (i % (beatsize * barsize) == 0) {
        strokeWeight(4)
        stroke(0, 0, 1, 0.2)
      }
      line(x, 0, x, y)
    }
    strokeWeight(2)
  }
  stroke(0, 0, 1, 0.1)
  fill(0, 0, 1, 0.2)
  for (var i = 0; i < songlength + 1; i++) {
    var x = i * ticksize - scroll * ticksize
    if (x > 0 && x < areawidth && i % (beatsize * barsize) == 0) {
      text(i / beatsize / barsize, x + 10, 10)
    }
  }
}

var clickevent = "none"

function click() {
  if (mouseX < 129) {
    if (mouseX > 0 &&
        mouseY > 0 &&
        mouseY < instruments.length * 64) {
      selectInstrument(floor(mouseY/64))
    }
  }else {
    if (mouseX < width) {
      var row = floor(mouseY/areaheight)
      if (row == 25) {
        clickevent = "scroll"
      }else {
        row = Math.abs(row - 24)
        var col = floor((scroll * ticksize + mouseX - 138) / ticksize)
        if (col >= 0) {
          addnote(col, row, selectedInstrument)
        }
      }
    }
  }
}

function addnote(tick, pitch, iid) {
  if (song[tick][pitch] != -1) {
    song[tick][pitch] = -1
  }else {
    song[tick][pitch] = iid
  }
}

function exportsong() {
  console.log(JSON.stringify(cleanSong(song)))
}

function cleanSong() {
  var cleansong = []
  song.forEach((tick, i) => {
    var cleantick = groupTicks(tick)
    if (cleantick.length != 0) {
      cleansong.push([i, cleantick])
    }
  })
  return cleansong
}

function groupTicks(tick) {
  var cleantick = []
  tick.forEach((iid, pitch) => {
    if (iid != -1) {
      cleantick.push([iid, pitch])
    }
  })
  return cleantick
}

function mouseReleased() {
  if (clickevent == "scroll") {
    clickevent = "none"
    setScroll(mouseX)
  }
}

function keyPressed() {
  if (keyCode == 32) {
    playing = !playing
    playerhead = 0
  }
}

function setScroll(s) {
  scroll = map(s, 139, width, 0, songlength, true)
}

function selectInstrument(id) {
  selectedInstrument = id
  instruments[id].audio.play()
}

function isdarkkey(i) {
  return [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24].indexOf(i) != -1
}
