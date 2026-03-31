from django.db import models
from django.contrib.auth.models import User

class Student(models.Model):
    name = models.CharField(max_length=255)
    grade_level = models.CharField(max_length=50)  # e.g., "10th", "Class 1"
    division = models.CharField(max_length=50)     # e.g., "A", "B"
    teacher = models.ForeignKey(User, on_delete=models.CASCADE, related_name='students')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.grade_level} - {self.division})"
