from django.shortcuts import render, redirect
from django.http import JsonResponse
from .models import Book, MCQQuestion


def home(request):
    books = Book.objects.order_by('-created_at')[:12]
    return render(request, 'index.html', {'books': books})


def upload_book(request):
    if request.method == 'POST':
        title = request.POST.get('title')
        author = request.POST.get('author')
        grade_level = request.POST.get('grade_level')
        subject = request.POST.get('subject')
        price_type = request.POST.get('price_type')
        price = request.POST.get('price') or 0
        file_url = request.POST.get('file_url')

        Book.objects.create(
            title=title,
            author=author,
            grade_level=grade_level,
            subject=subject,
            price_type=price_type,
            price=price,
            file_url=file_url or '',
        )
        return redirect('home')

    return redirect('home')


def mcq_api(request, grade):
    questions = MCQQuestion.objects.filter(grade=grade)[:10]
    if not questions.exists():
        demo_data = {
            "grade": grade,
            "questions": [
                {
                    "id": 1,
                    "question": "Which of the following is a prime number?",
                    "options": ["9", "21", "23", "35"],
                    "answer": 2,
                },
                {
                    "id": 2,
                    "question": "The capital city of Nepal is:",
                    "options": ["Pokhara", "Kathmandu", "Biratnagar", "Lalitpur"],
                    "answer": 1,
                },
            ],
        }
        return JsonResponse(demo_data)

    data = {
        "grade": grade,
        "questions": [],
    }
    for q in questions:
        data["questions"].append(
            {
                "id": q.id,
                "question": q.question,
                "options": q.options_list(),
                "answer": q.correct_index,
            }
        )
    return JsonResponse(data)
