from PIL import Image
import os

source_path = r"C:/Users/usgam/.gemini/antigravity/brain/be38152a-9ce7-4568-b5a8-2d6f0d148b13/uploaded_image_1_1764380170098.png"
target_path = r"C:/Users/usgam/Desktop/Proyectos/ING-360/ingenieria-360-v2/public/google_logo_120x120.png"

def remove_black_background(img, threshold=30):
    img = img.convert("RGBA")
    datas = img.getdata()
    new_data = []
    for item in datas:
        # Check if pixel is black (or near black)
        if item[0] < threshold and item[1] < threshold and item[2] < threshold:
            new_data.append((255, 255, 255, 0)) # Transparent
        else:
            new_data.append(item)
    img.putdata(new_data)
    return img

try:
    if not os.path.exists(source_path):
        print(f"Error: Source file not found at {source_path}")
        exit(1)

    img = Image.open(source_path)
    
    # Remove background FIRST
    img = remove_black_background(img)

    # Resize maintaining aspect ratio
    img.thumbnail((120, 120), Image.Resampling.LANCZOS)

    # Create new 120x120 transparent image
    new_img = Image.new("RGBA", (120, 120), (0, 0, 0, 0))

    # Calculate position to center
    x = (120 - img.width) // 2
    y = (120 - img.height) // 2

    new_img.paste(img, (x, y), img) # Use img as mask for transparency
    
    # Ensure directory exists
    os.makedirs(os.path.dirname(target_path), exist_ok=True)
    
    new_img.save(target_path)
    print(f"Success: Saved to {target_path}")

except Exception as e:
    print(f"Error: {e}")
