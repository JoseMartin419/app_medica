import json
from django.core.management.base import BaseCommand
from pacientes.models import CIE10Diagnosis

class Command(BaseCommand):
    help = 'Importa diagnósticos CIE10 desde un archivo JSON'

    def add_arguments(self, parser):
        parser.add_argument('archivo_json', type=str, help='Ruta del archivo JSON')

    def handle(self, *args, **kwargs):
        ruta = kwargs['archivo_json']
        with open(ruta, 'r', encoding='utf-8') as archivo:
            datos = json.load(archivo)

            total = 0
            for entrada in datos:
                codigo = entrada.get('c')
                descripcion = entrada.get('d')

                if codigo and descripcion:
                    CIE10Diagnosis.objects.update_or_create(
                        codigo=codigo,
                        defaults={'descripcion': descripcion}
                    )
                    total += 1

            self.stdout.write(self.style.SUCCESS(f'{total} diagnósticos importados o actualizados.'))
