import sys
from face_engine import encode_face

image_path = sys.argv[1]
person_id = sys.argv[2]
name = sys.argv[3]

success = encode_face(image_path, person_id, name)

if success:
    print("SUCCESS")
else:
    print("NO_FACE")