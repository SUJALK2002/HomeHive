
  // Create map
  const map = L.map('map').setView([19.0760, 72.8777], 12); // Mumbai

  // Add OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  // Add marker
  L.marker([19.0760, 72.8777])
    .addTo(map)
    .bindPopup('Mumbai')
    .openPopup();
