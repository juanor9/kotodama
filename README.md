# Kotodama

**Kotodama** es un proyecto enfocado en el desarrollo de un juego web interactivo que gira en torno a espíritus y mecánicas de invocación. El juego utiliza tecnologías modernas como **React** y **TypeScript** para crear una experiencia inmersiva con un enfoque en componentes modulares y personalización visual mediante **SASS**.

## Características principales

### Tecnologías utilizadas:
- **React con TypeScript**: La estructura del proyecto se basa en React y está escrita en TypeScript, lo que proporciona tipado estático para mejorar la mantenibilidad y robustez del código.
- **Gestión de estilos con SASS**: El proyecto utiliza SASS (Syntactically Awesome Stylesheets) para crear estilos modulares y reutilizables, lo que facilita la personalización visual y la consistencia del diseño.
- **Firebase**: Se integra con Firebase para gestionar la autenticación de usuarios, la base de datos en tiempo real y otros servicios backend.

### Estructura del proyecto

- **Frontend**: El frontend está completamente desarrollado en React y TypeScript, asegurando una arquitectura bien organizada y fácil de mantener.
- **Componentes de UI**: El directorio `components/` contiene componentes reutilizables como:
  - `BattleArea`: Interfaz visual para gestionar las batallas entre espíritus.
  - `SummoningCircle`: Animaciones y lógica de la invocación de espíritus.
  - `CharacterCard`: Representaciones visuales de los espíritus, mostrando su rareza, habilidades y estadísticas.
  
- **Recursos gráficos**: En el directorio `assets/` se encuentran los sprites, fondos y otros elementos gráficos usados para representar los espíritus y otros elementos visuales del juego.

- **Servicios**: El proyecto incluye varios servicios como:
  - `firebase.ts`: Para la integración de autenticación y servicios en la nube de Firebase.
  - `userService.ts`: Gestión de la información y progresión de los jugadores dentro del juego.

- **Estilos**: Todos los estilos se gestionan en el directorio `styles/` utilizando SASS para asegurar una organización clara y mantener una estructura escalable para el diseño visual.

- **Lógica de invocación**: El archivo `summonLogic.ts` contiene la lógica principal relacionada con la mecánica de invocación de espíritus, gestionando probabilidades y parámetros de rareza.

### Configuración

- **Configuración del entorno de desarrollo**: 
  - `eslint`: Reglas de estilo y calidad del código para asegurar consistencia.
  - `vite`: Sistema de construcción rápida del proyecto para optimizar la velocidad de desarrollo.
  - `postcss`: Herramienta para procesar CSS y asegurar compatibilidad con múltiples navegadores.

## Contribución

Este proyecto está diseñado para ser modular y escalable, lo que facilita futuras expansiones en cuanto a lógica de juego y nuevos componentes visuales. Si deseas contribuir, asegúrate de seguir las pautas de estilo y estándares establecidos por **ESLint** y las guías del equipo.


