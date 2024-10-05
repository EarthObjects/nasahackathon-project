# asteroids/views.py
import requests
from django.http import JsonResponse
from django.views import View
from django.conf import settings

class AsteroidFeedView(View):
    def get(self, request):
        # Set your API key here
        api_key = 'AMvTGeTbBACkgqeav4K83Lw9lAVjwUFy6TpRLn1T'  # Replace with your actual API key if you have one
        start_date = request.GET.get('start_date', '2015-09-07')  # Default start date
        end_date = request.GET.get('end_date', '2015-09-08')      # Default end date

        url = f'https://api.nasa.gov/neo/rest/v1/feed?start_date={start_date}&end_date={end_date}&api_key={api_key}'

        response = requests.get(url)

        if response.status_code == 200:
            return JsonResponse(response.json(), safe=False)
        else:
            return JsonResponse({'error': 'Failed to retrieve data'}, status=response.status_code)
