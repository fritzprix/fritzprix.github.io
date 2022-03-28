---
layout: post
author: Doowoong(David) Lee
image: https://t1.daumcdn.net/cfile/tistory/991172345B62609234
locale: ko_KR
tags: probability statistics math bayes theorem covid19 inspection
comments: true
title:  "Bayes' theorem"
date:   2022-03-27 19:09:00 +0900
categories: math probability statistics
---


> 이 글을 통해서 Bayes' Theorem을 가능한 이해하기 쉽게 정리하고 이것이 어떤 유용성이 있는지 알아보고자 한다.

## What is Bayes' Theorem?

> 본론에 앞서 아래 영상을 보고 오면 조금 더 빠른 이해에 도움이 될 것이다.

<iframe width="560" height="315" src="https://www.youtube.com/embed/XQoLVl31ZfQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

> COVID19 자가 진단 키트를 이용하여 감염 여부를 검사한다고 생각해보자. 만약 당신이 검사 키트의 양성이 나왔다면 어느 정도의 확신을 가지고 실제 감염 되었다라고 말할 수 있을까? 참고로  [질병청의 발표](https://www.mfds.go.kr/brd/m_99/view.do?seq=46123)에 따르면 현재 자가진단키트의 정확도를 아래와 같이 설명하고 있다.

- 질병이 있는 환자 중 검사결과가 양성으로 나타날 확률이 90% 이상
- 질병이 없는 환자 중 검사결과가 음성으로 나타날 확률이 99% 이상

> 큰 고민 없이 위 설명을 본다면 ```검사 키트가 90%의 정확도를 가지고 있다```라고 생각하고 실제로 90%의 신뢰를 가지고 실 감염 여부에 대한 판단을 하게 될지 모르겠다. 하지만 크게 잘못된 판단이다.

## Conditional Probability

> 위 질병청의 정확도에 대한 발표를 살펴 보면 2가지 경우에 모두 추가적인 조건이 존재하는 것을 알 수 있다. ```'질병이 있는 환자 중..'``` 그리고 ```'질병이 없는 환자 중..'```과 같이 특정 조건의 발생을 가정하고 확률을 정의하는 것을 ```Conditional Probability```라고 한다. 우리는 일상 적인 경험을 통해 조건부 확률이 그 역의 조건부 확률과 같지 않음을 잘 알고 있다.

### 조건부 확률의  유리잔의 예시

> 예를 들어 ```유리잔에 가해지는 외부 요인```와 ```유리잔의 결과적 상태 (깨짐 혹은 깨지지 않음)```라는 2가지 잠재적으로 의존적인 사건을 예로 들면 ```유리잔이 높은 곳에서 떨어졌다```라는 외부 요인이 주어졌을 때 ```유리잔의 결과적 상태```에 대한 확률 추론과 이의 역 조건부 확률인 ```유리잔의 결과적 상태```가 주어졌을 때 ```유리잔에 가해지는 외부 요인```의 문제는 완전히 다른 문제임을 우리는 직관적으로 알 수 있다. 먼저 ```유리잔에 가해지는 외부 요인```이라는 다양한 사건의 이산 확률 분포를 예로 든다면 ```높은 곳에서 떨어졌다``` 외에 다양한 경우(Sample Space)가 존재한다. 반면 ```유리잔의 결과적 상태(깨짐 / 깨지지 않음)```은 2가지 경우가 존재한다. 따라서 두 가지 사건에 연관성이 존재하더라도 비대칭적일 수 밖에 없고, 완전히 다른 Sample Space에 대한 문제이다. 따라서 ```P(A | B)```와 ```P(B | A)```는 같다고 볼 수 없다. (물론 특수한 경우에 등식이 성립하는 경우가 존재하지만..)

```math
P(A | B) != P(B | A)  
```

> 우리가 자가 진단 키트 검사를 통해 알고 싶은 것 역시 질병청에서 제공하는 정보를 거꾸로 뒤집어 놓은 형태인 ```'검사 결과가 양성인 사람이 실제 질병이 있을 경우'```에 해당한다. 과연 주어진 조건부 확률로 부터 어떻게 역의 조건부 확률을 구할 수 있을 것인가? ```Bayes' Theorem```을 차근차근 이해하면서 이러한 물음에 대한 답을 찾아가 보도록 하자.

## Bayes' Theorem from scratch

> Bayes' Theorem의 설명을 위해서 사용될 표현들을 아래와 같이 정리한다.

- 임의의 확률 분포를 갖는 Random Process K에 대해 사건 k의 발생 확률 ```P(K = k)```
- 결합 확률 (Joint Probability)
  > 임의의 확률 분포를 갖는 Random Process K와 A 각각에 대해 동시에 사건 k와 사건 a가 발생할 확률 ```P(K = k, A = a)```
- 조건부 확률 (Conditional Probability)
  > 임의의 확률 분포를 갖는 Random Process A에 대해 사건 a가 발생했을 때 K에서 사건 k가 발생 될 확률 ```P(K = k | A = a)```  

> 정의에 따라 Joint Probability와 Conditional Probability는 아래와 같이 표현할 수 있다.

### 결합 확률을 조건부 확률로 부터 유도 (I)

```math
P(A,K) = P(A | K) * P(K)
```

> A와 K의 결합 확률은 K에 대한 A의 조건부 확률과 K의 확률의 중첩 (혹은 곱)으로 표현 될 수 있다. (곱의 법칙)

### 결합 확률을 조건부 확률로 부터 유도 (II)

```math
P(A,K) = P(K | A) * P(A)
```

> A와 K의 결합 확률은 위와 순서만 바꿔서 A에 대한 K의 조건부 확률과 A의 확률의 곱으로 표현 될 수 있다. (곱의 법칙)

### Bayes' Theorem

> 그리고 이 등식으로 부터 아래와 같은 식을 얻을 수 있는데

```math
P(A | K) = P(K | A) * P(A) / P(K)
```

> 바로 이것이 Bayes' Theorem이다. 위 유도된 표현을 보면 앞서 설명한 것처럼 특정 조건 확률로 부터 역의 조건 확률 즉, ```P(A | K)```를 ```P(K | A)```로 부터 알아 낼 수 있다는 것을 알 수 있을 것이다.

### Bayes' Theorem을 활용한 자가 진단 키트 정확도 추정

> 앞서 설명한 바와 같이 현재 COVID19의 자가 진단 Kit의 정확도 사례가 이 Bayes' Theorem을 설명하는 아주 좋은 예시가 되기 때문에 일반적으로 궁금해 하는 정확도 즉, 진단 키트 양성일 경우 실제 양성일 확률(실제 감염)을 구함으로써 Bayes' Theorem을 적용해 보자. 우산 [질병청의 보도자료](https://www.mfds.go.kr/brd/m_99/view.do?seq=46123)의 예시로 제시된 ```P(A = P)``` = 0.03 ( 3%의 감염률 )를 기본 조건으로 선택한다.

### Given Condition from CDC report

> 질병청에서 공개한 2가지 조건부 확률을 수학적 표현으로 나타내면 아래와 같다. 여기서 K는 검사 키트의 결과 그리고 A는 Actual Result 즉, 실제 감염 여부이다. 두 개의 이산 확률 분포 모델은 모두 ```S = { Positive, Negative }```의 단순한 Sample Space를 갖는다.

- 질병이 있는 환자 중에서 키트 양성이 나타날 확률 ```P(K = P | A = P)``` : 0.9 (90%)
- 질병이 없는 환자 중에서 키트 음성이 나타날 확률 ```P(K = N | A = N)``` : 0.99 (99%)

```math
P(A = P) => Probability of Actual Positive
P(K = P) => Probability of Kit Positive
 ```

> 이를 통하여 Conditional Probability를 구할 경우 아래와 같은 Table을 얻을 수 있다.

|   | A = P | A = N |
|:-:|:-:|:-:|
|P(K = P \| A) |  0.9  |  0.01  |
|P(K = N \| A) |  0.1  |  0.99 |

### 검사 키트가 양성일 때 실제 양성일 확률 ```P(A = P | K = P)```은 얼마일까?

> Bayes' Theorem을 이용해서 아래와 같이 정리할 수 있다.

```math
P(A = P | K = P) = P(K = P | A = P) * P(A = P) / P(K = P)
```

> 실제 감염률로 주어진 값 ```P(A = P)``` = 0.03을 제외 하면 P(K = P)를 알아야만 한다. 이는 두 가지 경우의 Joint Probability의 합으로 얻을 수 있다. 다시말해 ```P(K = P | A = P) P(A = P)``` 즉, 실제 감염자가 Kit 양성으로 나올 확률과 양성률의 결합 확률 그리고 ```P(K = P | A = N)```비감염자가 양성으로 나올 확률과 비감염률의 결합 확률을 구함으로써 얻을 수 있으며 아래와 같다.

```math
 P(K = P) = 
     P(K = P | A = P) * P(A = P) + P(K = P | A = N) * P(A = N)
```

> Table로 부터 값을 대입하면 아래와 같이 계산된다.

```math
=> 0.9 * 0.03 + 0.01 * 0.97
=> 0.027 + 0.0097

= 0.0367
```

> 따라서 이들을 대입하여 위 ```P(A = P | K = P)```를 구하면 아래와 같다.

```math
P(A = P | K = P) = 0.9 * 0.03  / 0.0367 = 0.735
```

> 즉, 키트 양성에서 실제 양성일 확률은 전체 감염률 3%를 가정하였을 때에 ```73.5%``` 정도가 된다. 이는 질병청의 보도자료 수준인 73.6%와 유사하다.

### 그렇다면 감염 확산에 치명적일 수 있는 경우 즉, 자가진단 Kit 음성이지만 실제 양성일 확률은 어떨까?

> 이는 아래와 같이 표현될 수 있다.

```math
P(A = P | K = N) = P(K = N | A = P) * P(A = P) / P(K = N)
```

```math
P(K = N) = 
    P(K = N | A = P) * P(A = P) + P(K = N | A = N) * P(A = N) 
```

> Table로 부터 값을 대입하면 아래와 같이 계산된다.

```math
=> 0.1 * 0.03 + 0.99 * 0.97

= 0.963
```

> 그리고 이를 위 표현식에 대입하면

```math
P(A = P | K = N) = 0.1 * 0.03 / 0.963
                 = 0.0031
```

> ```0.3%```의 확률로 자가진단 Kit에 음성인데 실제 양성일 확률이 존재한다. 앞서 구했던 Kit 양성일 때 실제 양성일 확률 대비 현저히 낮다.

## Wrap Up

> 실사례를 통해서 Bayes' theorem의 의미와 유용성을 알아봤다. 양성 판정의 정확도는 의존 조건인 감염률에 따라 다소 떨어질 수 있지만 치명적인 상황에 대한 예방 효과가 있다는 측면에서 현재 자가 진단 키트의 의미가 있다고 본다.

## What's next?

> 다음에는 이러한 Bayes' Theorem이 Deep Learning의 기본 원리와 어떠한 관계가 있는지 살펴볼 예정이다.


<div id="disqus_thread"></div>
<script>
    /**
    *  RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
    *  LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables    */
    var disqus_config = function () {
    this.page.url = "https://fritzprix.github.io/math/probability/statistics/2022/03/27/bayes-theorem.html";  // Replace PAGE_URL with your page's canonical URL variable
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
