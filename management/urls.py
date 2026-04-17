from django.urls import path
from .views import (
    CustomAuthToken, StudentListCreateView, SignUpView, 
    TeacherManagementViewSet, TeacherDetailView,
    DepartmentListCreateView, ClassListCreateView, DivisionListCreateView, AdmissionListCreateView
)

urlpatterns = [
    path('login/', CustomAuthToken.as_view(), name='api_login'),
    path('signup/', SignUpView.as_view(), name='api_signup'),
    path('teachers/', TeacherManagementViewSet.as_view(), name='teacher_list_create'),
    path('teachers/<int:pk>/', TeacherDetailView.as_view(), name='teacher_detail'),
    path('students/', StudentListCreateView.as_view(), name='student_list_create'),
    path('departments/', DepartmentListCreateView.as_view(), name='department_list'),
    path('classes/', ClassListCreateView.as_view(), name='class_list'),
    path('divisions/', DivisionListCreateView.as_view(), name='division_list'),
    path('admissions/', AdmissionListCreateView.as_view(), name='admission_list_create'),
]
