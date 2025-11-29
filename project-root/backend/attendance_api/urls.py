# backend/attendance_api/urls.py
from django.urls import path
from .views import StudentViewSet, AttendanceViewSet, ClassRoomViewSet, recognize_and_mark

router = routers.DefaultRouter()
router.register(r'students', StudentViewSet)
router.register(r'attendance', AttendanceViewSet)
router.register(r'classrooms', ClassRoomViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('recognize/', recognize_and_mark, name='recognize'),
]
