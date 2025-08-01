from django.contrib import admin
from django.urls import path, include
from pacientes.views import generar_receta_pdf, obtener_historial_por_paciente
from django.conf import settings
from django.conf.urls.static import static
from pacientes.urls import router

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('pacientes.urls')),  # ✅ Cambiado: sin 'pacientes/' adicional
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
