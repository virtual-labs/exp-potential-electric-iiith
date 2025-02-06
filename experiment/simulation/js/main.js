
document.addEventListener("DOMContentLoaded", () => {
    const collapsibles = document.querySelectorAll(".v-collapsible");

    collapsibles.forEach((collapsible) => {
        collapsible.addEventListener("click", () => {
            const content = collapsible.nextElementSibling;
            collapsible.classList.toggle("is-active");

            if (content.style.maxHeight) {
                // Close the collapsible
                content.style.maxHeight = null;
            } else {
                // Open the collapsible
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });
});

    function generateSpaceChargeData(biasType) {
        const data = [];
        const numPoints = 200;
        const xMin = -2, xMax = 2;
        const dx = (xMax - xMin) / (numPoints - 1);
  
        let depletionWidth;
        if (biasType === 'unbiased') depletionWidth = 1.0;  
        if (biasType === 'forward') depletionWidth = 0.5;   
        if (biasType === 'reverse') depletionWidth = 1.5;   
  
        for (let i = 0; i < numPoints; i++) {
          const x = xMin + i * dx;
          let y = 0;
  
          if (x >= -depletionWidth && x < 0) {
            y = -1; // Negative charge in the p-side depletion region
          } else if (x >= 0 && x <= depletionWidth) {
            y = 1;  // Positive charge in the n-side depletion region
          }
  
          data.push({ x: x, y: y });
        }
        return data;
      }
  
      const unbiasedData = generateSpaceChargeData('unbiased');
      const forwardData = generateSpaceChargeData('forward');
      const reverseData = generateSpaceChargeData('reverse');
  
    const plot1 = document.getElementById('plot1').getContext('2d');
    new Chart(plot1, {
        type: "line",
        data: {
          datasets: [
            {
              label: "plot1",
              data: forwardData,
              borderColor: "rgba(40, 155, 0, 0.74)",
              borderWidth: 2,
              fill: false,
              pointRadius: 0,
            },
            {
                label: "plot2",
                data: unbiasedData,
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 2,
                fill: false,
                pointRadius: 0,
            },
            {
              label: "plot3",
              data: reverseData,
              borderColor: "rgba(209,0,78,0.5)",
              borderWidth: 2,
              fill: false,
              pointRadius: 0,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: {
              type: "linear",
              title: {
                display: true,
                text: "Position (x)",
              },
            },
            y: {
              title: {
                display: true,
                text: "Space Charge Density (ρ)",
              },
            },
          },
        },
      });
    
// Function to validate the inputs
function validateInputs() {
    const input1 = document.getElementById('plot-input1').value.trim();
    const input2 = document.getElementById('plot-input2').value.trim();
    const input3 = document.getElementById('plot-input3').value.trim();
    const resultMessage = document.getElementById('result-message');

    // Check if the inputs match the desired values
    if (input1 === 'b' && input2 === 'a' && input3 === 'c') {
        resultMessage.style.display = 'block';
        resultMessage.textContent = 'Correct';
        resultMessage.style.color = 'green';
    } else {
        resultMessage.style.display = 'block';
        resultMessage.textContent = 'Incorrect';
        resultMessage.style.color = 'red';
    }
}

// Add event listener to the submit button
document.getElementById('submit-btn').addEventListener('click', validateInputs);