#!/bin/bash
F="public/index.html"
if [ -f $F ]
then
  rm $F
fi
touch $F
(
  echo "<!DOCTYPE html><html><head><title>$1</title>"
  echo "<meta name='viewport' content = 'user-scalable=no, width=device-width, initial-scale=1.0, maximum-scale=1.0' />"
  echo "</head><body>"
  echo "<h1>$1</h1>"
  find ./public \( -name "*.html" -not -name "index.html" \) -type f -exec basename "{}" \; | sed 's/\(.*\)/<p><a href="\1">\1<\/a><\/p>/'
  echo "</body></html>"
) > $F
exit
