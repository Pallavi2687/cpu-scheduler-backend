#!/bin/bash

# Exit if any command fails
set -e

# Navigate to the directory where this script is located
cd "$(dirname "$0")"

# Compile all .cpp files into a single executable
g++ -std=c++17 -o scheduler_exec *.cpp

# Make the output executable (Linux-specific)
chmod +x scheduler_exec

echo "✅ Build successful! Executable created: scheduler_exec"
