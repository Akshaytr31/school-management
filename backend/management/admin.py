from django.contrib import admin
from .models import Student, Department, Class, Division, Designation, Subject, Admission, ClassroomSetup, TeacherProfile

@admin.register(TeacherProfile)
class TeacherProfileAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'user', 'qualification', 'phone_number', 'experience')
    search_fields = ('full_name', 'user__username', 'qualification')

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('name', 'grade_level', 'division', 'teacher', 'created_at')
    search_fields = ('name', 'grade_level', 'division')

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('department_name', 'status', 'created_at', 'updated_at')
    search_fields = ('department_name',)

@admin.register(Class)
class ClassAdmin(admin.ModelAdmin):
    list_display = ('class_name', 'division', 'category', 'department', 'status', 'created_at')
    search_fields = ('class_name', 'division')

@admin.register(Division)
class DivisionAdmin(admin.ModelAdmin):
    list_display = ('division', 'class_name', 'class_teacher_name', 'status')
    search_fields = ('division', 'class_teacher_name')

@admin.register(Designation)
class DesignationAdmin(admin.ModelAdmin):
    list_display = ('designation_name', 'status', 'created_at')
    search_fields = ('designation_name',)

@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ('subject_name', 'subject_type', 'department', 'class_name')
    search_fields = ('subject_name',)

@admin.register(Admission)
class AdmissionAdmin(admin.ModelAdmin):
    list_display = ('admission_number', 'first_name', 'last_name', 'class_name', 'division', 'admission_date')
    search_fields = ('admission_number', 'first_name', 'last_name', 'aadhar_number')
    list_filter = ('class_name', 'division', 'gender', 'blood_group')

@admin.register(ClassroomSetup)
class ClassroomSetupAdmin(admin.ModelAdmin):
    list_display = ('department', 'class_name', 'division', 'status', 'created_at')
    list_filter = ('department', 'class_name', 'division')
