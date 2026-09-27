#include <algorithm>
#include <fstream>
#include <iostream>
#include <stdexcept>
#include <vector>

void savePassingScores(const std::vector<int>& scores) {
    std::ofstream file("passing-scores.txt");
    if (!file) throw std::runtime_error("Cannot open output");
    for (int score : scores) {
        if (score < 0 || score > 100) throw std::invalid_argument("Invalid score");
        if (score >= 50) file << score << '\n';
    }
    file.flush();
    if (!file) throw std::runtime_error("Write failed");
    file.close();
    if (!file) throw std::runtime_error("Close failed");
}
int main() {
    std::vector<int> scores{75, 42, 91, 60};
    std::sort(scores.begin(), scores.end());
    const auto passed = std::count_if(scores.begin(), scores.end(),
        [](int score) { return score >= 50; });
    try {
        savePassingScores(scores);
        std::cout << "passed=" << passed << '\n';
    } catch (const std::exception& error) {
        std::cerr << error.what() << '\n';
        return 1;
    }
}
