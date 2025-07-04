import subprocess, os, traceback

def run_scheduler(algorithm, processes, quantum=4):
    exe_path = os.path.abspath(
        os.path.join(os.path.dirname(__file__), '../cpp_engine/scheduler_exec')
    )

    # Prepare input
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
            [exe_path],
            input=input_text,
            capture_output=True,
            text=True,
            check=True
        )

        output_lines = result.stdout.strip().splitlines()

        # Parse Gantt chart from C++ output
        gantt = []
        for line in output_lines:
            if line.startswith("PID"):
                parts = line.replace("PID ", "").split(":")
                pid = int(parts[0].strip())
                start, end = map(int, parts[1].strip().split("->"))
                gantt.append({"pid": pid, "start": start, "end": end})

        # Compute Completion Times (handle preemptive algorithms)
        completion = {}
        for entry in gantt:
            pid = entry['pid']
            completion[pid] = max(completion.get(pid, 0), entry['end'])

        # Calculate CT, TAT, WT for each process
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

        # Calculate averages
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
                "exe_path": exe_path,
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
                "exe_path": exe_path,
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
                "exe_path": exe_path,
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
                "exe_path": exe_path,
                "input": input_text,
                "raw_output": traceback.format_exc()
            },
            "error": str(e)
        }
