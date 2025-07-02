from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json, traceback
from .cpp_scheduler_runner import run_scheduler

@csrf_exempt
def schedule_view(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required"}, status=403)

    try:
        body = json.loads(request.body)
        algorithm = body.get("algorithm")
        processes = body.get("processes", [])
        quantum = body.get("quantum", 4)

        result = run_scheduler(algorithm, processes, quantum)

        if "error" in result:
            return JsonResponse(result, status=500)
       

        return JsonResponse({
            "gantt": result.get("gantt", []),
            "table": result.get("table", []),
            "averages": result.get("averages", {}),  # ✅ this is critical
            "debug": result.get("debug", {})
        })

    except Exception as e:
        return JsonResponse({
            "error": str(e),
            "trace": traceback.format_exc()
        }, status=500)
