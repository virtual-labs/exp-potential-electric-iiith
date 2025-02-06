document.addEventListener("DOMContentLoaded", () => {
    const collapsibles = document.querySelectorAll(".v-collapsible");

    collapsibles.forEach((collapsible) => {
        collapsible.addEventListener("click", () => {
            const content = collapsible.nextElementSibling;
            collapsible.classList.toggle("is-active");
            content.style.maxHeight = content.style.maxHeight ? null : content.scrollHeight + "px";
        });
    });
});

const rightItems = document.querySelectorAll('.right-column li');
const svg = document.getElementById('lines');
let selectedLeft = null;
let selectedRight = null;
const matches = new Map();

function generateSpaceChargeData(type) {
    const data = [];
    const numPoints = 200;
    const xMin = -2, xMax = 2;
    const dx = (xMax - xMin) / (numPoints - 1);

    for (let i = 0; i < numPoints; i++) {
        const x = xMin + i * dx;
        let y = 0;

        if (type === 'unbiased') {
            if (x >= -1 && x < 0) y = -1;
            else if (x >= 0 && x <= 1) y = 1;
        } else if (type === 'linearly-graded') {
            if (x >= -1 && x <= 1) {
                // Linear ramp: at x = -1, y = 0; at x = 0, y = -1.
                y = x ;
              }
        } else if (type === 'hyperabrupt') {
            if (x >= -0.5 && x < 0) {
                // Normalize an exponential so that at x = -0.5, y ~ 0 and at x = 0, y = -1.
                y = - (Math.exp((x + 0.5) / 0.1) - 1) / (Math.exp(0.5 / 0.1) - 1);
              } else if (x >= 0 && x <= 0.5) {
                // Mirror for the n-side.
                y = (Math.exp((0.5 - x) / 0.1) - 1) / (Math.exp(0.5 / 0.1) - 1);
              }
        }

        data.push({ x: x, y: y });
    }
    return data;
}

function createPlot(canvasId, label, type, color) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [
                {
                    label: canvasId,
                    data: generateSpaceChargeData(type),
                    borderColor: color,
                    borderWidth: 2,
                    fill: false,
                    pointRadius: 0,
                }
            ]
        },
        options: {
            responsive: false,
            scales: {
                x: {
                    type: "linear",
                    title: { display: true, text: "Position (x)" },
                },
                y: {
                    title: { display: true, text: "Space Charge Density (ρ)" },
                }
            }
        }
    });
}

createPlot('plot1', 'Unbiased PN Junction', 'unbiased', 'blue');
createPlot('plot2', 'Linearly Graded PN Junction', 'linearly-graded', 'green');
createPlot('plot3', 'Hyperabrupt PN Junction', 'hyperabrupt', 'red');

document.getElementById('plot1').addEventListener('click', () => selectLeft('1'));
document.getElementById('plot2').addEventListener('click', () => selectLeft('2'));
document.getElementById('plot3').addEventListener('click', () => selectLeft('3'));


rightItems.forEach(item => {
  item.addEventListener('click', () => {
    clearSelections('right');
    item.classList.add('selected');
    selectedRight = item;
    checkMatch();
  });
});

function selectLeft(id) {
  clearSelections('left');
  selectedLeft = id;
  document.getElementById(`plot${id}`).style.borderColor = '#4caf50';
}

function clearSelections(column) {
  if (column === 'left') {
    document.querySelectorAll('canvas').forEach(plot => (plot.style.borderColor = '#ddd'));
  } else {
    rightItems.forEach(item => item.classList.remove('selected'));
  }
}

function checkMatch() {
  if (selectedLeft && selectedRight) {
    const leftId = selectedLeft;
    const rightId = selectedRight.dataset.id;

    matches.set(leftId, rightId);

    drawLine(document.getElementById(`plot${leftId}`), selectedRight);

    document.getElementById(`plot${leftId}`).style.borderColor = '#aaa';
    selectedRight.classList.add('matched');

    selectedLeft = null;
    selectedRight = null;
  }
}

function drawLine(leftPlot, rightItem) {
  const leftRect = leftPlot.getBoundingClientRect();
  const rightRect = rightItem.getBoundingClientRect();
  const containerRect = svg.getBoundingClientRect();

  const x1 = leftRect.right - containerRect.left;
  const y1 = leftRect.top + leftRect.height / 2 - containerRect.top;
  const x2 = rightRect.left - containerRect.left;
  const y2 = rightRect.top + rightRect.height / 2 - containerRect.top;

  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.setAttribute('x1', x1);
  line.setAttribute('y1', y1);
  line.setAttribute('x2', x2);
  line.setAttribute('y2', y2);
  line.setAttribute('stroke', '#4caf50');
  line.setAttribute('stroke-width', '2');

  svg.appendChild(line);
}

document.getElementById('submit').addEventListener('click', () => {
  const correctAnswers = { 1: '1', 2: '2', 3:'3' }; // Correct mappings
  let score = 0;

  for (const [key, value] of matches) {
    if (correctAnswers[key] === value) {
      score++;
    }
  }

  document.getElementById('result').innerText = `You got ${score} out of ${Object.keys(correctAnswers).length} correct!`;
});