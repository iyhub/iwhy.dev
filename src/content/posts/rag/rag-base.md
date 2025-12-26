---
title: "Retrieval-Augmented Generation"
date: 2024-12-26
category: tech
tags: ["AI", "LLM", "RAG"]
description: "初识RAG并使用LlamaIndex实现一个简单的RAG系统"
---


## 什么是RAG？
RAG是一种结合了检索和生成技术的AI技术，它通过在大量文本数据中检索相关信息，并将其与生成模型相结合，以生成高质量的文本内容。RAG技术可以用于多种应用场景，如问答系统、对话机器人、内容生成等。

## RAG的出现是为了解决什么问题?

1. **LLM知识范围的有限性(时限性/领域特定性)**
    - 时限性:OpenAI的模型在2024年3月之前都是基于2024年之前的训练数据,无法回答该时间点之后的问题
    - 领域特定性:OpenAI的模型在2024年3月之前都是基于通用领域数据进行训练,无法回答特定领域的问题(比如企业内部问答,法律问答)
2. **LLM的输出结果可控性(避免出现回答幻觉,产生胡编乱造的回答)**
    - 回答幻觉:LLM在回答问题时，可能会产生一些不准确的答案，这些答案看起来像是正确的，但实际上是错误的。

## RAG的实现原理
- （1） 用户上传文档：用户上传包含知识的文档，支持 txt、pdf、docx 等格式，将文档转换为特定的格式
- （2） 文本切割：为了便于分析和处理，将上步骤中获得的长文本切割为小块（chunk）
- （3） 文本向量化：将切割的 chunk 通过 embedding 技术，转换为算法可以处理的向量，存入向量数据库
- （4） 用户输入问题内容向量化：用户提问后，同样将用户的问句向量化
- （5） 语义检索匹配：将用户的问句与向量数据库中的 chunk 匹配，匹配出与问句向量最相似的 top k 个
- （6） 提交 prompt 至 LLM：将匹配出的文本和问句，一起添加到配置好的 prompt 模板中，提交给 LLM
- （7） 生成回答：LLM 生成回答，返回给用户

## 从实现原理引出的问题
- 1. 步骤一中的文档上传，如何将文档转换为特定的格式？
- 2. 步骤二中的文本切割，如何将文本切割为小块？切的颗粒度怎么控制？
- 3. 步骤三中的文本向量化，如何将文本转换为向量？需要用到什么技术?
- 4. 步骤四中的用户输入问题内容向量化，如何将输入转换为向量？用什么技术?
- 5. 步骤五中的语义检索匹配，top k 如何确定？
- 6. 步骤六中的提交 prompt 至 LLM，如何将问句和匹配出的文本一起添加到 prompt 模板中？





## 开始构建一个RAG pipeline
### 加载数据(Loading Data (Ingestion))
**从此处我们开始研究 Llamaindex 的每个环节,Llamaindex 是一个成熟的开源LLM数据处理方案**
1. 使用 SimpleDirectoryReader 加载数据

SimpleDirectoryReader，它可以根据给定目录中的每个文件创建文档。
它内置于 LlamaIndex 中，可以读取各种格式，包括 Markdown、PDF、Word 文档、PowerPoint 幻灯片、图像、音频和视频。

```python
    from llama_index.core import SimpleDirectoryReader

    documents = SimpleDirectoryReader("../data").load_data()
    print("documents",documents)

    # 输出

    # documents [Document(id_='cdb7064c-8764-4aaf-b250-9c3ee0a7bc31', embedding=None, 
    #metadata={'file_path': '/Users/zy/work/LN/sourceCode/Python/LamaIndex/LamaIndex/dataloading/../data/paul_graham_essay.txt', 'file_name': 'paul_graham_essay.txt', 'file_type': 'text/plain', 'file_size': 36, 'creation_date': '2024-09-03', 'last_modified_date': '2024-09-03'}, 
    #excluded_embed_metadata_keys=['file_name', 'file_type', 'file_size', 'creation_date', 'last_modified_date', 'last_accessed_date'], #excluded_llm_metadata_keys=['file_name', 'file_type', 'file_size', 'creation_date', 'last_modified_date', 'last_accessed_date'], 
    #relationships={}, 

    #text="Hello Ollama,It's a good local LLM.\n", mimetype='text/plain', 

    #start_char_idx=None, end_char_idx=None, text_template='{metadata_str}\n\n{content}', metadata_template='{key}: {value}', metadata_seperator='\n')]

```
2. 从数据库中加载文档
    
```python
    import pymysql
    pymysql.install_as_MySQLdb()

    from llama_index.readers.database import DatabaseReader

    # 初始化 DatabaseReader，使用 MySQL 数据库连接详细信息
    reader = DatabaseReader(
        scheme="mysql",
        host="127.0.0.1",
        port="3306",
        user="root",           # MySQL 用户名
        password="123456",      # MySQL 密码
        dbname="employees"      # 数据库名称
    )

    # 使用查询从数据库加载数据
    documents = reader.load_data(
        query="SELECT * FROM employees LIMIT 10"  # SQL 查询
    )

    # 输出读取的结果
    for doc in documents:
        print(doc)
```

3. 创建新文档
    
```python
    from llama_index.core import Document

    doc = Document(text="text")
    print(doc)
```

### 转换数据 -- 文本切割
加载数据后，需要处理和转换数据，然后再将其放入存储系统。
这些转换包括**分块、提取元数据和嵌入每个块**。这是确保LLM能够检索和最佳使用数据所必需的。

1. 使用简单的文本分割器分割,使用chunk_size控制每个chunk的大小

```python
    from llama_index.core import SimpleDirectoryReader
    from llama_index.core.ingestion import IngestionPipeline
    from llama_index.core.node_parser import TokenTextSplitter

    documents = SimpleDirectoryReader("./data").load_data()

    pipeline = IngestionPipeline(
        transformations=[TokenTextSplitter(chunk_size=512)],
        vector_store=None,  # 可选，用于存储向量化的节点
    )

    nodes = pipeline.run(documents=documents)
    for node in nodes:
        print("node=====>",node.node_id)
        print(node.text)
```
> 输出结果:单个文件被切分为多个node

```text
node=====> 68add2da-08a4-4235-93e2-96bec13ec2f8
LangChain 框架介绍
为了方便理解后面的内容，这里先对 LangChain-Chatchat 框架和实现原理做一个简单的介绍。
由于本文非技术向梳理，详细介绍就不展开，感兴趣可参考：https://www.langchain.com.cn/...

node=====> ced158b1-2d0c-4c44-8c86-e81c5dfa958f
基于政策原文的回答是否准确
- 基于政策原文的回答是否全面
- 回答里是否生成了政策原文以外的内容
- 回答是否可靠，不同轮次的回答是否差异大
- 是否支持追问....
```

### 索引 & 嵌入(Index & Embedding)
#### 什么是索引
在 LlamaIndex 术语中， Index是由Document对象组成的数据结构，旨在支持LLM查询。您的索引旨在补充您的查询策略。
##### (Vector Embedding)AKA Embedding
> Embedding is a numerical representation of the semantics, or meaning of your text.

> 用数值表示的语义或含义,相似含义的两段文本具有相似的嵌入(Embedding),即使实际文本完全不同

这种数学关系支持语义搜索，用户提供查询术语，LlamaIndex 可以定位与查询术语含义相关的文本，而不是简单的关键字匹配。
这是检索增强生成的工作原理以及LLMs一般运作方式的重要组成部分。

嵌入有很多种类型，它们的效率、有效性和计算成本各不相同。默认情况下，LlamaIndex 使用text-embedding-ada-002 ，这是 OpenAI 使用的默认嵌入。如果您使用不同的LLMs您通常会希望使用不同的嵌入。

#### 1. 矢量存储索引嵌入文档
```python
    from llama_index.core import SimpleDirectoryReader, VectorStoreIndex
    from llama_index.core import SimpleDirectoryReader, VectorStoreIndex
    from llama_index.core.node_parser import SentenceSplitter
    from llama_index.embeddings.huggingface import HuggingFaceEmbedding
    from llama_index.core import Settings

    Settings.embed_model = HuggingFaceEmbedding(
        model_name="BAAI/bge-small-en-v1.5"
    )
    documents = SimpleDirectoryReader("../data").load_data()
    print("documents: ",documents)
    Settings.text_splitter = SentenceSplitter(chunk_size=1024, chunk_overlap=20)

    # per-index
    index = VectorStoreIndex.from_documents(
        documents,
        transformations=[SentenceSplitter(chunk_size=1024, chunk_overlap=20)],
    )

    print("===========> ",index)


```

#### 2. Top K 语义检索



### 1.向量存储索引(Vector Store Index)
向量存储索引是最常见的索引类型。向量存储索引获取您的文档并将它们分成节点。然后，它创建每个节点文本的vector embeddings ，准备好由LLM查询。




### 2.概要索引(Summary Index)


## 索引存储
### 1. 存储在文件系统(磁盘)
存储在文件系统中，需要指定一个目录，将索引的元数据和向量存储在磁盘上。
```python
    from llama_index.core import SimpleDirectoryReader, VectorStoreIndex
    from llama_index.core import SimpleDirectoryReader, VectorStoreIndex
    from llama_index.core.node_parser import SentenceSplitter
    from llama_index.embeddings.huggingface import HuggingFaceEmbedding
    from llama_index.core import Settings
    from llama_index.core import StorageContext, load_index_from_storage


    Settings.embed_model = HuggingFaceEmbedding(
        model_name="BAAI/bge-small-en-v1.5"
    )
    documents = SimpleDirectoryReader("../data").load_data()
    print("documents: ",documents)
    Settings.text_splitter = SentenceSplitter(chunk_size=1024, chunk_overlap=20)

    dir = '/Users/zy/work/LN/sourceCode/Python/LamaIndex/LamaIndex/store/persist-index'

    # per-index
    index = VectorStoreIndex.from_documents(
        documents,
        transformations=[SentenceSplitter(chunk_size=1024, chunk_overlap=20)],
    )
    index.storage_context.persist(persist_dir=dir)
```
从文件系统中加载索引
```python
    storage_context = StorageContext.from_defaults(persist_dir=dir)
    index = load_index_from_storage(storage_context)
```

### 2. 向量存储(Vector Store)
使用:Chroma 存贮索引
1. 安装Chroma
```bash
    pip install chromadb
```
2. 使用Chroma存贮索引
```python
    import chromadb
    from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
    from llama_index.vector_stores.chroma import ChromaVectorStore
    from llama_index.core import StorageContext
    from llama_index.core import Settings
    from llama_index.embeddings.huggingface import HuggingFaceEmbedding


    # load some documents
    documents = SimpleDirectoryReader("../data").load_data()

    # initialize client, setting path to save data
    db = chromadb.PersistentClient(path="./chroma_db")

    # create collection
    chroma_collection = db.get_or_create_collection("quickstart")

    # assign chroma as the vector_store to the context
    vector_store = ChromaVectorStore(chroma_collection=chroma_collection)
    storage_context = StorageContext.from_defaults(vector_store=vector_store)
    Settings.embed_model = HuggingFaceEmbedding(
        model_name="BAAI/bge-small-en-v1.5"
    )
    # create your index
    index = VectorStoreIndex.from_documents(
        documents, storage_context=storage_context
    )

    # create a query engine and query
    # query_engine = index.as_query_engine()
    # response = query_engine.query("What is the meaning of life?")
    # print(response)
    
```
使用index插入document/node
```python
from llama_index.core import VectorStoreIndex

index = VectorStoreIndex([])
for doc in documents:
    index.insert(doc)
```






## 查询(Query)
`!pip install chromadb llama_index.vector_stores.chroma llama_index.embeddings.huggingface llama_index.llms.gemini`

提供的data/data.txt
```
I'm 阿歪.
7年Java，独立开发者,精通Helloworld,掌握JavaSE基础知识，熟悉多线程与并发编程，拥有丰富的系统设计分析能⼒，熟悉常⽤的
设计模式。
深⼊理解JVM,熟悉常⽤GC算法，垃圾回收算法，具备实际的JVM调优经验。
熟悉Mybatis、Hibernate、Spring、SpringMVC、SpringBoot、SpringCloud等主流开源框架，阅读过
Spring相关源码。
熟练使⽤MySQL等主流数据库，对数据库优化有⼀定的理解和实际调优能⼒。
深⼊理解RocketMQ以及RabbitMQ，具备实际⽣产业务落地。
深⼊理解Redis相关技术，熟悉Redis集群、持久化等相关知识。
深⼊理解Zookeeper相关技术，理解Paxos算法，ZAB协议。
精通Kafka相关技术，深⼊理解ISR,OSR,AR,LW,HW,LEO,ACK原理。
熟悉常⽤的Linux系统的命令，熟悉Docker、Rancher容器管理技术。
熟练使⽤前端 HTML、JavaScript、Vue、React、NextJS、TailwindCss 等开发技术。
责任⼼强，上⼿能⼒快，有良好的团队合作意识，善于沟通，能承担⼀定的⼯作压⼒。
其他语⾔：具有实际使⽤Python数据爬取经验，GoLang个⼈⼩项⽬开发经验。
```

```python
    import chromadb
    from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
    from llama_index.vector_stores.chroma import ChromaVectorStore
    from llama_index.core import StorageContext
    from llama_index.core import Settings
    from llama_index.embeddings.huggingface import HuggingFaceEmbedding
    from llama_index.llms.gemini import Gemini
    from llama_index.core.llms import ChatMessage




    # load some documents
    documents = SimpleDirectoryReader("./data").load_data()

    # initialize client, setting path to save data
    db = chromadb.PersistentClient(path="./demo_01/chroma_db")

    # create collection
    chroma_collection = db.get_or_create_collection("demo_01")

    # assign chroma as the vector_store to the context
    vector_store = ChromaVectorStore(chroma_collection=chroma_collection)
    storage_context = StorageContext.from_defaults(vector_store=vector_store)
    Settings.embed_model = HuggingFaceEmbedding(
        model_name="BAAI/bge-small-en-v1.5"
    )
    # create your index
    index = VectorStoreIndex.from_documents(
        documents, storage_context=storage_context
    )

    from llama_index.llms.gemini import Gemini

    # resp = Gemini().complete("Write a poem about a magic backpack")
    # print(resp)

    Settings.llm=Gemini()

    # create a query engine and query
    query_engine = index.as_query_engine()
    response = query_engine.query("和我简单介绍一下阿歪.保持50个字以内")
    print(response)
    # 阿歪是一位经验丰富的Java开发者，精通各种技术，包括JavaSE、多线程、JVM、数据库、消息队列、容器技术等，并熟悉前端开发。 


```