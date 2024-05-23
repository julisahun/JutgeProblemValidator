#include <iostream>
// #include <vector>
using namespace std;

int power(int a, int b) {
  if (b == 0) return 1;
  return a * power(a, b-1);
}


int main () {
	
	int n,p;
	while (cin >> n >> p) {
		cout << power(n, p) << endl;
	}
}