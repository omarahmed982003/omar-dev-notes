#include <iostream>
#include <stdexcept>
#include <vector>

double average(const std::vector<int>& scores) {
    if (scores.empty()) throw std::invalid_argument("No scores");
    double total = 0;
    for (int score : scores) {
        if (score < 0 || score > 100) throw std::invalid_argument("Score outside 0..100");
        total += score;
    }
    return total / static_cast<double>(scores.size());
}
int main() {
    const std::vector<int> scores{75, 90, 60};
    std::cout << average(scores) << '\n';
    try { std::cout << average({}) << '\n'; }
    catch (const std::invalid_argument& error) { std::cout << error.what() << '\n'; }
}
