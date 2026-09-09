---
layout: post
author: Doowoong(David) Lee
locale: en_US
image: /img/ai_research.png
tags: [LLM, AI, ConvNets, ViT, GPTQ, Quantization, QMoE, DPO, Zephyr]
comments: true
title:  "AI Research Paper Digest: ConvNets vs ViT, QMoE, GPTQ, and DPO"
date:   2023-11-01
categories: [AI, LLM]
excerpt: "A comprehensive digest of breakthrough AI papers: ConvNets vs Vision Transformers at scale, sub-1-bit trillion-parameter compression via QMoE, GPTQ post-training quantization, and Direct Preference Optimization (DPO/Zephyr)."
---

![ai_research](/img/ai_research.png)

## [ConvNets Match Vision Transformers at Scale](https://arxiv.org/pdf/2310.16764.pdf)

### Overview
- **Trend Evolution**: ConvNet $\rightarrow$ ViT
- **Training Paradigm Shift**: Randomly Initialized Network + Task-Specific Training $\rightarrow$ Large-Scale Pretraining + Task-Specific Fine-tuning.
- **Core Question**: Under equivalent large-scale pre-training conditions and compute budgets, do Vision Transformers genuinely outperform pure Convolutional Networks?
- **Experimental Findings**: By benchmarking NFNet F7+ (a scaled-width variant) against compute vs. validation loss, the authors confirmed that optimal model size and training epoch budget scale predictably with compute—exhibiting the exact same **Scaling Law** behavior as Transformers.
- **Milestone Result**: Achieved **90.3% Top-1 accuracy on ImageNet**, substantially eclipsing previous NFNet F5 benchmarks (86.8%).

### Key Takeaways
- When provided comparable pre-training compute and dataset scale, modern ConvNets achieve performance parity with Vision Transformers.
- Scaling laws are not an exclusive property of self-attention mechanisms; they apply equally to convolutional topologies.
- Developers and researchers need not dogmatically default to Transformer backbones for vision tasks when architectural efficiency or inductive biases favor convolutions.

---

## [QMoE: Practical Sub-1-Bit Compression of Trillion-Parameter Models](https://huggingface.co/papers/2310.16795)

### Context & Challenge
- Mixture-of-Experts (MoE) architectures provide superior accuracy and throughput via sparse routing.
- However, hosting a trillion-parameter MoE model typically demands over **3.2 TB of VRAM**, posing immense deployment and cost barriers.
- **QMoE** proposes a groundbreaking compression methodology that compresses weights to **under 1 bit per parameter**, enabling a 1.6-trillion-parameter model to run on just 160 GB of GPU memory with negligible accuracy degradation.

### Approach: Data-Dependent Quantization
- Standard rounding methods (e.g., INT8 and INT4) are insufficient for trillion-parameter MoE architectures because they still exceed single-node memory capacities.
- **Ternary Quantization (3 states)** proves uniquely well-suited for MoE:
  - MoE models contain thousands of sparse expert sub-networks. Quantizing these expert weights yields immense compression ratios.
  - Because only a small subset of experts activate for any given token during inference, quantization noise remains localized and bounded.
  - MoE training utilizes regularization techniques such as token-dropping, rendering the routing and expert layers inherently resilient to perturbation and quantization error.

### Technical Procedure
1. Collect activation statistics across representative calibration data.
2. Quantize individual expert layers using second-order information via GPTQ.
3. Encode quantized ternary weights using a custom dictionary-based scheme.
4. Replace full-precision expert matrices with encoded sparse representations, decoding on-the-fly during inference kernels.

---

## [GPTQ: Accurate Post-Training Compression for Generative Pretrained Transformers](https://github.com/IST-DASLab/gptq)

### Motivation
- State-of-the-art LLMs require prohibitive compute and memory resources for deployment.
- **GPTQ** introduces an efficient second-order post-training quantization algorithm capable of compressing 175B-parameter models down to **3 to 4 bits per weight in just 4 GPU hours**.
- The resulting compressed models can execute inference on consumer-grade single GPUs while maintaining near-lossless perplexity and accuracy, delivering a **3–4x throughput and cost improvement**.

### Algorithmic Approach
- Prior techniques (like Optimal Brain Quantization / OBQ) greedily ordered weight quantization, but the authors found greedy ordering unnecessary at LLM scale.
- Employs **layer-wise quantization** with lazy batched updates, drastically reducing memory overhead.
- Utilizes the inverse Hessian matrix to quantify the sensitivity of model output to perturbations in each weight $W$, minimizing cumulative reconstruction error across each layer.

---

## [Direct Preference Optimization: Your Language Model is Secretly a Reward Model](https://arxiv.org/abs/2305.18290)

### Theoretical Shift
- Traditional reinforcement learning from human feedback (RLHF / PPO) is notoriously unstable, resource-intensive, and prone to reward hacking. It requires training a separate reward model followed by complex policy gradient optimization.
- **DPO (Direct Preference Optimization)** demonstrates that the reward model can be mathematically reparameterized directly through the language model's implicit policy.

![dpo](/img/dpo.png)

### Core Mechanics
- Adopts the Bradley-Terry preference framework and converts preference alignment into a straightforward **binary classification loss**.
- Bypasses the need to train or maintain a discrete reward model.
- Fully differentiable, stable supervised training: DPO optimizes the target model directly using pairs of chosen and rejected completions without reinforcement learning loops.

---

## [Zephyr: Direct Distillation of LM Alignment](https://huggingface.co/papers/2310.16944)

### Significance
- Built upon the DPO framework, **Zephyr-7B** (based on Mistral-7B) demonstrates that full alignment can be achieved purely through **synthetic distillation** from frontier models (GPT-4), without human labelers.

### Methodology
1. **dSFT (Distilled Supervised Fine-Tuning)**: Fine-tunes the base model on filtered, multi-turn conversational datasets (UltraChat, ~200k samples).
2. **dDPO (Distilled Direct Preference Optimization)**: Leverages UltraFeedback data evaluated and ranked by GPT-4, establishing chosen and rejected responses for direct DPO training.

### Empirical Benchmarks
![zp_bm](/img/zephyr_1.png)

- Zephyr-7B outperforms substantially larger open models, including **Falcon-40B-Instruct** and **Llama-2-70B-Chat**, on conversational MT-Bench evaluations.

### Key Implications
- Synthetic data coupled with automated AI feedback provides a viable, highly scalable alignment pipeline for open-source AI.
- Distillation significantly narrows the capability gap between compact edge models and closed frontier systems.
