import re

with open('src/services/travelService.ts', 'r') as f:
    content = f.read()

# Remove next/server import
content = re.sub(r"import \{ NextResponse \} from 'next/server';\n*", "", content)

# Replace POST signature
content = re.sub(
    r"export async function POST\(request: Request\) \{.*?(?=if \(destination\.toLowerCase\(\) ===)",
    "export async function fetchAccommodations(destination: string): Promise<any> {\n    ",
    content,
    flags=re.DOTALL
)

# Replace NextResponse.json
content = content.replace("return NextResponse.json({", "return ({")

with open('src/services/travelService.ts', 'w') as f:
    f.write(content)
