const paises = document.querySelectorAll("#map-svg path");

const card = document.getElementById("info-pais");
const nombrePaisElem = document.getElementById("nombre-pais");
const capitalElem = document.getElementById("capital");
const poblacionElem = document.getElementById("poblacion");
const continentElem = document.getElementById("continent");
const monedaElem = document.getElementById("moneda");
const idiomasElem = document.getElementById("idiomas");
const fronterasElem = document.getElementById("fronteras");
const banderaElem = document.getElementById("bandera");

const cerrarBtn = document.getElementById("cerrar");

paises.forEach((pais) => {
	pais.addEventListener("click", () => {
		const nombrePais = pais.getAttribute("name");
		obtenerDatosPais(nombrePais);
	});
});

async function obtenerDatosPais(nombrePais) {
	try {
		const response = await fetch(`https://restcountries.com/v3.1/name/${nombrePais}?fullText=true`);
		const data = await response.json();
        const info = data[0];

        console.log(info);

        nombrePaisElem.textContent = info.name.common;
        capitalElem.innerHTML = '<strong>Capital: </strong>'+ (info.capital?.[0] || 'N/A');
        poblacionElem.innerHTML = '<strong>Población: </strong>'+ info.population.toLocaleString();
        continentElem.innerHTML = '<strong>Continente: </strong>'+ (info.continents[0] || "N/A");

        const monedas = info.currencies ? Object.values(info.currencies).map(m => `${m.name} (${m.symbol})`).join(", ") : "N/A";
        monedaElem.innerHTML = "<strong>Moneda: </strong>" + monedas;

        const idiomas = info.languages ? Object.values(info.languages).join(", ") : "N/A";
        idiomasElem.innerHTML = "<strong>Idiomas: </strong>" + idiomas;

        fronterasElem.innerHTML = "<strong>Fronteras: </strong>" + (info.borders?.join(", ") || "Ninguna");
        banderaElem.src = info.flags.svg;
        banderaElem.alt = `Bandera de ${info.name.common}`;

        card.classList.remove("hidden");
        anime({
            targets: card,
            scale: [0.8, 1],
            opacity: [0, 1],
            duration: 300,
            easing: 'easeOutQuad'
        });

	} catch (error) {
		console.error("Error al obtener datos del pais: ", error);
	}
}

cerrarBtn.addEventListener("click", () => {
  anime({
    targets: card,
    scale: [1, 0.8],
    opacity: [1, 0],
    duration: 300,
    easing: 'easeOutQuad',
    complete: () => {
      card.classList.add("hidden");
    }
  });
});

paises.forEach((pais) => {
	pais.addEventListener("mouseenter", () => {
		paises.forEach((p) => p.classList.remove("activo")); // limpieza

		if (pais !== pais.parentNode.lastElementChild) {
			// evita mover al pedo el elemento para arriba
			pais.parentNode.appendChild(pais);
		}

		pais.classList.add("activo");
	});

	pais.addEventListener("mouseleave", () => {
		pais.classList.remove("activo");
	});
});

// mapa manejable - libreria svg-pan-zoom
var panZoomMap = svgPanZoom("#map-svg", {
	zoomEnabled: true,
	controlIconsEnabled: true,
	fit: true,
	center: true,
	minZoom: 0.8,
	maxZoom: 10,
	mouseWheelZoomEnabled: true,

	beforePan: function (oldPan, newPan) {
		// funcion para bloquear el arrastre
		var stopHorizontal = false,
			stopVertical = false,
			gutterWidth = 100,
			gutterHeight = 100,
			sizes = this.getSizes(),
			leftLimit = -(sizes.viewBox.width * sizes.realZoom - gutterWidth),
			rightLimit = sizes.width - gutterWidth,
			topLimit = -(sizes.viewBox.height * sizes.realZoom - gutterHeight),
			bottomLimit = sizes.height - gutterHeight;

		var customPan = {};
		customPan.x = Math.max(leftLimit, Math.min(rightLimit, newPan.x));
		customPan.y = Math.max(topLimit, Math.min(bottomLimit, newPan.y));

		return customPan;
	},
});
