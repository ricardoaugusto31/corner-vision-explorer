import cv2
import numpy as np

def detect_hitormiss(image_path, output_path):
    image = cv2.imread(image_path, 0)
    _, binary = cv2.threshold(image, 127, 255, cv2.THRESH_BINARY)
    binary = binary // 255
    kernel = np.array([[0, 1, 0],
                       [1, -1, 1],
                       [0, 1, 0]], dtype=np.int8)
    hitormiss = cv2.morphologyEx(binary, cv2.MORPH_HITMISS, kernel)
    hitormiss *= 255
    cv2.imwrite(output_path, hitormiss)
    return output_path