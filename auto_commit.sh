#!/bin/bash

cd /home/krei/Documents/Projects/personal-projects

# Generate some random content
echo "$(date): update" >> log.txt

# Git commit and push
git add .
git commit -m "Update: $(date '+%Y-%m-%d %H:%M:%S')"
git push

