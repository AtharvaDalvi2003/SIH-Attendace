import uuid
from django.db import models
from django.utils import timezone
from django.conf import settings
from django.db import models
from django.utils import timezone


class Student(models.Model):
    roll = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=200)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    photo = models.ImageField(upload_to='students/', blank=True, null=True)
    # Store embedding as JSON/text. Later populate this with computed embeddings.
    embedding = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.roll} - {self.name}"


class ClassRoom(models.Model):
    name = models.CharField(max_length=200)
    subject = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return f"{self.name} - {self.subject}"


class Attendance(models.Model):
    STATUS_CHOICES = (
        ('present', 'Present'),
        ('absent', 'Absent'),
        ('late', 'Late'),
    )

class AttendanceToken(models.Model):
    token = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    classroom = models.ForeignKey('ClassRoom', null=True, blank=True, on_delete=models.SET_NULL)
    created_by = models.CharField(max_length=200, blank=True)  # teacher name or id (demo)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    active = models.BooleanField(default=True)

    def is_valid(self):
        if not self.active:
            return False
        if self.expires_at and timezone.now() > self.expires_at:
            return False
        return True

    def __str__(self):
        return str(self.token)

    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    classroom = models.ForeignKey(ClassRoom, on_delete=models.CASCADE, null=True)
    timestamp = models.DateTimeField(default=timezone.now)
    method = models.CharField(max_length=20, default='face')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='present')
    snapshot = models.ImageField(upload_to='snapshots/', blank=True, null=True)

    def __str__(self):
        return f"{self.student.name} - {self.timestamp.strftime('%Y-%m-%d %H:%M:%S')} - {self.status}"
