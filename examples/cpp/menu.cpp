#include <iostream>
#include <sstream>
#include <string>

int main() {
    std::string line;
    while (true) {
        std::cout << "1. Continue\n0. Exit\nChoice: ";
        if (!std::getline(std::cin, line)) {
            if (std::cin.eof()) return 0;
            std::cerr << "Input read failed\n";
            return 1;
        }
        std::istringstream input(line);
        int choice{};
        char extra{};
        if (!(input >> choice) || (input >> extra)) {
            std::cout << "Enter one integer only.\n";
            continue;
        }
        if (choice == 0) return 0;
        if (choice == 1) std::cout << "Continuing\n";
        else std::cout << "Unknown choice\n";
    }
}
