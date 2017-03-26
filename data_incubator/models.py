from django.db import models
# Model - Question to store question content,
# solution and testcase. Two boolean fields
# single_valued and coding are used to determine whether
# the question accpts a single valued solution or a code
# test_case field can be removed and files can be used to
# multiple test cases
class Question(models.Model):
    text = models.CharField(max_length=200)
    description = models.CharField(max_length=20000,default="")
    single_valued = models.BooleanField(default=True)
    coding = models.BooleanField(default=True)
    test_case = models.CharField(max_length=20000,default="")
    solution = models.CharField(max_length=200,default="")
    def __str__(self):
        return self.text

# Model - Score to store the score obtained by
# each student for a question, student_name field
# can be made into foreign key for a Student(model)
# to store the logged in user insted of a default value
class Score(models.Model):
     score_value = models.CharField(max_length=20,default=0)
     student_name = models.CharField(max_length=200,default="Nitin")
     question = models.ForeignKey(Question, on_delete=models.CASCADE)
     def __str__(self):
         return self.score_value
