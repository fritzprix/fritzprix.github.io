---
layout: post
locale: ko_KR
author: Doowoong(David) Lee
title:  "Research in model quantization"
date:   2023-11-24 10:43:00
image: /assets/img/quant_concept.png
comments: true
tags: [ai, quantization, efficiency, sllm, edge]
categories: [ai, ai, llm]
---

![quant](/assets/img/quant_concept.png)

## Quantization이란?

Quantization은 연속적인 값을 불연속적인 값으로 변환하는 과정이다. 이 과정은 연산의 복잡도를 줄이고, 메모리의 효율성을 높이고, 전송의 속도를 증가시키는 등의 장점을 가진다. 하지만 Quantization은 원래의 값과 변환된 값 사이에 차이가 발생하므로, 정보의 손실이나 오차가 불가피하게 발생한다. 이러한 오차는 모델의 성능에 영향을 줄 수 있다.

### Analogy to Digital Image

Quantization의 개념을 이해하기 위해, 디지털 이미지의 색상 표현과 압축 방식을 예로 들 수 있다. 32비트 풀 컬러 이미지는 매우 높은 색상 해상도를 가지고 있어 수백만 가지 색상을 표현할 수 있지만, 이는 각 픽셀마다 많은 데이터가 필요하며, 결과적으로 이미지 파일의 크기가 커지고 처리 속도가 느려진다. 반면에, 256 컬러 이미지는 색상을 훨씬 적은 범위로 제한하여, 각 픽셀당 필요한 데이터 양을 줄이고, 파일 크기를 줄이며 처리 속도를 빠르게 만든다. 하지만, 이 과정에서 색상의 세밀함과 이미지 품질이 손실될 수 있다.

이러한 색상의 압축에서는 사람의 체감 품질 열화를 최소화하는 기술이 중요하다. 예를 들어, JPEG 압축 방식은 인간의 시각적 민감도를 고려하여 덜 중요한 색상 정보를 감소시키고, 중요한 정보를 보존한다. 이 방식은 데이터 양을 줄이면서도 시각적 품질을 유지하는 데 중요하다.

DNN에서의 Quantization도 유사한 방식으로 작동한다. DNN의 파라미터들은 고정밀도로 표현되지만, 이를 낮은 비트로 줄여 연산을 단순화하고 메모리 사용량을 줄인다. 이 과정에서 모델의 크기가 줄어들고 추론 속도가 증가하지만, 정확도에는 약간의 손실이 발생할 수 있다. 이와 같이 DNN에서의 Quantization은 중요한 파라미터를 보다 높은 정밀도로 유지하고, 덜 중요한 파라미터는 더 낮은 정밀도로 줄여나가는 방식으로 진행된다.

### PTQ (**P**ost-**Q**uantization **T**raining)

DNN에서는 Quantization을 통해 모델의 크기를 줄이고, 연산 속도를 높일 수 있다. 하지만 DNN의 파라미터는 학습 과정에서 결정되므로, Quantization을 적용하기 전에는 어떤 값의 범위를 가질지 알 수 없다. 또한 낮은 정밀도로 학습하는 것은 아직 잘 연구되지 않은 분야이다. 따라서 현재는 이미 학습된 모델에 Quantization을 적용하는 후처리 방식(Post-training Quantization)이 많이 사용된다.

## [LLM.int8()](https://arxiv.org/abs/2208.07339)

[Github - bitsandbytes](https://github.com/TimDettmers/bitsandbytes)

### TL;DR

- MatMul을 독립적 Vector Inner Product로 분해하여 각각을 Normalize하여 full scale int8으로 sampling
- 하지만 이 방법을 적용하는 과정에서 6B Parameters 이상의 규모에서 parameter에 outlier의 분포가 증가함 (6.7B에는 거의 모든 Transformer Layer와 전체 중 75%의 layer에 이러한 것들이 생김)
- 그런데 이러한 Outlier는 전체 Parameter의 약 0.1%이지만 성능에 매우 큰 영향을 줌
- 따라서 이러한 outlier는 그대로 남겨두고 (fp16) 나머지만 vector-wise quantization을 적용하니 성능에 별차이 없이 모델의 크기를 크게 줄일 수 있었음

### Vector-wise Quantization

- Matrix Multiplication은 서로 독립적인 Column과 Row의 Inner Product (dot product)로 볼 수 있음.
- 각각의 inner product쌍에 독립적인 normalization constant를 적용 전체 Matrix에 대한 각 행과 열의 normalization constant vector를 얻을 수 있음
- 이러한 방법으로 int8 MatMul과 normalization constant vector의 outer product를 이용 원래의 output을 구할 수 있음
- 이러한 방법으로 2.7B의 Scale까지 심각한 성능 열화 없이 모델의 사이즈를 줄일 수 있음
- 단, Scale이 커지게 되면서 Outlier가 증가하며 이때문에 Quantization error가 커지게 됨

### Beyond 6.7B parameters

- 6.7B Parameter 이상의 규모에 대해서 품질의 열화 없이 이러한 Quantization을 적용하려면 Inference 시의 hidden state에 존재하는 extreme outlier의 emergence를 이해하는 것이 매우 중요
- 예컨데 실험에서는 다른 feature vector 대비 20배 이상이 outlier가 전체 transformer layer의 약 25% 정도에만 나타나다가
- 6.7B에 이르러서는 모든 transformer layer에 나타나고 이외 모든 sequence dimenssion 중 75%에 나타나게됨
- 하지만 이러한 outlier는 높은 규칙성을 보였음.
  - 예를 들어 6.7B의 규모에서 약 150,000개의 outliers가 나타났으나 이들 모두 6개의 feature dimension에 집중
- 이들 outlier는 전체 입력 Feature의 약 0.1%를 차지하지만 이들 Outlier를 제거할 경우 심각한 성능 열화가 발생함을 확인 (600 ~ 1000% Perplexity degradation)
  - 이는 2.7B에서 보았던 0.1%의 perplexity degradation과 너무나 큰 차이임

### Mixed-precision decomposition (Solution for Outlier)

- 0.1%의 outlier에 대해서 FP16으로 처리하고 99.9%에 대해 8-bit matmul로 처리
- 이렇게 Mixed Precision Decomposition과 Vector wise quantization의 2가지 요소를 결합한 것을 LLM.int8()이라 함

### LLM.int8() Key Concept

![llm_int8](/assets/img/llm_int8.png)

- FP16의 X와 W가 주어졌을 때 feature와 weight은 outlier와 regular values로 나뉘어진다.
- outlier의 sub-matrices는 fp16 그대로 두고 처리
- regular values의 sub-matrices는 vector-wise normalization constant를 구하여 이를 통해 full-scale int8으로 sampling함

### limitation

#### 1. Int8 데이터 형식만을 대상으로 연구하였다는 점, 이는 현재 GPU에서 지원되는 유일한 8bit 형식이기 때문임

#### 2. 175B 규모의 모델까지만 테스트 되었다는 점, 이러한 방법이 더 큰 규모의 모델에서 어떠한 영향이 있을지 알 수 없음

#### 3. Attention의 경우 8bit matmul을 적용하지 않았으며 이는

- Attention function 자체는 parameter가 개입되지 않는다.  
  `Softmax(Q@K.T/sqrt(d))@V`
- Memory footprint를 줄이는 것에 주력

#### 4. Inference에만 초점을 맞춘 연구임. Int8 training에 대한 초기 분석을 별첨에 제공하나 int8 training을 대규모로 진행하는 것은 아직은 매우 어려운 문제임

---

## [GPTQ](https://github.com/IST-DASLab/gptq)

### TL;DR

- layer별로 quantization을 적용하고 원래의 full precision layer의 출력과 sqaured error를 최소화할 수 있는 quantized weight을 구하는 방식
- 최근에 제안된 OBQ(Optimal Brain Qauntization) 방식에 기반, 하지만 OBQ는 Quantization error가 최소화가 되도록 개별 weight의 quantization 우선순위를 greedy하게 적용하고 있었음
- 하지만 대규모 모델에서 테스트를 해보니 이러한 Ordering이 주는 이점이 미미함

---

## [GGML]()

---

## [AWQ](https://arxiv.org/abs/2306.00978)


<div id="disqus_thread"></div>
<script>
    var disqus_config = function () {
        this.page.url = PAGE_URL; // Replace with your page's canonical URL variable
        this.page.identifier = PAGE_IDENTIFIER; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
    };
    (function() {
        var d = document, s = d.createElement('script');
        s.src = 'https://fritzprix.disqus.com/embed.js';
        s.setAttribute('data-timestamp', +new Date());
        (d.head || d.body).appendChild(s);
    })();
</script>
<noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript">comments powered by Disqus.</a></noscript>

