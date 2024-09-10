#!/bin/bash

# Directory containing the files to run
DIR="./examples"

# Find and run all .js files in the directory
for file in "$DIR"/*.ts; do
  if [ -f "$file" ]; then
    echo "Running $file"
    bun "$file"
  fi
done

# Optional: Find and run all .ts files in the directory
for file in "$DIR"/*.ts; do
  if [ -f "$file" ]; then
    echo "Running $file"
    bun "$file"
  fi
done