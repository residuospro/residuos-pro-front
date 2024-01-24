import { ICollectionData } from "./interfaces"

export const generateHtmlCollections = (
	collection: Partial<ICollectionData>
): HTMLDivElement => {
	console.log("cooo", collection)

	const html = `
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <style>
      .title {
        color: #fff;
        font-weight: bold;
        margin-bottom: 2rem;
        font-size: 2rem;
      }

      .container {
        width: 60%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 1em 1em;
      }

      .orderContainer {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        padding: 0.5rem 1rem 2rem 1rem;
      }

      main {
        border: 2px solid #9d9797;
        border-radius: 5px;
        width: 100%;
      }

      .orderContainer > * {
        --tw-space-y-reverse: 0;
        margin-top: calc(0.5rem * (1 - var(--tw-space-y-reverse)));
        margin-bottom: calc(0.5rem * var(--tw-space-y-reverse));
      }

      .orderNumberContainer {
        border: 2px solid #9d9797;
        border-radius: 5px;
        width: 15rem;
        height: 4rem;
        padding: 0 1em;
        display: flex;
        flex-direction: column;
      }

      .TextAreaContainer {
        padding: 0 1em;
        display: flex;
        flex-direction: column;
        margin: -2rem 0 2rem 0;
      }

      .orderNumberTitle {
        font-size: 0.8rem;
        margin-bottom: 0.5rem;
        color: #9d9797;
      }

      .orderNumber {
        font-weight: bold;
      }

      .titleContainer {
        background: #77ab59;
        height: 5rem;
        display: flex;
        justify-content: center;
        align-items: center
      }

      .inputCollection {
        font-size: 1rem;
        font-weight: 700;
        border-radius: 0.375rem;
        border: 2px solid #9d9797;
        padding: 0 1rem;
        color: #9d9797;
        background: #fff;
        height: 2.5rem;
      }

      .textArea {
        width: 100%;
        height: 6rem;
      }

      html,
      body {
        padding: 0;
        margin: 0;
        font-size: 16px;
        font-family: "Lato", sans-serif;
        height: 100vh;
      }

      * {
        box-sizing: border-box;
      }
    </style>
  </head>

  <body>
    <div class="container">
      <main>
        <div class="titleContainer">
          <h1 class="title">Pedido de coleta</h1>
        </div>

        <div class="orderContainer">
          <div>
            <p class="orderNumberTitle">Número do pedido:</p>

            <input class="inputCollection" value="${collection.orderNumber}" />
          </div>

          <div>
            <p class="orderNumberTitle">Data:</p>

            <input class="inputCollection" value="${collection.date}" />
          </div>

          <div>
            <p class="orderNumberTitle">Resíduo:</p>

            <input class="inputCollection" value="${collection.sedimentName}" />
          </div>

          <div>
            <p class="orderNumberTitle">Classificação:</p>

            <input class="inputCollection" value="${collection.classification}"/>
          </div>

          <div>
            <p class="orderNumberTitle">Risco Associado:</p>

            <input class="inputCollection" value="${collection.risk}"/>
          </div>

          <div>
            <p class="orderNumberTitle">Estado:</p>

            <input class="inputCollection" value="${collection.state}"/>
          </div>

          <div>
            <p class="orderNumberTitle">Acondicionamento:</p>

            <input class="inputCollection" value="${collection.packaging}"/>
          </div>

          <div>
            <p class="orderNumberTitle">Quantidade:</p>

            <input class="inputCollection" value="${collection.amount}"/>
          </div>

          <div>
            <p class="orderNumberTitle">Unidade de medida:</p>

            <input class="inputCollection" value="${collection.measure}"/>
          </div>
        </div>

        <div class="TextAreaContainer">
          <p class="orderNumberTitle">Observação:</p>

          <textarea class="inputCollection textArea">${collection.observation}</textarea>
        </div>
      </main>
    </div>
  </body>
</html>
`

	const content = document.createElement("div")
	content.innerHTML = html
	document.body.appendChild(content)

	return content
}
