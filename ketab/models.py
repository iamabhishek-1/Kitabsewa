from django.db import models


class Book(models.Model):
    PRICE_TYPE_CHOICES = [
        ('free', 'Free'),
        ('paid', 'Paid'),
    ]

    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    grade_level = models.CharField(max_length=50)
    subject = models.CharField(max_length=100)
    price_type = models.CharField(max_length=10, choices=PRICE_TYPE_CHOICES, default='free')
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    file_url = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class MCQQuestion(models.Model):
    GRADE_CHOICES = [
        ('class-10', 'Class 10'),
        ('plus-two', '+2'),
        ('mbbs', 'MBBS'),
    ]

    grade = models.CharField(max_length=20, choices=GRADE_CHOICES)
    question = models.TextField()
    option_a = models.CharField(max_length=255)
    option_b = models.CharField(max_length=255)
    option_c = models.CharField(max_length=255)
    option_d = models.CharField(max_length=255)
    correct_index = models.IntegerField(help_text="0 for A, 1 for B, 2 for C, 3 for D")

    def options_list(self):
        return [self.option_a, self.option_b, self.option_c, self.option_d]

    def __str__(self):
        return f"{self.grade} - {self.question[:40]}"
