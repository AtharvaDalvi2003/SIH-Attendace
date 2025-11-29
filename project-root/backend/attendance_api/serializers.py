from rest_framework import serializers
from .models import Student, Attendance, ClassRoom


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
     model = Student
fields = ['id', 'roll', 'name', 'email', 'phone', 'photo', 'embedding']


class AttendanceSerializer(serializers.ModelSerializer):
    student = StudentSerializer(read_only=True)
    student_id = serializers.PrimaryKeyRelatedField(queryset=Student.objects.all(), source='student', write_only=True)


class Meta:
    model = Attendance
fields = ['id', 'student', 'student_id', 'classroom', 'timestamp', 'method', 'status', 'snapshot']


class ClassRoomSerializer(serializers.ModelSerializer):
 class Meta:
    model = ClassRoom
fields = ['id', 'name', 'subject']