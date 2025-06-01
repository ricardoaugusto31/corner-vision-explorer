import cv2
import numpy as np

def detect_harris(image: np.ndarray) -> np.ndarray:
    img = image.copy()
    
    imgRGB = cv2.cvtColor(img,cv2.COLOR_BGR2RGB)
    imgGray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    imgGray = np.float32(imgGray)
    
    blockSize = 5
    sobelSize = 3
    k = 0.04
    harris = cv2.cornerHarris(imgGray, blockSize, sobelSize, k)
    
    imgRGB[harris>0.05*harris.max()] = [0,0,255]
    
    return imgRGB
