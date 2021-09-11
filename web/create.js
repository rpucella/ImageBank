const imagebank = require('../core/imagebank')
const path = require('path')

let _VERSION = 3

async function run (folder) {
  if (!folder.startsWith('/')) {
    folder = path.join(process.cwd(), folder)
  }
  await imagebank.create_db(folder, _VERSION)
}

if (process.argv.length > 2) {
  run(process.argv[2])
} else {
  console.log(`USAGE: imagebank-init <db-file>`);
}
