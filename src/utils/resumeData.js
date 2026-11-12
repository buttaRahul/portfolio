
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import React from 'react';
import { FaKaggle } from "react-icons/fa6";
import { SiLeetcode } from "react-icons/si";



export const projectTabs = [
    { id: 'all', label: 'All' },
    { id: 'llm', label: 'LLMs & Agents' },
    { id: 'systems', label: 'ML Systems & GPU' },
    { id: 'classical', label: 'Classical ML' },
    { id: 'vision', label: 'Vision & Multimodal' },
    { id: 'speech', label: 'Speech' },
    { id: 'research', label: 'Research' },
]

export default {
    name: 'Rahul Aditya',
    title: 'Machine Learning Engineer — LLMs, NLP, computer vision, speech, classical ML',
    email: 'butta.rahul.aditya@gmail.com',


    links: {
        LinkedIn: {
            link: 'https://www.linkedin.com/in/rahul-aditya/',
            text: 'rahul-aditya',
            icon: React.createElement(LinkedInIcon)
        },
        GitHub: {
            link: 'https://github.com/buttaRahul',
            text: 'buttaRahul',
            icon: React.createElement(GitHubIcon)
        },
        Kaggle: {
            link: 'https://www.kaggle.com/adityarahul',
            text: 'aditya_Rahul',
            icon: React.createElement(FaKaggle)
        },
        LeetCode : {
            link : 'https://leetcode.com/aditya_Rahul/',
            text : 'aditya_rahul',
            icon: React.createElement(SiLeetcode)

        }
    },

    about: "Machine Learning Engineer working on LLMs, retrieval, speech and classical ML. I build production systems end to end, from fraud detection on healthcare claims to multilingual GraphRAG and on-device voice agents, and write GPU kernels and inference code in my spare time.",

    // Order matters: open source first, then professional work newest to oldest, then research.
    // links[].type is one of 'github' | 'kaggle' | 'paper'. Professional work has no links.
    projects: [
        // ---------- Open source ----------
        {
            title: 'Attention Sinks',
            label: 'Open source',
            tabs: ['systems', 'llm'],
            summary: 'Attention-sink (StreamingLLM) KV cache for Hugging Face Transformers 5.',
            bullets: [
                'RoPE re-rotation, fused Triton eviction kernel, split-K flash-decoding backend, CUDA-graph decode',
                'Qwen3-0.6B: perplexity within 6% of a full cache up to 40K tokens at constant memory (1.4 GB), where a window-only cache was 14× worse',
                'Found and fixed a bf16 drift bug from repeated key rotation',
            ],
            tags: ['Transformers', 'Triton', 'KV cache', 'PyTorch'],
            links: [
                { type: 'github', url: 'https://github.com/buttaRahul/Attention_sinks', label: 'Code' },
            ],
        },
        {
            title: 'fused-rmsnorm-triton',
            label: 'Open source',
            tabs: ['systems'],
            summary: 'Fused residual-add + RMSNorm kernel in OpenAI Triton, forward and backward.',
            bullets: [
                '85–89% of peak memory bandwidth on an RTX 4060',
                '5–9× faster than eager PyTorch on forward, 8–12× on forward + backward; on par with torch.compile',
                'Swapped into Qwen3-0.6B: logits closer to fp32 than stock Hugging Face; training loss within bf16 noise',
            ],
            tags: ['Triton', 'PyTorch', 'CUDA'],
            links: [
                { type: 'github', url: 'https://github.com/buttaRahul/fused-rmsnorm-triton', label: 'Code' },
            ],
        },
        {
            title: 'Enterprise Search',
            label: 'Open source',
            tabs: ['llm'],
            summary: 'Search agent over emails, a SQL database, the company site and the web, on a LangGraph orchestration layer.',
            bullets: [
                'Typed planning and intent routing, parallel retrieval, reflection, citation checking, multi-turn threads with clarification via interrupt/resume',
                'SQL subgraph with an AST guard, table allowlist, forbidden columns and a self-repair loop',
                'Evaluated against a ReAct baseline on routing, SQL execution accuracy, multi-turn and prompt-injection suites',
            ],
            tags: ['LangGraph', 'FastAPI', 'RAG', 'React'],
            links: [
                { type: 'github', url: 'https://github.com/buttaRahul/enterprise_serach', label: 'Code' },
            ],
        },
        {
            title: 'Clinical Triage Navigator',
            label: 'Open source',
            tabs: ['research'],
            summary: 'OpenEnv reinforcement-learning environment that simulates emergency-department triage: the agent assigns an ESI level, requests resources, routes patients and escalates sentinel conditions (STEMI, stroke, sepsis). The reward is asymmetric: under-triage costs more than over-triage.',
            bullets: [],
            tags: ['Reinforcement learning', 'OpenEnv', 'Healthcare'],
            links: [
                { type: 'github', url: 'https://github.com/buttaRahul/clinical_triage_env', label: 'Code' },
            ],
        },
        {
            title: 'Image Captioning with Visual Attention',
            label: 'Open source',
            tabs: ['vision'],
            summary: 'Encoder–decoder captioner in TensorFlow/Keras: frozen EfficientNetB0 image regions + 2-layer Transformer decoder.',
            bullets: [
                'BLEU-4 23.4 with beam search on a held-out Flickr8k test set (1,091 images)',
            ],
            tags: ['TensorFlow', 'Keras', 'Transformers', 'CNN'],
            links: [
                { type: 'github', url: 'https://github.com/buttaRahul/Image-Caption-Generation', label: 'Code' },
                { type: 'kaggle', url: 'https://www.kaggle.com/code/adityarahul/attention-mechanism-101', label: 'Kaggle notebook' },
            ],
        },
        {
            title: 'Multimodal Video Summarization',
            label: 'Open source',
            tabs: ['vision', 'llm'],
            summary: 'Summarises videos from both the transcript and the visuals: picks key frames by the importance of transcript sentences, describes those frames, and passes the descriptions plus transcript to an LLM.',
            bullets: [],
            tags: ['LLMs', 'Vision-language', 'Python', 'React'],
            links: [
                { type: 'github', url: 'https://github.com/buttaRahul/multimodal_video_summarization', label: 'Code' },
            ],
        },
        {
            title: 'QueryAssist (natural language → SQL)',
            label: 'Open source',
            tabs: ['research'],
            summary: 'Ask a database questions in plain English, typed or spoken, and get the SQL and results. Early rule-based NLP prototype (2023) of the published system.',
            bullets: [],
            tags: ['NLP', 'SQL', 'Speech recognition'],
            links: [
                { type: 'github', url: 'https://github.com/buttaRahul/Query-Assist', label: 'Code' },
            ],
        },
        {
            title: 'OCR + NER',
            label: 'Open source',
            tabs: ['llm'],
            summary: 'Extracts named entities from PDFs and scanned images: OCR followed by a fine-tuned bert-large-cased NER model, with a web UI.',
            bullets: [],
            tags: ['NER', 'OCR', 'BERT'],
            links: [
                { type: 'github', url: 'https://github.com/buttaRahul/ocr-ner', label: 'Code' },
            ],
        },

        // ---------- Professional work: Zynix AI · Machine Learning Engineer · Sep 2025 – present ----------
        {
            title: 'Fraud and waste detection for medical-equipment claims',
            label: 'Professional work · Zynix AI',
            role: 'Machine Learning Engineer · Sep 2025 – present',
            tabs: ['classical'],
            summary: 'Designed and built alone: a 5-layer system on Databricks over 6,500+ suppliers combining CMS-policy rules, peer baselines, an anomaly-detection ensemble (Isolation Forest, ECOD, kNN), graph referral features and positive-unlabeled learning.',
            bullets: [
                'All 5 suppliers the HHS-OIG later excluded were already in its top-0.53% risk tier',
                'Held-out confirmed fraud suppliers ranked in the top 3% (median rank 1)',
            ],
            tags: ['Anomaly detection', 'PU learning', 'Databricks'],
            links: [],
        },
        {
            title: 'Clinical risk prediction on Medicare claims',
            label: 'Professional work · Zynix AI',
            role: 'Machine Learning Engineer · Sep 2025 – present',
            tabs: ['classical'],
            summary: 'Predicts 30-day admissions, ER visits and readmissions from Medicare claims so care teams can prioritise outreach.',
            bullets: [
                '30-day admission, ER and readmission models (XGBoost) on 1.18M member-months: AUROC up to 0.79, 4.5× AUPRC lift on a patient-disjoint holdout',
                'Capacity-sized thresholds raised 30-day precision 2.4× on an out-of-time fold; weekly outreach flags cut from about 1,600 to 300',
                'Heart-disease stage-progression models for 98.5K patients (AUROC 0.76–0.80)',
            ],
            tags: ['XGBoost', 'Calibration', 'Databricks'],
            links: [],
        },
        {
            title: 'Claims foundation model and multi-GPU training',
            label: 'Professional work · Zynix AI',
            role: 'Machine Learning Engineer · Sep 2025 – present',
            tabs: ['llm', 'systems'],
            summary: 'A Qwen3-4B model fine-tuned with LoRA on longitudinal claims data, and the multi-GPU training stack behind it.',
            bullets: [
                'Data-parallel LoRA trainer for Qwen3-4B on 4× L40S and 4× RTX 4090 nodes; fixed a gradient-sync bug that all-reduced only the last micro-batch; tested a 3D-parallel configuration for scale-up',
                'Held-out claims perplexity 1.79 → 1.33',
                'Beat XGBoost on 12-month CKD progression (AUROC 0.674 vs 0.645)',
            ],
            tags: ['LoRA', 'Distributed training', 'PyTorch'],
            links: [],
        },
        {
            title: 'Multi-client voice agent',
            label: 'Professional work · Zynix AI',
            role: 'Machine Learning Engineer · Sep 2025 – present',
            tabs: ['llm', 'speech'],
            summary: 'An in-house calling agent whose per-client call flows are assembled from configuration.',
            bullets: [
                'Modular LangGraph calling-agent architecture: per-client call flows from YAML config, graph-agnostic LLM service, plug-in memory extractors',
                'Streaming speech enhancement (RNNoise, then fine-tuned DeepFilterNet) and two-stage voicemail detection',
            ],
            tags: ['LangGraph', 'Speech enhancement', 'Voice AI'],
            links: [],
        },

        // ---------- Professional work: Carnot Research (IIT Delhi) · Machine Learning Engineer · Mar – Sep 2025 ----------
        {
            title: 'Multilingual GraphRAG for icarKno',
            label: 'Professional work · Carnot Research (IIT Delhi)',
            role: 'Machine Learning Engineer · Mar – Sep 2025',
            tabs: ['llm'],
            summary: 'Productionised GFM-RAG (graph-neural retrieval over a document knowledge graph) for 12 Indian languages.',
            bullets: [
                'Macro Recall@10 59.8% → 77.3% and multi-hop success 52% → 72% vs ColBERTv2',
            ],
            tags: ['GraphRAG', 'GNN', 'Multilingual'],
            links: [],
        },
        {
            title: 'On-device voice and vision agent on NVIDIA Jetson AGX Orin',
            label: 'Professional work · Carnot Research (IIT Delhi)',
            role: 'Machine Learning Engineer · Mar – Sep 2025',
            tabs: ['systems', 'vision', 'speech'],
            summary: 'End to end from flashing the board: faster-whisper ASR, LLaVA-1.5 7B quantised to 4-bit with AWQ, Chatterbox TTS, attention-sink KV cache for long sessions.',
            bullets: [],
            tags: ['Edge AI', 'Quantization', 'VLM'],
            links: [],
        },
        {
            title: 'Sachet disaster-alert chatbot',
            label: 'Professional work · Carnot Research (IIT Delhi)',
            role: 'Machine Learning Engineer · Mar – Sep 2025',
            tabs: ['llm'],
            summary: "Sole developer: QLoRA fine-tuning of Qwen 7B for the citizen chatbot in Sachet, India's national disaster-alert app.",
            bullets: [],
            tags: ['QLoRA', 'LLM fine-tuning'],
            links: [],
        },
        {
            title: 'Real-time voice bot with voice cloning',
            label: 'Professional work · Carnot Research (IIT Delhi)',
            role: 'Machine Learning Engineer · Mar – Sep 2025',
            tabs: ['speech'],
            summary: 'End-to-end voice bot with voice cloning and real-time streaming of input and output audio.',
            bullets: [],
            tags: ['TTS', 'Streaming'],
            links: [],
        },
        {
            title: 'Indic speech and translation',
            label: 'Professional work · Carnot Research (IIT Delhi)',
            role: 'Machine Learning Engineer · Mar – Sep 2025',
            tabs: ['speech', 'llm'],
            summary: 'Transliteration and text-to-speech for Indic languages; fine-tuned TTS and built a neural machine-translation model for a low-resource Indian language for a government client.',
            bullets: [],
            tags: ['TTS', 'Machine translation'],
            links: [],
        },
        {
            title: 'Natural-language database agent',
            label: 'Professional work · Carnot Research (IIT Delhi)',
            role: 'Machine Learning Engineer · Mar – Sep 2025',
            tabs: ['llm'],
            summary: 'Domain-specific database agent for natural-language data retrieval.',
            bullets: [],
            tags: ['LLM agents', 'SQL'],
            links: [],
        },

        // ---------- Professional work: VideoVerse · ML Engineering Intern · Aug – Nov 2024 ----------
        {
            title: 'Live cricket event detection',
            label: 'Professional work · VideoVerse',
            role: 'ML Engineering Intern · Aug – Nov 2024',
            tabs: ['vision'],
            summary: 'Detects key events in live cricket streams as part of a production video-AI ensemble.',
            bullets: [
                'Fine-tuned VideoMAE in a production ensemble with VLMs serving Disney+ Hotstar and other streaming platforms; about 74% precision on its 2 priority event classes',
                "Handled rare-event class imbalance (weighted loss, downsampling); DeepSpeed mixed-precision fine-tuning; large-scale video processing with Ray on H100s; REST inference server for the team's fine-tuned VLM",
            ],
            tags: ['VideoMAE', 'DeepSpeed', 'Ray'],
            links: [],
        },

        // ---------- Professional work: Dronapay · Data Science Intern · Apr – Jul 2024 ----------
        {
            title: 'Natural-language fraud rules to JSONLogic',
            label: 'Professional work · Dronapay',
            role: 'Data Science Intern · Apr – Jul 2024',
            tabs: ['llm'],
            summary: 'LoRA-fine-tuned Llama 2 7B with retrieval over system metadata: 82% logical and 74% execution accuracy.',
            bullets: [],
            tags: ['LoRA', 'RAG'],
            links: [],
        },
        {
            title: 'Keystroke-dynamics fraud detection',
            label: 'Professional work · Dronapay',
            role: 'Data Science Intern · Apr – Jul 2024',
            tabs: ['classical'],
            summary: '+12 points fraud-detection accuracy with keystroke-dynamics features; transaction-delinquency models deployed on a serverless architecture.',
            bullets: [],
            tags: ['Behavioural biometrics', 'Fraud detection'],
            links: [],
        },

        // ---------- Professional work: Ylytic · Data Science Intern · Nov 2022 – Jan 2023 ----------
        {
            title: 'Audience location and comment sentiment',
            label: 'Professional work · Ylytic',
            role: 'Data Science Intern · Nov 2022 – Jan 2023',
            tabs: ['classical'],
            summary: 'Viewer-location (city) prediction and NLP sentiment analysis of comments on scraped Instagram data.',
            bullets: [],
            tags: ['NLP', 'Sentiment analysis'],
            links: [],
        },

        // ---------- Research ----------
        {
            title: 'Water-surface object detection',
            label: 'Research',
            role: 'Research Assistant, IIIT Pune (Dr. Sanjeev Sharma) · Sep – Nov 2023',
            tabs: ['research', 'vision'],
            summary: 'Deep-learning object detection and image segmentation for objects on water surfaces.',
            bullets: [],
            tags: ['Object detection', 'Segmentation'],
            links: [],
        },
        {
            title: 'QueryAssist: Multimodal Verbal Specifications to Structured Query Conversion Model Using Word Vector-Based Semantic Analysis',
            label: 'Research',
            role: 'Publication · InCITe 2024, Springer',
            tabs: ['research'],
            summary: 'Boddu, Butta et al. InCITe 2024, Springer (Lecture Notes in Electrical Engineering, vol. 1278).',
            bullets: [
                'Best Paper Award',
            ],
            tags: [],
            links: [
                { type: 'paper', url: 'https://link.springer.com/chapter/10.1007/978-981-97-8193-5_6', label: 'Paper' },
            ],
        },
    ]

}
