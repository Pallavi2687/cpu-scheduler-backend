from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json, traceback
from .cpp_scheduler_runner import run_scheduler


@csrf_exempt
@require_http_methods(["POST", "OPTIONS"])   # ❶ allow OPTIONS too
def schedule_view(request):
    if request.method == "OPTIONS":          # ❷ short‑circuit pre‑flight
        # Empty 200 response is enough; CORS headers are added by middleware
        return JsonResponse({}, status=200)

    # ---- real POST processing ----
    try:
        body = json.loads(request.body)
        algorithm = body.get("algorithm")
        processes = body.get("processes", [])
        quantum = body.get("quantum", 4)

        result = run_scheduler(algorithm, processes, quantum)
        if "error" in result:
            return JsonResponse(result, status=500)

        return JsonResponse({
            "gantt":     result.get("gantt", []),
            "table":     result.get("table", []),
            "averages":  result.get("averages", {}),
            "debug":     result.get("debug", {})
        })

    except Exception as e:
        traceback.print_exc()
        return JsonResponse({"error": str(e)}, status=500)
