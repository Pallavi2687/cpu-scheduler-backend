import subprocess, os, traceback
from pathlib import Path
import platform
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def run_scheduler(algorithm, processes, quantum=4):
    exe_name = "scheduler_exec.exe" if platform.system() == "Windows" else "scheduler_exec"
    base_dir = Path(__file__).resolve().parents[1]
    cpp_engine_dir = os.getenv("CPP_ENGINE_DIR", base_dir / "cpp_engine")
    exe_path = cpp_engine_dir / exe_name
    logger.info(f"Using executable path: {exe_path}")

    # Prepare input string for C++ executable
    input_lines = [f"ALGORITHM {algorithm.upper()}", str(len(processes))]
    for p in processes:
        line = f"{p.get('id', p.get('pid'))} {p.get('arrival_time', p.get('arrival'))} {p.get('burst_time', p.get('burst'))}"
        if algorithm.upper() == "PRIORITY" and 'priority' in p:
            line += f" {p['priority']}"
        input_lines.append(line)

    if algorithm.upper() == "RR":
        input_lines.append(str(quantum))

    input_text = "\n".join(input_lines)
    logger.info(f"Input to executable: {input_text}")

    try:
        result = subprocess.run(
            [str(exe_path)],
            input=input_text,
            capture_output=True,
            text=True,
            check=True
        )
        logger.info(f"Executable output: {result.stdout}")
        output_lines = result.stdout.strip().splitlines()

        # Parse Gantt chart
        gantt = []
        for line in output_lines:
            if line.startswith("PID"):
                parts = line.replace("PID ", "").split(":")
                pid = int(parts[0].strip())
                start, end = map(int, parts[1].strip().split("->"))
                gantt.append({"pid": pid, "start": start, "end": end})

        # Completion Time logic
        completion = {}
        for entry in gantt:
            pid = entry['pid']
            completion[pid] = max(completion.get(pid, 0), entry['end'])

        # Final table
        table = []
        for p in processes:
            pid = p.get('id', p.get('pid'))
            at = p.get('arrival_time', p.get('arrival'))
            bt = p.get('burst_time', p.get('burst'))
            ct = completion.get(pid, at + bt)
            tat = ct - at
            wt = tat - bt
            table.append({
                "pid": pid,
                "arrival": at,
                "burst": bt,
                "completion": ct,
                "turnaround": tat,
                "waiting": wt
            })

        n = len(table)
        avg_ct = sum(p["completion"] for p in table) / n if n else 0
        avg_tat = sum(p["turnaround"] for p in table) / n if n else 0
        avg_wt = sum(p["waiting"] for p in table) / n if n else 0

        return {
            "gantt": gantt,
            "table": table,
            "averages": {
                "completion": round(avg_ct, 2),
                "turnaround": round(avg_tat, 2),
                "waiting": round(avg_wt, 2)
            },
            "debug": {
                "exe_path": str(exe_path),
                "input": input_text,
                "raw_output": result.stdout
            }
        }

    except FileNotFoundError:
        error_msg = f"Executable not found at {exe_path}"
        logger.error(error_msg)
        return {
            "gantt": [],
            "table": [],
            "averages": {},
            "debug": {
                "exe_path": str(exe_path),
                "input": input_text,
                "raw_output": "❌ FileNotFoundError: Executable not found."
            },
            "error": error_msg
        }

    except subprocess.CalledProcessError as e:
        error_msg = "Scheduler execution failed"
        logger.error(f"{error_msg}: {e.stderr or e.stdout}")
        return {
            "gantt": [],
            "table": [],
            "averages": {},
            "debug": {
                "exe_path": str(exe_path),
                "input": input_text,
                "raw_output": e.stdout + "\n" + (e.stderr or "")
            },
            "error": error_msg
        }

    except Exception as e:
        error_msg = str(e)
        logger.error(f"Unexpected error: {error_msg}", exc_info=True)
        return {
            "gantt": [],
            "table": [],
            "averages": {},
            "debug": {
                "exe_path": str(exe_path),
                "input": input_text,
                "raw_output": traceback.format_exc()
            },
            "error": error_msg
        }