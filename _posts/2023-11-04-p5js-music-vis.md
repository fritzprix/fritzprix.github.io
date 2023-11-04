---
layout: post
locale: ko_KR
author: Doowoong(David) Lee
title:  "p5.js로 창작하는 디지털 아트: 시각화 프로젝트들"
date:   2023-11-03 16:00:00
image: /assets/img/p5js.png
comments: true
tags: [p5js, creative coding, music visualization, interactive art, javascript]
categories: [digital art, creative coding, music visualization, AI LLM]
---
![p5js w:100](/assets/img/p5js.png)

## 이야기
> `p5.js`는 마치 마법사의 지팡이와도 같은 자바스크립트 라이브러리입니다. 이 오픈 소스 프로젝트는 UX 실험을 마치 어린 아이의 상상 놀이처럼 쉽고 재미있게 만들어줍니다. 2000년에 태어난 Java의 대장 `Processing`은 이미 예술가와 UX 디자이너, 그리고 창의적인 마음을 가진 사람들 사이에서 사랑받는 존재였죠. 하지만 p5.js는 브라우저 내의 자바스크립트 런타임만으로 활약, Processing의 배포 제약을 가볍게 뛰어넘어 누구나 웹을 통해 자신의 아이디어를 마음껏 펼칠 수 있는 무대를 제공했습니다.

## 동기
> 정보를 시각화한다는 것은 단순한 의미 해석이나 통찰을 넘어선, 눈을 즐겁게 하는 예술적인 행위입니다. 특히 음향과 시각이 한데 어우러져 만들어내는 경험은 각각의 감각에서 얻는 즐거움과는 비교할 수 없는, 강렬하고도 매혹적인 새로운 체험을 선사하죠. 소리를 시각화하는 작업은 그래서 단지 소리의 정보를 넘어서, 감각의 향연을 만들어냅니다.

## 여정
> 음악을 시각화하는 것부터 시작해, `Cellular Automata`의 단순함 속에 숨겨진 복잡한 아름다움을 발견하는 여정까지, p5.js와 함께 할 이 모험을 이 포스트를 통해 살짝씩 풀어나갈 거예요. 마치 이야기를 엮어가는 실처럼, 여러분을 이 흥미진진한 창작의 세계로 초대합니다!


## Dancing particles
- Start버튼을 누르면 시작
- 음악을 바꿀 수 있음
- 체크박스 설정하면 배경 색상이 음의 특징에 따라 색상을 바꿈
- 기본적으로 FFT를 활용, particle들을 주파수 대역별로 할당하고 그에 따라 공간적으로 배치, 또한 할당된 주파수에 따라 색상을 지정
- 저주파(yellow) -> 고주파(cyan)
- sweep 음원을 이용하여 particle이 어떻게 주파수가 할당되어 공간적으로 배치되었는지 확인할 수 있음
- Royalty-free 음원 이용

{% include dancing_particles.html %}


## License
<p xmlns:cc="http://creativecommons.org/ns#" xmlns:dct="http://purl.org/dc/terms/"><a property="dct:title" rel="cc:attributionURL" href="https://fritzprix.github.io/ai/llm/2023/11/03/p5js-music-vis.html">p5j projects</a> by <a rel="cc:attributionURL dct:creator" property="cc:attributionName" href="https://fritzprix.github.io/about/">David Lee</a> is marked with <a href="http://creativecommons.org/publicdomain/zero/1.0?ref=chooser-v1" target="_blank" rel="license noopener noreferrer" style="display:inline-block;">CC0 1.0 Universal<img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1"><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/zero.svg?ref=chooser-v1"></a></p>


<div id="disqus_thread"></div>
<script>
    var disqus_config = function () {
        this.page.url = 'https://fritzprix.github.io/digital%20art/creative%20coding/music%20visualization/ai%20llm/2023/11/03/p5js-music-vis.html'; // Replace with your page's canonical URL variable
        this.page.identifier = 'p5js-music-vis'; // Replace with your page's unique identifier variable
    };

    (function() { // DON'T EDIT BELOW THIS LINE
        var d = document, s = d.createElement('script');
        s.src = 'https://disqus_pItUjCuJmX.disqus.com/embed.js'; // Replace 'YOUR_DISQUS_SHORTNAME' with your Disqus shortname
        s.setAttribute('data-timestamp', +new Date());
        (d.head || d.body).appendChild(s);
    })();
</script>
<noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript">comments powered by Disqus.</a></noscript>
