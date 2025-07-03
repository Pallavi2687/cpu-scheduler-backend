#include <iostream>
#include <vector>
#include <string>

// Struct Definitions
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

// Function Declarations
std::vector<GanttBlock> fcfs_schedule(const std::vector<Process>& processes);
std::vector<GanttBlock> sjf_schedule(const std::vector<Process>& processes);
std::vector<GanttBlock> priority_schedule(const std::vector<Process>& processes);
std::vector<GanttBlock> rr_schedule(const std::vector<Process>& processes, int quantum);
std::vector<GanttBlock> srtf_schedule(const std::vector<Process>& processes);
std::vector<GanttBlock> ljf_schedule(const std::vector<Process>& processes);
std::vector<GanttBlock> hrrn_schedule(const std::vector<Process>& processes);
std::vector<GanttBlock> lrtf_schedule(const std::vector<Process>& processes);

int main() {
    std::string algo;
    std::cin >> algo; // ALGORITHM <name>
    std::cin >> algo; // actual algorithm name

    int n;
    std::cin >> n;
    std::vector<Process> processes;
    int quantum = 4;

    for (int i = 0; i < n; ++i) {
        int pid, arrival, burst, priority = 0;
        if (algo == "PRIORITY") {
            std::cin >> pid >> arrival >> burst >> priority;
        } else {
            std::cin >> pid >> arrival >> burst;
        }
        processes.push_back({pid, arrival, burst, priority});
    }

    if (algo == "RR") std::cin >> quantum;

    std::vector<GanttBlock> result;
    if (algo == "FCFS") result = fcfs_schedule(processes);
    else if (algo == "SJF") result = sjf_schedule(processes);
    else if (algo == "PRIORITY") result = priority_schedule(processes);
    else if (algo == "RR") result = rr_schedule(processes, quantum);
    else if (algo == "SRTF") result = srtf_schedule(processes);
    else if (algo == "LJF") result = ljf_schedule(processes);
    else if (algo == "HRRN") result = hrrn_schedule(processes);
    else if (algo == "LRTF") result = lrtf_schedule(processes);
    else {
        std::cerr << "Unsupported algorithm: " << algo << "\n";
        return 1;
    }

    for (const auto& b : result) {
        std::cout << "PID " << b.pid << ": " << b.start << " -> " << b.end << "\n";
    }

    return 0;
}
