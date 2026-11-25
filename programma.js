const statoProgramma = document.querySelector("#programma-stato");
const grigliaEventi = document.querySelector("#event-grid");

function aggiungiTesto(genitore, tag, testo, classe) {
  const elemento = document.createElement(tag);
  elemento.textContent = testo;

  if (classe) {
    elemento.className = classe;
  }

  genitore.append(elemento);
  return elemento;
}

function creaScheda(evento, sedi) {
  const scheda = document.createElement("article");
  scheda.className = "event-card";

  const immagine = document.createElement("img");
  immagine.src = evento.immagine;
  immagine.alt = evento.immagine_alt;
  immagine.width = 900;
  immagine.height = 600;
  scheda.append(immagine);

  const corpo = document.createElement("div");
  corpo.className = "event-body";

  const [anno, mese, giorno] = evento.data.split("-").map(Number);
  const data = new Date(anno, mese - 1, giorno);
  const dataFormattata = new Intl.DateTimeFormat("it-IT", {
    weekday: "long",
    day: "numeric",
    month: "long"
  }).format(data);

  const meta = `${dataFormattata} · ${evento.orario} · ${evento.categoria}`;
  aggiungiTesto(corpo, "p", meta, "event-meta");
  aggiungiTesto(corpo, "h3", evento.titolo);
  aggiungiTesto(corpo, "p", evento.descrizione);

  const sede = sedi.find((elemento) => elemento.id === evento.sede_id);
  const nomeSede = sede ? sede.nome : "Sede da definire";
  const luogo = document.createElement("p");
  luogo.className = "event-place";

  const etichetta = document.createElement("strong");
  etichetta.textContent = "Sede: ";
  luogo.append(etichetta, nomeSede);
  corpo.append(luogo);

  scheda.append(corpo);
  return scheda;
}

async function caricaProgramma() {
  try {
    const [rispostaEventi, rispostaSedi] = await Promise.all([
      fetch("dati/eventi.json"),
      fetch("dati/sedi.json")
    ]);

    if (!rispostaEventi.ok || !rispostaSedi.ok) {
      throw new Error("Non è stato possibile caricare i file dei dati.");
    }

    const [eventi, sedi] = await Promise.all([
      rispostaEventi.json(),
      rispostaSedi.json()
    ]);

    if (eventi.length === 0) {
      statoProgramma.textContent = "Nessun evento in programma.";
      return;
    }

    eventi.forEach((evento) => {
      grigliaEventi.append(creaScheda(evento, sedi));
    });

    statoProgramma.textContent = "";
  } catch (errore) {
    statoProgramma.textContent =
      "Il programma non è disponibile al momento.";
  }
}

caricaProgramma();
