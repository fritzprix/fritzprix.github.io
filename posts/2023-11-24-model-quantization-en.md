---
layout: post
locale: en_US
author: Doowoong(David) Lee
title:  "LLM Quantization Deep Dive: LLM.int8(), GPTQ, and AWQ"
date:   2023-11-24
image: /img/quant_concept.png
tags: [AI, LLM Quantization, Efficiency, SLLM, Edge Computing, Deep Learning, GPTQ, AWQ, INT8]
categories: [ai, llm, quantization]
excerpt: "A technical breakdown of modern post-training quantization methods for Large Language Models. Compare LLM.int8(), GPTQ, and AWQ to understand how each tackles outlier features, preservation of salient weights, and inference acceleration."
---

![quant](/img/quant_concept.png)

## What is Quantization?

Quantization is the mathematical transformation of high-precision continuous numerical representations into lower-precision discrete values. In deep learning, converting parameters from FP32/FP16 (16–32 bits) down to INT8 or INT4 drastically compresses memory footprints, enhances arithmetic throughput, and curtails power consumption. 

However, rounding inevitably introduces quantization noise and information loss, potentially degrading model perplexity and reasoning capacity.

### Analogy: Digital Image Compression

Consider the compression of a 32-bit true-color digital photograph. High color resolution demands substantial byte allocation per pixel, bloating storage and compute requirements. Restricting the palette to 256 indexed colors sharply reduces file size and accelerates processing, but risks banding and artifact distortion.

Techniques like JPEG combat this by prioritizing visually salient low-frequency information while compressing subtle high-frequency details. Neural network quantization operates on an analogous principle: **preserve critical, high-impact weights and activations at high fidelity while aggressively compressing redundant parameters**.

### Post-Training Quantization (PTQ)

In Large Language Models, Training-Aware Quantization (QAT) from scratch remains computationally prohibitive. Consequently, **Post-Training Quantization (PTQ)**—converting pre-trained floating-point weights into low-bit integers using a modest calibration dataset—represents the prevailing industrial standard.

---

## 1. [LLM.int8()](https://arxiv.org/abs/2208.07339) (Dettmers et al., 2022)

### Core Discovery: Emergent Outlier Features at Scale
- When scaling Transformer models beyond **6.7 billion parameters**, systematic anomalies emerge: extreme outlier feature values begin dominating specific hidden dimensions across nearly all layers.
- Although these outliers constitute only **~0.1% of all features**, truncating or clamping them causes catastrophic perplexity degradation (600% to 1000% collapse).
- Crucially, these outliers are highly localized—concentrating in just a few latent channels.

### Solution: Mixed-Precision Decomposition

![llm_int8](/img/llm_int8.png)

- **Vector-wise Quantization**: Decouples matrix multiplication into independent row and column vector dot-products, each assigned an independent scaling normalization constant.
- **Outlier Isolation**: Channels with outlier magnitudes exceeding threshold $\alpha=6.0$ are segregated and computed in native FP16, while the remaining 99.9% of regular activations and weights are quantized and computed via standard INT8 tensor operations.
- Enables zero-loss INT8 inference up to 175B parameters.

---

## 2. [GPTQ](https://github.com/IST-DASLab/gptq) (Frantar et al., 2022)

### Core Mechanism: Second-Order Optimal Brain Compression
- Inspired by classic Optimal Brain Surgeon (OBS) theory, GPTQ executes **layer-wise quantization** based on second-order Taylor expansion of the loss function.
- Computes the inverse Hessian matrix $H^{-1} = (2 X X^T + \lambda I)^{-1}$ using calibration data to evaluate parameter sensitivity.
- Quantizes column blocks iteratively, updating the remaining unquantized weights across the layer to actively compensate for accumulated rounding error.

### Algorithmic Highlights
- **Cholesky Reformulation**: Resolves numerical instability in small Hessian eigenvalues, ensuring robust inversion.
- **Lazy Batch Updates**: Batches weight adjustments into contiguous memory patches, overcoming historical latency bottlenecks in second-order methods.
- Compresses 175B models to 3-bit or 4-bit precision within approximately 4 GPU hours, achieving competitive perplexity against full-precision baselines.

---

## 3. [AWQ: Activation-aware Weight Quantization](https://arxiv.org/abs/2306.00978) (Lin et al., 2023)

### The Paradigm Shift: Activations Dictate Weight Salience
- While LLM.int8() and GPTQ primarily evaluate weight magnitude or static Hessian approximations, AWQ recognizes that **the salience of a weight matrix depends critically on the magnitude of its input activations**.
- Analyzing the top 1% salient weight channels reveals that they correspond directly to features with disproportionately large activation magnitudes.

### Mathematical Formulation
![sampling](/img/awq_sampling.png)

Rather than preserving salient weights in costly mixed-precision formats, AWQ introduces an per-channel input scaling factor $s$:

$$W' = W \cdot \text{diag}(s), \quad X' = \text{diag}(s)^{-1} \cdot X$$

By scaling activations down and weights up prior to quantization, the relative rounding error on salient channels decreases proportionally to $1/s$.

![awq_loss](/img/awq_loss.png)

Because rounding functions are non-differentiable, AWQ employs a rapid grid search over calibration batches to identify the optimal per-channel scale factors without backpropagation.

### Benchmark Advantages
![awq_result](/img/awq_result.png)

1. **Superior Perplexity**: Outperforms GPTQ across 7B–70B model families at 4-bit precision.
2. **Minimal Calibration Bias**: Highly robust across divergent data distributions (e.g., PubMed vs. Enron), avoiding dataset overfitting.
3. **Hardware Efficiency**: Pure INT4/INT3 uniform execution without mixed-precision branching, delivering up to **3.3x inference speedup** on consumer hardware (e.g., RTX 4090).

---

## Architectural Comparison Summary

| Metric | LLM.int8() | GPTQ | AWQ |
| :--- | :--- | :--- | :--- |
| **Precision Format** | Mixed-Precision (INT8 + FP16) | Uniform / Mixed (INT4/INT3) | Pure Uniform (INT4 / INT3) |
| **Outlier Handling** | FP16 decomposition channel routing | Hessian-based residual error update | Activation-guided channel scaling |
| **Calibration Requirement** | None (dynamic runtime statistics) | Yes (requires calibration batches) | Yes (minimal calibration sensitivity) |
| **Runtime Hardware Fit** | BitsAndBytes library | AutoGPTQ, ExLlama | vLLM, TensorRT-LLM, HuggingFace TGI |
