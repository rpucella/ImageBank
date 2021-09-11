
function pad2(n) {
  return n.toString().padStart(2, '0')
}

function formatDate(dstr) {
  if (dstr) {
    const d = new Date(dstr)
    const dt = `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
    const tm = `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`
    return dt + ' @ ' + tm
  }
  else {
    return '-'
  }
}

export {formatDate}
