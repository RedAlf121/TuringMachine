# Simulador de cinta / Brainfuck

Simulador web en JavaScript de una cinta de celdas y un puntero, inspirado en Brainfuck y en una máquina de Turing. Incluye una representación de cinta (tape.js), una vista (tapeview.js) y un compilador/ejecutor (compile.js).

## Objetivo de portafolio
Explicar visualmente cómo se ejecuta un programa de bajo nivel: estado de la cinta, posición del puntero e instrucciones paso a paso.

## Alcance acordado
- Unificar la interfaz con el tema oscuro del Playground.
- Permitir pegar/escribir un programa y ejecutarlo.
- Animar la cinta y el puntero paso a paso.
- Añadir controles de ejecución: iniciar, pausar, reiniciar, paso individual y velocidad ajustable.
- Mantener el comportamiento actual y validar entradas/programas inválidos.
- La máquina de Turing clásica con tabla de estados es opcional y solo se aborda después del alcance principal.

## Criterios de aceptación
Un visitante puede cargar un programa corto, controlar su ejecución y entender el cambio de cada celda y del puntero. La interfaz debe explicar el estado actual sin requerir conocer el código fuente.

## Desarrollo pendiente — eliminar esta sección al finalizar
- [ ] Ejecutar y documentar el comportamiento actual.
- [ ] Revisar el compilador y definir la semántica admitida.
- [ ] Implementar el diseño visual compartido.
- [ ] Añadir editor de programa, controles y velocidad.
- [ ] Animar y hacer accesible la visualización de la cinta y el puntero.
- [ ] Probar programas válidos, vacíos e inválidos, además de reinicio y pausa.
- [ ] Añadir capturas/GIF, instrucciones de uso y una explicación breve del modelo.

## Nota para agentes
Hay cambios locales sin confirmar en este repositorio. Inspecciónalos antes de editar; no los sobrescribas ni uses comandos destructivos. Al completar el proyecto, elimina únicamente la sección temporal **Desarrollo pendiente**.
