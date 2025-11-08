---
title: "Space and Time Computational Cost"
order: 2
draft: false
lastUpdateDate: "2025-09-25"
subject: "Algoritmi e strutture dati"
category: "Informatica"
difficulty: "complesso"
tags: ["programmazione", "costo computazionale", "costo spaziale", "costo temporale", "algoritmi", "strutture dati"]
author: "Dennis Turco"
videoLesson: false
---

## 1. Space Computational Cost

### 1.1 Simple operations

To analyze the space computational cost of this code, consider the following:

```text
for i = i : 3
    for j = j : 3
        1 + 1
        2 + 2
        % etc...
        26 + 26;
        27 + 27;
     end
end
```

1. **Space used by variables**:
    - The variable $i$ and the variable $j$ are both integer variables used for loops. Their space is negligible compared to the rest of the operations.
2. **Space used by operations inside the loop**:
    - The operations $1+1, 2+2, ..., 26+26, 27+27$ are simple arithmetic operations that do not consume significant memory beyond what is required to execute the operation and store the temporary result.

        ```text
        1+1
        2+2
        26+26
        27+27
        ```

    - There are no accumulation variables or data structures that grow with the number of iterations.

3. **Number of iterations**:
    - The outer loop (on i) iterates from 1 to 3, so it has 3 iterations.
    - The inner loop (on j) iterates from 1 to 3, so it has 3 iterations for each iteration of the outer loop.

- Therefore, in total there are $3 \times 3 = 9$ iterations
However, since each arithmetic operation is executed and the result is not stored in a persistent variable, the total space used is constant.
- The space computational cost of the code is $O(1)$. Even though the number of iterations is 9, the memory usage does not grow with the number of iterations, since no data structures or additional variables are allocated that depend on the number of iterations.

### 1.2 Complex operations

To evaluate the impact of more complex operations on space cost, we can consider the following scenarios:

1. **Simple arithmetic operations**:
   - If the operations are still simple and the result is not stored in persistent variables, the space cost remains $O(1)$. Even if the operations took more time, they would not significantly affect the memory used.

2. **Operations that create new objects**:
   - If the operations inside the loop generate new objects or data that are stored in a data structure (such as an array or a list), then the space cost depends on the amount of memory needed to store these objects.
   - For example, if each iteration creates and stores a new object, the total memory used would increase with the number of iterations.

- Suppose we have more complex operations like creating and storing strings or arrays:

    ```text
    for i = 1 : 3
        for j = 1 : 3
            A = create_large_object();
        end
    end
    ```

    In this case, if `create_large_object()` creates and stores a significant-sized object in a data structure, then the space cost becomes proportional to the number of objects created.

- If each `create_large_object()` call creates and stores an object requiring $O(k)$ space, where $k$ is the size of the object, and there are $3 \times 3 = 9$ iterations in total, then the total memory used would be $9 \times O(k)$.
- In this case, the total space cost would be $O(n \cdot k)$, where $n$ is the number of iterations (9 in this example) and $k$ is the space needed for each object.

## 2. Time Computational Cost

To evaluate the time computational cost of the given code, we need to consider both the number of iterations and the complexity of the operations inside the loops. Here’s the step-by-step analysis:

```text
for i = 1 : 3
    for j = 1 : 3
        % Multiple operations
    end
end
```

1. **Number of iterations**
    - The outer loop for i = 1 : 3 has 3 iterations.
    - The inner loop for j = 1 : 3 has 3 iterations for each iteration of the outer loop.

    In total, the number of iterations is $3 \times 3 = 9$.

2. **Operations inside the loops**

    Suppose each inner loop contains $k$ operations. The time complexity of the operations inside the loop will depend on:

    - *Type of operations*: If the operations are simple (e.g., additions, subtractions), each has a complexity of $O(1)$.
    - *Number of operations*: If there are $k$ operations in each iteration of the inner loop, the time complexity for each inner loop iteration will be $O(k)$.

3. **Total complexity**

    The total time complexity of the code is given by the sum of the complexities of all iterations. Since we have 9 iterations in total, and each iteration executes $k$ operations of complexity $O(1)$, the total time complexity will be:

    $O(\text{number of iterations} \times \text{complexity per iteration}) = O(9 \times k) = O(k)$

4. **Conclusion**

    The time computational cost of the code, considering that the operations inside the loop are simple arithmetic operations, is $O(k)$, where $k$ is the number of operations executed in each inner loop iteration.

    If $k$ is a constant number, we can further simplify the complexity to $O(1)$. However, if $k$ grows with the number of iterations or depends on other variables, the time computational cost will be $O(n \times k)$, where $n$ is the total number of iterations (in this case, 9).
