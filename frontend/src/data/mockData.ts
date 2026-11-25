import {
  StudentProfile,
  Subject,
  Topic,
  Examination,
  StudyAvailabilityConfig,
  StudySession
} from '../types';

// Helper to format dates YYYY-MM-DD relative to today
export const getRelativeDate = (offsetDays: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export const initialStudentProfile: StudentProfile = {
  name: "Alex Rivera",
  email: "alex.rivera@stanford.edu",
  university: "Stanford University",
  degree: "B.S. Computer Science & AI",
  academicYear: "Year 3",
  semester: "Fall Semester 2026",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  targetDailyHours: 4.5,
  preferredSessionMinutes: 90,
  streakDays: 7
};

export const initialSubjects: Subject[] = [
  {
    id: "sub-1",
    code: "CS 229",
    name: "Artificial Intelligence & Machine Learning",
    color: "#5145E8", // Royal Ultraviolet
    accentGlow: "rgba(81, 69, 232, 0.25)",
    priority: "high",
    examDate: getRelativeDate(5)
  },
  {
    id: "sub-2",
    code: "CS 244",
    name: "Distributed Systems & Cloud Computing",
    color: "#7C3AED", // Deep Iris Plum
    accentGlow: "rgba(124, 58, 237, 0.25)",
    priority: "high",
    examDate: getRelativeDate(12)
  },
  {
    id: "sub-3",
    code: "CS 145",
    name: "Database Systems & Storage Engines",
    color: "#0D9488", // Turquoise Teal
    accentGlow: "rgba(13, 148, 136, 0.25)",
    priority: "medium",
    examDate: getRelativeDate(18)
  },
  {
    id: "sub-4",
    code: "CS 161",
    name: "Design & Analysis of Algorithms",
    color: "#D97706", // Warm Marigold Amber
    accentGlow: "rgba(217, 119, 6, 0.25)",
    priority: "high",
    examDate: getRelativeDate(25)
  },
  {
    id: "sub-5",
    code: "CS 155",
    name: "Computer & Network Security",
    color: "#FF735E", // Luminous Coral
    accentGlow: "rgba(255, 115, 94, 0.25)",
    priority: "medium",
    examDate: getRelativeDate(32)
  }
];

export const initialTopics: Topic[] = [
  // Subject 1: AI & ML
  {
    id: "top-1-1",
    subjectId: "sub-1",
    name: "Loss Functions, Backpropagation & Adam Optimizer",
    description: "Derivation of gradient descent, learning rate schedules, and chain rule backprop.",
    priority: "high",
    estimatedHours: 2.5,
    isCompleted: true,
    completedAt: getRelativeDate(-3)
  },
  {
    id: "top-1-2",
    subjectId: "sub-1",
    name: "Convolutional Neural Networks & ResNet Residuals",
    description: "Kernel operations, pooling layers, feature maps, and vanishing gradient prevention.",
    priority: "high",
    estimatedHours: 3.0,
    isCompleted: true,
    completedAt: getRelativeDate(-1)
  },
  {
    id: "top-1-3",
    subjectId: "sub-1",
    name: "Transformers, Self-Attention & Positional Encodings",
    description: "Query-Key-Value mechanism, multi-head attention, decoder masked attention.",
    priority: "high",
    estimatedHours: 3.5,
    isCompleted: false
  },
  {
    id: "top-1-4",
    subjectId: "sub-1",
    name: "Reinforcement Learning & Bellman Optimality",
    description: "Markov Decision Processes (MDPs), Q-Learning, policy gradients and reward modeling.",
    priority: "medium",
    estimatedHours: 2.5,
    isCompleted: false
  },
  {
    id: "top-1-5",
    subjectId: "sub-1",
    name: "Diffusion Models & Score-Based Generative Systems",
    description: "Forward noise injection, reverse denoising SDEs, DDPM sampling mathematics.",
    priority: "medium",
    estimatedHours: 3.0,
    isCompleted: false
  },

  // Subject 2: Distributed Systems
  {
    id: "top-2-1",
    subjectId: "sub-2",
    name: "Logical Clocks, Lamport Timestamps & Vector Clocks",
    description: "Causality ordering, partial ordering, and concurrent events resolution.",
    priority: "high",
    estimatedHours: 2.0,
    isCompleted: true,
    completedAt: getRelativeDate(-4)
  },
  {
    id: "top-2-2",
    subjectId: "sub-2",
    name: "Raft Consensus Protocol & Leader Election",
    description: "Term numbers, heartbeats, log replication, safety invariants, and commit index.",
    priority: "high",
    estimatedHours: 3.5,
    isCompleted: false
  },
  {
    id: "top-2-3",
    subjectId: "sub-2",
    name: "Two-Phase Commit (2PC) & Distributed Transactions",
    description: "Coordinator failure recovery, write-ahead logging, and ACID isolation levels.",
    priority: "high",
    estimatedHours: 2.5,
    isCompleted: false
  },
  {
    id: "top-2-4",
    subjectId: "sub-2",
    name: "Consistent Hashing & Dynamo-style Virtual Nodes",
    description: "Partitioning, read repair, slopping quorums, and anti-entropy with Merkle trees.",
    priority: "medium",
    estimatedHours: 2.0,
    isCompleted: false
  },

  // Subject 3: Database Systems
  {
    id: "top-3-1",
    subjectId: "sub-3",
    name: "B+ Tree Indexing & Buffer Pool Management",
    description: "Node splits, page replacement policies (LRU-K, Clock), and disk I/O cost modeling.",
    priority: "high",
    estimatedHours: 3.0,
    isCompleted: true,
    completedAt: getRelativeDate(-2)
  },
  {
    id: "top-3-2",
    subjectId: "sub-3",
    name: "Relational Query Optimization & Cost Estimation",
    description: "Dynamic programming join reordering, predicate pushdown, and catalog statistics.",
    priority: "high",
    estimatedHours: 2.5,
    isCompleted: false
  },
  {
    id: "top-3-3",
    subjectId: "sub-3",
    name: "ARIES Recovery Algorithm & Write-Ahead Logging",
    description: "Analysis, Redo, and Undo passes, compensation log records (CLRs), and dirty page table.",
    priority: "medium",
    estimatedHours: 2.5,
    isCompleted: false
  },
  {
    id: "top-3-4",
    subjectId: "sub-3",
    name: "Multi-Version Concurrency Control (MVCC)",
    description: "Snapshot isolation, visibility rules, garbage collection of dead tuples, and write skews.",
    priority: "medium",
    estimatedHours: 2.0,
    isCompleted: false
  },

  // Subject 4: Algorithms
  {
    id: "top-4-1",
    subjectId: "sub-4",
    name: "Divide & Conquer, Master Theorem & Fast Fourier Transform",
    description: "Recurrence bounds, divide and conquer polynomial multiplication, bit-reversal permutation.",
    priority: "high",
    estimatedHours: 3.0,
    isCompleted: true,
    completedAt: getRelativeDate(-5)
  },
  {
    id: "top-4-2",
    subjectId: "sub-4",
    name: "Dynamic Programming: Knapsack, Matrix Chain & Edit Distance",
    description: "Optimal substructure, overlapping subproblems, memoization vs bottom-up tabulation.",
    priority: "high",
    estimatedHours: 3.5,
    isCompleted: false
  },
  {
    id: "top-4-3",
    subjectId: "sub-4",
    name: "Network Flow: Ford-Fulkerson & Edmonds-Karp",
    description: "Residual graphs, augmenting paths, min-cut max-flow theorem and bipartite matching.",
    priority: "medium",
    estimatedHours: 2.5,
    isCompleted: false
  },
  {
    id: "top-4-4",
    subjectId: "sub-4",
    name: "NP-Completeness Reductions: 3-SAT to Vertex Cover & Clique",
    description: "Polynomial time reductions, verification certificates, Karp's 21 NP-complete problems.",
    priority: "high",
    estimatedHours: 3.0,
    isCompleted: false
  },

  // Subject 5: Computer Security
  {
    id: "top-5-1",
    subjectId: "sub-5",
    name: "Symmetric Cryptography: AES-GCM & Authenticated Encryption",
    description: "Block cipher modes, Galois Counter Mode, MAC tag generation, and nonce reuse attacks.",
    priority: "medium",
    estimatedHours: 2.0,
    isCompleted: false
  },
  {
    id: "top-5-2",
    subjectId: "sub-5",
    name: "Asymmetric Cryptography: RSA, Diffie-Hellman & Elliptic Curves",
    description: "Modular arithmetic, trapdoor functions, discrete logarithm problem, ECDH key exchange.",
    priority: "high",
    estimatedHours: 3.0,
    isCompleted: false
  },
  {
    id: "top-5-3",
    subjectId: "sub-5",
    name: "Memory Safety Exploits: Buffer Overflows, ROP Gadgets & ASLR",
    description: "Stack smashing, return-oriented programming, stack canaries, NX bits and CFI mitigations.",
    priority: "medium",
    estimatedHours: 2.5,
    isCompleted: false
  }
];

export const initialExaminations: Examination[] = [
  {
    id: "exam-1",
    subjectId: "sub-1",
    title: "AI & Machine Learning Midterm",
    date: getRelativeDate(5),
    time: "09:30 AM",
    venue: "Gates Building, Hall 101",
    priority: "critical",
    targetScore: 92,
    notes: "Covers Neural Nets, Backprop, Attention, and Optimization. 40% of overall course grade."
  },
  {
    id: "exam-2",
    subjectId: "sub-2",
    title: "Distributed Systems Midterm Exam",
    date: getRelativeDate(12),
    time: "02:00 PM",
    venue: "Turing Auditorium",
    priority: "high",
    targetScore: 88,
    notes: "Deep focus on Raft protocol edge cases, split-brain scenarios, and 2PC."
  },
  {
    id: "exam-3",
    subjectId: "sub-3",
    title: "Database Storage & Engines Exam",
    date: getRelativeDate(18),
    time: "10:00 AM",
    venue: "Hewlett Sciences 200",
    priority: "high",
    targetScore: 90,
    notes: "Focus on B+ tree splits, ARIES recovery logs, and join cost algorithms."
  },
  {
    id: "exam-4",
    subjectId: "sub-4",
    title: "Design & Analysis of Algorithms Comprehensive",
    date: getRelativeDate(25),
    time: "01:30 PM",
    venue: "Packard Auditorium",
    priority: "high",
    targetScore: 94,
    notes: "Heavy on Dynamic Programming proofs and NP-completeness reductions."
  }
];

export const initialAvailability: StudyAvailabilityConfig = {
  maxDailyHours: 4.5,
  preferredDurationMinutes: 90,
  breakDurationMinutes: 15,
  weeklySlots: {
    Monday: {
      day: "Monday",
      isEnabled: true,
      slots: [
        { id: "slot-mon-1", startTime: "09:00", endTime: "10:30", label: "Morning Deep Work" },
        { id: "slot-mon-2", startTime: "14:00", endTime: "15:30", label: "Afternoon Focus" },
        { id: "slot-mon-3", startTime: "19:00", endTime: "20:30", label: "Evening Review" }
      ]
    },
    Tuesday: {
      day: "Tuesday",
      isEnabled: true,
      slots: [
        { id: "slot-tue-1", startTime: "10:00", endTime: "11:30", label: "Morning Focus" },
        { id: "slot-tue-2", startTime: "15:00", endTime: "16:30", label: "Lab Preparation" },
        { id: "slot-tue-3", startTime: "20:00", endTime: "21:30", label: "Night Study" }
      ]
    },
    Wednesday: {
      day: "Wednesday",
      isEnabled: true,
      slots: [
        { id: "slot-wed-1", startTime: "09:00", endTime: "10:30", label: "Morning Deep Work" },
        { id: "slot-wed-2", startTime: "14:00", endTime: "15:30", label: "Midday Review" },
        { id: "slot-wed-3", startTime: "19:00", endTime: "20:30", label: "Evening Session" }
      ]
    },
    Thursday: {
      day: "Thursday",
      isEnabled: true,
      slots: [
        { id: "slot-thu-1", startTime: "10:00", endTime: "11:30", label: "Morning Block" },
        { id: "slot-thu-2", startTime: "16:00", endTime: "17:30", label: "Late Afternoon Focus" },
        { id: "slot-thu-3", startTime: "19:30", endTime: "21:00", label: "Night Review" }
      ]
    },
    Friday: {
      day: "Friday",
      isEnabled: true,
      slots: [
        { id: "slot-fri-1", startTime: "09:30", endTime: "11:00", label: "Morning Deep Work" },
        { id: "slot-fri-2", startTime: "14:30", endTime: "16:00", label: "Pre-Weekend Wrapup" }
      ]
    },
    Saturday: {
      day: "Saturday",
      isEnabled: true,
      slots: [
        { id: "slot-sat-1", startTime: "10:00", endTime: "12:00", label: "Weekend Deep Sprint" },
        { id: "slot-sat-2", startTime: "16:00", endTime: "18:00", label: "Weekend Review" }
      ]
    },
    Sunday: {
      day: "Sunday",
      isEnabled: true,
      slots: [
        { id: "slot-sun-1", startTime: "14:00", endTime: "16:00", label: "Sunday Afternoon Prep" },
        { id: "slot-sun-2", startTime: "19:00", endTime: "20:30", label: "Weekly Schedule Review" }
      ]
    }
  }
};

export const initialSessions: StudySession[] = [
  // Past completed sessions
  {
    id: "sess-p1",
    subjectId: "sub-1",
    topicId: "top-1-1",
    title: "AI Optimization & Backpropagation Math",
    date: getRelativeDate(-3),
    startTime: "09:00",
    endTime: "10:30",
    durationMinutes: 90,
    status: "completed",
    rationale: "Foundational topic for upcoming AI midterm exam.",
    notes: "Completed all derivation proofs."
  },
  {
    id: "sess-p2",
    subjectId: "sub-1",
    topicId: "top-1-2",
    title: "CNNs & ResNet Architectures",
    date: getRelativeDate(-1),
    startTime: "14:00",
    endTime: "15:30",
    durationMinutes: 90,
    status: "completed",
    rationale: "Core exam weightage topic.",
    notes: "Understood skip connections thoroughly."
  },
  // Intentionally MISSED sessions from yesterday (Triggers Adaptive Planner)
  {
    id: "sess-m1",
    subjectId: "sub-1",
    topicId: "top-1-3",
    title: "Transformers & Multi-Head Self-Attention",
    date: getRelativeDate(-1),
    startTime: "19:00",
    endTime: "20:30",
    durationMinutes: 90,
    status: "missed",
    rationale: "Crucial for AI midterm exam in 5 days.",
    notes: "Missed due to student project meeting conflict."
  },
  {
    id: "sess-m2",
    subjectId: "sub-3",
    topicId: "top-3-2",
    title: "Relational Query Optimization Algorithms",
    date: getRelativeDate(-1),
    startTime: "10:00",
    endTime: "11:30",
    durationMinutes: 90,
    status: "missed",
    rationale: "High priority topic for upcoming database evaluation.",
    notes: "Did not attend scheduled morning block."
  },
  // TODAY's sessions
  {
    id: "sess-t1",
    subjectId: "sub-2",
    topicId: "top-2-2",
    title: "Raft Consensus Protocol & Leader Elections",
    date: getRelativeDate(0),
    startTime: "14:00",
    endTime: "15:30",
    durationMinutes: 90,
    status: "upcoming",
    rationale: "High priority topic for Distributed Systems midterm in 12 days."
  },
  {
    id: "sess-t2",
    subjectId: "sub-4",
    topicId: "top-4-2",
    title: "Dynamic Programming: Knapsack & Edit Distance",
    date: getRelativeDate(0),
    startTime: "19:00",
    endTime: "20:30",
    durationMinutes: 90,
    status: "upcoming",
    rationale: "Critical algorithms topic requiring intensive problem practice."
  },
  // Tomorrow & upcoming sessions
  {
    id: "sess-u1",
    subjectId: "sub-1",
    topicId: "top-1-4",
    title: "Reinforcement Learning & Bellman Equations",
    date: getRelativeDate(1),
    startTime: "09:00",
    endTime: "10:30",
    durationMinutes: 90,
    status: "upcoming",
    rationale: "Scheduled 4 days prior to AI & ML Midterm."
  },
  {
    id: "sess-u2",
    subjectId: "sub-2",
    topicId: "top-2-3",
    title: "Two-Phase Commit (2PC) Protocols",
    date: getRelativeDate(1),
    startTime: "15:00",
    endTime: "16:30",
    durationMinutes: 90,
    status: "upcoming",
    rationale: "Second distributed transaction block."
  },
  {
    id: "sess-u3",
    subjectId: "sub-3",
    topicId: "top-3-3",
    title: "ARIES Recovery Algorithm & Log Passes",
    date: getRelativeDate(2),
    startTime: "14:00",
    endTime: "15:30",
    durationMinutes: 90,
    status: "upcoming",
    rationale: "Database recovery mechanism review."
  },
  {
    id: "sess-u4",
    subjectId: "sub-4",
    topicId: "top-4-4",
    title: "NP-Completeness Reductions & 3-SAT",
    date: getRelativeDate(3),
    startTime: "10:00",
    endTime: "11:30",
    durationMinutes: 90,
    status: "upcoming",
    rationale: "Essential theoretical algorithm requirement."
  },
  {
    id: "sess-u5",
    subjectId: "sub-5",
    topicId: "top-5-2",
    title: "Asymmetric Cryptography & Diffie-Hellman",
    date: getRelativeDate(4),
    startTime: "16:00",
    endTime: "17:30",
    durationMinutes: 90,
    status: "upcoming",
    rationale: "Network security cryptographic foundations."
  }
];
