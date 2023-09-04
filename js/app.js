// Arreglo para el tablero
let board = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

// Constante para saber el turno
let turn = 0; // 0 = Usuario / 1 = PC

// Selecciona el elemento HTML con el ID "board" y lo almacena en la variable "boardContainer"
const boardContainer = document.querySelector("#board");
// Selecciona el elemento HTML con el ID "player" y lo almacena en la variable "playerDiv"
const playerDiv = document.querySelector("#player");

// Definición de una función llamada "renderBoard" que renderiza el tablero en HTML
function renderBoard() {
  // Recorre el array con .map
  const html = board.map((row) => {
    // Mapea cada celda en la fila actual y crea un botón para representarla
    const cells = row.map((cell) => {
      return `<button class="cell">${cell}</button>`;
    });
    // Une las celdas de la fila actual y crea una fila completa con ellas
    return `<div class="row">${cells.join("")}</div>`;
  });
  // Establece el contenido HTML del contenedor del tablero con las filas generadas
  boardContainer.innerHTML = html.join("");
}

// Llamada a la función que inicia el juego
startGame();

// Función para iniciar el juego
function startGame() {
  // Renderiza el tablero en la interfaz
  renderBoard();
  // Asigna el turno aleatoriamente: 0 para el jugador, 1 para la computadora
  turn = Math.random() <= 0.5 ? 0 : 1;
  // Renderiza el jugador actual en la interfaz
  renderCurrentPlayer();
  // Si es el turno del jugador
  if (turn === 0) {
    // El jugador realiza su jugada
    playerPlays();
  } else {
    // La computadora realiza su jugada
    PCPlays();
  }
}

// Función para renderizar el jugador actual en la interfaz
function renderCurrentPlayer() {
  // Actualiza el contenido del elemento con ID "player" según el turno actual
  playerDiv.textContent = `${
    turn === 0 ? "Turno del jugador" : "Turno del computador"
  }`;
}

//Función que permite al jugador hacer su jugada.
function playerPlays() {
  // Selecciona todos los  elementos con la clase "cell" (celdas del tablero)
  const cells = document.querySelectorAll(".cell");
  // Calcula la fila y la columna de la celda actual basandose en su
  cells.forEach((cell, i) => {
    const row = Math.floor(i / 3); // Obtiene el índice de la fila
    const column = i % 3; // Obtiene el índice de la columna

    if (board[row][column] === "") {
      cell.addEventListener("click", (e) => {
        // Si la celda está vacía
        board[row][column] = "O"; // Marca la celda como ocupada por el jugador
        cell.textContent = board[row][column]; // Actualiza la visualización en la interfaz
        // Cambia el turno al de la computadora
        turn = 1;
        // Verifica si alguien ha ganado o si el juego ha terminado en empate
        const won = checkIfWinner();
        // Si no hay un ganador todavía
        if (won === "none") {
          // Deja que la computadora juegue
          PCPlays();
          return;
        }

        // Si el juego ha terminado en empate
        if (won === "draw") {
          // Muestra el empate en la interfaz
          renderDraw();
          // Remueve el evento de clic para que el jugador no pueda hacer más jugadas
          cells.forEach((cell) => {
            cell.removeEventListener("click", this);
          });
          return;
        }
      });
    }
  });
}

// Función para renderizar un empate en la interfaz
function renderDraw() {
  playerDiv.textContent = "Empate"; // Muestra el mensaje de empate en el elemento HTML con ID "player"
}

// Función para verificar si un jugador puede ganar en el próximo movimiento
function checkIfCanWin() {
  // Crea una copia del tablero para realizar cálculos sin modificar el tablero original
  const arr = JSON.parse(JSON.stringify(board));
  
  // Convierte las celdas marcadas con "X", "O" o vacías en objetos con valor y coordenadas
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[i].length; j++) {
      if (arr[i][j] === "X") {
        arr[i][j] = { value: 1, i, j }; // Casilla ocupada por "X"
      } else if (arr[i][j] === "") {
        arr[i][j] = { value: 0, i, j }; // Casilla vacía
      } else if (arr[i][j] === "O") {
        arr[i][j] = { value: -2, i, j }; // Casilla ocupada por "O"
      }
    }
  }

  // Define todas las combinaciones posibles para ganar
  const p1 = arr[0][0]; // Esquina superior izquierda
  const p2 = arr[0][1]; // Borde superior
  const p3 = arr[0][2]; // Esquina superior derecha
  const p4 = arr[1][0]; // Borde izquierdo
  const p5 = arr[1][1]; // Centro
  const p6 = arr[1][2]; // Borde derecho
  const p7 = arr[2][0]; // Esquina inferior izquierda
  const p8 = arr[2][1]; // Borde inferior
  const p9 = arr[2][2]; // Esquina inferior derecha

  const s1 = [p1, p2, p3]; // Fila superior
  const s2 = [p4, p5, p6]; // Fila central
  const s3 = [p7, p8, p9]; // Fila inferior
  const s4 = [p1, p4, p7]; // Columna izquierda
  const s5 = [p2, p5, p8]; // Columna central
  const s6 = [p3, p6, p9]; // Columna derecha
  const s7 = [p1, p5, p9]; // Diagonal principal izquierda a derecha
  const s8 = [p3, p5, p7]; // Diagonal inversa izquierda a derecha

  // Filtra las combinaciones para encontrar las que puedan llevar a una victoria
  const res = [s1, s2, s3, s4, s5, s6, s7, s8].filter((line) => {
    // Comprueba si la suma de los valores en la línea es igual a 2 (Para hacer su jugada y poder ganar)
    // o igual a -4 (Para bloquear el movimiento del jugador y que no gane)
    return (
      line[0].value + line[1].value + line[2].value === 2 ||
      line[0].value + line[1].value + line[2].value === -4
    );
  });

  return res; // Retorna las combinaciones que pueden llevar a la victoria
}

function PCPlays() {
  renderCurrentPlayer(); // Actualiza el jugador actual en la interfaz
  setTimeout(() => {
    let played = false; // Variable para controlar si la computadora realizó una jugada
    const options = checkIfCanWin(); // Comprueba si la computadora puede ganar en el próximo movimiento

    // Si hay opciones de ganar disponibles
    if (options.length > 0) {
      const bestOption = options[0]; // Escoge la mejor opción de ganar
      for (let i = 0; i < bestOption.length; i++) {
        if (bestOption[i].value === 0) {
          const posi = bestOption[i].i;
          const posj = bestOption[i].j;
          board[posi][posj] = "X"; // Realiza la jugada
          played = true; // Marca como jugada realizada
          break; // Sale del bucle
        }
      }
    } else {
      // Si no hay opciones de ganar disponibles, realiza una jugada aleatoria
      for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
          if (board[i][j] === "" && !played) {
            board[i][j] = "X"; // Realiza la jugada
            played = true; // Marca como jugada realizada
          }
        }
      }
    }

    turn = 0; // Cambia el turno al jugador
    renderBoard(); // Actualiza el tablero en la interfaz
    renderCurrentPlayer(); // Actualiza el jugador actual en la interfaz
    
    const won = checkIfWinner(); // Comprueba si hay un ganador
    // Si no hay ganador, permite al jugador realizar su jugada
    if (won === "none") {
      playerPlays(); // Activa la función para que juegue el jugador
      return;
    }
    // Si el resultado es empate, muestra el mensaje de empate
    if (won === "draw") {
      renderDraw(); // Activa la función para saber si fue un empate
      return;
    }
  }, 1500); // Espera 1500 milisegundos antes de que la computadora realice su jugada
}

// Función para verificar si hay un ganador o empate en el juego
function checkIfWinner() {
  // Extrae los valores de las celdas en el tablero para cada posición
  const p1 = board[0][0];
  const p2 = board[0][1];
  const p3 = board[0][2];
  const p4 = board[1][0];
  const p5 = board[1][1];
  const p6 = board[1][2];
  const p7 = board[2][0];
  const p8 = board[2][1];
  const p9 = board[2][2];

  // Define patrones de victoria posibles en el tablero
  const winPatterns = [
    [p1, p2, p3], // Fila 1
    [p4, p5, p6], // Fila 2
    [p7, p8, p9], // Fila 3
    [p1, p4, p7], // Columna 1
    [p2, p5, p8], // Columna 2
    [p3, p6, p9], // Columna 3
    [p1, p5, p9], // Diagonal principal
    [p3, p5, p7], // Diagonal secundaria
  ];

  // Itera a través de los patrones de victoria para verificar si alguno se cumple
  for (const pattern of winPatterns) {
    // Verifica si todas las celdas en el patrón son "X" (computadora ganadora)
    if (pattern.every((cell) => cell === "X")) {
      playerDiv.textContent = "Gana el computador"; // Muestra mensaje de victoria
      return "computer"; // Retorna "computer" indicando que ganó la computadora
    }
    // Verifica si todas las celdas en el patrón son "O" (jugador ganador)
    else if (pattern.every((cell) => cell === "O")) {
      playerDiv.textContent = "Gana el jugador"; // Muestra mensaje de victoria
      return "player"; // Retorna "player" indicando que ganó el jugador
    }
  }

  // Si todas las celdas están llenas y no hay ganador, se trata de un empate
  if (board.flat().every((cell) => cell !== "")) {
    renderDraw(); // Llama a la función para mostrar mensaje de empate
    return "draw"; // Retorna "draw" indicando que es un empate
  }

  return "none"; // Si no hay ganador ni empate aún, retorna "none"
}

