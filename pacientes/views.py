from rest_framework.generics import ListCreateAPIView, CreateAPIView
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from .models import Paciente, Consulta, Procedimiento, Registro, CIE10Diagnosis
from .serializers import PacienteSerializer, ConsultaSerializer, ProcedimientoSerializer, RegistroSerializer, CIE10DiagnosisSerializer
import io
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from rest_framework import status, viewsets
from rest_framework.generics import RetrieveAPIView
from django.conf import settings
import os
from django.templatetags.static import static
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils.timezone import localtime
from django.utils import timezone
from django.db.models import Count
from datetime import date, timedelta
from rest_framework import viewsets
from rest_framework import generics



class ProcedimientoViewSet(viewsets.ModelViewSet):
    queryset = Procedimiento.objects.all()
    serializer_class = ProcedimientoSerializer


class RegistroViewSet(viewsets.ModelViewSet):
    queryset = Registro.objects.all().order_by('-fecha')
    serializer_class = RegistroSerializer


# views.py
from rest_framework import viewsets, filters
from .models import MedicamentoFrecuente
from .serializers import MedicamentoFrecuenteSerializer


class MedicamentoFrecuenteViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = MedicamentoFrecuente.objects.all()
    serializer_class = MedicamentoFrecuenteSerializer
    filter_backends = [filters.SearchFilter]  # ✅ agrega esta línea
    search_fields = ['nombre']


@api_view(['GET'])
def obtener_consultas(request):
    consultas = Consulta.objects.all().order_by('-fecha')
    serializer = ConsultaSerializer(consultas, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def obtener_historial_por_paciente(request, pk):
    consultas = Consulta.objects.filter(paciente_id=pk).order_by('-fecha')
    serializer = ConsultaSerializer(consultas, many=True)
    return Response(serializer.data)




class EstadisticasDiariasView(APIView):
    def get(self, request):
        hoy = date.today()
        semana = hoy - timedelta(days=6)
        consultas = Consulta.objects.filter(fecha__date__gte=semana) \
            .values('fecha__date').annotate(count=Count('id')).order_by('fecha__date')
        data = [{'fecha': str(item['fecha__date']), 'count': item['count']} for item in consultas]
        return Response(data)

class PacienteViewSet(viewsets.ModelViewSet):
    queryset = Paciente.objects.all()
    serializer_class = PacienteSerializer


class PacienteRetrieveView(RetrieveAPIView):
    queryset = Paciente.objects.all()
    serializer_class = PacienteSerializer

class PacienteListCreateView(ListCreateAPIView):
    queryset = Paciente.objects.all()
    serializer_class = PacienteSerializer

from rest_framework import generics

class ConsultaListCreateView(generics.ListCreateAPIView):
    queryset = Consulta.objects.all()
    serializer_class = ConsultaSerializer

 
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            consulta = serializer.save()
            receta_url = f"/api/recetas/{consulta.id}/"
            return Response({
                "mensaje": "Consulta guardada correctamente",
                "consulta_id": consulta.id,
                "url_receta": receta_url
            }, status=status.HTTP_201_CREATED)
        else:
            print("❌ Errores de validación:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ConsultaRetrieveView(APIView):
    def get(self, request, consulta_id):
        consulta = get_object_or_404(Consulta, id=consulta_id)
        serializer = ConsultaSerializer(consulta)
        return Response(serializer.data, status=status.HTTP_200_OK)

class HistorialPorPaciente(APIView):
    def get(self, request, paciente_id):
        consultas = Consulta.objects.filter(paciente__id=paciente_id).order_by('-fecha')
        serializer = ConsultaSerializer(consultas, many=True)
        return Response(serializer.data)


from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.colors import HexColor
from django.http import HttpResponse
from .models import Consulta
from datetime import date
from reportlab.lib.utils import ImageReader

def calcular_edad(fecha_nacimiento):
    hoy = date.today()
    return hoy.year - fecha_nacimiento.year - ((hoy.month, hoy.day) < (fecha_nacimiento.month, fecha_nacimiento.day))

def generar_receta_pdf(request, consulta_id):
    consulta = Consulta.objects.get(id=consulta_id)
    paciente = consulta.paciente
    edad = calcular_edad(paciente.fecha_nacimiento)
    

    # Colores
    azul_oscuro = HexColor("#1E3A8A")
    gris_claro = HexColor("#E5E7EB")
    gris_texto = HexColor("#374151")
    gris_linea = HexColor("#9CA3AF")

    # Crear PDF
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'inline; filename="receta_profesional.pdf"'
    p = canvas.Canvas(response, pagesize=letter)
    width, height = letter

    def dibujar_receta(y_start, c):
        # Fondo
        p.setFillColor(gris_claro)
        p.roundRect(40, y_start - 320, width - 80, 250, 12, stroke=0, fill=1)
        # Imagen de fondo (marca de agua) centrada en el cuadro
        try:
            fondo_path = os.path.join(os.path.dirname(__file__), 'static', 'fondo.png')
            fondo = ImageReader(fondo_path)
            p.saveState()
            p.setFillAlpha(0.2)  # Opacidad baja

            ancho_fondo = 300
            alto_fondo = 300
            x_fondo = 40 + (width - 80 - ancho_fondo) / 2
            y_fondo = (y_start - 320) + (250 - alto_fondo) / 2

            p.drawImage(fondo, x_fondo, y_fondo, width=ancho_fondo, height=alto_fondo, preserveAspectRatio=True, mask='auto')
            p.restoreState()
        except:
            pass

        # Ruta del logo (relativa al archivo views)
        logo_path = os.path.join(os.path.dirname(__file__), 'static', 'logo.png')
        try:
            logo = ImageReader(logo_path)
            p.drawImage(logo, x=40, y=y_start - 60, width=80, height=80, preserveAspectRatio=True, mask='auto')
        except Exception as e:
            print("No se pudo cargar el logo:", e)

        # Encabezado
        p.setFillColor(azul_oscuro)
        p.setFont("Helvetica-Bold", 16)
        p.drawCentredString(width / 2, y_start, "Consultorio Medico Fundación Best")

        p.setFont("Helvetica-Bold", 11)
        p.drawCentredString(width / 2, y_start - 20, "Dr. José Martín González Durán")
        p.setFont("Helvetica", 9)
        p.drawCentredString(width / 2, y_start - 34, "Cédula Profesional: 12949813    •    U.A.N.L.")
        # Dirección del consultorio
        direccion = "Paseo de San Juan #374, C.P: 67254, Ciudad Benito Juárez, N.L."
        p.setFont("Helvetica", 9)
        p.drawCentredString(width / 2, y_start - 48, direccion)

        
        # Código QR en la parte superior derecha
        try:
            qr_path = os.path.join(os.path.dirname(__file__), 'static', 'qr.png')
            qr = ImageReader(qr_path)
            p.drawImage(qr, width - 90, y_start - 35, width=50, height=50, preserveAspectRatio=True, mask='auto')
            p.setFont("Helvetica", 6)
            p.setFillColor(gris_texto)
        except Exception as e:
            print("Error al cargar QR:", e)

        # Fecha un poco más abajo
        p.setFont("Helvetica", 9)
        p.setFillColor(gris_texto)

        fecha_local = timezone.localtime(c.fecha)
        p.drawRightString(width - 40, y_start - 45, f"Fecha: {fecha_local.strftime('%d/%m/%Y')}")
        # Datos del paciente
        p.setFillColor(gris_texto)
        p.setFont("Helvetica-Bold", 10)
        p.drawString(55, y_start - 68, "Nombre:")
        p.setFont("Helvetica", 10)
        p.drawString(110, y_start - 68, paciente.nombre)

        p.setFont("Helvetica-Bold", 10)
        p.drawString(350, y_start - 68, "Edad:")
        p.setFont("Helvetica", 10)
        p.drawString(390, y_start - 68, f"{edad} años")

        p.setFont("Helvetica-Bold", 10)
        p.drawString(450, y_start - 68, "Nacimiento:")
        p.setFont("Helvetica", 10)
        p.drawString(525, y_start - 68, paciente.fecha_nacimiento.strftime('%d/%m/%Y'))

        p.setFont("Helvetica-Bold", 10)
        p.drawString(55, y_start - 82, "Antecedentes:")
        p.setFont("Helvetica", 10)
        p.drawString(140, y_start - 82, c.antecedentes)

        # Tratamiento
        p.setFont("Helvetica-Bold", 11)
        p.setFillColor(azul_oscuro)
        p.drawString(55, y_start - 105, "Tratamiento:")

        y = y_start - 120
        for i, item in enumerate(c.tratamiento):
            p.setFont("Helvetica-Bold", 10)
            p.setFillColor(gris_texto)
            p.drawString(65, y, f"{i+1}. {item['nombre']}")
            p.setFont("Helvetica-Oblique", 9)
            p.setFillColor(HexColor("#6B7280"))
            p.drawString(80, y - 12, item['posologia'])
            y -= 28

        # Signos vitales (solo los que están llenos)
        signos_y = y_start - 110  # Posición inicial fija arriba a la derecha
        p.setFont("Helvetica-Bold", 11)
        p.setFillColor(azul_oscuro)
        p.drawString(430, signos_y, "Signos vitales:")

        p.setFont("Helvetica", 9)
        p.setFillColor(gris_texto)

        signos = []
        if c.presion_arterial:
            signos.append(f"T/A: {c.presion_arterial}")
        if c.frecuencia_cardiaca:
            signos.append(f"FC: {c.frecuencia_cardiaca}")
        if c.frecuencia_respiratoria:
            signos.append(f"FR: {c.frecuencia_respiratoria}")
        if c.glucometria:
            signos.append(f"Gluco: {c.glucometria}")
        if c.oximetria:
            signos.append(f"Sat O2: {c.oximetria}")
        if c.peso:
            signos.append(f"Peso: {c.peso} kg")
        if c.talla:
            signos.append(f"Talla: {c.talla} m")
        if c.imc:
            signos.append(f"IMC: {c.imc}")

        y_actual = signos_y - 15
        for signo in signos:
            p.drawString(430, y_actual, signo)
            y_actual -= 15

        # Firma
        firma_y = y_start - 290  # o el valor que desees para la altura

        # Dibuja la línea de firma
        p.line(width - 200, firma_y, width - 60, firma_y)

        # Agrega imagen de firma encima de la línea
        try:
            firma_path = os.path.join(os.path.dirname(__file__), 'static', 'firma.png')
            firma = ImageReader(firma_path)
            p.drawImage(firma, x=width - 180, y=firma_y + 8, width=100, preserveAspectRatio=True, mask='auto')
        except Exception as e:
            print("No se pudo cargar la firma:", e)

        # Texto bajo la línea
        p.drawRightString(width - 90, firma_y - 12, "Firma del médico")




    # Parte superior
    dibujar_receta(763, consulta)

        
    # Línea punteada divisoria
    p.setDash(1, 3)
    p.line(40, height / 2, width - 40, height / 2)
    p.setDash()

    # Parte inferior (duplicada)
    dibujar_receta(360, consulta)




    p.showPage()
    p.save()
    return response




from rest_framework import generics
from rest_framework.filters import SearchFilter
from .models import CIE10Diagnosis
from .serializers import CIE10DiagnosisSerializer

class CIE10DiagnosisListAPIView(generics.ListAPIView):
    queryset = CIE10Diagnosis.objects.all()
    serializer_class = CIE10DiagnosisSerializer
    filter_backends = [SearchFilter]
    search_fields = ['codigo', 'descripcion']  # permite buscar por ambos
