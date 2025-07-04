#!/bin/bash

# Navigate to the cpp_engine folder (where this script should live)
cd "$(dirname "$0")"

# Compile all .cpp files into a single executable called scheduler_exec
g++ -std=c++17 -o scheduler_exec *.cpp

# Make the output executable
chmod +x scheduler_exec

echo "✅ Build successful! Executable created: scheduler_exec"
