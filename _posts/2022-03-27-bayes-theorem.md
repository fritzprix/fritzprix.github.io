---
layout: post
author: Doowoong(David) Lee
image: https://t1.daumcdn.net/cfile/tistory/991172345B62609234
locale: ko_KR
tags: Probability Statistics Math
comments: true
title:  "Bayes' theorem"
date:   2022-03-27 19:09:00 +0900
categories: math probability math
---


> 이 글을 통해서 Bayes' Theorem을 가능한 이해하기 쉽게 정리하고 이것이 어떤 유용성이 있는지 알아보고자 한다.

## What is Bayes' Theorem?

> Bayes' Theorem은 Conditional Probability와 Joint Probability의 정의에 의해 아래와 같은 참인 2개의 등식을 유도할 수 있다. 즉, Given K에 대해 A의 확률과 K의 확률의 곱이 A와 K의 동시 확률과 같다라는 것이다.

```math
P(A,K) = P(A | K) P(K)
P(A,K) = P(K | A) P(A)
```

> 그리고 이 등식으로 부터 아래와 같은 식을 얻을 수 있는데

```math
P(A | K) = ( P(K | A) P(A) ) / P(K)
```

> 바로 이것이 Bayes' Theorem이다. 여기까지만 보면 실생활의 유용성을 떠올리기 어려울 수 있다. 하지만 정리를 유심히 관찰하면 그 유용성의 Hint를 얻을 수 있는데 ```P(A | K)```를 ```P(K | A)```로 부터 알아 낼 수 있다라는 것이다. 실제 다양한 실생활 문제에서 Conditional Probability는 두가지 경우 중 한가지를 상대적으로 조사하기 쉽거나 알려져 있는 경우가 있다. 다른 말로하면 두가지 중 하나는 알려져 있지 않거나 조사하기가 매우 까다롭다는 것인데 이럴 때 Bayes' Theorem을 이용하면 매우 유용하다.

## Example. COVID19 Self-Inspection Kit Problem

> [질병청의 보도자료](https://www.mfds.go.kr/brd/m_99/view.do?seq=46123)의 예시로 제시된 ```P(A = P)``` = 0.03 ( 3%의 감염률 ) 조건으로 검사 키트의 정확도를 구해 보자

- 질병이 있는 환자 중에서 키트 양성이 나타날 확률 ```P(K = P | A = P)``` : 0.9
- 질병이 없는 환자 중에서 키트 음성이 나타날 확률 ```P(K = N | A = N)``` : 0.99

```math
P(A = P) => Probability of Actual Positive
P(K = P) => Probability of Kit Positive
 ```

> 이를 통하여 Conditional Probability를 구할 경우 아래와 같은 Table을 얻을 수 있다.

|   | A = P | A = N |
|:-:|:-:|:-:|
|P(K = P \| A) |  0.9  |  0.1  |
|P(K = N \| A) |  0.1  |  0.99 |

```text
P = Positive / N = Negative
```

### 검사 키트가 양성일 때 실제 양성일 확률 ```P(A = P | K = P)```은 얼마일까?

> Bayes' Theorem을 이용해서 아래와 같이 정리할 수 있다.

```math
P(A = P | K = P) = P(K = P | A = P) * P(A = P) / P(K = P)
```

> 실제 감염률로 주어진 값 ```P(A = P)``` = 0.03을 제외 하면 P(K = P)를 알아야만 한다. 이는 두 가지 경우의 Joint Probability의 합으로 얻을 수 있다. 다시말해 ```P(K = P | A = P) P(A = P)``` 즉, 실제 감염자가 Kit 양성으로 나올 확률과 양성률의 곱 그리고 비감염자가 양성으로 나올 확률과 비감염률의 곱으로 얻을 수 있으며 아래와 같다.

```math
 P(K = P) = 
     P(K = P | A = P) P(A = P) + P(K = P | A = N) P(A = N)
          
          = 0.9 * 0.03 + 0.1 * 0.97
          = 0.027 + 0.097
          = 0.124 
```

> 따라서 이들을 대입하여 위 ```P(A = P | K = P)```를 구하면 아래와 같다.

```math
P(A = P | K = P) = 0.9 * 0.03  / 0.124 = 0.217
```

> 즉, 키트 양성에서 실제 양성일 확률은 전체 감염률 3%를 가정하였을 때에 ```21.7%``` 정도가 된다. 이는 질병청의 보도자료 수준인 73.6%와는 매우 큰 차이를 보인다. 반면 [일부 언론](https://www.yna.co.kr/view/AKR20220207145300017)에 보도된 통계와는 얼추 비슷한 결과이기도 하다.

### 그렇다면 감염 확산에 치명적일 수 있는 경우 즉, 자가진단 Kit 음성이지만 실제 양성일 확률은 어떨까?

> 이는 아래와 같이 표현될 수 있다.

```math
P(A = P | K = N) = (P(K = N | A = P) P(A = P)) / P(K = N)
```

```math
P(K = N) = 
    P(K = N | A = P) P(A = P) + P(K = N | A = N) P(A = N) 
         
         = 0.1 * 0.03 + 0.99 * 0.97
         = 0.963
```

> 그리고 이를 위 표현식에 대입하면

```math
P(A = P | K = N) = (0.1 * 0.03) / 0.963
                 = 0.0031
```

> ```0.3%```의 확률로 자가진단 Kit에 음성인데 실제 양성일 확률이 존재한다. 앞서 구했던 Kit 양성일 때 실제 양성일 확률 대비 현저히 낮다.

## Wrap Up

> 양성 판정의 정확도는 다소 떨어질 수 있지만 치명적인 상황에 대한 예방 효과가 있다는 측면에서 현재 자가 진단 키트의 의미가 있다고 본다. 다만 질병청에서 공개한 정확도에 대한 근거는 다소 의문이 남는 부분이다.

## What's next?

> 다음에는 이러한 Bayes' Theorem이 Deep Learning의 기본 원리와 어떠한 관계가 있는지 살펴볼 예정이다.


<div id="disqus_thread"></div>
<script>
    /**
    *  RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
    *  LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables    */
    var disqus_config = function () {
    this.page.url = "https://fritzprix.github.io/math/probability/2022/03/27/bayes-theorem.html";  // Replace PAGE_URL with your page's canonical URL variable
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
