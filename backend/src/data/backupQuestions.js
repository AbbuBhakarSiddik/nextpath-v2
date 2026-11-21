// backend/src/data/backupQuestions.js
// Curated high-engagement questions bank.
// Used as instant fallback when Gemini API hits 429 rate limit or under heavy 100+ student load.

export const BACKUP_QUESTIONS = {
  logical: {
    easy: [
      {
        question: "A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost?",
        options: ["$0.10", "$0.05", "$0.01", "$0.15"],
        correct_index: 1,
        explanation: "If Ball = X, Bat = X + $1.00. Total = 2X + $1.00 = $1.10. Solving for X gives 2X = $0.10, so X = $0.05.",
      },
      {
        question: "If all Zips are Zaps, and some Zaps are Zops, which statement is DEFINITELY true?",
        options: [
          "All Zips are Zops",
          "Some Zips are definitely Zops",
          "Some Zaps are Zips",
          "No Zips are Zops"
        ],
        correct_index: 2,
        explanation: "Since all Zips are Zaps, any existing Zip is also a Zap, which guarantees that at least some Zaps are Zips.",
      },
      {
        question: "Find the next number in the sequence: 2, 6, 12, 20, 30, ?",
        options: ["40", "42", "44", "48"],
        correct_index: 1,
        explanation: "The differences between consecutive numbers increase by 2: +4, +6, +8, +10. Next is +12, so 30 + 12 = 42 (also n*(n+1): 1*2, 2*3, 3*4, 4*5, 5*6, 6*7=42).",
      },
    ],
    medium: [
      {
        question: "You have 3 boxes: one with only Apples, one with only Oranges, and one with Both. All 3 are labeled INCORRECTLY. You pick ONE fruit from ONE box without looking inside. Which box must you pick from to label all boxes correctly?",
        options: [
          "The box labeled 'Apples'",
          "The box labeled 'Oranges'",
          "The box labeled 'Apples & Oranges'",
          "It is mathematically impossible in one pick"
        ],
        correct_index: 2,
        explanation: "Since all labels are false, the box labeled 'Apples & Oranges' CANNOT contain both. If you draw an apple, it is 100% the Apples box. The remaining boxes then deduce immediately.",
      },
      {
        question: "Three light switches outside a closed room control three incandescent bulbs inside. You may only enter the room ONCE. How do you identify which switch controls which bulb?",
        options: [
          "Turn on Switch 1, wait 5 min, turn it off, turn on Switch 2, enter",
          "Turn on Switches 1 and 2 together, enter room immediately",
          "Turn all 3 switches on, then off sequentially",
          "It cannot be done without a window or second person"
        ],
        correct_index: 0,
        explanation: "Switch 2 bulb will be ON. Switch 1 bulb will be OFF but WARM to the touch. Switch 3 bulb will be OFF and COLD.",
      },
      {
        question: "In a knockout tournament with 64 players, how many total matches must be played to determine the single champion?",
        options: ["32", "63", "64", "128"],
        correct_index: 1,
        explanation: "Each match eliminates exactly 1 player. To eliminate 63 players out of 64, exactly 63 matches must be played.",
      },
    ],
    hard: [
      {
        question: "You are on a game show with 3 closed doors. Behind one is a luxury sports car, behind the other two are goats. You pick Door 1. The host (who knows what is behind every door) opens Door 3, revealing a goat, and asks: 'Do you want to switch to Door 2?' What is your best strategy?",
        options: [
          "Stay with Door 1 (probability is 50/50)",
          "Switch to Door 2 (probability jumps to 2/3)",
          "It makes no difference; both are 1/3",
          "Switch only if you chose randomly"
        ],
        correct_index: 1,
        explanation: "This is the classic Monty Hall problem. Initial probability of Door 1 was 1/3. The remaining 2/3 probability is concentrated entirely into Door 2 after the host reveals a goat.",
      },
      {
        question: "There are 100 prisoners numbered 1 to 100. In a room are 100 drawers containing random numbers 1 to 100. Each prisoner enters alone and opens at most 50 drawers to find their own number. If EVERY prisoner finds their number, all are freed; if one fails, all are executed. Using the cycle-following strategy, what is their collective survival probability?",
        options: ["Close to 0% (1/2^100)", "Approximately 31.18%", "Exactly 50%", "Approximately 12.5%"],
        correct_index: 1,
        explanation: "By following the permutation cycles starting at the drawer with their own number, the prisoners succeed whenever the longest permutation cycle is <= 50, which occurs with probability 1 - ln(2) ≈ 31.18%.",
      },
    ],
    expert: [
      {
        question: "Two mathematicians, P and S, know that two integers x and y satisfy 1 < x < y and x + y <= 100. P is told the product x*y, and S is told the sum x+y. \nS says: 'I knew you didn't know.'\nP says: 'Now I know.'\nS says: 'Now I also know.'\nWhat are the two numbers x and y?",
        options: ["x = 4, y = 13", "x = 3, y = 7", "x = 2, y = 9", "x = 5, y = 11"],
        correct_index: 0,
        explanation: "This is the Freudenthal (Impossible) Puzzle. The unique solution under these constraints is x = 4 and y = 13 (sum = 17, product = 52).",
      },
    ],
  },
  dsa: {
    easy: [
      {
        question: "What is the worst-case time complexity of searching for an element in a balanced Binary Search Tree (AVL or Red-Black Tree) with N nodes?",
        options: ["O(1)", "O(log N)", "O(N)", "O(N log N)"],
        correct_index: 1,
        explanation: "Because the tree guarantees balance (height difference <= 1 or logarithmic height factor), the maximum depth is O(log N).",
      },
      {
        question: "Which data structure follows the First In, First Out (FIFO) principle?",
        options: ["Stack", "Queue", "Max Heap", "Binary Tree"],
        correct_index: 1,
        explanation: "A Queue processes elements in the order they arrive (FIFO), whereas a Stack uses Last In, First Out (LIFO).",
      },
      {
        question: "What is the average time complexity of inserting a key into a Hash Table with a good hash function?",
        options: ["O(1)", "O(log N)", "O(N)", "O(N^2)"],
        correct_index: 0,
        explanation: "With uniform hashing and low load factor, average hash table lookups and insertions operate in O(1) constant time.",
      },
    ],
    medium: [
      {
        question: "You want to find the middle element of a singly linked list in a SINGLE pass without knowing its length. What is the optimal algorithm?",
        options: [
          "Fast and Slow pointers (Tortoise and Hare)",
          "Reverse the linked list then traverse half",
          "Convert linked list to an array",
          "Recursively calculate depth then backtrack"
        ],
        correct_index: 0,
        explanation: "Advance the fast pointer by 2 steps and slow pointer by 1 step. When the fast pointer reaches the end, the slow pointer sits exactly at the middle node in O(N) time and O(1) space.",
      },
      {
        question: "What is the worst-case time complexity of QuickSort when using the first element as the pivot on an already sorted array?",
        options: ["O(N log N)", "O(N)", "O(N^2)", "O(log N)"],
        correct_index: 2,
        explanation: "If the pivot is always the smallest/largest element, the partition splits the array into sizes 0 and N-1 at every step, creating an O(N^2) recursive depth.",
      },
      {
        question: "Which of the following graph algorithms CANNOT handle negative weight edges even if there are no negative cycles?",
        options: ["Bellman-Ford", "Floyd-Warshall", "Dijkstra's Algorithm", "Johnson's Algorithm"],
        correct_index: 2,
        explanation: "Dijkstra relies on a greedy property assuming adding an edge never decreases path cost. Negative edges break this invariant.",
      },
    ],
    hard: [
      {
        question: "Given an array of N integers, which algorithm finds the longest contiguous subarray with maximum sum in O(N) time and O(1) extra space?",
        options: ["Kadane's Algorithm", "Boyer-Moore Voting", "Floyd's Cycle Algorithm", "Tarjan's SCC"],
        correct_index: 0,
        explanation: "Kadane's Algorithm maintains current_sum = max(x, current_sum + x) and updates max_so_far in a single linear pass.",
      },
      {
        question: "What data structure can find the Range Minimum Query (RMQ) of an immutable array in O(1) time after O(N log N) preprocessing?",
        options: ["Segment Tree", "Sparse Table", "Fenwick Tree (Binary Indexed Tree)", "Treap"],
        correct_index: 1,
        explanation: "Sparse Table precomputes intervals of length 2^k and computes idempotent operations (like min/max/gcd) in O(1) by overlapping two power-of-two ranges.",
      },
    ],
    expert: [
      {
        question: "What is the amortized time complexity of the 'Decrease Key' operation in a Fibonacci Heap?",
        options: ["O(log N)", "O(1)", "O(N)", "O(log log N)"],
        correct_index: 1,
        explanation: "Fibonacci Heaps achieve O(1) amortized Decrease Key using cascading cuts, which is why Dijkstra's algorithm achieves O(E + V log V) with it.",
      },
    ],
  },
  error: {
    easy: [
      {
        question: "What will `console.log(typeof null)` output in modern JavaScript?",
        options: ["'null'", "'undefined'", "'object'", "'boolean'"],
        correct_index: 2,
        explanation: "This is a well-known historical bug in JavaScript from its first implementation in 1995 where object type tags designated 0 as an object, and null was represented as the NULL pointer (0x00).",
      },
      {
        question: "In Python, what is the output of `bool([]) == bool([0])`?",
        options: ["True", "False", "TypeError", "None"],
        correct_index: 1,
        explanation: "`bool([])` evaluates to False because the list is empty. `bool([0])` evaluates to True because the list contains one element (even though that element is 0). Hence False != True.",
      },
      {
        question: "In JavaScript, what does `[1, 2, 10, 21].sort()` return by default?",
        options: [
          "[1, 2, 10, 21]",
          "[1, 10, 2, 21]",
          "[21, 10, 2, 1]",
          "[10, 1, 21, 2]"
        ],
        correct_index: 1,
        explanation: "Array.prototype.sort() converts elements to strings and compares UTF-16 code units by default, so '10' comes before '2'.",
      },
    ],
    medium: [
      {
        question: "Consider this JavaScript loop:\nfor (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 10);\n}\nWhat will be printed?",
        options: ["0 1 2", "3 3 3", "0 0 0", "undefined undefined undefined"],
        correct_index: 1,
        explanation: "Because `var` is function-scoped (not block-scoped), all three timeout callbacks close over the same single `i` variable, which equals 3 by the time the event loop runs them.",
      },
      {
        question: "In Python:\ndef append_to(item, target=[]):\n    target.append(item)\n    return target\nprint(append_to(1))\nprint(append_to(2))\nWhat does the second call print?",
        options: ["[2]", "[1, 2]", "None", "Error: mutable default argument"],
        correct_index: 1,
        explanation: "Default arguments in Python are evaluated once when the function is defined, not each time it is called. The list `target` persists across invocations.",
      },
      {
        question: "In JavaScript, what does `0.1 + 0.2 === 0.3` evaluate to?",
        options: ["true", "false", "NaN", "TypeError"],
        correct_index: 1,
        explanation: "Due to IEEE 754 floating-point binary representation, 0.1 + 0.2 equals 0.30000000000000004, which is not strictly equal to 0.3.",
      },
    ],
    hard: [
      {
        question: "In SQL, what is the result of `SELECT * FROM users WHERE status != 'active'` when a user row has `status = NULL`?",
        options: [
          "The row is returned",
          "The row is NOT returned",
          "An error is thrown",
          "The row is returned only if COALESCE is enabled"
        ],
        correct_index: 1,
        explanation: "In SQL three-valued logic, comparisons with NULL (such as `NULL != 'active'`) evaluate to UNKNOWN, not TRUE. The WHERE clause only accepts TRUE conditions.",
      },
      {
        question: "In Java:\nInteger a = 127, b = 127;\nInteger c = 128, d = 128;\nSystem.out.println((a == b) + \" \" + (c == d));\nWhat is printed?",
        options: ["true true", "true false", "false false", "false true"],
        correct_index: 1,
        explanation: "Java caches Integer objects in the range -128 to 127 via IntegerCache. For values beyond 127, a new object reference is instantiated, so reference equality `==` fails.",
      },
    ],
    expert: [
      {
        question: "In C++, what causes undefined behavior in:\nstd::string s = \"hello\";\nconst char* p = (s + \" world\").c_str();\nstd::cout << p;\n?",
        options: [
          "Dangling pointer to a destroyed temporary std::string",
          "Null pointer dereference",
          "Memory leak in operator+",
          "Stack overflow"
        ],
        correct_index: 0,
        explanation: "The expression `(s + \" world\")` produces a temporary object that is destroyed at the end of the full statement. `p` is left holding a pointer to deallocated memory.",
      },
    ],
  },
};

export function getRandomBackupQuestion(category = "logical", difficulty = "medium") {
  const catPool = BACKUP_QUESTIONS[category] || BACKUP_QUESTIONS.logical;
  const diffPool = catPool[difficulty] || catPool.medium || catPool.easy;
  const randomIndex = Math.floor(Math.random() * diffPool.length);
  return {
    ...diffPool[randomIndex],
    category,
    difficulty,
    from: "backup_cache",
  };
}
