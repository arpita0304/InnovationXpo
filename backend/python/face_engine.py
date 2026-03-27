import face_recognition
import pickle
import os

ENCODINGS_FILE = "backend/encodings.pkl"

def encode_face(image_path, person_id, name):
    image = face_recognition.load_image_file(image_path)
    encodings = face_recognition.face_encodings(image)

    if len(encodings) == 0:
        return False

    face_embedding = encodings[0]

    data = {
        "person_id": person_id,
        "name": name,
        "embedding": face_embedding
    }

    if os.path.exists(ENCODINGS_FILE):
        with open(ENCODINGS_FILE, "rb") as f:
            all_data = pickle.load(f)
    else:
        all_data = []

    all_data.append(data)

    with open(ENCODINGS_FILE, "wb") as f:
        pickle.dump(all_data, f)

    return True