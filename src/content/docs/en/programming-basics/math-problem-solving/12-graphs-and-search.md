---
title: "Draw relationships and search for a path"
description: "Draw relationships and search for a path"
sidebar:
  order: 14
prev: {"link":"/en/programming-basics/math-problem-solving/11-counting-probability/","label":"Sequences, counting, and probability"}
next: false
---

A **graph** has vertices for things and edges for relationships. Every edge here is undirected and costs one step. F is isolated:

```text
    B ── D
   /     │
  A      │     F
   \     │
    C ── E
```

Edges are A–B, A–C, B–D, C–E, D–E. A **queue** removes the earliest inserted item. Start with A and mark vertices when enqueuing them so they cannot be queued repeatedly.

| Removed vertex | Queue after adding undiscovered neighbors |
|---|---|
| Start | A |
| A | B, C |
| B | C, D |
| C | D, E |
| D | E |
| E | empty |

E was discovered through C: A→C→E takes two edges. **Try:** from B, a shortest path is B→D→E. F remains unreachable. Next name this BFS and measure its work.


## Trace a graph with a queue

A vertex represents a place and an edge connects places. Use an undirected graph with unit-cost edges: A connects to B,C; B to D; C to E; D to E. F is isolated.

Breadth-first search (BFS) visits levels. A queue removes the earliest inserted element first. Start with [A], remove A and add B,C; remove B and add D; remove C and add E. A shortest path from A to E is A→C→E with two edges. Mark vertices discovered when enqueuing to avoid repeated insertion around cycles. Record parent[E]=C and parent[C]=A to reconstruct the path backward.

F is unreachable. BFS minimizes edge count, not general weighted cost. With V vertices, E edges, and adjacency lists, time is O(V+E) and extra memory O(V). This graph is not a tree: A→B→D→E→C→A is a cycle, and F disconnects it. A simple undirected tree is connected, has no cycles, and has V−1 edges.


A graph contains vertices and edges. Edges may be directed or weighted. Paths connect vertices, cycles revisit a vertex, and a tree is connected and acyclic. Graphs model networks, routes, dependencies, and social relationships.


In the graph example below, V counts vertices and E counts edges. **O(V+E)** describes work growing with their sum, assuming an adjacency list stores each vertex's neighbors. **O(V)** additional space grows with the number of vertices. These expressions describe growth, not seconds. See [comparing solutions](/en/programming-basics/08-problem-solving-algorithms/).
