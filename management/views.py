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
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'email': user.email,
            'username': user.username,
            'is_teacher': user.groups.filter(name='Teacher').exists(),
            'is_admin': user.is_staff
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

    def perform_create(self, serializer):
        serializer.save(teacher=self.request.user)

class SignUpView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email', '')
        
        if not username or not password:
            return Response({'error': 'Username and password required'}, status=status.HTTP_400_BAD_REQUEST)
        
        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
            
        user = User.objects.create_user(username=username, password=password, email=email)
        # Default new users to Teacher group for this project
        teacher_group, _ = Group.objects.get_or_create(name='Teacher')
        user.groups.add(teacher_group)
        
        token, _ = Token.objects.get_or_create(user=user)
        
        return Response({
            'token': token.key,
            'user_id': user.pk,
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
