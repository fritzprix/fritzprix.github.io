---
layout: post
author: Doowoong(David) Lee
locale: ko_KR
tags: LLM AI 
comments: true
title:  "AI research paper - daily digest (Oct. 28. '23)"
date:   2023-11-01 19:09:00 +0900
categories: AI LLM
---

## [ConvNets Match Vision Transformers at Scale](https://arxiv.org/pdf/2310.16764.pdf)
- ConvNet => ViT
- Random Initialized Network + Task Specific Training => Pretraining + Task Specific Training
- 과연 유사한 Pre-training 조건에서도 ConvNet보다 ViT가 우세할까?
- NFNet F7+ (F7 보다 Width가 더 넓은)를 Compute vs. Val Loss로 테스트한 결과 Compute budget에 따라 Optimal model size와 epoch budget (데이터의 양)이 증가함을 확인.
- 즉, Transformer에서와 유사한 Scaling pattern을 확인했다.
- 결과적으로 ImageNet Top-1 90.3%의 정확도를 얻었음
- 이는 이전에 NFNet F5 (RA)를 통해 달성했던 86.8%의 ImageNet 결과를 크게 앞서는 결과임
### 정리
  - Pre-train의 Compute Resource를 유사한 수준으로 사용할 경우
  - ConvNet도 ViT와 유사한 수준의 성능을 보인다.
  - 즉, Scaling Law는 Transformer라는 특정 아키텍처에서만 적용되는 것이 아닌 ConvNet 등에서도 적용될 수 있는 현상이며
  - 따라서 Transformer를 고집할 필요 없다.

---

## [QMoE: Practical Sub-1-Bit Compression of Trillion-Parameter Models](https://huggingface.co/papers/2310.16795)
- MoE 아키텍처는 sparse routing을 통해 높은 accuracy를 보이면서도 더 빠른 추론을 제공
- 하지만 이를 효과적으로 운영하기 위해서는 3.2TB의 GPU 메모리가 필요하며 Deploy를 어렵게 하는 요인임
- 새로운 압축 방식인 QMoE를 통해 Parmeter당 1-bit 이하의 크기로 압축
- 큰 정확도의 손실 없이 1.6T param 모델을 160GB의 메모리만으로 운영할 수 있도록 함
### Approach - Data-dependent Quantization
- Qauntization 즉, 정밀도를 감소시키는 방법이 널리 효과적
- 특히 대규모 모델의 경우 단순한 rounding만으로 precision을 효과적으로 감소 시킬 수 있음. 이를 통해 8bit 심지어는 4bit까지도 효과적으로 적용 가능
- 하지만 MoE와 같이 엄청나게 큰 모델의 경우 이정도의 압축만으로는 실효적인 이득이 없음(결국 1 Node에서 처리할 수 없으므로..)
- Ternary quantizing (3 values) works very well for MoE
  - 매우 많은 수천개의 Experts로 구성되어 있고 이 Experts network만을 중점적으로 quantization하여도 전체적으로 큰 압축 효과를 달성할 수 있고
  - 실질적으로 Inference 시점에 활성화 되는 Network 중 일부만이 압축된 것과 같으므로 Error를 최소화할 수 있을 것 (MoE는 주어진 입력에 따라 일정 Expert Network만 활성화)
  - MoE는 Pre-training / Finetuning 시 Token Dropping이라는 방식을 이용해 Regularization을 함, 따라서 Noise에 더 Robust함, 그래서 Quantization에도 더 Robust할 것임
### Brief procedural description 
  - Calibration data를 이용하여 activation에 대한 통계 정보를 수집, 
  - 수집된 정보를 이용 Experts를 quantization using GPTQ
  - Quatized weight를 custom dictionary scheme으로 인코딩
  - encoding metadata를 저장
  - full precision experts를 인코딩된 weight로 대체
  - 결론적으로 Inference 시 이 custom dictionary scheme을 decoding 하는 단계가 추가됨

---

## [GPTQ: Accurate Post-training Compression for Generative Pretrained Transformers](https://github.com/IST-DASLab/gptq)

- 높은 성능의 LLM은 많은 컴퓨팅 자원을 필요로 함.
- 새로운 quantization 방식을 소개 GPTQ
- 175B parameters의 모델을 4GPU hours만으로 3 ~ 4 bit per weight으로 압축하며 이를 통해 Single GPU에서 추론을 가능하게함.
- 이러한 압축에도 정확도의 손실이 거의 없으며, 더 심한 압축에도 어느정도의 정확도를 보임을 확인
- 이렇게 얻은 압축된 모델은 3 ~ 4배의 비용 효율성을 보임

### Key Exploitations

- Accuracy의 손실 없이 Quantzation을 하기 위해 이를 최소화 하기 위한 Quantization ordering이 있었음 (OBQ 등)
- 하지만 대규모 모델의 경우 이러한 Ordering의 효과가 크지 않음을 확인하였음
- Layer-wise quantization은 memory lazy-batch update를 가능하게 하여 memory 요구량을 감소시킴
- Hessian Matrix를 통해 W의 변화에 따른 Output의 민감도를 구하고 이를 기반으로 quantization을 수행하여 accuracy의 손실을 최소화
---

## [Detecting Pretraining Data from Large Language Models](https://swj0419.github.io/detect-pretrain.github.io/)

---

## [Directly Preference Optimization: Your Language Model is Secretly a Reward Model](https://arxiv.org/abs/2305.18290)

---

## [A Picture is Worth a Thousand Words: Principled Recaptioning Improves Image Generation](https://huggingface.co/papers/2310.16656)

---

## [Prometheus: Inducing Fine-grained Evaluation Capability in Language Models](https://huggingface.co/papers/2310.08491)

---
## [Who's Harry Potter? Approximate Unlearning in LLMs](https://arxiv.org/abs/2310.02238)

---

## [A Picture is Worth a Thousand Words: Principled Recaptioning Improves Image Generation](https://huggingface.co/papers/2310.16656)

---

## [How deep is the brain? The shallow brain hypothesis](https://www.nature.com/articles/s41583-023-00756-z)

---

## [Zephyr: Direct Distillation of LM Alignment](https://huggingface.co/papers/2310.16944)