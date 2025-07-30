from django.db import models
from datetime import date

class Paciente(models.Model):
    nombre = models.CharField(max_length=255)
    fecha_nacimiento = models.DateField()
    telefono = models.CharField(max_length=20, blank=True, null=True)
    correo = models.EmailField(blank=True, null=True)
    tutor = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.nombre
    

    def edad(self):
        hoy = date.today()
        return hoy.year - self.fecha_nacimiento.year - (
            (hoy.month, hoy.day) < (self.fecha_nacimiento.month, self.fecha_nacimiento.day)
        )


def calcular_imc(peso, talla):
    try:
        return round(peso / (talla * talla), 2)
    except:
        return None


class Consulta(models.Model):
    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE)
    motivo = models.TextField(blank=True, null=True)
    antecedentes = models.TextField(blank=True, null=True)
    peso = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    talla = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    imc = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    frecuencia_cardiaca = models.IntegerField(blank=True, null=True)
    frecuencia_respiratoria = models.IntegerField(blank=True, null=True)
    presion_arterial = models.CharField(max_length=10, blank=True, null=True)
    glucometria = models.IntegerField(blank=True, null=True)
    oximetria = models.IntegerField(blank=True, null=True)
    diagnostico = models.TextField(blank=True, null=True)
    tratamiento = models.JSONField(blank=True, null=True)
    medico = models.CharField(max_length=100, blank=True, null=True)
    fecha = models.DateTimeField(auto_now_add=True)
    
    def save(self, *args, **kwargs):
        if self.peso and self.talla:
            try:
                peso = float(self.peso)
                talla = float(self.talla)
                if talla > 0:
                    self.imc = round(peso / (talla ** 2), 2)
                else:
                    self.imc = None
            except (ValueError, ZeroDivisionError):
                self.imc = None
        super().save(*args, **kwargs)


class Procedimiento(models.Model):
    fecha = models.DateField()
    tipo = models.CharField(max_length=100)
    cantidad = models.IntegerField()
    notas = models.TextField(blank=True)

    def __str__(self):
        return f"{self.fecha} - {self.tipo} ({self.cantidad})"

class Registro(models.Model):
    fecha = models.DateField(auto_now_add=True)
    procedimientos = models.ManyToManyField(Procedimiento)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    metodo_pago = models.CharField(max_length=50, choices=[
        ('Efectivo', 'Efectivo'),
        ('Tarjeta', 'Tarjeta'),
        ('Transferencia', 'Transferencia'),
    ])
    estado_pago = models.CharField(max_length=20, choices=[
        ('Completado', 'Completado'),
        ('Pendiente', 'Pendiente'),
    ])
    notas = models.TextField(blank=True)

    def __str__(self):
        return f"Registro {self.id} - {self.fecha} - ${self.total}"


# models.py
class MedicamentoFrecuente(models.Model):
    nombre = models.CharField(max_length=255)
    posologia = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.nombre


class CIE10Diagnosis(models.Model):
    codigo = models.CharField(max_length=10, unique=True)
    descripcion = models.TextField()

    def __str__(self):
        return f"{self.codigo} - {self.descripcion}"