# Region Check

Tek dosyalık sayfa: cihazın seçilen hedef ülkeden görünüp görünmediğini kontrol eder.

Kontroller: IP ülkesi, IP türü (datacenter mi), IPv6 sızıntısı, WebRTC sızıntısı, saat dilimi, cihaz saati, dil / bölge, ek tercih edilen diller.

## Kullanım

1. VPN'i aç, telefonda Safari'den sayfayı aç.
2. Hedef ülkeyi seç (veya linke `?c=GB`, `?c=US`, `?c=AU` … ekle).
3. Hepsi ✅ olana kadar düzelt.

## GitHub Pages ile yayınlama

Repo → Settings → Pages → Source: `main` branch, `/ (root)` → Save.
Sayfa `https://<kullanıcı-adı>.github.io/region-check/` adresinde açılır.

## Yerelde deneme

```bash
python3 -m http.server 8765
```
