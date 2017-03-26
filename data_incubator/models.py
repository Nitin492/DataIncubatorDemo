from django.db import models

class Question(models.Model):
    text = models.CharField(max_length=200)
    description = models.CharField(max_length=20000,default="")
    single_valued = models.BooleanField(default=True)
    coding = models.BooleanField(default=True)
    test_case = models.CharField(max_length=20000,default="")
    solution = models.CharField(max_length=200,default="")
    def __str__(self):
        return self.text


class Score(models.Model):
     score_value = models.CharField(max_length=20,default=0)
     student_name = models.CharField(max_length=200,default="Nitin")
     question = models.ForeignKey(Question, on_delete=models.CASCADE)
     def __str__(self):
         return self.score_value
