import cv2
import sys
import os

def scan_video_for_faces(video_path):
    # Load OpenCV's built-in face detector
    face_cascade_path = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
    face_cascade = cv2.CascadeClassifier(face_cascade_path)

    if not os.path.exists(video_path):
        print("ERROR: Video file not found at " + video_path)
        sys.exit(1)

    cap = cv2.VideoCapture(video_path)

    if not cap.isOpened():
        print("ERROR: Cannot open video file")
        sys.exit(1)

    frame_count = 0
    max_frames = 100  # Scan only first 100 frames for speed

    while frame_count < max_frames:
        ret, frame = cap.read()
        if not ret:
            break  # End of video

        # Convert to grayscale for face detection
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # Detect faces
        faces = face_cascade.detectMultiScale(
            gray,
            scaleFactor=1.1,
            minNeighbors=5,
            minSize=(30, 30)
        )

        if len(faces) > 0:
            print("FACE_DETECTED")
            cap.release()
            sys.exit(0)  # Exit immediately on first detection

        frame_count += 1

    cap.release()
    print("NO_FACE_DETECTED")

if __name__ == "__main__":
    # Pass video path as argument, or use a default test video
    video_path = sys.argv[1] if len(sys.argv) > 1 else "ai/test_video.mp4"
    scan_video_for_faces(video_path)