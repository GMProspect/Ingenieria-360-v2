import codecs

source = r"c:/Users/usgam/Desktop/Proyectos/ING-360/ingenieria-360-v2/temp_vibration.jsx"

try:
    # Try reading as utf-16
    with codecs.open(source, 'r', 'utf-16') as f:
        content = f.read()
        print(content)
except Exception as e:
    print(f"Error reading utf-16: {e}")
    try:
        # Try utf-16-le
        with codecs.open(source, 'r', 'utf-16-le') as f:
            content = f.read()
            print(content)
    except Exception as e2:
        print(f"Error reading utf-16-le: {e2}")
