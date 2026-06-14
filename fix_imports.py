import os
import glob

def fix_imports(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Fix bad import syntax
    content = content.replace("import , {", "import {")
    content = content.replace("import, {", "import {")
    
    with open(filepath, 'w') as f:
        f.write(content)

for filepath in glob.glob('src/pages/*.tsx'):
    fix_imports(filepath)

if os.path.exists('src/App.tsx'):
    fix_imports('src/App.tsx')

print("Fixed imports!")
