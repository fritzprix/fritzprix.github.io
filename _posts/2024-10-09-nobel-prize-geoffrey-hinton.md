---
layout: post
author: Doowoong(David) Lee
locale: ko_KR
tags: AI ANN Nobel-Prize Geoffrey-Hinton John-Hopfield Inductive-Reasoning Deductive-Reasoning Pure-Science
comments: true
title: "Geoffrey Hinton의 노벨 물리학상 수상과 ANN의 의미"
date: 2024-10-09 10:00:00 +0900
categories: AI Science Philosophy
disqus: true
---

![alt text](/assets/img/geoffrey.png)
오늘 UoT의 교수이자 한 때 Google에서 AI 연구를 이끌던 Geoffrey Hinton이 Artificial Neural Network (이하 ANN)의 연구에 대한 성과로 John J. Hopfield와 함께 Nobel Prize in Physics를 수상하였다. 본인 스스로도 다소 의외의 상황이라는 사실을 인정하였으며 또한 관련하여 물리학계에서 비판적인 시각이 크다. 차라리 Nobel Prize에 Computer Science 분야를 추가하라거나 Turing Award (Computer Science에서의 Nobel Prize와 같은 큰 업적)을 수상한 것으로 충분하다는 등 다양한 비판의 목소리가 있지만, 나는 이것을 조금 다른 시각에서 이해해보려고 한다.

## Indutive Reasoning vs. Deductive Reasoning

![alt text](/assets/img/reasoning.png)
귀납적 추론은 경험에 의한 관측으로 부터 일반화된 규칙을 찾아내는 추론 과정이다. 가령 중력장에서의 물체의 다양한 움직임을 관찰하고 중력장의 법칙을 유도한다던가 하는 것들이 이러한 Inductive Reasoning의 좋은 예로 볼 수 있다. 반면 Decutive Reasoning 즉, 연역적 추론은 명제와 명제의 관계를 밝혀내는 과정으로 수학의 공리 체계에서 공리간의 관계를 밝혀 내고 이러한 명제를 기반으로 추가적인 참 명제를 밝혀 내는 것이다.

## Reasoning in Computation

연역적 추론을 위한 도구로 Computer는 인간의 고유한 영역이었던 추론의 한 부분을 기계로 대체할 수 있게 되었다. 우리는 프로그래밍 언어를 통해 이러한 연역적 추론을 설계하고 이를 Computer를 통해 가속화 할 수 있었다. 반면 관측과 일반화를 수반하는 귀납적 추론은 그동안 Computer가 대체할 수 없는 인간의 고유한 영역으로 인식되어 왔었다.

## Artificial Neural Network and Inductive Reasoning

![alt text](/assets/img/inductive-bias.png)

하지만 이러한 기존의 예상을 뒤엎고 인공신경망의 등장과 기계학습은 데이터 (관측)으로 부터 만능의 Predictor를 기계에 구현할 수 있는 방법을 제공하였다. 데이터(관측)가 있고 그 목적이 어떠한 현상에 대한 정밀한 예측이라면 더 이상 사람의 귀납적 추론은 불필요하게 된 것이다.

## Interpretability and Black Magic Box

그렇다면 순수과학에서 이러한 귀납적 방법 혹은 발견의 의미 역시 기존과 크게 달라지게 될 수 밖에 없다. 과학의 목적이 현상에 대한 예측이라면 순수과학은 점점 무용한 학문이 될 것이다. 하지만 과학의 목적이 인간이 이해 가능한 형태의 지식이라면 순수과학은 AI의 발전에도 여전히 유효할 것이다. 부연 설명하자면 ANN은 데이터를 통해 일반화된 Predictor를 가능하게 하지만 학습된 ANN은 여전히 인간이 해석할 수 있는 형태가 아니다. 그것은 학습 과정에서 창발한 수십만 ~ 수십억개의 Paramter들에 지나지 않는다. 따라서 우리는 ANN이 데이터를 통해 `발견해 낸` Rule을 이해 할 수도 그리고 그 정보들을 통해 새로운 진리를 찾아 낼(Deductive Reasoning) 수도 없는 것이다. ANN이 지닌 이러한 일반화 된 Rule은 따라서 인간에게 매우 제한적인 정보를 제공한다. 이는 마치 Reverse Engineering이 불가한 Software를 사용하는 것과 같다. 다시 말해 `더욱 빠르게 현실을 예측할 수 있지만 Black Box`인 것과 `다소 더디고 느리지만 우리가 이해하고 활용할 수 있는 형태의 지식`의 사이에서 어떠한 길을 택하는가의 문제이고 자본주의는 언제나 효율을 선택하게 되어 있다. 따라서 순수과학 분야에 대한 도전은 앞으로 더욱 심화될 것이라고 본다.

## Conclusion

ANN은 단순히 하나의 컴퓨터 기술이 아니다. 그것은 인간의 고유한 지적 추론을 사실상 Computer가 완전히 대체할 수 있게된 전환점이며 따라서 앞으로 순수과학의 역할에 대한 의문을 던진 중요한 사건이라고 생각한다. 충분한 데이터와 복잡도 (Paramter 갯수) 그리고 이를 처리할 수 있는 고성능의 컴퓨터만 있다면 존재하는 모든 자연 현상을 높은 정확도로 예측할 수 있는 수단이 존재하는 상황에서 기존의 순수 과학의 역할은 어떻게 될 것인가? 이러한 질문에 순수과학분야는 적절한 답을 찾아야 될 시점이라고 생각한다.

