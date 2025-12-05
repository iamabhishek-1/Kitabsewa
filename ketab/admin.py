from django.contrib import admin
from .models import Book, MCQQuestion


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'grade_level', 'subject', 'price_type', 'price', 'created_at')
    list_filter = ('grade_level', 'price_type', 'subject')
    search_fields = ('title', 'author', 'subject')


@admin.register(MCQQuestion)
class MCQQuestionAdmin(admin.ModelAdmin):
    list_display = ('grade', 'question', 'correct_index')
    list_filter = ('grade',)
    search_fields = ('question',)
