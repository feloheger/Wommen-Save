/**
 * Erweitert app.json um Werte aus Umgebungsvariablen.
 * GOOGLE_MAPS_API_KEY wird für die Karte unter Android benötigt.
 */
module.exports = ({ config }) => ({
  ...config,
  android: {
    ...config.android,
    config: {
      ...(config.android && config.android.config),
      googleMaps: { apiKey: process.env.GOOGLE_MAPS_API_KEY ?? "" },
    },
  },
});
