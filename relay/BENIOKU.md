# Learnb aracı sunucusu

Bu küçük sunucu, Learnb kullanıcılarının hiçbir şey kurmadan Mia ile çalışabilmesini sağlar. Uygulama sahibinin API anahtarı yalnızca Cloudflare'in güvenli kasasında saklanır; kullanıcıların cihazına veya GitHub'a hiç ulaşmaz. Bütün kullanıcılar sahibin Google ücretsiz kullanım sınırını paylaşır; sınır dolarsa kullanıcılar ertesi gün sınır sıfırlanana kadar bekler. Kullanıcıların kendi anahtarını girme seçeneği yoktur.

## Güvenlik

- Yalnızca Learnb'nin adresi (`emreyaman1.github.io`) ve geliştirme sırasında `localhost` / `127.0.0.1` üzerinden gelen isteklere cevap verir.
- Yalnızca Gemini Flash serisi modellere izin verir; görüntü, ses, gömme gibi modelleri engeller.
- Her cihaza dakikada en fazla 40 istek sınırı vardır.
- Tek seferde gönderilebilecek istek boyutu sınırlıdır (≈120 KB).
- Yapay zekanın üretebileceği yanıt uzunluğu en fazla 16 000 token ile sınırlandırılmıştır.

## Yayına alma

`relay` klasörünün içinde şu adımları izleyin:

1. Cloudflare hesabınıza giriş yapın:
   ```
   npx wrangler login
   ```
2. Worker'ı yayınlayın:
   ```
   npx wrangler deploy
   ```
3. Google API anahtarınızı gizli değişken olarak ekleyin:
   ```
   npx wrangler secret put GEMINI_KEY
   ```
   Komut çalışınca anahtarınızı yapıştırıp Enter'a basın.

Yayınlama sonunda ekrana gelen adres (örn. `https://learnb-relay.<adınız>.workers.dev`) uygulamanın `app.js` dosyasındaki `RELAY` sabitine yazılmalıdır.

## Anahtarı değiştirme

Anahtarı güncellemek için aynı komutu tekrar çalıştırmanız yeterlidir:
```
npx wrangler secret put GEMINI_KEY
```
