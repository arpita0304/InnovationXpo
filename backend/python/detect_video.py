import face_recognition
import cv2
import pickle
import sys
import os
from datetime import datetime

ENCODINGS_FILE = "backend/encodings.pkl"

video_path = sys.argv[1]
camera_id = sys.argv[2]
location = sys.argv[3]

if not os.path.exists(ENCODINGS_FILE):
    print("NO_ENCODINGS")
    sys.exit()

with open(ENCODINGS_FILE, "rb") as f:
    known_people = pickle.load(f)

video = cv2.VideoCapture(video_path)

if not video.isOpened():
    print("VIDEO_ERROR")
    sys.exit()

frame_count = 0

while True:
    ret, frame = video.read()
    if not ret:
        break

    frame_count += 1
    if frame_count % 5 != 0:
        continue

    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    face_locations = face_recognition.face_locations(rgb)
    face_encodings = face_recognition.face_encodings(rgb, face_locations)

    for (top, right, bottom, left), face_encoding in zip(face_locations, face_encodings):

        for person in known_people:

            matches = face_recognition.compare_faces(
                [person["embedding"]],
                face_encoding,
                tolerance=0.48
            )

            if matches[0]:

                # 🔥 Draw Green Box
                cv2.rectangle(frame, (left, top), (right, bottom), (0,255,0), 3)
                cv2.putText(frame, person["name"], (left, top-10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0,255,0), 2)

                # 🔥 Save Screenshot
                os.makedirs("uploads", exist_ok=True)

                now = datetime.now()
                timestamp = now.strftime("%Y%m%d_%H%M%S")
                readable_time = now.strftime("%H:%M:%S")

                filename = f"uploads/match_{person['person_id']}_{timestamp}.jpg"
                cv2.imwrite(filename, frame)

                # ==========================
                # 🔥 ZONE ALERT CALCULATION
                # ==========================

                hour = now.hour
                zone = "LOW"

                # Night time high alert
                if hour >= 20 or hour <= 5:
                    zone = "HIGH"

                # Location based alert
                elif "Highway" in location or "Railway" in location:
                    zone = "HIGH"

                elif "Mall" in location or "College" in location:
                    zone = "MEDIUM"

                # ==========================

                print(f"MATCH|{person['name']}|{camera_id}|{location}|{filename}|{video_path}|{readable_time}|{zone}")
                sys.stdout.flush()

                video.release()
                sys.exit()

video.release()
print("NO_MATCH")