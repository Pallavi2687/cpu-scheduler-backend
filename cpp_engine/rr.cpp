#include <vector>
#include <queue>
#include <map>
#include <string>
#include <algorithm>
#include <climits>

struct Process {
    int pid;
    int arrival;
    int burst;
    int priority;
};

struct GanttBlock {
    int pid;
    int start;
    int end;
};


std::vector<GanttBlock> rr_schedule(const std::vector<Process>& processes, int quantum) {
    std::vector<GanttBlock> result;
    std::queue<Process> q;
    std::map<int, int> remaining;
    int current = 0;
    size_t index = 0;

    while (index < processes.size() || !q.empty()) {
        while (index < processes.size() && processes[index].arrival <= current) {
            q.push(processes[index]);
            remaining[processes[index].pid] = processes[index].burst;
            index++;
        }
        if (q.empty()) {
            current = processes[index].arrival;
            continue;
        }
        Process p = q.front(); q.pop();
        int exec = std::min(quantum, remaining[p.pid]);
        result.push_back({p.pid, current, current + exec});
        current += exec;
        remaining[p.pid] -= exec;
        if (remaining[p.pid] > 0) {
            while (index < processes.size() && processes[index].arrival <= current) {
                q.push(processes[index]);
                remaining[processes[index].pid] = processes[index].burst;
                index++;
            }
            q.push(p);
        }
    }
    return result;
}