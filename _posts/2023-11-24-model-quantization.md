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

## Quantization이란?

- Quantized라는 것은 연속된 대상을 일정한 방법을 이용하여 불연속의 다루기 쉬운 형태로 바꾸는 것을 말한다. 연속의 대상은 정보의 양이 무한하며 이는 우리가 사용하는 유한한 연산 체계에서는 다룰 수 없다. 따라서 자연계의 정보를 Quantization하는 것은 어떠한 대상을 유한한 연산 체계에서 다루기 위해 필수적인 과정이며 따라서 이 Quantization은 필연적으로 일정 수준의 정보의 손실 혹은 오차(quantization error)를 발생시킨다.

### Quantization in DNN

- DNN의 Parameter는 어떠한 값의 범위를 갖게 될지 Training에 앞서 알수 없다.

## [LLM.int8()](https://arxiv.org/abs/2208.07339)

- LLM의 Quantization 가능성을 제시한 초기의 연구로 [bitsandbytes](https://github.com/TimDettmers/bitsandbytes)로 pytorch의 drop-in replacement로 대체하여 적용할 수 있음

### Vector-wise Quantization

- Matrix Multiplication은 서로 독립적인 Column과 Row의 Inner Product (dot product)로 볼 수 있음.
- 각각의 inner product에 독립적인 normalization constant를 적용
- 이러한 방법에서 MatMul의 결과를 다음 계산 이전에 normalization 값들과 outer product하여 구할 수 있음
- 이러한 방법으로 2.7B의 Scale까지 심각한 성능 열화 없이 모델의 사이즈를 줄일 수 있음

### Beyond 6.7B parameters

- 6.7B Parameter 이상의 규모에 대해서 품질의 열화 없이 이러한 Quantization을 적용하려면 Inference 시의 hidden state에 존재하는 extreme outlier의 emergence를 이해하는 것이 매우 중요
- 예컨데 실험에서는 다른 feature vector 대비 20배 이상이 outlier가 전체 transformer layer의 약 25% 정도에만 나타나다가
- 6.7B에 이르러서는 모든 transformer layer에 나타나고 이외 모든 sequence dimenssion 중 75%에 나타나게됨
- 하지만 이러한 outlier는 높은 규칙성을 보였음.
  - 예를 들어 6.7B의 규모에서 약 150,000개의 outliers가 나타났으나 이들 모두 6개의 feature dimension에 집중
- 이들 outlier는 전체 입력 Feature의 약 0.1%를 차지하지만 이들 Outlier를 제거할 경우 심각한 성능 열화가 발생함을 확인 (600 ~ 1000% Perplexity degradation)
  - 이는 2.7B에서 보았던 0.1%의 perplexity degradation과 너무나 큰 차이임


- 기존의 Quantization 방식은 Dynamic Range에 상관 없이 일괄적으로 Quantization 했음
- 대규모 모델의 Parameter를 분석해보니 Hidden Layer에서 Outlier가 존재함
- 따라서 기존의 방식은 이러한 Outlier에 취약
- 그래서 Mixed Precision decomposition (결국 Outlier를 따로 분리하여 나머지만 Quantization하고 Outlier는 부동소수점으로 그대로 처리하는 것) 방식을 도입하여 처리하니 품질 열화가 거의 없이 Model 사이즈를 줄일 수 있었음
- 그리고 이러한 과정에서 Outlier가 기하급수적으로 증가하는 임계점 약 6.7B parameter 근처에 존재함을 실험적으로 확인
- 그리고 이러한 Outlier의 LLM의 일반화 성능과 연관된것으로 보임

---

## [GPTQ]()

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

