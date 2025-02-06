import fs from 'fs'
import path from 'path'

const projectRoot = path.resolve(__dirname, '../src')

const removeExistingIndexes = (directory: string) => {
  for (const file of fs.readdirSync(directory)) {
    const fullPath = path.join(directory, file)

    if (fs.statSync(fullPath).isDirectory()) {
      removeExistingIndexes(fullPath)
    } else if (file === 'index.ts') {
      fs.unlinkSync(fullPath)
      console.log(`🗑️  Removed  : ${path.relative(projectRoot, fullPath)}`)
    }
  }
}

const generateIndexFile = (directory: string) => {
  const files = fs.readdirSync(directory)
  const tsFiles = files.filter((file) => file.endsWith('.ts') && file !== 'index.ts')

  if (tsFiles.length === 0) return

  const exports = tsFiles.map((file) => `export * from './${file.replace('.ts', '')}'`).join('\n')

  const indexPath = path.join(directory, 'index.ts')
  fs.writeFileSync(indexPath, exports + '\n', 'utf8')
  console.log(`✅ Generated: ${path.relative(projectRoot, indexPath)}`)
}

removeExistingIndexes(projectRoot)

const walkSync = (dir: string) => {
  generateIndexFile(dir)

  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file)
    if (fs.statSync(fullPath).isDirectory()) {
      walkSync(fullPath)
    }
  }
}

walkSync(projectRoot)
