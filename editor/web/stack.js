function stacktrans(st, x, y) {
  st.push(["t", x, y])
  translate(x, y)
  return st
}

function stackrev(st) {
  st.forEach((item, i) => {
    if (item[0] == "t") {
      translate(-item[1], -item[2])
    }
  })
  return []
}
