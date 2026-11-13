// Single source for everything about Rahul that is not a project.
// Every number here must trace to the resume PDF in public/assets/resume
// or to a public README; see docs/ml-portfolio-research-and-plan.md §4.6.

export const RESUME_HREF = "/assets/resume/Rahul_Aditya_Butta_ML_Engineer.pdf";

export const site = {
  name: "Rahul Aditya Butta",
  shortName: "Rahul Aditya",
  role: "Machine Learning Engineer",
  focus: "Core ML · Deep learning · ML systems",
  location: "Bangalore, India",
  email: "butta.rahul.aditya@gmail.com",
  links: [
    { label: "GitHub", href: "https://github.com/buttaRahul", handle: "buttaRahul" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/rahul-aditya/", handle: "rahul-aditya" },
    { label: "Kaggle", href: "https://www.kaggle.com/adityarahul", handle: "adityarahul" },
  ],
} as const;

export type ProofMetric = {
  value: string;
  label: string;
  /** Case-study slug the number comes from. */
  slug: string;
};

export const proof: ProofMetric[] = [
  {
    value: "5 of 5",
    label: "suppliers later excluded for fraud were already in my model's top 0.53%",
    slug: "fraud-detection-without-labels",
  },
  {
    value: "+6.3%",
    label: "perplexity vs a full KV cache, at constant memory",
    slug: "attention-sinks",
  },
  {
    value: "85–89%",
    label: "of peak GPU bandwidth from my fused Triton kernel",
    slug: "fused-rmsnorm-triton",
  },
];

export type Role = {
  org: string;
  orgNote?: string;
  title: string;
  period: string;
  place: string;
  summary: string;
};

export const experience: Role[] = [
  {
    org: "Zynix AI",
    orgNote: "healthcare AI for value-based care",
    title: "Machine Learning Engineer",
    period: "Sep 2025 – present",
    place: "Bangalore",
    summary:
      "Fraud and waste detection built alone; admission, ER and readmission risk models on 1.18M member-months; a Qwen3-4B claims model trained on multi-GPU nodes; architecture of the in-house calling agent.",
  },
  {
    org: "Carnot Research",
    orgNote: "IIT Delhi",
    title: "Machine Learning Engineer",
    period: "Mar 2025 – Sep 2025",
    place: "New Delhi",
    summary:
      "Graph-neural retrieval (GFM-RAG) for 12 Indian languages; an on-device voice and vision agent on Jetson AGX Orin; QLoRA fine-tuning for India's national disaster-alert chatbot.",
  },
  {
    org: "VideoVerse",
    title: "ML Engineering Intern",
    period: "Aug 2024 – Nov 2024",
    place: "Remote",
    summary:
      "Fine-tuned VideoMAE for live cricket event detection in a production ensemble serving Disney+ Hotstar and other streaming platforms.",
  },
  {
    org: "Dronapay",
    title: "Data Science Intern",
    period: "Apr 2024 – Jul 2024",
    place: "Remote",
    summary:
      "Keystroke-dynamics features (+12 points fraud-detection accuracy); LoRA-tuned Llama 2 7B turning natural-language fraud rules into executable JSONLogic.",
  },
  {
    org: "IIIT Pune",
    title: "Research Assistant (Dr. Sanjeev Sharma)",
    period: "Sep 2023 – Nov 2023",
    place: "Pune",
    summary: "Object detection and segmentation for objects on water surfaces.",
  },
  {
    org: "Ylytic",
    title: "Data Science Intern",
    period: "Nov 2022 – Jan 2023",
    place: "Remote",
    summary: "Audience-location prediction and comment sentiment analysis on scraped Instagram data.",
  },
];

export const education = {
  school: "Indian Institute of Information Technology, Pune",
  degree: "B.Tech, Computer Science and Engineering",
  period: "2020 – 2024",
};

export const publication = {
  title:
    "QueryAssist: Multimodal Verbal Specifications to Structured Query Conversion Model Using Word Vector-Based Semantic Analysis",
  venue: "InCITe 2024, Springer (LNEE vol. 1278)",
  authors: "Boddu, Butta et al.",
  award: "Best Paper Award",
  href: "https://link.springer.com/chapter/10.1007/978-981-97-8193-5_6",
};

export const toolkit: { area: string; items: string }[] = [
  {
    area: "Core ML",
    items: "feature engineering, XGBoost, scikit-learn, anomaly detection, PU learning, calibration, validation design",
  },
  {
    area: "Deep learning",
    items: "PyTorch, Transformers, LoRA / QLoRA, VideoMAE, GNN retrieval, TensorFlow / Keras",
  },
  {
    area: "Systems",
    items: "Triton, CUDA graphs, data-parallel and 3D-parallel training (Picotron), DeepSpeed, Ray, AWQ, Jetson",
  },
  { area: "Data", items: "Databricks (SQL, Delta Lake, Workflows), Neo4j, pandas" },
];
