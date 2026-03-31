from django.contrib.auth.models import User, Group
from rest_framework import generics, permissions, status
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from .models import Student
from .serializers import StudentSerializer, UserSerializer, TeacherUserSerializer

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
