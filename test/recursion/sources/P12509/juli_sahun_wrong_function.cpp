#include <iostream>
using namespace std;

int function(int n) {
	
	if (n == 0) return 1;
	else return n * function(n-1);
	
}


int main()  {

	int x;
	while (cin >> x) {
		
		cout << function(x) << endl;

	}
}