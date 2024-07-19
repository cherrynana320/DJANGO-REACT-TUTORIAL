from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, NoteSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Note

# 메모를 읽어서 보여주고, 생성하는 class
# 객체 목록을 조회
class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer # 여기서 사용할 직렬화기는 NoteSerializer
    permission_classes = [IsAuthenticated]

    # GET 요청일 때 ( 메모 보여주기 )
    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user) 
    
    # POST 요청일 때 ( 메모 생성 )
    def perform_create(self, serializer):
        if serializer.is_valid():
            # save() : 직렬화된 데이터를 데이터베이스에 저장하는 역할
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)

# 메모 삭제
class NoteDelete(generics.DestroyAPIView):
    queryset = Note.objects.all()
    permission_class = NoteSerializer

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user) 
    

# CreateAPIView
# -> perform_create 메서드를 오버라이드하지 않아도 됨.
# -> 별도로 save() 함수를 호출할 필요가 없음.
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]