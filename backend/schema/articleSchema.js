import { client } from "../services/weaviateClient.js";


await client.schema
  .classCreator()
  .withClass({
    class: "Article",
    description: "News article data",
    vectorizer: "none", // Since you are providing your own embeddings
    properties: [
      {
        name: "title",
        dataType: ["text"]
      },
      {
        name: "description",
        dataType: ["text"]
      },
      {
        name: "source",
        dataType: ["text"]
      }
    ]
  })
  .do();
