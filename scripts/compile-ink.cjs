#!/usr/bin/env node
// Compiles .ink source files to .ink.json using inkjs's built-in compiler
const { Compiler } = require('../node_modules/inkjs/compiler/Compiler');
const { CompilerOptions } = require('../node_modules/inkjs/compiler/CompilerOptions');
const { PosixFileHandler } = require('../node_modules/inkjs/compiler/FileHandler/PosixFileHandler');
const fs = require('fs');
const path = require('path');

const INK_SRC = path.resolve(__dirname, '../assets/ink');
const INK_OUT = path.resolve(__dirname, '../public/assets/ink');

if (!fs.existsSync(INK_OUT)) fs.mkdirSync(INK_OUT, { recursive: true });

const inkFiles = fs.readdirSync(INK_SRC).filter(f => f.endsWith('.ink'));

let ok = 0, fail = 0;

for (const file of inkFiles) {
  const src = path.join(INK_SRC, file);
  const outFile = file.replace('.ink', '.ink.json');
  const out = path.join(INK_OUT, outFile);

  const source = fs.readFileSync(src, 'utf-8');

  try {
    const opts = new CompilerOptions(
      src,
      [],
      false,
      (msg, type) => console.error(`  [${type}] ${msg}`),
      new PosixFileHandler(INK_SRC)
    );
    const compiler = new Compiler(source, opts);
    const story = compiler.Compile();

    if (!story) {
      console.error(`✗ ${file} — compilation failed`);
      fail++;
      continue;
    }

    const json = story.ToJson();
    fs.writeFileSync(out, json, 'utf-8');
    console.log(`✓ ${file} → public/assets/ink/${outFile}`);
    ok++;
  } catch (e) {
    console.error(`✗ ${file} — ${e.message}`);
    fail++;
  }
}

console.log(`\nCompiled: ${ok} ok, ${fail} failed`);
if (fail > 0) process.exit(1);
