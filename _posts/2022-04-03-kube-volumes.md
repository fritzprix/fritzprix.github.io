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
> Raspberry Pi3로 구성된 K3S Cluster에 HDFS 운영을 위해 SSD를 연결하고 이를 K3S Cluster에 추가하고 이때 필요한 ```PersistentVolume``` 및 ```Local Storage```와 관련 간단한 내용을 정리하고자 한다. 참고로 현재 Cluster의 구성은 아래의 그림 처럼 Single Master Node (참고로 Kubernetes는 HA를 위하여 Multi Master를 지원함)와 각 512GB의 외장 Storage(SSD)를 연결한 2개의 Slave Node로 구성된 환경을 이용한다.

![rpi_overview](/assets/img/rpi_cluster_ls.png)

## Volumes in Kubernetes

> 기존 Docker에서 제공되는 Volume의 경우 기본적으로 Ephemeral Volume 형태로 제공되며 Container와 lifecycle을 함께 한다. 이러한 특징 때문에 Container의 Crash와 같은 Container의 예기치 않은 중지 시에 File 의 유실 위험 등 다양한 문제들을 발생시켰다. Kubernetes는 이러한 문제를 해결하기 위해 별도의 Volume 추상화를 제공하여 필요한 경우 Volume에게 독립적인 life cycle을 부여할 수 있도록 허용한다. 요약하면...

- Pod와 독립적인 Volume의 life cycle 부여
- 다양한 유형의 Storage를 Volume이란 일관된 Interface로 통합 (Storage의 추상화)

### Volume의 종류

- Persistent Volume
  > 이름 그대로 지속성을 지닌 Volume이다. 여기서 지속성이란 Pods의 Lifecycle과의 분리를 의미한다. 즉, Pods가 제거되더라도 Volume은 별도의 life cycle을 통해 관리될 수 있다는 것이다. 이번 글을 통해서 설명하게 될 Local Volume 역시 Persistent Volume에 해당한다.
- Projected Volume
  > Projected 즉, 투사된 Volume으로써 이미 존재하는 여러 Volume을 하나의 Directory로 mapping 시키는 형태의 Volume이다.
- Ephemeral Volume
  > Pesistent Volume과 대응되는 개념의 유형으로 주로 Content가 지속성을 가질 필요가 없는, 가령 Cache Service의 Swap 영역 등과 같이 사용되는, 경우에 주로 사용되는 **임시 Volume**이다. **Persistent Volume과 달리 Pod의 life cycle을 따르며 별도로 관리해 줄 필요가 없기 때문에 관리상 수월**하다는 장점이 있다.

### Persistent Volume

- 앞서 말한 것 처럼 Persistent Volume은 Pod와 별도의 life cycle을 지원하며 따라서 이러한 별도의 life cycle 관리를 위한 별도의 APIs, ```PersistentVolume``` 그리고 ```PersistentVolumeClaim```을 제공한다.
- ```PersistentVolume```
  - 다양한 storage class를 사용하여 admin에 의하여 manual하게 혹은 dynamic하게 provision되는 Cluster 내의 개별 storage
  - pod과 같이 cluster 내의 resource

- ```PersistentVolumeClaim```
  - storage 사용에 대한 요청
  - Pod과 유사하다 PVCs는 PV의 자원을 소모
  - resource의 Size와 접근 방식에 대한 정의를 포함함

#### Life Cycle

> PVs와 PVCs의 상호작용은 아래의 life cycle에 따라 이루어 진다.

- Provisioning
  > Provisioning은 방식에 따라 크게 2가지로 나뉜다. 이번 내용에서는 아래 static provisioning을 다루게 된다.
  - ```Static```
    - Admin에 의해 생성되는 ```PV```
  - ```Dynamic```
    - 생성된 사용자의 ```PVC```에 대해 적합한 static ```PV```가 없는 경우 cluster는 해당 ```PVC```에 대하여 일치하는 ```StorageClass```에 대해서 dynamic provisioning을 시도한다.
    - 이를 위해서는 Admin이 사전에 ```StorageClass```를 생성해 두어야 한다.
    - static ```PV```가 없을 때 dynamic provisioning의 시도를 방지하기 위해서는 storage class에 ```""``` (빈 문자열)로 지정한다.
- Binding
  - ```PVC```가 생성되면 적당한 PV를 찾아 Binding을 함.
  - ```PVC```에  적당한 PV가 있을 경우 요청된 Claim을 충족하도록 할당되지만 Volume이 실제 요청보다 과도하게 할당될 수 있다. (250Gi를 요청했는데 512Gi의 ```PV```가 할당되는 경우...)
  - ```PV```가 Dynamic하게 할당될 경우, 해당 ```PVC```에 대하여 항상 동일한  ```PV```를 할당한다.
- Using
  - ```Pod```은 claim을 통하여 Volume을 사용한다.
  - Cluster는 claim을 통해 bind된 volume을 찾고 해당 volume을 mount한다.
  - Storage Object in Use Protection
- Reclaim
  - ```Pod```이 더이상 ```PVC```를 사용하지 않으면 ```PVC```를 삭제함으로써 Resource를 반환할 수 있다. 이때 반환 정책을 설정할 수 있으며 아래 3가지가 있다.
  - ```Retain```
    - ```PVC```가 삭제되면 PV는 릴리즈된다. 하지만 이전 PVC의 데이터가 남아 있는 상태로 다른 PVC에 할당 될 수 없다. 이를 제거하기 위해서는..
      - ```PV```를 삭제 (그래도 스토리지 자산이 존재)
      - 스토리지 자산의 데이터 삭제
      - 연결된 스토리지 자산을 삭제 하거나 혹은 ```PV```를 새롭게 생성
  - ```Delete```
    - ```PV``` 오브젝트와 스토리지 자산까지 모두 삭제함
  - ```Recycle```
    - ```PV```에 기본 스크럽 ```rm -rf /*```를 수행하고 새로운 ```PVC```에 할당될 수 있도록 한다.
    - 기본 스크럽 외 사용자 정의 재활용 스크럽 명령도 사용 가능

### Walk through - Local Persistent Volume 추가하기

> 앞서 간단히 설명한 ```PersistentVolume``` 그리고 ```LocalStorage``` 등을 어떻게 생성하고 Pod에서 이렇게 생성된 Volume을 Pod에 mount하여 접근하는 것까지의 전체 과정을 간단한 Walk through를 통해 정리한다.

#### 1. Storage Class (Local) 생성

> Local Storage에 대한 Storage Class를 아래와 같이 YAML file을 생성해 준다. [volumeBindingMode](https://kubernetes.io/docs/concepts/storage/storage-classes/#volume-binding-mode)에 대한 설정을 ```WaitForFirstConsumer```로 설정하면 ```PVC```가 생성될 때 Binding 되는 것이 아니라 실제 해당 ```PVC```를 사용하는 ```Pod```이 생성될 때 ```Binding```이 이루어진다.

```yaml
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  name: local-storage
provisioner: kubernetes.io/no-provisioner
volumeBindingMode: WaitForFirstConsumer
```

> 이후 위 YAML file을 Kubernetes Cluster에 아래의 명령을 사용하여 K3S cluster에 적용함으로써 Local Storage를 생성한다.

```sh
kubectl apply -f {YAML_FILE}
```

> 정상적으로 StorageClass가 추가되었는지 아래와 같이 확인한다.

```sh
$ kubectl get storageclass
NAME                   PROVISIONER                    RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE
...
local-storage          kubernetes.io/no-provisioner   Delete          WaitForFirstConsumer   false                  8d

```

#### 2. Persistent Volume 생성 (Static Provisioning 방식)

> 위에서 생성된 ```StorageClass```를 참조하는 ```PersistentVolume```을 생성하기 위한 YAML file을 아래와 같이 준비한다. ```nodeAffinity```는 local volume이 실제 물리적으로 인접한 Host를 설정할 수 있도록 해준다. 아래 예시에서는 hostname을 특정할 수 있도록 matchExpressions을 구성하였다. Storage를 물리적으로 설치한 host를 values에 추가해 준다. 아울러 spec.local.path에 설치된 Storage의 절대 경로를 지정하고 spec.capacity.storage에 용량을 지정한다.

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

> 마찬가지로 ```kubectl``` 명령을 사용하여 적용해 준다. 정상적으로 ```PV```가 추가되면 아래와 같이 출력된다.

```sh
$ kubectl get pv
NAME       CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS      CLAIM   STORAGECLASS    REASON   AGE
local-pv   400Gi      RWO            Retain           Available           local-storage            26
```

#### 3. PVC 생성

> 생성된 PersistentVolume의 Provisioning을 위해  아래와 같이 ```PersistentVolumeClaim```을 위한 YAML file을 아래와 같이 생성한다. spec.accessMode 값을 ```ReadWriteOnce```로 설정한다. Local Storage는 ```nodeAffinity```를 가지고 있기 때문에 설정 가능한 [AccessMode 옵션](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#access-modes)은 ```ReadWroteOnce``` 외에는 해당되지 않는다.

```yaml
kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: test-pvc
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: local-storage
  resources:
    requests:
      storage: 400Gi
  
```

> 위 ```PVC``` 정의 파일을 사용하여 kubernetes 설정을 적용하면 아래와 같이 생성된 ```PVC```를 확인할 수 있다.

```shell
$ kubectl get pvc
NAME       STATUS    VOLUME   CAPACITY   ACCESS MODES   STORAGECLASS    AGE
test-pvc   Pending                                      local-storage   6s
```

#### 4. Test Pod을 통해서 PVC를 통해 Storage 접근 (간단한 Text File 생성)

> busybox 이미지를 이용하여 간단한 Shell 명령으로 텍스트 파일을 bind된 ```PV```에 생성하여 최종적으로 확인한다. ```volumes[*].persistentVolumeClaim.claimName```에 앞서 추가했던 (사용할) ```PVC```를 넣는다. 다수의 Volume을 열거할 수 있다. 이렇게 bind되면 container 정의에 있는 ```volumeMounts```에 주어진 위치에 mount 된다.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-local-pv
  labels:
    name: test-local-pv
spec:
  containers:
    - name: app
      image: busybox
      command: ['sh', '-c', 'echo "Local Volume" > /mnt/test.txt && sleep 3600']
      volumeMounts:
        - name: local-persistent-storage
          mountPath: /mnt
  volumes:
    - name: local-persistent-storage
      persistentVolumeClaim:
        claimName: test-pvc


```

> 역시 위 YAML file을 적용해 준다. 이후 ```kubectl```을 해당 ```pod```의 상태를 확인해 본다. 이를 통해 pod이 실제 어떤 node에 deploy되었는지 확인이 가능하다. (예시의 경우 raspberrypi-1에 테스트용 Pod이 Deploy 되었다.)

```shell
$ kubectl describe pods test-local-pv
...
Events:
  Type    Reason     Age    From               Message
  ----    ------     ----   ----               -------
  Normal  Scheduled  4m41s  default-scheduler  Successfully assigned default/test-local-pv to raspberrypi-1
  Normal  Pulling    4m40s  kubelet            Pulling image "busybox"
  Normal  Pulled     4m38s  kubelet            Successfully pulled image "busybox" in 2.25636818s
  Normal  Created    4m37s  kubelet            Created container app
  Normal  Started    4m36s  kubelet            Started container app
```

> 해당 Node의 PV의 위치에 Text file이 정상적으로 생성된 것을 확인한다.

```sh
pi@raspberrypi-1:/mnt/ssd/data $ ls
test.txt
pi@raspberrypi-2:/mnt/ssd/data $ cat test.txt 
Local Volume

```

## What's Next

> 지금까지 Kubernetes Cluster에 PV와 PVC API를 이용하여 Local Storage를 추가하는 과정을 간단하게 정리하였으며 이로써 HDFS 및 Apache Spark 환경을 구축할 수 있는 기본적인 작업이 완료되었다. 다음 글에서는 HDFS 및 Apache Spark 환경 구축을 진행하는 과정을 다루어 보겠다.

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
