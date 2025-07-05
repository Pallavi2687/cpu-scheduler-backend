#include <iostream>
#include <string>

int main() {
    std::string line;
    while (std::getline(std::cin, line)) {
        if (line.find("ALGORITHM") == 0) continue; // Skip algorithm line
        if (line.find_first_not_of("0123456789") == std::string::npos) {
            int pid, arrival, burst;
            std::cin >> pid >> arrival >> burst;
            std::cout << "PID " << pid << ": " << arrival << "->" << (arrival + burst) << std::endl;
        }
    }
    return 0;
}