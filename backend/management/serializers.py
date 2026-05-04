from rest_framework import serializers
from django.contrib.auth.models import User, Group
from .models import Student, Department, Class, Division, Admission, TeacherProfile, Subject

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = '__all__'

class TeacherProfileSerializer(serializers.ModelSerializer):
    subject_details = SubjectSerializer(source='subjects', many=True, read_only=True)
    subjects = serializers.PrimaryKeyRelatedField(queryset=Subject.objects.all(), many=True, required=False)

    class Meta:
        model = TeacherProfile
        fields = ['full_name', 'qualification', 'phone_number', 'address', 'gender', 'date_of_birth', 'experience', 'joining_date', 'photo', 'subjects', 'subject_details']

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for general User information.
    Includes custom fields to identify teacher and admin status.
    """
    is_teacher = serializers.SerializerMethodField()
    is_admin = serializers.BooleanField(source='is_staff', read_only=True)
    profile = TeacherProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_teacher', 'is_admin', 'profile']

    def get_is_teacher(self, obj):
        """Checks if the user belongs to the 'Teacher' group."""
        return obj.groups.filter(name='Teacher').exists()

class TeacherUserSerializer(serializers.ModelSerializer):
    """
    Serializer specifically for creating and updating Teacher accounts.
    Handles password hashing and automatic group assignment.
    """
    password = serializers.CharField(write_only=True, required=False)
    profile = TeacherProfileSerializer(required=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'profile']

    def create(self, validated_data):
        """
        Creates a new user, hashes the password, creates a profile with subjects, and adds them to the 'Teacher' group.
        """
        profile_data = validated_data.pop('profile', None)
        password = validated_data.pop('password', None)
        user = User.objects.create_user(**validated_data)
        if password:
            user.set_password(password)
            user.save()
        
        # Create TeacherProfile if data is provided
        if profile_data:
            subjects = profile_data.pop('subjects', [])
            profile = TeacherProfile.objects.create(user=user, **profile_data)
            if subjects:
                profile.subjects.set(subjects)
        
        # Ensure the 'Teacher' group exists and add the user to it
        teacher_group, _ = Group.objects.get_or_create(name='Teacher')
        user.groups.add(teacher_group)
        return user

    def update(self, instance, validated_data):
        """
        Updates an existing teacher's information and handles password/profile/subjects updates securely.
        """
        profile_data = validated_data.pop('profile', None)
        password = validated_data.pop('password', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        if password:
            instance.set_password(password)
        
        instance.save()

        # Update TeacherProfile if data is provided
        if profile_data:
            subjects = profile_data.pop('subjects', None)
            profile, _ = TeacherProfile.objects.get_or_create(user=instance)
            for attr, value in profile_data.items():
                setattr(profile, attr, value)
            profile.save()
            
            if subjects is not None:
                profile.subjects.set(subjects)
            
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
        If user is not authenticated (though view should protect this), it will fail or handle as needed.
        """
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['teacher'] = request.user
        return super().create(validated_data)

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'
        read_only_fields = ['user']

    def create(self, validated_data):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['user'] = request.user
        return super().create(validated_data)

class ClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = Class
        fields = '__all__'

class DivisionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Division
        fields = '__all__'

class AdmissionSerializer(serializers.ModelSerializer):
    admission_date = serializers.DateField(required=False, allow_null=True)
    date_of_birth = serializers.DateField(required=False, allow_null=True)
    department = serializers.PrimaryKeyRelatedField(queryset=Department.objects.all(), required=False, allow_null=True)
    class_name = serializers.PrimaryKeyRelatedField(queryset=Class.objects.all(), required=False, allow_null=True)
    division = serializers.PrimaryKeyRelatedField(queryset=Division.objects.all(), required=False, allow_null=True)

    class Meta:
        model = Admission
        fields = '__all__'
        extra_kwargs = {
            'admission_number': {'required': False},
            'first_name': {'required': False, 'allow_blank': True},
            'last_name': {'required': False, 'allow_blank': True},
            'gender': {'required': False, 'allow_blank': True},
            'place_of_birth': {'required': False, 'allow_blank': True},
            'address': {'required': False, 'allow_blank': True},
            'district': {'required': False, 'allow_blank': True},
            'state': {'required': False, 'allow_blank': True},
            'post_office': {'required': False, 'allow_blank': True},
            'blood_group': {'required': False, 'allow_blank': True},
            'nationality': {'required': False, 'allow_blank': True},
            'pin_code': {'required': False, 'allow_blank': True},
            'aadhar_number': {'required': False, 'allow_blank': True},
            'mother_tongue': {'required': False, 'allow_blank': True},
            'religion': {'required': False, 'allow_blank': True},
            'caste': {'required': False, 'allow_blank': True},
            'category': {'required': False, 'allow_blank': True},
            'academic_period': {'required': False, 'allow_blank': True},
            'father_name': {'required': False, 'allow_blank': True},
            'father_occupation': {'required': False, 'allow_blank': True},
            'father_qualification': {'required': False, 'allow_blank': True},
            'father_income': {'required': False, 'allow_blank': True},
            'father_mobile': {'required': False, 'allow_blank': True},
            'mother_name': {'required': False, 'allow_blank': True},
            'mother_occupation': {'required': False, 'allow_blank': True},
            'mother_qualification': {'required': False, 'allow_blank': True},
            'mother_income': {'required': False, 'allow_blank': True},
            'mother_mobile': {'required': False, 'allow_blank': True},
        }
