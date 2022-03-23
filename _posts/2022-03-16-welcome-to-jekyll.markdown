---
layout: post
comments: true
title:  "Build Toy Cluster with Rpi3 & Kubernetes (1)"
date:   2022-03-16 18:22:46 +0900
categories: jekyll update
katex: True
---

# Kubernetes Cluster on [Raspberry Pi](https://www.raspberrypi.org/)
> 이번 과제는 Raspberry Pi3를 이용하여 현시점 기준 가장 효과적으로 Kubernetes Cluster를 구축하는 방법을 소개한다. 사용될 기술들은 아래와 같다.

### Technology used
- [K3S](https://k3s.io/)
  - Rancher Labs에서 제공하는 경량의 Kubernetes 
  - fully CNCF certified kubernetes
    > 따라서 K8S Kubernetes에서 사용했던 YAML을 그대로 가져다 사용할 수 있다.
  - Full Flat Kubernetes K8S 대비 낮은 [System Requirement](https://rancher.com/docs/k3s/latest/en/installation/installation-requirements/resource-profiling/#k3s-cluster-with-a-single-agent)를 갖는다. 
    - Memory 요구사양 비교 K8S vs K3S
      
      |Node Type|K3S|K8S|
      |:-|:-:|:-:|
      |Server Node|768MB|2GB|
      |Agent Node|256MB|1GB|
- [k3sup](https://github.com/alexellis/k3sup) - bootstrap Kubernetes with k3s over SSH < 1 min
- [Docker](https://www.docker.com/)
- [Ubuntu Core 20 for Raspberry Pi 64-bit](https://ubuntu.com/download/raspberry-pi/thank-you?version=20&architecture=core-20-arm64+raspi)
- [Raspberry Pi3 Model B](https://www.raspberrypi.com/products/raspberry-pi-3-model-b/) 

![RPI3](https://kr.element14.com/productimages/large/en_GB/2842228-40.jpg)


<!-- 
||ARM Cortex A53 (Quad)| Intel i7 (Quad)|
|-|:-:|:-:|
|Nominal Frequency [**Ghz**]|1.2|3.7|
|Power Consumption [**Watt**]|3.7|170|
|Avg. MFLOPS @ Livermore Loops BM [**MFLOPS**]| 210 | 2196 |
|Dhrystone 32b Integer Perf [**DMIPS**]  | 2458 | 29277 |
| Op. Efficiency Score | 80.5 | 19.5 |

> [참고 1](http://www.roylongbottom.org.uk/dhrystone%20results.htm) / [참고 2](http://www.roylongbottom.org.uk/Raspberry%20Pi%20Benchmarks.htm)
-->

## Build Toy Cluster with Rpi3
![](https://www.techworm.net/wp-content/uploads/2018/03/Build-your-own-Supper-Computer-with-Raspberry-pi-3-Cluster.png)
1. rpi-imager [다운로드 및 설치](https://www.raspberrypi.com/software/)
2. rpi-imager에서 Raspberry Pi용 Ubuntu 이미지 및 SDCard 설정
   > ![](/assets/img/rpi_image_select.png)
   - Operating System > Raspberry Pi OS (other) > Raspberry Pi OS Lite (64-bit) 선택
   - Image를 설치할 MicroSD를 선택 해준다.
1. rpi-imager 추가 설정
   > Hostname, SSH Login 및 Network 정보 등 이전에는 설치 이후에 따로 설정해야 하는 내용들이 Image Write 시점에 설정할 수 있도록 되어 있다. (아래 그림의 사각형으로 Highlight된 버튼을 통해 설정메뉴를 불러올 수 있다. 단, Operating System을 설정하면 활성화된다.)

   > ![](/assets/img/rpi_option_box.png)
   1. Hostname
      > Hostname의 경우 각 Node의 구별이 용이하도록 설정해 주도록 하자. (예 : Master / Worker_1 ...)
   2. Enable SSH & Login Username / Password
      > SSH 접근을 위한 기본 설정을 한다.
   3. (Optional) Wifi 설정
      > 유선이 아닌 무선망으로 연결할 경우 설정해 주도록 한다. 

## Prepare SSD Image for Rpi3
### Raspberry Pi3에 사용할 Ubuntu 배포판을 Micro SD card에 설치한다
## Installing K3S to Rpi3
## k3sup - Easy way to configure cluster

<div id="disqus_thread"></div>
<script>
    /**
    *  RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
    *  LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables    */
    /*
    var disqus_config = function () {
    this.page.url = PAGE_URL;  // Replace PAGE_URL with your page's canonical URL variable
    this.page.identifier = PAGE_IDENTIFIER; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
    };
    */
    (function() { // DON'T EDIT BELOW THIS LINE
    var d = document, s = d.createElement('script');
    s.src = 'https://fritzprix.disqus.com/embed.js';
    s.setAttribute('data-timestamp', +new Date());
    (d.head || d.body).appendChild(s);
    })();
</script>
<noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript">comments powered by Disqus.</a></noscript>