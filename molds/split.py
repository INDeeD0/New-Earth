import json
import os

# Input file (your big JSON)
input_file = 'molds.json'
# Output folder where smaller files will go
output_dir = 'categories'

# Optional: rename short labels into friendly names
# label_map = {
#    "a": "Oranges",
#    "b": "Apples",
#    "c": "Bananas"
#}

# Make sure output folder exists
os.makedirs(output_dir, exist_ok=True)

# Load the big JSON (it must start with { ... } in your case)
with open(input_file, 'r') as f:
    data = json.load(f)

# Each top-level key becomes its own file
for key, items in data.items():
    if not items:  # skip empty lists
        continue

    # Use the original key as the filename
    label = key

    # Create safe filename
    safe_filename = f"{label}.json".replace(" ", "_")
    filepath = os.path.join(output_dir, safe_filename)

    # Write out the JSON
    with open(filepath, 'w') as f:
        json.dump(items, f, indent=2)


print(f"✅ Done. Split into {len(data)} category files.")
