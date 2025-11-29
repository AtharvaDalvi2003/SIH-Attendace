# backend/attendance_api/views.py
import os
import base64
import uuid
import logging

from django.conf import settings
from django.core.files.base import ContentFile

from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Student, Attendance, ClassRoom
from .serializers import StudentSerializer, AttendanceSerializer, ClassRoomSerializer
from .recognition_utils import compute_embedding_from_image_file, find_best_match
logger = logging.getLogger(__name__)
TEST_MATCH = True

# -- ViewSets for standard CRUD APIs -------------------------------------------------
class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer


class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all().order_by('-timestamp')
    serializer_class = AttendanceSerializer


class ClassRoomViewSet(viewsets.ModelViewSet):
    queryset = ClassRoom.objects.all()
    serializer_class = ClassRoomSerializer


# -- Recognition endpoint ------------------------------------------------------------
@api_view(['POST'])
def recognize_and_mark(request):
    """
    POST JSON: { "image_base64": "data:image/jpeg;base64,....", "classroom_id": optional }
    Saves snapshot to MEDIA_ROOT/snapshots/, returns JSON:
    { "saved": "<filename>", "matched": {...} or null, "attendance": {...} if created }
    """
    img_b64 = request.data.get('image_base64')
    classroom_id = request.data.get('classroom_id')

    if not img_b64:
        return Response({'detail': 'image_base64 required'}, status=status.HTTP_400_BAD_REQUEST)


    # decode and save raw snapshot file
    try:
        header, data = img_b64.split(',', 1) if ',' in img_b64 else (None, img_b64)
        binary = base64.b64decode(data)
    except Exception as e:
        logger.exception("Invalid base64")
        return Response({'detail': 'invalid base64 image', 'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    snapshots_dir = os.path.join(settings.MEDIA_ROOT, 'snapshots')
    os.makedirs(snapshots_dir, exist_ok=True)

    filename = f"snap_{uuid.uuid4().hex}.jpg"
    filepath = os.path.join(snapshots_dir, filename)
    try:
        with open(filepath, 'wb') as f:
            f.write(binary)
    except Exception as e:
        logger.exception("Failed to write snapshot")
        return Response({'detail': 'failed to save snapshot', 'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # compute embedding from saved file
    embedding = compute_embedding_from_image_file(filepath)

    # find best match among students
    matched_student = None
    try:
        if TEST_MATCH:
            # demo mode: match the first student (if any)
            first = Student.objects.first()
            if first:
                matched_student = first
        else:
            # If you have recognition_utils implemented, call it here:
            # from .recognition_utils import compute_embedding_from_image_file, find_best_match
            # embedding = compute_embedding_from_image_file(filepath)
            # matched_student = find_best_match(embedding, Student.objects.all())
            matched_student = None
    except Exception as e:
        logger.exception("Recognition error")
        # recognition errors should not break saving snapshot

    attendance_data = None
    if matched_student:
        try:
            classroom = None
            if classroom_id:
                try:
                    classroom = ClassRoom.objects.get(id=classroom_id)
                except ClassRoom.DoesNotExist:
                    classroom = None

            at = Attendance(student=matched_student, classroom=classroom, method='face', status='present')
            with open(filepath, 'rb') as f:
                django_file = ContentFile(f.read(), name=filename)
                at.snapshot.save(filename, django_file, save=False)
            at.save()
            attendance_data = AttendanceSerializer(at).data
        except Exception as e:
            logger.exception("Failed to create attendance record")

    # Return saved filename and match info
    resp = {
        'saved': f"snapshots/{filename}",
        'matched': StudentSerializer(matched_student).data if matched_student else None,
        'attendance': attendance_data
    }
    return Response(resp, status=status.HTTP_200_OK)