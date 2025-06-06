import cv2
import numpy as np

def detect_contour(image: np.ndarray) -> np.ndarray:
    img = image.copy()
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    smoothed = cv2.GaussianBlur(gray, (5, 5), 0)
    _, thresh = cv2.threshold(smoothed, 127, 255, cv2.THRESH_BINARY)
    
    edges = cv2.Canny(thresh, 50, 150)
    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    for cnt in contours:
        epsilon = 0.08 * cv2.arcLength(cnt, True)
        approx = cv2.approxPolyDP(cnt, epsilon, True)
        if len(approx) >= 4:
            for point in approx:
                x, y = point[0]
                cv2.circle(img, (x, y), 3, (0, 0, 255), -1) 
    return img
