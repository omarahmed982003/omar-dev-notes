---
title: "Draw relationships and search for a path"
description: "Draw relationships and search for a path"
sidebar:
  order: 14
prev: {"link":"/en/programming-basics/math-problem-solving/11-counting-probability/","label":"Sequences, counting, and probability"}
next: {"link":"/en/programming-basics/math-problem-solving/","label":"Math and problem solving"}
---

<span class="foundations-reading-scope" aria-hidden="true"></span>

A **graph** models things and connections: a **vertex** represents a thing and an **edge** a connection. Find a path from A to E with the fewest edges. Lists and queues are introduced in [data organization](/en/programming-basics/08-problem-solving-algorithms/); this trace can be followed on paper.

## Specify the graph

Every edge is bidirectional and costs one step. Edges are A–B, A–C, B–D, C–E, D–E; F is isolated.

~~~text
    B ── D
   /     │
  A      │     F
   \     │
    C ── E
~~~

A **path** follows a sequence of edges. A **cycle** returns to a previous vertex; A→B→D→E→C→A is a cycle.

A **queue** removes the earliest inserted vertex. Add neighbors in the written order and mark them discovered on insertion to avoid repeated insertion around cycles.

## Breadth-first search visits nearer levels first

**Breadth-first search (BFS)** visits levels. Begin with[A]. Removing a vertex means examining its neighbors, not deleting it from the graph.

| Removed vertex | Queue after undiscovered neighbors are added |
|---|---|
| Start | A |
| A | B, C |
| B | C, D |
| C | D, E |
| D | E |
| E | Empty |

When C discovers E, record `parent[E]=C`. Here **parent** means discovery predecessor. With `parent[C]=A`, reconstruct E←C←A and display A→C→E: two edges.

F is unreachable from A, a legitimate result rather than necessarily an implementation error. Neighbor order may select different equally short paths, not change the minimum edge count.

## Why the queue matters

B and C are one edge from A, so they are removed before vertices two edges away. A **stack** removes the newest item instead and may explore a branch deeply first. Do not transfer BFS's shortest-path guarantee to any traversal order.

Mark on insertion, not only on removal, so other edges do not repeatedly enqueue discovered vertices.

## Limits and cost

BFS minimizes **edge count** here, not arbitrary weighted cost. A **weighted** edge has a cost; a **directed** edge permits a specified direction. State these rules before choosing a search.

Let V count vertices and E edges. An **adjacency list** stores each vertex's neighbors. Traversal takes O(V+E) time and O(V) additional space for discovery, queue, and predecessors. These are growth descriptions, not seconds; review [complexity](/en/programming-basics/08-problem-solving-algorithms/).

## Optional depth: a tree is not any branching picture

A **tree**, for a simple undirected graph, is connected and acyclic, has one path between any two vertices, and V−1 edges. Our graph is not a tree: it has a cycle, and F disconnects it.

Graphs model roads, networks, dependencies, and social relationships. Those domains need not share edge directions or costs.

## Independent practice

1. Start from B and trace the queue until E is discovered. Give a shortest path and edge count.
2. Is F reachable from B? What should the program report?
3. Change A–C's cost to 100 and all other costs to 1. Does minimum edge count still give minimum cost from A to E?
4. Does removing only F make a tree?

<details>
<summary>Answers and acceptance criteria</summary>

1. Start[B]; remove B, enqueue A, D; remove A, enqueue C; remove D, discover E. B→D→E has two edges. Neighbor order may change the queue but not the minimum distance.
2. No; report unreachable rather than inventing a path.
3. No. A→C→E costs 101 over two edges; A→B→D→E costs 3 over three. Unweighted BFS does not solve the changed cost question.
4. No; A→B→D→E→C→A remains a cycle. Trace discovery and check edge directions/costs, not merely the algorithm name.

</details>

## Summary

Specify relationships, direction, and cost, then trace the queue and predecessor links. Broader graph algorithms follow language practice; they are not prerequisites to a first web application.
