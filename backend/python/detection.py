import cv2
import face_recognition
import os
from datetime import datetime

MISSING_DIR = "uploads/missing"
DETECTION_DIR = "uploads/detections"

def load_missing_faces():
    encodings = []
    names = []

    for file in os.listdir(MISSING_DIR):
        img = face_recognition.load_image_file(f"{MISSING_DIR}/{file}")
        enc = face_recognition.face_encodings(img)[0]
        encodings.append(enc)
        names.append(file.split(".")[0])

    return encodings, names

def detect_from_camera(camera_url, camera_name):
    known_encodings, known_names = load_missing_faces()
    cap = cv2.VideoCapture(camera_url)

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        boxes = face_recognition.face_locations(rgb)
        encodings = face_recognition.face_encodings(rgb, boxes)

        for enc, box in zip(encodings, boxes):
            matches = face_recognition.compare_faces(known_encodings, enc, tolerance=0.45)
            if True in matches:
                i = matches.index(True)
                name = known_names[i]

                top, right, bottom, left = box
                cv2.rectangle(frame, (left, top), (right, bottom), (0,255,0), 2)
                cv2.putText(frame, name, (left, top-10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0,255,0), 2)

                ts = datetime.now().strftime("%Y%m%d_%H%M%S")
                filename = f"{DETECTION_DIR}/{name}_{camera_name}_{ts}.jpg"
                cv2.imwrite(filename, frame)

                return {
                    "name": name,
                    "camera": camera_name,
                    "time": ts,
                    "image": filename
                }

    cap.release()