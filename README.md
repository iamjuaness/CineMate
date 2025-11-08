# CineMate 🎬  
**Tu Experiencia Cinematográfica Móvil**

<div align="center">
  <img src="/public/portada.png" alt="Demo CineMate" width="700"/>
</div>

---

¡Bienvenido/a a **CineMate**!  
La plataforma web donde puedes descubrir la cartelera, comprar boletos y llevar registro de lo que ves…  
Construido como MVP con  Next.js.

---

## ✨ Características principales

- **Explora cartelera por ciudad**  
  Visualiza todas las funciones disponibles agrupadas por ubicación y horario.
  
  <img src="/public/cartelera.png" alt="Cartelera CineMate" width="600" />

- **Compra rápida de boletos**  

  <img src="/public/comprar_boleta.png" alt="Comprar entrada" width="600" />

- **Guarda tus películas favoritas y registra lo que ya viste**  

  <img src="/public/peliculas.png" alt="Mis películas CineMate" width="600" />

- **Perfil y preferencias personales**  
  Edita tu perfil y géneros favoritos.

  <img src="/public/perfil.png" alt="Perfil CineMate" width="500" />


---

## 🛠️ Tecnologías

- **Next.js** (App Router)
- **Supabase** (Auth, BDD, triggers, SQL seguro)
- **Tailwind CSS** (custom theme cinematográfico)
- **Radix / shadcn UI** (componentes accesibles y modernos)
- **Vercel v0 & Analytics**

---

## 🚀 ¿Cómo iniciar localmente?

1. **Clona el repositorio**
```bash
git clone https://github.com/tu_usuario/cinemate.git
cd cinemate
```

2. **Instala dependencias**
```bash
pnpm install
```


3. **Configura variables de entorno**
- Copia `.env.example` a `.env` y completa tus datos de Supabase y settings.

4. **Inicia el servidor**
```bash
pnpm rundev
```


5. Accede a [CineMate - Localhost](http://localhost:3000)

---

## 🎯 Estructura del Proyecto
```
/app
  /cartelera
  /comprar-boleto
  /mis-boletos
  /mis-peliculas
  /pelicula/[id]
  /perfil
  /recomendaciones
/components
  /ui
    select.tsx, badge.tsx, button.tsx, ...
  location-filter.tsx
  movie-grid.tsx
  movie-card.tsx
  showtimes-list.tsx
  nav-bar.tsx
/lib
  /supabase
    client.ts
    server.ts
/scripts
  001_create_tables.sql
  003_create_profile_trigger_v2.sql
  004_seed_data.sql

```

---

## 📝 Scripts útiles

- **SQL seed inicial**  
  - Tablas, políticas RLS, triggers y datos demo.
- **Triggers de perfiles y seguridad**  
  - Perfil y preferencias automáticos al sign up.

---

## 💡 Próximos pasos

- 🎟️ Reserva y selección avanzada de asientos
- 🍿 Membresías premium
- 🎬 APIs externas (TMDb, IMDb)
- 📱 PWA / App móvil nativa

---

<div align="center">
  <img src="/public/icon-dark-32x32.png" alt="CineMate logo" width="180"/>
</div>



