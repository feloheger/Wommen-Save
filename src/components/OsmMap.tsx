/**
 * Karte auf Basis von Leaflet + OpenStreetMap (in einer WebView) – kein API-Key, keine Kreditkarte.
 * Die Seite wird einmal geladen; Änderungen werden per injectJavaScript übertragen.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { WebView, type WebViewMessageEvent } from "react-native-webview";

import { Colors } from "@/theme";

export interface OsmMarker {
  id: string;
  latitude: number;
  longitude: number;
  color: string;
  title?: string;
  subtitle?: string;
}

export interface OsmMapProps {
  /** Wird nur neu zentriert, wenn sich `key` ändert. */
  center?: { latitude: number; longitude: number; zoom: number; key: number };
  user?: { latitude: number; longitude: number } | null;
  accuracyMeters?: number;
  markers?: OsmMarker[];
  line?: { latitude: number; longitude: number }[];
  onLongPress?: (p: { latitude: number; longitude: number }) => void;
  onMarkerPress?: (id: string) => void;
}

const HTML = `<!DOCTYPE html>
<html><head>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
<style>
  html,body,#map{height:100%;margin:0;background:#F5E4E6}
  .pin{width:26px;height:26px;border-radius:50%;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.35);}
  .me{width:16px;height:16px;border-radius:50%;background:#2F7DE1;border:3px solid #fff;box-shadow:0 0 0 2px rgba(47,125,225,.35);}
  .leaflet-control-attribution{font-size:9px}
</style>
</head><body><div id="map"></div>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
  var send = function(o){ window.ReactNativeWebView.postMessage(JSON.stringify(o)); };
  var map = L.map('map', {zoomControl:false}).setView([52.52,13.405], 12);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19, attribution: '&copy; OpenStreetMap-Mitwirkende'
  }).addTo(map);
  var layers = L.layerGroup().addTo(map);
  var lastKey = null;
  map.on('contextmenu', function(e){ send({type:'longpress', latitude:e.latlng.lat, longitude:e.latlng.lng}); });

  window.update = function(s){
    layers.clearLayers();
    if (s.user) {
      if (s.accuracy) L.circle([s.user.latitude, s.user.longitude], {radius:s.accuracy, color:'#8B3A62', weight:1, fillColor:'#8B3A62', fillOpacity:0.12}).addTo(layers);
      L.marker([s.user.latitude, s.user.longitude], {icon:L.divIcon({className:'', html:'<div class="me"></div>', iconSize:[16,16], iconAnchor:[8,8]}), interactive:false}).addTo(layers);
    }
    if (s.line && s.line.length > 1) {
      L.polyline(s.line.map(function(p){return [p.latitude,p.longitude];}), {color:'#8B3A62', weight:4}).addTo(layers);
    }
    (s.markers || []).forEach(function(m){
      var mk = L.marker([m.latitude, m.longitude], {icon:L.divIcon({className:'', html:'<div class="pin" style="background:'+m.color+'"></div>', iconSize:[26,26], iconAnchor:[13,13]})}).addTo(layers);
      var box = document.createElement('div');
      var t = document.createElement('b'); t.textContent = m.title || ''; box.appendChild(t);
      if (m.subtitle) { box.appendChild(document.createElement('br')); box.appendChild(document.createTextNode(m.subtitle)); }
      mk.bindPopup(box);
      mk.on('click', function(){ send({type:'marker', id:m.id}); });
    });
    if (s.center && s.center.key !== lastKey) {
      lastKey = s.center.key;
      map.setView([s.center.latitude, s.center.longitude], s.center.zoom);
    }
  };
  send({type:'ready'});
</script></body></html>`;

export const OsmMap: React.FC<OsmMapProps> = ({
  center,
  user,
  accuracyMeters,
  markers,
  line,
  onLongPress,
  onMarkerPress,
}) => {
  const ref = useRef<WebView>(null);
  const [ready, setReady] = useState(false);

  const state = useMemo(
    () => ({ center, user, accuracy: accuracyMeters, markers: markers ?? [], line: line ?? [] }),
    [center, user, accuracyMeters, markers, line],
  );

  useEffect(() => {
    if (!ready) return;
    ref.current?.injectJavaScript(`window.update(${JSON.stringify(state)}); true;`);
  }, [ready, state]);

  const onMessage = useCallback(
    (e: WebViewMessageEvent) => {
      try {
        const msg = JSON.parse(e.nativeEvent.data) as
          | { type: "ready" }
          | { type: "longpress"; latitude: number; longitude: number }
          | { type: "marker"; id: string };
        if (msg.type === "ready") setReady(true);
        else if (msg.type === "longpress")
          onLongPress?.({ latitude: msg.latitude, longitude: msg.longitude });
        else if (msg.type === "marker") onMarkerPress?.(msg.id);
      } catch {
        /* unbekannte Nachricht ignorieren */
      }
    },
    [onLongPress, onMarkerPress],
  );

  return (
    <View style={styles.flex}>
      <WebView
        ref={ref}
        style={styles.flex}
        originWhitelist={["*"]}
        source={{ html: HTML, baseUrl: "https://womensave.app" }}
        javaScriptEnabled
        domStorageEnabled
        onMessage={onMessage}
        setSupportMultipleWindows={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({ flex: { flex: 1, backgroundColor: Colors.bgDeep } });
