from django.contrib import admin
from django.urls import path, include
from pacientes.views import generar_receta_pdf
from django.conf import settings
from django.conf.urls.static import static
from pacientes import views
from pacientes.views import obtener_historial_por_paciente
from pacientes.urls import router

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/recetas/<int:consulta_id>/', generar_receta_pdf, name='generar_receta_pdf'),
    path('api/consultas/', views.obtener_consultas, name='obtener_consultas'),
    path('api/consultas/paciente/<int:pk>/', obtener_historial_por_paciente),
    path('api/pacientes/', include('pacientes.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
