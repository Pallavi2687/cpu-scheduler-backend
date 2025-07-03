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


std::vector<GanttBlock> lrtf_schedule(const std::vector<Process>& processes) {
    std::vector<GanttBlock> result;
    int n = processes.size();
    std::vector<Process> remaining = processes;
    std::vector<bool> completed(n, false);

    int current = 0;
    while (true) {
        int maxBurst = -1, index = -1;
        for (int i = 0; i < n; ++i) {
            if (!completed[i] && remaining[i].arrival <= current && remaining[i].burst > maxBurst) {
                maxBurst = remaining[i].burst;
                index = i;
            }
        }
        if (index == -1) {
            bool allDone = true;
            for (bool done : completed) if (!done) allDone = false;
            if (allDone) break;
            ++current;
            continue;
        }
        int start = current;
        result.push_back({remaining[index].pid, start, start + 1});
        --remaining[index].burst;
        ++current;
        if (remaining[index].burst == 0) completed[index] = true;
    }
    return result;
}