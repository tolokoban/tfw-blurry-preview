"use strict"

const FS = require("fs")
const Path = require("path")

const EXTENSIONS = ['.css', '.png', '.jpg', '.jpeg', '.gif', '.yaml', '.json', '.woff2', '.ttf']

if (process.argv.length < 4) {
    console.error(`
Usage:
  node copy-assets.js SRC DST

`)
    process.exit(1)
}


const srcRoot = Path.resolve(process.argv[2])
const dstRoot = Path.resolve(process.argv[3])
let size = 0

function copy(src, dst) {
    if (!FS.existsSync(dst)) {
        FS.mkdirSync(dst)
    }
    const files = FS.readdirSync(src)
    for (const file of files) {
        const path = Path.resolve(src, file)
        const stats = FS.statSync(path)
        if (stats.isDirectory()) {
            copy(
                Path.resolve(src, file),
                Path.resolve(dst, file)
            )
        } else {
            if (file === 'package.json') continue
            if (file === 'package-lock.json') continue
            for (const ext of EXTENSIONS) {
                if (file.endsWith(ext)) {
                    size += stats.size
                    console.log(pad(`${Math.ceil(stats.size / 1024)}`, 5), "kb - ", file)
                    FS.copyFileSync(path, Path.resolve(dst, file))
                    break
                }
            }
        }
    }
}

copy(srcRoot, dstRoot)
console.log('Total size:', size >> 10, "Kb")
updatePackage()


function readJson(filename) {
    try {
        const path = Path.resolve(
            Path.dirname(__filename),
            "../..",
            filename
        )
        try {
            const content = FS.readFileSync(path).toString()
            try {
                return JSON.parse(content)
            } catch (err) {
                console.error(`Unable to parse JSON file "${path}"!`)
                console.error(err)
                return
            }
        } catch (err) {
            console.error(`Unable to load file "${path}"!`)
            console.error(err)
        }
    } catch (err) {
        console.error(`Unable to read JSON file "${filename}"!`)
        console.error(err)
    }
}

function writeJson(filename, data) {
    try {
        const path = Path.resolve(
            Path.dirname(__filename),
            "../..",
            filename
        )
        const content = JSON.stringify(data, null, "    ")
        FS.writeFileSync(path, content)
    } catch (err) {
        console.error(`Unable to write file "${path}"!`)
        console.error(err)
    }
}

function updatePackage() {
    // Copy package.json and change attributes "main" and "types" to be local.
    const config = readJson("./package.json")
    config.main = "index.js"
    config.types = "index.d.ts"
    delete config.files
    delete config.scripts
    delete config.browserslist
    writeJson("./lib/dist/package.json", config)
}

function pad(text, size) {
    const len = size - text.length
    if (len > 0) {
        return `${Array(len).join(" ")}${text}`
    }
    return text
}