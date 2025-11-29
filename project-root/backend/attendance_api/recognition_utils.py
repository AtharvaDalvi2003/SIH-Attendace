
import os
import json
import numpy as np


try:
    import face_recognition
    FACE_AVAILABLE = True
except Exception:
    FACE_AVAILABLE = False




def compute_embedding_from_image_file(path):
    """Return embedding list or None"""
    if not os.path.exists(path):
        return None
    if not FACE_AVAILABLE:
# dummy deterministic embedding based on filename hash
        h = abs(hash(path)) % (10**8)
        arr = [(h % (i + 23)) / 100.0 for i in range(128)]
        return arr
    image = face_recognition.load_image_file(path)
    faces = face_recognition.face_encodings(image)
    if not faces:
        return None
        return faces[0].tolist()




def find_best_match(embedding, students_qs, threshold=0.55):
    """
    embedding: list or np.array
    students_qs: queryset of Student objects with embedding saved as JSON
    returns student instance or None
    """
    if embedding is None:
        return None
    emb = np.array(embedding, dtype=float)
    best = None
    best_dist = float('inf')
    for s in students_qs:
        if not s.embedding:
            continue
        try:
            stored = np.array(json.loads(s.embedding), dtype=float)
        except Exception:
            continue
        # cosine distance
        if np.linalg.norm(stored) == 0 or np.linalg.norm(emb) == 0:
            dist = 1.0
        else:
            dist = 1 - np.dot(stored, emb) / (np.linalg.norm(stored) * np.linalg.norm(emb))
        if dist < best_dist:
            best_dist = dist
            best = s
    if best is None:
        return None
    if best_dist <= threshold:
        return best
    return None