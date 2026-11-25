const statoMeteo = document.querySelector("#stato-meteo");

async function caricaMeteo() {
  const indirizzo =
    "https://api.open-meteo.com/v1/forecast" +
    "?latitude=45.0703&longitude=7.6869" +
    "&current=temperature_2m,wind_speed_10m" +
    "&timezone=Europe%2FRome";

  try {
    const risposta = await fetch(indirizzo);

    if (!risposta.ok) {
      throw new Error("Risposta meteo non valida.");
    }

    const dati = await risposta.json();
    const corrente = dati.current;

    if (
      !corrente ||
      corrente.temperature_2m === undefined ||
      corrente.wind_speed_10m === undefined ||
      !corrente.time
    ) {
      throw new Error("Dati meteo incompleti.");
    }

   statoMeteo.innerHTML =
  `<strong>Temperatura:</strong> ${corrente.temperature_2m} °C<br>` +
  `<strong>Vento:</strong> ${corrente.wind_speed_10m} km/h<br>` +
  `<strong>Ora del dato:</strong> ${corrente.time.replace("T", " ")}`;
      `Temperatura: ${corrente.temperature_2m} °C · ` +
      `Vento: ${corrente.wind_speed_10m} km/h · ` +
      `Dato aggiornato: ${corrente.time.replace("T", " ")}`;
  } catch (errore) {
    statoMeteo.textContent = "Il meteo non è disponibile al momento.";
  }
}

caricaMeteo();
