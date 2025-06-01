import cv2
import numpy as np

def detect_shitomasi(image: np.ndarray) -> np.ndarray:
    img = image.copy()
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    corners = cv2.goodFeaturesToTrack(gray, 100, 0.06, 10, blockSize=5, k=0.06)

    if corners is not None:
        corners = np.int0(corners)
        for i in corners:
            x, y = i.ravel()
            cv2.circle(img, (x, y), 3, (0, 0, 255), -1)  # Merah
    return img
