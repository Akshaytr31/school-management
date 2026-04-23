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

class Department(models.Model):
    department_name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.BooleanField(default=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.department_name

class Class(models.Model):
    CATEGORY_CHOICES = [
        ('Senior Secondary', 'Senior Secondary'),
        ('Secondary', 'Secondary'),
        ('Middle', 'Middle'),
        ('Primary', 'Primary'),
        ('Pre Primary', 'Pre Primary'),
    ]
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    class_name = models.CharField(max_length=255)
    division = models.CharField(max_length=255, blank=True, null=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='Primary')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.BooleanField(default=True)

    def __str__(self):
        if self.division:
            return f"{self.class_name} - {self.division}"
        return self.class_name
    
class Division(models.Model):
    class_name = models.ForeignKey(Class, on_delete=models.CASCADE, related_name='division_list')
    division = models.CharField(max_length=255)
    class_teacher_name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.class_name} - {self.division}"

class Designation(models.Model):
    designation_name = models.CharField(max_length=255)
    status = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.designation_name
    
class Subject(models.Model):
    subject_name = models.CharField(max_length=255)
    subject_type = models.CharField(max_length=255)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='subjects')
    class_name = models.ForeignKey(Class, on_delete=models.CASCADE, related_name='subjects')

    def __str__(self):
        return self.subject_name

class Admission(models.Model):
    admission_number = models.CharField(max_length=255)
    admission_date = models.DateField()
    academic_period = models.CharField(max_length=255)
    first_name = models.CharField(max_length=255)
    middle_name = models.CharField(max_length=255, blank=True, null=True)
    last_name = models.CharField(max_length=255)
    gender = models.CharField(max_length=255)
    date_of_birth = models.DateField()
    place_of_birth = models.CharField(max_length=255)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='admissions')
    class_name = models.ForeignKey(Class, on_delete=models.CASCADE, related_name='admissions')
    division = models.ForeignKey(Division, on_delete=models.CASCADE, related_name='admissions')
    address = models.TextField(max_length=255)
    district = models.CharField(max_length=255)
    state = models.CharField(max_length=255)
    post_office = models.CharField(max_length=255)
    blood_group = models.CharField(max_length=255)
    nationality = models.CharField(max_length=255)
    pin_code = models.CharField(max_length=255)
    aadhar_number = models.CharField(max_length=255)
    mother_tongue = models.CharField(max_length=255)
    religion = models.CharField(max_length=255)
    caste = models.CharField(max_length=255)
    category = models.CharField(max_length=255)
    photo = models.ImageField(upload_to='admission_photos', blank=True, null=True)
    father_name = models.CharField(max_length=255)
    father_occupation = models.CharField(max_length=255)
    father_qualification = models.CharField(max_length=255)
    father_income = models.CharField(max_length=255)
    father_mobile = models.CharField(max_length=255)
    father_email = models.EmailField(max_length=255, blank=True, null=True)
    mother_name = models.CharField(max_length=255)
    mother_occupation = models.CharField(max_length=255)
    mother_qualification = models.CharField(max_length=255)
    mother_income = models.CharField(max_length=255)
    mother_mobile = models.CharField(max_length=255)
    mother_email = models.EmailField(max_length=255, blank=True, null=True)
    guardian_name = models.CharField(max_length=255, blank=True, null=True)
    guardian_occupation = models.CharField(max_length=255, blank=True, null=True)
    guardian_income = models.CharField(max_length=255, blank=True, null=True)
    guardian_mobile = models.CharField(max_length=255, blank=True, null=True)
    guardian_email = models.EmailField(max_length=255, blank=True, null=True)
    tc_number = models.CharField(max_length=255, blank=True, null=True)
    tc_date = models.DateField(blank=True, null=True)
    school_name = models.CharField(max_length=255, blank=True, null=True)
    previous_class = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.admission_number
    
class ClassroomSetup(models.Model):
    class_name = models.ForeignKey(Class, on_delete=models.CASCADE, related_name='classroom_setups')
    division = models.ForeignKey(Division, on_delete=models.CASCADE, related_name='classroom_setups')
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='classroom_setups')
    status = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.department} - {self.class_name} - {self.division}"

class TeacherProfile(models.Model):
    GENDER_CHOICES = [
        ('Male', 'Male'),
        ('Female', 'Female'),
        ('Other', 'Other'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    full_name = models.CharField(max_length=255)
    qualification = models.CharField(max_length=255, blank=True, null=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, default='Male')
    date_of_birth = models.DateField(blank=True, null=True)
    experience = models.CharField(max_length=255, blank=True, null=True)
    joining_date = models.DateField(blank=True, null=True)
    photo = models.ImageField(upload_to='teacher_photos', blank=True, null=True)
    subjects = models.ManyToManyField(Subject, related_name='teachers', blank=True)

    def __str__(self):
        return self.full_name
