import os.path
from django.views.generic import ListView
from django.db import transaction
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from django.http import HttpResponse
from data_incubator.models import Question,Score
# Create your views here.
# Temporary test view
def index(request):
    return HttpResponse("Hello, world. You're at the temporary index page.")

# View to list all the question on main(home)page
class QuestionList(ListView):
    model = Question
    template_name = 'frontend.html'
    queryset = Question.objects.all().order_by('-id')

# view to get details of a specific question based on it id
class QuestionDetail(ListView):
    model = Question
    template_name = 'question.html'
    def get_queryset(self):
        print(self.kwargs['question_id'])
        return Question.objects.filter(id=self.kwargs.get('question_id'))

# view to process the given answer and verify the correctness
class GetFeedback(APIView):

    parser_classes = (JSONParser,)
    def get(self, request, format=None):
        pass

    @transaction.atomic
    def post(self, request, format=None):
        js = request.data
        isCorrect = False
        id = js['id']
        answer = js['answer']
        # varibale correct can be used to determine the percentage of
        # passed testcases and determine score
        correct = 1
        score_id = Score()
        que = Question.objects.get(id=id)
        if que.single_valued:
            if answer == que.solution:
                isCorrect = True
                score_id = self._add_test_scores(que,1)
        elif que.test_case:
            res = self._run_testcase(answer,que)
            if res:
                isCorrect = True
                score_id = self._add_test_scores(que,correct)
        ret_body = {}
        ret_body['flag'] = isCorrect
        ret_body['id'] = score_id.id
        ret_body['score'] = 100 * correct
        return Response(ret_body, status=status.HTTP_201_CREATED)

# Runs stored test case against the submitted code
# can be modified to run against testcases stored in file
    def _run_testcase(self,answer,que):
        testcase = que.test_case
        t_arr = testcase.split()
        ans_arr = answer.split()
        # modify code to include function call using test case
        start = ans_arr[1].index('(')
        param_arr = ans_arr[1][start:].split(',')
        func_call = "\nans = "
        func_call += ans_arr[1][:start+1]
        for i in range(len(param_arr)):
            func_call += t_arr[i]
            if i != (len(param_arr)-1):
                func_call += ','
        func_call += ')'
        print(func_call)
        answer += func_call
        # modification ends
        print(answer)
        ans = {}
        # execute code
        exec(answer,{},ans)
        if t_arr[len(param_arr)] == str(ans['ans']):
            return True
        else:
            return False

# Adds test score to Score table
    def _add_test_scores(self,que,correct):
        data = Score()
        data.question = que
        data.score = 100*correct
        data.save()
        return data

# View to add the new question to database
class AddQuestionDetails(APIView):

    parser_classes = (JSONParser,)
    def get(self, request, format=None):
        pass

    @transaction.atomic
    def post(self, request, format=None):
        js = request.data
        text = js['text']
        description = js['description']
        single_valued = js['single_valued']
        coding = js['coding']
        testcase = js['testcase']
        solution = js['solution']
        added = self._add_question(text,description,single_valued,coding,testcase,solution)
        ret_body = {}
        ret_body['snap_id'] = added.id
        return Response(ret_body, status=status.HTTP_201_CREATED)

    def _add_question(self, text,description,single_valued,coding,testcase,solution):
        data = Question()
        print("bello creating")
        data.text = text
        data.description = description
        data.single_valued = single_valued
        data.coding = coding
        data.test_case = testcase
        data.solution = solution
        print("trying to save")
        data.save()
        print("bello")
        return data
