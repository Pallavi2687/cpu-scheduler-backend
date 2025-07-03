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


std::vector<GanttBlock> hrrn_schedule(const std::vector<Process>& processes) {
    std::vector<Process> input = processes;
    std::vector<GanttBlock> result;
    int current = 0;
    while (!input.empty()) {
        auto it = std::max_element(input.begin(), input.end(), [current](const Process& a, const Process& b) {
            double ra = (double)(current - a.arrival + a.burst) / a.burst;
            double rb = (double)(current - b.arrival + b.burst) / b.burst;
            return ra < rb;
        });
        if (current < it->arrival) current = it->arrival;
        result.push_back({it->pid, current, current + it->burst});
        current += it->burst;
        input.erase(it);
    }
    return result;
}
