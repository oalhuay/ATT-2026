
export default function InteractiveMapEmbed() {
  const apiKey = "process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY" || console.log("No funciona la key, funciona publicamente");
  const centerLat = -34.6037;
  const centerLng = -58.3816;
  
  // URL de Google Maps embebida (iframe)
  const embedUrl = `https://www.google.com/maps/embed/v1/search?key=${apiKey}&q=lavadero+de+autos&center=${centerLat},${centerLng}&zoom=14`;

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-3">
          🗺️ Buscador de Lavaderos
        </h2>
        <p className="text-gray-600">
          Encuentra y reserva en lavaderos cercanos
        </p>
      </div>

      {/* Mapa embebido de Google */}
      <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200">
        <iframe
          width="100%"
          height="450"
          frameBorder="0"
          style={{ border: 0 }}
          src={embedUrl}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Mapa de lavaderos"
        >
        </iframe>
      </div>

      {/* Instrucciones */}
      <div className="mt-6 p-6 bg-blue-50 rounded-xl">
        <h3 className="font-bold text-blue-800 text-lg mb-3">💡 Cómo usar el mapa:</h3>
        <ol className="list-decimal list-inside space-y-2 text-blue-700">
          <li>Usa el mapa para buscar lavaderos en tu zona</li>
          <li>Haz clic en cualquier lavadero que aparezca</li>
          <li>Verás la dirección, teléfono y horarios</li>
          <li>Regresa aquí para reservar tu turno</li>
        </ol>
      </div>

      {/* Formulario de búsqueda alternativa */}
      <div className="mt-8 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
        <h3 className="font-bold text-gray-800 text-xl mb-4">🔍 ¿No encuentras lo que buscas?</h3>
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const ubicacion = formData.get('ubicacion');
            window.open(`https://www.google.com/maps/search/lavadero+de+autos+${encodeURIComponent(ubicacion)}`, '_blank');
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <input
            type="text"
            name="ubicacion"
            placeholder="Ej: Palermo, Buenos Aires"
            className="flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition whitespace-nowrap"
          >
            Buscar en Google Maps
          </button>
        </form>
        <p className="text-sm text-gray-500 mt-3">
          Te redirigiremos a Google Maps para una búsqueda más detallada
        </p>
      </div>
    </div>
  );
}