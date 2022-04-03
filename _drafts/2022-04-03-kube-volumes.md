---
layout: post
author: Doowoong(David) Lee
image: /assets/img/rpi_cluster_ls.png
locale: ko_KR
tags: kubernetes raspberrypi k3s cluster docker
comments: true
title:  "Adding Local Storage as persistent volume to Kubernetes cluster"
date:   2022-04-03 19:09:00 +0900
categories: kubernetes raspberrypi
---
> Raspberry Pi3로 구성된 Kubernetes Cluster기반에 HDFS 운영을 위해 SSD를 연결하고 이를 Kubernetes Cluster에 추가하는 과정 그리고 Kubernetes의 Persistent Volume과 관련 간단한 내용을 정리하고자 한다. 현재 Cluster의 구성은 아래의 그림과 같이 Master Node 1에 (참고로 Kubernetes는 HA를 위하여 Multi Master를 지원함) 2개의 Slave Node로 구성된 소규모의 Cluster에 각 Slave에 512GB의 SSD를 설치하였다. Storage를 연결하고 이를 Mount하는 과정은 생략함. Kubernetes는 다양한 Storage의 유형을 다루는 Storage Class와 Storage의 논리적 형태인 Volume의 개념으로 다양한 Storage Service를 통합하는데 이번 글에서는 Local Storage의 Storage Class와 Persistent Volume의 Volume을 사용하게 된다.

![rpi_overview](/assets/img/rpi_cluster_ls.png)

## Volumes in Kubernetes

> 기존 Docker와 같은 Container Solution에서 제공되는 Volume의 경우 기본적으로 Ephemeral(휘발성)하기 때문에 Container의 Crash에 의해 File의 유실 등 Container들간에 File을 공유할 때에 많은 문제들을 발생시켰다. Kubernetes는 이러한 문제를 해결하기 위해 별도의 Volume 추상화를 제공한다. 주요 특징 들을 살펴 보면 아래와 같다.

- Pods와 Volume의 Lifecycle을 분리
- 다양한 형태의 Storage의 통합 (Cloud Storage Service, Network Storage...)

### Volume의 종류

- Persistent Volume
  > 말그대로 지속성을 지닌 Volume이다. 여기서 지속성이란 Pods의 Lifecycle과의 분리를 의미한다. 즉, Pods가 제거되더라도 Volume은 별도의 Life cycle을 통해 관리될 수 있다는 것이다. 이번 글을 통해서 설명하게 될 Local Volume 역시 Persistent Volume에 해당한다.
- Projected Volume
  > Projected 즉, 투사된 Volume으로써 이미 존재하는 여러 Volume을 하나의 Directory로 mapping 시키는 형태의 Volume이다.
- Ephemeral Volume
  > Pesistent의 개념과 거의 반대되는 개념의 Volume으로써 주로 Content가 지속성을 가질 필요가 없는 가령 Cache Service의 Swap 영역 등과 같이 사용되는 경우를 예로 들 수 있다. Persistent Volume과 달리 Volume을 사용하는 Pod의 life cycle을 따른다.

### Persistent Volume

- 앞서 말한 것 처럼 Persistent Volume은 Pod와 별도의 Life Cycle을 갖으며 그렇기 때문에 이 Life Cycle(및 Provisioning)의 관리를 위한 별도의 APIs, ```PersistentVolume``` 그리고 ```PersistentVolumeClaim```을 제공한다.
- PersistentVolume
  - 다양한 storage class를 사용하여 admin에 의하여 manual하게 혹은 dynamic하게 provision되는 Cluster 내의 개별 storage
  - pod과 같이 cluster 내의 resource

- PersistentVolumeClaim
  - storage 사용에 대한 요청
  - Pod과 유사하다 PVCs는 PV의 자원을 소모
  - resource의 Size와 접근 방식에 대한 정의를 포함함

#### Life Cycle

> PVs와 PVCs의 상호작용은 다음 Life Cycle에 의해 이루어 진다.

- Provisioning
  > Provisioning은 방식에 따라 크게 2가지로 나뉜다. 이번 내용에서는 아래 static provisioning을 다루게 된다.
  - Static
    - Admin에 의해 생성되는 PV(s)
  - Dynamic
    - 생성된 사용자의 PVC에 대해 적합한 static PV가 없는 경우 cluster는 해당 PVC에 대하여 일치하는 StorageClass에 대해서 dynamic provisioning을 시도한다.
    - 이를 위해서는 Admin이 사전에 Storage Class를 생성해 두어야 한다.
    - static PV가 없을 때 dynamic provisioning의 시도를 방지하기 위해서는 storage class에 ```""``` (빈 문자열)로 지정한다.
- Binding
  - PVC가 생성되면 적당한 PV를 찾아 Binding을 함.
  - PVC에  적당한 PV가 있을 경우 요청된 Claim을 충족하도록 할당되지만 Volume이 실제 요청보다 과도하게 할당될 수 있다. (250Gi를 요청했는데 512Gi의 PV가 할당되는 경우...)
  - PV가 Dynamic하게 할당될 경우, 해당 PVC에 대하여 항상 동일한  PV를 할당한다.
- Using
  - Pod은 claim을 통하여 Volume을 사용한다.
  - Cluster는 claim을 통해 bind된 volume을 찾고 해당 volume을 mount한다.
  - Storage Object in Use Protection
- Reclaim
  - Pod이 더이상 PVC를 사용하지 않으면 PVC를 삭제함으로써 Resource를 반환할 수 있다. 이때 반환 정책을 설정할 수 있으며 아래 3가지가 있다.
  - Retain
    - PVC가 삭제되면 PV는 릴리즈된다. 하지만 이전 PVC의 데이터가 남아 있는 상태로 다른 PVC에 할당 될 수 없다. 이를 제거하기 위해서는 
      - PV를 삭제 (그래도 스토리지 자산이 존재)
      - 스토리지 자산의 데이터 삭제
      - 연결된 스토리지 자산을 삭제 하거나 혹은 PV를 새롭게 생성
  - Delete
    - PV 오브젝트와 스토리지 자산까지 모두 삭제함
  - Recycle
    - PV에 기본 스크럽 (rm -rf /*)를 수행하고 새로운 PVC에 할당될 수 있도록 한다.
    - 기본 스크럽 외 사용자 정의 재활용 스크럽 명령도 사용 가능

> 위와 같이 Kubernetes에서 Volume, 특히 Persistent Volume에 대하여 대략적인 내용들을 살펴 보았다. 우리는 위에서 살펴본 내용을 활용하여 아래와 같은 순서로 Local Storage를 Kubernetest Cluster에 추가할 예정이다.

#### 1. Storage Class (Local) 생성

> Local Storage에 대한 Storage Class를 아래와 같이 YAML file을 생성해 준다. volumeBindingMode에 대한 설정을 WaitForFirstConsumer로 설정하면 PVC가 생성될 때 Binding 되는 것이 아니라 실제 해당 PVC를 사용하는 Pod이 생성될 때 Binding이 이루어진다.

```yaml
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  name: local-storage
provisioner: kubernetes.io/no-provisioner
volumeBindingMode: WaitForFirstConsumer
```

> 이후 위 YAML file을 Kubernetes Cluster에 아래의 명령을 사용하여 적용해 준다.

```sh
kubectl apply -f {YAML_FILE}
```

#### 2. Persistent Volume 생성 (Static Provisioning 방식)

> 위에서 생성된 Storage Class를 참조하는 Persistent Volume을 생성하기 위하여 아래와 같이 YAML file을 준비한다. nodeAffinity는 local volume이 실제 물리적으로 인접한 Host를 설정할 수 있도록 해준다. 아래 예시에서는 hostname을 특정할 수 있도록 matchExpressions을 구성하였다. Storage를 물리적으로 설치한 host를 values에 추가해 준다. 아울러 spec.local.path에 설치된 Storage의 절대 경로를 지정하고 spec.capacity.storage에 용량을 지정한다.

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: test-local-pv
spec:
  capacity:
    storage: 10Gi
  accessModes:
  - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  storageClassName: local-storage
  local:
    path: /mnt/ssd
  nodeAffinity:
    required:
      nodeSelectorTerms:
      - matchExpressions:
        - key: kubernetes.io/hostname
          operator: In
          values:
          - k8s-worker-01
          - k8s-worker-02
          ...

```

> 마찬가지로 Kubectl 명령을 사용하여 적용해 준다. 정상적으로 PV가 추가되면 아래와 같이 출력된다.

```sh
$ kubectl get pv
NAME       CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS     CLAIM              STORAGECLASS    REASON   AGE
local-pv   400Gi      RWO            Retain           Released   default/test-pvc   local-storage            5d7h

```

#### 3. PVC 생성
#### 4. Test Pod을 통해서 PVC를 통해 Storage 접근 (간단한 Text File 생성)

## 참고 자료

1. [lapee79님 Blog](https://lapee79.github.io/article/use-a-local-disk-by-local-volume-static-provisioner-in-kubernetes/)
2. [Kubernetes Document - Volumes](https://kubernetes.io/docs/concepts/storage/volumes/)

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
