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

std::vector<GanttBlock> fcfs_schedule(const std::vector<Process>& processes) {
    std::vector<Process> sorted = processes;
    std::sort(sorted.begin(), sorted.end(), [](const Process& a, const Process& b) {
        return a.arrival < b.arrival;
    });
    std::vector<GanttBlock> result;
    int current = 0;
    for (const auto& p : sorted) {
        if (current < p.arrival) current = p.arrival;
        result.push_back({p.pid, current, current + p.burst});
        current += p.burst;
    }
    return result;
}