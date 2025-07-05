from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json, traceback
from .cpp_scheduler_runner import run_scheduler
import logging
logger = logging.getLogger(__name__)

@csrf_exempt
@require_http_methods(["POST", "OPTIONS"])   # ❶ allow OPTIONS too


@csrf_exempt
@require_http_methods(["POST", "OPTIONS"])
def schedule_view(request):
    if request.method == "OPTIONS":
        return JsonResponse({}, status=200)

    try:
        logger.info(f"Request body: {request.body}")  # Log raw body
        body = json.loads(request.body)
        logger.info(f"Parsed body: {body}")  # Log parsed body
        algorithm = body.get("algorithm")
        processes = body.get("processes", [])
        quantum = body.get("quantum", 4)

        result = run_scheduler(algorithm, processes, quantum)
        if "error" in result:
            return JsonResponse(result, status=500)

        return JsonResponse({
            "gantt": result.get("gantt", []),
            "table": result.get("table", []),
            "averages": result.get("averages", {}),
            "debug": result.get("debug", {})
        })

    except json.JSONDecodeError as e:
        logger.error(f"JSON decode error: {str(e)}")
        return JsonResponse({"error": "Invalid JSON payload"}, status=400)
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        traceback.print_exc()
        return JsonResponse({"error": str(e)}, status=500)
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
