#!/bin/bash

# Set environment path (cron-safe)
export PATH="/usr/bin:/bin:/usr/local/bin:$PATH"

cd /home/krei/Documents/Projects/personal-projects

# Generate some random content
echo "$(date): update" >> log.txt

/usr/bin/git add .
/usr/bin/git commit -m "Update: $(date '+%Y-%m-%d %H:%M:%S')"
/usr/bin/git push origin activity-drawing
