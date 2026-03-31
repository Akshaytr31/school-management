from rest_framework import serializers
from django.contrib.auth.models import User, Group
from .models import Student

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for general User information.
    Includes custom fields to identify teacher and admin status.
    """
    is_teacher = serializers.SerializerMethodField()
    is_admin = serializers.BooleanField(source='is_staff', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_teacher', 'is_admin']

    def get_is_teacher(self, obj):
        """Checks if the user belongs to the 'Teacher' group."""
        return obj.groups.filter(name='Teacher').exists()

class TeacherUserSerializer(serializers.ModelSerializer):
    """
    Serializer specifically for creating and updating Teacher accounts.
    Handles password hashing and automatic group assignment.
    """
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']

    def create(self, validated_data):
        """
        Creates a new user, hashes the password, and adds them to the 'Teacher' group.
        """
        password = validated_data.pop('password', None)
        user = User.objects.create_user(**validated_data)
        if password:
            user.set_password(password)
            user.save()
        
        # Ensure the 'Teacher' group exists and add the user to it
        teacher_group, _ = Group.objects.get_or_create(name='Teacher')
        user.groups.add(teacher_group)
        return user

    def update(self, instance, validated_data):
        """
        Updates an existing teacher's information and handles password updates securely.
        """
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        if password:
            instance.set_password(password)
        
        instance.save()
        return instance

class StudentSerializer(serializers.ModelSerializer):
    """
    Serializer for Student records.
    Automatically assigns the logged-in teacher to the student upon creation.
    """
    class Meta:
        model = Student
        fields = ['id', 'name', 'grade_level', 'division', 'teacher', 'created_at']
        read_only_fields = ['teacher']

    def create(self, validated_data):
        """
        Overrides create to set the teacher field from the current request user.
        """
        validated_data['teacher'] = self.context['request'].user
        return super().create(validated_data)
