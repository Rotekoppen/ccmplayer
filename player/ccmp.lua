function stringstarts(String,Start)
   return string.sub(String,1,string.len(Start))==Start
end

function getInstrument(id)
  if id == 0 then
    return "bass"
  end
  if id == 1 then
    return "basedrum"
  end
  if id == 2 then
    return "bell"
  end
  if id == 3 then
    return "flute"
  end
  if id == 4 then
    return "guitar"
  end
  if id == 5 then
    return "hat"
  end
  if id == 6 then
    return "snare"
  end
end

function note(n)
  for i=1,table.getn(speakers) do
    peripheral.call(speakers[i], "playNote", getInstrument(n[1]), 1, n[2])
  end
end
--- Get Sound Data
file = io.open("/music/Megalovania.json")
content = textutils.unserializeJSON(file.read(file))

--- Get Speakers
--speakers = peripheral.find("speaker")
--print(table.getn(speakers))
p = peripheral.getNames()
speakers = {}
for i=1,table.getn(p) do
  if peripheral.getType(p[i]) == "speaker" then
    table.insert(speakers, p[i])
  end
end

--- Playloop
where = 1
for i=1,1200 do
  if content[where][1] == i - 1 then
    for n=1,table.getn(content[where][2]) do
      note(content[where][2][n])
    end
    where = where + 1
  end
  sleep(0.15)
end
