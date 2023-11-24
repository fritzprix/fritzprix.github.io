---
layout: post
title: "The Wittgenstein's Language Game and AI"
date: 2023-01-26 18:22:46 +0900
image: /assets/img/Wittgenstein-Quote.png
excerpt: "Exploring the connections between Ludwig Wittgenstein's theory of language games and the challenges faced by Artificial Intelligence"
---
![witt_quote w:100](/assets/img/Wittgenstein-Quote.png)

Large Language Models (LLMs) have demonstrated exceptional performance in tasks that involve language-based intelligence, such as answering factual questions, generating coherent text, and extracting insightful information from limited data. However, despite their impressive capabilities, LLMs still face limitations in tasks that require a deep understanding of knowledge. This is where the analogy to ancient philosophers becomes relevant. These philosophers, such as Plato and Kant, also grappled with the limitations of language and knowledge, recognizing that language can only express a limited understanding of the world. In the same way, LLMs, despite their vast knowledge represented in their language models, may still have limitations in their ability to understand and apply that knowledge.

## Knowledge (Explicit vs. Implicit)

Language models, such as the one being used to generate this response, are highly proficient in understanding and processing explicit knowledge, which is knowledge that can be easily described and conveyed through language. This includes factual information, logical reasoning, and language-based tasks such as translation and summarization. However, one criticism of these models is that they may struggle with tasks that rely heavily on implicit knowledge. Implicit knowledge refers to knowledge that cannot be easily described or conveyed through language, such as common sense, emotional intelligence, and physical intuition.

## Multimodality for AI

![mm_ai](/assets/img/multimodal_ai.png)

Recent research has shown that providing these models with multimodal input, such as images and videos, can help them learn and improve their understanding of the world through their own sensory experience. In some sense, this could suggest that LLMs can potentially surpass human understanding, not only in explicit knowledge, but also in implicit knowledge. However, it is important to remember that this potential for improvement does not negate the fundamental limitation of implicit knowledge being a universal aspect of being human.


It is crucial to acknowledge that the criticism of LLMs struggling with implicit knowledge tasks is not entirely fair, as humans also struggle with understanding and utilizing implicit knowledge. This limitation is not unique to artificial intelligence, but rather, a fundamental aspect of being human. While LLMs can improve in this area, it is important to recognize that this limitation is not an indicator of inferiority, but rather, a fundamental aspect of being human.

Wittgenstein's view on knowledge and language is particularly relevant to the limitations of LLMs in understanding implicit knowledge. Wittgenstein argued that our understanding of the world is largely determined by the language we use to describe and understand it. He famously stated that "The limits of my language mean the limits of my world," which suggests that our ability to understand and express knowledge is limited by the language we use to convey it. This is especially true when it comes to implicit knowledge, which is often difficult to express through language.

Wittgenstein's view implies that by expanding our language, we can expand our understanding of the world. However, Wittgenstein also believed that the meaning of words is not derived from their definition but from their use in a language-game. He argued that words have meaning only in the context of their use in a language-game. Therefore, providing a LLM with multimodal input, such as images and videos, will not necessarily make it understand the world better if it doesn't know how to use that data in its "language-game" or in its specific task. It's important to note that Wittgenstein's view on language and knowledge is not only about expanding the language but also about the right use of it.

![AI](https://globaltechnologyupdate.com/wp-content/uploads/2020/10/GPT-3-The-Most-Powerful-AI-Language-Model-Ever-Built-1024x683.jpg)

## Language-Game for AI

> Language-game is an important concept in understanding the limitations of artificial intelligence in understanding implicit knowledge. Implicit knowledge, such as common sense, emotional intelligence, and physical intuition, is difficult to express through language. Wittgenstein's view on knowledge and language states that the limits of language mean the limits of our understanding of the world. Therefore, expanding the language used by AI through multimodal input, such as images and videos, can help improve its understanding of implicit knowledge. However, it is also important to consider the use of language in the specific context of a task, known as the language-game, in order to fully utilize the expanded language and improve AI's understanding of implicit knowledge.

### MPT (Multitask Prompt Tuning)

One way to expand the language and understanding of an LLM is through Multitask Prompt Tuning (MPT). MPT is a technique that learns a single transferable prompt by decomposing and distilling knowledge from multiple sources. It can be used for parameter-efficient transfer learning in natural language processing tasks such as extractive question answering. MPT can be comparable to fine-tuning across multiple tasks, but it may perform poorly compared to fine-tuning on some hard sequence labeling tasks. Fine-tuning can approximate any conditional a prompt can achieve, but there are multiple ways a model could interpret the implied conditions.

### Promptless Fine-Tuning

Promptless Fine-tuning is another multi-prompt learning strategy that does not require pre-specified weights based on prompt performance. This approach aims to learn a general representation across tasks, rather than a specific prompt representation. Multitask fine tuning is a parameter-efficient method of fine-tuning language models that involves introducing adapter modules between the layers of a pretrained model. This can be used to train on an intermediate task before training on the target task (STILTs), or to train multiple tasks simultaneously (MTL). Multitask prompt tuning enables parameter-efficient transfer learning and has been shown to outperform state-of-the-art methods, including full finetuning baselines.

### Smoothing Multi-stage fine-tuning

Smoothing multi-stage fine-tuning in multi-task NLP applications is also a recent trend, which involves adjusting the training schedule in a multi-task setting with a shared representation among tasks. This approach allows the model to learn a more general representation of the tasks and avoid overfitting to specific prompts.

## Conclusion

while LLMs may struggle with understanding implicit knowledge, there are techniques and strategies that can be used to expand their language and understanding of the world. Multitask Prompt Tuning, Promptless Fine-tuning, Multitask fine tuning and smoothing multi-stage fine-tuning are some of the techniques that can be used to improve the performance of LLMs in understanding and utilizing implicit knowledge. However, it is important to note that these limitations are not unique to artificial intelligence, but rather, a fundamental aspect of being human. As such, it is crucial to acknowledge that the criticisms of LLMs struggling with implicit knowledge tasks are not entirely fair.

**Note: This article is generated by OpenAI's GPT-3, please take this as a reference only and not a substitute for professional knowledge.**


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
