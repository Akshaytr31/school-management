from django.contrib.auth.models import User, Group
from rest_framework import generics, permissions, status, viewsets
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from .models import Student, Department, Class, Division, Admission
from .serializers import (
    StudentSerializer, UserSerializer, TeacherUserSerializer,
    DepartmentSerializer, ClassSerializer, DivisionSerializer, AdmissionSerializer
)

class CustomAuthToken(ObtainAuthToken):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        
        # Using UserSerializer to format most of the response
        user_data = UserSerializer(user).data
        return Response({
            'token': token.key,
            **user_data
        })

class StudentListCreateView(generics.ListCreateAPIView):
    serializer_class = StudentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Admins can see all students, teachers see only their own
        user = self.request.user
        if user.is_staff:
            return Student.objects.all()
        return Student.objects.filter(teacher=user)

class SignUpView(generics.CreateAPIView):
    serializer_class = TeacherUserSerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        
        return Response({
            'token': token.key,
            'user_id': user.id,
            'username': user.username,
            'message': 'Account created successfully'
        }, status=status.HTTP_201_CREATED)

class TeacherManagementViewSet(generics.ListCreateAPIView):
    serializer_class = TeacherUserSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        return User.objects.filter(groups__name='Teacher')

class TeacherDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TeacherUserSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = User.objects.filter(groups__name='Teacher')

class DepartmentListCreateView(generics.ListCreateAPIView):
    queryset = Department.objects.all() # Removed status filter to allow managing all
    serializer_class = DepartmentSerializer
    permission_classes = [permissions.IsAuthenticated]

class ClassListCreateView(generics.ListCreateAPIView):
    queryset = Class.objects.all()
    serializer_class = ClassSerializer
    permission_classes = [permissions.IsAuthenticated]

class DivisionListCreateView(generics.ListCreateAPIView):
    queryset = Division.objects.all()
    serializer_class = DivisionSerializer
    permission_classes = [permissions.IsAuthenticated]

class AdmissionListCreateView(generics.ListCreateAPIView):
    queryset = Admission.objects.all()
    serializer_class = AdmissionSerializer
    permission_classes = [permissions.IsAuthenticated]
