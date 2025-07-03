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


std::vector<GanttBlock> priority_schedule(const std::vector<Process>& processes) {
    std::vector<Process> input = processes;
    std::vector<GanttBlock> result;
    int current = 0;
    while (!input.empty()) {
        auto it = std::min_element(input.begin(), input.end(), [current](const Process& a, const Process& b) {
            if (a.arrival > current && b.arrival > current) return a.arrival < b.arrival;
            if (a.arrival > current) return false;
            if (b.arrival > current) return true;
            return a.priority < b.priority;
        });
        if (current < it->arrival) current = it->arrival;
        result.push_back({it->pid, current, current + it->burst});
        current += it->burst;
        input.erase(it);
    }
    return result;
}