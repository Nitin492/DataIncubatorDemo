"""datainc URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.9/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import patterns,url
from django.contrib import admin
from django.views.generic import TemplateView,RedirectView
from data_incubator import views
admin.autodiscover()
admin.site.site_header = 'Data Incubator Administration'
admin.site.site_title = 'Data Incubator Administration'

# app and api URL redirections

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^$', RedirectView.as_view(url='/app/questions/', permanent=False), name='index'),
    url(r'^app/base.html$', TemplateView.as_view(template_name='base.html')),
    url(r'^app/questions/$', views.QuestionList.as_view()),
    url(r'^app/question/(?P<question_id>[0-9]+)/$', views.QuestionDetail.as_view(), name='question'),
    url(r'^app/createquestion/$', TemplateView.as_view(template_name='backend.html')),
    url(r'^api/addquestion/', views.AddQuestionDetails.as_view()),
    url(r'^api/getfeedback/', views.GetFeedback.as_view()),
]
