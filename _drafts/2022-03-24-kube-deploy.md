---
layout: post
author: Doowoong(David) Lee
image: https://www.techworm.net/wp-content/uploads/2018/03/Build-your-own-Supper-Computer-with-Raspberry-pi-3-Cluster.png
locale: ko_KR
tags: kubernetes raspberrypi k3s cluster docker arm
comments: true
title:  "Deploying containerized application to Rpi3 Kubernetes Cluster"
date:   2022-03-24 22:09:00 +0900
categories: Kubernetes Docker

---

## [Install Kubernetes Helm](https://helm.sh/docs/intro/install/)

```shell
$ curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3

$ chmod 700 get_helm.sh

$ ./get_helm.sh
Downloading https://get.helm.sh/helm-v3.8.1-linux-amd64.tar.gz
Verifying checksum... Done.
Preparing to install helm into /usr/local/bin

```
## [Install HDFS via Helm](https://artifacthub.io/packages/helm/gradiant/hdfs)



<div id="disqus_thread"></div>
<script>
    /**
    *  RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
    *  LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables    */
    var disqus_config = function () {
    this.page.url = PAGE_URL;  // Replace PAGE_URL with your page's canonical URL variable
    this.page.identifier = PAGE_IDENTIFIER; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
    };

    (function() { // DON'T EDIT BELOW THIS LINE
    var d = document, s = d.createElement('script');
    s.src = 'https://fritzprix.disqus.com/embed.js';
    s.setAttribute('data-timestamp', +new Date());
    (d.head || d.body).appendChild(s);
    })();
</script>
<noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript">comments powered by Disqus.</a></noscript>
