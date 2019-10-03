#!/bin/bash
# since the guys over at https://github.com/microsoft/TypeScript/issues/18442
# are not done arguing yet and/or are waiting for NodeJS to get their ESM
# loader out of the experimental state (heat death will happen sooner),
# this is my temporary solution to get some basic support between TS and Node's ESM.

# get an empty array when there is no glob match
shopt -s nullglob

# recursively list all JS files under dist/
files=()
while IFS= read -r -d $'\0'; do
	files+=("$REPLY")
done < <(find dist -iname "*.js" -print0)

# process their import lists & rename to MJS
for file in "${files[@]}"
do
	dir=$(dirname "$file")
	base=$(basename "$file")
	sed 's/\(import.*\/[^/'\'']*\)'\''/\1.mjs'\''/' "$file" > "$dir/${base%.*}.mjs"
	unlink "$file"
done
