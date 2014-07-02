#!/bin/bash
rm -rf out || exit 0;
mkdir out;
echo "starting deploy..."
( cd out
 git init
 git config user.name "vinceallenvince"
 git config user.email "vince@vinceallen.com"
 cp -r ../public/* ./
 cp -r ../doc/ ./doc
 cp -r ../reports ./reports
 cp ../release/Burner.min.js ./scripts/Burner.min.js
 cp ../release/Burner.min.css ./css/Burner.min.css
 git add .
 git commit -m "Deployed to Github Pages"
 git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" master:gh-pages > /dev/null 2>&1
)
