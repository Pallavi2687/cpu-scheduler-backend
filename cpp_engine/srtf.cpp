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


std::vector<GanttBlock> srtf_schedule(const std::vector<Process>& processes) {
    std::vector<GanttBlock> result;
    auto cmp = [](Process a, Process b) { return a.burst > b.burst; };
    std::priority_queue<Process, std::vector<Process>, decltype(cmp)> pq(cmp);

    int current = 0;
    int i = 0;
    auto proc = processes;

    while (i < proc.size() || !pq.empty()) {
        while (i < proc.size() && proc[i].arrival <= current) {
            pq.push(proc[i++]);
        }
        if (pq.empty()) {
            current = proc[i].arrival;
            continue;
        }
        Process p = pq.top(); pq.pop();
        int nextArrival = (i < proc.size()) ? proc[i].arrival : INT_MAX;
        int duration = std::min(p.burst, nextArrival - current);
        result.push_back({p.pid, current, current + duration});
        current += duration;
        p.burst -= duration;
        if (p.burst > 0) pq.push(p);
    }
    return result;
}