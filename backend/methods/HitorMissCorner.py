import cv2
import numpy as np

def detect_hitormiss(image: np.ndarray) -> np.ndarray:
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    _, binary = cv2.threshold(blurred, 127, 255, cv2.THRESH_BINARY_INV)  # Inverse!
    binary_01 = binary // 255

    # 4 kernels untuk deteksi sudut
    kernels = [
        np.array([[1, 1, 0],
                  [1, -1, 0],
                  [0, 0, 0]], dtype=np.int8),  # top-left
        np.array([[0, 1, 1],
                  [0, -1, 1],
                  [0, 0, 0]], dtype=np.int8),  # top-right
        np.array([[0, 0, 0],
                  [0, -1, 1],
                  [0, 1, 1]], dtype=np.int8),  # bottom-right
        np.array([[0, 0, 0],
                  [1, -1, 0],
                  [1, 1, 0]], dtype=np.int8),  # bottom-left
    ]

    output = image.copy()
    for kernel in kernels:
        hitmiss = cv2.morphologyEx(binary_01, cv2.MORPH_HITMISS, kernel)
        coords = np.column_stack(np.where(hitmiss == 1))
        for y, x in coords:
            cv2.circle(output, (x, y), 3, (0, 0, 255), -1)  # Red dot

    return output