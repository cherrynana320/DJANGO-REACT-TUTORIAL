# Django에서 기본 제공하는 사용자 모델, 사용자 인증 관련정보를 포함 (id,username,password 등)
from django.contrib.auth.models import User
# Django REST Framework에서 제공하는 직렬화 도구
from rest_framework import serializers
from .models import Note

from django.contrib.auth.hashers import make_password

# REST framework의 ModelSerializer를 상속받은 클래스
class UserSerializer(serializers.ModelSerializer):
    class Meta: # UserSerializer에 대한 메타데이터 정의
        # 이 직렬화기가 사용할 모델을 지정
        model = User 

        # 직렬화 할 모델의 필드를 지정
        fields = ["id", "username", "password"]

        # 추가 옵션 설정
        extra_kwargs = {"password": {"write_only": True}} # password 필드가 직렬화 과정에서 응답 데이터에 포함되지 않도록 설정

    def create(self, validated_data):
        password = validated_data.pop('password')
        hashed_password = make_password(password)  # 비밀번호 해시화
        user = User.objects.create(username=validated_data['username'], password=hashed_password)
        print("user.password:", user.password)
        return user
    

class NoteSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Note
        fields = ["id", "title", "content", "created_at", "author"]
        extra_kwargs = {"author": {"read_only": True}}
        