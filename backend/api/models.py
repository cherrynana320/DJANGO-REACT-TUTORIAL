from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Note(models.Model):
    # 1. 필드 유형 지정
    title = models.CharField(max_length=100) # 제목
    content = models.TextField() # 내용
    created_at = models.DateTimeField(auto_now_add=True) # 시간
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes") # 글쓴이 
    # author는 Note모델에서 외래키, User 모델에서는 기본 키
    # Note모델은 author를 통해 User를 참조

    def __str__(self):
        return self.title