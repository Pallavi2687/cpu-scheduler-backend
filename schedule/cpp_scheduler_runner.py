import subprocess, os, traceback
from pathlib import Path
import platform

def run_scheduler(algorithm, processes, quantum=4):
    exe_name = "scheduler_exec.exe" if platform.system() == "Windows" else "scheduler_exec"
    base_dir = Path(__file__).resolve().parents[1]
    exe_path = base_dir / "cpp_engine" / exe_name   
    # -------------------------------------------------------------
    # Prepare input string for C++ executable
    # -------------------------------------------------------------
    input_lines = [f"ALGORITHM {algorithm.upper()}", str(len(processes))]
    for p in processes:
        line = f"{p['pid']} {p['arrival']} {p['burst']}"
        if algorithm.upper() == "PRIORITY" and 'priority' in p:
            line += f" {p['priority']}"
        input_lines.append(line)

    if algorithm.upper() == "RR":
        input_lines.append(str(quantum))

    input_text = "\n".join(input_lines)

    try:
        result = subprocess.run(
            [str(exe_path)],
            input=input_text,
            capture_output=True,
            text=True,
            check=True
        )

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
            pid = p['pid']
            at = p['arrival']
            bt = p['burst']
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
        return {
            "gantt": [],
            "table": [],
            "averages": {},
            "debug": {
                "exe_path": str(exe_path),
                "input": input_text,
                "raw_output": "❌ FileNotFoundError: Executable not found."
            },
            "error": f"Executable not found at {exe_path}"
        }

    except subprocess.CalledProcessError as e:
        return {
            "gantt": [],
            "table": [],
            "averages": {},
            "debug": {
                "exe_path": str(exe_path),
                "input": input_text,
                "raw_output": e.stdout + "\n" + (e.stderr or "")
            },
            "error": "Scheduler execution failed"
        }

    except Exception as e:
        return {
            "gantt": [],
            "table": [],
            "averages": {},
            "debug": {
                "exe_path": str(exe_path),
                "input": input_text,
                "raw_output": traceback.format_exc()
            },
            "error": str(e)
        }
